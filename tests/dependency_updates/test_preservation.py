# FR// Scénarios de suppression réels, dont optionnels, archives et changements Actions.
# EN// Real removal scenarios, including optional dependencies, archives and Actions changes.
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

import yaml

SCRIPT = Path(__file__).resolve().parents[2] / "Scripts/check-dependency-update-preservation.py"
spec = importlib.util.spec_from_file_location("preservation", SCRIPT)
preservation = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preservation)

class PreservationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name) / "base"
        self.head = Path(self.temp.name) / "head"
        self.base.mkdir()
        self.write(self.base, "package.json", json.dumps({
            "packageManager": "pnpm@8.15.9",
            "dependencies": {"needed": "^1"},
            "devDependencies": {"apparently-unused": "^1"},
            "optionalDependencies": {"optional": "^1"},
            "peerDependencies": {"peer": "^1"},
            "peerDependenciesMeta": {"peer": {"optional": True}},
            "pnpm": {"patchedDependencies": {"needed@1.0.0": "patches/needed.patch"}},
        }))
        self.write(self.base, "pnpm-lock.yaml", yaml.safe_dump({
            "lockfileVersion": "6.0", "packages": {
                "/needed@1.0.0": {"optionalDependencies": {"optional": "1.0.0"},
                                 "peerDependenciesMeta": {"peer": {"optional": True}}},
                "/optional@1.0.0": {"optional": True},
                "/apparently-unused@1.0.0": {},
                "/peer@1.0.0": {},
            },
        }))
        self.write(self.base, "Cargo.toml",
                   '# FR// Variante historique\n# EN// Historical variant\n'
                   '[dependencies]\nused = "1"\n'
                   'historical = { version = "1", optional = true, default-features = false, features = ["old"] }\n'
                   '[target.\'cfg(unix)\'.dev-dependencies]\nplatform = "1"\n'
                   '[features]\ndefault = []\nlegacy = ["dep:historical"]\n')
        self.write(self.base, "Cargo.lock",
                   'version = 3\n[[package]]\nname = "used"\nversion = "1.0.0"\n'
                   '[[package]]\nname = "historical"\nversion = "1.0.0"\n')
        self.write(self.base, "package-lock.json", "historical intentionally unparsed lock\n")
        self.write(self.base, "docs/history/example.txt", "preserve exactly\n")
        self.write(self.base, "vendor/example.rs", "// intentional ghost source\n")
        self.write(self.base, "patches/needed.patch", "reference patch\n")
        self.write(self.base, ".github/workflows/auto-approve.yml", "jobs:\n  approve:\n    uses: owner/approval@v1\n")
        self.write(self.base, ".github/workflows/ci.yml", "jobs:\n  lint:\n    steps:\n      - uses: actions/checkout@v6\n      - run: echo check\n")
        shutil.copytree(self.base, self.head)

    def write(self, root, path, content):
        target = root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)

    def edit_json(self, edit):
        path = self.head / "package.json"
        data = json.loads(path.read_text())
        edit(data)
        path.write_text(json.dumps(data))

    def edit_lock(self, edit):
        path = self.head / "pnpm-lock.yaml"
        data = yaml.safe_load(path.read_text())
        edit(data)
        path.write_text(yaml.safe_dump(data))

    def errors(self, bot=False):
        return preservation.compare(self.base, self.head, bot)

    def test_version_updates_and_added_dependencies_pass(self):
        self.edit_json(lambda d: d["dependencies"].update(needed="^2", added="^1"))
        path = self.head / "Cargo.toml"
        path.write_text(path.read_text().replace('used = "1"', 'used = "2"'))
        self.edit_lock(lambda d: d["packages"].update({"/needed@2.0.0": d["packages"].pop("/needed@1.0.0")}))
        self.assertEqual(self.errors(bot=True), [])

    def test_each_js_section_retains_unused_and_optional_names(self):
        for section in preservation.JS_FIELDS:
            with self.subTest(section=section):
                source = (self.base / "package.json").read_text()
                (self.head / "package.json").write_text(source)
                self.edit_json(lambda d: d[section].clear())
                self.assertTrue(self.errors())

    def test_optional_peer_cannot_be_removed(self):
        self.edit_json(lambda d: d["peerDependenciesMeta"].clear())
        self.assertTrue(self.errors())

    def test_pnpm_optional_package_and_edges_are_retained(self):
        for change in ("package", "flag", "edge", "peer"):
            with self.subTest(change=change):
                (self.head / "pnpm-lock.yaml").write_bytes((self.base / "pnpm-lock.yaml").read_bytes())
                def edit(d):
                    packages = d["packages"]
                    if change == "package":
                        del packages["/apparently-unused@1.0.0"]
                    if change == "flag":
                        packages["/optional@1.0.0"]["optional"] = False
                    if change == "edge":
                        packages["/needed@1.0.0"]["optionalDependencies"] = {}
                    if change == "peer":
                        packages["/needed@1.0.0"]["peerDependenciesMeta"] = {}
                self.edit_lock(edit)
                self.assertTrue(self.errors())

    def test_cargo_optional_default_flags_features_and_target_retained(self):
        original = (self.base / "Cargo.toml").read_text()
        for replacement in (
                original.replace('historical = { version = "1", optional = true, default-features = false, features = ["old"] }\n', ""),
                original.replace("optional = true", "optional = false"),
                original.replace("default-features = false", "default-features = true"),
                original.replace('features = ["old"]', "features = []"),
                original.replace('platform = "1"', ""),
                original.replace('legacy = ["dep:historical"]', "legacy = []"),
                original.replace("default = []", 'default = ["legacy"]'),
                original.replace("# FR// Variante historique\n", "")):
            with self.subTest(replacement=replacement):
                (self.head / "Cargo.toml").write_text(replacement)
                self.assertTrue(self.errors())

    def test_cargo_lock_names_cannot_disappear(self):
        path = self.head / "Cargo.lock"
        path.write_text('version = 3\n[[package]]\nname = "used"\nversion = "2.0.0"\n')
        self.assertTrue(self.errors())

    def test_archives_and_legacy_locks_cannot_be_changed_or_deleted(self):
        for name in ("docs/history/example.txt", "package-lock.json"):
            with self.subTest(name=name):
                original = (self.head / name).read_bytes()
                (self.head / name).write_bytes(b"rewritten")
                self.assertTrue(self.errors())
                (self.head / name).unlink()
                self.assertTrue(self.errors())
                (self.head / name).write_bytes(original)

    def test_competing_manager_cannot_be_activated(self):
        for name in ("yarn.lock", "npm-shrinkwrap.json", "bun.lock", "package-lock.generated.json"):
            with self.subTest(name=name):
                self.write(self.head, name, "new lock")
                self.assertTrue(self.errors())
                (self.head / name).unlink()
        self.edit_json(lambda d: d.update(packageManager="npm@10"))
        self.assertTrue(self.errors())

    def test_actions_reference_upgrade_passes_but_step_removal_fails(self):
        path = self.head / ".github/workflows/ci.yml"
        path.write_text(path.read_text().replace("checkout@v6", "checkout@v7"))
        self.assertEqual(self.errors(bot=True), [])
        path.write_text(path.read_text().replace("      - run: echo check\n", ""))
        self.assertTrue(self.errors(bot=True))

    def test_bot_cannot_modify_approval_or_ghost_source(self):
        for name in (".github/workflows/auto-approve.yml", "vendor/example.rs", "patches/needed.patch"):
            with self.subTest(name=name):
                source = (self.head / name).read_bytes()
                (self.head / name).write_bytes(source + b"# modification\n")
                self.assertTrue(self.errors(bot=True))
                (self.head / name).write_bytes(source)

    def test_duplicate_keys_fail_closed(self):
        with self.assertRaises(ValueError):
            preservation.unique_json([("dependencies", {}), ("dependencies", {})])
        self.write(self.head, "pnpm-lock.yaml", "packages: {}\npackages: {}\n")
        with self.assertRaises(ValueError):
            self.errors()

    def test_symlink_manifest_is_not_followed(self):
        path = self.head / "package.json"
        path.unlink()
        path.symlink_to(self.base / "package.json")
        with self.assertRaises(ValueError):
            self.errors()

if __name__ == "__main__":
    unittest.main()
