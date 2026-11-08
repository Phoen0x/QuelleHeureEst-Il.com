#!/usr/bin/env python3
"""FR : exécuter les six cas GLib dans des enfants isolés et bornés sous Linux.
EN: run the six GLib cases in isolated, resource-bounded Linux children.
"""
import argparse
import json
import os
from pathlib import Path
import resource
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
CASES = ['forward_next_reads_written_pointer', 'forward_nth_reads_written_pointer',
         'forward_last_reads_written_pointer', 'backward_next_reads_written_pointer',
         'backward_nth_reads_written_pointer', 'mixed_iteration_and_empty_array_remain_valid']


def limits():
    resource.setrlimit(resource.RLIMIT_CORE, (0, 0))
    resource.setrlimit(resource.RLIMIT_AS, (1024 * 1024 * 1024,) * 2)
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--profile', choices=['debug', 'release', 'both'], default='both')
    parser.add_argument('--manifest-path', type=Path)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    assert sys.platform == 'linux', 'Resource limits and GLib regressions are qualified on Linux only'
    profiles = ['debug', 'release'] if args.profile == 'both' else [args.profile]
    results = []
    for profile in profiles:
        command = ['cargo', 'test', '--locked', '--test', 'glib_variant_str_iter', '--no-run', '--message-format=json']
        if profile == 'release':
            command.append('--release')
        if args.manifest_path:
            command.extend(['--manifest-path', str(args.manifest_path.resolve())])
        # FR// La compilation est bornée à 10 min ; les six exécutions à 10 s chacune.
        # EN// Compilation is bounded to 10 minutes; each of the six runs to 10 seconds.
        built = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=600)
        sys.stderr.write(built.stderr)
        assert built.returncode == 0, built.stdout
        artifacts = [json.loads(line) for line in built.stdout.splitlines() if line.startswith('{')]
        executable = [a['executable'] for a in artifacts if a.get('reason') == 'compiler-artifact' and a.get('executable') and a['target']['name'] == 'glib_variant_str_iter']
        assert len(executable) == 1, 'Expected the application GLib integration test executable'
        listing = subprocess.run([executable[0], '--list'], capture_output=True, text=True, timeout=10, preexec_fn=limits)
        assert listing.returncode == 0
        assert sorted(line.removesuffix(': test') for line in listing.stdout.splitlines() if line.endswith(': test')) == sorted(CASES), 'Unexpected/missing GLib cases'
        for case in CASES:
            try:
                p = subprocess.run([executable[0], '--exact', case, '--nocapture'], capture_output=True, text=True, timeout=10, preexec_fn=limits)
                result = {'profile': profile, 'case': case, 'exit': p.returncode,
                          'stdout': p.stdout, 'stderr': p.stderr}
                if p.returncode == 0:
                    assert '1 passed; 0 failed; 0 ignored' in p.stdout, 'Case did not execute'
            except subprocess.TimeoutExpired:
                result = {'profile': profile, 'case': case, 'exit': 'timeout'}
            results.append(result)
    report = {'distinctCases': len(CASES), 'executions': len(results), 'results': results,
              'limits': {'wallSeconds': 10, 'cpuSeconds': 5, 'addressSpaceMiB': 1024, 'coreBytes': 0}}
    if args.output:
        args.output.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    return 0 if all(r['exit'] == 0 for r in results) else 1


if __name__ == '__main__':
    sys.exit(main())
