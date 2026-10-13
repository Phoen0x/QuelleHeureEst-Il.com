# FR// Vérifier les migrations précises et refuser les pertes ou réactivations supplémentaires.
# EN// Verify exact migrations and reject additional losses or reactivations.
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("historical_gaps", ROOT / "Scripts/check-historical-dependency-gaps.py")
gaps = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gaps)

class HistoricalGapsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name) / "base"
        self.candidate = Path(self.temp.name) / "candidate"
        self.base.mkdir()
        shutil.copytree(ROOT, self.candidate, ignore=shutil.ignore_patterns(".git", "node_modules", "target", "dist", "__pycache__"))
        (self.base / "src-tauri").mkdir()
        shutil.copyfile(ROOT / "docs/history/pnpm-lock.before-phase1-repair.yaml", self.base / "pnpm-lock.yaml")
        shutil.copyfile(ROOT / "docs/history/before-ci-phase1/src-tauri/Cargo.toml", self.base / "src-tauri/Cargo.toml")
        shutil.copyfile(ROOT / "docs/history/dependency-gaps-20261013/main/package.json", self.base / "package.json")

    def test_actual_historical_base_is_qualified_with_two_visible_transitions(self):
        count, reachable, transitions = gaps.check(self.base, self.candidate)
        self.assertEqual(count, 31)
        self.assertGreaterEqual(reachable, 31)
        self.assertEqual(len(transitions), 2)

    def test_missing_babel_root_is_rejected(self):
        path = self.candidate / "package.json"
        data = json.loads(path.read_text())
        del data["devDependencies"]["react-refresh"]
        path.write_text(json.dumps(data))
        with self.assertRaisesRegex(ValueError, "Babel root lost"):
            gaps.check(self.base, self.candidate)

    def test_missing_babel_package_is_rejected(self):
        path = self.candidate / "pnpm-lock.yaml"
        data = gaps.preservation.load_yaml(path)
        del data["packages"]["/json5@2.2.3"]
        path.write_text(gaps.preservation.yaml.safe_dump(data))
        with self.assertRaisesRegex(ValueError, "still missing"):
            gaps.check(self.base, self.candidate)

    def test_required_lightningcss_loss_is_rejected(self):
        path = self.candidate / "pnpm-lock.yaml"
        data = gaps.preservation.load_yaml(path)
        vite = data["packages"]["/vite@" + data["devDependencies"]["vite"]["version"]]
        del vite["dependencies"]["lightningcss"]
        path.write_text(gaps.preservation.yaml.safe_dump(data))
        with self.assertRaisesRegex(ValueError, "Required Lightning CSS dependency lost"):
            gaps.check(self.base, self.candidate)

    def test_active_shell_plugin_is_rejected(self):
        path = self.candidate / "src-tauri/Cargo.toml"
        path.write_text(path.read_text() + '\n[dependencies.tauri-plugin-shell]\nversion = "2"\n')
        with self.assertRaisesRegex(ValueError, "Active plugin added"):
            gaps.check(self.base, self.candidate)

    def test_changed_upstream_proof_is_rejected(self):
        path = self.candidate / gaps.HISTORY / "upstream/vite-8.0.16.package.json"
        path.write_text(path.read_text() + "\n")
        with self.assertRaisesRegex(ValueError, "Proof changed"):
            gaps.check(self.base, self.candidate)

    def test_unrelated_dependency_loss_is_not_qualified(self):
        path = self.candidate / "package.json"
        data = json.loads(path.read_text())
        del data["dependencies"]["lucide-react"]
        path.write_text(json.dumps(data))
        with self.assertRaisesRegex(ValueError, "JS dependency removed"):
            gaps.check(self.base, self.candidate)

    def test_different_legacy_base_is_not_qualified(self):
        path = self.base / "pnpm-lock.yaml"
        path.write_text(path.read_text() + "\n")
        with self.assertRaisesRegex(ValueError, "base differs"):
            gaps.check(self.base, self.candidate)

if __name__ == "__main__":
    unittest.main()
