// FR// Fixtures synthétiques isolées ; aucun chemin ni motif n'est issu de données personnelles.
// EN// Isolated synthetic fixtures; no paths or patterns come from personal data.
const { createRequire } = require('node:module');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const tailwind = createRequire(require.resolve('tailwindcss/package.json'));
const consumer = createRequire(tailwind.resolve('micromatch'));
const braces = consumer('braces');
const [kind, parameter] = process.argv.slice(2);
const result = value => console.log(JSON.stringify(value));
const root = () => ({ type: 'root', nodes: [], queue: [] });
function finish(callback) {
  try { result({ value: callback() }); }
  catch (error) { result({ error: error.name, code: error.code, message: error.message }); }
}
if (kind === 'consumers') {
  const assert = require('node:assert/strict');
  const a = createRequire(tailwind.resolve('micromatch'));
  const b = createRequire(tailwind.resolve('chokidar'));
  assert.equal(a.resolve('braces'), b.resolve('braces'));
  for (const from of [a, b]) {
    const ast = { type: 'paren', nodes: [] }; ast.parent = ast;
    assert.throws(() => from('braces').expand(ast), { code: 'ERR_BRACES_PARENT_CYCLE' });
  }
  result({ hardenedConsumers: 2 });
} else if (kind === 'direct' || kind === 'indirect' || kind === 'prefix-cycle') {
  const a = { type: 'paren', nodes: [] }, b = { type: 'paren', nodes: [] };
  a.parent = kind === 'direct' ? a : b; b.parent = a;
  let ast = a;
  if (kind === 'prefix-cycle') for (let i = 0; i < 10000; i++) ast = { type: 'paren', nodes: [], parent: ast };
  finish(() => braces.expand(ast));
} else if (kind === 'first-loop') {
  const ast = { type: 'paren', parent: root(), nodes: [] }, child = { type: 'paren' };
  Object.defineProperty(child, 'nodes', { get() { ast.parent = ast; return []; } });
  ast.nodes.push(child);
  finish(() => braces.expand(ast));
} else if (kind === 'finite-chain') {
  let anchor = root();
  for (let i = 0; i < 10000; i++) anchor = { type: 'paren', parent: anchor, queue: [] };
  finish(() => braces.expand({ type: 'paren', nodes: [], parent: anchor }));
} else if (kind === 'root-cycle') {
  const ast = root(); ast.parent = ast;
  finish(() => braces.expand(ast));
} else if (kind === 'malformed') {
  const parents = [null, undefined, 12, 'x', {}];
  result(parents.map(parent => {
    try { return { value: braces.expand({ type: 'paren', nodes: [], parent }) }; }
    catch (error) { return { error: error.name, code: error.code }; }
  }));
} else if (kind === 'throwing-getter') {
  const ast = { type: 'paren', nodes: [] };
  Object.defineProperty(ast, 'parent', { get() { throw new Error('synthetic getter'); } });
  finish(() => braces.expand(ast));
} else if (kind === 'child-cycle') {
  const ast = root(); ast.nodes.push(ast);
  finish(() => braces.expand(ast));
} else if (kind === 'deep-ast') {
  let ast = { type: 'text', value: 'a' };
  for (let i = 0; i < 4000; i++) ast = { type: 'root', nodes: [ast] };
  finish(() => braces.expand(ast));
} else if (kind === 'cartesian') {
  const started = performance.now();
  const output = braces.expand('{a,b}'.repeat(Number(parameter)));
  result({ length: output.length, elapsedMs: performance.now() - started });
} else if (kind === 'ranges') {
  result([{ pattern: '{1..1001}' }, { pattern: '{1..12}', options: { rangeLimit: 10 } },
    { pattern: '{1..1200}', options: { rangeLimit: false } },
    { pattern: 'a'.repeat(101), options: { maxLength: 100 } }].map(({ pattern, options }) => {
    try { return { length: braces.expand(pattern, options).length }; }
    catch (error) { return { error: error.name, message: error.message }; }
  }));
} else if (kind.startsWith('watch-')) {
  const chokidar = tailwind('chokidar');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'qh009-watcher-'));
  const clean = () => fs.rmSync(directory, { recursive: true, force: true });
  process.on('exit', clean);
  let pattern;
  if (kind === 'watch-direct' || kind === 'watch-observed') pattern = '{'.repeat(4000) + 'a,b' + '}'.repeat(4000);
  else {
    const name = kind === 'watch-directory' ? '{'.repeat(65) + 'x' + '}'.repeat(65) : 'valid';
    fs.mkdirSync(path.join(directory, name));
    fs.writeFileSync(path.join(directory, name, 'a.js'), '');
    fs.writeFileSync(path.join(directory, name, 'b.js'), '');
    pattern = path.join(directory, '**/*.{js,ts}');
  }
  let watcher;
  if (kind === 'watch-observed') process.once('unhandledRejection', async error => {
    result({ channel: 'unhandledRejection', code: error.code });
    await watcher.close();
  });
  try {
    watcher = chokidar.watch(pattern);
    result({ channel: 'sync-return' });
  } catch (error) { result({ channel: 'sync-throw', code: error.code }); }
  let added = 0;
  watcher?.on('add', () => added++);
  watcher?.on('error', async error => {
    result({ channel: 'error-event', code: error.code });
    await watcher.close();
  });
  watcher?.on('ready', async () => {
    result({ channel: 'ready', added });
    await watcher.close();
  });
} else { throw new Error('Unknown synthetic fixture'); }
