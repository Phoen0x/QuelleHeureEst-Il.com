// FR// Régressions Linux sur Vite réellement installé ; données synthétiques et écoute locale seulement.
// EN// Linux regressions against installed Vite; synthetic data and loopback listeners only.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite';

test('GHSA-9jrq: HTML proxy never references an attacker origin from a query', { timeout: 15000 }, async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'vite-html-qh010-'));
  let vite;
  try {
    await writeFile(path.join(root, 'package.json'), '{}');
    vite = await createServer({ root, configFile: false, server: { middlewareMode: true, host: '127.0.0.1' },
      appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
    const result = await vite.transformIndexHtml('//attacker.invalid/payload.js?/../../package.json',
      '<script type="module">document.body.textContent = "synthetic"</script>');
    assert.match(result, /\/@vite\/client/);
    assert.doesNotMatch(result, /src=["']\/\/attacker\.invalid/);
  } finally {
    await vite?.close();
    await rm(root, { recursive: true, force: true });
  }
});

test('GHSA-rq7h: importing an in-root decoy does not authorize its absolute host path', { timeout: 15000 }, async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'vite-fs-qh010-'));
  const root = path.join(fixture, 'project');
  const outside = path.join(fixture, 'synthetic-secret.js');
  const relative = outside.slice(1);
  let vite, http;
  try {
    const decoy = path.join(root, relative);
    await mkdir(path.dirname(decoy), { recursive: true });
    await writeFile(outside, 'export default "OUTSIDE_SYNTHETIC_MARKER"');
    await writeFile(decoy, 'export default "PROJECT_DECOY"');
    await writeFile(path.join(root, 'main.js'), `import value from './${relative}'; console.log(value);`);
    vite = await createServer({ root, configFile: false, server: { middlewareMode: true, host: '127.0.0.1',
      fs: { strict: true, allow: [root] } }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
    const transformed = await vite.transformRequest('/main.js');
    assert.ok(transformed?.code.includes(relative), 'The in-root import must actually be transformed');
    http = createHttpServer(vite.middlewares);
    await new Promise((resolve, reject) => { http.once('error', reject); http.listen(0, '127.0.0.1', resolve); });
    const response = await fetch(`http://127.0.0.1:${http.address().port}/@fs${outside}`, { signal: AbortSignal.timeout(5000) });
    const body = await response.text();
    assert.ok(!body.includes('OUTSIDE_SYNTHETIC_MARKER'), 'Synthetic host file must remain inaccessible');
    assert.equal(response.status, 403);
  } finally {
    if (http?.listening) await new Promise((resolve, reject) => http.close(error => error ? reject(error) : resolve()));
    await vite?.close();
    await rm(fixture, { recursive: true, force: true });
  }
});
