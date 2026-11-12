// FR// Vérifier les sorties réelles, le diagnostic et l'absence de PASS sous optimisation.
// EN// Check actual exits, diagnostics and absence of PASS under optimization.
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const scripts = ['Scripts/check-sqlite-rustsec.py', 'Scripts/check-glib-qh011.py'];
const wrapper = 'docs/validation/rust-178/check-ported-graph.cjs';
function run(command, args, optimize, cwd = root) {
  const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' };
  delete env.PYTHONOPTIMIZE;
  if (optimize !== undefined) env.PYTHONOPTIMIZE = optimize;
  return spawnSync(command, args, { cwd, env, encoding: 'utf8', timeout: 120000 });
}
function refused(result) {
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /Optimisation Python interdite/);
  assert.doesNotMatch(result.stdout + result.stderr, /\bPASS\b/);
}
for (const script of scripts) {
  for (const flag of ['-O', '-OO']) test(`${script}: ${flag} refused`, () => refused(run('python3', [flag, script])));
  for (const value of ['1', '2']) test(`${script}: PYTHONOPTIMIZE=${value} refused`, () => refused(run('python3', [script], value)));
  for (const flag of ['-O', '-OO']) test(`${script}: optimized import ${flag} refused`, () => {
    refused(run('python3', [flag, '-c', 'import runpy,sys; runpy.run_path(sys.argv[1], run_name="imported_guard")', script]));
  });
}
for (const value of ['1', '2']) test(`Node wrapper PYTHONOPTIMIZE=${value} refused`, () => refused(run(process.execPath, [wrapper], value)));
for (const value of [undefined, '0']) {
  for (const [command, script] of [['python3', scripts[0]], [process.execPath, wrapper]]) {
    test(`${script}: normal optimize=${value ?? 'unset'} accepted`, () => {
      const p = run(command, [script], value);
      assert.equal(p.error, undefined);
      assert.equal(p.status, 0, p.stderr);
      assert.equal(JSON.parse(p.stdout).status, 'PASS');
    });
  }
  test(`GLib direct on SQLite candidate optimize=${value ?? 'unset'} retains historical refusal`, () => {
    const p = run('python3', [scripts[1]], value);
    assert.equal(p.status, 1);
    assert.match(p.stderr, /Manifest changed beyond Linux test dependency/);
    assert.doesNotMatch(p.stdout, /\bPASS\b/);
  });
  test(`GLib direct on authenticated #194 view optimize=${value ?? 'unset'} accepted`, () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qh-opt-glib-'));
    try {
      const h = 'docs/history/sqlite-rustsec-20261111';
      const port = JSON.parse(fs.readFileSync(path.join(root, h, 'PORT.json')));
      for (const [name, entry] of Object.entries(port.initial_files)) {
        const from = port.modified_files.includes(name) ? `${h}/${name}` : name;
        const target = path.join(temp, name);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(path.join(root, from), target);
        fs.chmodSync(target, parseInt(entry.mode, 8));
      }
      fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
      execFileSync('git', ['init', '--initial-branch=preservation', temp], { timeout: 30000 });
      const p = run('python3', [scripts[1]], value, temp);
      assert.equal(p.error, undefined);
      assert.equal(p.status, 0, p.stderr);
      assert.equal(JSON.parse(p.stdout).status, 'PASS');
    } finally { fs.rmSync(temp, { recursive: true, force: true }); }
  });
}
