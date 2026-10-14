#!/usr/bin/env python3
# FR// Qualifier les écarts sur la vraie base, indépendamment de l'amorçage de #153.
# EN// Qualify gaps against the actual base, independently of the #153 bootstrap.
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import tomllib

spec = importlib.util.spec_from_file_location("preservation", Path(__file__).with_name("check-dependency-update-preservation.py"))
preservation = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preservation)

HISTORY = "docs/history/dependency-gaps-20261013"
ROOTS = {"@babel/core", "@babel/plugin-transform-react-jsx-self", "@babel/plugin-transform-react-jsx-source", "@types/babel__core", "react-refresh"}
PROOFS = {
    "upstream/tauri-v2-migration.mdx": "f6c921fad5eb890550da1793a0b8f1d9baffd5f29afa51e470190e33e7372116",
    "upstream/vite-8-migration.md": "595e8f8217e27d360bc33ad6114202f0fb7235e02b11272bce6fe62b60791adc",
    "upstream/tauri-1.8.3.Cargo.toml": "748a71444a0eba78c2b732e04615c646d3daf8920b02ce891167e5409502d735",
    "upstream/plugin-react-6.0.2.package.json": "4cd7456c1d01b92b6a983ccec4916d55ae21a512608ea4087d8acf96c5327699",
    "upstream/plugin-react-4.7.0.package.json": "d608755568d9d654c34e9e2da06659df9122fa89d2604ee09cdeda457a20c035",
    "upstream/vite-8.0.16.package.json": "342571e744d0ef3c2d2c9720c70609764d58c2c6a0f4f03951c7b977a1eb38cb",
    "upstream/tauri-2.12.3.Cargo.toml": "0ff76a923f11e0082b1711c7ec42ce2021bf462e9aca378cbbc954a5645799d5",
    "upstream/vite-7.3.5.package.json": "395305f4d5ce7ca1bd4aebdd130e4e7527009fb2ba9b7378f5f07bf734f81ca6",
    "before/pnpm-lock.yaml": "52555889141e9ce139806fb86aaa245b974e90cc1cc2a715bf70fdf143692dbf",
    "before/package.json": "0b1907be8f6fd3ee4362b3571675a382698f4bd2e7428e02ad4fe9ccb562e869",
    "before/src-tauri/Cargo.toml": "078c2fc9fab48dde09a4f8f5163daa46e6bfe5ac212cd5d93b74d44e2eedc2f9",
    "before/.github/workflows/dependency-preservation.yml": "48319595e4fb0f49feb7287b111c59536bc3fab3cbae40d6931f007f860519b3",
}

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def check(base, candidate):
    def require(ok, message):
        if not ok:
            raise ValueError(message)
    history = candidate / HISTORY
    for path, digest in PROOFS.items():
        require(sha(history / path) == digest, f"Preuve modifiée / Proof changed: {path}")
    old_lock_path = candidate / "docs/history/pnpm-lock.before-phase1-repair.yaml"
    old_cargo_path = candidate / "docs/history/before-ci-phase1/src-tauri/Cargo.toml"
    require(sha(old_cargo_path) == "fe2afa9dd9260e21636200bd3558aadc7ebe61cc22b71fc6eb7742f20ef17ce9", "Archive Cargo initiale modifiée / Initial Cargo archive changed")
    require(sha(old_lock_path) == "685f622bd59421fe48e40007d35e707b361af14900e79f80dc69cd1cf06682a4", "Archive pnpm initiale modifiée / Initial pnpm archive changed")
    old_lock = preservation.load_yaml(old_lock_path)
    old_cargo = tomllib.loads(old_cargo_path.read_text())
    require(old_cargo["dependencies"]["tauri"] == {"version": "2.0", "features": ["shell-open"]}, "Variante Tauri historique perdue / Historical Tauri variant lost")
    new_lock = preservation.load_yaml(candidate / "pnpm-lock.yaml")
    manifest = json.loads((candidate / "package.json").read_text())
    before = preservation.load_yaml(history / "before/pnpm-lock.yaml")
    removed = preservation.pnpm_inventory(old_lock)[0] - preservation.pnpm_inventory(before)[0]
    require(len(removed) == 31, "Inventaire historique inattendu / Unexpected historical inventory")
    require(removed <= preservation.pnpm_inventory(new_lock)[0], "Un des 31 noms reste absent / One of the 31 names is still missing")
    require(ROOTS <= manifest["devDependencies"].keys(), "Racine Babel historique perdue / Historical Babel root lost")
    require(not (ROOTS & manifest.get("dependencies", {}).keys()), "Babel historique activé en production / Historical Babel enabled in production")
    reachable = set()
    queue = [f"/{name}@{new_lock['devDependencies'][name]['version']}" for name in ROOTS]
    while queue:
        key = queue.pop()
        if key in reachable:
            continue
        reachable.add(key)
        entry = new_lock["packages"][key]
        for field in ("dependencies", "optionalDependencies"):
            queue.extend(f"/{name}@{version}" for name, version in entry.get(field, {}).items())
    require(removed <= {preservation.npm_name(key) for key in reachable}, "Entrées Babel orphelines / Orphan Babel entries")
    vite7 = json.loads((history / "upstream/vite-7.3.5.package.json").read_text())
    vite8 = json.loads((history / "upstream/vite-8.0.16.package.json").read_text())
    require(vite7["peerDependenciesMeta"]["lightningcss"]["optional"] is True, "Ancien peer incorrect / Incorrect former peer")
    require("lightningcss" in vite8["dependencies"] and "lightningcss" not in vite8["peerDependencies"], "Migration amont incorrecte / Incorrect upstream migration")
    vite = new_lock["packages"]["/vite@" + new_lock["devDependencies"]["vite"]["version"]]
    require("lightningcss" in vite.get("dependencies", {}), "Dépendance Lightning CSS obligatoire perdue / Required Lightning CSS dependency lost")
    require("/lightningcss@" + vite["dependencies"]["lightningcss"] in new_lock["packages"], "Lightning CSS non résolu / Unresolved Lightning CSS")
    # FR// Une permission Tauri 1 invalide ne doit pas être remplacée par une capacité active.
    # EN// An invalid Tauri 1 permission must not be replaced with an active capability.
    tauri1 = tomllib.loads((history / "upstream/tauri-1.8.3.Cargo.toml").read_text())
    tauri2 = tomllib.loads((history / "upstream/tauri-2.12.3.Cargo.toml").read_text())
    require("shell-open" in tauri1["features"] and "shell-open" not in tauri2["features"], "Contrat Tauri amont incorrect / Incorrect upstream Tauri contract")
    cargo_text = (candidate / "src-tauri/Cargo.toml").read_text()
    cargo = tomllib.loads(cargo_text)
    require(cargo["dependencies"]["tauri"]["features"] == [], "Feature Tauri incompatible réactivée / Incompatible Tauri feature reactivated")
    require('# tauri = { version = "2.0", features = ["shell-open"] }' in cargo_text, "Déclaration historique non conservée / Historical declaration not retained")
    for _, deps in preservation.cargo_groups(cargo):
        require("tauri-plugin-shell" not in deps and "tauri-plugin-opener" not in deps, "Plugin actif ajouté sans migration / Active plugin added without migration")
    require(not any("plugin-shell" in name or "plugin-opener" in name for field in preservation.JS_FIELDS for name in manifest.get(field, {})), "Plugin JS shell actif / Active JS shell plugin")
    for folder in ("src", "src-tauri/src", "src-tauri/capabilities"):
        for path in (candidate / folder).rglob("*"):
            if path.is_file():
                require(not re.search(r"@tauri-apps/(?:api/shell|plugin-shell|plugin-opener)|tauri_plugin_(?:shell|opener)|shell:(?:allow-open|default)|opener:allow|window\.open\s*\(", path.read_text()), f"Exposition shell à requalifier / Shell exposure requires review: {path}")
    errors = preservation.compare(base, candidate)
    accepted = []
    # FR// Ces deux transitions sont annoncées, jamais étendues à d'autres pertes.
    # EN// These two transitions are reported and never extended to other losses.
    peer = "pnpm peers optionnels / optional peers supprimés / removed: pnpm-lock.yaml: ('vite', 'lightningcss')"
    shell = "Feature de dépendance supprimée / Dependency feature removed: src-tauri/Cargo.toml/tauri: shell-open"
    if peer in errors:
        require(sha(base / "pnpm-lock.yaml") == sha(old_lock_path), "Base pnpm différente de la migration qualifiée / pnpm base differs from qualified migration")
        errors.remove(peer)
        accepted.append("vite/lightningcss : ancien peer optionnel archivé ; dépendance obligatoire active vérifiée / former optional peer archived; active required dependency verified")
    if shell in errors:
        require((base / "src-tauri/Cargo.toml").read_bytes() == old_cargo_path.read_bytes(), "Base Cargo différente de la migration qualifiée / Cargo base differs from qualified migration")
        errors.remove(shell)
        accepted.append("tauri/shell-open : feature Tauri 1 invalide sous Tauri 2 ; archive et commentaire conservés, aucune permission ajoutée / invalid Tauri 1 feature under Tauri 2; archive and comment retained, no permission added")
    require(not errors, "\n".join(errors))
    return len(removed), len(reachable), accepted

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", type=Path, required=True)
    parser.add_argument("--candidate", type=Path, required=True)
    args = parser.parse_args()
    try:
        count, reachable, transitions = check(args.base, args.candidate)
        for transition in transitions:
            print("::warning::Migration historique qualifiée / Qualified historical migration: " + transition)
        print(f"31 noms restaurés / 31 names restored: {count}; graphe Babel accessible / reachable Babel graph: {reachable}")
        print("Vraie base contrôlée sans amorçage / Actual base checked without bootstrap")
    except (ValueError, KeyError, OSError, TypeError) as error:
        print("::error::" + str(error).replace("\n", " | "))
        raise SystemExit(1)
