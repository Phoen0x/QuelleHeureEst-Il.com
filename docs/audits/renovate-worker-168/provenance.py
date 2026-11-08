#!/usr/bin/env python3
import hashlib
import json
import os
import platform
import subprocess
from pathlib import Path

here = Path(__file__).resolve().parent
tools = Path(os.environ.get('AUDIT_TOOLS', '/workspace/renovate-audit-tools'))
upstream = Path(os.environ.get('AUDIT_UPSTREAM', '/workspace/renovate-44.164.1'))
expected = '6cc889803a44be232802143499d904799f58abc0'
commit = subprocess.check_output(['git', '-C', str(upstream), 'rev-parse', 'HEAD'], text=True).strip()
assert commit == expected
package = tools / 'node_modules/renovate'
assert json.loads((package / 'package.json').read_text())['version'] == '44.164.1'
files = ['workers/repository/index', 'workers/repository/process/write', 'workers/repository/update/branch/index', 'workers/repository/update/pr/index', 'workers/repository/finalize/prune']
records = []
for name in files:
    source = upstream / 'lib' / (name + '.ts')
    compiled = package / 'dist' / (name + '.js')
    mapping = json.loads(compiled.with_suffix('.js.map').read_text())
    assert source.read_text() in mapping['sourcesContent'], name
    records.append({'source': 'lib/' + name + '.ts', 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'compiled_sha256': hashlib.sha256(compiled.read_bytes()).hexdigest(), 'source_map_matches_tag': True})
lock = json.loads((here / 'tooling/package-lock.json').read_text())
data = {'upstream_tag': '44.164.1', 'upstream_commit': commit, 'renovate_package': lock['packages']['node_modules/renovate'], 'node': subprocess.check_output(['node', '--version'], text=True).strip(), 'npm': subprocess.check_output(['npm', '--version'], text=True).strip(), 'python': platform.python_version(), 'os': platform.platform(), 'sources': records}
output = Path(os.environ.get('AUDIT_OUTPUT', here / 'evidence/final'))
output.mkdir(parents=True, exist_ok=True)
(output / 'provenance.json').write_text(json.dumps(data, indent=2) + '\n')
print('PASS : tag/SHA, paquet 44.164.1 et 5 sources de sourcemaps identiques au tag')
