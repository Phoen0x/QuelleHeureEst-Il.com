// FR// Contrôle additif du durcissement ; les gardes historiques tournent sur leur état initial exact.
// EN// Additive hardening check; historical guards run on their exact initial state.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const history = 'docs/history/braces-qh009-20261022';
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const git = args => execFileSync('git', args, { cwd: root, timeout: 30000 });
const blob = data => crypto.createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const fromESLint = createRequire(require.resolve('eslint', { paths: [root] }));
const yaml = createRequire(fromESLint.resolve('@eslint/eslintrc'))('js-yaml');
const changed = ['patches/braces-3.0.3.patch', 'pnpm-lock.yaml',
  'docs/validation/rust-178/check-ported-graph.cjs',
  'tests/dependency_updates/js-security-183.test.cjs', 'tests/dependency_updates/vite-qh010.test.cjs'];
const additions = new Set([
  ...changed.map(name => `${history}/${name}`), `${history}/PORT.json`, `${history}/PR183.before.md`,
  'Scripts/check-braces-qh009.cjs', 'tests/braces-hardening.test.mjs',
  'tests/security/braces-hardening-worker.cjs', 'tests/dependency_updates/braces-qh009.test.cjs',
  'docs/reports/braces-qh009-20261022.md', 'docs/reports/braces-qh009-20261022-evidence.json',
]);
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


const reference = JSON.parse(read(`${history}/PORT.json`));
assert.equal(reference.base_sha, '66f4d47f0b10f07c80a3ac257c3f76947bff8051');
assert.equal(reference.base_tree, '158f80803a721879177ab9e9de85abeb367e0457');
assert.equal(treeIdentity(reference.initial_files), reference.base_tree, 'Initial tree identity changed');
assert.equal(Object.keys(reference.initial_files).length, 144);
assert.deepEqual(reference.modified_files, changed);
for (const [name, entry] of Object.entries(reference.initial_files)) {
  const checked = changed.includes(name) ? `${history}/${name}` : name;
  const filename = path.join(root, checked);
  assert.ok(fs.existsSync(filename) && !fs.lstatSync(filename).isSymbolicLink(), `Missing/replaced ${name}`);
  assert.equal(git(['hash-object', '--path', name, checked]).toString().trim(), entry.sha, `Initial file/archive changed ${name}`);
  assert.equal(fs.statSync(filename).mode & 0o111 ? '100755' : '100644', entry.mode, `Mode changed ${name}`);
  if (changed.includes(name)) {
    assert.equal(blob(fs.readFileSync(filename)), reference.archives[name].git_blob);
    assert.equal(hash(fs.readFileSync(filename)), reference.archives[name].sha256);
  }
}
for (const name of changed.filter(n => n.startsWith('tests/'))) {
  assert.equal(read(name), read(`${history}/${name}`).replace("['Scripts/check-js-security-183.cjs']", "['docs/validation/rust-178/check-ported-graph.cjs']"), `Historical negative tests changed ${name}`);
}
assert.equal(read('docs/validation/rust-178/check-ported-graph.cjs'), "// FR// Cumuler les gardes historiques et le contrôle du durcissement QH-009.\n// EN// Combine historical guards with the QH-009 hardening check.\nrequire('../../../Scripts/check-braces-qh009.cjs');\n");
const listed = new Set([...git(['ls-files', '-z']).toString().split('\0'),
  ...git(['ls-files', '--others', '--exclude-standard', '-z']).toString().split('\0')].filter(Boolean));
for (const name of listed) assert.ok(Object.hasOwn(reference.initial_files, name) || additions.has(name), `Out of scope ${name}`);
for (const name of additions) assert.ok(fs.existsSync(path.join(root, name)), `Missing deliverable ${name}`);
const beforeRaw = read(`${history}/pnpm-lock.yaml`), afterRaw = read('pnpm-lock.yaml');
const before = yaml.load(beforeRaw), after = yaml.load(afterRaw);
function blocks(raw) {
  const matches = [...raw.matchAll(/^  (\/[^\n]+):\n/gm)];
  return Object.fromEntries(matches.map((m, i) => [m[1], raw.slice(m.index, matches[i + 1]?.index ?? raw.length).trimEnd()]));
}
const oldBlocks = blocks(beforeRaw), newBlocks = blocks(afterRaw);
assert.equal(Object.keys(before.packages).length, 408);
assert.equal(Object.keys(after.packages).length, 409);
const oldHash = 'ob3dsxpumlsknkuupw7v5lrnv4', newHash = 'ij22dduv7f6wi3glhwl7jmdbrm';
const version = `3.0.3(patch_hash=${newHash})`, added = `/braces@${version}`;
const consumers = ['/chokidar@3.6.0', '/micromatch@4.0.8'];
for (const [key, previous] of Object.entries(before.packages)) {
  const expected = structuredClone(previous);
  if (consumers.includes(key)) expected.dependencies.braces = version;
  assert.deepEqual(after.packages[key], expected, `Historical snapshot changed/removed ${key}`);
  assert.equal(newBlocks[key], consumers.includes(key) ? oldBlocks[key].replace(`braces: 3.0.3(patch_hash=${oldHash})`, `braces: ${version}`) : oldBlocks[key], `Historical bytes/annotations changed ${key}`);
}
assert.deepEqual(Object.keys(after.packages).filter(k => !Object.hasOwn(before.packages, k)), [added]);
assert.deepEqual(after.packages[added], before.packages[`/braces@3.0.3(patch_hash=${oldHash})`]);
const expectedPrefix = structuredClone(before); delete expectedPrefix.packages;
expectedPrefix.patchedDependencies['braces@3.0.3'].hash = newHash;
const actualPrefix = { ...after }; delete actualPrefix.packages;
assert.deepEqual(actualPrefix, expectedPrefix, 'Lock root/settings changed');
// FR// Préserver chaque ajout/retrait historique par fichier malgré le regroupement des hunks pour pnpm.
// EN// Preserve every historical addition/deletion per file despite regrouping hunks for pnpm.
function changes(patch) {
  const counts = new Map();
  let file;
  for (const line of patch.split('\n')) {
    if (line.startsWith('diff --git ')) file = line;
    else if (/^[+-]/.test(line) && !/^(\+\+\+|---)/.test(line)) {
      const key = file + '\n' + line;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return counts;
}
const historicalChanges = changes(read(`${history}/patches/braces-3.0.3.patch`));
const currentChanges = changes(read('patches/braces-3.0.3.patch'));
assert.ok([...historicalChanges].every(([line, count]) => (currentChanges.get(line) || 0) >= count), 'Historical mitigation changed');
assert.equal(blob(fs.readFileSync(path.join(root, 'patches/braces-3.0.3.patch'))), 'ae2c420fdbce41998f28c4cb4800cdf1da5f12c4');
const expectedInstalled = {
  "lib/constants.js": "ee7cbbaff6e658c5d54fb6bb3b3a0f267bd294017e3dfcf69085d520ec8220d9",
  "lib/utils.js": "e818b394d19c42a061b949a1891044e0a8414be966825496c2c7bda11e983119",
  "lib/parse.js": "e0fefce6fcc15f9251b6d396cec5ed2a0399a291bb2e8ac66c8bcd5d26224126",
  "lib/compile.js": "88cf20f18b59c9b2741c2d9b0f0ac6b2967d8e174667edf817133ca57d76809e",
  "lib/expand.js": "d45dec381c411a3bdc6c6b5289909cd9d1255c5c9e49ea0f4e494d2125679ee7",
  "lib/stringify.js": "a3b8b5e7567ff9bfdbe155479fbdd92d5a924c3919adf05316f8f0c4f6330332"
};
const tailwind = createRequire(require.resolve('tailwindcss/package.json', { paths: [root] }));
const mm = createRequire(tailwind.resolve('micromatch')), ch = createRequire(tailwind.resolve('chokidar'));
assert.equal(mm.resolve('braces'), ch.resolve('braces'), 'Consumers resolve different braces');
const installed = path.dirname(mm.resolve('braces'));
assert.ok(installed.includes(`patch_hash=${newHash}`), 'Installed patch hash differs');
for (const [name, expected] of Object.entries(expectedInstalled)) assert.equal(hash(fs.readFileSync(path.join(installed, name))), expected, `Installed patch mismatch ${name}`);
const active = reachable(after), previousActive = reachable(before);
assert.equal(active.size, 304);
assert.deepEqual([...active].filter(k => k.startsWith('/braces@')), [added]);
const inactive = Object.keys(before.packages).filter(k => !previousActive.has(k));
assert.equal(inactive.length, 104);
for (const key of inactive) assert.ok(!active.has(key), `Historical variant reactivated ${key}`);
assert.ok(!active.has(`/braces@3.0.3(patch_hash=${oldHash})`));
for (const [parent, entry] of Object.entries(after.packages)) for (const field of ['dependencies', 'optionalDependencies']) {
  for (const [name, ver] of Object.entries(entry[field] || {})) assert.ok(after.packages[`/${name}@${ver}`], `Missing edge ${parent}/${name}`);
}
assert.equal(Object.values(after.packages).filter(e => e.optional === true).length, 140);
// FR// Exécuter toutes les anciennes assertions sans changer leurs SHA, sur une projection authentifiée.
// EN// Execute every historical assertion without changing its SHAs, on an authenticated projection.
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'qh009-baseline-'));
let historical;
try {
  const view = path.join(temporary, 'view'), gitDirectory = path.join(temporary, 'git');
  fs.mkdirSync(view);
  for (const [name, entry] of Object.entries(reference.initial_files)) {
    const target = path.join(view, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, changed.includes(name) ? `${history}/${name}` : name), target);
    fs.chmodSync(target, entry.mode === '100755' ? 0o755 : 0o644);
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(view, 'node_modules'), 'dir');
  const initEnvironment = { ...process.env };
  delete initEnvironment.GIT_DIR;
  delete initEnvironment.GIT_WORK_TREE;
  delete initEnvironment.GIT_INDEX_FILE;
  execFileSync('git', ['init', '--bare', '--initial-branch=preservation', gitDirectory], { timeout: 30000, stdio: 'pipe', env: initEnvironment });
  historical = spawnSync(process.execPath, ['Scripts/check-js-security-183.cjs'], {
    cwd: view, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, GIT_DIR: gitDirectory, GIT_WORK_TREE: view },
  });
  assert.equal(historical.status, 0, historical.stderr || historical.stdout);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
console.log(JSON.stringify({ status: 'PASS', base: reference.base_sha,
  originalFiles: 144, unchangedFiles: 139, archivedModifiedFiles: changed,
  snapshotsBefore: 408, snapshotsAfter: 409, identicalActiveBlocks: 406,
  adaptedConsumerEdges: consumers, exactOriginalBlocksArchived: 408,
  optional: 140, reachable: active.size, initialInactiveNotReactivated: 104,
  historicalGuards: JSON.parse(historical.stdout), patchHash: newHash }, null, 2));
