#!/usr/bin/env bash
set -euo pipefail
# FR : préparer les outils hors du dépôt ; ne jamais installer ses dépendances applicatives.
# EN: Prepare tools outside the repository; never install application dependencies.
audit_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
: "${AUDIT_TOOLS:?Choisir un dossier OUTIL hors du dépôt}"
: "${AUDIT_UPSTREAM:?Choisir un clone amont hors du dépôt}"
project_directory="$(git -C "$audit_directory" rev-parse --show-toplevel)"
for selected_directory in "$AUDIT_TOOLS" "$AUDIT_UPSTREAM"; do
  case "$(realpath -m -- "$selected_directory")/" in
    "$project_directory/"*) printf '%s\n' 'Refus : les outils doivent rester hors du dépôt.' >&2; exit 1 ;;
  esac
done
mkdir -p "$AUDIT_TOOLS"
cp "$audit_directory/tooling/package.json" "$audit_directory/tooling/package-lock.json" "$AUDIT_TOOLS/"
npm ci --prefix "$AUDIT_TOOLS" --cache "$AUDIT_TOOLS/npm-cache" --ignore-scripts --no-audit --no-fund
git clone --depth 1 --branch 44.164.1 https://github.com/renovatebot/renovate.git "$AUDIT_UPSTREAM"
test "$(git -C "$AUDIT_UPSTREAM" rev-parse HEAD)" = 6cc889803a44be232802143499d904799f58abc0
