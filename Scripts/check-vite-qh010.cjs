// FR// Complément strict QH-010 ; les protections historiques restent exécutées par l'appelant.
// EN// Strict QH-010 addendum; historical protections still run in the caller.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
module.exports = function checkVite({ root, treeIdentity, reachable, yaml }) {
  const history = 'docs/history/vite-qh010-20261022';
  const read = name => fs.readFileSync(path.join(root, name), 'utf8');
  const git = args => execFileSync('git', args, { cwd: root, timeout: 30000 });
  const hash = data => crypto.createHash('sha256').update(data).digest('hex');
  const ref = JSON.parse(read(`${history}/PORT.json`));
  const modified = ['package.json', 'pnpm-lock.yaml', 'Scripts/check-js-security-183.cjs', 'tests/dependency_updates/js-security-183.test.cjs'];
  const additions = new Set([
    ...modified.map(name => `${history}/${name}`), `${history}/PORT.json`, `${history}/PR183.before.md`,
    'Scripts/check-vite-qh010.cjs', 'tests/dependency_updates/vite-qh010.test.cjs',
    'tests/security/vite-qh010.test.mjs',
    'docs/reports/vite-qh010-20261022.md', 'docs/reports/vite-qh010-20261022-evidence.json',
  ]);
  assert.equal(ref.base_sha, 'bdda4abf3430bc5bda20176538c08533694c83f7');
  assert.equal(ref.base_tree, 'd2abf9f14b2df9038c34b99ed6f3f592974bad6e');
  assert.equal(treeIdentity(ref.initial_files), ref.base_tree, 'QH010 baseline tree changed');
  assert.equal(Object.keys(ref.initial_files).length, 133);
  for (const [name, entry] of Object.entries(ref.initial_files)) {
    const current = path.join(root, name);
    assert.ok(fs.existsSync(current) && !fs.lstatSync(current).isSymbolicLink(), `Missing/replaced ${name}`);
    assert.equal(entry.type, 'blob');
    assert.equal(fs.statSync(current).mode & 0o111 ? '100755' : '100644', entry.mode, `Mode changed ${name}`);
    const checked = modified.includes(name) ? `${history}/${name}` : name;
    assert.equal(git(['hash-object', '--path', name, checked]).toString().trim(), entry.sha, `File/archive changed ${name}`);
    if (modified.includes(name)) assert.equal(hash(fs.readFileSync(path.join(root, checked))), ref.archived_files[name].sha256, `Archive hash ${name}`);
  }
  const listed = new Set([...git(['ls-files', '-z']).toString().split('\0'), ...git(['ls-files', '--others', '--exclude-standard', '-z']).toString().split('\0')].filter(Boolean));
  for (const name of listed) assert.ok(Object.hasOwn(ref.initial_files, name) || additions.has(name), `Out of QH010 scope ${name}`);
  for (const name of additions) assert.ok(fs.existsSync(path.join(root, name)), `Missing QH010 deliverable ${name}`);
  const expectedManifest = JSON.parse(read(`${history}/package.json`));
  expectedManifest.devDependencies.vite = '8.1.6';
  assert.deepEqual(JSON.parse(read('package.json')), expectedManifest, 'Only Vite manifest update allowed');
  const beforeRaw = read(`${history}/pnpm-lock.yaml`), afterRaw = read('pnpm-lock.yaml');
  const before = yaml.load(beforeRaw), after = yaml.load(afterRaw);
  assert.equal(Object.keys(before.packages).length, 384);
  assert.equal(Object.values(before.packages).filter(x => x.optional === true).length, 121);
  function blocks(raw) {
    const matches = [...raw.matchAll(/^  (\/[^\n]+):\n/gm)];
    return Object.fromEntries(matches.map((m, i) => [m[1], raw.slice(m.index, matches[i + 1]?.index ?? raw.length).trimEnd()]));
  }
  const oldBlocks = blocks(beforeRaw), newBlocks = blocks(afterRaw);
  assert.equal(Object.keys(oldBlocks).length, 384);
  for (const [key, value] of Object.entries(before.packages)) {
    assert.deepEqual(after.packages[key], value, `Historical snapshot mutated/removed ${key}`);
    assert.equal(newBlocks[key], oldBlocks[key], `Historical annotations changed ${key}`);
  }
  const prefix = structuredClone(before);
  delete prefix.packages;
  prefix.devDependencies.vite = { specifier: '8.1.6', version: '8.1.6(esbuild@0.28.1)' };
  prefix.devDependencies['@vitejs/plugin-react'].version = '6.0.2(vite@8.1.6)';
  const actualPrefix = { ...after }; delete actualPrefix.packages;
  assert.deepEqual(actualPrefix, prefix, 'Unapproved lock root/settings change');
  const added = Object.keys(after.packages).filter(k => !Object.hasOwn(before.packages, k));
  assert.equal(added.length, 24);
  assert.deepEqual(added.sort(), Object.keys(ref.added_snapshots).sort(), 'Unexpected new snapshot');
  for (const key of added) assert.equal(hash(JSON.stringify(after.packages[key])), ref.added_snapshots[key], `New snapshot mutated ${key}`);
  const expectedPlugin = structuredClone(before.packages['/@vitejs/plugin-react@6.0.2(vite@8.0.16)']);
  expectedPlugin.dependencies.vite = '8.1.6(esbuild@0.28.1)';
  assert.deepEqual(after.packages['/@vitejs/plugin-react@6.0.2(vite@8.1.6)'], expectedPlugin, 'Plugin-react changed beyond Vite peer');
  const beforeReach = reachable(before), afterReach = reachable(after);
  assert.equal(beforeReach.size, 303);
  assert.equal(afterReach.size, 304);
  const inactive = Object.keys(before.packages).filter(k => !beforeReach.has(k));
  assert.equal(inactive.length, 81);
  for (const key of inactive) assert.ok(!afterReach.has(key), `Historical variant reactivated ${key}`);
  assert.deepEqual([...afterReach].filter(k => k.startsWith('/vite@')), ['/vite@8.1.6(esbuild@0.28.1)']);
  assert.deepEqual([...afterReach].filter(k => k.startsWith('/@vitejs/plugin-react@')), ['/@vitejs/plugin-react@6.0.2(vite@8.1.6)']);
  const generic = spawnSync(process.execPath, ['docs/validation/rust-178/check-js-dependency-preservation.cjs', history], { cwd: root, encoding: 'utf8', timeout: 30000 });
  assert.equal(generic.status, 0, generic.stderr || generic.stdout);
  return { base: ref.base_sha, originalFiles: 133, unchangedFiles: 129, archivedModifiedFiles: modified,
    identicalInitialSnapshots: 384, initialOptionalRetained: 121, initialInactiveNotReactivated: 81,
    addedSnapshots: 24, totalSnapshots: 408, reachableEntries: 304,
    optionalAfter: Object.values(after.packages).filter(x => x.optional === true).length,
    cargoAndHttpTestsUnchanged: true };
};
