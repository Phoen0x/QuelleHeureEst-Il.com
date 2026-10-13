# Écarts historiques de conservation — PR #153

FR : audit ciblé de la vraie base `c39a87e1d693382f34ca38bcaa68e032a9bcbc29`, réalisé à partir de `a42475b25bd13d2803d0d32b9c3a71d4256170f0`. L'amorçage exceptionnel sur `c016987` ne valide aucune suppression antérieure. Les contrôles génériques restent stricts et inchangés.

EN: targeted audit of the actual base `c39a87e1d693382f34ca38bcaa68e032a9bcbc29`, starting from `a42475b25bd13d2803d0d32b9c3a71d4256170f0`. Exceptional bootstrap against `c016987` validates no earlier removal. Generic checks remain strict and unchanged.

## Origine et restauration des 31 noms

FR : le commit [9ff648d](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/9ff648dc66e1ca83bf564f26a172540cd825ba25) remplaçait Plugin React 4.7 par 6.0.2 et Vite 7 par 8.0.16 dans le manifeste et les références racines du verrou, mais laissait le snapshot `/@vitejs/plugin-react@4.7.0(vite@7.3.5)` et modifiait partiellement celui de Vite. Le snapshot de Plugin React 6 manquait entièrement. Les 31 noms ci-dessous étaient les descendants de l'ancien plugin 4.7, avec leurs parents exacts consignés dans `DEPENDENCY_GAPS_EVIDENCE_20261013.json`. Ce verrou incohérent ne permet pas d'affirmer qu'ils étaient utilisés par une application compilable avant réparation.

FR : [076b523](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/076b523ba719aa4c4bd0dd2f2c34807824602195) a résolu le vrai graphe et retiré ces 31 noms. Cette suppression effective exigeait la présente revue. Plugin React 6 utilise les outils Rolldown/Oxc ; ses dépendances publiées ne comprennent plus le graphe Babel de la version 4.7. Nous conservons néanmoins les outils historiques comme dépendances de développement explicites : `@babel/core@7.29.7`, les deux transforms JSX `7.29.7`, `@types/babel__core@7.20.5` et `react-refresh@0.17.0`. Leurs descendants sont réellement accessibles depuis ces cinq racines. La variante `semver@6.3.1` nécessaire au graphe est aussi restaurée ; la variante actuelle demeure. Le lien Browserslist suit l'override de sécurité existant `4.28.9`.

EN: commit 9ff648d changed root versions without resolving the package graph; commit 076b523 repaired it and removed the 31 legacy descendants. That removal is reviewed here independently. Five explicit development roots restore all 31 names and the required semver 6.3.1 variant. Existing security overrides remain applied. Historical snapshots stay archived; no old plugin is re-enabled.

| Nom | Version historique restaurée | Rôle historique | Décision |
|---|---|---|---|
| `@babel/code-frame` | 7.29.7 | Cadres d’erreur et extraits de code | Restauré, dev |
| `@babel/compat-data` | 7.29.7 | Données de compatibilité JavaScript | Restauré, dev |
| `@babel/core` | 7.29.7 | API et pipeline de transformation Babel | Restauré, dev |
| `@babel/generator` | 7.29.7 | Génération de code JavaScript | Restauré, dev |
| `@babel/helper-compilation-targets` | 7.29.7 | Sélection des cibles navigateur | Restauré, dev |
| `@babel/helper-globals` | 7.29.7 | Globals connus lors du parcours AST | Restauré, dev |
| `@babel/helper-module-imports` | 7.29.7 | Construction des imports de modules | Restauré, dev |
| `@babel/helper-module-transforms` | 7.29.7 | Transformation des modules | Restauré, dev |
| `@babel/helper-plugin-utils` | 7.29.7 | Utilitaires des plugins Babel | Restauré, dev |
| `@babel/helper-string-parser` | 7.29.7 | Analyse des chaînes littérales | Restauré, dev |
| `@babel/helper-validator-identifier` | 7.29.7 | Validation des identifiants | Restauré, dev |
| `@babel/helper-validator-option` | 7.29.7 | Validation des options des cibles | Restauré, dev |
| `@babel/helpers` | 7.29.7 | Helpers nécessaires aux transformations | Restauré, dev |
| `@babel/parser` | 7.29.7 | Analyse JavaScript et JSX | Restauré, dev |
| `@babel/plugin-transform-react-jsx-self` | 7.29.7 | Ajout du marqueur JSX __self en développement | Restauré, dev |
| `@babel/plugin-transform-react-jsx-source` | 7.29.7 | Ajout du marqueur JSX __source en développement | Restauré, dev |
| `@babel/template` | 7.29.7 | Construction de fragments AST | Restauré, dev |
| `@babel/traverse` | 7.29.7 | Parcours et transformation AST | Restauré, dev |
| `@babel/types` | 7.29.7 | Types et constructeurs AST | Restauré, dev |
| `@jridgewell/remapping` | 2.3.5 | Composition des source maps | Restauré, dev |
| `@types/babel__core` | 7.20.5 | Types TypeScript de Babel Core | Restauré, dev |
| `@types/babel__generator` | 7.27.0 | Types TypeScript du générateur | Restauré, dev |
| `@types/babel__template` | 7.4.4 | Types TypeScript des templates | Restauré, dev |
| `@types/babel__traverse` | 7.28.0 | Types TypeScript du parcours AST | Restauré, dev |
| `convert-source-map` | 2.0.0 | Lecture et écriture des source maps inline | Restauré, dev |
| `gensync` | 1.0.0-beta.2 | Exécution synchrone/asynchrone des transformations | Restauré, dev |
| `jsesc` | 3.1.0 | Échappement des littéraux générés | Restauré, dev |
| `json5` | 2.2.3 | Lecture des configurations JSON5 | Restauré, dev |
| `lru-cache` | 5.1.1 | Cache des cibles de compilation | Restauré, dev |
| `react-refresh` | 0.17.0 | Runtime Fast Refresh de développement | Restauré, dev |
| `yallist` | 3.1.1 | Liste chaînée du cache LRU | Restauré, dev |

FR : ces outils sont installés pour le développement et peuvent être exécutés isolément. Aucun changement de `vite.config.ts`, des sources React ou du backend Rust ne les active dans l'application. Un test construit le vrai graphe Vite en mémoire et refuse les modules Babel, React Refresh ou archives dans les chunks de production. Ce test ne prouve pas l'absence de chaque octet historique possible ; il vérifie les modules concernés et complète le contrôle existant des marqueurs dans les artefacts Rust/Vite.

EN: tools remain installed and executable in isolation, with no application configuration change. A test inspects the actual production module graph and rejects Babel, React Refresh and archived modules; it complements existing artifact marker checks.

## Peer optionnel vite/lightningcss

FR : le snapshot historique prétendait être Vite 8 tout en gardant `lightningcss: ^1.21.0` comme peer optionnel de Vite 7.3.5. Les manifestes amont exacts démontrent le changement : sous Vite 8.0.16, Lightning CSS est une dépendance obligatoire `^1.32.0`, résolue actuellement en `1.33.0`. La documentation amont indique que Lightning CSS minifie le CSS par défaut en Vite 8 ; le transformeur CSS reste PostCSS par défaut. La fonctionnalité n'est donc pas supprimée : son mode de déclaration change et son utilisation pour la minification est déjà active depuis la migration Vite. Nous n'ajoutons pas de faux peer aux métadonnées publiées et ne réactivons pas Vite 7. L'ancien peer reste intégralement dans le verrou archivé. Toutes les variantes natives optionnelles existantes doivent rester dans le verrou actif.

EN: Lightning CSS changed from an optional Vite 7 peer into a required Vite 8 dependency. Its old declaration remains archived; its package and native variants remain active. Vite 8 already uses it for default CSS minification; no new application feature is enabled by this task.

## Tauri shell-open

FR : le manifeste initial demandait `tauri = { version = "2.0", features = ["shell-open"] }`. Tauri 1.8.3 définit cette feature, reliée à `shell-open-api`, `open`, `regex` et `tauri-macros/shell-scope`. Tauri **2.12.3**, la version du verrou actif, ne la définit plus. [4e126a1](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/4e126a1265931c4032d6b31d06886d4acface5ea) l'a retirée pour permettre la résolution Tauri 2. La restauration active de cette déclaration serait invalide et casserait Cargo.

FR : les sources applicatives examinées (`src/`, `src-tauri/src/`), le manifeste et `tauri.conf.json` ne contiennent ni appel shell/opener, ni enregistrement de plugin, ni capability d'ouverture. `open_devtools()` ouvre les outils de développement en debug, pas une commande shell. Aucun comportement d'ouverture externe existant n'est donc démontré. La migration amont demande le plugin shell séparé, son enregistrement, les API JS correspondantes et des permissions ; cette migration n'est pas activée sans besoin fonctionnel. La déclaration invalide est restaurée **en commentaire** dans le manifeste actif et conservée mot pour mot dans son archive initiale. Le contrôleur refuse une réactivation de cette feature ou l'ajout implicite d'un plugin shell/opener. La recherche textuelle seule ne constitue pas une preuve universelle d'absence d'exposition indirecte ; elle accompagne la revue des points d'entrée.

EN: shell-open is a Tauri 1 feature incorrectly requested with Tauri 2. Re-enabling it breaks resolution. No application shell/opener call, registration or capability was found. Upstream migration requires a separate plugin and permissions. The declaration remains commented in the active manifest and intact in its original archive; no plugin or permission is added.

## Preuves amont

FR : les copies intégrales et leurs SHA-256 sont archivées dans `docs/history/dependency-gaps-20261013/upstream/`. Le contrôleur épingle ces empreintes ; une altération échoue.

EN: full upstream copies and SHA-256 digests are retained and pinned by the checker.

- [Plugin React 4.7.0](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%404.7.0/packages/plugin-react/package.json) et [6.0.2](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%406.0.2/packages/plugin-react/package.json).
- [Vite 7.3.5](https://github.com/vitejs/vite/blob/v7.3.5/packages/vite/package.json), [8.0.16](https://github.com/vitejs/vite/blob/v8.0.16/packages/vite/package.json) et [migration Vite 8](https://github.com/vitejs/vite/blob/v8.0.16/docs/guide/migration.md).
- [Tauri 1.8.3](https://github.com/tauri-apps/tauri/blob/tauri-v1.8.3/core/tauri/Cargo.toml) et [2.12.3](https://github.com/tauri-apps/tauri/blob/tauri-v2.12.3/crates/tauri/Cargo.toml).
- [Migration Tauri 2, révision 86f23966](https://github.com/tauri-apps/tauri-docs/blob/86f23966da282a29c7ec27e18ce540be70988091/src/content/docs/start/migrate/from-tauri-1.mdx).

## Contrôles et limites

FR : le workflow de conservation exécute désormais une comparaison **supplémentaire contre la vraie base**. Les deux écarts de schéma sont qualifiés seulement si leurs preuves et archives sont intactes et si la base correspond exactement aux fichiers historiques examinés. Ils restent affichés comme avertissements explicites. Aucune autre disparition n'est acceptée ; le contrôleur générique refuse toujours ces transitions sans cette qualification. Aucune règle d'audit, licence, approbation automatique ou workflow de sécurité n'est modifiée. Les fichiers antérieurs remplacés dans cette mission sont entièrement archivés dans `before/`.

FR : la reproductibilité est vérifiée avec pnpm 8.15.9 / Node 22 : installation gelée puis résolution réelle sans scripts et diff nul des manifestes/verrous. Les tests comprennent huit régressions supplémentaires du contrôle historique et trois tests d'outils/modules. Les résultats GitHub Actions seront consignés après exécution. Les audits connus hors mission restent visibles.

EN: a separate check uses the actual PR base and qualifies only two verified schema transitions, with explicit warnings. Generic checks, audit and licensing rules, automatic approval and security workflows are unchanged. Frozen installation and an unchanged lock after actual pnpm resolution verify reproducibility. Eight checker regressions and three tool/module tests are added; CI results are recorded after execution. Known unrelated audit findings remain visible.
