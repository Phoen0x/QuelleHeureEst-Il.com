"""FR : rejeu explicite isolé, non exécuté à l'archivage ; EN: opt-in isolated replay."""
import argparse,hashlib,json,os,resource,shutil,subprocess,time
from pathlib import Path
ROOT=Path(__file__).resolve().parent
p=argparse.ArgumentParser(description='Prepare or explicitly replay the archived failing prototype outside any supplied project.')
p.add_argument('--project-config',required=True,type=Path)
p.add_argument('--output',required=True,type=Path)
p.add_argument('--run',action='store_true')
a=p.parse_args();config=a.project_config.resolve(strict=True);checkout=config.parent.parent;output=a.output.resolve()
assert config.parent.name=='.cargo' and config.name=='config.toml'
binding=json.loads((ROOT/'records/project-binding.json').read_text())
for path,digest in binding['sha256'].items():assert hashlib.sha256((checkout/path).read_bytes()).hexdigest()==digest,path
assert not output.is_relative_to(checkout) and not checkout.is_relative_to(output)
assert not output.is_relative_to(ROOT) and not output.exists()
output.mkdir(parents=True)
for name in ['Cargo.toml','Cargo.lock','src/lib.rs']:
 dest=output/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/'prototype'/(name+'.txt'),dest)
shutil.copytree(ROOT/'prototype/fixtures',output/'fixtures')
if not a.run:
 print('Prepared files only; no technical test executed.');raise SystemExit(0)
env=dict(os.environ,CARGO_TARGET_DIR=str(output/'target'),CARGO_NET_OFFLINE='true')
# FR : la configuration GLib est explicite ; EN: explicit GLib configuration.
command=['cargo','--config',str(config),'test','--lib','--locked','--offline','--no-run','--message-format=json']
with (output/'build.jsonl').open('wb') as log, (output/'build.stderr').open('wb') as err:
 build=subprocess.run(command,cwd=output,env=env,stdout=log,stderr=err,timeout=300)
if build.returncode:raise SystemExit(build.returncode)
binaries=[]
for line in (output/'build.jsonl').read_text().splitlines():
 try:
  record=json.loads(line)
  if record.get('reason')=='compiler-artifact' and record.get('executable') and record.get('profile',{}).get('test'):binaries.append(record['executable'])
 except json.JSONDecodeError:pass
assert len(binaries)==1
def limits():
 resource.setrlimit(resource.RLIMIT_CPU,(10,10));resource.setrlimit(resource.RLIMIT_AS,(1024**3,1024**3));resource.setrlimit(resource.RLIMIT_CORE,(0,0))
start=time.monotonic();run=subprocess.run([binaries[0],'--test-threads=1','--nocapture'],cwd=output,env=env,capture_output=True,timeout=30,preexec_fn=limits)
(output/'tests.stdout').write_bytes(run.stdout);(output/'tests.stderr').write_bytes(run.stderr)
(output/'status.json').write_text(json.dumps({'exit':run.returncode,'seconds':time.monotonic()-start,'historical_expected_exit':101,'note':'Expected failure is not converted to success.'},indent=2))
print(run.stdout.decode(errors='replace'));print(run.stderr.decode(errors='replace'))
raise SystemExit(run.returncode)
