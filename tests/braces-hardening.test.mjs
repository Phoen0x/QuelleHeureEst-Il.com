// FR// Enfants bornés pour qu'une régression de boucle ne bloque pas le lanceur de tests.
// EN// Bounded children prevent a loop regression from hanging the test runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const tailwind = createRequire(require.resolve('tailwindcss/package.json'));
const worker = fileURLToPath(new URL('./security/braces-hardening-worker.cjs', import.meta.url));
function child(kind, parameter) {
  return spawnSync(process.execPath, ['--max-old-space-size=128', worker, kind, ...(parameter === undefined ? [] : [String(parameter)])],
    { encoding: 'utf8', timeout: 3000, killSignal: 'SIGKILL', maxBuffer: 256 * 1024 });
}
function value(kind, parameter) {
  const output = child(kind, parameter);
  assert.equal(output.error, undefined, output.error?.message);
  assert.equal(output.status, 0, output.stderr);
  return JSON.parse(output.stdout);
}
for (const kind of ['direct', 'indirect', 'prefix-cycle', 'first-loop']) {
  test(`braces parent cycle: ${kind}`, () => assert.deepEqual(value(kind), {
    error: 'SyntaxError', code: 'ERR_BRACES_PARENT_CYCLE', message: 'braces parent chain contains a cycle',
  }));
}
test('braces: valid parent chain of 10000 objects has no arbitrary depth ceiling', () => {
  assert.deepEqual(value('finite-chain'), { value: [] });
});
test('braces: root anchor terminates before irrelevant reverse links', () => {
  assert.deepEqual(value('root-cycle'), { value: [] });
});
test('braces: malformed non-object parents preserve empty AST behavior', () => {
  assert.deepEqual(value('malformed'), Array.from({ length: 5 }, () => ({ value: [] })));
});
test('braces: user getter errors remain observable', () => {
  assert.deepEqual(value('throwing-getter'), { error: 'Error', message: 'synthetic getter' });
});
for (const kind of ['child-cycle', 'deep-ast']) test(`braces depth guard retained: ${kind}`, () => {
  const actual = value(kind);
  assert.equal(actual.error, 'SyntaxError'); assert.equal(actual.code, 'ERR_BRACES_MAX_DEPTH');
});
test('braces: valid parsed parent backlinks and shared nodes do not trigger a cycle error', () => {
  const braces = createRequire(tailwind.resolve('micromatch'))('braces');
  assert.deepEqual(braces.expand(braces.parse('src/{a,b}/{1..3}.js')), [
    'src/a/1.js', 'src/a/2.js', 'src/a/3.js', 'src/b/1.js', 'src/b/2.js', 'src/b/3.js',
  ]);
  const text = { type: 'text', value: 'x' };
  assert.deepEqual(braces.expand({ type: 'root', nodes: [text, text] }), ['xx']);
});
for (const n of [10, 12, 14]) test(`braces: bounded measurement of shallow Cartesian expansion ${n}`, () => {
  assert.equal(value('cartesian', n).length, 2 ** n);
});
test('braces: rangeLimit and maxLength retain their documented scope', () => {
  const actual = value('ranges');
  assert.equal(actual[0].error, 'RangeError');
  assert.equal(actual[1].error, 'RangeError');
  assert.deepEqual(actual[2], { length: 1200 });
  assert.equal(actual[3].error, 'SyntaxError');
});
test('consumers: Micromatch and Chokidar resolve the same hardened braces instance', () => {
  assert.deepEqual(value('consumers'), { hardenedConsumers: 2 });
});
test('Chokidar: legitimate fixed brace glob discovers both files', () => {
  const output = child('watch-normal');
  assert.equal(output.status, 0, output.stderr);
  assert.match(output.stdout, /"channel":"ready","added":2/);
  assert.doesNotMatch(output.stdout, /error-event|sync-throw/);
});
test('Chokidar residual: hostile direct pattern returns then rejects without an error event', () => {
  const output = child('watch-direct');
  assert.equal(output.error, undefined, output.error?.message);
  assert.equal(output.status, 1, output.stderr);
  assert.match(output.stdout, /sync-return/);
  assert.doesNotMatch(output.stdout, /sync-throw|error-event/);
  assert.match(output.stderr, /ERR_BRACES_MAX_DEPTH/);
});
test('Chokidar residual: instrumentation identifies the unhandled Promise rejection channel', () => {
  const output = child('watch-observed');
  assert.equal(output.status, 0, output.stderr);
  assert.match(output.stdout, /"channel":"unhandledRejection","code":"ERR_BRACES_MAX_DEPTH"/);
  assert.doesNotMatch(output.stdout, /error-event|sync-throw/);
});
test('Chokidar residual: hostile directory under fixed glob emits a handled error event', () => {
  const output = child('watch-directory');
  assert.equal(output.status, 0, output.stderr);
  assert.match(output.stdout, /"channel":"error-event","code":"ERR_BRACES_MAX_DEPTH"/);
});
