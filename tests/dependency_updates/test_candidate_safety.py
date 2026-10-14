# FR// Copies isolées uniquement ; ne jamais exécuter les corps historiques mutateurs.
# EN// Isolated copies only; never execute mutating historical bodies.
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
HISTORY = "docs/history/candidate-generators-20261013"
RUST = ("rust-h2", "rust-warnings")
FILES = (
    "package.json", "pnpm-lock.yaml", "Cargo.toml", "Cargo.lock", "src-tauri/Cargo.toml",
    ".cargo/config.toml", "vendor/glib-0.18.5/src/variant_iter.rs",
    "vendor/glib-0.18.5/src/collections/ptr_slice.rs",
    ".bolt/config.json", ".bolt/prompt", ".bolt/mcp.json", ".cursor/settings.json",
    ".gitattributes", ".gitignore", "tauri.conf.json", "src-tauri/tauri.conf.json",
)

class CandidateSafetyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "project"
        self.root.mkdir()
        paths = list(FILES)
        paths += ["Scripts/candidate_safety.py", "Scripts/candidate-safety.cjs", "Scripts/candidate-generator-baselines.json"]
        paths += ["Scripts/prepare-" + p + "-candidate.py" for p in RUST]
        paths += [p.relative_to(ROOT).as_posix() for p in (ROOT / HISTORY).rglob("*") if p.is_file()]
        paths += [p.name for p in ROOT.glob("package-lock*.json")]
        for name in paths:
            source, target = ROOT / name, self.root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
        self.bin = Path(self.temp.name) / "bin"
        self.bin.mkdir()
        self.marker = Path(self.temp.name) / "unsafe-command-called"
        self.env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1", PATH=str(self.bin) + os.pathsep + os.environ["PATH"])
        self.pnpm("8.15.9")
        cargo = self.bin / ("cargo.cmd" if os.name == "nt" else "cargo")
        if os.name == "nt":
            cargo.write_text('@echo called > "' + str(self.marker) + '"\n@exit /b 91\n')
        else:
            cargo.write_text('#!/bin/sh\nprintf called > "' + str(self.marker) + '"\nexit 91\n')
            cargo.chmod(0o755)

    def pnpm(self, version):
        path = self.bin / ("pnpm.cmd" if os.name == "nt" else "pnpm")
        if os.name == "nt":
            path.write_text('@echo off\nif "%~1"=="--version" (echo ' + version + '\nexit /b 0)\necho called > "' + str(self.marker) + '"\nexit /b 91\n')
        else:
            path.write_text('#!/bin/sh\nif [ "$1" = "--version" ]; then printf "' + version + '\\n"; exit 0; fi\nprintf called > "' + str(self.marker) + '"\nexit 91\n')
            path.chmod(0o755)

    def snapshot(self):
        return {p.relative_to(self.root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
                for p in self.root.rglob("*") if p.is_file()}

    def run_guard(self, args, ok, message=None, cwd=None):
        before = self.snapshot()
        result = subprocess.run(args, cwd=cwd or self.root, env=self.env, capture_output=True, text=True, timeout=30)
        self.assertEqual(result.returncode == 0, ok, result.stdout + result.stderr)
        self.assertEqual(before, self.snapshot(), "A security check or rejected generator wrote files")
        self.assertFalse(self.marker.exists(), "A mutating tool command was invoked")
        if message:
            self.assertIn(message, result.stdout + result.stderr)
        return result

    def rust_baseline(self, profile):
        source = ROOT / "docs/history" / ("rust-h2-20261013" if profile == "rust-h2" else "rust-warnings-20261013")
        shutil.copyfile(ROOT / "docs/history/rust-warnings-20261013/Cargo.toml", self.root / "Cargo.toml")
        for name in ("Cargo.lock", "src-tauri/Cargo.toml"):
            shutil.copyfile(source / name, self.root / name)
        # FR// Retirer les copies de fixture seulement, jamais les données du vrai dépôt.
        # EN// Remove fixture copies only, never actual repository data.
        shutil.rmtree(self.root / "vendor")
        shutil.rmtree(self.root / ".cargo")

    def js_baseline(self):
        for name in ("package.json", "pnpm-lock.yaml"):
            shutil.copyfile(ROOT / "docs/history/js-security-20261013" / name, self.root / name)

    def node(self, mode, profile=None):
        return [shutil.which("node"), str(self.root / "Scripts/candidate-safety.cjs"), mode] + ([profile] if profile else [])

    def test_current_conservation_checkpoint_is_read_only_in_both_clients(self):
        self.run_guard([sys.executable, "Scripts/candidate_safety.py", "--check", "current-conservation"], True)
        self.run_guard(self.node("--check", "current-conservation"), True)

    def test_current_rust_generators_block_before_any_cargo_or_write(self):
        for profile in RUST:
            for mode in ([], ["--check"], ["--generate"]):
                with self.subTest(profile=profile, mode=mode):
                    self.run_guard([sys.executable, "Scripts/prepare-" + profile + "-candidate.py", *mode], False, "Incompatible state")

    def test_matching_rust_baseline_checks_do_not_generate(self):
        for profile in RUST:
            with self.subTest(profile=profile):
                self.rust_baseline(profile) if (self.root / "vendor").exists() else self.load_next_rust_baseline(profile)
                self.run_guard([sys.executable, "Scripts/prepare-" + profile + "-candidate.py", "--check"], True)
                self.run_guard([sys.executable, "Scripts/prepare-" + profile + "-candidate.py"], True)

    def load_next_rust_baseline(self, profile):
        source = ROOT / "docs/history" / ("rust-h2-20261013" if profile == "rust-h2" else "rust-warnings-20261013")
        for name in ("Cargo.lock", "src-tauri/Cargo.toml"):
            shutil.copyfile(source / name, self.root / name)

    def test_existing_glib_backport_or_output_blocks_legacy_extraction(self):
        self.rust_baseline("rust-warnings")
        path = self.root / "vendor/glib-0.18.5/src/collections/ptr_slice.rs"
        path.parent.mkdir(parents=True)
        shutil.copyfile(ROOT / "vendor/glib-0.18.5/src/collections/ptr_slice.rs", path)
        self.run_guard([sys.executable, "Scripts/prepare-rust-warnings-candidate.py", "--generate"], False, "already present")

    def test_existing_cargo_configuration_blocks_overwrite(self):
        self.rust_baseline("rust-warnings")
        path = self.root / ".cargo/config.toml"
        path.parent.mkdir()
        path.write_text('[alias]\nlocal-check = "check --locked"\n')
        self.run_guard([sys.executable, "Scripts/prepare-rust-warnings-candidate.py", "--generate"], False, "already present")

    def test_existing_http_test_blocks_h2_overwrite(self):
        self.rust_baseline("rust-h2")
        path = self.root / "src-tauri/tests/http_client.rs"
        path.parent.mkdir(parents=True)
        path.write_text('// FR// Test conservé.\n// EN// Retained test.\n')
        self.run_guard([sys.executable, "Scripts/prepare-rust-h2-candidate.py", "--generate"], False, "already present")

    def test_non_utf8_generation_is_refused_before_historical_body(self):
        self.rust_baseline("rust-h2")
        # FR// Simuler le défaut d'un ancien poste Windows, sans changer sa configuration.
        # EN// Simulate an older Windows default without changing machine configuration.
        code = "import locale,runpy,sys;sys.path.insert(0,'Scripts');locale.getpreferredencoding=lambda _:'cp1252';sys.argv=['prepare-rust-h2-candidate.py','--generate'];runpy.run_path('Scripts/prepare-rust-h2-candidate.py',run_name='__main__')"
        self.run_guard([sys.executable, "-c", code], False, "use Python -X utf8")

    def test_current_js_candidate_blocks_before_literal_manifest_replacement(self):
        self.run_guard(self.node("--generate", "js-security"), False, "Incompatible state")
        # FR// Exécuter aussi une écriture sentinelle derrière la vraie garde inline, sur la copie seulement.
        # EN// Also place a sentinel write behind the actual inline guard, on the copy only.
        code = "require('./Scripts/candidate-safety.cjs').requireCompatible('js-security'); require('node:fs').writeFileSync('package.json', 'unsafe');"
        self.run_guard([shutil.which("node"), "-e", code], False, "Incompatible state")

    def test_matching_js_check_and_pnpm_version_are_read_only(self):
        self.js_baseline()
        self.run_guard(self.node("--check", "js-security"), True)
        self.run_guard(self.node("--check-pnpm"), True)

    def test_pnpm_11_10_and_8_different_patch_are_refused(self):
        self.js_baseline()
        for version in ("11.25.0", "10.0.0", "8.15.8"):
            with self.subTest(version=version):
                self.pnpm(version)
                self.run_guard(self.node("--generate", "js-security"), False, "pnpm incompatible")
                self.run_guard(self.node("--check-pnpm"), False, "pnpm incompatible")

    def test_missing_pnpm_is_refused_without_install(self):
        self.js_baseline()
        self.env["PATH"] = str(self.bin / "absent")
        self.run_guard(self.node("--generate", "js-security"), False)

    def test_babel_root_or_optional_variant_loss_blocks_current_regeneration(self):
        for name in ("package.json", "pnpm-lock.yaml"):
            with self.subTest(name=name):
                path = self.root / name
                original = path.read_bytes()
                if name == "package.json":
                    data = json.loads(original)
                    del data["devDependencies"]["react-refresh"]
                    path.write_text(json.dumps(data))
                else:
                    path.write_text(original.decode().replace('/lightningcss-android-arm64@1.33.0:', '/missing-native-variant@1.33.0:'))
                self.run_guard(self.node("--generate", "lockfile-maintenance"), False, "Incompatible state")
                path.write_bytes(original)

    def test_each_glib_fix_h2_lock_and_options_are_protected(self):
        for name in ("vendor/glib-0.18.5/src/variant_iter.rs", "vendor/glib-0.18.5/src/collections/ptr_slice.rs", "Cargo.lock", "src-tauri/Cargo.toml"):
            with self.subTest(name=name):
                path = self.root / name
                original = path.read_bytes()
                path.write_bytes(original + b"\n")
                self.run_guard(self.node("--generate", "lockfile-maintenance"), False, "Incompatible state")
                path.write_bytes(original)

    def test_altered_legacy_manifest_or_archive_cannot_pass(self):
        self.js_baseline()
        path = self.root / HISTORY / ".github/workflows/js-security-maintenance.yml"
        path.write_bytes(path.read_bytes() + b"\n")
        self.run_guard(self.node("--generate", "js-security"), False, "Archived version changed")

    def test_wrong_working_directory_is_refused(self):
        self.run_guard(self.node("--generate", "js-security"), False, "repository root", cwd=self.root / "src-tauri")
        self.run_guard([sys.executable, str(self.root / "Scripts/prepare-rust-h2-candidate.py"), "--generate"], False, "repository root", cwd=self.root / "src-tauri")

    def test_crlf_compatible_text_checks_do_not_normalize_files(self):
        for name in FILES[:8]:
            path = self.root / name
            path.write_bytes(path.read_bytes().replace(b"\r\n", b"\n").replace(b"\n", b"\r\n"))
        self.run_guard([sys.executable, "Scripts/candidate_safety.py", "--check", "current-conservation"], True)
        self.run_guard(self.node("--check", "current-conservation"), True)

    def test_lockfile_check_accepts_only_matching_git_head_and_pnpm(self):
        hooks = Path(self.temp.name) / "empty-hooks"
        hooks.mkdir()
        # FR// Désactiver la maintenance Git asynchrone dans cette fixture seulement : elle crée/retire des verrous pendant les snapshots.
        # EN// Disable asynchronous Git maintenance in this fixture only: it creates/removes locks during snapshots.
        options = ["git", "-c", "maintenance.auto=false", "-c", "gc.auto=0", "-c", "core.hooksPath=" + str(hooks), "-c", "commit.gpgSign=false", "-c", "user.name=Candidate test", "-c", "user.email=candidate-test@example.invalid"]
        subprocess.run([*options, "-c", "init.templateDir=", "init", "--quiet"], cwd=self.root, env=self.env, check=True, capture_output=True)
        subprocess.run([*options, "add", "package.json"], cwd=self.root, env=self.env, check=True, capture_output=True)
        subprocess.run([*options, "commit", "--quiet", "--no-verify", "-m", "isolated fixture"], cwd=self.root, env=self.env, check=True, capture_output=True)
        self.run_guard(self.node("--check", "lockfile-maintenance"), True)
        path = self.root / "package.json"
        original = path.read_bytes()
        path.write_bytes(original + b"\n")
        subprocess.run([*options, "add", "package.json"], cwd=self.root, env=self.env, check=True, capture_output=True)
        subprocess.run([*options, "commit", "--quiet", "--no-verify", "-m", "different head"], cwd=self.root, env=self.env, check=True, capture_output=True)
        path.write_bytes(original)
        self.run_guard(self.node("--generate", "lockfile-maintenance"), False, "Manifest differs from HEAD")

    def test_symlink_manifest_is_refused(self):
        path = self.root / "package.json"
        target = self.root / "external-manifest.json"
        path.rename(target)
        try:
            path.symlink_to(target)
        except OSError:
            self.skipTest("Symlink creation unavailable")
        self.run_guard(self.node("--generate", "lockfile-maintenance"), False, "Symlink refused")

    def test_unknown_profiles_and_bypass_arguments_are_refused(self):
        self.run_guard(self.node("--generate", "unknown"), False, "Unknown profile")
        self.run_guard([sys.executable, "Scripts/prepare-rust-h2-candidate.py", "--force"], False, "Arguments refused")

    def test_workflow_gates_precede_mutating_commands_and_guards_repeat(self):
        for profile in RUST:
            text = (ROOT / (".github/workflows/" + profile + "-migration.yml")).read_text()
            self.assertLess(text.index("candidate_safety.py --check " + profile), text.index("cp docs/history/"))
            self.assertIn("prepare-" + profile + "-candidate.py --generate", text)
        text = (ROOT / ".github/workflows/js-security-maintenance.yml").read_text()
        self.assertLess(text.index("candidate-safety.cjs --check js-security"), text.index("pnpm install --frozen-lockfile"))
        self.assertLess(text.index("requireCompatible('js-security')"), text.index("fs.writeFileSync('package.json'"))
        text = (ROOT / ".github/workflows/lockfile-maintenance.yml").read_text()
        self.assertLess(text.index("candidate-safety.cjs --generate lockfile-maintenance"), text.index("pnpm add --save-dev"))
        self.assertLess(text.index("Conservation du candidat avant export"), text.index("echo LOCKFILE_CANDIDATE_BEGIN"))

    def test_archived_versions_and_rust_bodies_are_preserved_exactly(self):
        data = json.loads((ROOT / "Scripts/candidate-generator-baselines.json").read_text())
        self.assertEqual(len(data["archives"]), 6)
        for name, digest in data["archives"].items():
            self.assertEqual(hashlib.sha256((ROOT / name).read_bytes()).hexdigest(), digest)
        for rule in data["profiles"].values():
            for name, digest in rule.get("archives", {}).items():
                self.assertEqual(hashlib.sha256((ROOT / name).read_bytes()).hexdigest(), digest)
        for profile in RUST:
            name = "Scripts/prepare-" + profile + "-candidate.py"
            old = (ROOT / HISTORY / name).read_bytes().splitlines(keepends=True)
            new = (ROOT / name).read_bytes()
            prefix = b"".join(old[:2]) + ('# FR// Par défaut, contrôler seulement ; --generate exige la référence historique intacte.\n# EN// Check only by default; --generate requires an intact historical baseline.\nimport sys\nsys.dont_write_bytecode = True\nfrom candidate_safety import require_compatible\nrequire_compatible("' + profile + '")\n').encode()
            self.assertEqual(new, prefix + b"".join(old[2:]))

if __name__ == "__main__":
    unittest.main()
