#!/usr/bin/env python3
import base64
import hashlib
import json
import os
import subprocess
import sys
import tarfile
import urllib.request
from pathlib import Path

BASE = 'ddcef79479a6804ed52c8cf92710f87d4d5404f9'
UPSTREAM = '6cc889803a44be232802143499d904799f58abc0'
ROOT = Path(__file__).resolve().parents[3]
AUDIT = ROOT / 'docs/audits/renovate-worker-168'
OUTPUT = Path(os.environ['AUDIT_OUTPUT'])
OUTPUT.mkdir(parents=True, exist_ok=True)


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def git(*args, cwd=ROOT):
    return subprocess.check_output(['git', '-C', str(cwd), *args])


def source():
    head = git('rev-parse', 'HEAD').decode().strip()
    require(head == os.environ.get('CI_HEAD_SHA', head), 'Checkout différent du SHA exact de la PR')
    require(os.environ.get('CI_BASE_SHA', BASE) == BASE, 'La branche cible ne correspond plus au SHA audité')
    subprocess.run(['git', '-C', str(ROOT), 'merge-base', '--is-ancestor', BASE, 'HEAD'], check=True)
    current = {entry.split(b'\t', 1)[1]: entry.split(b'\t', 1)[0] for entry in git('ls-tree', '-rz', 'HEAD').split(b'\0') if entry}
    records = []
    for entry in git('ls-tree', '-rz', BASE).split(b'\0'):
        if not entry:
            continue
        meta, path = entry.split(b'\t', 1)
        mode, kind, expected = meta.decode().split()
        require(kind == 'blob', 'Type historique non pris en charge')
        require(current.get(path) == meta, f'Blob/mode Git historique modifié : {path!r}')
        file = ROOT / path.decode()
        # FR : respecter les CRLF imposés aux scripts Windows par les attributs historiques.
        # EN: Respect CRLF required for Windows scripts by historical Git attributes.
        blob = git('hash-object', '--path=' + path.decode(), str(file)).decode().strip()
        require(blob == expected, f'Blob historique modifié : {path!r}')
        records.append({'path': path.decode(), 'blob': blob})
    for line in git('diff', '--name-status', BASE, 'HEAD').decode().splitlines():
        status, path = line.split('\t', 1)
        require(status == 'A' and (path == '.github/workflows/renovate-audit-ci.yml' or path.startswith('docs/audits/renovate-ci-170/')), f'Diff hors périmètre : {line}')
    for line in (AUDIT / 'SHA256SUMS').read_text().splitlines():
        digest, relative = line.split('  ', 1)
        require(hashlib.sha256((AUDIT / relative).read_bytes()).hexdigest() == digest, f'Checksum historique : {relative}')
    require(not git('diff', '--name-only').strip(), 'Fichiers suivis modifiés pendant le job')
    # FR : le checkout ne doit pas avoir laissé de credential Git exploitable.
    # EN: Checkout must not leave usable Git credentials behind.
    config = subprocess.run(['git', '-C', str(ROOT), 'config', '--local', '--get-regexp', r'http\..*extraheader|credential'], capture_output=True)
    require(config.returncode == 1, 'Credential Git persistant ou erreur de lecture de configuration')
    report = {'audited_sha': BASE, 'head': head, 'preexisting_blobs_unchanged': len(records), 'historical_checksums': 'PASS', 'records': records}
    (OUTPUT / 'source-integrity.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'PASS : {len(records)} blobs historiques et SHA exact {head}')


def tools():
    tool_root = Path(os.environ['AUDIT_TOOLS'])
    upstream = Path(os.environ['AUDIT_UPSTREAM'])
    lock_bytes = (AUDIT / 'tooling/package-lock.json').read_bytes()
    require((tool_root / 'package-lock.json').read_bytes() == lock_bytes, 'Verrou de préparation différent')
    lock = json.loads(lock_bytes)
    require(git('rev-parse', 'HEAD', cwd=upstream).decode().strip() == UPSTREAM, 'Commit amont différent')
    require(git('rev-parse', '44.164.1^{commit}', cwd=upstream).decode().strip() == UPSTREAM, 'Tag amont différent')
    package = lock['packages']['node_modules/renovate']
    require(package['version'] == '44.164.1', 'Version npm différente')
    url = package['resolved']
    require(url == 'https://registry.npmjs.org/renovate/-/renovate-44.164.1.tgz', 'URL npm inattendue')
    archive = OUTPUT / 'renovate-44.164.1.tgz'
    request = urllib.request.Request(url, headers={'User-Agent': 'renovate-isolated-ci-integrity'})
    with urllib.request.urlopen(request, timeout=120) as response:
        data = response.read()
    algorithm, expected = package['integrity'].split('-', 1)
    require(algorithm == 'sha512', 'SRI npm attendue en SHA-512')
    require(base64.b64encode(hashlib.sha512(data).digest()).decode() == expected, 'Intégrité SRI npm invalide')
    archive.write_bytes(data)
    package_root = tool_root / 'node_modules/renovate'
    checked = 0
    with tarfile.open(archive) as tar:
        for member in tar.getmembers():
            if not member.isfile():
                continue
            relative = Path(member.name).relative_to('package')
            require('..' not in relative.parts, 'Chemin npm invalide')
            require((package_root / relative).read_bytes() == tar.extractfile(member).read(), f'Installation npm altérée : {relative}')
            checked += 1
    installed = 0
    optional_absent = []
    for relative, metadata in lock['packages'].items():
        if not relative:
            continue
        file = tool_root / relative / 'package.json'
        if not file.exists():
            require(metadata.get('optional') is True, f'Dépendance obligatoire absente : {relative}')
            optional_absent.append(relative)
            continue
        require(json.loads(file.read_text())['version'] == metadata['version'], f'Version installée différente : {relative}')
        require('integrity' in metadata, f'Dépendance non épinglée par intégrité : {relative}')
        installed += 1
    report = {'node': subprocess.check_output(['node', '--version'], text=True).strip(), 'lock_sha256': hashlib.sha256(lock_bytes).hexdigest(), 'upstream_commit': UPSTREAM, 'tag': '44.164.1', 'npm_integrity': package['integrity'], 'installed_package_files_equal_tarball': checked, 'installed_dependency_versions_checked': installed, 'optional_not_installed': optional_absent}
    require(report['node'] == 'v24.19.0', 'Node différent de 24.19.0')
    (OUTPUT / 'tools-integrity.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'PASS : archive npm SRI, {checked} fichiers du paquet, {installed} versions installées, tag et commit amont')


if __name__ == '__main__':
    {'source': source, 'tools': tools}[sys.argv[1]]()
