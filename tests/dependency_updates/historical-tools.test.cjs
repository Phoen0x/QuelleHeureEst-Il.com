// FR// Vérifier les outils conservés et leur exclusion des modules livrés.
// EN// Verify retained tools and their exclusion from shipped modules.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const babel = require('@babel/core');

test('historical Babel parses, transforms, maps and prints JSX without changing application configuration', () => {
  const result = babel.transformSync('const Example = () => <div />;', {
    filename: '/historical-fixture.jsx',
    configFile: false,
    babelrc: false,
    parserOpts: { plugins: ['jsx'] },
    plugins: ['@babel/plugin-transform-react-jsx-self', '@babel/plugin-transform-react-jsx-source'],
    sourceMaps: true,
  });
  assert.match(result.code, /__self/);
  assert.match(result.code, /__source/);
  assert.equal(result.map.sources.length, 1);
  assert.equal(babel.version, '7.29.7');
});

test('historical React Refresh remains available to development tooling', () => {
  const refresh = require('react-refresh/runtime');
  assert.equal(typeof refresh.register, 'function');
  assert.equal(typeof refresh.performReactRefresh, 'function');
});

test('production module graph excludes historical Babel, React Refresh and archives', async () => {
  const { build } = await import('vite');
  let moduleCount = 0;
  const result = await build({
    configFile: 'vite.config.ts',
    build: { write: false },
    plugins: [{
      name: 'verify-historical-module-exclusion',
      generateBundle(_options, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type !== 'chunk') continue;
          for (const id of Object.keys(chunk.modules)) {
            moduleCount++;
            assert.doesNotMatch(id, /(?:node_modules\/(?:\.pnpm\/)?(?:@babel[+/]|@types[+/]babel|react-refresh)|docs\/history\/|docs\/security\/proposals\/)/);
          }
        }
      },
    }],
  });
  assert.ok(moduleCount > 0, 'a real application module graph must have been checked');
  assert.ok(result.output.some(output => output.type === 'chunk'));
  assert.ok(fs.readFileSync('vite.config.ts', 'utf8').includes('plugins: [react()]'));
  console.log('Production modules checked:', moduleCount);
});
