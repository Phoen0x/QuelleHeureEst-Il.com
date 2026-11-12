// FR// Comparer les octets documentaires, la structure AST et la docstring importée.
// EN// Compare documentation bytes, AST structure and the imported module docstring.
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const probe = `import ast,json,pathlib,runpy,sys
p=pathlib.Path(sys.argv[1])
original=pathlib.Path('docs/history/python-optimization-20261112')/p
raw=original.read_bytes(); active=p.read_bytes()
old=ast.parse(raw); new=ast.parse(active)
assert isinstance(new.body[0], ast.Expr) and isinstance(new.body[0].value,ast.Constant) and isinstance(new.body[0].value.value,str)
assert ast.get_docstring(new)==ast.get_docstring(old) and ast.get_docstring(old) is not None
assert new.body[0].value.value==old.body[0].value.value
prefix=b'#!/usr/bin/env python3\\n'
assert active.startswith(prefix) and raw.startswith(prefix)
old_doc=b''.join(raw.splitlines(keepends=True)[old.body[0].lineno-1:old.body[0].end_lineno])
new_doc=b''.join(active.splitlines(keepends=True)[new.body[0].lineno-1:new.body[0].end_lineno])
assert old_doc==new_doc and new.body[0].lineno==2
assert isinstance(new.body[1],ast.Import) and [x.name for x in new.body[1].names]==['sys']
expected=ast.parse('if sys.flags.optimize != 0: raise RuntimeError("Optimisation Python interdite pour les gardes de conservation / Python optimization is forbidden")').body[0]
assert ast.dump(new.body[2])==ast.dump(expected)
mode=sys.argv[2]
if mode=='ast':print(json.dumps({'ast':'PASS','bytes':'PASS','placement':'PASS'}))
else:
 ns=runpy.run_path(str(p),run_name='doc_probe')
 assert ns['__doc__']==old.body[0].value.value
 print(json.dumps({'runtime_doc':ns['__doc__']}))
`;
for (const name of ['Scripts/check-sqlite-rustsec.py', 'Scripts/check-glib-qh011.py']) {
  for (const mode of ['ast', 'unset', '0']) test(`docstring ${name} ${mode}`, () => {
    const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' };
    delete env.PYTHONOPTIMIZE;
    if (mode === '0') env.PYTHONOPTIMIZE = '0';
    const result = spawnSync('python3', ['-c', probe, name, mode], { cwd: root, env, encoding: 'utf8', timeout: 30000 });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(JSON.parse(result.stdout));
  });
}
// FR// Muter une seule propriété par copie et vérifier le rejet réel par la garde applicative.
// EN// Mutate one property per copy and verify rejection by the actual application guard.


const fs = require('node:fs');

const os = require('node:os');
const { execFileSync } = require('node:child_process');

const history = 'docs/history/glib-qh011-20261023';
const cases = {
 'old GLib header position': ['Scripts/check-glib-qh011.py', () => fs.readFileSync(path.join(root,'docs/history/python-docstrings-20261112/Scripts/check-glib-qh011.py'))],
 'GLib docstring rewritten': ['Scripts/check-glib-qh011.py', b => Buffer.from(b.toString().replace('authentifier le rétroport', 'authentifier autre chose'))],
 'unexpected GLib bytes': ['Scripts/check-glib-qh011.py', b => Buffer.concat([b,Buffer.from('\n# unexpected\n')])],
 'previous controller archive changed': ['docs/history/python-docstrings-20261112/Scripts/check-glib-qh011.py', b => Buffer.concat([b,Buffer.from('\n')])],
};
for (const [name, [filename, mutate]] of Object.entries(cases)) test(`Docstring preservation rejects ${name}`, () => {
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
