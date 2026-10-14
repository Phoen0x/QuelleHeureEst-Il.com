# FR// Garde sans écriture ; les scripts historiques restent autorisés seulement sur leurs références exactes.
# EN// Read-only guard; historical scripts are allowed only against their exact baselines.
import hashlib
import json
import locale
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
BASELINES = ROOT / "Scripts/candidate-generator-baselines.json"

def regular(path):
    for part in (path, *path.parents):
        if part == ROOT.parent:
            break
        if part.is_symlink():
            raise ValueError(f"Lien refusé / Symlink refused: {path.relative_to(ROOT)}")
    if not path.is_file():
        raise ValueError(f"Fichier absent / Missing file: {path.relative_to(ROOT)}")

def digest(path):
    regular(path)
    return hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()

def check(profile):
    if Path.cwd().resolve() != ROOT:
        raise ValueError("Exécuter depuis la racine du dépôt / Run from repository root")
    regular(BASELINES)
    data = json.loads(BASELINES.read_text(encoding="utf-8-sig"))
    if profile not in data["profiles"]:
        raise ValueError("Profil inconnu / Unknown profile")
    rule = data["profiles"][profile]
    for name, expected in rule["files"].items():
        if digest(ROOT / name) != expected:
            raise ValueError(f"État incompatible, aucune écriture / Incompatible state, no writes: {profile}: {name}")
    for name in rule.get("absent", []):
        path = ROOT / name
        # FR// Refuser aussi les liens pendants : ils ne constituent pas une sortie libre.
        # EN// Reject dangling symlinks too: they are not unused output paths.
        if path.exists() or path.is_symlink():
            raise ValueError(f"Sortie ou correctif déjà présent / Output or backport already present: {name}")
        for parent in path.parents:
            if parent == ROOT:
                break
            if parent.is_symlink():
                raise ValueError(f"Parent lié refusé / Symlink parent refused: {name}")
    for name, expected in {**data["archives"], **rule.get("archives", {})}.items():
        path = ROOT / name
        regular(path)
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise ValueError(f"Version archivée modifiée / Archived version changed: {name}")
    return rule

def require_compatible(profile):
    args = sys.argv[1:]
    if args not in ([], ["--check"], ["--generate"]):
        raise SystemExit("Arguments refusés ; --check ou --generate / Arguments refused; --check or --generate")
    try:
        check(profile)
    except (ValueError, OSError, KeyError) as error:
        raise SystemExit(f"Refus avant écriture / Refused before writes: {error}")
    print(f"Référence compatible sans écriture / Compatible baseline without writes: {profile}")
    if args != ["--generate"]:
        raise SystemExit(0)
    # FR// Les corps historiques écrivent sans encoding explicite : refuser un défaut non UTF-8.
    # EN// Historical bodies write without explicit encoding: reject a non-UTF-8 default.
    if locale.getpreferredencoding(False).replace("-", "").replace("_", "").lower() != "utf8":
        raise SystemExit("Génération refusée avant écriture ; utiliser Python -X utf8 / Generation refused before writes; use Python -X utf8")

if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] != "--check":
        raise SystemExit("Usage: python3 Scripts/candidate_safety.py --check PROFILE")
    try:
        check(sys.argv[2])
    except (ValueError, OSError, KeyError) as error:
        raise SystemExit(f"Refus avant écriture / Refused before writes: {error}")
    print(f"Référence compatible sans écriture / Compatible baseline without writes: {sys.argv[2]}")
