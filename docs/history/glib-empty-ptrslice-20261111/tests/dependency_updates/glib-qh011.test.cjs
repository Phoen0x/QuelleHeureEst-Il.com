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
  'immutable out-pointer regression': ['vendor/glib-0.18.5/src/variant_iter.rs', b => Buffer.from(b.toString().replace('                &mut p,', '                &p,'))],
  'pointer declaration regression': ['vendor/glib-0.18.5/src/variant_iter.rs', b => Buffer.from(b.toString().replace('let mut p: *mut libc::c_char', 'let p: *mut libc::c_char'))],
  'unrelated PtrSlice backport': ['vendor/glib-0.18.5/src/collections/ptr_slice.rs', b => Buffer.concat([b, Buffer.from('\n// unrelated change\n')])],
  'vendor feature alteration': ['vendor/glib-0.18.5/Cargo.toml', b => Buffer.concat([b, Buffer.from('\n# changed manifest\n')])],
  'official source deletion': ['vendor/glib-0.18.5/src/variant.rs', () => null],
  'official archive alteration': [`${history}/glib-0.18.5.crate`, b => { const v = Buffer.from(b); v[40] ^= 1; return v; }],
  'registry identity alteration': ['Cargo.lock', b => Buffer.from(b.toString().replace('name = "glib"\nversion = "0.18.5"', 'name = "glib"\nversion = "0.20.0"'))],
  'source override omission': ['.cargo/config.toml', b => Buffer.from(b.toString().replace('paths = ["vendor/glib-0.18.5"]', 'paths = []'))],
  'historical Tokio guard alteration': ['Scripts/check-tokio-qh011.cjs', b => Buffer.concat([b, Buffer.from('\n')])],
  'optional Rust dependency removal': ['src-tauri/Cargo.toml', b => Buffer.from(b.toString().replace('[dependencies.rustls-pemfile]\nversion = "=1.0.4"\noptional = true\n', ''))],
  'baseline graph alteration': [`${history}/metadata-before-graph.json`, b => Buffer.concat([b, Buffer.from('\n')])],
  'unexpected added file': ['unexpected-qh011-file.txt', () => Buffer.from('unexpected\n')],
};
for (const [name, [filename, mutate]] of Object.entries(cases)) test(`GLib preservation rejects ${name}`, () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'qh011-glib-negative-'));
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
    const result = spawnSync(process.execPath, ['docs/validation/rust-178/check-ported-graph.cjs'], {
      cwd: fixture, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, GIT_DIR: execFileSync('git', ['rev-parse', '--absolute-git-dir'], options).toString().trim(), GIT_WORK_TREE: fixture },
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, /AssertionError/);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});
