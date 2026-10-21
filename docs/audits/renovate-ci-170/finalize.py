#!/usr/bin/env python3
import json
import os
from pathlib import Path

output = Path(os.environ['AUDIT_OUTPUT'])
output.mkdir(parents=True, exist_ok=True)
steps = json.loads(os.environ['STEP_OUTCOMES'])
mandatory = ['source', 'before', 'prepare', 'integrity', 'replay', 'after', 'source_after']
outcomes = {name: steps.get(name, {}).get('outcome', 'missing') for name in mandatory}
required = ['source-integrity.json', 'tools-integrity.json', 'isolation-before.json', 'isolation-after.json', 'independent-verification.json', 'verifier-negative-tests.json', 'github-preservation.json', 'replay.log', 'guard-results.json', 'guard-independent.json', 'escape-tests.json', 'provenance.json', 'verification.json', 'results.json', 'mutations.json']
missing = [name for name in required if not (output / name).is_file()]
success = all(outcome == 'success' for outcome in outcomes.values()) and not missing
report = {'mandatory_steps': outcomes, 'missing_evidence': missing, 'reproduction_status': 'PASS' if success else 'FAIL / NOT RUN', 'operational_verdict': 'BLOQUÉ — aucune garantie Mend hébergé', 'head_sha': os.environ['CI_HEAD_SHA'], 'audited_source_sha': os.environ['AUDITED_SHA']}
(output / 'completion.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
summary = os.environ.get('GITHUB_STEP_SUMMARY')
if summary:
    with open(summary, 'a') as file:
        file.write('## Audit Renovate isolé\n\n```json\n' + json.dumps(report, ensure_ascii=False, indent=2) + '\n```\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
if not success:
    raise SystemExit('Une étape obligatoire a échoué ou n’a pas été exécutée.')
