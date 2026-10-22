# Revue indépendante ChatGPT V3 — QH-010 — 22 octobre 2026

**Objet :** cinq avis de sécurité Vite 8.0.16, correction publiée sur [la PR #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183). **Verdict : RÉSOLU dans le périmètre Vite sur #183, non fusionné. Aucun feu vert pour la fusion de la PR ni pour la sécurité globale.**

## Références vérifiées

- Dépôt : `Phoen0x/QuelleHeureEst-Il.com`.
- Avant QH-010 : `bdda4abf3430bc5bda20176538c08533694c83f7`.
- Après QH-010 : [`66f4d47f0b10f07c80a3ac257c3f76947bff8051`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/66f4d47f0b10f07c80a3ac257c3f76947bff8051), son descendant direct ; #183 ouverte **en brouillon**.
- `main` lors de cette revue : `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228`, inchangée.
- [Rapport de Codex au SHA publié](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/docs/reports/vite-qh010-20261022.md) et [preuves structurées](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/docs/reports/vite-qh010-20261022-evidence.json).

## Contrôles indépendants effectivement effectués

1. **Diff Git entre les deux SHA**, métadonnées de PR et arbres complets : 133 fichiers avant, 144 après ; **129 blobs et modes inchangés**, **4 fichiers modifiés**, **11 ajoutés**, **0 supprimé**. Les quatre archives créées contiennent les **mêmes SHA de blob Git** que leurs sources antérieures. L'inventaire de 133 fichiers de `PORT.json` concorde avec l'arbre Git précédent.
2. **Lockfile réel sur les deux SHA :** 384 snapshots pnpm historiques, tous **strictement identiques dans leurs blocs textuels** ; **24 nouveaux** = 408 au total. Snapshots facultatifs 121 → 140. Les anciens Vite 7/8.0.16 restent archivés comme snapshots inactifs ; la racine active résout Vite **8.1.6** et `@vitejs/plugin-react` **6.0.2** avec le bon pair. Le manifeste ne change que la dépendance `vite`.
3. **Rust non modifié :** `Cargo.lock` possède exactement le même SHA de blob Git avant/après ; le manifeste Rust et les sources ne figurent pas au diff. Le rapport Codex identifie Reqwest applicatif 0.12.28, h2 0.4.20 et Tauri 2.11.6 inchangés.
4. **Sécurité Vite :** cinq avis [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv), [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw), [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) et [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) : version correctrice 8.1.6, cohérente avec la résolution active. Les audits pnpm **6 → 1** (production 0 → 0) proviennent des sorties documentées par Codex : **ils n'ont pas été réexécutés indépendamment par ChatGPT**.
5. **CI distante examinée au SHA exact :** [Rust 39730707512](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707512) **SUCCESS**, logs confirmant installation pnpm figée, contrôles frontend, build Vite 8.1.6 et **deux tests HTTP Rust en debug réussis**. [CodeQL Advanced 39730707540](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707540) et [Semgrep 39730707385](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707385) réussis dans leurs workflows dédiés.
6. **Échecs non masqués :** [Security & Quality Analysis 39730707704](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707704) **FAILURE**, notamment CodeQL Java/Kotlin sans source détectée. Le [job de dépendances JS](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730700717/job/119664819654) exécute `npm install` malgré `only-allow pnpm`, puis `npm audit` sur un périmètre différent (10 avis) ; son job vert ne démontre pas une sécurité JS globale. Le [job d'audit Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730700717/job/119664819435) contient neuf avertissements et une sortie de commande 1 malgré le statut du job. SonarCloud et APIsec, workflows séparés, restent en échec au relevé.

## Tests attestés par Codex, non réexécutés par cette revue

Selon le [rapport de mission](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/docs/reports/vite-qh010-20261022.md) : **31 cas JavaScript** réussis (2 Web, 10 `braces`, 2 sécurité Vite Linux, 17 conservation dont mutations négatives), installation figée, TypeScript, ESLint, build Vite, compilations Rust debug/release, 2 tests HTTP dans chaque profil et compilation CLI Tauri `--no-bundle` réussis. Ce sont des **preuves locales rapportées**, distinctes des exécutions observables dans la CI. La CI Rust ne couvre pas automatiquement toutes ces suites.

## Limites et décisions à conserver

- **QH-010 clos dans son périmètre sur #183**, mais **non présent sur main** et non qualifié comme résolution définitive globale.
- **QH-009 reste ouvert/atténué** : `braces 3.0.3`, GHSA-vfj7-8cjw-p6xm, patch local ; `pnpm audit` complet **sort 1**. Le `pnpm audit --prod` réussit, ce qui ne rend pas l'audit global vert.
- **QH-011 reste ouvert** : `cargo audit --deny warnings` sort 1 avec **sept `unmaintained`, GLib 0.18.5 `unsound`, Tokio 1.54.0 `yanked`** ; zéro vulnérabilité classée dans cette exécution, pas zéro risque.
- **QH-012 reste ouvert** : CI de sécurité incohérente/échouée, sans modification de workflow dans QH-010.
- **QH-014/013, Windows/WSL et produit** : Android/APK/AAB, GUI natif, Windows/WSL, installateurs et compatibilité matérielle non validés.
- Les avis Vite visant Windows/WSL n'ont **pas** été reproduits/testés sur ces environnements ; le choix de version corrigée repose sur les avis officiels, la résolution et les contrôles Linux.
- Aucun merge, fermeture/suppression, changement de licence, audit, bot, politique, protection ou permission autorisé par cette revue.

**Suivi :** [Backlog technique de la PR #187](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/187) tâche T-001 ; [journal central de la PR #186](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/186) QH-010. Les autres tâches restent distinctes. Une éventuelle fusion nécessite une décision humaine spécifique et une revue CI globale.
