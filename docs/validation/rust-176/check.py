"""Vérifier la conservation et résumer la validation Rust.
Verify preservation and summarize Rust validation.
"""

import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys


SOURCE = "3e1f4177d2c1417b62121559ec9f39e8ca342394"
# FR// Le relais #178 est immuable hors des deux corrections et des deux contrôles dédiés.
# EN// The #178 handoff is immutable except for the two fixes and the two dedicated validation files.
MISSION_PARENT = "7826f7e10d0a420406a5b8e43a4da92efcea9cd6"
SOURCE_CHANGES = {"pnpm-lock.yaml", "src-tauri/src/main.rs"}
VALIDATION_CHANGES = {
    ".github/workflows/rust-validation-176.yml",
    "docs/validation/rust-176/check.py",
}
ADDITIONS = {
    ".github/workflows/rust-validation-176.yml",
    "docs/validation/rust-176/check.py",
    "docs/validation/rust-176/REPORT.md",
    "src-tauri/tauri.conf.json",
    "docs/reports/tauri-config-20261020.md",
    "docs/history/rust-178/pnpm-lock.yaml",
    "docs/history/rust-178/package.json",
    "docs/history/rust-178/main.before.rs",
    "docs/history/rust-178/PORT.json",
    "docs/validation/rust-178/check-js-dependency-preservation.cjs",
    "docs/validation/rust-178/check-ported-graph.cjs",
    "docs/reports/rust-lock-api-20261020.md",
}


def git(*args):
    return subprocess.check_output(["git", *args])


def tree(ref):
    result = {}
    for item in git("ls-tree", "-rz", ref).split(b"\0"):
        if not item:
            continue
        info, raw_path = item.split(b"\t", 1)
        mode, kind, sha = info.decode().split()
        if kind != "blob":
            raise AssertionError(f"Type Git inattendu : {kind}")
        result[raw_path.decode()] = (mode, sha)
    return result


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def verify_checkout():
    assert git("rev-parse", "HEAD").decode().strip() == os.environ["CI_HEAD_SHA"]
    assert os.environ["CI_BASE_SHA"] == SOURCE
    assert os.environ["SOURCE_SHA"] == SOURCE
    subprocess.run(["git", "merge-base", "--is-ancestor", SOURCE, "HEAD"], check=True)
    subprocess.run(["git", "merge-base", "--is-ancestor", MISSION_PARENT, "HEAD"], check=True)
    baseline, current = tree(SOURCE), tree("HEAD")
    assert len(baseline) == 88
    assert all(current.get(path) == item for path, item in baseline.items()
               if path not in SOURCE_CHANGES)
    assert set(current) - set(baseline) == ADDITIONS
    parent = tree(MISSION_PARENT)
    assert len(parent) == 93
    assert all(current.get(path) == item for path, item in parent.items()
               if path not in VALIDATION_CHANGES | SOURCE_CHANGES)
    assert set(current) - set(parent) == {
        "docs/history/rust-178/pnpm-lock.yaml", "docs/history/rust-178/package.json",
        "docs/history/rust-178/main.before.rs", "docs/history/rust-178/PORT.json",
        "docs/validation/rust-178/check-js-dependency-preservation.cjs",
        "docs/validation/rust-178/check-ported-graph.cjs",
        "docs/reports/rust-lock-api-20261020.md",
    }
    # FR// Les deux anciennes sources restent complètes ; aucune autre variation n'est admise.
    # EN// Both former sources remain complete; no other variation is accepted.
    history = Path("docs/history/rust-178")
    for original, archive in (("pnpm-lock.yaml", "pnpm-lock.yaml"),
                              ("package.json", "package.json"),
                              ("src-tauri/src/main.rs", "main.before.rs")):
        assert (history / archive).read_bytes() == git("show", f"{MISSION_PARENT}:{original}")
    old_main = (history / "main.before.rs").read_bytes()
    expected_main = old_main.replace(
        b'                let window = app.get_window("main").unwrap();',
        b'                // FR// Appel Tauri 1 historique conserve hors compilation ; adaptation reprise de #153.\n'
        b'                // EN// Historical Tauri 1 call retained outside compilation; adaptation reused from #153.\n'
        b'                // let window = app.get_window("main").unwrap();\n'
        b'                let window = app.get_webview_window("main").unwrap();')
    assert expected_main != old_main
    assert Path("src-tauri/src/main.rs").read_bytes() == expected_main
    assert digest(Path("pnpm-lock.yaml")) == "0537ba2f2914f12ead588afe47b03cb76e76c58f69fb7599460531867e63b09e"
    assert digest(history / "PORT.json") == "d2adc98e8d632df9baa6be2aa9d7c27193e551f752fd6bb369b9a7f252c50f82"
    assert current["docs/validation/rust-178/check-js-dependency-preservation.cjs"][1] == "72a00dd767c7761ff9a5aac62d301a004c11c37d"
    # FR// Le schéma est le seul champ ajouté ; tous les réglages racine restent identiques.
    # EN// The schema is the only added field; all root settings remain identical.
    expected_config = json.loads(Path("tauri.conf.json").read_text())
    expected_config["$schema"] = "https://schema.tauri.app/config/2"
    assert json.loads(Path("src-tauri/tauri.conf.json").read_text()) == expected_config
    assert "Cargo.lock" not in baseline
    for path, (mode, sha) in current.items():
        file = Path(path)
        assert file.is_file() and not file.is_symlink(), path
        # FR// Appliquer les attributs Git historiques, notamment les fins de ligne Windows.
        # EN// Apply historical Git attributes, including Windows line endings.
        actual = subprocess.check_output(
            ["git", "hash-object", f"--path={path}", "--stdin"], input=file.read_bytes()
        ).decode().strip()
        assert actual == sha, path
        assert bool(file.stat().st_mode & 0o111) == (mode == "100755"), path
    assert not git("status", "--porcelain", "--untracked-files=no").strip()
    return baseline, current


def before(evidence, build):
    baseline, current = verify_checkout()
    assert not list(build.iterdir()), "La copie temporaire doit être vide"
    # FR// Copier les octets vérifiés sans exécuter de générateur ni modifier le checkout.
    # EN// Copy verified bytes without running generators or modifying the checkout.
    for path in current:
        target = build / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(Path(path).read_bytes())
        target.chmod(Path(path).stat().st_mode & 0o777)
    snapshot = {
        "source_sha": SOURCE,
        "head_sha": os.environ["CI_HEAD_SHA"],
        "base_files_preserved": len(baseline) - len(SOURCE_CHANGES),
        "base_files_archived_and_corrected": sorted(SOURCE_CHANGES),
        "mission_parent_sha": MISSION_PARENT,
        "parent_files_preserved": len(tree(MISSION_PARENT)) - len(VALIDATION_CHANGES | SOURCE_CHANGES),
        "allowed_validation_changes": sorted(VALIDATION_CHANGES),
        "files": {p: digest(Path(p)) for p in current},
        "additions": sorted(ADDITIONS),
    }
    write_json(evidence / "preservation-before.json", snapshot)
    print(f"Conservation initiale : {len(baseline) - len(SOURCE_CHANGES)} fichiers identiques, deux sources archivées et corrigées")


def after(evidence, build):
    verify_checkout()
    snapshot = json.loads((evidence / "preservation-before.json").read_text())
    failures = []
    for path, expected in snapshot["files"].items():
        for location in (Path(path), build / path):
            if not location.is_file() or location.is_symlink() or digest(location) != expected:
                failures.append(str(location))
    lock = build / "Cargo.lock"
    recorded = evidence / "Cargo.lock"
    lock_unchanged = lock.is_file() and recorded.is_file() and digest(lock) == digest(recorded)
    if not lock_unchanged:
        failures.append("Verrou temporaire absent ou modifié après résolution")
    assert not Path("Cargo.lock").exists(), "Cargo.lock a été créé dans le checkout"
    result = {
        "source_sha": SOURCE,
        "head_sha": os.environ["CI_HEAD_SHA"],
        "base_files_preserved": snapshot["base_files_preserved"],
        "mission_parent_sha": MISSION_PARENT,
        "parent_files_preserved": snapshot["parent_files_preserved"],
        "temporary_lock_unchanged": lock_unchanged,
        "temporary_lock_sha256": digest(lock) if lock.is_file() else None,
        "failures": failures,
        "status": "PASS" if not failures else "FAIL",
    }
    write_json(evidence / "preservation-after.json", result)
    assert not failures, failures
    print("Conservation finale : checkout, copie temporaire et verrou contrôlés")


def summary(evidence):
    steps = json.loads(os.environ["STEP_RESULTS"])
    mandatory = ("source", "native", "lock", "pnpm", "node", "install", "graph", "frontend", "build_debug", "test_debug",
                 "build_release", "test_release", "preservation")
    outcomes = {key: steps.get(key, {}).get("outcome", "missing") for key in mandatory}
    required = ("preservation-before.json", "preservation-after.json", "environment.log",
                "apt-update.log", "apt-install.log", "resolution.log", "Cargo.lock",
                "install.log", "dependency-graph.log", "dependency-graph.json", "frontend.log",
                "Cargo.lock.sha256", "build-debug.log", "test-debug.log",
                "build-release.log", "test-release.log")
    missing = [name for name in required if not (evidence / name).is_file()]
    passed = all(value == "success" for value in outcomes.values()) and not missing
    result = {"source_sha": SOURCE, "head_sha": os.environ["CI_HEAD_SHA"],
              "outcomes": outcomes, "missing_evidence": missing,
              "status": "PASS" if passed else "FAIL"}
    write_json(evidence / "summary.json", result)
    rows = ["# Validation Rust après #176", "", f"SHA : `{result['head_sha']}`", "",
            "| Étape | Résultat |", "|---|---|"]
    rows.extend(f"| {key} | {value} |" for key, value in outcomes.items())
    rows.extend(["", f"Preuves manquantes : {missing}", "",
                 "Un échec de compilation ne constitue pas une réussite des tests."])
    report = "\n".join(rows) + "\n"
    (evidence / "SUMMARY.md").write_text(report)
    with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as stream:
        stream.write(report)
    assert passed, "Validation incomplète ou en échec ; voir les journaux et summary.json"


def main():
    evidence = Path(os.environ["EVIDENCE_DIR"])
    build = Path(os.environ["BUILD_DIR"])
    evidence.mkdir(parents=True, exist_ok=True)
    {"before": before, "after": after, "summary": lambda e, b: summary(e)}[sys.argv[1]](
        evidence, build
    )


if __name__ == "__main__":
    main()
