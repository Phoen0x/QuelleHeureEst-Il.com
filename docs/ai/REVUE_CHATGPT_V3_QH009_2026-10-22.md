# Revue indépendante ChatGPT V3 — QH-009 — 22 octobre 2026

**Objet :** avis `GHSA-vfj7-8cjw-p6xm` / `CVE-2026-93687`, bibliothèque `braces`. **Verdict : NON RÉSOLU OFFICIELLEMENT ; ATTÉNUÉ sur la PR #183 ; aucune modification applicative autorisée par ce compte rendu.** Tâche T-002 **non cochée** ; QH-010 (Vite) reste distinct et corrigé dans son périmètre sur #183.

## Provenance et périmètre

- Dépôt : `Phoen0x/QuelleHeureEst-Il.com`.
- [PR #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183), branche `codex/fix-development-validation-20261021`, **toujours en brouillon, non fusionnée**.
- SHA initial et final de la mission de recherche Codex : [`66f4d47f0b10f07c80a3ac257c3f76947bff8051`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/66f4d47f0b10f07c80a3ac257c3f76947bff8051), inchangé lors de la revue.
- `main` : `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228` lors du contrôle ; #186/#187 non fusionnées.
- **Deux classes de preuve :** `[VÉRIFIÉ PAR CHATGPT]` désigne inspection directe de GitHub, sources Git/lockfile/patch/CI ; `[RAPPORTÉ PAR CODEX]` désigne une expérience dans l'environnement Codex, dont les commandes/sorties brutes ne sont **pas** réexécutées ici ni conservées dans cette revue. Ne pas les confondre.

## Publication et avis officiels

- **[VÉRIFIÉ PAR CHATGPT]** [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) : avis élevé concernant `braces <=3.0.3`, aucune version corrigée indiquée. [CVE-2026-93687](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/93xxx/CVE-2026-93687.json) : état `PUBLISHED`, et non `REJECTED`.
- **[RAPPORTÉ PAR CODEX, cohérent avec les sources officielles]** le registre npm publie au dernier contrôle `3.0.3` comme version la plus récente : ne pas inventer de `3.0.4`.
- [Issue amont #70](https://github.com/micromatch/braces/issues/70), [discussion #73](https://github.com/micromatch/braces/issues/73), [issue #84](https://github.com/micromatch/braces/issues/84), [proposition de correction #72](https://github.com/micromatch/braces/pull/72) **fermée non fusionnée**, [contestation de l'avis #10132](https://github.com/github/advisory-database/pull/10132) **fermée non fusionnée**. Une contestation du CVE, même crédible, ne supprime pas l'avis tant que son statut officiel n'a pas changé. La qualification exacte est débattue en amont ; ni « faux positif » ni « attaque distante démontrée dans le produit » ne sont prouvés par défaut.

## Arbre et exposition

- **[VÉRIFIÉ PAR CHATGPT]** Le graphe actif du `pnpm-lock.yaml` conduit depuis `tailwindcss@3.4.19` vers `chokidar@3.6.0` et `micromatch@4.0.8` directement, et vers `fast-glob@3.3.3 → micromatch`. Tous pointent vers **`braces@3.0.3(patch_hash=ob3dsxpumlsknkuupw7v5lrnv4)`**, la version patchée. Une représentation non patchée peut demeurer historiquement dans le verrou ; ne pas la présenter comme le consommateur actif.
- **[VÉRIFIÉ PAR CHATGPT]** Ces chemins sont marqués `dev: true`, le manifeste actif ne déclare en production que React, React DOM et Lucide. La portée privilégiée est le **build/developpement/watch**, sans garantie d'innocuité pour des contenus ou configurations tiers.
- **[RAPPORTÉ PAR CODEX]** motifs Tailwind actuels fixes, aucun transfert détecté des entrées utilisateur/météo/géocodage vers les API `braces`. Ce constat n'exclut pas les fichiers, configurations/plugins tiers ou la surveillance des noms de fichiers.

## Mitigation actuelle : bénéfices et limites

- **[VÉRIFIÉ PAR CHATGPT]** Le [patch local au SHA Git blob `1a0f684bb519b44b5f20a19cfd104525411435d7`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/patches/braces-3.0.3.patch) borne la profondeur à 64 sur parsing, parcours AST et tableaux imbriqués. Les [dix tests historiques](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/tests/security/braces-depth.test.cjs) couvrent des motifs courants, des entrées profondes, des AST directs et les consommateurs. Le code amont `expand.js` suit aussi des liens `parent` dans des boucles `while` et le patch **n'ajoute pas de détection de cycle dans ces liens**.
- **[RAPPORTÉ PAR CODEX]** Dans une reproduction isolée, un `parent` cyclique bloque `expand` (timeout à 2 s, sortie 124) ; un prototype **extérieur au dépôt** refuse les cycles en produisant une exception contrôlée. Le prototype **n'est ni intégré ni publié ni une version officielle corrigée**.
- **[RAPPORTÉ PAR CODEX]** La profondeur bornée ne garantit pas un nombre d'expansions borné : un cas à faible profondeur produit **16 384 résultats**. Les frontières des opérations à profondeur 64 ne coïncident pas parfaitement.
- **[RAPPORTÉ PAR CODEX]** Un motif hostile peut déclencher un **rejet asynchrone non géré dans Chokidar**, avec sortie de processus 1, même lorsqu'un gestionnaire d'événement `error` est posé. Une entrée sous forme de nom de répertoire à accolades imbriquées peut entraîner une erreur de surveillance avec glob fixe. **Six tests consommateurs ont réussi, un a échoué** dans cette exploration : conserver cet échec distinct des suites historiques.
- **[RAPPORTÉ PAR CODEX, PAS D'INSPECTION BINAIRE INDÉPENDANTE]** L'archive npm Vite 8.1.6 contiendrait une **copie embarquée non patchée** de `braces 3.0.3` ; Codex dit l'avoir comparée aux octets installés. ChatGPT a vérifié que le code source Vite 8.1.6 utilise par défaut **`disableGlobbing: true`** pour sa surveillance et que le `vite.config.ts` du projet ne le change pas. La possibilité d'embarquer des dépendances dans les bundles est cohérente avec la configuration amont, mais **ne remplace pas l'inspection binaire**. Aucune exploitation de cette copie par la configuration actuelle n'est démontrée.
- **[RAPPORTÉ PAR CODEX]** Débordement `compile` sur `braces` non patché reproduit avec un motif de **9 999 caractères** ; seuil variable selon la pile. L'existence d'une `RangeError` attrapable ne prouve pas son innocuité lorsqu'un appelant ne traite pas correctement l'erreur.

## Résultats expérimentaux et CI

**[RAPPORTÉ PAR CODEX]** `pnpm install --frozen-lockfile`, conservation, TypeScript, ESLint, build Vite et suite principale réussis ; **31 tests du projet** dont 10 `braces` et 17 de conservation. Suite amont `braces` : **764/764** pour l'amont, le patch et le prototype ; **24 000 assertions** comparatives sans écart dans leur périmètre. Les suites consommateurs ajoutées pour le diagnostic donnent **6 réussites, 1 échec**. Audit pnpm complet : **1 avis élevé `braces`** avant/après, sortie 1 ; audit pnpm production : 0, sortie 0. Cargo tree toutes cibles réussi ; `cargo audit --deny warnings` : sortie 1, **neuf avertissements**, zéro vulnérabilité classée dans cette exécution.

**[NON RÉEXÉCUTÉ]** Ni ChatGPT ni Codex durant cette mission de recherche n'ont réexécuté les builds/tests Rust debug/release et le vrai CLI Tauri. La [CI Rust existante au même SHA](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707512) reste **SUCCESS** ; elle confirme notamment deux tests HTTP debug, **pas** toute l'expérimentation ci-dessus. Windows/WSL, Android et GUI natif restent non validés. Les archives de résultats temporaires et le prototype hors dépôt ne sont pas des fichiers versionnés de #183.

## Décision de revue et suite

1. **QH-009 demeure « ATTÉNUÉ — avis officiellement ouvert »**, sans prétendre que le patch résout intégralement l'ensemble des risques et sans prétendre que le CVE est faux.
2. **T-002 demeure non cochée.** L'objectif de résolution officielle n'est pas atteint ; les pistes sérieuses concernent les cycles `parent`, l'encadrement des entrées non fiables et la gestion des rejets asynchrones, ainsi qu'une étude plus poussée de l'éventuelle copie embarquée Vite.
3. **Aucun code ni lockfile modifié** et aucun commit ajouté sur #183 dans cette mission. Aucun scanner, seuil, ignore, licence, bot, protection ou workflow changé.
4. Pour un éventuel durcissement futur, demander **une mission technique distincte**, avec validation de la compatibilité/AST, de Chokidar et de l'origine de la copie Vite. Ne pas intégrer le prototype sur simple foi de ses tests hors checkout.
5. **QH-010 reste résolu sur #183 uniquement** ; #183 non fusionnée, CI de sécurité globale, `braces` et audit Rust toujours bloquants pour une décision de fusion.

**Références de suivi :** [journal d'incidents — PR #186](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/186) · [backlog T-002 — PR #187](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/187).
