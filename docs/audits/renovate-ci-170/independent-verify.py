#!/usr/bin/env python3
import collections
import datetime
import gzip
import json
import os
import re
from pathlib import Path
from urllib.parse import unquote
from zoneinfo import ZoneInfo

AUDIT = Path(__file__).resolve().parent.parent / 'renovate-worker-168'
NUMBERS = [155, 156, 158, 159, 160, 161, 163, 164, 165, 166]
ATTEMPTS = {'cargo-only-three-recognized': 0, 'orphan-npm-native-prune': 14, 'disabled-repo-local-prune-false': 20, 'invalid-config': 0, 'rebase-title': 6, 'rebase-label': 9, 'rebase-checkbox': 6, 'rebase-dashboard': 6, 'title-body-label-change': 6, 'base-change': 6, 'user-retargeted-base': 3, 'conflict': 6, 'edited-branch': 3, 'missing-cargo-lock': 6, 'artifact-lock-error': 15, 'repository-lock-lost': 1, 'pr-creation-error': 0, 'creation-502-existing-branch': 9, 'prefix-reuses-protected': 6, 'prune-false': 0, 'rebase-never': 0, 'stop-label': 0, 'stop-label-checkbox': 6, 'stop-label-rebase-label': 3}
CALENDAR = {f'schedule-{day}-{time}' for day in ['2026-01-15', '2026-07-15', '2026-03-29', '2026-10-25'] for time in ['17:59', '18:00', '22:59', '23:00']}
EXPECTED = set(ATTEMPTS) | CALENDAR
NATIVE_PASS = {'cargo-only-three-recognized', 'invalid-config', 'pr-creation-error', 'prune-false', 'rebase-never', 'stop-label'} | CALENDAR
COVERAGE = {'renovateRepository': ('index.js', 80), 'initRepo': ('init/index.js', 80), 'extractDependencies': ('process/index.js', 76), 'writeUpdates': ('process/write.js', 76), 'processBranch': ('update/branch/index.js', 222), 'ensurePr': ('update/pr/index.js', 39), 'pruneStaleBranches': ('finalize/prune.js', 74), 'finalizeRepo': ('finalize/index.js', 72)}


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def read_inputs(directory):
    data = {'rows': json.loads((directory / 'results.json').read_text())['results'], 'events': json.loads((directory / 'mutations.json').read_text()), 'guard': json.loads((directory / 'guard-results.json').read_text()), 'guard_independent': json.loads((directory / 'guard-independent.json').read_text()), 'escapes': json.loads((directory / 'escape-tests.json').read_text()), 'snapshots': {}}
    for row in data['rows']:
        name = f"{row['scenario'].replace(':', '-')}-{row['mode']}-snapshots.json"
        file = directory / name
        raw = file.read_bytes() if file.exists() else gzip.decompress((directory / (name + '.gz')).read_bytes())
        data['snapshots'][(row['scenario'], row['mode'])] = json.loads(raw)
    return data


def target_values(value):
    if isinstance(value, list):
        for item in value:
            if isinstance(item, (str, int)):
                yield str(item)
            else:
                yield from target_values(item)
    elif isinstance(value, dict):
        for key, item in value.items():
            if key in {'number', 'branchName', 'sourceBranch', 'ref', 'sha', 'commitSha'} and isinstance(item, (str, int)):
                yield str(item)
            elif isinstance(item, (dict, list)) and key not in {'files', 'prBody', 'body', 'content', 'contents'}:
                yield from target_values(item)


def protected_event(event, prs):
    values = [unquote(str(event['target'])), *map(unquote, target_values(event.get('payload')))]
    return any(any(value == str(pr['number']) or pr['head']['ref'] in value or pr['head']['sha'] in value or re.search(rf"(?:issues|pulls)/{pr['number']}(?:/|$)", value) for value in values) for pr in prs)


def verify_data(data):
    prs = [json.loads((AUDIT / f'fixtures/pr-{number}.json').read_text()) for number in NUMBERS]
    rows, events = data['rows'], data['events']
    require(len(rows) == 80, '80 exécutions exigées')
    keys = [(row['scenario'], row['mode']) for row in rows]
    require(len(set(keys)) == 80 and set(keys) == {(name, mode) for name in EXPECTED for mode in ['native', 'barrier']}, 'Scénario manquant, inconnu ou dupliqué')
    require(all((event['scenario'], event['mode']) in set(keys) for event in events), 'Événement hors scénario')
    counts = collections.Counter()
    coverage = collections.Counter()
    corrections = []
    for row in rows:
        key = (row['scenario'], row['mode'])
        local_events = [event for event in events if (event['scenario'], event['mode']) == key]
        require(not row['unknown'] and not row['deniedNetwork'] and not row.get('thrown'), f'Erreur non modélisée : {key}')
        require(len(local_events) == row['writes'], f'Journal incomplet : {key}')
        require(sum(event['blocked'] for event in local_events) == row['blocked'], f'Rejets incohérents : {key}')
        snapshot = data['snapshots'][key]
        before, after = snapshot['before'], snapshot['after']
        for side in [before, after]:
            require(sorted(pr['number'] for pr in side['prs']) == NUMBERS, f'Identité protégée absente ou dupliquée : {key}')
        for original in prs:
            require(before['refs'][original['head']['ref']] == original['head']['sha'], f'Fixture SHA remplacée : {key}')
            present = next(pr for pr in before['prs'] if pr['number'] == original['number'])
            require(present['head'] == original['head'], f'Identité de PR changée avant le test : {key}')
        equal = before == after
        protected_equal = before['prs'] == after['prs'] and all(before['refs'][pr['head']['ref']] == after['refs'].get(pr['head']['ref']) for pr in prs)
        require(equal == row['snapshotEqual'] and protected_equal == row['protectedSnapshotEqual'], f'Flag de snapshot mensonger : {key}')
        protected_count = sum(protected_event(event, prs) for event in local_events)
        if row['mode'] == 'barrier':
            require(equal and protected_equal and all(event['blocked'] for event in local_events), f'Confinement rompu : {key}')
            computed = 'PASS'
        else:
            computed = 'PASS' if protected_equal and protected_count == 0 else 'FAIL'
            expected_status = 'PASS' if row['scenario'] in NATIVE_PASS else 'FAIL'
            require(computed == expected_status, f'Contre-exemple natif modifié : {key}')
            require(protected_count == ATTEMPTS.get(row['scenario'], 0), f'Nombre d’écritures protégées inattendu : {key}')
        require(row['status'] == computed, f'Statut non justifié : {key}')
        if protected_count != row['protectedWriteAttempts']:
            require(key == ('artifact-lock-error', 'native') and protected_count == 15 and row['protectedWriteAttempts'] == 9, f'Classification divergente non expliquée : {key}')
            corrections.append({'scenario': row['scenario'], 'historical_protected_count': 9, 'independent_protected_count': 15, 'reason': 'Six appels de statut ont une branchName dans un objet imbriqué de payload.'})
        counts[(row['mode'], computed)] += 1
        for name, (file, _) in COVERAGE.items():
            calls = sum(fn['calls'] for script in row['executed'] if script['file'] == 'workers/repository/' + file for fn in script['functions'] if fn['name'] == name)
            coverage[name] += calls
            if name in {'renovateRepository', 'initRepo'}:
                require(calls == 1, f'Fonction racine non exécutée une fois : {key}, {name}')
        if row['scenario'] in CALENDAR:
            date = datetime.datetime.fromisoformat(row['clock'].replace('Z', '+00:00')).astimezone(ZoneInfo('Europe/Paris'))
            require(row['scenario'] == 'schedule-' + date.strftime('%Y-%m-%d-%H:%M'), 'Horloge Paris/DST incohérente')
            scheduled = 18 <= date.hour < 23
            require(row['scheduleCheck'] == scheduled, 'Calendrier incohérent')
            require(len(row['branchResults']) == 3 and all(branch['result'] == ('no-work' if scheduled else 'update-not-scheduled') for branch in row['branchResults']), 'Calendrier non exercé dans le worker')
    require(dict(counts) == {('native', 'PASS'): 22, ('native', 'FAIL'): 18, ('barrier', 'PASS'): 40}, 'Totaux différents de 22/18/40')
    require(dict(coverage) == {name: count for name, (_, count) in COVERAGE.items()}, 'Couverture effective du worker différente')
    guard = data['guard']
    require(guard['injectedRejections'] == 500 and len(guard['results']) == 500, '500 injections exigées')
    require(guard['positiveControl'] == 'PASS' and guard['unknownOperations'] == 'PASS', 'Contrôle positif ou opérations inconnues manquants')
    require(all(item['status'] == 'PASS' for item in guard['results']), 'Rejet injecté non réussi')
    require(len({(item['pr'], item['method'], item['target']) for item in guard['results']}) == 500, 'Injections dupliquées')
    require(collections.Counter(item['pr'] for item in guard['results']) == {number: 50 for number in NUMBERS}, 'Dix PR non couvertes par les injections')
    independent = data['guard_independent']
    require(independent['rejected_writes'] == 500 and independent['blocked_effects'] == 0 and independent['positive_control_effects'] == 1, 'Réinjection indépendante invalide')
    require({(item['kind'], item['name']) for item in independent['unknown_operations']} == {('platform', 'futureWriteMethod'), ('scm', 'futureGitMethod'), ('git', 'createSimpleGit')}, 'Trois méthodes inconnues non exercées')
    require({item['name'] for item in data['escapes']} == {'child-process-push', 'child-process-exec', 'raw-tcp', 'tls', 'fetch-post'} and len(data['escapes']) == 5 and all(item['status'] == 'PASS' for item in data['escapes']), 'Cinq évasions non exercées')
    require(len(corrections) == 1, 'La divergence de classification connue doit être visible')
    return {'status': 'PASS', 'operational_verdict': 'BLOQUÉ', 'replays': 80, 'scenarios': 40, 'native_pass': 22, 'native_counterexamples': 18, 'barrier_confinements': 40, 'injected_rejections': 500, 'independent_reinjections': 500, 'unknown_operations': 3, 'escape_attempts': 5, 'paris_instants': 16, 'actual_worker_calls': dict(coverage), 'historical_differences': corrections}


if __name__ == '__main__':
    directory = Path(os.environ['AUDIT_OUTPUT'])
    report = verify_data(read_inputs(directory))
    (directory / 'independent-verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))
