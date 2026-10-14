# FR// Vérifier la migration sans supprimer les noms de paquets historiques.
# EN// Verify the migration without deleting historical package names.
from pathlib import Path
import tomllib

history = Path("docs/history/rust-h2-20261013")
original_manifest = tomllib.loads((history / "src-tauri/Cargo.toml").read_text())
manifest = tomllib.loads(Path("src-tauri/Cargo.toml").read_text())
original_lock = tomllib.loads((history / "Cargo.lock").read_text())
lock = tomllib.loads(Path("Cargo.lock").read_text())
for section in ("dependencies", "build-dependencies", "dev-dependencies"):
    for name, old in original_manifest.get(section, {}).items():
        assert name in manifest.get(section, {}), f"Dépendance supprimée / Deleted dependency: {name}"
        new = manifest[section][name]
        if isinstance(old, dict):
            assert not old.get("optional", False) or new.get("optional", False)
            assert set(old.get("features", [])) <= set(new.get("features", []))
        if name != "reqwest":
            assert old == new, f"Dépendance modifiée hors migration / Dependency changed outside migration: {name}"
assert original_manifest["features"] == manifest["features"]
old_names = {p["name"] for p in original_lock["package"]}
new_names = {p["name"] for p in lock["package"]}
assert old_names <= new_names, old_names - new_names
h2 = [p for p in lock["package"] if p["name"] == "h2"]
assert h2 and all(tuple(map(int, p["version"].split("."))) >= (0, 4, 16) for p in h2)
assert all(p["version"].startswith("0.4.") for p in h2)
print(f"Paquets historiques conservés / Historical packages retained: {len(old_names)}; h2: {[p['version'] for p in h2]}")
