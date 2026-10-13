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
