// FR// Vérifier le portage JS contre le head réel de #183, sans mutation ni accès réseau.
// EN// Check the JS port against PR183's actual head without mutation or network access.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const base = '6db8239390b6cf12cb22c0d9ff43ac62c680967b';
const history = 'docs/history/js-security-183-20261022';
const changedFiles = ['package.json', 'pnpm-lock.yaml', 'docs/validation/rust-178/check-ported-graph.cjs'];
const additions = new Set([
  'Scripts/check-js-security-183.cjs', 'patches/braces-3.0.3.patch',
  'tests/security/braces-depth.test.cjs', 'tests/dependency_updates/js-security-183.test.cjs',
  ...changedFiles.map(name => `${history}/${name}`), `${history}/PORT.json`, `${history}/PR183.before.md`,
  'docs/reports/js-security-183-20261022.md', 'docs/reports/js-security-183-20261022-evidence.json',
]);
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const git = args => execFileSync('git', args, { cwd: root, timeout: 30000 });
const blob = data => crypto.createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
const fromESLint = createRequire(require.resolve('eslint', { paths: [root] }));
const yaml = createRequire(fromESLint.resolve('@eslint/eslintrc'))('js-yaml');

function reachable(lock) {
  const queue = ['dependencies', 'devDependencies', 'optionalDependencies'].flatMap(field =>
    Object.entries(lock[field] || {}).map(([name, entry]) => `/${name}@${entry.version}`));
  const seen = new Set();
  while (queue.length) {
    const key = queue.pop();
    if (seen.has(key)) continue;
    assert.ok(lock.packages[key], `Missing root/edge ${key}`);
    seen.add(key);
    for (const field of ['dependencies', 'optionalDependencies']) {
      queue.push(...Object.entries(lock.packages[key][field] || {}).map(([name, version]) => `/${name}@${version}`));
    }
  }
  return seen;
}

// FR// Reconstituer l'identité de l'arbre initial sans exiger son objet dans un clone superficiel.
// EN// Reconstruct the initial tree identity without requiring its object in a shallow clone.
function treeIdentity(files) {
  const tree = new Map();
  for (const [name, entry] of Object.entries(files)) {
    const parts = name.split('/');
    let current = tree;
    for (const part of parts.slice(0, -1)) {
      if (!current.has(part)) current.set(part, new Map());
      current = current.get(part);
    }
    current.set(parts.at(-1), entry);
  }
  function walk(current) {
    const entries = [...current].map(([name, value]) => value instanceof Map
      ? { name, mode: '40000', sha: walk(value), directory: true }
      : { name, mode: value.mode, sha: value.sha, directory: false });
    entries.sort((a, b) => Buffer.compare(Buffer.from(a.name + (a.directory ? '/' : '')), Buffer.from(b.name + (b.directory ? '/' : ''))));
    const data = Buffer.concat(entries.flatMap(entry => [Buffer.from(`${entry.mode} ${entry.name}\0`), Buffer.from(entry.sha, 'hex')]));
    return crypto.createHash('sha1').update(`tree ${data.length}\0`).update(data).digest('hex');
  }
  return walk(tree);
}

function main() {
  const reference = JSON.parse(read(`${history}/PORT.json`));
  assert.equal(reference.base_sha, base);
  assert.equal(reference.base_tree, '8a9ae1a5639a047c530136b33cdf8f85c983cc2a');
  assert.equal(treeIdentity(reference.initial_files), reference.base_tree, 'Initial tree manifest changed');
  const originals = Object.entries(reference.initial_files);
  assert.equal(originals.length, 122);
  const baseNames = new Set();
  for (const [name, { mode, type: kind, sha }] of originals) {
    baseNames.add(name);
    assert.equal(kind, 'blob');
    const file = path.join(root, name);
    assert.ok(fs.existsSync(file) && !fs.lstatSync(file).isSymbolicLink(), `Missing/replaced ${name}`);
    if (!changedFiles.includes(name)) assert.equal(git(['hash-object', '--path', name, name]).toString().trim(), sha, `File changed ${name}`);
    if (mode === '100755') assert.ok(fs.statSync(file).mode & 0o111, `Mode changed ${name}`);
  }
  for (const name of changedFiles) assert.equal(blob(fs.readFileSync(path.join(root, history, name))), reference.initial_files[name].sha, `Archive differs ${name}`);
  const listed = [...git(['ls-files', '-z']).toString().split('\0'), ...git(['ls-files', '--others', '--exclude-standard', '-z']).toString().split('\0')].filter(Boolean);
  for (const name of listed) assert.ok(baseNames.has(name) || additions.has(name), `Out of scope ${name}`);

  const beforeManifest = JSON.parse(read(`${history}/package.json`));
  const afterManifest = JSON.parse(read('package.json'));
  for (const [key, value] of Object.entries(beforeManifest)) {
    if (!['scripts', 'devDependencies'].includes(key)) assert.deepEqual(afterManifest[key], value, `Manifest field ${key}`);
  }
  assert.deepEqual(Object.keys(afterManifest).filter(k => !Object.hasOwn(beforeManifest, k)).sort(), ['packageManager', 'pnpm']);
  assert.equal(afterManifest.packageManager, 'pnpm@8.15.9');
  for (const [name, value] of Object.entries(beforeManifest.scripts)) assert.equal(afterManifest.scripts[name], value, `Script changed ${name}`);
  assert.equal(afterManifest.scripts['test:security'], 'node --test tests/security/braces-depth.test.cjs');
  assert.equal(afterManifest.scripts['check:dependencies'], 'node docs/validation/rust-178/check-ported-graph.cjs');
  assert.deepEqual(Object.keys(afterManifest.scripts).filter(k => !Object.hasOwn(beforeManifest.scripts, k)).sort(), ['check:dependencies', 'test:security']);
  for (const [name, value] of Object.entries(beforeManifest.devDependencies)) assert.equal(afterManifest.devDependencies[name], name === 'postcss' ? '^8.5.25' : value, name);
  assert.deepEqual(Object.keys(afterManifest.devDependencies).filter(k => !Object.hasOwn(beforeManifest.devDependencies, k)).sort(), ['esbuild', 'rollup']);
  assert.equal(afterManifest.devDependencies.esbuild, '0.28.1');
  assert.equal(afterManifest.devDependencies.rollup, '4.61.1');
  assert.deepEqual(afterManifest.pnpm, {
    overrides: {
      'brace-expansion@^1.1.0': '1.1.21', 'brace-expansion@^5.0.0': '5.0.12',
      'js-yaml@^4.0.0': '4.3.2', 'nanoid@^3.0.0': '3.3.18', 'postcss@^8.0.0': '8.5.25',
      'browserslist@^4.0.0': '4.28.9', 'baseline-browser-mapping@^2.0.0': '2.11.22',
      'source-map-js@^1.0.0': '1.2.2', 'postcss-selector-parser@^6.0.0': '7.1.6',
      'esbuild@>=0.27.3 <0.28.1': '0.28.1',
    }, patchedDependencies: { 'braces@3.0.3': 'patches/braces-3.0.3.patch' },
  });
  assert.equal(blob(fs.readFileSync(path.join(root, 'patches/braces-3.0.3.patch'))), '1a0f684bb519b44b5f20a19cfd104525411435d7');
  assert.equal(blob(fs.readFileSync(path.join(root, 'tests/security/braces-depth.test.cjs'))), 'b0ce4344d903b2a6b26e995efee91f86a1521747');

  const before = yaml.load(read(`${history}/pnpm-lock.yaml`));
  const after = yaml.load(read('pnpm-lock.yaml'));
  assert.equal(String(after.lockfileVersion), '6.0');
  assert.equal(Object.keys(before.packages).length, 337);
  assert.equal(Object.values(before.packages).filter(x => x.optional === true).length, 95);
  const changedNodes = new Set([
    '/@eslint/eslintrc@3.3.5', '/@vitejs/plugin-react@6.0.2(vite@8.0.16)',
    '/chokidar@3.6.0', '/js-tokens@4.0.0', '/micromatch@4.0.8',
    '/minimatch@10.2.5', '/minimatch@3.1.5', '/tailwindcss@3.4.19',
  ]);
  const targets = {
    'brace-expansion': ['1.1.21', '5.0.12'], 'js-yaml': ['4.3.2'],
    nanoid: ['3.3.18'], postcss: ['8.5.25'], browserslist: ['4.28.9'],
    'baseline-browser-mapping': ['2.11.22'], 'source-map-js': ['1.2.2'],
    'postcss-selector-parser': ['7.1.6'], esbuild: ['0.28.1'],
  };
  let same = 0;
  for (const [key, old] of Object.entries(before.packages)) {
    const current = after.packages[key];
    assert.ok(current, `Historical snapshot removed ${key}`);
    if (!changedNodes.has(key)) { assert.deepEqual(current, old, `Historical snapshot changed ${key}`); same++; continue; }
    for (const [field, value] of Object.entries(old)) {
      if (!['dependencies', 'optionalDependencies', 'dev'].includes(field)) assert.deepEqual(current[field], value, `${key}/${field}`);
    }
    if (key === '/js-tokens@4.0.0') {
      // FR// pnpm explicite le rôle production déjà implicite dans le snapshot initial.
      // EN// pnpm makes explicit the production role already implicit in the initial snapshot.
      assert.equal(old.dev, undefined);
      assert.equal(current.dev, false);
      assert.deepEqual(Object.keys(current).filter(k => k !== 'dev').sort(), Object.keys(old).sort(), key);
    } else {
      assert.deepEqual(Object.keys(current).sort(), Object.keys(old).sort(), key);
      assert.equal(current.dev, old.dev, key);
    }
    for (const field of ['dependencies', 'optionalDependencies']) {
      assert.deepEqual(Object.keys(current[field] || {}).sort(), Object.keys(old[field] || {}).sort(), `${key}/${field}`);
      for (const [name, version] of Object.entries(old[field] || {})) {
        const next = current[field][name];
        if (version.split('(')[0] !== next.split('(')[0]) assert.ok(targets[name]?.includes(next.split('(')[0]), `Unapproved edge ${key}/${name}`);
      }
    }
  }
  for (const [parent, entry] of Object.entries(after.packages)) for (const field of ['dependencies', 'optionalDependencies']) {
    for (const [name, version] of Object.entries(entry[field] || {})) assert.ok(after.packages[`/${name}@${version}`], `Unresolved edge ${parent}/${name}`);
  }
  const beforeReach = reachable(before), afterReach = reachable(after);
  const patched = after.patchedDependencies['braces@3.0.3'];
  assert.equal(patched.path, 'patches/braces-3.0.3.patch');
  const patchedVersion = `3.0.3(patch_hash=${patched.hash})`;
  for (const consumer of ['/micromatch@4.0.8', '/chokidar@3.6.0']) assert.equal(after.packages[consumer].dependencies.braces, patchedVersion, `Unpatched consumer ${consumer}`);
  assert.deepEqual([...afterReach].filter(k => k.startsWith('/braces@')), [`/braces@${patchedVersion}`]);
  assert.equal(beforeReach.size, 302);
  const historyKeys = Object.keys(before.packages).filter(k => !beforeReach.has(k));
  assert.equal(historyKeys.length, 35);
  for (const key of historyKeys) assert.ok(!afterReach.has(key), `Historical variant reactivated ${key}`);
  for (const [name, entry] of Object.entries(before.devDependencies)) if (name !== 'postcss') {
    assert.equal(after.devDependencies[name].specifier, entry.specifier, name);
    assert.equal(after.devDependencies[name].version.split('(')[0], entry.version.split('(')[0], `Root version changed ${name}`);
  }
  const generic = spawnSync(process.execPath, [path.join(root, 'docs/validation/rust-178/check-js-dependency-preservation.cjs'), history], { cwd: root, encoding: 'utf8', timeout: 30000 });
  assert.equal(generic.status, 0, generic.stderr || generic.stdout);
  console.log(JSON.stringify({status:'PASS',base,originalFiles:122,unchangedFiles:119,archivedModifiedFiles:changedFiles,
    initialSnapshots:337,identicalInitialSnapshots:same,adaptedInitialSnapshots:337-same,missingSnapshots:[],
    initialOptional:95,optionalAfter:Object.values(after.packages).filter(x=>x.optional === true).length,
    historicalNotReactivated:historyKeys.length,totalSnapshots:Object.keys(after.packages).length,
    reachableEntries:afterReach.size,missingEdges:[],cargoAndHttpTestsUnchanged:true},null,2));
}
main();
