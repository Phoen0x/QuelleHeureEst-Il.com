# CI et sécurité / CI and security

## Français

Le frontend utilise Node.js 22 et pnpm 8 (format de verrouillage v6). La CI vérifie les installations figées, ESLint, TypeScript et le build Vite. Le workflow Rust installe les bibliothèques natives Linux et prépare le frontend.

Dependabot : limite de 10 PR de versions npm et 5 PR Actions, avec regroupement mineur/correctif. Les mises à jour majeures restent indépendantes et les PR de sécurité suivent leurs propres règles.

CodeQL : JavaScript/TypeScript, Rust et Actions ; Java/Kotlin sera réactivé si le dépôt intègre un projet correspondant.

Scanners optionnels : SonarCloud demande les variables Actions SONAR_PROJECT_KEY et SONAR_ORG, ainsi que le secret SONAR_TOKEN. APIsec (manuel) demande la variable APISEC_PROJECT et les secrets apisec_username et apisec_password. NeuraLegion (manuel) demande la variable NEURALEGION_TARGET_URL et le secret NEURALEGION_TOKEN, sur une cible autorisée uniquement.

Les secrets doivent être configurés dans GitHub Settings, jamais committés. Un audit ignoré ou non bloquant n'est pas une preuve de réussite. Vérifier les journaux avant fusion.

## English

The frontend uses Node.js 22 and pnpm 8 (v6 lockfile). CI runs frozen installation, ESLint, TypeScript and Vite build. Rust CI installs native Linux dependencies and builds frontend assets.

Dependabot allows 10 npm version PRs and 5 Actions version PRs, grouping minor and patch updates. Major upgrades remain independent; security update rules are separate.

CodeQL analyzes JavaScript/TypeScript, Rust and Actions; enable Java/Kotlin when such source code is added.

Optional scanners: SonarCloud needs Actions variables SONAR_PROJECT_KEY and SONAR_ORG, and secret SONAR_TOKEN. Manual APIsec requires variable APISEC_PROJECT and secrets apisec_username and apisec_password. Manual NeuraLegion requires variable NEURALEGION_TARGET_URL and secret NEURALEGION_TOKEN. Scan authorized targets only.

Configure secrets in GitHub Settings, never in tracked code. A skipped or non-blocking scan is not a successful audit. Inspect job logs before merging.


## Phase 1 — corrections et limites (13 octobre 2026) / Phase 1 — fixes and limits (October 13, 2026)

### Français

- Verrouillage pnpm réparé par pnpm 8.15.9, en conservant les contraintes du manifeste, Vite 8.0.16 et plugin-react 6.0.2. L'ancien graphe est conservé sous `docs/history/`.
- Adaptation minimale à Tauri 2 (`@tauri-apps/api/core`), correction des clés et du niveau `aucun` pour le pollen. La table historique de clés reste commentée ; le type dérivé n'émet aucun code.
- Icône RGBA locale obligatoire pour Tauri ajoutée, format Rust corrigé, variantes/imports historiques conservés. Le profil de release est appliqué au workspace ; sa variante originale reste intacte dans le manifeste Tauri.
- `Cargo.lock` fixe les 495 paquets de la résolution utilisée. Compilation et tests exécutés avec `--locked` ; build de release et recherche de marqueurs historiques dans les artefacts Vite et le binaire.
- Les erreurs de compilation, Clippy, audits et cargo-deny sont bloquantes. Les contrôles locaux réalisés dans l'environnement de travail sont la cohérence des 302 entrées pnpm accessibles, les manifestes TOML, le YAML et la syntaxe des scripts shell. Les vérifications nécessitant les dépendances sont exécutées sur GitHub Actions.
- `cargo test` réussit mais exécute **0 test** actuellement. Les doctests et Android Lint sont explicitement ignorés : aucune bibliothèque Rust et aucun projet Gradle ne sont présents. Cela ne valide ni un APK Android, ni le fonctionnement hors ligne de bout en bout.
- Semgrep : variable Actions `SEMGREP_ENABLED=true` et secret `SEMGREP_APP_TOKEN` requis. Le CLI 1.180.0 remplace l'action obsolète qui annonçait toujours un succès. Sans activation, le job est ignoré. Les références historiques sont exclues ; les métriques sont désactivées.
- OWASP : rapport sous `reports/dependency-check-report.sarif`. Son analyseur pnpm incompatible avec le format v6 est désactivé ; l'audit pnpm 8 dédié reste bloquant. Les anciens verrouillages npm et `docs/history/` sont exclus comme références non utilisées pour l'installation.

**Dette de sécurité signalée, sans suppression de dépendances ni liste d'exceptions :**

- `pnpm audit --audit-level=moderate` : 27 alertes (20 élevées, 5 modérées, 2 faibles) dans la résolution conservée, notamment brace-expansion, js-yaml, nanoid, PostCSS, Browserslist, braces et postcss-selector-parser. Ce job reste rouge.
- `cargo audit --deny warnings` : `h2 0.3.27`, RUSTSEC-2026-0258 (correctif annoncé en >=0.4.16), et avertissements pour proc-macro-error, rustls-pemfile et glib. Une migration de dépendances est nécessaire ; aucun avertissement n'est supprimé.
- cargo-deny v2 fonctionne avec Rust stable, mais échoue sur les avis de sécurité et l'absence de politique explicite de licences autorisées. Les contrôles bans/sources passent. Aucune politique juridique n'est inventée.
- SonarCloud reste ignoré sans configuration ; APIsec et NeuraLegion restent manuels. Un scanner ignoré ou un rapport produit ne prouve pas l'absence de vulnérabilités.

### English

The pnpm lockfile is repaired without changing manifest constraints, Vite 8.0.16 or plugin-react 6.0.2. Historical variants remain under `docs/history/` or in comments, outside production artifacts. Type fixes cover Tauri 2 and pollen. A required local RGBA icon is added. Cargo.lock fixes the 495-package resolution; builds/tests use `--locked`, with release artifact checks.

Local checks cover 302 reachable pnpm entries, TOML manifests, workflow YAML and shell syntax. Dependency-based checks run on GitHub Actions. Rust tests currently run **zero tests**; doctests and Android Lint are explicitly skipped because no library or Gradle project exists. This does not validate an Android APK or end-to-end offline behavior.

Semgrep requires Actions variable `SEMGREP_ENABLED=true` and secret `SEMGREP_APP_TOKEN`; CLI 1.180.0 replaces the deprecated always-success action, excludes historical references and disables metrics. OWASP uses its actual `reports/` output path and delegates pnpm auditing to the blocking pnpm 8 job; historical npm lockfiles are excluded.

Security debt remains visible and blocking: 27 JS advisories (20 high, 5 moderate, 2 low); Rust advisory RUSTSEC-2026-0258 for h2 0.3.27 plus three warnings; cargo-deny advisory failures and an undefined license allow policy. Bans/sources checks pass. Dependencies remain present, with no suppression list. Optional scans being skipped does not prove security.
