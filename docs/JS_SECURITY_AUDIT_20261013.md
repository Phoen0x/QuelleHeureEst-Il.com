# Audit de sécurité JavaScript — 13 octobre 2026 / JavaScript security audit — October 13, 2026

## Français

Périmètre : les 27 entrées de `pnpm audit` sur la branche de la PR 153, à partir du commit `365aab89151a7cfa0d58b7fa1312898eb5345164`. Rust, cargo-deny, le workflow d'approbation et les autres PR restent hors des modifications.

Le candidat généré par pnpm 8.15.9 passe l'installation gelée, ESLint, TypeScript et Vite sous Node 22. Les 10 tests de sécurité passent, y compris l'utilisation du correctif par micromatch et chokidar.

### Versions corrigées

| Paquet | Version initiale | Version retenue | Entrées d'audit éliminées |
| --- | --- | --- | --- |
| brace-expansion | 1.1.15 et 5.0.6 | 1.1.21 et 5.0.12 | 12 |
| js-yaml | 4.2.0 | 4.3.2 | 3 |
| nanoid | 3.3.12 | 3.3.18 | 2 |
| postcss | 8.5.15 | 8.5.25 | 2 |
| browserslist | 4.28.2 | 4.28.9 | 2 |
| baseline-browser-mapping | 2.10.33 | 2.11.22 | 1 |
| source-map-js | 1.2.1 | 1.2.2 | 1 |
| postcss-selector-parser | 6.1.2 | 7.1.6 | 2 |
| esbuild | 0.27.7 | 0.28.1 | 1 |

Les overrides sont ciblés sur les branches concernées, notamment les versions 1 et 5 de brace-expansion. ESLint 9.39.4, Vite 8.0.16 et plugin-react 6.0.2 sont conservés. Le plancher de PostCSS devient `^8.5.25`. Le passage du parseur de sélecteurs à 7.1.6 couvre aussi l'avis de complexité quadratique que le correctif 6.1.4 proposé par Dependabot ne couvre pas.

### Alerte résiduelle et correctif local

Résultat après correction : **1 entrée élevée, 0 modérée, 0 faible**, contre 20 élevées, 5 modérées et 2 faibles auparavant. `pnpm audit` reste non nul et bloquant.

Cette entrée est [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), pour `braces 3.0.3`. L'avis et [le signalement amont #70](https://github.com/micromatch/braces/issues/70) ne fournissent aucune version publiée corrigée.

`patches/braces-3.0.3.patch` applique une mitigation locale via `pnpm.patchedDependencies`, avec hash dans le verrouillage. La profondeur des AST, des parenthèses/accolades et des tableaux intermédiaires est limitée à 64 ; les dépassements produisent une `SyntaxError` contrôlée avec le code `ERR_BRACES_MAX_DEPTH`. Les parcours compile, expand et stringify sont protégés aussi lorsque l'appelant fournit directement un AST. Les motifs ordinaires, échappements, classes de caractères, plages et expansions imbriquées sont couverts par les tests.

Le nom `braces` et la version 3.0.3 restent inchangés. Aucune exception, exclusion d'avis ou modification du niveau d'audit n'est ajoutée. L'audit basé sur la version continue donc à signaler le paquet malgré la mitigation testée. Cette entrée n'est pas présentée comme éliminée : remplacer le patch par une version amont corrigée lorsqu'elle sera disponible.

### Conservation des dépendances et références

Les 19 dépendances directes initiales restent déclarées. esbuild et Rollup, déjà présents dans le verrouillage, deviennent des devDependencies explicites pour les conserver lorsque Vite 8 reconstruit son graphe. esbuild est corrigé en 0.28.1 ; Rollup reste en 4.61.1. Ces outils ne sont pas ajoutés aux imports de l'application.

Le contrôle `pnpm run check:dependencies` vérifie les 293 noms de paquets initiaux, les variantes optionnelles, leurs liens, leurs peers optionnels et les entrées accessibles du verrouillage. Il passe avec 303 entrées accessibles et 95 noms de paquets optionnels conservés, notamment les variantes Android, Windows, macOS et Linux.

Les manifestes, le verrouillage et la CI précédant cette correction sont conservés dans `docs/history/js-security-20261013/`. Les anciens verrouillages npm, les autres archives, le code fantôme, les commentaires et les sources de l'application restent inchangés. Ces références ne sont pas des entrées Vite et ne sont pas copiées dans `dist/`.

### PR Dependabot examinées

| PR | Correctif utile / décision |
| --- | --- |
| [#152](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/152) | js-yaml 4.3.2 repris |
| [#151](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/151) | baseline-browser-mapping 2.11.22 repris |
| [#150](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/150) | browserslist 4.28.9 repris |
| [#149](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/149) | 6.1.4 ne couvre pas toutes les alertes ; parseur retenu en 7.1.6 |
| [#148](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/148) | nanoid 3.3.18 repris |
| [#146](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/146) | PostCSS 8.5.25 repris |
| [#145](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/145), [#144](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/144) | Correctifs transitoires repris par overrides ; montée majeure vers ESLint 10 évitée |
| [#138](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/138) | Suppression d'esbuild et de ses variantes rejetée ; mise à jour réelle en 0.28.1 |

Les patches Dependabot ont été lus. Leurs suppressions de variantes optionnelles dans les verrouillages npm, et la suppression d'esbuild dans #138, ne sont pas importées. Aucune de ces PR n'est fusionnée, fermée ou modifiée.

## English

Scope: the 27 pnpm audit entries on PR 153. Rust, cargo-deny, automatic approval and other PRs are unchanged.

Targeted updates eliminate **26 entries**. The remaining high-severity entry is braces 3.0.3 / GHSA-vfj7-8cjw-p6xm, for which no patched upstream release exists. A reproducible pnpm patch bounds AST and intermediate-array depth, including direct AST calls; all 10 regression tests pass. Package name/version are preserved, advisories are not suppressed and audit remains blocking.

Frozen installation, lint, typecheck and Vite pass on Node 22/pnpm 8.15.9. The original 19 direct dependencies, 293 package names and optional variants remain present; 95 optional package names and 303 reachable lockfile entries are checked. Existing esbuild and Rollup packages are explicitly retained as development tools. Historical configurations and application sources remain intact.

Dependabot PRs #138, #144–146 and #148–152 were inspected. Useful security versions were reused without importing optional-package deletions or an unnecessary ESLint major upgrade. No PR was merged, closed or modified.
