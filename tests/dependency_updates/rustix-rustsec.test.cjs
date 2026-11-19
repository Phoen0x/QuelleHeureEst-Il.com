// FR// Muter une seule propriété par copie et vérifier le rejet réel par la garde applicative.
// EN// Mutate one property per copy and verify rejection by the actual application guard.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const history = 'docs/history/glib-qh011-20261023';
const cases = {
 'rustix vulnerable rollback': ['Cargo.lock', () => fs.readFileSync(path.join(root,'docs/history/rustix-20261119/Cargo.lock'))],
 'rustix checksum changed': ['Cargo.lock', b => Buffer.from(b.toString().replace('e5e76742e5294153d4dde1207dbec5bdd81eef6fabdc0d2118babadabfd858aa','f5e76742e5294153d4dde1207dbec5bdd81eef6fabdc0d2118babadabfd858aa'))],
 'rustix registry changed': ['Cargo.lock', b => Buffer.from(b.toString().replace('name = "rustix"\nversion = "1.1.6"\nsource = "registry+https://github.com/rust-lang/crates.io-index"','name = "rustix"\nversion = "1.1.6"\nsource = "registry+https://synthetic.invalid/index"'))],
 'tempfile unjustified update': ['Cargo.lock', b => Buffer.from(b.toString().replace('name = "tempfile"\nversion = "3.27.0"','name = "tempfile"\nversion = "3.27.1"'))],
 'application feature changed': ['src-tauri/Cargo.toml', b => Buffer.from(b.toString().replace('default = ["custom-protocol"]','default = []'))],
 'unrelated Tokio update': ['Cargo.lock', b => Buffer.from(b.toString().replace('name = "tokio"\nversion = "1.54.1"','name = "tokio"\nversion = "1.54.2"'))],
 'archive deleted': ['docs/history/rustix-20261119/Cargo.lock', () => null],
 'archive altered': ['docs/history/rustix-20261119/Cargo.lock', b => Buffer.concat([b,Buffer.from('\n')])],
 'new guard disabled': ['Scripts/check-rustix-rustsec.py', () => Buffer.from('print("PASS")\n')],
 'historical guard disabled': ['Scripts/check-glib-qh011.py', () => Buffer.from('print("PASS")\n')],
 'historical docstring altered': ['Scripts/check-glib-qh011.py', b => Buffer.from(b.toString().replace('authentifier le rétroport','authentifier autre chose'))],
 'entry point disabled': ['docs/validation/rust-178/check-ported-graph.cjs', () => Buffer.from('console.log("PASS")\n')],
};
for (const [name, [filename, mutate]] of Object.entries(cases)) test(`Rustix preservation rejects ${name}`, () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'qh-sqlite-negative-'));
  try {
    const options = { cwd: root, timeout: 30000 };
    const files = new Set([...execFileSync('git', ['ls-files', '-z'], options).toString().split('\0'),
      ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], options).toString().split('\0')].filter(Boolean));
    for (const file of files) {
      const target = path.join(fixture, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
      fs.chmodSync(target, fs.statSync(path.join(root, file)).mode & 0o777);
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
    const target = path.join(fixture, filename);
    const before = fs.existsSync(target) ? fs.readFileSync(target) : null;
    const after = mutate(before);
    assert.notDeepEqual(after, before, 'Mutation must actually change the fixture');
    if (after === null) fs.unlinkSync(target); else fs.writeFileSync(target, after);
    const direct = name === 'entry point disabled';
    const result = spawnSync(direct ? 'python3' : process.execPath, [direct ? 'Scripts/check-sqlite-rustsec.py' : 'docs/validation/rust-178/check-ported-graph.cjs'], {
      cwd: fixture, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, GIT_DIR: execFileSync('git', ['rev-parse', '--absolute-git-dir'], options).toString().trim(), GIT_WORK_TREE: fixture },
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /AssertionError/);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});
// FR// L'interpréteur optimisé doit échouer avant toute assertion ; docstring conservée.
// EN// Optimized interpreters must fail before any assertion; preserve the docstring.
for (const [label, flags, value, imported] of [
 ['-O',['-O'],undefined,false], ['-OO',['-OO'],undefined,false],
 ['env1',[],'1',false], ['env2',[],'2',false],
 ['import-O',['-O'],undefined,true], ['import-OO',['-OO'],undefined,true],
]) test(`Rustix Python optimization refusal ${label}`, () => {
 const env={...process.env,PYTHONDONTWRITEBYTECODE:'1'};delete env.PYTHONOPTIMIZE;
 if(value!==undefined)env.PYTHONOPTIMIZE=value;
 const guard='Scripts/check-rustix-rustsec.py';
 const args=imported?[...flags,'-c','import runpy;runpy.run_path("Scripts/check-rustix-rustsec.py",run_name="probe")']:[...flags,guard];
 const p=spawnSync('python3',args,{cwd:root,env,encoding:'utf8',timeout:10000});
 assert.equal(p.error,undefined);assert.equal(p.status,1);assert.match(p.stderr,/Optimisation Python interdite/);assert.doesNotMatch(p.stdout+p.stderr,/\bPASS\b/);
});
test('Rustix guard normal AST and runtime docstring',()=>{
 const code='import ast,pathlib,runpy; p="Scripts/check-rustix-rustsec.py"; m=ast.parse(pathlib.Path(p).read_text()); d=runpy.run_path(p,run_name="probe"); assert ast.get_docstring(m) and d["__doc__"]==m.body[0].value.value; assert m.body[0].lineno==2';
 const env={...process.env,PYTHONDONTWRITEBYTECODE:'1'};delete env.PYTHONOPTIMIZE;
 const p=spawnSync('python3',['-c',code],{cwd:root,env,encoding:'utf8',timeout:10000});assert.equal(p.status,0,p.stderr);
});
