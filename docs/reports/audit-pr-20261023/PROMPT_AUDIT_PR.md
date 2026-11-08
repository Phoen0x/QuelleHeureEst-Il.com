# Prompt auto-adressé — Audit des PR de Phoen0x/QuelleHeureEst-Il.com

> FR : **version initiale** du prompt, rédigée avant l'audit. Les décisions prises ensuite sont dans `JOURNAL_DECISIONS.md`.
> EN: **initial version** of the prompt, written before the audit. Later decisions are in `JOURNAL_DECISIONS.md`.

<!-- FR d'abord, EN ensuite / French first, English second -->

## 0. Contexte (acquis lors de la reconnaissance du 2026-10-23)

- Repo public : `Phoen0x/QuelleHeureEst-Il.com` — Tauri 2 + Rust + React/TS/Vite, Android d'abord, pnpm imposé (`preinstall: only-allow pnpm`).
- ~38 PR ouvertes : Renovate (`renovate/*`), Dependabot (`dependabot/*`), autofix IA (`ai-findings-autofix/*`), et chaînes de PR de AetherXYZ (#176→#177→#178→#179, #153, #162, #170→#171, #183, #186, #187, #172).
- Issues ouvertes : #168 (rejeu du worker Renovate sans écriture), #157 (Dependency Dashboard).
- Accès réel : lecture du repo et de l'API REST via `gh api` (pas GraphQL, pas `gh pr list`). Code scanning et alertes Dependabot : **403**. Push : **refusé** (GitHub App Claude non installée sur l'orga). `GH_TOKEN` du shell est invalide : ne pas s'en servir. Navigateur et contrôle de l'ordi : indisponibles (plan gratuit).
- Clone de travail : `/home/claude/quelleheureest-il.com` (shallow). Pour une PR : `git fetch --depth=50 origin pull/<N>/head:pr-<N>`.

## 1. Règles NON NÉGOCIABLES

1. **Lecture seule sur GitHub.** Aucun push, aucun commentaire, aucune fermeture/fusion de PR, aucun changement de label ou de branche distante.
2. Lire `AGENTS.md` en entier avant tout et le respecter à la lettre. Notamment la règle « code fantôme » : ne jamais supprimer commentaires, variantes de config, scripts Windows (`Scripts/`), rapports historiques (`docs/history`, `docs/audits`, `docs/reports`), fichiers `package-lock.*` variants ou `NotesPersos.md` sans autorisation explicite. En cas de doute : **signaler et demander**, ne pas trancher.
3. Ne rien inventer : chaque affirmation sur une PR s'appuie sur un diff, un check-run ou un fichier réellement lu. Si je n'ai pas pu vérifier, je le dis.
4. Commentaires dans tout code/patch produit : **français d'abord, anglais ensuite**. Ne jamais supprimer de commentaire utile.
5. Ne pas fusionner/valider automatiquement les PR de sécurité (règle AGENTS.md).

## 2. Mission

Pour **chaque PR ouverte** :

1. Récupérer métadonnées + fichiers + stats : `gh api repos/Phoen0x/QuelleHeureEst-Il.com/pulls/<N>` et `/pulls/<N>/files?per_page=100` (paginer si > 100 fichiers), puis `.../commits/<sha>/check-runs`.
2. Calculer le ratio suppressions/ajouts par fichier et repérer les **suppressions destructrices inutiles**, en particulier :
   - lockfiles (`package-lock.json`, `pnpm-lock.yaml`) amputés de centaines de lignes / de blocs `node_modules/...` entiers (cas déjà vus : #184 −1864, #169 −1553, #138 −1837) ;
   - suppression de dépendances encore utilisées dans `package.json` / `Cargo.toml`, de features Cargo nécessaires, de scripts, de workflows ;
   - suppression de fichiers protégés par AGENTS.md (voir §1.2) ;
   - réécriture d'un lockfile secondaire alors que le gestionnaire officiel est pnpm.
3. Pour chaque suppression suspecte, **vérifier au lieu de supposer** : la dépendance est-elle importée (`grep` dans `src/`, `src-tauri/`) ? Est-elle obsolète/buguée/inutilisée (recherche web pour versions et advisories à jour, pas de mémoire d'entraînement) ? La suppression vient-elle d'une régénération légitime du lockfile (dédoublonnage) ou d'une perte sèche ?
4. Classer la PR : `OK telle quelle` / `À corriger (commit proposé)` / `À bloquer (décision humaine)` / `Obsolète ou doublon` (ex. chaînes empilées #176→#179 : vérifier l'ordre de merge et les conflits).
5. Cas particuliers à traiter explicitement :
   - **#153** (+116 k lignes, 276 fichiers) et **#183** (+46 k, 76 fichiers) : séparer le code utile du bruit (historiques, fixtures, `docs/history`) sans proposer de les supprimer.
   - **#170/#171** : gros `package-lock.json` d'audit sous `docs/audits/` → conservé (preuve d'audit), ne pas toucher.
   - **#185** (checkout v7) : vérifier que la version existe réellement avant d'approuver.
   - **#184** (vite 8 [security]) et **#169** (tauri 2.12.4) : le check `auto-approve` échoue — comprendre pourquoi.

## 3. Livrables (rien n'est poussé)

Dans `/home/claude/out/` :

- `rapport-pr.md` : tableau récapitulatif (PR, auteur, +/−, classement, risque) puis une fiche par PR « À corriger » ou « À bloquer » avec preuves (extraits de diff courts, commandes lancées).
- Pour chaque PR à corriger : une branche **locale** `fix/pr-<N>-restore` dans le clone + un patch `NNNN-pr-<N>-*.patch` généré par `git format-patch`, qui **restaure** ce qui a été supprimé à tort (ex. entrées de lockfile, dépendance utilisée) en gardant le reste de la PR intact. Message de commit bilingue FR/EN, trailer `Refs: #<N>`.
- Validation de chaque patch avant livraison : `git apply --check` sur la branche de la PR, `pnpm install --frozen-lockfile` si possible, `pnpm run lint` / `pnpm run typecheck`, `cargo check` si l'environnement le permet. Dire clairement ce qui n'a pas pu être exécuté.
- Une courte section « Questions pour Sasha » pour tout ce qui relève du code fantôme ou d'une décision d'architecture.

Pour appliquer côté GitHub, deux options à proposer : (a) `git fetch` de la branche PR puis `git am` des patchs en local et push par Sasha ; (b) installer la GitHub App Claude sur l'orga Phœn0x pour autoriser le push.

## 4. Méthode d'exécution

- Créer la task list d'abord ; dernière tâche = vérification croisée (chiffres du rapport recalculés par script, patchs réappliqués à froid).
- Paralléliser par lots de PR indépendantes (Renovate / Dependabot / chaînes AetherXYZ) avec des sous-agents en lecture seule ; ne pas dépasser 2 opérations git simultanées (proxy).
- Réponse finale courte : verdict global, fichiers livrés, une prochaine étape.

---

## English summary (secondary)

Read-only audit of all open PRs in `Phoen0x/QuelleHeureEst-Il.com`. Follow `AGENTS.md` (ghost-code preservation, FR-first/EN-second comments). For each PR, detect unjustified destructive deletions (lockfile truncation, removed-but-used dependencies, protected historical/Windows files), verify with greps and fresh web research, classify, and prepare **local** restore commits as `git format-patch` files plus a report in `/home/claude/out/`. Never push, comment, close or merge. Push is currently refused for this session; patches are applied by the owner or after installing the Claude GitHub App.
