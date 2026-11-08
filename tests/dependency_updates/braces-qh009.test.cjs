// FR// Mutations ciblées supplémentaires, en conservant les octets hors de la mutation.
// EN// Additional targeted mutations preserve all bytes outside the mutation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const history = 'docs/history/braces-qh009-20261022';
const cases = {
  'historical depth guard removal': ['patches/braces-3.0.3.patch', text => text.replace('+  MAX_DEPTH: 64,', '+  MAX_DEPTH: Infinity,')],
  'old patch archive mutation': [`${history}/patches/braces-3.0.3.patch`, text => text + '\n'],
  'old lock archive mutation': [`${history}/pnpm-lock.yaml`, text => text + '\n'],
  'cycle guard removal': ['patches/braces-3.0.3.patch', text => text.replace('ERR_BRACES_PARENT_CYCLE', 'ERR_OTHER')],
  'old patch reactivation': ['pnpm-lock.yaml', text => text.replace('braces: 3.0.3(patch_hash=ij22dduv7f6wi3glhwl7jmdbrm)', 'braces: 3.0.3(patch_hash=ob3dsxpumlsknkuupw7v5lrnv4)')],
  'historical test assertion removal': ['tests/dependency_updates/vite-qh010.test.cjs', text => text.replace("assert.match(result.stderr, /AssertionError/);", '')],
};
for (const [name, [filename, mutate]] of Object.entries(cases)) test(`QH009 preservation rejects ${name}`, () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'qh009-negative-'));
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
    if (name === 'historical depth guard removal') assert.match(result.stderr, /Historical mitigation changed/);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});
