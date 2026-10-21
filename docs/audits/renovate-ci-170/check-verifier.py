#!/usr/bin/env python3
import copy
import importlib.util
import json
import os
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('independent_verify', Path(__file__).with_name('independent-verify.py'))
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)
directory = Path(os.environ['AUDIT_OUTPUT'])
original = verifier.read_inputs(directory)


class RejectBrokenEvidence(unittest.TestCase):
    def test_original_evidence(self):
        self.assertEqual(verifier.verify_data(original)['native_counterexamples'], 18)

    def test_missing_run(self):
        with self.assertRaises(RuntimeError):
            verifier.verify_data({**original, 'rows': original['rows'][:-1]})

    def test_native_failure_hidden(self):
        rows = copy.deepcopy(original['rows'])
        next(row for row in rows if row['scenario'] == 'rebase-title' and row['mode'] == 'native')['status'] = 'PASS'
        with self.assertRaises(RuntimeError):
            verifier.verify_data({**original, 'rows': rows})

    def test_barrier_snapshot_modified(self):
        snapshots = dict(original['snapshots'])
        key = ('cargo-only-three-recognized', 'barrier')
        snapshots[key] = copy.deepcopy(snapshots[key])
        snapshots[key]['after']['prs'][0]['title'] = 'unauthorized-write'
        with self.assertRaises(RuntimeError):
            verifier.verify_data({**original, 'snapshots': snapshots})

    def test_worker_not_executed(self):
        rows = copy.deepcopy(original['rows'])
        rows[0]['executed'] = []
        with self.assertRaises(RuntimeError):
            verifier.verify_data({**original, 'rows': rows})

    def test_missing_injection(self):
        guard = copy.deepcopy(original['guard'])
        guard['results'].pop()
        with self.assertRaises(RuntimeError):
            verifier.verify_data({**original, 'guard': guard})

    def test_positive_control_disabled(self):
        guard = {**original['guard_independent'], 'positive_control_effects': 0}
        with self.assertRaises(RuntimeError):
            verifier.verify_data({**original, 'guard_independent': guard})

    def test_missing_escape(self):
        with self.assertRaises(RuntimeError):
            verifier.verify_data({**original, 'escapes': original['escapes'][:-1]})


suite = unittest.defaultTestLoader.loadTestsFromTestCase(RejectBrokenEvidence)
result = unittest.TextTestRunner(verbosity=2).run(suite)
(directory / 'verifier-negative-tests.json').write_text(json.dumps({'tests_run': result.testsRun, 'failures': len(result.failures), 'errors': len(result.errors), 'successful': result.wasSuccessful()}, indent=2) + '\n')
if not result.wasSuccessful():
    raise SystemExit(1)
