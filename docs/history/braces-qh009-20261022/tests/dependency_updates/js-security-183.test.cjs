// FR// Mutations isolées : aucune source du checkout ni référence Git n'est modifiée.
// EN// Isolated mutations: checkout sources and Git references are never modified.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../..');
const fromESLint = createRequire(require.resolve('eslint', { paths: [root] }));
const yaml = createRequire(fromESLint.resolve('@eslint/eslintrc'))('js-yaml');
let fixture, environment, originalLock, originalCargo;

before(() => {
  fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'js-preservation-183-'));
  const args = { cwd: root, timeout: 30000 };
  const names = new Set([
    ...execFileSync('git', ['ls-files', '-z'], args).toString().split('\0'),
    ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], args).toString().split('\0'),
  ]);
  for (const name of names) {
    if (!name) continue;
    const target = path.join(fixture, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, name), target);
    fs.chmodSync(target, fs.statSync(path.join(root, name)).mode & 0o777);
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
  environment = { ...process.env,
    GIT_DIR: execFileSync('git', ['rev-parse', '--absolute-git-dir'], args).toString().trim(),
    GIT_WORK_TREE: fixture };
  originalLock = fs.readFileSync(path.join(fixture, 'pnpm-lock.yaml'));
  originalCargo = fs.readFileSync(path.join(fixture, 'Cargo.lock'));
});
after(() => { if (fixture) fs.rmSync(fixture, { recursive: true, force: true }); });

function check() {
  return spawnSync(process.execPath, ['Scripts/check-js-security-183.cjs'], {
    cwd: fixture, env: environment, encoding: 'utf8', timeout: 30000,
  });
}
test('preservation: intact candidate accepted', () => {
  const result = check();
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
test('preservation: initial Git object not required by a shallow checkout', () => {
  const gitDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'js-preservation-empty-git-'));
  const previous = environment;
  try {
    execFileSync('git', ['init', '--bare', '--initial-branch=codex/fix-development-validation-20261021', gitDirectory], { timeout: 30000, stdio: 'pipe' });
    environment = { ...environment, GIT_DIR: gitDirectory };
    const result = check();
    assert.equal(result.status, 0, result.stderr || result.stdout);
  } finally {
    environment = previous;
    fs.rmSync(gitDirectory, { recursive: true, force: true });
  }
});

// FR// Modifier uniquement les blocs visés : un reformatage global ne doit pas fausser un test négatif.
// EN// Change only targeted blocks: global formatting must not cause false-negative-test success.
function mutatedLockText(lock) {
  const raw = originalLock.toString(), before = yaml.load(raw);
  if (JSON.stringify(lock) === JSON.stringify(before)) return raw;
  const matches = [...raw.matchAll(/^  (\/[^\n]+):\n/gm)];
  const prefix = value => { const copy = { ...value }; delete copy.packages; return copy; };
  const header = JSON.stringify(prefix(lock)) === JSON.stringify(prefix(before))
    ? raw.slice(0, matches[0].index)
    : yaml.dump(prefix(lock)) + '\npackages:\n\n';
  return header + matches.map((m, i) => {
    const key = m[1];
    if (!lock.packages[key]) return '';
    if (JSON.stringify(lock.packages[key]) === JSON.stringify(before.packages[key])) return raw.slice(m.index, matches[i + 1]?.index ?? raw.length);
    return yaml.dump({ [key]: lock.packages[key] }).split('\n').filter(Boolean).map(line => '  ' + line).join('\n') + '\n\n';
  }).join('');
}
test('preservation: no-op mutation serializer preserves lock bytes', () => {
  assert.equal(mutatedLockText(yaml.load(originalLock.toString())), originalLock.toString());
});

const mutations = {
  'Android snapshot deletion': lock => { delete lock.packages['/@esbuild/android-arm64@0.27.7']; },
  'optional platform flag removal': lock => { delete lock.packages['/@esbuild/android-arm64@0.27.7'].optional; },
  'historical Babel activation': lock => { lock.devDependencies['@babel/core'] = { specifier: '7.29.7', version: '7.29.7' }; },
  'unpatched braces consumer': lock => { lock.packages['/micromatch@4.0.8'].dependencies.braces = '3.0.3'; },
  'Rust lock mutation': () => { fs.appendFileSync(path.join(fixture, 'Cargo.lock'), '\n# mutation\n'); },
};
for (const [name, mutate] of Object.entries(mutations)) test(`preservation rejects ${name}`, () => {
  try {
    const lock = yaml.load(originalLock.toString());
    mutate(lock);
    fs.writeFileSync(path.join(fixture, 'pnpm-lock.yaml'), mutatedLockText(lock));
    const result = check();
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /AssertionError/);
  } finally {
    fs.writeFileSync(path.join(fixture, 'pnpm-lock.yaml'), originalLock);
    fs.writeFileSync(path.join(fixture, 'Cargo.lock'), originalCargo);
  }
});
