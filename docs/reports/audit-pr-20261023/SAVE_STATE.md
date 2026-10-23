# État complet de notre travail / Full save state

*Instantané du vendredi 23 octobre 2026, ~11h40 (Europe/Paris). FR d'abord, EN en fin de document. Ce fichier remplace tout besoin de relire la conversation : il dit où on en est, ce qui existe, où, et comment reprendre.*
*Snapshot of Friday 23 October 2026, ~11:40 (Europe/Paris). French first, English at the end. This file removes the need to re-read the conversation: it says where we are, what exists and where, and how to resume.*

Fichiers frères / sibling files : `COMPTE_RENDU.md` (analyse), `JOURNAL_DECISIONS.md` (décisions), `VARIANTES.md` (variantes package.json/lockfiles), `INVENTAIRE_PR.md` (38 PR), `PROMPT_AUDIT_PR.md` (prompt initial), `patches/`.

---

## 1. En une page

- **Mission** : analyser le repo `Phoen0x/QuelleHeureEst-Il.com`, auditer ses PR ouvertes en lecture seule, repérer les suppressions « inutilement destructrices », préparer des commits correctifs sans rien modifier sur les PR, puis déposer tout le travail dans une PR documentaire.
- **Résultat** : 38 PR ouvertes auditées ; **0 fichier supprimé** par l'ensemble ; les grosses suppressions sont des réécritures de lockfiles, en grande partie légitimes car `main` est incohérent ; 1 vrai bug (autofix #139) ; `vendor/glib-0.18.5` (#153) est un rétroport volontaire à conserver.
- **Livré sur GitHub** : PR **#188** (brouillon, `docs/audit-pr-20261023` → `main`), documentation seule, fichiers neufs uniquement, + 1 commentaire explicatif sur les checks rouges.
- **Préparé mais non poussé sur les PR** : patchs C1, C2, C3, C5 ; recette C6. Ils vivent comme fichiers dans la PR #188.
- **Rien n'a été** poussé sur les branches des PR auditées, ni fermé, ni fusionné, ni commenté (hormis #188, la PR que j'ai créée).
- **Reste à décider** : voir §9.

## 2. Règles de travail à respecter (issues de ton `AGENTS.md` et de tes consignes)

1. **Ne rien supprimer.** « Je préfère un code gardé ou mis en commentaire plutôt qu'un bout de code supprimé. » Règle « code fantôme » de `AGENTS.md` : ne jamais supprimer/réécrire/réactiver commentaires, variantes de config, scripts Windows (`Scripts/`), rapports historiques, variantes de lockfiles. En cas de doute : signaler et demander.
2. **Commentaires : français d'abord, anglais ensuite.** Garder les commentaires utiles.
3. **Programmes multilingues**, français par défaut ; projets prévus pour GitHub (public ou privé).
4. **Ne pas fusionner automatiquement les PR de sécurité.** Tester avant fusion ; signaler les jobs ignorés ou non bloquants.
5. **Précision avant action** : « attention à ne pas faire n'importe quoi et bien faire exactement ce que je veux ». Chaque affirmation doit s'appuyer sur un diff, un check ou un fichier lu ; sinon le dire.
6. **Recherche web à jour** plutôt que la mémoire d'entraînement (avis de sécurité, versions).
7. **Attribution des commits** : trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` seul, sans lien de session.

## 3. Accès réels (état constaté)

| Capacité | État |
|---|---|
| Lecture du repo, des PR, diffs, check-runs, annotations | OK (API REST via `gh api`, clone local) |
| `gh pr list` / GraphQL | **Bloqué** (utiliser REST) |
| Push | **OK** depuis l'installation de la GitHub App Claude (testé à blanc, `permissions.push = true`) ; utilisé **uniquement** pour la branche `docs/audit-pr-20261023` |
| PAT de Sasha | **Non disponible** : `GH_TOKEN` du shell est invalide ; l'accès passe par le dépôt attaché à la session |
| Alertes code scanning / Dependabot (API) | **403** (pas d'option de permission trouvée) ; GitHub signale 51 vulnérabilités sur `main` (37 élevées, 10 modérées, 4 faibles) : onglet Security |
| Navigateur, contrôle de l'ordinateur, tâches planifiées | Indisponibles (plan gratuit) |
| Connecteur GitHub dédié | Non trouvé dans le catalogue ; la GitHub App suffit |
| Environnement d'exécution | Linux, Node 22.22.0, npm 10.9.4, pnpm 8.15.9 via `npx`, pas de PowerShell, pas de `cargo` testé |

## 4. Chronologie

1. **Demande** : accès complet ? analyse du repo, prompt auto-adressé pour auditer les PR. → accès vérifié, repo cloné (shallow), prompt livré (`PROMPT_AUDIT_PR.md`).
2. **Installation** de la GitHub App Claude (liens donnés) ; vérification : push autorisé, code scanning 403.
3. **Audit** (« go ») : collecte REST de 38 PR (méta, fichiers, check-runs) ; analyse des lockfiles par comparaison d'ensembles de paquets ; lecture des diffs autofix ; recherches web ; compte rendu.
4. **Erreurs détectées et corrigées** : voir §8.
5. **Questions à choix** (≈12) → décisions (§6).
6. **Préparation des patchs** C1–C3, branche C5 validée, essai de fusion C6.
7. **PR #188** ouverte en brouillon ; commentaire d'explication des checks rouges posté.
8. **Notifications** reçues après ouverture : abonnement automatique à #188 ; commentaire du bot Bolt (lien StackBlitz, sans action) ; 5 échecs de checks hérités de `main` (§5.4).
9. **Dernière consigne** : arrêter les questions, consigner tout (ce fichier).

## 5. Constats techniques

### 5.1 Lockfiles
- `main` est **incohérent** : `package.json` demande `vite ^8.0.16` et `@vitejs/plugin-react ^6.0.2` ; `package-lock.json` résout vite 7.3.5 et plugin-react 4.7.0 (+ arbre `@babel/*`, 301 entrées) ; `pnpm-lock.yaml` (v6.0) a un importer `plugin-react 6.0.2(vite@8.0.16)` **sans entrée correspondante** dans `packages`, plus des entrées orphelines `4.7.0(vite@7.3.5)`.
- Les 19 PR de bots (+ #179, #183) réécrivent les deux lockfiles : plugin-react 6.1.2, vite 8.x, rolldown ajouté, **84 noms retirés dont tout `@babel/*`** : conséquence normale, pas une perte. Elles se chevauchent (conflits après la 1ʳᵉ fusion).
- #149–#152 (Dependabot) font passer `pnpm-lock` en `lockfileVersion '9.0'`.
- **C5** (branche locale) : npm 10.9.4 `--package-lock-only` + pnpm 8.15.9 `--lockfile-only --fix-lockfile` (format 6.0 conservé) → `package-lock.json` 245 entrées (vite 8.3.5, plugin-react 6.1.2, plus de Babel) ; `pnpm-lock.yaml` plugin-react 6.1.2, vite 8.0.16 ; `package.json` inchangé ; `npm ci --dry-run` OK, `pnpm install --frozen-lockfile` OK.
- **`pnpm run typecheck` et `lint` échouent** sur le code source (ex. `src/services/tauri.ts` importe `@tauri-apps/api/tauri` alors que `package.json` demande l'API v2 ; `PollenCard.tsx`) ; **non comparé avec `main`**.

### 5.2 Autofix IA
- **#139** : `ensureOrder(order, key)` appelé alors que la fonction est `ensureOrder(key)` (bug réel) ; note FR traduite en anglais seul. → C1, C2.
- **#141** : commentaire WinRT en anglais seul. → C3. Le reste (log au lieu de `catch {}`, `GetType($false)` + throw) est conservé.
- **#140** : épingle `PSWindowsUpdate 2.2.1.5` (existe sur PowerShell Gallery), retire `-Force`, inverse l'ordre de repli UpdateID/Title, remplace une annotation FR/EN historique. **En attente** (décision : rien pour le moment) ; non testable ici.

### 5.3 #153 et #183
- #153 : +116 172/−360, 276 fichiers, 0 suppression de fichier ; ajoute `vendor/glib-0.18.5` (121 fichiers), rétroport local du correctif de **RUSTSEC-2024-0429** (glib `>=0.15.0, <0.20.0` touché, corrigé en `>=0.20.0`) ; rend APIsec manuel, Sonar/Semgrep conditionnels, retire `java-kotlin`. Un seul conflit avec `main` : `AGENTS.md` (version de `main`, 66 lignes, sur-ensemble strict de la version de la PR, 47 lignes) → **C6**.
- #183 : +45 981/−81, 76 fichiers, 0 suppression de fichier ; ajoute `Cargo.lock` (5 270 lignes), scripts de contrôle, snapshots `docs/history`.

### 5.4 CI rouge commune (identique sur `main`, hors de #188)
`CodeQL Analysis (java-kotlin)` (aucun Java/Kotlin ; CodeQL plante à la finalisation, double job push + pull_request), `Trigger_APIsec_scan` (exit 1, secrets absents), `build` (`rust.yml`, exit 101 côté Rust, logs complets non lus), `Analysis` (SonarCloud, échec sans message). Correctif existant : #153.

### 5.5 Variantes
Voir `VARIANTES.md`. Sur 21 dépendances, 3 diffèrent entre variantes (`esbuild`, `rollup`, `postcss`) ; scripts alternatifs `check:dependencies`, `test:security`, `test`. `package-lock.main.json` est un **JSON invalide** (ligne 1503) ; `package-lock.main.fixed.json` et `package-lock.fix-report.json` sont les sorties par défaut de `Scripts/fix-package-lock-merge.mjs`.

## 6. Décisions de Sasha

| Sujet | Décision |
|---|---|
| CI | Les scans ne se lancent que quand ils sont pertinents ; `java-kotlin` retiré (pas de PR de code poussée) |
| Format pnpm-lock | « Je ne sais pas » : #149–152 gelées, C5 garde le format 6.0 |
| Lockfiles et variantes | Tout garder, rien supprimer ; variantes à refusionner plus tard **avec des questions** |
| PR pivot lockfile | Branche neuve générée par Claude (C5), aucun bot ne l'écrase |
| esbuild / rollup | Ne pas ajouter, documenter |
| Scripts alternatifs | Ne rien supprimer, noter |
| postcss | Ne pas décider maintenant |
| #140, #164–166 | Rien pour le moment |
| Patchs | Préparer tous (C1, C2, C3, C5, C6) et les inscrire avec le compte rendu |
| PR documentaire | `docs/reports/audit-pr-20261023/`, **document neuf**, brouillon |
| Attribution | `Co-Authored-By` seul |
| Commentaire sur #188 | Oui, expliquer les checks rouges (fait) |
| Questions | **Stop** : consigner tout (ce fichier) |
| Outils utilisés | ChatGPT, Codex, Claude, Bolt, Cursor, Copilot ; besoin présumé de npm, pnpm, yarn, bun (« jsp jcrois ») |

## 7. Où se trouve chaque chose

| Élément | Emplacement | Durabilité |
|---|---|---|
| Compte rendu, journal, variantes, inventaire, prompt, patchs, ce fichier | PR **#188**, `docs/reports/audit-pr-20261023/` (branche `docs/audit-pr-20261023`) | **Durable** (GitHub) |
| Commentaire explicatif des checks rouges | PR #188, commentaire `issuecomment-6361992346` | Durable |
| Patchs C1–C3, C5 | `patches/pr-139`, `pr-141`, `lock-resync` (dans #188) | Durable |
| Recette C6 | `patches/pr-153-merge-main/MERGE.md` (dans #188) | Durable |
| Branches locales `local/pr-139-fixes` (1868650, f0dc245), `local/pr-141-fixes` (e8701c7), `local/lock-resync-20261023` (b9dc962), `local/pr-153-merge-main` (75ee090) | Sandbox de Claude uniquement | Perdues à la fin de la session, **mais reconstruisibles à l'identique** : C1–C3 et C5 par `git am` des patchs (réappliqués à froid avec succès), C6 par la recette de `MERGE.md`. Non poussées comme branches, par choix (pas de branches ni de CI supplémentaires sur le dépôt public) |
| Données brutes de l'audit (JSON des 38 PR, fichiers, checks) | PR #188, `data/audit-data-20261023.tar.gz` (+ `data/README.md`) | **Durable** (ajouté après coup) |
| Mémoire de Claude | Fichier `quelleheureest-il` (décisions de Sasha + pointeur vers #188) | Durable tant que la mémoire est activée |

## 8. Incidents et corrections (par honnêteté)

1. **Référence `FETCH_HEAD` écrasée** : une première comparaison de lockfiles comparait à la mauvaise base (la tête d'une PR). Détecté avant toute conclusion ; tout recalculé contre `main`.
2. **`pnpm-lock.yaml` mal décrit** : j'avais d'abord écrit « résout plugin-react 4.7.0 » ; en réalité importer `6.0.2` + entrée manquante + orphelins `4.7.0`. Corrigé dans le compte rendu.
3. **Pied de page de la PR** : l'intégration remet « Generated by Claude Code » à chaque modification de la description ; le lien de session a disparu, la mention générique non. À retirer à la main si voulu.
4. **Écart non élucidé** : une première liste donnait `draft=true` pour #183, #186, #187 ; l'API par PR a ensuite donné `draft=false`. Cause inconnue.
5. **`format-patch`** : une première syntaxe erronée a été corrigée avant tout dépôt ; les patchs finaux ont été réappliqués à froid (`git am`) avec succès.

## 9. Points ouverts

1. Version de pnpm (6.0 ou 9.0) : `pnpm --version` sur la machine principale.
2. npm / pnpm / yarn / bun face à `preinstall: npx only-allow pnpm` ; pas de `yarn.lock`/`bun.lock`.
3. Refusion des `package.json` et lockfiles alternatifs : questions listées dans `VARIANTES.md` §4.
4. `postcss` : `^8.5.14` ou `^8.5.25`.
5. Sort de #149–152, #164–166, #140 (en attente).
6. Origine des erreurs `typecheck`/`lint` (à comparer avec `main`).
7. Alertes de sécurité (51 sur `main`) : détail non lu.
8. Ordre de fusion suggéré (à valider) : #153 (+ C6) → #176→#177→#178→#179 puis #183 → C5 (autres PR de lockfile refermées par toi) → #164–166 après `cargo check`.

## 10. Reprendre dans une nouvelle session

```bash
git clone --depth 1 https://github.com/Phoen0x/QuelleHeureEst-Il.com && cd QuelleHeureEst-Il.com
git fetch --depth 1 origin pull/188/head:docs-188            # ce dossier
git switch docs-188 && ls docs/reports/audit-pr-20261023/
# réappliquer un patch : voir patches/README.md ; fusion #153 : patches/pr-153-merge-main/MERGE.md
```

**Prompt de reprise à coller / resume prompt to paste :**

> Lis `docs/reports/audit-pr-20261023/SAVE_STATE.md` (PR #188 de `Phoen0x/QuelleHeureEst-Il.com`) puis `AGENTS.md`. Reprends à partir du §9 « Points ouverts ». Règles : ne rien supprimer (garder ou mettre en commentaire), commentaires FR puis EN, rien n'est poussé sur les PR auditées sans accord explicite, chaque affirmation sourcée, lecture REST uniquement (pas de GraphQL). Pose-moi les questions de `VARIANTES.md` §4 une par une avant toute refusion.

---

## English summary

Mission: read-only audit of the 38 open PRs of `Phoen0x/QuelleHeureEst-Il.com`, prepare corrective commits without touching the audited PRs, deposit everything in a documentation PR. Result: no PR deletes a file; big deletions are lockfile rewrites, mostly legitimate because `main` is internally inconsistent; one real bug (autofix #139); `vendor/glib-0.18.5` in #153 is an intentional backport to keep. Delivered: draft PR **#188** (docs only, new files) plus one explanatory comment on the red checks (inherited from `main`). Prepared but not pushed to the audited PRs: patches C1, C2, C3, C5 and merge recipe C6, stored as files in #188. Local branches exist only in Claude's sandbox. Rules: delete nothing (keep or comment out), French-first comments, nothing pushed to audited PRs without explicit approval. Open items are listed in §9; resume instructions and a paste-ready prompt are in §10.
