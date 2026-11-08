// FR// Régressions CVE-2026-93687 ; utiliser la vraie dépendance des consommateurs.
// EN// CVE-2026-93687 regressions; use the consumers' actual dependency.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');

const localPackage = process.env.BRACES_TEST_PACKAGE;
const tailwindRequire = localPackage ? null : createRequire(require.resolve('tailwindcss/package.json'));
const consumerRequire = tailwindRequire ? createRequire(tailwindRequire.resolve('micromatch')) : null;
const braces = require(localPackage || consumerRequire.resolve('braces'));

function guarded(error) {
  return error instanceof SyntaxError && error.code === 'ERR_BRACES_MAX_DEPTH';
}

test('braces : motifs usuels et plages conservés / ordinary patterns and ranges preserved', () => {
  assert.deepEqual(braces('src/{a,b}.js'), ['src/(a|b).js']);
  assert.deepEqual(braces.expand('src/{a,b}.js'), ['src/a.js', 'src/b.js']);
  assert.deepEqual(braces.expand('x{1..3}'), ['x1', 'x2', 'x3']);
  assert.deepEqual(braces.expand('{a,{b,c}}'), ['a', 'b', 'c']);
  assert.equal(braces.stringify(braces.parse('src/{a,b}.js')), 'src/{a,b}.js');
  assert.equal(braces.compile(String.raw`\{literal\}`), '{literal}');
  assert.equal(braces.compile('[{}]'), '[{}]');
  assert.equal(braces.compile('('.repeat(20) + 'a' + ')'.repeat(20)), '('.repeat(20) + 'a' + ')'.repeat(20));
});

for (const method of ['parse', 'compile', 'expand', 'stringify']) {
  test(`braces.${method} : profondeur hostile rejetée / reject hostile depth`, () => {
    const bracePattern = '{'.repeat(4000) + 'a' + '}'.repeat(4000);
    const parenPattern = '('.repeat(4000) + 'a' + ')'.repeat(4000);
    assert.throws(() => braces[method](bracePattern), guarded);
    assert.throws(() => braces[method](parenPattern), guarded);
  });
}

for (const method of ['compile', 'expand', 'stringify']) {
  test(`braces.${method} : AST fourni directement borné / bound directly supplied AST`, () => {
    let ast = { type: 'text', value: 'a' };
    for (let i = 0; i < 4000; i++) ast = { type: 'root', nodes: [ast] };
    assert.throws(() => braces[method](ast), guarded);
  });
}

test('braces : tableaux intermédiaires bornés / intermediate arrays bounded', () => {
  const utils = require((localPackage || consumerRequire.resolve('braces')).replace(/index\.js$/, 'lib/utils.js'));
  let nested = 'a';
  for (let i = 0; i < 4000; i++) nested = [nested];
  assert.throws(() => utils.flatten(nested), guarded);
});

test('micromatch et chokidar utilisent le correctif / consumers use the patch', { skip: Boolean(localPackage) }, () => {
  for (const name of ['micromatch', 'chokidar']) {
    const fromConsumer = createRequire(tailwindRequire.resolve(name));
    const installed = fromConsumer('braces');
    const identity = fromConsumer('braces/package.json');
    assert.equal(identity.name, 'braces');
    assert.equal(identity.version, '3.0.3');
    assert.throws(() => installed.compile('{'.repeat(4000) + 'a' + '}'.repeat(4000)), guarded);
  }
});
