# Données brutes de l'audit / Raw audit data

FR : archive `audit-data-20261023.tar.gz` = réponses brutes de l'API REST GitHub du 2026-10-23 (matin) pour les 38 PR ouvertes : `pr-N.json` (métadonnées), `files-N.json` (fichiers et patchs ; certains fichiers concatènent plusieurs pages JSON, à lire avec `jq`), `checks-N.json` (check-runs de la tête de PR), `f153-*.json` (fichiers de #153 par pages), `open.txt` (liste des numéros). Aucun secret : données publiques d'un dépôt public.
EN: archive `audit-data-20261023.tar.gz` = raw GitHub REST API responses from the morning of 2026-10-23 for the 38 open PRs: `pr-N.json` (metadata), `files-N.json` (files and patches; some files concatenate several JSON pages, read them with `jq`), `checks-N.json` (head check-runs), `f153-*.json` (#153 files by page), `open.txt` (PR numbers). No secrets: public data of a public repo.

Extraction / extract : `mkdir d && tar xzf audit-data-20261023.tar.gz -C d`
