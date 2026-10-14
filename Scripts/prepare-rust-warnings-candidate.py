# FR// Préparer un rétroport vérifiable ; tous les paquets historiques restent présents.
# EN// Prepare a verifiable backport; all historical packages remain present.
# FR// Par défaut, contrôler seulement ; --generate exige la référence historique intacte.
# EN// Check only by default; --generate requires an intact historical baseline.
import sys
sys.dont_write_bytecode = True
from candidate_safety import require_compatible
require_compatible("rust-warnings")
from pathlib import Path
import hashlib
import io
import subprocess
import tarfile
import tomllib

lock = tomllib.loads(Path("Cargo.lock").read_text())
package = next(p for p in lock["package"] if p["name"] == "glib")
assert package["version"] == "0.18.5"
subprocess.run(["cargo", "fetch", "--locked"], check=True)
import os
cargo_dir = Path(os.environ.get("CARGO_HOME", str(Path.home() / ".cargo")))
archives = list((cargo_dir / "registry/cache").glob("*/glib-0.18.5.crate"))
reference = Path("docs/history/rust-warnings-20261013/glib-0.18.5.crate")
assert reference.exists() or archives
archive = reference.read_bytes() if reference.exists() else archives[0].read_bytes()
assert hashlib.sha256(archive).hexdigest() == package["checksum"]
history = Path("docs/history/rust-warnings-20261013")
history.mkdir(parents=True, exist_ok=True)
(history / "glib-0.18.5.crate").write_bytes(archive)
vendor = Path("vendor")
vendor.mkdir(exist_ok=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as source:
    source.extractall(vendor, filter="data")
variant = vendor / "glib-0.18.5/src/variant_iter.rs"
text = variant.read_text()
old = "let p: *mut libc::c_char = std::ptr::null_mut();"
new = "let mut p: *mut libc::c_char = std::ptr::null_mut();"
assert text.count(old) == 1 and text.count("                &p,\n") == 1
text = text.replace(old, new).replace("                &p,\n", "                &mut p,\n")
variant.write_text(text)
root = Path("Cargo.toml")
content = root.read_text()
content = content.replace('members = ["src-tauri"]', 'members = ["src-tauri"]\n# FR// Le paquet tiers corrigé reste une dépendance, hors membres du workspace.\n# EN// The patched third-party package remains a dependency, outside workspace members.\nexclude = ["vendor/glib-0.18.5"]')
configuration = Path(".cargo/config.toml")
configuration.parent.mkdir(exist_ok=True)
assert not configuration.exists() or tomllib.loads(configuration.read_text()) == {"paths": ["vendor/glib-0.18.5"]}
configuration.write_text('# FR// Substituer uniquement le code ; conserver la résolution de registre pour les audits.\n# EN// Override only source code; preserve registry resolution for audits.\npaths = ["vendor/glib-0.18.5"]\n')
root.write_text(content)
manifest = Path("src-tauri/Cargo.toml")
with manifest.open("a") as output:
    output.write('\n# FR// Régressions Linux du paquet glib déjà utilisé par Tauri.\n# EN// Linux regressions for the glib package already used by Tauri.\n[target.\'cfg(target_os = "linux")\'.dev-dependencies]\nglib = "=0.18.5"\n')
Path("src-tauri/tests/glib_variant_str_iter.rs").write_text("// FR// Régressions de VariantStrIter, également exécutées avec optimisations release.\n// EN// VariantStrIter regressions, also run with release optimizations.\n#![cfg(target_os = \"linux\")]\nuse glib::prelude::*;\n\nfn sample() -> glib::Variant {\n    [\"Paris\", \"Été\", \"\"].to_variant()\n}\n\n#[test]\nfn forward_next_reads_written_pointer() {\n    let value = sample();\n    let mut iter = value.array_iter_str().unwrap();\n    assert_eq!(iter.next(), Some(\"Paris\"));\n    assert_eq!(iter.next(), Some(\"Été\"));\n    assert_eq!(iter.next(), Some(\"\"));\n    assert_eq!(iter.next(), None);\n}\n\n#[test]\nfn forward_nth_reads_written_pointer() {\n    let value = sample();\n    let mut iter = value.array_iter_str().unwrap();\n    assert_eq!(iter.nth(1), Some(\"Été\"));\n    assert_eq!(iter.next(), Some(\"\"));\n    assert_eq!(iter.nth(usize::MAX), None);\n}\n\n#[test]\nfn forward_last_reads_written_pointer() {\n    let value = sample();\n    assert_eq!(value.array_iter_str().unwrap().last(), Some(\"\"));\n}\n\n#[test]\nfn backward_next_reads_written_pointer() {\n    let value = sample();\n    let mut iter = value.array_iter_str().unwrap();\n    assert_eq!(iter.next_back(), Some(\"\"));\n    assert_eq!(iter.next_back(), Some(\"Été\"));\n    assert_eq!(iter.next_back(), Some(\"Paris\"));\n    assert_eq!(iter.next_back(), None);\n}\n\n#[test]\nfn backward_nth_reads_written_pointer() {\n    let value = sample();\n    let mut iter = value.array_iter_str().unwrap();\n    assert_eq!(iter.nth_back(1), Some(\"Été\"));\n    assert_eq!(iter.next_back(), Some(\"Paris\"));\n    assert_eq!(iter.nth_back(usize::MAX), None);\n}\n\n#[test]\nfn mixed_iteration_and_empty_array_remain_valid() {\n    let value = sample();\n    let mut iter = value.array_iter_str().unwrap();\n    assert_eq!(iter.len(), 3);\n    assert_eq!(iter.next(), Some(\"Paris\"));\n    assert_eq!(iter.next_back(), Some(\"\"));\n    assert_eq!(iter.next(), Some(\"Été\"));\n    assert_eq!(iter.len(), 0);\n    assert_eq!(iter.next_back(), None);\n    let empty: [&str; 0] = [];\n    let value = empty.to_variant();\n    assert_eq!(value.array_iter_str().unwrap().next(), None);\n}\n")
subprocess.run(["cargo", "update", "-p", "glib"], check=True)
