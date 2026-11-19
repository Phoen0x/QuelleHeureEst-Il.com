#!/usr/bin/env python3
"""FR : authentifier la seule mise à jour rustix et rejouer la conservation historique.
EN: authenticate the sole rustix update and replay historical preservation.
"""
import sys
if sys.flags.optimize != 0:
    raise RuntimeError("Optimisation Python interdite pour les gardes de conservation / Python optimization is forbidden")
sys.dont_write_bytecode = True
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
HISTORY = 'docs/history/rustix-20261119'
PINS = {'docs/history/rustix-20261119/PORT.json': 'c07d25e0c2d5b599b7c523e2983f35bdd1501b0fe3125b140125670be39fc9e7', 'docs/history/rustix-20261119/TRANSFORMATIONS.json': '8a48bfd42cd612e8905d436bc79c276520ce897aabfbc0ace50bba4e176216b4', 'docs/history/rustix-20261119/SOURCES.json': 'cc73ba2a2cfc821cb786257aad53061c4b69727b7f12f1c18652912e360a3b1b', 'docs/history/rustix-20261119/graph-before.json': 'e8ce7233a41c735c830aeb06d952095d74b638bade4bfc4d1d0859794ec5d0e6', 'docs/history/rustix-20261119/graph-all-before.json': '1a66e38cc2889d4026886831d509005eef02bd621d8a0ea95662edd5c7033aea'}
WRAPPER_TEMPLATE = "// FR// Authentifier la nouvelle garde avant de rejouer la conservation historique.\n// EN// Authenticate the new guard before replaying historical preservation.\nconst { execFileSync } = require('node:child_process');\nconst fs = require('node:fs');\nconst path = require('node:path');\nconst crypto = require('node:crypto');\nconst guard = path.resolve(__dirname, '../../../Scripts/check-rustix-rustsec.py');\nif (crypto.createHash('sha256').update(fs.readFileSync(guard)).digest('hex') !== 'GUARD_SHA256') {\n  throw new Error('AssertionError: Rustix guard bytes changed');\n}\nexecFileSync('python3', [guard], { stdio: 'inherit', timeout: 600000 });\n"
SQLITE_TAIL = "if __name__ == '__main__':\n    main()\n"
SQLITE_DISPATCH = "if __name__ == '__main__':\n    # FR// Appliquer aussi la garde rustix lors d'un lancement direct historique.\n    # EN// Apply the rustix guard to direct historical entry-point invocations too.\n    import runpy\n    runpy.run_path(str(ROOT / 'Scripts/check-rustix-rustsec.py'), run_name='__main__')\n"


def read(name):
    p = ROOT / name
    assert p.is_file() and not p.is_symlink(), f'Missing/replaced {name}'
    return p.read_bytes()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, timeout=30)


def metadata(cwd, flags):
    args = ['cargo', 'metadata', '--locked', '--offline', '--format-version', '1', *flags]
    p = subprocess.run(args, cwd=cwd, text=True, capture_output=True, timeout=60)
    if p.returncode and any(s in p.stderr for s in ['no matching package named', 'failed to download', 'attempting to make an HTTP request']):
        args.remove('--offline')
        p = subprocess.run(args, cwd=cwd, text=True, capture_output=True, env=dict(os.environ, CARGO_HTTP_TIMEOUT='55', CARGO_NET_RETRY='0'), timeout=240)
    assert p.returncode == 0, p.stderr
    return json.loads(p.stdout)


def main():
    # FR// Garder les diagnostics historiques attendus, sans masquer les substitutions natives.
    # EN// Retain expected historical diagnostics without masking native substitutions.
    mitigation = read('patches/braces-3.0.3.patch')
    ref = json.loads(read('docs/history/glib-qh011-20261023/PORT.json'))
    assert hashlib.sha1(f'blob {len(mitigation)}\0'.encode() + mitigation).hexdigest() == ref['initial_files']['patches/braces-3.0.3.patch']['sha'], 'Historical mitigation changed'
    assert os.environ.get('LIBSQLITE3_SYS_USE_PKG_CONFIG', '0') == '0', 'System SQLite override is not reviewed'
    assert not os.environ.get('SQLITE3_LIB_DIR'), 'External SQLite library is not reviewed'
    for name, digest in PINS.items():
        assert sha(read(name)) == digest, f'Pinned evidence changed {name}'
    port = json.loads(read(f'{HISTORY}/PORT.json'))
    assert port['base'] == '86aae25c0be8479e2ffbfa7b09254d4b0c9810b6'
    for name, entry in port['initial_files'].items():
        location = f'{HISTORY}/{name}' if name in port['modified'] else name
        assert sha(read(location)) == entry['sha256'], f'Initial source/archive changed {name}'
        assert git('hash-object', '--path', name, location).decode().strip() == entry['sha']
        assert ('100755' if (ROOT / location).stat().st_mode & 0o111 else '100644') == entry['mode']
    # FR// Importer le GLib authentifié pour sa normalisation et son calcul d'identité Git.
    # EN// Import authenticated GLib for normalization and Git tree identity calculation.
    spec = importlib.util.spec_from_file_location('old_glib', ROOT / 'Scripts/check-glib-qh011.py')
    old = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(old)
    assert len(port['initial_files']) == 335
    assert old.tree_identity(port['initial_files']) == '2f68d4d412c3aeeed86917c2dbc29e3feb43e535'
    prior = read(f'{HISTORY}/Scripts/check-sqlite-rustsec.py')
    assert prior.endswith(SQLITE_TAIL.encode())
    assert read('Scripts/check-sqlite-rustsec.py') == prior[:-len(SQLITE_TAIL)] + SQLITE_DISPATCH.encode(), 'Historical guard dispatcher changed'
    own_hash = sha(read('Scripts/check-rustix-rustsec.py'))
    assert read('docs/validation/rust-178/check-ported-graph.cjs') == WRAPPER_TEMPLATE.replace('GUARD_SHA256', own_hash).encode(), 'Rustix guard entry point changed'
    listed = set(filter(None, (git('ls-files', '-z') + git('ls-files', '--others', '--exclude-standard', '-z')).decode().split('\0')))
    assert listed == set(port['initial_files']) | set(port['added']), 'Unexpected/missing deliverables'
    for name in port['added']:
        read(name)
    change = json.loads(read(f'{HISTORY}/TRANSFORMATIONS.json'))
    before = read(f'{HISTORY}/Cargo.lock')
    assert before.count(change['old_lock_fragment'].encode()) == 1
    assert read('Cargo.lock') == before.replace(change['old_lock_fragment'].encode(), change['new_lock_fragment'].encode(), 1), 'Unauthorized lock transformation'
    for suffix, flags in [('', []), ('-all', ['--all-features'])]:
        before_graph = read(f'{HISTORY}/graph{suffix}-before.json').decode()
        expected = json.loads(before_graph.replace('rustix@1.1.5', 'rustix@1.1.6'))
        data = metadata(ROOT, flags)
        assert old.graph(data) == expected, 'Unexpected dependency features/edges/targets'
        source = next(p for p in data['packages'] if p['name'] == 'rustix')
        assert source['version'] == '1.1.6' and source['source'] == 'registry+https://github.com/rust-lang/crates.io-index'
        folder = Path(source['manifest_path']).parent
        provenance = json.loads(read(f'{HISTORY}/SOURCES.json'))
        for name, digest in provenance['files'].items():
            assert sha((folder / name).read_bytes()) == digest, f'Wrong compiled rustix source {name}'
        if not flags:
            assert old.graph(metadata(ROOT / 'src-tauri', [])) == expected
    # FR// Reconstituer #199 à l'octet, avec ses propres gardes et tous leurs ancêtres.
    # EN// Reconstruct PR #199 byte for byte, including its own guards and all ancestors.
    with tempfile.TemporaryDirectory(prefix='qh-rustix-baseline-') as temp:
        view = Path(temp) / 'view'
        view.mkdir()
        for name, entry in port['initial_files'].items():
            target = view / name
            target.parent.mkdir(parents=True, exist_ok=True)
            source = ROOT / (f'{HISTORY}/{name}' if name in port['modified'] else name)
            shutil.copyfile(source, target)
            target.chmod(0o755 if entry['mode'] == '100755' else 0o644)
        (view / 'node_modules').symlink_to(ROOT / 'node_modules', target_is_directory=True)
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')
        for key in ('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE'):
            env.pop(key, None)
        git_dir = Path(temp) / 'git'
        subprocess.run(['git', 'init', '--bare', '--initial-branch=preservation', str(git_dir)], env=env, check=True, capture_output=True, timeout=30)
        env.update(GIT_DIR=str(git_dir), GIT_WORK_TREE=str(view))
        p = subprocess.run(['node', 'docs/validation/rust-178/check-ported-graph.cjs'], cwd=view, env=env, text=True, capture_output=True, timeout=600)
        assert p.returncode == 0, p.stderr or p.stdout
        historical = json.loads(p.stdout)
    print(json.dumps({'status': 'PASS', 'initialFiles': 335, 'unchangedFiles': 332,
                      'onlyLockDelta': 'rustix version/checksum 1.1.5 -> 1.1.6', 'historical': historical}))


if __name__ == '__main__':
    main()
