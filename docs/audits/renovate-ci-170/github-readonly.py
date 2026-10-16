#!/usr/bin/env python3
import datetime
import json
import os
import sys
import urllib.request
from pathlib import Path

REPOSITORY = 'Phoen0x/QuelleHeureEst-Il.com'
PREFIX = 'https://api.github.com/repos/' + REPOSITORY + '/'
NUMBERS = [155, 156, 158, 159, 160, 161, 163, 164, 165, 166]
OUTPUT = Path(os.environ['AUDIT_OUTPUT'])
FIXTURES = Path(__file__).resolve().parent.parent / 'renovate-worker-168/fixtures'


def get_all(path):
    # FR : client public sans token, n'implémentant que GET ; jamais utilisé dans le worker.
    # EN: Public token-free client implementing GET only; never used by the worker.
    url = PREFIX + path + ('&' if '?' in path else '?') + 'per_page=100'
    result = []
    pages = 0
    while url:
        if not url.startswith(PREFIX) or pages >= 10:
            raise RuntimeError('Pagination GitHub hors périmètre ou excessive')
        request = urllib.request.Request(url, method='GET', headers={'User-Agent': 'renovate-audit-readonly-ci', 'Accept': 'application/vnd.github+json'})
        with urllib.request.urlopen(request, timeout=60) as response:
            data = json.load(response)
            if not isinstance(data, list):
                raise RuntimeError('Réponse GitHub inattendue')
            result.extend(data)
            link = response.headers.get('Link', '')
        url = None
        for part in link.split(','):
            if 'rel="next"' in part:
                url = part.split('<', 1)[1].split('>', 1)[0]
        pages += 1
    return result


def snapshot():
    pulls = {pr['number']: pr for pr in get_all('pulls?state=open')}
    branches = {branch['name']: branch['commit']['sha'] for branch in get_all('branches')}
    inline = get_all('pulls/comments')
    result = []
    for number in NUMBERS:
        original = json.loads((FIXTURES / f'pr-{number}.json').read_text())
        pr = pulls[number]
        if pr['head']['ref'] != original['head']['ref'] or pr['head']['sha'] != original['head']['sha'] or branches[pr['head']['ref']] != original['head']['sha']:
            raise RuntimeError(f'PR/ref historique différente : #{number}')
        comments = get_all(f'issues/{number}/comments')
        reviews = get_all(f'pulls/{number}/reviews')
        keys = lambda item: {key: item.get(key) for key in ['id', 'body', 'state', 'created_at', 'updated_at', 'submitted_at', 'path', 'line']}
        result.append({'number': number, 'state': pr['state'], 'title': pr['title'], 'body': pr['body'], 'labels': sorted(label['name'] for label in pr['labels']), 'head': {'ref': pr['head']['ref'], 'sha': pr['head']['sha']}, 'base': pr['base']['ref'], 'ref_sha': branches[pr['head']['ref']], 'comments': [keys(c) for c in comments], 'reviews': [keys(c) for c in reviews], 'inline_comments': [keys(c) for c in inline if c['pull_request_url'].endswith('/' + str(number))]})
    return result


phase = sys.argv[1]
report = {'repository': REPOSITORY, 'captured_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'method': 'GET only; no token', 'prs': snapshot()}
(OUTPUT / f'github-{phase}.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
if phase == 'after':
    before = json.loads((OUTPUT / 'github-before.json').read_text())
    if before['prs'] != report['prs']:
        raise RuntimeError('PR historiques modifiées pendant la validation : comparaison en échec')
    (OUTPUT / 'github-preservation.json').write_text(json.dumps({'protected_prs': NUMBERS, 'snapshots_equal': True, 'refs_equal_historical_sha': True}, indent=2) + '\n')
print(f'PASS : instantané {phase}, dix PR/refs historiques en lecture seule')
