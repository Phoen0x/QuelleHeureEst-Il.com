// FR// Mutations ciblées supplémentaires, en conservant les octets hors de la mutation.
// EN// Additional targeted mutations preserve all bytes outside the mutation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const history = 'docs/history/tokio-qh011-20261023';
const cases = {
  'unfixed Tokio reactivation': ['Cargo.lock', text => text.replace('name = "tokio"\nversion = "1.54.1"', 'name = "tokio"\nversion = "1.54.0"')],
  'Tokio checksum mutation': ['Cargo.lock', text => text.replace('b52fd3255258d26fac7264ab5a76b53c13367136dc011d3d6ad4f8ed070396a3', '0'.repeat(64))],
  'unrelated Windows edge update': ['Cargo.lock', text => text.replace(' "windows-sys 0.61.2",', ' "windows-sys 0.59.0",')],
  'initial Cargo archive mutation': [`${history}/Cargo.lock`, text => text + '\n'],
  'previous braces guard mutation': ['Scripts/check-braces-qh009.cjs', text => text + '\n'],
  'Tokio feature removal': ['src-tauri/Cargo.toml', text => text.replace('tokio = { version = "1", features = ["full"] }', 'tokio = { version = "1", features = ["time"] }')],
};
for (const [name, [filename, mutate]] of Object.entries(cases)) test(`QH011 preservation rejects ${name}`, () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'qh011-negative-'));
  try {
    const args = { cwd: root, timeout: 30000 };
    const files = new Set([...execFileSync('git', ['ls-files', '-z'], args).toString().split('\0'),
      ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], args).toString().split('\0')].filter(Boolean));
    for (const file of files) {
      const target = path.join(fixture, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
      fs.chmodSync(target, fs.statSync(path.join(root, file)).mode & 0o777);
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
    const original = fs.readFileSync(path.join(fixture, filename), 'utf8'), mutated = mutate(original);
    assert.notEqual(mutated, original, 'Mutation must actually change the fixture');
    fs.writeFileSync(path.join(fixture, filename), mutated);
    const result = spawnSync(process.execPath, ['docs/validation/rust-178/check-ported-graph.cjs'], {
      cwd: fixture, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, GIT_DIR: execFileSync('git', ['rev-parse', '--absolute-git-dir'], args).toString().trim(), GIT_WORK_TREE: fixture },
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /AssertionError/);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});
