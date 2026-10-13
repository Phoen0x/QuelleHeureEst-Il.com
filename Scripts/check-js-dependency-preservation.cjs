// FR// Empêcher les suppressions de dépendances et de variantes optionnelles lors des correctifs JS.
// EN// Prevent dependency and optional-variant removal during JS security fixes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const fromESLint = createRequire(require.resolve('eslint'));
const fromESLintrc = createRequire(fromESLint.resolve('@eslint/eslintrc'));
const yaml = fromESLintrc('js-yaml');

const reference = process.argv[2] || 'docs/history/js-security-20261013';
const beforeManifest = JSON.parse(fs.readFileSync(path.join(reference, 'package.json'), 'utf8'));
const afterManifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const before = yaml.load(fs.readFileSync(path.join(reference, 'pnpm-lock.yaml'), 'utf8'));
const after = yaml.load(fs.readFileSync('pnpm-lock.yaml', 'utf8'));

function packageName(key) {
  const match = key.match(/^\/(.+?)@(\d[^(/]*)/);
  assert.ok(match, `Unrecognized registry package key: ${key}`);
  return match[1];
}

for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
  for (const name of Object.keys(beforeManifest[field] || {})) {
    assert.ok(Object.hasOwn(afterManifest[field] || {}, name), `Dependency removed: ${field}/${name}`);
  }
}
assert.equal(String(after.lockfileVersion), '6.0');

const afterNames = new Set(Object.keys(after.packages).map(packageName));
const afterOptional = new Set(Object.entries(after.packages).filter(([, value]) => value.optional === true).map(([key]) => packageName(key)));
for (const [key, value] of Object.entries(before.packages)) {
  const name = packageName(key);
  assert.ok(afterNames.has(name), `Package removed: ${name}`);
  if (value.optional === true) assert.ok(afterOptional.has(name), `Optional package removed: ${name}`);
  const variants = Object.entries(after.packages).filter(([candidate]) => packageName(candidate) === name);
  for (const dependency of Object.keys(value.optionalDependencies || {})) {
    assert.ok(variants.some(([, variant]) => Object.hasOwn(variant.optionalDependencies || {}, dependency)), `Optional edge removed: ${name} > ${dependency}`);
  }
  for (const [peer, metadata] of Object.entries(value.peerDependenciesMeta || {})) {
    if (metadata.optional === true) {
      assert.ok(variants.some(([, variant]) => variant.peerDependenciesMeta?.[peer]?.optional === true), `Optional peer removed: ${name} > ${peer}`);
    }
  }
}
const seen = new Set();
const queue = [];
for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
  for (const [name, entry] of Object.entries(after[field] || {})) queue.push(`/${name}@${entry.version}`);
}
while (queue.length) {
  const key = queue.pop();
  if (seen.has(key)) continue;
  seen.add(key);
  const entry = after.packages[key];
  assert.ok(entry, `Missing lockfile entry: ${key}`);
  for (const field of ['dependencies', 'optionalDependencies']) {
    for (const [name, version] of Object.entries(entry[field] || {})) queue.push(`/${name}@${version}`);
  }
}
console.log(JSON.stringify({ reachableEntries: seen.size, packagesRetained: new Set(Object.keys(before.packages).map(packageName)).size, optionalPackagesRetained: afterOptional.size }));
