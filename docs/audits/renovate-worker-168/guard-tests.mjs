import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { IsolatedModel } from './model.mjs';

const base = new URL('./fixtures/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('github-before.json', base), 'utf8'));
const prs = index.prs.map(file => JSON.parse(readFileSync(new URL(file, base), 'utf8')));
const results = [];
for (const pr of prs) {
  for (const target of [`pulls/${pr.number}`, `issues/${pr.number}/comments`, `issues/${pr.number}/labels`, `pulls/${pr.number}/reviews`, `pulls/${pr.number}/merge`, `commits/${pr.head.sha}`, `statuses/${pr.head.sha}`, `refs/heads/${pr.head.ref}`, encodeURIComponent(`refs/heads/${pr.head.ref}`), `graphql:${pr.number}`]) {
    for (const method of ['POST', 'PATCH', 'PUT', 'DELETE', 'GIT_PUSH']) {
      const model = new IsolatedModel(prs, '/unused', {}, 'barrier');
      const before = model.snapshot();
      let called = false;
      assert.throws(() => model.mutation(method, target, { injected: true }, () => { called = true; model.prs[0].state = 'closed'; }), { code: 'AUDIT_WRITE_DENIED' });
      assert.equal(called, false);
      assert.deepEqual(model.snapshot(), before);
      assert.equal(model.events.length, 1);
      assert.equal(model.events[0].blocked, true);
      results.push({ pr: pr.number, method, target, status: 'PASS' });
    }
  }
}
// FR : contrôle positif, le faux effet doit réellement être exécuté sans barrière.
// EN: Positive control: the fake effect must really execute without the barrier.
const control = new IsolatedModel(prs, '/unused', {}, 'native');
control.mutation('PATCH', 'issues/155', {}, () => { control.prs[0].state = 'closed'; });
assert.equal(control.prs[0].state, 'closed');
const unknown = new IsolatedModel(prs, '/unused', {}, 'barrier');
assert.throws(() => unknown.platform.futureWriteMethod(155), /UNMODELED/);
assert.throws(() => unknown.scm.futureGitMethod('refs/heads/main'), /UNMODELED/);
assert.throws(() => unknown.git.createSimpleGit(), /UNMODELED/);
assert.equal(unknown.unknown.length, 3);
writeFileSync(process.env.GUARD_RESULTS ?? new URL('./evidence/guard-results.json', import.meta.url), JSON.stringify({ injectedRejections: results.length, positiveControl: 'PASS', unknownOperations: 'PASS', results }, null, 2));
console.log(`${results.length} rejets injectés, contrôle positif et 3 opérations inconnues : PASS`);
