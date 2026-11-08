import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server;
let PollenCard;

before(async () => {
  server = await createServer({
    server: { middlewareMode: true }, appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  ({ PollenCard } = await server.ssrLoadModule('/src/components/PollenCard.tsx'));
});

after(async () => {
  await server?.close();
});

function renderPollen(grass) {
  const hourly = Object.fromEntries([
    'alder_pollen', 'birch_pollen', 'grass_pollen',
    'mugwort_pollen', 'olive_pollen', 'ragweed_pollen',
  ].map(key => [key, Array(24).fill(key === 'grass_pollen' ? grass : 0)]));
  return renderToStaticMarkup(createElement(PollenCard, { airQuality: { hourly } }));
}

test('zero pollen concentrations display the all-clear badge', () => {
  const html = renderPollen(0);
  assert.match(html, /All Clear/);
  assert.match(html, /Aucun/);
  assert.doesNotMatch(html, /grains\/m³/);
});

test('nonzero pollen concentrations remove the all-clear badge', () => {
  const html = renderPollen(5);
  assert.doesNotMatch(html, /All Clear/);
  assert.match(html, /Faible/);
  assert.match(html, /5 grains\/m³/);
});
