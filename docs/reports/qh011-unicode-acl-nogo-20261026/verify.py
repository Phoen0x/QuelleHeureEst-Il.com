"""FR : cohérence documentaire uniquement ; EN: recorded-evidence checks only."""
import ast,hashlib,json,re,tomllib
from pathlib import Path
R=Path(__file__).resolve().parent
def read(p):return json.loads((R/p).read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
manifest=read('MANIFEST.json')
for row in manifest['files']:
 b=(R/row['path']).read_bytes();assert sha(b)==row['sha256'] and blob(b)==row['git_blob'] and len(b)==row['bytes'],row['path']
for row in read('archive-provenance.json')['sources']:assert sha((R/row['archive']).read_bytes())==row['archive_sha256'],row['archive']
assert len(read('original/EVIDENCE_SHA256.json'))==65
assert read('source-inventory.json')['source_manifest_verified']=={'total':65,'missing':[],'mismatched':[]}
status=read('records/prototype-status.json');assert status['exit']==101
stdout=(R/'logs/prototype-tests.stdout').read_text();stderr=(R/'logs/prototype-tests.stderr').read_text()
assert '15 passed; 2 failed; 0 ignored' in stdout and 'running 17 tests' in stdout
assert len(re.findall(r'^test .* \.\.\. ok$',stdout,re.M))==15
assert len(re.findall(r'^test .* \.\.\. FAILED$',stdout,re.M))==2
source=(R/'prototype/src/lib.rs.txt').read_text();assert source.count('#[test]')==17
assert 'HistoricalRemoteUnproven' in stderr
assert 'unvalidated dynamic rule widened access after a successful legacy construction gate' in stderr
for test in ['acceptance_historical_u309b_remains_available','acceptance_raw_dynamic_api_cannot_bypass_construction_policy']:
 assert test in source and 'test tests::'+test+' ... FAILED' in stdout
cases=read('prototype/fixtures/cases.json');static=[c for c in cases if c.get('dynamic')!=True];assert len(static)==65
keys=set()
for c in static:
 c=dict(c);c.pop('id');c['caps']=sorted(c['caps'],key=lambda x:x['identifier']);keys.add(json.dumps(c,sort_keys=True))
assert len(keys)==63
expected=read('prototype/fixtures/new-results.json');assert len(expected)==70
f=read('counterexamples/failures.json');assert f['functional']['historical_allowed'] is True
assert f['functional']['fixture']['caps'][0]['remote']['urls']==['https://example.invalid/:\u309b']
assert f['dynamic']['fixture']['caps'][0]['remote']['urls']==['https://example.invalid/:a\U00011f00']
assert f['dynamic']['initial_fixture']['caps']==[] and f['dynamic']['historical_allowed'] is False
assert f['dynamic']['prototype_added_rule_allowed'] is True and f['dynamic']['real_application_exploit_demonstrated'] is False
a,b=[read('counterexamples/'+side+'-selected.json')['scope-widening-False'] for side in ['old','new']]
assert a['allowed'] and b['allowed'];assert [e['capability'] for e in a['entries']]==['a'];assert [e['capability'] for e in b['entries']]==['a','b']
assert a['scope_store']==b['scope_store'] and 'secret' in a['scope_store'] and 'String("*")' in a['scope_store']
def lock(p):return {p['name']+'@'+p['version']:p for p in tomllib.loads((R/p).read_text())['package']}
old=lock('candidate-history/Cargo.lock.txt');new=lock('locks/candidate-preserved.lock.txt')
assert (len(old),len(new),len(old.keys()-new.keys()),len(new.keys()-old.keys()))==(504,509,13,18)
delta=read('candidate-history/dependency-delta.json');assert len(delta['outgoing'])==13 and len(delta['incoming'])==18
for key in delta['restored_exact_blocks']:assert old[key]==new[key],key
assert not any(k.startswith('unic-') or k=='h2@0.3.27' for k in new)
for key in ['tauri@2.11.6','tokio@1.54.1','reqwest@0.12.28','h2@0.4.20','glib@0.18.5']:assert key in new,key
for path,digest in read('candidate-history/SHA256.json').items():assert sha((R/'candidate-history'/path).read_bytes())==digest,path
pres=read('records/original-preservation.json');assert pres['recorded_file_count']==302 and pres['candidate_unchanged_tracked_files']==301 and pres['all_original_hashes_still_match'] and pres['original_index_still_matches_recorded_hash']
negative=read('records/conservation-negative-results.json');assert len(negative)==3 and all(r['guard_exit']==1 and r['rejected'] for r in negative)
web={r['name']:r for r in read('records/web-status.json')};rust={r['name']:r for r in read('records/rust-status.json')}
assert web['historical-preservation']['exit']==1 and 'Only the application GLib dev-test edge may change' in (R/'logs/historical-preservation.stderr').read_text()
assert int((R/'logs/baseline-historical-guard.exit').read_text())==0
assert all(r['exit']==0 for k,r in web.items() if k!='historical-preservation')
webout=(R/'logs/web-security.stdout').read_text();assert re.search(r'tests\s+34\b',webout) and re.search(r'pass\s+34\b',webout) and re.search(r'fail\s+0\b',webout)
assert all(r['exit']==0 for k,r in rust.items() if k!='cargo-audit') and rust['cargo-audit']['exit']==1
for profile in ['debug','release']:
 out=(R/('logs/cargo-test-'+profile+'.stdout')).read_text();assert '6 passed; 0 failed; 0 ignored' in out and '2 passed; 0 failed; 0 ignored' in out
audit=read('logs/cargo-audit.stdout');assert audit['vulnerabilities']['count']==0 and sum(len(v) for v in audit['warnings'].values())==3 and audit['settings']['ignore']==[]
assert audit['database']['advisory-count']==1352
for items in audit['warnings'].values():
 for entry in items:assert entry['advisory']['license']=='CC0-1.0'
for p in ['logs/pnpm-audit-full.stdout','logs/pnpm-audit-production.stdout']:
 data=read(p);assert not data.get('error') and not data['advisories'] and data['muted']==[] and all(v==0 for v in data['metadata']['vulnerabilities'].values())
pnpm=read('records/pnpm-snapshot-summary.json');assert pnpm['snapshots']==409 and pnpm['optional']==140
assert read('graphs/prior-equivalence.json')['same_nodes_as_previous_preserved_variant'] is True
replays=read('records/baseline-replay-status.json');assert [r['records'] for r in replays]==[70,70,678] and all(r['exit']==0 and r['identical_to_archived_results'] for r in replays)
for path in ['verify.py','reproduce-prototype.py']:ast.parse((R/path).read_text())
print(json.dumps({'archive_files_verified':len(manifest['files']),'prototype':{'passed':15,'failed':2,'ignored':0,'exit':101},'static_distinct_scenarios':63,'static_records':65,'web_tests_passed':34,'rust_distinct_application_tests_per_campaign':8,'strict_rust_audit_exit':1,'historical_candidate_guard_exit':1,'technical_verdict':'NO-GO','documentary_integrity':'PASS; recorded evidence only, no technical replay'},ensure_ascii=False,indent=2))
