import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { IsolatedModel } from '../renovate-worker-168/model.mjs';

const fixtures = new URL('../renovate-worker-168/fixtures/', import.meta.url);
const numbers = [155, 156, 158, 159, 160, 161, 163, 164, 165, 166];
const prs = numbers.map(number => JSON.parse(readFileSync(new URL(`pr-${number}.json`, fixtures))));
let calls = 0;
let effects = 0;
// FR : réinjecter les écritures et observer directement les effets, sans lire les PASS historiques.
// EN: Reinject writes and inspect effects directly instead of reading historical PASS claims.
for (const pr of prs) {
  const targets = [`pulls/${pr.number}`, `issues/${pr.number}/comments`, `issues/${pr.number}/labels`, `pulls/${pr.number}/reviews`, `pulls/${pr.number}/merge`, `commits/${pr.head.sha}`, `statuses/${pr.head.sha}`, `refs/heads/${pr.head.ref}`, encodeURIComponent(`refs/heads/${pr.head.ref}`), `graphql:${pr.number}`];
  for (const target of targets) for (const method of ['POST', 'PATCH', 'PUT', 'DELETE', 'GIT_PUSH']) {
    const model = new IsolatedModel(prs, '/unused', {}, 'barrier');
    const before = structuredClone(model.snapshot());
    assert.throws(() => model.mutation(method, target, {}, () => { effects++; }), error => error.code === 'AUDIT_WRITE_DENIED');
    assert.deepEqual(model.snapshot(), before);
    assert.equal(model.events.length, 1);
    assert.equal(model.events[0].method, method);
    assert.equal(model.events[0].target, target);
    assert.equal(model.events[0].blocked, true);
    calls++;
  }
}
const control = new IsolatedModel(prs, '/unused', {}, 'native');
control.mutation('PATCH', 'issues/155', {}, () => { effects++; control.prs[0].title = 'positive-control'; });
assert.equal(effects, 1);
assert.equal(control.prs[0].title, 'positive-control');
const unknown = new IsolatedModel(prs, '/unused', {}, 'barrier');
for (const [boundary, method, args] of [['platform', 'futureWriteMethod', [155]], ['scm', 'futureGitMethod', ['refs/heads/main']], ['git', 'createSimpleGit', []]]) {
  assert.throws(() => unknown[boundary][method](...args), new RegExp(`UNMODELED ${boundary}\\.${method}`));
}
assert.equal(calls, 500);
assert.equal(unknown.unknown.length, 3);
const report = { rejected_writes: calls, blocked_effects: 0, positive_control_effects: effects, unknown_operations: unknown.unknown, status: 'PASS' };
writeFileSync(join(process.env.AUDIT_OUTPUT, 'guard-independent.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
