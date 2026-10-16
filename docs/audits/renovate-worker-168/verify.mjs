import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';

const directory = process.env.AUDIT_OUTPUT ?? new URL('./evidence/final/', import.meta.url).pathname;
const data = JSON.parse(readFileSync(join(directory, 'results.json'), 'utf8'));
const events = JSON.parse(readFileSync(join(directory, 'mutations.json'), 'utf8'));
const rows = data.results;
assert.equal(rows.length, 80);
const row = (scenario, mode = 'native') => rows.find(result => result.scenario === scenario && result.mode === mode);
const writes = (scenario, mode = 'native') => events.filter(event => event.scenario === scenario && event.mode === mode);
for (const result of rows) {
  assert.equal(result.unknown.length, 0);
  assert.equal(result.deniedNetwork.length, 0);
  assert.equal(result.thrown, undefined);
  const snapshotPath = join(directory, `${result.scenario.replaceAll(':', '-')}-${result.mode}-snapshots.json`);
  const snapshot = JSON.parse(existsSync(snapshotPath) ? readFileSync(snapshotPath, 'utf8') : gunzipSync(readFileSync(`${snapshotPath}.gz`)));
  assert.equal(snapshot.before.prs.length, 10);
  assert.equal(snapshot.after.prs.length, 10);
  assert.equal(JSON.stringify(snapshot.before) === JSON.stringify(snapshot.after), result.snapshotEqual);
  if (result.mode === 'barrier') {
    assert.equal(result.protectedSnapshotEqual, true);
    assert.equal(result.writes, result.blocked);
    assert.equal(result.status, 'PASS');
  }
}
for (const name of ['cargo-only-three-recognized', 'prune-false', 'rebase-never', 'stop-label']) {
  assert.equal(row(name).writes, 0);
  assert.equal(row(name).recognizedCargo.length, 3);
}
assert.equal(writes('orphan-npm-native-prune').filter(event => event.method === 'PATCH' && event.payload.state === 'closed').length, 7);
assert.equal(writes('orphan-npm-native-prune').filter(event => event.target.startsWith('refs/heads/')).length, 7);
assert.equal(writes('disabled-repo-local-prune-false').length, 20);
for (const name of ['rebase-title', 'rebase-label', 'rebase-checkbox', 'rebase-dashboard', 'stop-label-checkbox', 'prefix-reuses-protected']) {
  assert.ok(row(name).protectedWriteAttempts >= 6, name);
  assert.equal(row(name).protectedSnapshotEqual, false);
}
assert.equal(writes('stop-label-rebase-label').filter(event => event.method === 'DELETE').length, 3);
assert.equal(writes('title-body-label-change').filter(event => event.method === 'PATCH' && event.payload.prTitle && event.payload.prBody && event.payload.labels?.includes('audit-fixture')).length, 3);
assert.equal(writes('base-change').filter(event => event.payload.targetBranch === 'release-base').length, 3);
assert.equal(writes('edited-branch').filter(event => event.method === 'POST').length, 3);
assert.equal(writes('creation-502-existing-branch').filter(event => event.target.startsWith('refs/heads/')).length, 3);
assert.equal(writes('pr-creation-error').filter(event => event.method === 'POST' && event.target === 'pulls').length, 3);
assert.ok(row('artifact-lock-error').reads.some(read => read.fault === 'lockfile-generation'));
assert.equal(row('repository-lock-lost').result.res, 'repository-changed');
const phases = ['renovateRepository', 'initRepo', 'extractDependencies', 'writeUpdates', 'processBranch', 'ensurePr', 'pruneStaleBranches', 'finalizeRepo'];
const coverage = Object.fromEntries(phases.map(name => [name, rows.reduce((total, result) => total + result.executed.flatMap(script => script.functions).filter(fn => fn.name === name).reduce((count, fn) => count + fn.calls, 0), 0)]));
for (const count of Object.values(coverage)) assert.ok(count > 0);
const calendar = rows.filter(result => result.scenario.startsWith('schedule-'));
assert.equal(calendar.length, 32);
for (const result of calendar) {
  const expected = /18:00|22:59/.test(result.scenario);
  assert.equal(result.scheduleCheck, expected);
  assert.equal(result.branchResults.length, 3);
  assert.ok(result.branchResults.every(branch => branch.result === (expected ? 'no-work' : 'update-not-scheduled')));
}
const summary = { verdict: 'BLOQUÉ — aucune activation', scenarios: 40, replays: rows.length, native: { PASS: rows.filter(r => r.mode === 'native' && r.status === 'PASS').length, FAIL: rows.filter(r => r.mode === 'native' && r.status === 'FAIL').length }, barrierContainment: { PASS: 40, FAIL: 0 }, calendarInstants: 16, coverage, limits: ['La barrière rejette toute écriture et peut interrompre le worker.', 'Le transport GitHub réel et Mend ne sont pas exécutés.', 'Les arbres Git et releases Cargo sont des fixtures synthétiques.', 'Aucun succès de cohabitation en production démontré.'] };
writeFileSync(join(directory, 'verification.json'), JSON.stringify(summary, null, 2));
const lines = ['| Scénario | Natif : gel protégé | Écritures protégées tentées | Barrière : confinement | Résultat worker avec barrière |', '|---|---|---:|---|---|'];
for (const result of rows.filter(row => row.mode === 'native')) {
  const barrier = row(result.scenario, 'barrier');
  lines.push(`| ${result.scenario} | ${result.status} | ${result.protectedWriteAttempts} | ${barrier.status} | ${barrier.result.res} |`);
}
writeFileSync(join(directory, 'MATRIX.md'), lines.join('\n') + '\n');
console.log(JSON.stringify(summary, null, 2));
