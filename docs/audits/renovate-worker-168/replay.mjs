import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { createRequire, syncBuiltinESMExports } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { Session } from 'node:inspector';
import { IsolatedModel } from './model.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const tools = resolve(process.env.AUDIT_TOOLS ?? '/workspace/renovate-audit-tools');
const requireTool = createRequire(join(tools, 'package.json'));
const dist = join(tools, 'node_modules/renovate/dist');
const load = file => import(pathToFileURL(join(dist, file)).href);
const nock = requireTool('nock');
nock.disableNetConnect();
let model;
const deniedNetwork = [];
nock.emitter.on('no match', request => deniedNetwork.push({ method: request.method, path: request.path }));

// FR : aucun processus enfant ni connexion brute ne doit sortir du banc.
// EN: No child process or raw connection may escape the harness.
const childProcess = requireTool('node:child_process');
const net = requireTool('node:net');
const tls = requireTool('node:tls');
const forbidden = (...args) => {
  model?.unknown.push({ kind: 'escape', args: args.map(String) });
  throw new Error('AUDIT_EXTERNAL_OPERATION_DENIED');
};
for (const key of ['exec', 'execSync', 'execFile', 'execFileSync', 'spawn', 'spawnSync', 'fork']) childProcess[key] = forbidden;
net.connect = forbidden; net.createConnection = forbidden; tls.connect = forbidden;
net.Socket.prototype.connect = forbidden;
requireTool('node:http2').connect = forbidden;
globalThis.fetch = forbidden;
syncBuiltinESMExports();

const bridge = kind => new Proxy({}, { get: (_, name) => {
  if (kind === 'git' && name === 'GIT_MINIMUM_VERSION') return '2.33.0';
  if (kind === 'git' && name === 'RENOVATE_FORK_UPSTREAM') return 'renovate-fork-upstream';
  if (kind === 'exec' && ['removeDanglingContainers', 'resetPrefetchedImages'].includes(name)) return () => undefined;
  if (kind === 'exec') return (...args) => model.fail('exec', name, args);
  if (kind === 'platform' || kind === 'scm') return model[kind][name];
  return (...args) => model[kind][name](...args);
}});
globalThis.__renovateAudit = {
  platform: bridge('platform'), scm: bridge('scm'), git: bridge('git'), exec: bridge('exec'),
  noop: () => undefined, platformList: () => ['github'], emptyMap: new Map(), forbidden,
};
const { replaced } = await import('./hooks.mjs');
const { init: initLogger, clearProblems } = await load('logger/index.js');
await initLogger();
const { getConfig } = await load('config/defaults.js');
const { DateTime, Settings } = requireTool('luxon');
const { CrateDatasource } = await load('modules/datasource/crate/index.js');
const versions = { 'chrono-tz': ['0.8.0', '0.10.4'], reqwest: ['0.11.0', '0.13.2'], rusqlite: ['0.29.0', '0.40.1'] };
CrateDatasource.prototype.getReleases = async function(config) {
  model.reads.push({ op: 'crate.getReleases', packageName: config.packageName });
  assert.ok(versions[config.packageName], `Unmodeled crate ${config.packageName}`);
  return { releases: versions[config.packageName].map(version => ({ version, releaseTimestamp: '2026-01-01T00:00:00.000Z' })) };
};
const { getPrBodyStruct } = await load('modules/platform/pr-body.js');
const { renovateRepository } = await load('workers/repository/index.js');
const { GlobalConfig } = await load('config/global.js');
const { resetCache, getCache } = await load('util/cache/repository/index.js');
const { isScheduledNow } = await load('workers/repository/update/branch/schedule.js');
const { OnboardingState } = await load('workers/repository/onboarding/common.js');
const candidate = JSON.parse(readFileSync(join(here, 'reference-162/renovate.candidate.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(here, 'fixtures/github-before.json'), 'utf8'));
const historical = manifest.prs.map(file => JSON.parse(readFileSync(join(here, 'fixtures', file), 'utf8')));
const output = resolve(process.env.AUDIT_OUTPUT ?? join(here, 'evidence'));
mkdirSync(output, { recursive: true });
const root = mkdtempSync('/tmp/renovate-worker-168-');
const inspector = new Session();
inspector.connect();
const inspect = (command, params = {}) => new Promise((resolve, reject) => inspector.post(command, params, (error, result) => error ? reject(error) : resolve(result)));
await inspect('Profiler.enable');
await inspect('Profiler.startPreciseCoverage', { callCount: true, detailed: true });
const events = [];
const results = [];
const cargo = '[package]\nname = "audit-fixture"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]\nchrono-tz = "0.8"\nreqwest = "0.11"\nrusqlite = "0.29"\n';
const scenarios = [
  { name: 'cargo-only-three-recognized' },
  { name: 'orphan-npm-native-prune', config: { pruneStaleBranches: true } },
  { name: 'disabled-repo-local-prune-false', config: { enabled: false } },
  { name: 'invalid-config', raw: '{"enabledManagers":"invalid"}' },
  { name: 'rebase-title', rebase: 'title' },
  { name: 'rebase-label', rebase: 'label' },
  { name: 'rebase-checkbox', rebase: 'checkbox' },
  { name: 'rebase-dashboard', rebase: 'dashboard' },
  { name: 'title-body-label-change', rebase: 'checkbox', config: { rebaseWhen: 'auto', prTitle: 'Audit {{depName}}', labels: ['audit-fixture'] } },
  { name: 'base-change', config: { rebaseWhen: 'auto', baseBranchPatterns: ['release-base'] } },
  { name: 'user-retargeted-base', config: { rebaseWhen: 'auto' }, drift: true },
  { name: 'conflict', config: { rebaseWhen: 'auto' }, conflict: true },
  { name: 'edited-branch', config: { rebaseWhen: 'auto' }, modified: true },
  { name: 'missing-cargo-lock', rebase: 'checkbox' },
  { name: 'artifact-lock-error', rebase: 'checkbox', artifactError: true },
  { name: 'repository-lock-lost', rebase: 'checkbox', repoLockLost: true },
  { name: 'pr-creation-error', newBranch: true, createError: true, config: { rebaseWhen: 'auto' } },
  { name: 'creation-502-existing-branch', hidePr: true, createError502: true, config: { rebaseWhen: 'auto' } },
  { name: 'prefix-reuses-protected', prefixReuse: true, config: { rebaseWhen: 'auto', branchPrefix: 'audit-new/' } },
  { name: 'prune-false', config: { pruneStaleBranches: false } },
  { name: 'rebase-never', config: { rebaseWhen: 'never' } },
  { name: 'stop-label', stop: true },
  { name: 'stop-label-checkbox', stop: true, rebase: 'checkbox' },
  { name: 'stop-label-rebase-label', stop: true, rebase: 'label' },
];
for (const [day, offset] of [['2026-01-15', '+01:00'], ['2026-07-15', '+02:00'], ['2026-03-29', '+02:00'], ['2026-10-25', '+01:00']]) {
  for (const time of ['17:59', '18:00', '22:59', '23:00']) scenarios.push({ name: `schedule-${day}-${time}`, clock: `${day}T${time}:00${offset}` });
}

for (const scenario of scenarios) {
  for (const mode of ['native', 'barrier']) {
    const directory = join(root, `${scenario.name.replaceAll(':', '-')}-${mode}`);
    mkdirSync(join(directory, 'src-tauri'), { recursive: true });
    const config = { ...candidate, ...scenario.config };
    if (scenario.newBranch) { config.branchPrefix = 'audit-new/'; config.branchPrefixOld = 'audit-new/'; }
    if (scenario.rebase === 'dashboard') config.dependencyDashboard = true;
    const files = { 'renovate.json': scenario.raw ?? JSON.stringify(config), 'src-tauri/Cargo.toml': cargo, 'package.json': '{"name":"audit","dependencies":{"postcss":"8.0.0"}}' };
    model = new IsolatedModel(historical, directory, scenario, mode);
    model.protectedPrs = historical;
    model.dateTime = DateTime;
    if (scenario.name === 'base-change') model.refs['release-base'] = model.refs.main;
    model.bodyStruct = pr => getPrBodyStruct(pr.body);
    for (const pr of model.prs.filter(pr => pr.number >= 164)) {
      if (scenario.rebase === 'title') pr.title = `rebase! ${pr.title}`;
      if (scenario.rebase === 'label') pr.labels.push('rebase');
      if (scenario.rebase === 'checkbox') pr.body = pr.body.replace('[ ] <!-- rebase-check -->', '[x] <!-- rebase-check -->');
      if (scenario.stop) pr.labels.push('audit-stop');
      if (scenario.drift) pr.base.ref = 'former-base';
    }
    model.installFiles(files);
    globalThis.__renovateAudit.artifactFault = () => {
      if (!scenario.artifactError) return null;
      model.reads.push({ op: 'cargo-artifacts', fault: 'lockfile-generation' });
      return [{ artifactError: { lockFile: 'src-tauri/Cargo.lock', stderr: 'Injected Cargo artifact generation failure' } }];
    };
    const before = model.snapshot();
    const originalNow = Settings.now;
    const instant = new Date(scenario.clock ?? '2026-10-16T19:00:00+02:00').getTime();
    Settings.now = () => instant;
    const RealDate = globalThis.Date;
    globalThis.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [instant])); } static now() { return instant; } };
    resetCache();
    Object.assign(OnboardingState, { onboardingCacheValid: false, prUpdateRequested: false });
    clearProblems();
    const outer = {
      ...getConfig(), repository: 'audit/fixture', platform: 'github', endpoint: 'https://api.invalid/',
      localDir: directory, baseDir: root, cacheDir: join(root, 'cache'),
      onboarding: false, requireConfig: 'required', persistRepoData: true, repositoryCache: 'disabled',
      defaultBranch: 'main',
      semanticCommits: 'disabled', gitAuthor: 'Audit <audit@example.invalid>',
      dryRun: null, token: undefined,
      stopUpdatingLabel: 'audit-stop', rebaseLabel: 'rebase',
    };
    let result, thrown;
    let scheduleCheck;
    if (scenario.clock) {
      scheduleCheck = isScheduledNow(config);
      assert.equal(scheduleCheck, ['18:00', '22:59'].some(time => scenario.clock.includes(time)));
    }
    await inspect('Profiler.takePreciseCoverage');
    try { result = await renovateRepository(outer); } catch (error) { thrown = { message: error.message, stack: error.stack }; }
    const coverage = await inspect('Profiler.takePreciseCoverage');
    const executed = coverage.result.filter(script => script.url.includes('/renovate/dist/workers/repository/')).map(script => ({ file: script.url.split('/renovate/dist/')[1], functions: script.functions.filter(fn => fn.ranges[0].count > 0).map(fn => ({ name: fn.functionName, calls: fn.ranges[0].count })) }));
    Settings.now = originalNow; globalThis.Date = RealDate;
    const after = model.snapshot();
    const same = JSON.stringify(before) === JSON.stringify(after);
    const protectedSnapshot = snapshot => ({ prs: snapshot.prs.filter(pr => historical.some(original => original.number === pr.number)), refs: Object.fromEntries(historical.map(pr => [pr.head.ref, snapshot.refs[pr.head.ref] ?? null])) });
    const protectedEqual = JSON.stringify(protectedSnapshot(before)) === JSON.stringify(protectedSnapshot(after));
    const protectedWriteAttempts = model.events.filter(event => model.protectedWrite(event)).length;
    const row = {
      scenario: scenario.name, mode, clock: new RealDate(instant).toISOString(), result, thrown,
      snapshotEqual: same, writes: model.events.length, blocked: model.events.filter(e => e.blocked).length,
      protectedSnapshotEqual: protectedEqual, protectedWriteAttempts,
      executed,
      scheduleCheck, branchResults: getCache().branches?.map(({ branchName, result, prNo }) => ({ branchName, result, prNo })),
      unknown: model.unknown, deniedNetwork: [...deniedNetwork],
      recognizedCargo: [...new Set(model.reads.filter(r => r.op === 'getBranchPr' && /chrono-tz|reqwest|rusqlite/.test(r.branch)).map(r => r.branch))],
      reads: model.reads, changed: !same,
      status: model.unknown.length || deniedNetwork.length || thrown ? 'FAIL' : mode === 'barrier' ? same ? 'PASS' : 'FAIL' : protectedEqual && protectedWriteAttempts === 0 ? 'PASS' : 'FAIL',
    };
    results.push(row);
    for (const event of model.events) events.push({ scenario: scenario.name, mode, ...event });
    writeFileSync(join(output, `${scenario.name.replaceAll(':', '-')}-${mode}-snapshots.json.gz`), gzipSync(JSON.stringify({ before, after })));
    console.log('AUDIT_RESULT', JSON.stringify({ ...row, reads: undefined, executed: undefined, unknown: row.unknown, deniedNetwork: undefined }));
    writeFileSync(join(output, 'results.json'), JSON.stringify({ version: '44.164.1', replaced, root, results }, null, 2));
    writeFileSync(join(output, 'mutations.json'), JSON.stringify(events, null, 2));
  }
}
GlobalConfig.reset();
await inspect('Profiler.stopPreciseCoverage');
inspector.disconnect();

const escapeTests = [];
model = new IsolatedModel(historical, '/unused', {}, 'barrier');
for (const [name, fn] of [
  ['child-process-push', () => childProcess.spawn('git', ['push', 'https://example.invalid/repo'])],
  ['child-process-exec', () => childProcess.exec('git push')],
  ['raw-tcp', () => net.connect(443, 'example.invalid')],
  ['tls', () => tls.connect(443, 'example.invalid')],
  ['fetch-post', () => globalThis.fetch('https://api.invalid/graphql', { method: 'POST' })],
]) {
  assert.throws(fn, /AUDIT_EXTERNAL_OPERATION_DENIED/);
  escapeTests.push({ name, status: 'PASS' });
}
writeFileSync(join(output, 'escape-tests.json'), JSON.stringify(escapeTests, null, 2));
assert.ok(results.every(row => row.unknown.length === 0 && row.deniedNetwork.length === 0 && !row.thrown), 'Unmodeled operations invalidate the replay');
assert.ok(results.filter(row => row.mode === 'barrier').every(row => row.snapshotEqual), 'Barrier snapshot changed');
