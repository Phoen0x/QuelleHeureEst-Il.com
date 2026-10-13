# FR// Vérifier le rétroport et conserver chaque dépendance et fichier publié.
# EN// Verify the backport and preserve every dependency and published file.
from pathlib import Path
import hashlib
import io
import tarfile
import tomllib

history = Path("docs/history/rust-warnings-20261013")
old_lock = tomllib.loads((history / "Cargo.lock").read_text())
lock = tomllib.loads(Path("Cargo.lock").read_text())
original_names = {p["name"] for p in old_lock["package"]}
assert original_names <= {p["name"] for p in lock["package"]}
old_manifest = tomllib.loads((history / "src-tauri/Cargo.toml").read_text())
manifest = tomllib.loads(Path("src-tauri/Cargo.toml").read_text())
for section in ("dependencies", "build-dependencies", "dev-dependencies"):
    assert old_manifest.get(section, {}) == manifest.get(section, {})
assert old_manifest["features"] == manifest["features"]
archive = (history / "glib-0.18.5.crate").read_bytes()
original_glib = next(p for p in old_lock["package"] if p["name"] == "glib")
assert hashlib.sha256(archive).hexdigest() == original_glib["checksum"]
vendor = Path("vendor/glib-0.18.5")
original_files = set()
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as source:
    for entry in source.getmembers():
        if not entry.isfile():
            continue
        relative = Path(entry.name).relative_to("glib-0.18.5")
        original_files.add(relative.as_posix())
        expected = source.extractfile(entry).read()
        if relative.as_posix() == "src/variant_iter.rs":
            expected = expected.replace(b"let p: *mut libc::c_char = std::ptr::null_mut();", b"let mut p: *mut libc::c_char = std::ptr::null_mut();").replace(b"                &p,\n", b"                &mut p,\n")
        assert (vendor / relative).read_bytes() == expected, str(relative)
assert {p.relative_to(vendor).as_posix() for p in vendor.rglob("*") if p.is_file()} == original_files
glib = next(p for p in lock["package"] if p["name"] == "glib")
assert glib == original_glib
assert tomllib.loads(Path(".cargo/config.toml").read_text())["paths"] == ["vendor/glib-0.18.5"]
import json
import subprocess
metadata = json.loads(subprocess.check_output(["cargo", "metadata", "--locked", "--format-version", "1"]))
resolved = [p for p in metadata["packages"] if p["name"] == "glib" and p["version"] == "0.18.5"]
assert len(resolved) == 1 and Path(resolved[0]["manifest_path"]).resolve() == (vendor / "Cargo.toml").resolve()
for name, version in (("proc-macro-error", "1.0.4"), ("rustls-pemfile", "1.0.4")):
    assert any(p["name"] == name and p["version"] == version for p in lock["package"])
assert manifest["dependencies"]["rustls-pemfile"]["optional"]
print(f"Paquets conservés / Packages preserved: {len(original_names)}; fichiers glib conservés / glib files preserved: {len(original_files)}; correction amont exacte / exact upstream fix")
