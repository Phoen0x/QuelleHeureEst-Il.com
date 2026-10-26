#!/usr/bin/env python3
"""FR : vérification documentaire seule. EN: documentary verification only."""
import hashlib,json,re,tomllib
from pathlib import Path
root=Path(__file__).resolve().parent
def load(path):return json.loads((root/path).read_text())
def sha(data):return hashlib.sha256(data).hexdigest()
def blob(data):return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
manifest=load('MANIFEST.json')
listed={x['path'] for x in manifest['files']}
actual={str(p.relative_to(root)) for p in root.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
assert actual==listed,('inventory',actual^listed)
for entry in manifest['files']:
 data=(root/entry['path']).read_bytes()
 assert len(data)==entry['bytes'] and sha(data)==entry['sha256'] and blob(data)==entry['git_blob'],entry['path']
sources=load('source-inventory.json');assert sources['verified_entries']==179 and not sources['missing'] and not sources['mismatched']
original=load('original/EVIDENCE_SHA256.json');assert len(original)==179
for entry in sources['files']:assert original[entry['source']]==entry['sha256']
for entry in load('archive-provenance.json')['sources']:
 data=(root/entry['archive']).read_bytes();assert sha(data)==entry['archive_sha256']
 if entry['transformation']=='exact bytes':assert sha(data)==entry['source_sha256']
stdout=(root/'logs/tests.stdout').read_text()
assert 'test result: ok. 13 passed; 0 failed; 0 ignored;' in stdout
names=re.findall(r'^test (tests::\w+) \.\.\.',stdout,re.M);assert len(names)==len(set(names))==13
observations=load('records/observations-before-after.json');assert len(observations)==5
status=load('records/tests-status.json');assert status['exit']==0 and status['observations']==5
expected={'forge_token':(101,'E0451'),'manager_fence':(101,'E0616'),'direct_fence':(101,'E0624'),'context_still_open':(0,None)}
records=load('records/compile-probes.json');assert len(records)==4
for row in records:
 code,error=expected[row['example']];assert row['exit']==code
 if error:assert 'error['+error+']' in (root/('logs/'+row['example']+'.stderr')).read_text()
assert (root/'records/build.exit').read_text().strip()=='0'
for path in ['probe/Cargo.toml.txt','probe/Cargo.lock.txt','probe/.cargo/config.toml.txt']:tomllib.loads((root/path).read_text())
preservation=load('records/original-after-verification.json');assert preservation['tracked_files_checked']==302 and not preservation['changed_files'] and preservation['index_unchanged'] and preservation['git_status']==''
changes=load('records/local-tauri-changes.json');assert len(changes['modified'])==3 and len(changes['added'])==1 and not changes['deleted'] and changes['license_files_unchanged']
print(json.dumps({'status':'PASS','scope':'archived bytes and records only; no probe rerun','manifest_files':len(listed),'historical_runtime_tests':13,'historical_compile_probes':4,'historical_observations':5,'source_manifest_entries':179},indent=2))
