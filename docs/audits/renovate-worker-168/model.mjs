import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { rejectWrite } from './write-barrier.mjs';

const sha = value => createHash('sha1').update(value).digest('hex');
export class IsolatedModel {
  constructor(prs, directory, scenario, mode) {
    this.directory = directory;
    this.scenario = scenario;
    this.mode = mode;
    this.prs = structuredClone(prs);
    this.refs = Object.fromEntries(prs.map(pr => [pr.head.ref, pr.head.sha]));
    this.refs.main = '235194a6fe825a6dac27012f07cbac2cc5d86794';
    this.events = [];
    this.unknown = [];
    this.reads = [];
    this.branch = 'main';
    this.platform = this.makePlatform();
    this.scm = this.makeScm();
    this.git = this.makeGit();
  }
  snapshot() { return structuredClone({ prs: this.prs, refs: this.refs }); }
  protectedWrite(event) {
    const targets = [event.target, event.payload?.number, event.payload?.branchName, event.payload?.sourceBranch, ...(Array.isArray(event.payload) ? event.payload : [])].filter(value => typeof value === 'string' || typeof value === 'number').map(String);
    return this.protectedPrs.some(pr => targets.some(target => target === String(pr.number) || target.includes(pr.head.ref) || target.includes(encodeURIComponent(pr.head.ref)) || target.includes(pr.head.sha) || new RegExp(`(?:issues|pulls)/${pr.number}(?:/|$)`).test(target)));
  }
  fail(kind, name, args) {
    this.unknown.push({ kind, name: String(name), args });
    throw new Error(`UNMODELED ${kind}.${String(name)}`);
  }
  mutation(method, target, payload, effect = () => undefined) {
    const event = { method, target, payload, blocked: this.mode === 'barrier', stack: new Error().stack };
    this.events.push(event);
    // FR : proposition conservatrice hors production : toute écriture est refusée.
    // EN: Conservative non-production proposal: reject every write.
    if (event.blocked) rejectWrite(method, target);
    return effect();
  }
  api(pr) {
    if (!pr) return null;
    return { number: pr.number, title: pr.title, body: pr.body, labels: [...pr.labels], state: pr.state,
      sourceBranch: pr.head.ref, targetBranch: pr.base.ref, sha: pr.head.sha,
      createdAt: '2026-10-14T00:00:00Z', updatedAt: '2026-10-15T00:00:00Z',
      isConflicted: !!this.scenario.conflict, canRebase: !this.scenario.modified,
      bodyStruct: this.bodyStruct?.(pr) };
  }
  byBranch(branch) { return this.prs.find(pr => pr.head.ref === branch); }
  byNumber(number) { return this.prs.find(pr => pr.number === number); }
  proxy(kind, methods) {
    return new Proxy(methods, { get: (object, property) => {
      if (property === 'then' || typeof property === 'symbol') return undefined;
      if (Object.hasOwn(object, property)) return object[property];
      return (...args) => this.fail(kind, property, args);
    }});
  }
  makePlatform() {
    const change = (method, number, body, effect) => this.mutation(method, `issues/${number}`, body, effect);
    const reads = {
      initRepo: async () => ({ defaultBranch: 'main', isFork: false, repoFingerprint: 'audit-168', isPrivate: false }),
      getPrList: async () => this.prs.map(pr => this.api(pr)),
      getBranchPr: async branch => { this.reads.push({ op: 'getBranchPr', branch }); return this.scenario.hidePr ? null : this.api(this.byBranch(branch)); },
      getPr: async number => this.api(this.byNumber(number)),
      getIssue: async number => number === 800 ? reads.findIssue() : null,
      findPr: async options => options.state === '!open' ? null : this.api(this.byBranch(options.branchName)),
      getRawFile: async file => this.file(file), getJsonFile: async file => JSON.parse(this.file(file)),
      getIssueList: async () => [], findIssue: async () => this.scenario.rebase === 'dashboard' ? { number: 800, title: 'Dependency Dashboard', body: Object.keys(this.refs).filter(ref => ref.startsWith('renovate/')).map(ref => ` - [x] <!-- rebase-branch=${ref} --> Rebase`).join('\n') } : null,
      getComments: async number => structuredClone(this.byNumber(number)?.comments ?? []),
      ensureCommentRemoval: async config => {
        const pr = this.byNumber(config.number);
        const matches = (pr?.comments ?? []).filter(comment => config.topic ? comment.body.includes(config.topic) : comment.body === config.content);
        this.reads.push({ op: 'ensureCommentRemoval', number: config.number, matches: matches.length });
        for (const match of matches) change('DELETE', config.number, match, () => { pr.comments = pr.comments.filter(comment => comment !== match); });
      },
      getPrReviews: async () => [], getVulnerabilityAlerts: async () => [],
      getRepoForceRebase: async () => false, getBranchForceRebase: async () => false,
      isBranchMergeQueueEnabled: async () => false, getBranchStatusCheck: async () => null,
      getBranchStatus: async () => 'green', getCommitMessages: async () => [],
      getRepoLabels: async () => [], getPrFiles: async () => ['src-tauri/Cargo.toml'],
      refreshPr: async () => undefined, massageMarkdown: text => text,
      getPrBody: body => body, maxBodyLength: () => 60000, labelCharLimit: () => 50,
      filterUnavailableUsers: undefined, expandGroupMembers: undefined,
      ensureIssueClosing: async title => { this.reads.push({ op: 'ensureIssueClosing', title, found: false }); },
      updatePr: async config => change('PATCH', config.number, config, () => {
        const pr = this.byNumber(config.number);
        if (pr) { if (config.prTitle !== undefined) pr.title = config.prTitle; if (config.prBody !== undefined) pr.body = config.prBody; if (config.state) pr.state = config.state; if (config.targetBranch) pr.base.ref = config.targetBranch; if (config.labels) pr.labels = [...config.labels]; }
      }),
      createPr: async config => this.mutation('POST', 'pulls', config, () => {
        if (this.scenario.createError502) { const error = new Error('Injected GitHub 502'); error.statusCode = 502; throw error; }
        if (this.scenario.createError) throw new Error('PR creation fixture error');
        return { number: 900, ...config, state: 'open' };
      }),
      deleteLabel: async (number, label) => change('DELETE', number, { label }, () => { const p = this.byNumber(number); if (p) p.labels = p.labels.filter(x => x !== label); }),
      addLabels: async (number, labels) => change('POST', number, { labels }, () => { const p = this.byNumber(number); if (p) p.labels.push(...labels); }),
      setLabels: async (number, labels) => change('PUT', number, { labels }, () => { const p = this.byNumber(number); if (p) p.labels = [...labels]; }),
      ensureComment: async config => change('POST', config.number, config, () => { this.byNumber(config.number)?.comments.push({ body: config.content }); }),
      deleteComment: async (...args) => this.mutation('DELETE', 'comments', args),
      editComment: async (...args) => this.mutation('PATCH', 'comments', args),
      createComment: async (number, body) => change('POST', number, { body }, () => { this.byNumber(number)?.comments.push({ body }); }),
      mergePr: async (...args) => this.mutation('PUT', 'merge', args),
      ensureIssue: async (...args) => this.mutation('POST', 'issues', args),
      addAssignees: async (...args) => this.mutation('POST', 'assignees', args),
      addReviewers: async (...args) => this.mutation('POST', 'reviews', args),
      ensureBranchStatus: async (...args) => this.mutation('POST', 'statuses', args),
      setBranchStatus: async (...args) => this.mutation('POST', 'statuses', args),
      autoMerge: async (...args) => this.mutation('POST', 'automerge', args),
      reattemptPlatformAutomerge: async (...args) => this.mutation('POST', 'automerge', args),
    };
    return this.proxy('platform', reads);
  }
  file(file, branch = this.branch) {
    if (branch !== 'main' && this.branchFiles?.[file] !== undefined) return this.branchFiles[file];
    try { return readFileSync(join(this.directory, file), 'utf8'); } catch { return null; }
  }
  makeScm() {
    return this.proxy('scm', {
      branchExists: async branch => Object.hasOwn(this.refs, branch),
      getBranchCommit: async branch => this.refs[branch] ?? null,
      getBranchUpdateDate: async () => this.dateTime.fromISO('2026-10-14T00:00:00Z'),
      getAllBranchUpdateDates: async () => Object.fromEntries(Object.keys(this.refs).map(ref => [ref, this.dateTime.fromISO('2026-10-14T00:00:00Z')])),
      getFileList: async () => Object.keys(this.files),
      checkoutBranch: async branch => { this.branch = branch; },
      isBranchModified: async () => !!this.scenario.modified,
      isBranchConflicted: async () => !!this.scenario.conflict,
      isBranchBehindBase: async () => !!this.scenario.behind,
      syncForkWithUpstream: undefined,
      commitAndPush: async config => this.mutation('GIT_PUSH', config.branchName, config, () => {
        if (this.scenario.repoLockLost) { this.reads.push({ op: 'commitAndPush', fault: 'repository-changed' }); throw new Error('repository-changed'); }
        const commit = sha(JSON.stringify(config)); this.refs[config.branchName] = commit;
        const pr = this.byBranch(config.branchName); if (pr) pr.head.sha = commit;
        return commit;
      }),
      deleteBranch: async branch => this.mutation('DELETE', `refs/heads/${branch}`, {}, () => { delete this.refs[branch]; }),
      mergeBranch: async (...args) => this.mutation('GIT_PUSH', 'mergeBranch', args),
      mergeToLocal: async (...args) => this.fail('scm', 'mergeToLocal', args),
    });
  }
  makeGit() {
    const methods = {
      isCloned: () => true, getBranchCommit: branch => this.refs[branch] ?? null,
      getBranchList: () => Object.keys(this.refs), branchExists: branch => Object.hasOwn(this.refs, branch),
      getFileList: async () => Object.keys(this.files),
      getFile: async (file, branch) => this.file(file, branch),
      getBranchFiles: async () => Object.keys(this.files),
      getFiles: async files => Object.fromEntries(files.map(file => [file, this.file(file)])),
      getCommitMessages: async () => [], getBranchLastCommitTime: () => new Date('2026-10-14T00:00:00Z'),
      getBranchUpdateDate: async () => this.dateTime.fromISO('2026-10-14T00:00:00Z'),
      getAllBranchUpdateDates: async () => new Map(),
      setUserRepoConfig: () => undefined, setGitAuthor: () => undefined,
      setNoVerify: () => undefined, setPrivateKey: () => undefined,
      cloneSubmodules: async () => undefined, clearRenovateRefs: async () => { this.reads.push({ op: 'clearRenovateRefs', refs: [] }); },
      GIT_MINIMUM_VERSION: '2.33.0', RENOVATE_FORK_UPSTREAM: 'renovate-fork-upstream',
      remoteBranchRef: branch => `refs/remotes/origin/${branch}`,
    };
    for (const name of ['checkoutBranch', 'isBranchModified', 'isBranchConflicted', 'isBranchBehindBase', 'deleteBranch']) methods[name] = this.scm[name];
    for (const name of ['pushCommit', 'forcePushToRemote', 'commitFiles', 'pushCommitToRenovateRef', 'mergeBranch', 'syncForkWithUpstream']) methods[name] = (...args) => this.mutation('GIT_PUSH', name, args);
    return this.proxy('git', methods);
  }
  installFiles(files) {
    this.files = files;
    for (const [file, contents] of Object.entries(files)) writeFileSync(join(this.directory, file), contents);
  }
}
