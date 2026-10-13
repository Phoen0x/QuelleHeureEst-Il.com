#!/usr/bin/env python3
# FR// Comparer la vraie base de PR ; aucune installation ni exécution du projet candidat.
# EN// Compare the actual PR base; never install or execute the candidate project.
import argparse
from collections import Counter
import json
from pathlib import Path
import re
import tomllib

import yaml

JS_FIELDS = ("dependencies", "devDependencies", "optionalDependencies", "peerDependencies")
CARGO_FIELDS = ("dependencies", "dev-dependencies", "build-dependencies")
IGNORED = {".git", "node_modules", "target", "dist"}

class UniqueLoader(yaml.SafeLoader):
    pass

def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in result:
            raise ValueError(f"Clé YAML dupliquée / Duplicate YAML key: {key}")
        result[key] = loader.construct_object(value_node, deep=deep)
    return result

UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)

def unique_json(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Clé JSON dupliquée / Duplicate JSON key: {key}")
        result[key] = value
    return result

def files(root):
    return {p.relative_to(root).as_posix(): p for p in root.rglob("*")
            if p.is_file() and not any(part in IGNORED for part in p.relative_to(root).parts)}

def text(path):
    if path.is_symlink():
        raise ValueError(f"Lien symbolique refusé / Symlink refused: {path}")
    return path.read_text(encoding="utf-8-sig")

def load_yaml(path):
    return yaml.load(text(path), Loader=UniqueLoader) or {}

def active(path):
    return not path.startswith(("docs/", "vendor/"))

def cargo_groups(data, prefix=()):
    for name, value in data.items():
        location = prefix + (name,)
        if name in CARGO_FIELDS and isinstance(value, dict):
            yield location, value
        elif isinstance(value, dict):
            yield from cargo_groups(value, location)

def cargo_features(data, prefix=()):
    for name, value in data.items():
        location = prefix + (name,)
        if name == "features" and isinstance(value, dict):
            yield location, value
        elif isinstance(value, dict):
            yield from cargo_features(value, location)

def npm_name(key):
    key = key.lstrip("/")
    match = re.match(r"^(@[^/]+/[^@/]+|[^@/]+)@", key)
    if not match:
        raise ValueError(f"Clé pnpm inconnue / Unsupported pnpm key: {key}")
    return match.group(1)

def pnpm_inventory(data):
    names, optional = set(), set()
    optional_edges, optional_peers = set(), set()
    for key, entry in data.get("packages", {}).items():
        name = npm_name(key)
        names.add(name)
        if entry.get("optional") is True:
            optional.add(name)
        optional_edges.update((name, dep) for dep in entry.get("optionalDependencies", {}))
        optional_peers.update((name, dep) for dep, meta in entry.get("peerDependenciesMeta", {}).items()
                              if meta.get("optional") is True)
    return names, optional, optional_edges, optional_peers

def action_text(value):
    # FR// Autoriser uniquement le changement de référence, jamais les commandes ou déclencheurs.
    # EN// Allow only a reference change, never command or trigger changes.
    return re.sub(r"(?m)^(\s*(?:-\s*)?uses:\s*)([^\n#]+)",
                  lambda m: m[1] + m[2].strip().strip("\"'").split("@", 1)[0], value)

def comments(value):
    return Counter(line.strip() for line in value.splitlines() if line.strip().startswith("#"))

def compare(base, candidate, is_bot=False):
    before, after = files(base), files(candidate)
    errors = []
    def require(ok, message):
        if not ok:
            errors.append(message)
    def subset(old, new, message):
        old, new = set(old), set(new)
        require(old <= new, message + ": " + ", ".join(sorted(old - new)))
    for path, old in before.items():
        require(path in after, f"Fichier supprimé / File removed: {path}")
        if path not in after:
            continue
        new = after[path]
        historical = path.startswith(("docs/history/", "docs/security/proposals/")) or (
            "/" not in path and path.startswith("package-lock") and path.endswith(".json"))
        if historical:
            require(old.read_bytes() == new.read_bytes(), f"Historique modifié / History changed: {path}")
        if active(path) and path.endswith("package.json"):
            a = json.loads(text(old), object_pairs_hook=unique_json)
            b = json.loads(text(new), object_pairs_hook=unique_json)
            for field in JS_FIELDS:
                subset(a.get(field, {}), b.get(field, {}), f"Dépendance JS supprimée / JS dependency removed: {path}/{field}")
            for name, metadata in a.get("peerDependenciesMeta", {}).items():
                if metadata.get("optional") is True:
                    require(b.get("peerDependenciesMeta", {}).get(name, {}).get("optional") is True,
                            f"Peer optionnel désactivé / Optional peer changed: {path}/{name}")
            if a.get("packageManager", "").startswith("pnpm@"):
                require(b.get("packageManager") == a["packageManager"],
                        f"Gestionnaire pnpm modifié / pnpm manager changed: {path}")
            for key in a.get("pnpm", {}).get("patchedDependencies", {}):
                require(key in b.get("pnpm", {}).get("patchedDependencies", {}),
                        f"Correctif pnpm supprimé / pnpm patch removed: {key}")
        if active(path) and path.endswith("Cargo.toml"):
            a, b = tomllib.loads(text(old)), tomllib.loads(text(new))
            groups = dict(cargo_groups(b))
            for group, dependencies in cargo_groups(a):
                proposed = groups.get(group, {})
                subset(dependencies, proposed, f"Dépendance Cargo supprimée / Cargo dependency removed: {path}/{'.'.join(group)}")
                for name, old_dep in dependencies.items():
                    if name not in proposed:
                        continue
                    old_options = old_dep if isinstance(old_dep, dict) else {}
                    new_options = proposed[name] if isinstance(proposed[name], dict) else {}
                    for flag, default in (("optional", False), ("default-features", True)):
                        require(old_options.get(flag, default) == new_options.get(flag, default),
                                f"Option Cargo modifiée / Cargo option changed: {path}/{name}/{flag}")
                    subset(old_options.get("features", []), new_options.get("features", []),
                           f"Feature de dépendance supprimée / Dependency feature removed: {path}/{name}")
                    for origin in ("package", "path", "git", "registry"):
                        require(old_options.get(origin) == new_options.get(origin),
                                f"Origine Cargo modifiée / Cargo origin changed: {path}/{name}/{origin}")
            features = dict(cargo_features(b))
            for group, definitions in cargo_features(a):
                proposed = features.get(group, {})
                for name, members in definitions.items():
                    require(name in proposed, f"Feature Cargo supprimée / Cargo feature removed: {path}/{name}")
                    subset(members, proposed.get(name, []), f"Option de feature supprimée / Feature member removed: {path}/{name}")
                    if name == "default":
                        require(members == proposed.get(name), f"Features de production modifiées / Production features changed: {path}")
            subset(a.get("workspace", {}).get("exclude", []), b.get("workspace", {}).get("exclude", []),
                   f"Exclusion Cargo supprimée / Cargo exclusion removed: {path}")
            require(comments(text(old)) <= comments(text(new)),
                    f"Commentaire Cargo supprimé / Cargo comment removed: {path}")
        if active(path) and path.endswith("Cargo.lock"):
            a, b = tomllib.loads(text(old)), tomllib.loads(text(new))
            subset((p["name"] for p in a.get("package", [])), (p["name"] for p in b.get("package", [])),
                   f"Paquet Cargo supprimé / Cargo package removed: {path}")
        if active(path) and path.endswith("pnpm-lock.yaml"):
            a, b = load_yaml(old), load_yaml(new)
            require(str(a.get("lockfileVersion")) == str(b.get("lockfileVersion")),
                    f"Format pnpm modifié / pnpm format changed: {path}")
            for old_set, new_set, label in zip(pnpm_inventory(a), pnpm_inventory(b),
                    ("paquets / packages", "paquets optionnels / optional packages",
                     "liens optionnels / optional edges", "peers optionnels / optional peers")):
                subset(map(str, old_set), map(str, new_set), f"pnpm {label} supprimés / removed: {path}")
        if is_bot and old.read_bytes() != new.read_bytes():
            allowed = active(path) and (path.endswith(("package.json", "Cargo.toml", "Cargo.lock", "pnpm-lock.yaml"))
                                       or path in (".github/dependabot.yml", "renovate.json"))
            if path.startswith(".github/workflows/"):
                allowed = path != ".github/workflows/auto-approve.yml" and action_text(text(old)) == action_text(text(new))
            require(allowed, f"Modification hors périmètre du bot / Bot edit outside scope: {path}")
    for path in after.keys() - before.keys():
        require(Path(path).name not in ("yarn.lock", "npm-shrinkwrap.json", "bun.lock", "bun.lockb")
                and not (Path(path).name.startswith("package-lock") and active(path)),
                f"Verrou concurrent créé / Competing lock created: {path}")
        if is_bot:
            require(path in ("renovate.json", ".github/dependabot.yml") or path.startswith("docs/history/"),
                    f"Nouveau fichier hors périmètre du bot / New bot file outside scope: {path}")
    manager = json.loads(text(candidate / "package.json"), object_pairs_hook=unique_json).get("packageManager", "")
    require(manager == "pnpm@8.15.9", "pnpm 8.15.9 doit rester principal / pnpm 8.15.9 must remain primary")
    return errors

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", type=Path, required=True)
    parser.add_argument("--candidate", type=Path, required=True)
    parser.add_argument("--actor-type", default="User")
    parser.add_argument("--branch", default="")
    args = parser.parse_args()
    bot = args.actor_type == "Bot" or args.branch.startswith(("dependabot/", "renovate/"))
    try:
        errors = compare(args.base, args.candidate, bot)
    except (ValueError, TypeError, KeyError, yaml.YAMLError, OSError) as error:
        errors = [str(error)]
    for error in errors:
        print("::error::" + error.replace("\n", " "))
    if errors:
        raise SystemExit(1)
    print("Conservation des dépendances validée / Dependency preservation passed")

if __name__ == "__main__":
    main()
