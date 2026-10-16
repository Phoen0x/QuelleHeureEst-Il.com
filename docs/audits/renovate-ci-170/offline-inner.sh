#!/usr/bin/env bash
set -euo pipefail
ci_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
audit_directory="$ci_directory/../renovate-worker-168"
# FR : le contrôle noyau et l'absence de tokens sont obligatoires avant ET après le worker.
# EN: Kernel isolation and absence of tokens are mandatory before AND after the worker.
python3 "$ci_directory/network-isolation.py" before
bash "$audit_directory/reproduce.sh"
node "$ci_directory/guard-recheck.mjs" > "$AUDIT_OUTPUT/guard-independent.log" 2>&1
python3 "$ci_directory/independent-verify.py" > "$AUDIT_OUTPUT/independent-verification.log" 2>&1
python3 "$ci_directory/check-verifier.py" > "$AUDIT_OUTPUT/verifier-negative-tests.log" 2>&1
python3 "$ci_directory/network-isolation.py" after
printf '%s\n' 'Toutes les étapes isolées sont terminées ; Mend reste non démontré.'
