import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

// FR : seules les frontières externes sont remplacées ; les workers restent intacts.
// EN: Only external boundaries are replaced; worker code stays untouched.
const replacements = new Map([
  ['modules/platform/index.js', { platform: 'platform', setPlatformApi: 'noop', getPlatformList: 'platformList', initPlatform: 'forbidden' }],
  ['modules/platform/scm.js', { scm: 'scm', setPlatformScmApi: 'noop', platformScmImpls: 'emptyMap' }],
]);
const boundaries = ['util/git/index.js', 'util/exec/index.js', 'util/exec/docker/index.js'];
export const replaced = [];

registerHooks({
  load(url, context, nextLoad) {
    const marker = '/node_modules/renovate/dist/';
    if (!url.includes(marker)) return nextLoad(url, context);
    const relative = url.split(marker)[1];
    if (relative === 'modules/manager/cargo/artifacts.js') {
      const result = nextLoad(url, context);
      const original = result.source.toString();
      const signature = 'async function updateArtifacts(updateArtifact) {';
      if (!original.includes(signature)) throw new Error('Cargo artifact injection signature changed');
      return { ...result, source: original.replace(signature, `${signature}\nconst fault = globalThis.__renovateAudit.artifactFault?.(); if (fault) return fault;`) };
    }
    let exports = replacements.get(relative);
    if (boundaries.includes(relative)) {
      const source = readFileSync(fileURLToPath(url), 'utf8');
      const names = [...source.matchAll(/export \{([^}]+)\}/g)].flatMap(match => match[1].split(',').map(x => x.trim().split(/\s+as\s+/).at(-1)));
      exports = Object.fromEntries(names.map(name => [name, `${relative.startsWith('util/git') ? 'git' : 'exec'}.${name}`]));
    }
    if (!exports) return nextLoad(url, context);
    replaced.push(relative);
    const source = Object.entries(exports).map(([name, value]) => `export const ${name} = globalThis.__renovateAudit.${value};`).join('\n');
    return { format: 'module', source, shortCircuit: true };
  },
});
