#!/usr/bin/env bash
set -euo pipefail
# FR : rejeu sans connexion ; les téléchargements appartiennent à une phase séparée.
# EN: Offline replay; downloads belong to a separate preparation phase.
audit_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
: "${AUDIT_TOOLS:?Renseigner les outils isolés}"
: "${AUDIT_UPSTREAM:?Renseigner le clone amont épinglé}"
: "${AUDIT_OUTPUT:?Choisir un nouveau dossier de preuves}"
test "$(node --version)" = v24.19.0
mkdir -p "$AUDIT_OUTPUT"
python3 "$audit_directory/provenance.py" > "$AUDIT_OUTPUT/provenance.log" 2>&1
GUARD_RESULTS="$AUDIT_OUTPUT/guard-results.json" node "$audit_directory/guard-tests.mjs" > "$AUDIT_OUTPUT/guard.log" 2>&1
LOG_LEVEL=debug node "$AUDIT_TOOLS/node_modules/renovate/dist/config-validator.js" --strict --no-global "$audit_directory/reference-162/renovate.candidate.json" > "$AUDIT_OUTPUT/validator.log" 2>&1
LOG_LEVEL=debug node "$audit_directory/replay.mjs" > "$AUDIT_OUTPUT/replay.log" 2>&1
node "$audit_directory/verify.mjs" > "$AUDIT_OUTPUT/verification.log" 2>&1
printf '%s\n' 'Rejeu vérifié ; verdict opérationnel BLOQUÉ, aucune activation.'
