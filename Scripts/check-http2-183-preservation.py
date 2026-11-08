#!/usr/bin/env python3
"""FR : contrôler le portage ciblé sans modifier le checkout.
EN: check the targeted port without modifying the checkout.
"""
import json
from pathlib import Path
import subprocess
import tomllib

BASE = 'b880e9d0fefbb8662b7fdc46d3831a7c47684cf9'
HISTORY = 'docs/history/http2-183-20261022'
MODIFIED = {'Cargo.lock', 'src-tauri/Cargo.toml'}
ADDITIONS = {
    'Scripts/check-http2-183-preservation.py',
    'src-tauri/tests/http_client.rs',
    f'{HISTORY}/Cargo.lock', f'{HISTORY}/src-tauri/Cargo.toml',
    f'{HISTORY}/PR183.before.md',
    'docs/development/linux-environment-20261022.md',
    'docs/development/debian13-packages-20261022.json',
    'docs/reports/http2-183-20261022.md',
    'docs/reports/http2-183-20261022-evidence.json',
}
ROOT = Path(__file__).resolve().parents[1]


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, timeout=30)


def main():
    baseline = {}
    for entry in git('ls-tree', '-r', '-z', BASE).split(b'\0'):
        if not entry:
            continue
        meta, name = entry.split(b'\t', 1)
        mode, kind, blob = meta.decode().split()
        assert kind == 'blob'
        baseline[name.decode()] = (mode, blob)
    assert len(baseline) == 113
    for name, (mode, blob) in baseline.items():
        p = ROOT / name
        assert p.is_file() and not p.is_symlink(), f'Missing/replaced file: {name}'
        if name not in MODIFIED:
            assert git('hash-object', '--path', name, name).decode().strip() == blob, name
        if mode == '100755':
            assert p.stat().st_mode & 0o111, name
    tracked = set(git('ls-files', '-z').decode().strip('\0').split('\0'))
    untracked = set(filter(None, git('ls-files', '--others', '--exclude-standard', '-z').decode().split('\0')))
    assert (tracked | untracked) - set(baseline) <= ADDITIONS
    for name in MODIFIED:
        assert (ROOT / HISTORY / name).read_bytes() == git('show', f'{BASE}:{name}'), name

    before = tomllib.loads((ROOT / HISTORY / 'src-tauri/Cargo.toml').read_text())
    after = tomllib.loads((ROOT / 'src-tauri/Cargo.toml').read_text())
    assert set(after) == set(before) | {'dev-dependencies'}
    for key in before:
        if key != 'dependencies':
            assert before[key] == after[key], key
    for name, value in before['dependencies'].items():
        current = after['dependencies'][name]
        if name == 'reqwest':
            assert current == {**value, 'version': '=0.12.28'}
        else:
            assert current == value, name
    assert set(after['dependencies']) - set(before['dependencies']) == {'httpdate', 'rustls-pemfile'}
    for name, version in [('httpdate', '=1.0.3'), ('rustls-pemfile', '=1.0.4')]:
        assert after['dependencies'][name] == {'version': version, 'optional': True}
    assert after['dev-dependencies'] == {'h2': '=0.4.20', 'http': '1', 'bytes': '1'}

    old = tomllib.loads((ROOT / HISTORY / 'Cargo.lock').read_text())['package']
    new = tomllib.loads((ROOT / 'Cargo.lock').read_text())['package']
    old_names = {p['name'] for p in old}
    new_names = {p['name'] for p in new}
    assert old_names <= new_names, sorted(old_names - new_names)
    assert [(p['name'], p['version']) for p in new if p['name'] == 'h2'] == [('h2', '0.4.20')]
    tauri = lambda packages: sorted((p['name'], p['version'], p.get('source'), p.get('checksum')) for p in packages if p['name'].startswith('tauri'))
    assert tauri(old) == tauri(new), 'Tauri family changed'
    identity = lambda p: (p['name'], p['version'], p.get('source'))
    previous = {identity(p): p for p in old}
    for p in new:
        if identity(p) in previous:
            assert p.get('checksum') == previous[identity(p)].get('checksum'), identity(p)
    metadata = json.loads(subprocess.check_output(
        ['cargo', 'metadata', '--locked', '--offline', '--format-version', '1'],
        cwd=ROOT, timeout=60, stderr=subprocess.PIPE))
    nodes = {n['id']: n for n in metadata['resolve']['nodes']}
    package = next(p for p in metadata['packages'] if p['name'] == 'quelleheureest')
    direct = next(d for d in nodes[package['id']]['deps'] if d['name'] == 'reqwest')
    reqwest = next(p for p in metadata['packages'] if p['id'] == direct['pkg'])
    assert reqwest['version'] == '0.12.28'
    features = nodes[reqwest['id']]['features']
    assert {'default-tls', 'json', 'http2', 'charset', 'system-proxy'} <= set(features)
    assert not any(f.startswith('rustls') for f in features), features
    assert any(t['name'] == 'http_client' and 'test' in t['kind'] for t in package['targets'])
    result = {'status': 'PASS', 'base': BASE, 'original_files': len(baseline),
              'unchanged_original_files': len(baseline) - len(MODIFIED),
              'archived_modified_files': sorted(MODIFIED),
              'old_packages': len(old), 'new_packages': len(new),
              'preserved_package_names': len(old_names), 'missing_package_names': [],
              'added_package_names': sorted(new_names - old_names),
              'tauri_family_unchanged': True, 'h2_versions': ['0.4.20'],
              'application_reqwest': reqwest['version'], 'reqwest_features': features}
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
