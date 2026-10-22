// FR// Vérifier le portage exact et toutes les arêtes, y compris les variantes historiques non installées.
// EN// Verify the exact port and every edge, including historical variants that are not installed.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const fromESLint = createRequire(require.resolve('eslint', { paths: [process.cwd()] }));
const fromESLintrc = createRequire(fromESLint.resolve('@eslint/eslintrc'));
const yaml = fromESLintrc('js-yaml');
const history = 'docs/history/rust-178';
const read = file => fs.readFileSync(file, 'utf8');
const before = yaml.load(read(`${history}/pnpm-lock.yaml`));
const after = yaml.load(read('pnpm-lock.yaml'));
const port = JSON.parse(read(`${history}/PORT.json`));
assert.deepEqual(Object.keys(before).sort(), Object.keys(after).sort());
for (const key of Object.keys(before).filter(key => key !== 'packages')) {
  assert.deepEqual(after[key], before[key], `Root lock metadata changed: ${key}`);
}
assert.equal(Object.keys(before.packages).length, 298);
assert.equal(Object.keys(after.packages).length, 337);
assert.deepEqual(Object.keys(after.packages).filter(key => !Object.hasOwn(before.packages, key)).sort(), port.added_nodes);
for (const [key, snapshot] of Object.entries(before.packages)) {
  assert.ok(Object.hasOwn(after.packages, key), `Historical node removed: ${key}`);
  if (key !== '/vite@8.0.16') assert.deepEqual(after.packages[key], snapshot, `Historical snapshot changed: ${key}`);
}
for (const [key, entry] of Object.entries(port.ported_snapshots)) {
  assert.deepEqual(after.packages[key], entry.snapshot, `Port differs from recorded upstream: ${key}`);
}
// FR// Le peer Lightning CSS de Vite 7 reste dans sa vraie variante ; Vite 8 le requiert directement.
// EN// The Vite 7 Lightning CSS peer remains in its actual variant; Vite 8 requires it directly.
assert.equal(after.packages['/vite@7.3.5'].peerDependenciesMeta.lightningcss.optional, true);
assert.equal(after.packages['/vite@8.0.16'].dependencies.lightningcss, '1.33.0');
assert.equal(after.packages['/vite@8.0.16'].peerDependenciesMeta.lightningcss, undefined);
const edgeKeys = entry => ['dependencies', 'optionalDependencies'].flatMap(field =>
  Object.entries(entry[field] || {}).map(([name, version]) => `/${name}@${version}`));
for (const [parent, entry] of Object.entries(after.packages)) {
  for (const child of edgeKeys(entry)) assert.ok(after.packages[child], `Unresolved edge: ${parent} > ${child}`);
}
const roots = ['dependencies', 'devDependencies', 'optionalDependencies'].flatMap(field =>
  Object.entries(after[field] || {}).map(([name, entry]) => `/${name}@${entry.version}`));
const seen = new Set();
const queue = [...roots];
while (queue.length) {
  const key = queue.pop();
  if (seen.has(key)) continue;
  assert.ok(after.packages[key], `Unresolved root or edge: ${key}`);
  seen.add(key);
  queue.push(...edgeKeys(after.packages[key]));
}
assert.ok(seen.has('/@vitejs/plugin-react@6.0.2(vite@8.0.16)'));
assert.ok(!seen.has('/@vitejs/plugin-react@4.7.0(vite@7.3.5)'));
assert.ok(!seen.has('/vite@7.3.5'));
const result = spawnSync(process.execPath, [path.join(__dirname, 'check-js-dependency-preservation.cjs'), history], { encoding: 'utf8', timeout: 30000 });
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
assert.equal(result.status, 0, 'Original #153 generic guard failed');
const report = { status: 'PASS', totalEntries: Object.keys(after.packages).length,
  reachableEntries: seen.size, historicalUnreachableEntries: Object.keys(after.packages).filter(key => !seen.has(key)).sort(),
  optionalEntries: Object.values(after.packages).filter(entry => entry.optional === true).length,
  preservedHistoricalEntries: 297, correctedEntries: 1, addedEntries: 39, missingEdges: [] };
if (process.env.EVIDENCE_DIR) fs.writeFileSync(path.join(process.env.EVIDENCE_DIR, 'dependency-graph.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
