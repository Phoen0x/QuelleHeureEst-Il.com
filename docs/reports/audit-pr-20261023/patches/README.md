# Patchs préparés / Prepared patches

FR : générés avec `git format-patch`, jamais poussés sur les branches des PR. Chaque dossier = une PR visée. Messages de commit bilingues FR puis EN, trailer `Co-Authored-By` seul.
EN: generated with `git format-patch`, never pushed to the PR branches. Each folder = one target PR. Bilingual commit messages (FR then EN), `Co-Authored-By` trailer only.

| Dossier | Cible | Contenu | Application |
|---|---|---|---|
| `pr-139/` | branche de #139 | C1 `ensureOrder(key)` ; C2 note FR restaurée | `git fetch origin pull/139/head && git switch -c fix-139 FETCH_HEAD && git am patches/pr-139/*.patch` |
| `pr-141/` | branche de #141 | C3 ligne FR au commentaire WinRT | idem avec `141` et `pr-141` |
| `lock-resync/` | `main` | C5 resynchronisation des lockfiles + copie de l'ancien état | `git switch -c lock-resync main && git am patches/lock-resync/*.patch` |
| `pr-153-merge-main/` | branche de #153 | C6 recette de fusion (voir `MERGE.md`) | voir `MERGE.md` |

FR : appliqués à froid sur la tête des PR dans un répertoire jetable : `git am` OK pour C1–C3 ; `node --check` OK pour C1/C2 ; le script PowerShell de C3 n'a pas pu être exécuté.
EN: applied cold on a clean PR head: `git am` OK for C1–C3; `node --check` OK for C1/C2; the PowerShell script in C3 could not be executed.
