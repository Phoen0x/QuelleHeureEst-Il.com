// FR// Contrôle additif Tokio : verrou minimal et projection authentifiée des gardes antérieures.
// EN// Additive Tokio check: minimal lock change and authenticated projection of previous guards.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const history = 'docs/history/tokio-qh011-20261023';
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const git = args => execFileSync('git', args, { cwd: root, timeout: 30000 });
const blob = data => crypto.createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const fromESLint = createRequire(require.resolve('eslint', { paths: [root] }));
const yaml = createRequire(fromESLint.resolve('@eslint/eslintrc'))('js-yaml');
const changed = ['Cargo.lock', 'docs/validation/rust-178/check-ported-graph.cjs'];
const additions = new Set([
  ...changed.map(name => `${history}/${name}`), `${history}/PORT.json`, `${history}/PR183.before.md`,
  'Scripts/check-tokio-qh011.cjs', 'tests/dependency_updates/tokio-qh011.test.cjs',
  'docs/reports/tokio-qh011-20261023.md', 'docs/reports/tokio-qh011-20261023-evidence.json',
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
assert.equal(reference.base_sha, 'fb3ff18a7829a7ac997e7569cabc8ed3a9603aca');
assert.equal(reference.base_tree, '676f12c3c56536732b6448938a15d680c109b22a');
assert.equal(treeIdentity(reference.initial_files), reference.base_tree, 'Initial tree identity changed');
assert.equal(Object.keys(reference.initial_files).length, 157);
assert.deepEqual(reference.modified_files, changed);
// FR// Garder le diagnostic sémantique historique avant l'authentification supplémentaire des fichiers.
// EN// Retain the historical semantic diagnostic before additional file authentication.
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
const historicalChanges = changes(read('docs/history/braces-qh009-20261022/patches/braces-3.0.3.patch'));
const currentChanges = changes(read('patches/braces-3.0.3.patch'));
assert.ok([...historicalChanges].every(([line, count]) => (currentChanges.get(line) || 0) >= count), 'Historical mitigation changed');
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
const wrapper = "// FR// Cumuler les gardes historiques et la conservation ciblée Tokio.\n// EN// Combine historical guards with targeted Tokio preservation.\nrequire('../../../Scripts/check-tokio-qh011.cjs');\n";
assert.equal(read('docs/validation/rust-178/check-ported-graph.cjs'), wrapper);
const listed = new Set([...git(['ls-files', '-z']).toString().split('\0'),
  ...git(['ls-files', '--others', '--exclude-standard', '-z']).toString().split('\0')].filter(Boolean));
for (const name of listed) assert.ok(Object.hasOwn(reference.initial_files, name) || additions.has(name), `Out of scope ${name}`);
for (const name of additions) assert.ok(fs.existsSync(path.join(root, name)), `Missing deliverable ${name}`);
// FR// Autoriser exactement deux substitutions dans le bloc Tokio ; aucun autre paquet ni arête ne change.
// EN// Allow exactly two substitutions in Tokio's block; no other package or edge changes.
const before = read(`${history}/Cargo.lock`), after = read('Cargo.lock');
const initial = 'name = "tokio"\nversion = "1.54.0"\nsource = "registry+https://github.com/rust-lang/crates.io-index"\nchecksum = "a0c168a474b95bfecfe908a65d4bdffc523144b649a74c09c286afb35d53e0bc"';
const corrected = initial.replace('1.54.0', '1.54.1').replace('a0c168a474b95bfecfe908a65d4bdffc523144b649a74c09c286afb35d53e0bc', 'b52fd3255258d26fac7264ab5a76b53c13367136dc011d3d6ad4f8ed070396a3');
assert.equal(before.split(initial).length, 2, 'Expected one historical Tokio block');
assert.equal(after, before.replace(initial, corrected), 'Only Tokio version/checksum may change');
assert.equal((after.match(/^\[\[package\]\]$/gm) || []).length, 504);
assert.doesNotMatch(after, /name = "tokio"\nversion = "1\.54\.0"/);
assert.doesNotMatch(after, /name = "h2"\nversion = "0\.3\.27"/);
const pnpm = yaml.load(read('pnpm-lock.yaml'));
assert.equal(Object.keys(pnpm.packages).length, 409);
assert.equal(Object.values(pnpm.packages).filter(p => p.optional === true).length, 140);
assert.equal(pnpm.patchedDependencies['braces@3.0.3'].hash, 'ij22dduv7f6wi3glhwl7jmdbrm');
assert.equal(reachable(pnpm).size, 304);
// FR// Les sources antérieures restent intactes ; exécuter leurs assertions sur leur état exact.
// EN// Previous sources stay intact; execute their assertions on their exact historical state.
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'qh011-baseline-'));
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
  historical = spawnSync(process.execPath, ['docs/validation/rust-178/check-ported-graph.cjs'], {
    cwd: view, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, GIT_DIR: gitDirectory, GIT_WORK_TREE: view },
  });
  assert.equal(historical.status, 0, historical.stderr || historical.stdout);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
console.log(JSON.stringify({ status: 'PASS', base: reference.base_sha,
  originalFiles: 157, unchangedFiles: 155, archivedModifiedFiles: changed,
  cargoPackagesBefore: 504, cargoPackagesAfter: 504, modifiedDependencies: ['tokio 1.54.0 -> 1.54.1'],
  onlyTokioVersionAndChecksumChanged: true, manifestsUnchanged: true,
  pnpmSnapshotsIdentical: 409, optionalIdentical: 140, reachable: 304,
  patchHash: pnpm.patchedDependencies['braces@3.0.3'].hash,
  historicalGuards: JSON.parse(historical.stdout) }, null, 2));
