// FR// Muter une seule propriété par copie et vérifier le rejet réel par la garde applicative.
// EN// Mutate one property per copy and verify rejection by the actual application guard.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const history = 'docs/history/glib-qh011-20261023';
const cases = {
  'entry point disabled': ['docs/validation/rust-178/check-ported-graph.cjs', () => Buffer.from('console.log("PASS");\n')],
  'vulnerable lock rollback': ['Cargo.lock', () => fs.readFileSync(path.join(root, 'docs/history/sqlite-rustsec-20261111/Cargo.lock'))],
  'claimed fixed version without linkage': ['src-tauri/Cargo.toml', b => Buffer.from(b.toString().replace('version = "=0.41.1"', 'version = "0.29"'))],
  'unrelated dependency': ['Cargo.lock', b => Buffer.from(b.toString().replace('name = "h2"\nversion = "0.4.20"', 'name = "h2"\nversion = "0.4.19"'))],
  'bundled feature loss': ['src-tauri/Cargo.toml', b => Buffer.from(b.toString().replace('version = "=0.41.1", features = ["bundled", "chrono"]', 'version = "=0.41.1", features = ["chrono"]'))],
  'chrono feature loss': ['src-tauri/Cargo.toml', b => Buffer.from(b.toString().replace('version = "=0.41.1", features = ["bundled", "chrono"]', 'version = "=0.41.1", features = ["bundled"]'))],
  'archived variant deletion': ['docs/history/sqlite-rustsec-20261111/Cargo.lock', () => null],
  'historical digest alteration': ['docs/history/sqlite-rustsec-20261111/PORT.json', b => Buffer.from(b.toString().replace('d35eb03f', 'e35eb03f'))],
  'unexpected manifest change': ['Cargo.toml', b => Buffer.concat([b, Buffer.from('\n# unexpected\n')])],
  'historical guard disabled': ['Scripts/check-glib-qh011.py', () => Buffer.from('print("PASS")\n')],
  'SQLite regression deletion': ['src-tauri/tests/sqlite_security.rs', () => null],
  'active vulnerable source reintroduced': ['Cargo.lock', b => Buffer.concat([b, Buffer.from('\n[[package]]\nname = "libsqlite3-sys"\nversion = "0.26.0"\n')])],
  'reviewed transformation altered': ['docs/history/sqlite-rustsec-20261111/TRANSFORMATIONS.json', b => Buffer.concat([b, Buffer.from('\n')])],
};
for (const [name, [filename, mutate]] of Object.entries(cases)) test(`SQLite preservation rejects ${name}`, () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'qh-sqlite-negative-'));
  try {
    const options = { cwd: root, timeout: 30000 };
    const files = new Set([...execFileSync('git', ['ls-files', '-z'], options).toString().split('\0'),
      ...execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], options).toString().split('\0')].filter(Boolean));
    for (const file of files) {
      const target = path.join(fixture, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
      fs.chmodSync(target, fs.statSync(path.join(root, file)).mode & 0o777);
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
    const target = path.join(fixture, filename);
    const before = fs.existsSync(target) ? fs.readFileSync(target) : null;
    const after = mutate(before);
    assert.notDeepEqual(after, before, 'Mutation must actually change the fixture');
    if (after === null) fs.unlinkSync(target); else fs.writeFileSync(target, after);
    const direct = name === 'entry point disabled';
    const result = spawnSync(direct ? 'python3' : process.execPath, [direct ? 'Scripts/check-sqlite-rustsec.py' : 'docs/validation/rust-178/check-ported-graph.cjs'], {
      cwd: fixture, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, GIT_DIR: execFileSync('git', ['rev-parse', '--absolute-git-dir'], options).toString().trim(), GIT_WORK_TREE: fixture },
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /AssertionError/);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});
// FR// Refuser une résolution annoncée corrigée si le build substitue SQLite système.
// EN// Reject a reportedly fixed resolution when the build substitutes system SQLite.
for (const variable of ['LIBSQLITE3_SYS_USE_PKG_CONFIG', 'SQLITE3_LIB_DIR']) {
  test(`SQLite preservation rejects external library override ${variable}`, () => {
    const result = spawnSync('python3', ['Scripts/check-sqlite-rustsec.py'], {
      cwd: root, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, [variable]: variable === 'SQLITE3_LIB_DIR' ? '/synthetic-not-a-library' : '1' },
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /AssertionError: (System SQLite override|External SQLite library)/);
  });
}
