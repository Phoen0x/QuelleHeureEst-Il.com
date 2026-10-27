# Inventaire préliminaire des doublons et variantes — QuelleHeureEst-Il.com

**Date du relevé :** 27 octobre 2026  
**Dépôt :** `Phoen0x/QuelleHeureEst-Il.com`  
**Référence de `main` analysée :** `085579a5ca59dcc36914461c652ca5ae61b805bf`  
**Périmètre :** 392 fichiers suivis, arbre Git non tronqué. Inventaire structurel préliminaire, **sans changement dans le dépôt**.

## Règles de conservation

- Ne supprimer, écraser ni fusionner automatiquement aucun fichier.
- Préserver les versions historiques et les preuves expérimentales, avec leurs empreintes et leurs références.
- Comparer les contenus, usages, dépendances et comportements avant toute refusion fonctionnelle.
- Distinguer doublon exact, variante, complément d'architecture et simple proximité thématique.
- Examiner les chemins personnels ou données privées dans les scripts et logs avant publication ultérieure.

## A. Refusions prioritaires à étudier

| Priorité | Fichiers | Qualification | Travail futur |
|---|---|---|---|
| P1 | `package.json`, `package-lock.json`, `pnpm-lock.yaml` | Ensemble de dépendances à synchroniser, pas des doublons interchangeables | Réconciliation multi-gestionnaires et cohérence des versions |
| P1 | `package-lock.main.json`, `package-lock.main.fixed.json`, `package-lock.fix-report.json`, `package-lock.json` | Variantes et rapport de réparation | Comparer les états ; conserver les snapshots historiques |
| P1 | `Scripts/purgewindowsupdate.ps1`, `Scripts/purgewindowsupdate (2).ps1`, `Scripts/purgewindowsupdate (3).ps1` | Versions numérotées différentes (SHA distincts) | Diff ligne à ligne, comportement, protections, chemins personnels |
| P2 | `Scripts/Maintenance.ps1`, `Scripts/WindowsFullUpdate.ps1`, `Scripts/majs prob.ps1`, `Scripts/dernier.ps1`, `Scripts/DiagComplet_DINGUERIE.ps1` | Fonctions potentiellement chevauchantes ; non confirmé | Identifier les fonctionnalités communes et exclusives |
| P2 | `Scripts/armourydelete.ps1`, `Scripts/disableasusservices.ps1`, `Scripts/ghelper.ps1`, `Scripts/OptiAlimRog.ps1` | Outils ASUS/ROG potentiellement complémentaires | Comparer les effets système avant toute mutualisation |
| P2 | `Scripts/analyze-lock-duplicates.mjs`, `Scripts/fix-package-lock-merge.mjs` | Traitements autour des lockfiles | Identifier logique partageable et différences voulues |
| P2 | `README.md`, `.github/README.md`, `docs/ROADMAP.md`, `docs/TODO_TECHNIQUE.md`, `docs/ai/JOURNAL_DE_BORD_TECHNIQUE.md` | Documentation à sujets recoupés | Désigner des sources de vérité et créer des liens croisés |
| P2 | `AGENTS.md`, `.bolt/prompt`, `docs/ai/WORKING_CONTRACT.md`, `docs/ai/KNOWLEDGE_PRIVACY_POLICY.md`, `docs/ai/STARTUP_CHATGPT_CODEX_PHOEN0X.md` | Instructions de plusieurs agents et outils | Matrice de précédence, compatibilité, règles communes et spécifiques |

## B. Versions documentaires et journaux

- `docs/ai/PROMPT_DEMARRAGE_CHATGPT_V4_2026-10-26.md` et `docs/history/prompt-chatgpt-v4-20261026/PROMPT_DEMARRAGE_CHATGPT_V4_2026-10-26.md` : **SHA distincts**, versions à comparer, archive à préserver.
- `docs/ai/SESSION_CHATGPT_V2_TO_V3_RELAY_2026-10-22.md`, `docs/ai/SESSION_CHATGPT_V3_TO_V4_RELAY_2026-10-23.md`, `docs/ai/PROJECT_RELAY_2026-10-16.md`, `docs/ai/STARTUP_CHATGPT_CODEX_PHOEN0X.md` : relier chronologiquement, **ne pas écraser**.
- Revues QH-009/QH-010/QH-011 et journal technique : produire éventuellement un index de synthèse ; conserver les rapports datés séparément.

## C. Grandes familles d'archives QH-011

| Répertoire sous `docs/reports/` | Fichiers suivis |
|---|---:|
| `qh011-acl-contract-20261027/` | 15 |
| `qh011-atomic-admission-20261026/` | 47 |
| `qh011-atomic-integration-20261026/` | 56 |
| `qh011-unicode-acl-20261026/` | 88 |
| `qh011-unicode-acl-nogo-20261026/` | 69 |
| **Total** | **275** |

Plusieurs blobs sont strictement identiques par identifiant Git, notamment :

- `verify.py` entre archives `acl-contract` et `atomic-integration` ;
- `experimental/atomic_admission_probe.rs.txt` entre `atomic-admission` et `atomic-integration` ;
- des fichiers `probe/examples/*.rs.txt` et `probe/Cargo.lock.txt` entre ces deux archives ;
- `acl/cases.json` et `acl/new-results.json` repris dans `unicode-acl-nogo/prototype/fixtures/` ;
- plusieurs snapshots `Cargo.lock` avant/après entre expériences ;
- `candidate-history/src-tauri/build.rs.txt` identique au `src-tauri/build.rs` courant au moment du relevé.

**Politique :** conserver ces copies au sein de leurs archives autonomes ; privilégier un index de correspondance, non une déduplication destructive.

## D. Configurations complémentaires et recoupements à vérifier

- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` : rôles probablement complémentaires.
- `Cargo.toml` racine et `src-tauri/Cargo.toml` : rôles probablement complémentaires.
- `tauri.conf.json`, `vite.config.ts`, `src-tauri/Cargo.toml` : cohérence transversale, pas refusion présumée.
- `.github/dependabot.yml` et `renovate.json` : risques de traitements concurrents.
- `.github/workflows/codeql.yml`, `security-analysis.yml`, `semgrep.yml`, `sonarcloud.yml` : couverture des scans et redondances éventuelles.
- `src/services/cache.ts` ↔ `src-tauri/src/cache.rs` ; `geocoding.ts` ↔ `geocoding.rs` ; `weather.ts` ↔ `weather.rs` : comparer les responsabilités web/Tauri ; ne pas supprimer une implémentation sans preuve.
- `Scripts/DiagDrivers_20260521_1402.txt`, `Scripts/logs latencymon.txt`, `Scripts/reportbsod.txt`, `Scripts/transcriptcursor.md` : traces à classer et à auditer pour leur confidentialité, non à refusionner comme code.

## E. Plan ultérieur

1. **Inventaire détaillé :** diffs, identité par hash, provenance, fonctions, entrées/sorties, risques personnels.
2. **Réconciliation ciblée :** scripts numérotés et dépendances en premier ; tests avant implémentation ; aucune suppression automatique.
3. **Index documentaire :** sources de vérité, liens entre rapports, preuves historiques conservées.

## Limites du relevé

- Fondé sur les noms, chemins, tailles et SHA Git de `main` ; les groupes fonctionnels n'ont pas tous fait l'objet d'une lecture de code.
- N'inclut pas les fichiers présents seulement sur les PR ouvertes, ni les fichiers non suivis des espaces de travail Codex.
- Les **19 groupes de blobs strictement identiques** repérés sont un indicateur de duplication de contenu ; cela ne prouve pas une duplication d'objectif ou de responsabilité.
- Ce document est un **instantané historique**, pas un état automatiquement actualisé.

**Statut : INVENTAIRE PRÉLIMINAIRE CONSERVÉ — AUCUNE REFUSION AUTORISÉE.**
