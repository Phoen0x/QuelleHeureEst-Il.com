"""FR : harnais isolés uniquement, sur demande ; EN: opt-in isolated harness replay."""
import argparse,json,os,resource,shutil,subprocess,tempfile,time,tomllib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
p=argparse.ArgumentParser(description='Copy archived harnesses outside the repository; offline build and bounded execution. Requires the prepared native environment.')
p.add_argument('--project-config',required=True,type=Path,help='Absolute path to the reviewed .cargo/config.toml of PR183 f2eee422 (and its GLib vendor tree).')
p.add_argument('--output',required=True,type=Path,help='New directory outside the checkout for all generated files.')
p.add_argument('--build-run',action='store_true',help='Explicitly compile and execute; otherwise only prepare the isolated files.')
a=p.parse_args();config=a.project_config.resolve(strict=True);output=a.output.resolve()
checkout=config.parent.parent
assert config.name=='config.toml' and config.parent.name=='.cargo'
assert tomllib.loads(config.read_text()).get('paths')==['vendor/glib-0.18.5']
vendor=checkout/'vendor/glib-0.18.5/src/variant_iter.rs'
assert 'let mut p' in vendor.read_text() and '&mut p' in vendor.read_text()
assert not output.is_relative_to(checkout) and not checkout.is_relative_to(output)
assert not output.is_relative_to(ROOT) and not output.exists()
output.mkdir(parents=True)
harnesses={'unicode':['acl-old','acl-new','runtime-old','runtime-new','harness','properties'],'acl':['qualification-old','qualification-new','qualification-raw']}
for group,names in harnesses.items():
 d=output/group;d.mkdir()
 for fixture in ['cases.json','raw-cases.json']:
  if (ROOT/group/fixture).exists():shutil.copyfile(ROOT/group/fixture,d/fixture)
 for name in names:
  for member in ['Cargo.toml','Cargo.lock','src/main.rs']:
   dest=d/name/member;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/group/name/(member+'.txt'),dest)
if not a.build_run:
 print('Prepared inert copies only; no build or test executed.');raise SystemExit(0)
environment=os.environ.copy();environment.update(CARGO_TARGET_DIR=str(output/'target'),CARGO_NET_OFFLINE='true')
def limits(memory):
 def apply():
  resource.setrlimit(resource.RLIMIT_CPU,(10,10));resource.setrlimit(resource.RLIMIT_AS,(memory,memory));resource.setrlimit(resource.RLIMIT_CORE,(0,0))
 return apply
status=[]
for group,names in harnesses.items():
 for name in names:
  folder=output/group/name
  command=['cargo','--config',str(config),'build','--locked','--offline']
  # FR : compilation native bornée ; EN: bounded native compilation.
  with (folder/'build.log').open('wb') as log:subprocess.run(command,cwd=folder,env=environment,stdout=log,stderr=subprocess.STDOUT,timeout=300,check=True)
  package=tomllib.loads((folder/'Cargo.toml').read_text())['package']['name']
  memory=(256 if name=='properties' else 1024)*1024**2
  start=time.monotonic();r=subprocess.run([str(output/'target/debug'/package)],cwd=folder,env=environment,capture_output=True,timeout=20,preexec_fn=limits(memory))
  (folder/'results.json').write_bytes(r.stdout);(folder/'stderr.log').write_bytes(r.stderr)
  status.append({'group':group,'harness':name,'exit':r.returncode,'seconds':round(time.monotonic()-start,3),'wall_seconds':20,'cpu_seconds':10,'address_space_bytes':memory})
  (output/'run-status.json').write_text(json.dumps(status,indent=2))
  if r.returncode:raise SystemExit('Harness failed; inspect isolated output, do not silently retry.')
print('Replay completed. Compare JSON results separately; elapsed times are not equivalence criteria. No application checkout was modified.')
