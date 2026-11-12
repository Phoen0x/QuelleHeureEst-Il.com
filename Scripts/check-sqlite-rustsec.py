#!/usr/bin/env python3
"""FR : autoriser uniquement la transformation SQLite, rejouer toutes les gardes historiques.
EN: allow only the SQLite transformation and replay all historical guards.
"""
from pathlib import Path
import hashlib
import importlib.util
import json
import os
import shutil
import subprocess
import tempfile
import sys
sys.dont_write_bytecode = True
import tomllib

ROOT = Path(__file__).resolve().parents[1]
HISTORY = 'docs/history/sqlite-rustsec-20261111'
BASE = 'd35eb03ff7e63a77fcc1094a9292b87992e3337d'
TREE = 'bec9bfb986855bbe6c73426983b2198726b2dede'
PINS = {'src-tauri/Cargo.toml': '755659576127151b576eb631802eb7ee7bdbbe814c50bba969a6ce78411ef403', 'Cargo.lock': '97ad73ef040ed498097a1bb43bbc15148b6271c766b9ef0807017109aa812c49', 'Scripts/check-glib-qh011.py': '206760eda507d016b7d8a0c3c9b2264abf7e76f7dc88be43e95252e97ecf74c0', 'src-tauri/tests/sqlite_security.rs': 'a4f4266a2c17ac8c907382edbb2a8e22f729498558edc28cef492ed08780d0a8', 'src-tauri/tests/json_cache_preservation.rs': '58f59fb2291b60517aa14a57bee9f190fcf45a6db4e41b89df1506a51c27f3ea', 'docs/history/sqlite-rustsec-20261111/PORT.json': 'e87e5f90bec3d78cee62acb67b6475e6a92e16972253ac871ccdb66b2a2d1968', 'docs/history/sqlite-rustsec-20261111/TRANSFORMATIONS.json': '5b8c47ba331f0745e638e4f6ef4ce381e408f2cac65a063b7c0971fe9fca153a', 'docs/history/sqlite-rustsec-20261111/graph-before.json': '88979b08b8e87f60430d094286236780da65838d36fe0a00510340ccfd90eca9', 'docs/history/sqlite-rustsec-20261111/graph-all-before.json': 'ee72506a9a5a8cfc08d255ed03006094f8ad7a313d63da495e5839e5de58fbcb', 'docs/history/sqlite-rustsec-20261111/SOURCES.json': '84c6ca132aa9266f566dc3f2ad014b5540d4eeef2bc27320968dd0a77c961ca7', 'tests/dependency_updates/sqlite-rustsec.test.cjs': '350eb63fb19c111e3674de1243127deb1fa517af0bd62c8257883656e5f899bd'}
WRAPPER = "// FR// Ajouter la transformation SQLite contrôlée aux gardes historiques authentifiées.\n// EN// Add the controlled SQLite transformation to authenticated historical guards.\nconst { execFileSync } = require('node:child_process');\nexecFileSync('python3', [require('node:path').resolve(__dirname, '../../../Scripts/check-sqlite-rustsec.py')], { stdio: 'inherit', timeout: 600000 });\n"


def read(name):
    p = ROOT / name
    assert p.is_file() and not p.is_symlink(), f'Missing/replaced {name}'
    return p.read_bytes()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def authenticated(name):
    data = read(name)
    assert sha(data) == PINS[name], f'Pinned source/evidence changed: {name}'
    return data


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, timeout=30)


def transformed(before, delta):
    result = dict(before)
    for name, value in delta['removed'].items():
        assert result.pop(name) == value, f'Unexpected removed identity: {name}'
    for name, values in delta['changed'].items():
        assert result[name] == values['before'], f'Unexpected original node: {name}'
        result[name] = values['after']
    for name, value in delta['added'].items():
        assert name not in result, f'Identity already existed: {name}'
        result[name] = value
    return result


def metadata(flags, cwd):
    args = ['cargo', 'metadata', '--locked', '--offline', '--format-version', '1', *flags]
    p = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=60)
    if p.returncode and any(s in p.stderr for s in ['no matching package named', 'failed to download', 'attempting to make an HTTP request']):
        args.remove('--offline')
        p = subprocess.run(args, cwd=cwd, capture_output=True, text=True,
                           env=dict(os.environ, CARGO_HTTP_TIMEOUT='55', CARGO_NET_RETRY='0'), timeout=240)
    assert p.returncode == 0, p.stderr
    return json.loads(p.stdout)


def main():
    # FR// Garder le diagnostic exact de la mutation historique braces.
    # EN// Keep the exact diagnostic required by the historical braces mutation.
    mitigation = read('patches/braces-3.0.3.patch')
    old_port = json.loads(read('docs/history/glib-qh011-20261023/PORT.json'))
    actual_blob = hashlib.sha1(f'blob {len(mitigation)}\0'.encode() + mitigation).hexdigest()
    assert actual_blob == old_port['initial_files']['patches/braces-3.0.3.patch']['sha'], 'Historical mitigation changed'
    port = json.loads(authenticated(f'{HISTORY}/PORT.json'))
    assert port['base_sha'] == BASE and port['base_tree'] == TREE
    assert len(port['initial_files']) == 309
    # FR// Importer uniquement le contrôleur historique authentifié, sans lancer son main.
    # EN// Import only the authenticated historical controller without executing its main.
    authenticated('Scripts/check-glib-qh011.py')
    spec = importlib.util.spec_from_file_location('historical_glib', ROOT / 'Scripts/check-glib-qh011.py')
    old = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(old)
    assert old.tree_identity(port['initial_files']) == TREE, 'Initial Git tree changed'
    for name, entry in port['initial_files'].items():
        location = f'{HISTORY}/{name}' if name in port['modified_files'] else name
        data = read(location)
        assert sha(data) == entry['sha256'], f'Initial bytes/archive changed {name}'
        assert git('hash-object', '--path', name, location).decode().strip() == entry['sha'], f'Initial blob changed {name}'
        assert ('100755' if (ROOT / location).stat().st_mode & 0o111 else '100644') == entry['mode'], f'Mode changed {name}'
    assert read('docs/validation/rust-178/check-ported-graph.cjs') == WRAPPER.encode(), 'SQLite guard entry point changed'
    for name in PINS:
        authenticated(name)
    allowed = set(port['initial_files']) | set(port['added_files'])
    listed = set(filter(None, (git('ls-files', '-z') + git('ls-files', '--others', '--exclude-standard', '-z')).decode().split('\0')))
    assert listed == allowed, f'Unexpected or missing deliverables: {sorted(listed ^ allowed)}'
    for name in port['added_files']:
        read(name)
    delta = json.loads(authenticated(f'{HISTORY}/TRANSFORMATIONS.json'))
    before = tomllib.loads(read(f'{HISTORY}/Cargo.lock').decode())
    after = tomllib.loads(read('Cargo.lock').decode())
    key = lambda p: p['name'] + '@' + p['version']
    assert {key(p): p for p in after['package']} == transformed({key(p): p for p in before['package']}, delta['lock']), 'Unauthorized lock transformation'
    assert len(after['package']) == 501
    assert [p['version'] for p in after['package'] if p['name'] == 'libsqlite3-sys'] == ['0.39.1']
    assert not any(p['name'] == 'sqlcipher-src' for p in after['package']), 'Unexpected SQLCipher source'
    # FR// Certaines variables amont peuvent remplacer bundled par une bibliothèque système.
    # EN// Upstream environment variables can override bundled with a system library.
    assert os.environ.get('LIBSQLITE3_SYS_USE_PKG_CONFIG', '0') == '0', 'System SQLite override is not reviewed'
    assert not os.environ.get('SQLITE3_LIB_DIR'), 'External SQLite library is not reviewed'
    for suffix, flags in [('', []), ('-all', ['--all-features'])]:
        before_graph = json.loads(authenticated(f'{HISTORY}/graph{suffix}-before.json'))
        expected = transformed(before_graph, delta['graph'+suffix])
        data = metadata(flags, ROOT)
        assert old.graph(data) == expected, 'Unexpected features/edges/targets'
        packages = {key(p): p for p in data['packages']}
        assert Path(packages['glib@0.18.5']['manifest_path']).resolve() == ROOT / 'vendor/glib-0.18.5/Cargo.toml', 'Wrong GLib source'
        sources = json.loads(authenticated(f'{HISTORY}/SOURCES.json'))
        for name, evidence in sources.items():
            pkg = packages[name]
            assert pkg['source'] == 'registry+https://github.com/rust-lang/crates.io-index', f'Wrong registry source {name}'
            folder = Path(pkg['manifest_path']).parent
            for path, digest in evidence['files'].items():
                assert sha((folder / path).read_bytes()) == digest, f'Wrong compiled source {name}/{path}'
            assert evidence['crate_sha256'] == next(p['checksum'] for p in after['package'] if key(p) == name)
        assert {'bundled', 'chrono'} <= set(expected['rusqlite@0.41.1']['features'])
        assert 'bundled' in expected['libsqlite3-sys@0.39.1']['features']
        assert not any('sqlcipher' in f for f in expected['libsqlite3-sys@0.39.1']['features'])
        if not flags:
            nested = metadata([], ROOT / 'src-tauri')
            assert old.graph(nested) == expected, 'src-tauri graph differs'
            assert Path(next(p['manifest_path'] for p in nested['packages'] if p['name'] == 'glib')).resolve() == ROOT / 'vendor/glib-0.18.5/Cargo.toml'
    # FR// Vue historique exacte : aucune assertion GLib/Tokio/JS antérieure n'est réécrite.
    # EN// Exact historical view: no existing GLib/Tokio/JS assertion is rewritten.
    with tempfile.TemporaryDirectory(prefix='qh-sqlite-baseline-') as temp:
        view = Path(temp) / 'view'
        view.mkdir()
        for name, entry in port['initial_files'].items():
            target = view / name
            target.parent.mkdir(parents=True, exist_ok=True)
            source = ROOT / (f'{HISTORY}/{name}' if name in port['modified_files'] else name)
            shutil.copyfile(source, target)
            target.chmod(0o755 if entry['mode'] == '100755' else 0o644)
        (view / 'node_modules').symlink_to(ROOT / 'node_modules', target_is_directory=True)
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')
        for name in ('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE'):
            env.pop(name, None)
        git_dir = Path(temp) / 'git'
        subprocess.run(['git', 'init', '--bare', '--initial-branch=preservation', str(git_dir)], check=True, capture_output=True, env=env, timeout=30)
        env.update(GIT_DIR=str(git_dir), GIT_WORK_TREE=str(view))
        p = subprocess.run(['node', 'docs/validation/rust-178/check-ported-graph.cjs'], cwd=view, env=env, capture_output=True, text=True, timeout=600)
        assert p.returncode == 0, p.stderr or p.stdout
        historical = json.loads(p.stdout)
    print(json.dumps({'status': 'PASS', 'base': BASE, 'initialFiles': 309,
                      'unchangedFiles': 306, 'archivedModifiedFiles': 3,
                      'lockBefore': 504, 'lockAfter': 501, 'historical': historical}))


if __name__ == '__main__':
    main()
