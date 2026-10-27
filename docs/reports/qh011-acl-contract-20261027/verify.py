#!/usr/bin/env python3
"""FR : contrôle documentaire seul. EN: documentary verification only."""
import hashlib,json,re,tomllib
from pathlib import Path
root=Path(__file__).resolve().parent
def load(name):return json.loads((root/name).read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
manifest=load('MANIFEST.json');listed={x['path'] for x in manifest['files']}
actual={str(p.relative_to(root)) for p in root.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
assert listed==actual,listed^actual
for item in manifest['files']:
 p=(root/item['path']).resolve();p.relative_to(root);b=p.read_bytes()
 assert len(b)==item['bytes'] and sha(b)==item['sha256'] and blob(b)==item['git_blob'],item['path']
inventory=load('source-inventory.json');key=inventory['study'];expected=500 if key=='A' else 7
original=load('original/EVIDENCE_SHA256.json')['files'];assert len(original)==expected==inventory['verified_count']
assert not inventory['missing'] and not inventory['mismatched']
for item in inventory['files']:assert original[item['path']]==item['sha256']
for item in load('archive-provenance.json')['sources']:
 b=(root/item['archive']).read_bytes();assert sha(b)==item['archive_sha256']
 if item['transformation']=='exact bytes':assert sha(b)==item['source_sha256']
if key=='A':
 stdout=(root/'logs/tests.stdout').read_text();assert '22 passed; 0 failed; 0 ignored' in stdout
 names=re.findall(r'^test ([\w:]+) \.\.\.',stdout,re.M);assert len(names)==len(set(names))==22
 assert sum(n.startswith('application_profile::') for n in names)==9
 assert sum(n.startswith('tests::') for n in names)==13
 assert load('records/tests-status.json')['exit']==0 and load('records/build-status.json')['exit']==0
 assert load('records/attempt1-build-status.json')['exit']==101
 assert load('records/attempt2-tests-status.json')['exit']==101
 assert '21 passed; 1 failed' in (root/'logs/attempt2-tests.stdout').read_text()
 assert 'permission_sets' in (root/'logs/attempt2-tests.stderr').read_text()
 errors=load('logs/attempt1-errors.json');assert any(x['level']=='error' and x['code']['code']=='E0603' for x in errors)
 cases=load('records/compile-probes.json');assert len(cases)==4
 exp={'forge_token':(101,'E0451'),'manager_fence':(101,'E0616'),'direct_fence':(101,'E0624'),'context_still_open':(0,None)}
 for row in cases:
  code,error=exp[row['example']];assert row['exit']==code
  if error:assert 'error['+error+']' in (root/('logs/'+row['example']+'.stderr')).read_text()
 for p in ['probe/Cargo.toml.txt','probe/Cargo.lock.txt','probe/.cargo/config.toml.txt']:tomllib.loads((root/p).read_text())
 status=load('records/verification.json');assert status['resolve_access_and_deny_source_unchanged'] and status['original_webview_ipc_source_unchanged'] and status['probe_lock_unchanged']
else:
 ast=load('records/frontend-inventory.json');assert ast['files']==19 and len(ast['runtime_reachable'])==16 and len(ast['invoke_calls'])==6
 assert all(not x['runtime_reachable'] for x in ast['invoke_calls']) and not ast['dynamic_imports']
 assert len(load('records/platforms.json'))==12
 status=load('records/verification.json');assert status['commands_now']['new_rust_or_native_tests']==0 and status['commands_now']['new_builds_or_audits']==0
 assert load('records/inventory.json')['tracked_files']==302
print(json.dumps({'status':'PASS','study':key,'archive_files_checked':len(actual),'source_manifest_entries':expected,'scope':'bytes and historical records only; no technical replay'},indent=2))
