"""FR : contrôle hors ligne des archives ; EN: offline archive consistency check."""
import collections,hashlib,json,tomllib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def read(p):return json.loads((ROOT/p).read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def canonical(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
manifest=read('MANIFEST.json')
for item in manifest['files']:
 p=ROOT/item['path'];b=p.read_bytes()
 assert len(b)==item['bytes'] and sha(b)==item['sha256'],item['path']
for item in read('archive-provenance.json')['sources']:
 assert sha((ROOT/item['archive']).read_bytes())==item['archive_sha256'],item['archive']
def lock(name):
 p=tomllib.loads((ROOT/('unicode/locks/'+name+'.lock.txt')).read_text())['package']
 return {v['name']+'@'+v['version']:v for v in p}
before,after,preserved=[lock(n) for n in ['before','after','after-preserved-edges']]
assert (len(before),len(after))==(504,509)
assert (len(before.keys()-after.keys()),len(after.keys()-before.keys()))==(13,18)
delta=read('unicode/dependency-delta.json')
assert sorted(v['name']+'@'+v['version'] for v in delta['outgoing'])==sorted(before.keys()-after.keys())
assert sorted(v['name']+'@'+v['version'] for v in delta['incoming'])==sorted(after.keys()-before.keys())
for name in delta['restored_collateral_packages']:assert before[name]==preserved[name],name
assert set(after)==set(preserved)
for p in [after,preserved]:
 assert not any(n.startswith('unic-') for n in p)
 for identity in ['tauri@2.11.6','tokio@1.54.1','reqwest@0.12.28','h2@0.4.20','glib@0.18.5']:assert identity in p,identity
catalog=read('unicode/graphs/package-catalog-0.json')|read('unicode/graphs/package-catalog-1.json')
for key,value in catalog.items():assert sha(canonical(value))==key
for filename in ['before-all-metadata.json','after-all-metadata.json','after-preserved-metadata.json']:
 g=read('unicode/graphs/'+filename)
 for p in g['packages']:
  d=catalog[p['definition']];assert p['identity']==d['name']+'@'+d['version']
target_graphs=read('unicode/graphs/target-nodes.json')
for key,node in target_graphs['node_catalog'].items():assert sha(canonical(node))==key
assert len(target_graphs['targets'])==24
for target in target_graphs['targets']:
 for ref in target['nodes']:assert ref in target_graphs['node_catalog']
summary=read('unicode/diagnostic-summary.json')
cases=read('unicode/cases.json');old=read('unicode/acl-old-results.json');new=read('unicode/acl-new-results.json')
assert len(cases)==len(old)==len(new)==659
unique={}
for c,a,b in zip(cases,old,new):
 assert c['id']==a['id']==b['id']
 assert c['pattern']==a['pattern']==b['pattern'] and a['url']==b['url']
 unique[(a['pattern'],a['url'])]=(a['actual'],b['actual'])
assert len({(c["pattern"],c["url"]) for c in cases})==648
assert len(unique)==647
def decision(r):return (r['accepted'],r.get('matches'))
differences=[(a,b) for a,b in unique.values() if decision(a)!=decision(b)]
assert len(differences)==summary['divergences']==113
assert sum(a['accepted']!=b['accepted'] for a,b in differences)==68
assert sum(a.get('matches')==False and b.get('matches')==True for a,b in differences)==45
assert sum(decision(a)==decision(b) for a,b in zip([r['actual'] for r in old[:27]],[r['actual'] for r in new[:27]]))==24
audit=read('unicode/audit-summary.json')['runs']
assert [(a['exit'],a['vulnerabilities'],len(a['warnings'])) for a in audit]==[(1,0,8),(1,0,3)]
assert all(a['ignore']==[] for a in audit)
rows={side:{r['id']:r['result'] for r in read('acl/'+side+'-results.json')} for side in ['old','new']}
acl_cases=read('acl/cases.json');distinct=set()
for c in acl_cases:
 d=dict(c);d.pop('id');d['caps']=sorted(d['caps'],key=lambda v:v['identifier']);distinct.add(canonical(d))
assert len(acl_cases)==70 and len(distinct)==68
old_panics={'kawi-start','cyrillic-start','duplicate-group','host-tab','host-lf','host-cr','offset-error'}
negative={'wrong-domain','subdomain','port-other','http','idn','wrong-window','local-vs-remote','wrong-command','no-matching-webview','neither-label','no-remote-remote','no-capabilities','no-manifest','android-filter-linux','windows-filter-linux','escaped-kawi','deny-same','deny-different','deny-unicode','deny-empty-entry','exact-path-negative','literal-encoded-slash','plugin-refused-window','dynamic-deny-different','dynamic-no-remote'}
for side,results in rows.items():
 for c in acl_cases:
  name=c['id'];r=results[name];panics=old_panics if side=='old' else {'offset-error'}
  if name in panics:assert r['stage']=='panic',name
  else:
   expected=name not in negative and not(side=='old' and name in {'kawi-partial','quantified-kawi','dynamic-kawi-partial'})
   assert r['stage']=='runtime' and r['allowed']==expected,(side,name)
def selected(row):return [(r['capability'],r['permission'],r['scope_id']) for r in row['entries']]
a,b=[rows[side]['scope-widening-False'] for side in ['old','new']]
assert a['allowed'] and b['allowed']
assert selected(a)==[('a','allow-narrow',1)] and selected(b)==[('a','allow-narrow',1),('b','allow-wide',2)]
assert a['scope_store']==b['scope_store'] and 'secret' in a['scope_store'] and 'String("*")' in a['scope_store']
for side in rows:
 for name in ['deny-same','deny-different','deny-unicode','deny-empty-entry']:assert not rows[side][name]['allowed']
 assert rows[side]['idn-positive']['allowed'] and rows[side]['multilingual-path']['allowed']
raw_cases=read('acl/raw-cases.json')
extras=[('https://example.invalid/:é:','https://example.invalid/value'),('https://example.invalid/:é(','https://example.invalid/value'),('https://example.invalid/:東京:','https://example.invalid/value'),('https://example.invalid/:a\U00011f00/:a','https://example.invalid/x/y'),('https://example.invalid/:a\U00011f00','https://example.invalid/value%F0%91%BC%80'),('https://example.invalid/a\nb','https://example.invalid/ab'),('https://example.invalid/a\tb','https://example.invalid/a%09b')]
assert len(set([(c['pattern'],c['url']) for c in raw_cases]+extras))==674
raw=read('acl/raw-results.json');prior={r['id']:r for r in read('unicode/raw-pattern-results.json')}
assert len(raw)==678
for r in raw[:647]:assert r==prior[r['id']],r['id']
assert read('acl/summary.json')['all_expected_checks_passed']
assert all(r['exit']==0 for r in read('acl/run-status.json'))
print(json.dumps({'archive_files_verified':len(manifest['files']),'cargo_packages':[504,509],'historical_url_pairs':647,'historical_divergences':113,'raw_distinct_pairs':674,'acl_distinct_scenarios':68,'audit_exits':[1,1],'status':'PASS: offline consistency only; no Rust execution or security certification'},ensure_ascii=False,indent=2))
