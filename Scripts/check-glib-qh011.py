#!/usr/bin/env python3
"""FR : authentifier le rétroport, les graphes et toutes les gardes antérieures.
EN: authenticate the backport, dependency graphs and all previous guards.
"""
from pathlib import Path
import hashlib
import io
import json
import os
import shutil
import subprocess
import tarfile
import tempfile
import tomllib

ROOT = Path(__file__).resolve().parents[1]
HISTORY = 'docs/history/glib-qh011-20261023'
BASE = 'd033c8ea819614b4676f4db057ee3ef62c33f264'
TREE = '4fc715e4c072157da700305ea2490a34a7606b59'
CHECKSUM = '233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5'
GRAPH_HASHES = {
    'metadata-before-graph.json': '5062ac391bdd64fe5bdcd981e7dbea45a42c909f53876466c84688195ea2c07b',
    'metadata-all-before-graph.json': '6ad6b9f64de34ef61797aa867f0178d5a82d2c3b0fb820a6cf2dac03562a06b7',
}
MODIFIED = ['Cargo.toml', 'Cargo.lock', 'src-tauri/Cargo.toml',
            'docs/validation/rust-178/check-ported-graph.cjs']
WORKSPACE_SUFFIX = '\n# FR// Conserver la crate complète sans compiler ses tests et exemples comme membres applicatifs.\n# EN// Preserve the complete crate without making its tests and examples application members.\nexclude = ["vendor/glib-0.18.5"]\n'
MANIFEST_SUFFIX = '\n# FR// Les régressions Linux utilisent exactement le GLib partagé par GTK/Tauri.\n# EN// Linux regressions use the exact GLib shared by GTK/Tauri.\n[target.\'cfg(target_os = "linux")\'.dev-dependencies]\nglib = "=0.18.5"\n'
CONFIG = '# FR// Substituer le code GLib sans perdre son identité de registre dans le verrou et les audits.\n# EN// Override GLib source while retaining its registry identity in the lockfile and audits.\npaths = ["vendor/glib-0.18.5"]\n'
WRAPPER = "// FR// Cumuler les gardes historiques et la conservation du rétroport GLib.\n// EN// Combine historical guards with GLib backport preservation.\nconst { execFileSync } = require('node:child_process');\nexecFileSync('python3', [require('node:path').resolve(__dirname, '../../../Scripts/check-glib-qh011.py')], { stdio: 'inherit', timeout: 600000 });\n"


def read(name):
    return (ROOT / name).read_bytes()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def blob(data):
    return hashlib.sha1(f'blob {len(data)}\0'.encode() + data).hexdigest()


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, timeout=30)


def tree_identity(files):
    tree = {}
    for name, entry in files.items():
        current = tree
        parts = name.split('/')
        for part in parts[:-1]:
            current = current.setdefault(part, {})
        current[parts[-1]] = entry

    def walk(current):
        entries = []
        for name, value in current.items():
            leaf = 'sha' in value
            entries.append((name, value['mode'] if leaf else '40000',
                            value['sha'] if leaf else walk(value), not leaf))
        entries.sort(key=lambda e: (e[0] + ('/' if e[3] else '')).encode())
        data = b''.join(f'{mode} {name}\0'.encode() + bytes.fromhex(digest)
                        for name, mode, digest, _ in entries)
        return hashlib.sha1(f'tree {len(data)}\0'.encode() + data).hexdigest()

    return walk(tree)


def graph(metadata):
    keys = {p['id']: p['name'] + '@' + p['version'] for p in metadata['packages']}
    return {keys[n['id']]: {'features': n['features'], 'deps': sorted([
        {'name': d['name'], 'pkg': keys[d['pkg']], 'dep_kinds': d['dep_kinds']}
        for d in n['deps']], key=lambda d: (d['name'], d['pkg']))}
        for n in metadata['resolve']['nodes']}


def metadata(cwd, *extra):
    command = ['cargo', 'metadata', '--locked', '--offline', '--format-version', '1', *extra]
    p = subprocess.run(command, cwd=cwd, capture_output=True, text=True, timeout=60)
    # FR// En CI neuve, télécharger uniquement si le cache verrouillé est incomplet, une tentative bornée.
    # EN// In fresh CI, download only when the locked cache is incomplete, with one bounded attempt.
    missing_cache = any(message in p.stderr for message in (
        'attempting to make an HTTP request, but --offline was specified',
        'no matching package named', 'failed to download'))
    if p.returncode and missing_cache:
        environment = dict(os.environ, CARGO_HTTP_TIMEOUT='55', CARGO_NET_RETRY='0')
        command.remove('--offline')
        p = subprocess.run(command, cwd=cwd, env=environment, capture_output=True, text=True, timeout=240)
    assert p.returncode == 0, p.stderr
    data = json.loads(p.stdout)
    glib = [p for p in data['packages'] if p['name'] == 'glib']
    assert len(glib) == 1 and glib[0]['version'] == '0.18.5'
    assert Path(glib[0]['manifest_path']).resolve() == ROOT / 'vendor/glib-0.18.5/Cargo.toml', 'Wrong compiled GLib source'
    assert len(data['workspace_members']) == 1, 'Vendor crate became a workspace member'
    return graph(data)


def main():
    reference = json.loads(read(f'{HISTORY}/PORT.json'))
    assert reference['base_sha'] == BASE and reference['base_tree'] == TREE
    assert len(reference['initial_files']) == 165
    assert tree_identity(reference['initial_files']) == TREE, 'Initial tree identity changed'
    assert reference['modified_files'] == MODIFIED
    assert reference['graph_hashes'] == GRAPH_HASHES
    assert reference['upstream_commit'] == 'b5a4071e439bef2b5eea76c3aa25e5ae84839e34'
    assert reference['upstream_url'] == 'https://github.com/gtk-rs/gtk-rs-core/pull/1343'
    # FR// Conserver le diagnostic historique utilisé par les mutations négatives braces.
    # EN// Preserve the historical diagnostic used by negative braces mutations.
    assert blob(read('patches/braces-3.0.3.patch')) == reference['initial_files']['patches/braces-3.0.3.patch']['sha'], 'Historical mitigation changed'
    for name, entry in reference['initial_files'].items():
        checked = f'{HISTORY}/{name}' if name in MODIFIED else name
        p = ROOT / checked
        assert p.is_file() and not p.is_symlink(), f'Missing/replaced {name}'
        # FR// Respecter les filtres Git déclarés, notamment les fins de ligne des variantes Windows.
        # EN// Respect declared Git filters, including Windows variant line endings.
        assert git('hash-object', '--path', name, checked).decode().strip() == entry['sha'], f'Initial file/archive changed {name}'
        assert ('100755' if p.stat().st_mode & 0o111 else '100644') == entry['mode'], f'Mode changed {name}'
        if name in MODIFIED:
            assert reference['archives'][name] == {'git_blob': entry['sha'], 'sha256': sha(p.read_bytes())}
    assert read('Cargo.toml') == read(f'{HISTORY}/Cargo.toml') + WORKSPACE_SUFFIX.encode(), 'Workspace changed beyond vendor exclusion'
    assert read('src-tauri/Cargo.toml') == read(f'{HISTORY}/src-tauri/Cargo.toml') + MANIFEST_SUFFIX.encode(), 'Manifest changed beyond Linux test dependency'
    assert read('.cargo/config.toml') == CONFIG.encode(), 'Cargo source substitution changed'
    assert read(MODIFIED[-1]) == WRAPPER.encode(), 'Guard entry point changed'

    before = read(f'{HISTORY}/Cargo.lock')
    start = before.index(b'name = "quelleheureest"\n')
    end = before.index(b'\n[[package]]', start)
    block = before[start:end]
    assert block.count(b' "env_logger",\n') == 1
    expected = before[:start] + block.replace(b' "env_logger",\n', b' "env_logger",\n "glib",\n') + before[end:]
    assert read('Cargo.lock') == expected, 'Only the application GLib dev-test edge may change'
    lock = tomllib.loads(read('Cargo.lock').decode())
    assert len(lock['package']) == 504
    original_glib = next(p for p in lock['package'] if p['name'] == 'glib')
    assert original_glib['checksum'] == CHECKSUM
    assert original_glib['source'] == 'registry+https://github.com/rust-lang/crates.io-index'

    archive = read(f'{HISTORY}/glib-0.18.5.crate')
    assert sha(archive) == CHECKSUM == reference['archive_sha256'], 'Official archive checksum changed'
    vendor = ROOT / 'vendor/glib-0.18.5'
    expected_files = set()
    with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as source:
        for entry in source.getmembers():
            if not entry.isfile():
                assert entry.isdir()
                continue
            relative = Path(entry.name).relative_to('glib-0.18.5')
            assert '..' not in relative.parts
            expected_files.add(relative.as_posix())
            expected = source.extractfile(entry).read()
            if relative.as_posix() == 'src/variant_iter.rs':
                assert expected.count(b'let p: *mut libc::c_char = std::ptr::null_mut();') == 1
                assert expected.count(b'                &p,\n') == 1
                expected = expected.replace(b'let p: *mut libc::c_char = std::ptr::null_mut();', b'let mut p: *mut libc::c_char = std::ptr::null_mut();').replace(b'                &p,\n', b'                &mut p,\n')
            p = vendor / relative
            assert p.is_file() and not p.is_symlink() and p.read_bytes() == expected, f'Unexpected vendor source change {relative}'
    assert len(expected_files) == 121
    assert not any(p.is_symlink() for p in vendor.rglob('*'))
    assert {p.relative_to(vendor).as_posix() for p in vendor.rglob('*') if p.is_file()} == expected_files
    additions = {f'{HISTORY}/{n}' for n in MODIFIED} | {
        f'{HISTORY}/PORT.json', f'{HISTORY}/glib-0.18.5.crate',
        f'{HISTORY}/metadata-before-graph.json', f'{HISTORY}/metadata-all-before-graph.json',
        '.cargo/config.toml', 'patches/GLIB_0.18.5_BACKPORT_QH011.md',
        'src-tauri/tests/glib_variant_str_iter.rs', 'Scripts/check-glib-qh011.py',
        'Scripts/run-glib-variant-regressions.py', 'tests/dependency_updates/glib-qh011.test.cjs',
        'docs/reports/glib-qh011-20261023.md', 'docs/reports/glib-qh011-20261023-evidence.json',
    } | {'vendor/glib-0.18.5/' + n for n in expected_files}
    assert set(reference['added_files']) == additions
    listed = set(filter(None, (git('ls-files', '-z') + git('ls-files', '--others', '--exclude-standard', '-z')).decode().split('\0')))
    assert listed <= set(reference['initial_files']) | additions, f'Out of scope: {sorted(listed - set(reference["initial_files"]) - additions)}'
    for name in additions:
        assert (ROOT / name).is_file() and not (ROOT / name).is_symlink(), f'Missing/replaced deliverable {name}'
    for filename, flags in [('metadata-before-graph.json', []), ('metadata-all-before-graph.json', ['--all-features'])]:
        raw = read(f'{HISTORY}/{filename}')
        assert sha(raw) == GRAPH_HASHES[filename], 'Historical graph changed'
        previous = json.loads(raw)
        previous['quelleheureest@0.0.1']['deps'].append({'name': 'glib', 'pkg': 'glib@0.18.5', 'dep_kinds': [{'kind': 'dev', 'target': 'cfg(target_os = "linux")'}]})
        previous['quelleheureest@0.0.1']['deps'].sort(key=lambda d: (d['name'], d['pkg']))
        assert metadata(ROOT, *flags) == previous, 'Dependency features/edges changed beyond the test edge'
        if not flags:
            assert metadata(ROOT / 'src-tauri') == previous, 'src-tauri resolves a different source/graph'

    # FR// Rejouer les gardes inchangées sur les 165 fichiers initiaux authentifiés.
    # EN// Replay unchanged guards on the authenticated 165-file baseline.
    with tempfile.TemporaryDirectory(prefix='qh011-glib-baseline-') as temp:
        view = Path(temp) / 'view'
        view.mkdir()
        for name, entry in reference['initial_files'].items():
            target = view / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / (f'{HISTORY}/{name}' if name in MODIFIED else name), target)
            target.chmod(0o755 if entry['mode'] == '100755' else 0o644)
        (view / 'node_modules').symlink_to(ROOT / 'node_modules', target_is_directory=True)
        environment = dict(os.environ)
        for key in ('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE'):
            environment.pop(key, None)
        git_dir = Path(temp) / 'git'
        subprocess.run(['git', 'init', '--bare', '--initial-branch=preservation', str(git_dir)], env=environment, check=True, capture_output=True, timeout=30)
        environment.update(GIT_DIR=str(git_dir), GIT_WORK_TREE=str(view))
        p = subprocess.run(['node', 'docs/validation/rust-178/check-ported-graph.cjs'], cwd=view, env=environment, capture_output=True, text=True, timeout=30)
        assert p.returncode == 0, p.stderr or p.stdout
        historical = json.loads(p.stdout)
    print(json.dumps({'status': 'PASS', 'base': BASE, 'originalFiles': 165,
                     'unchangedFiles': 161, 'archivedModifiedFiles': MODIFIED,
                     'vendorFiles': 121, 'onlyUpstreamVariantStrIterFix': True,
                     'cargoPackages': 504, 'onlyAddedEdge': 'Linux GLib dev-test dependency',
                     'glibSource': 'vendor/glib-0.18.5', 'pnpmSnapshotsUnchanged': 409,
                     'optionalSnapshotsUnchanged': 140, 'historicalGuards': historical}, indent=2))


if __name__ == '__main__':
    main()
