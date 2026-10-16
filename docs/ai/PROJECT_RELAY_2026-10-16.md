# Relais vérifié — QuelleHeureEst-Il.com — 16 octobre 2026

**Destinataires :** nouveau chat ChatGPT de pilotage et nouvelle session Codex. **Photographie historique**, à comparer à GitHub avant toute action. Ce relais ne représente ni une validation de fusion ni une exécution de tests sur une session ultérieure.

## Dépôt et état GitHub vérifié

- Dépôt : https://github.com/Phoen0x/QuelleHeureEst-Il.com
- main : 235194a6fe825a6dac27012f07cbac2cc5d86794, branche protégée au dernier relevé.
- PR #153, phase 1 CI/Rust/JS/sécurité/conservation : **ouverte, non fusionnée, bloquée** ; head 0ebc167c8febf1b61752d1114f8135a59400c5f1.
  - https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153
  - [Index des rapports et des 418 pièces de relais](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/reports/pr153-relais-20261014/README.md)
  - [Chronologie des opérations et des échecs](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/reports/pr153-relais-20261014/CHRONOLOGIE_REPRISE.md).
- PR #162, proposition de cohabitation Dependabot/Renovate : **ouverte en brouillon, non fusionnée, bloquée** ; head 4d4efbb05793bf4bfc0eee8a27eb026cb8f1dd9a.
  - https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/162
  - [Rapport détaillé final](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/162#issuecomment-6204527190)
  - [Candidats, matrice et preuves](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/4d4efbb05793bf4bfc0eee8a27eb026cb8f1dd9a/docs/proposals/bot-cohabitation-20261015/README.md)
  - [Validation dédiée réussie au head #162](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38823878476).
- À la dernière vérification avant cette PR documentaire : **24 PR ouvertes** ; 10 Renovate, 9 Dependabot, #153 et #162, et 3 anciennes PR de qualité. Refaire l'inventaire : le nombre peut évoluer.

## Décisions de l'utilisatrice

1. Conserver **Renovate et Dependabot**, sans automerge, avec les rôles ci-après, sous réserve de validation avant activation.
2. **Dependabot** : toute la sécurité, Cargo et transitifs compris, versions JavaScript/pnpm et GitHub Actions ; **Renovate** : versions Cargo ordinaires uniquement, fenêtre 18:00 à 23:00 Europe/Paris. La plage horaire ne déclenche pas à elle seule Renovate et ne garantit pas absence de doublons.
3. **Aucune perte par nettoyage** : préserver toutes les dépendances directes/transitives/optionnelles/natives et leurs variantes, les lockfiles npm/pnpm/Cargo parallèles, historiques, scripts, commentaires, code fantôme et configurations Git/GitHub, Bolt/StackBlitz, Cursor, Claude, ChatGPT/Codex.
4. Pas de modification de l'approbation automatique (.github/workflows/auto-approve.yml), des protections/permissions, des licences, des politiques ou seuils d'audit sans autorisation expresse. Pas de fusion, fermeture, suppression de branche, force-push ou modification d'autres PR sans accord.
5. Adapter le pilotage IA : une seule mission concrète à la fois, rapports courts et vérifiables, répartition ChatGPT architecte/auditeur ; Codex développeur ; CI preuve ; décision humaine. **L'agent gère lui-même les relais**, sans faire transférer les fichiers manuellement quand il dispose des moyens de publication.

## Travaux de #153 : réussites et limites

- pnpm 8.15.9, Node 22, verrou v6 ; installation --frozen-lockfile, lint, TypeScript, Vite et actionlint passés au head cité.
- Rust --locked debug/release et **24 tests réussis dans chaque profil**, fmt et Clippy ; **41 tests Python** du gardien de conservation, **21 tests Ubuntu et 21 Windows** des gardes des générateurs passés.
- Pile HTTP applicative migrée de Reqwest 0.11/Hyper 0.14 vers Reqwest 0.12.28, Hyper 1 et h2 0.4.20 ; deuxième Reqwest 0.13.5 transitive conservée.
- Rétroports ciblés GLib vendored VariantStrIter et conversion Slice vide vers PtrSlice ; archives originales conservées, tests ciblés réussis. Le chemin CodeQL HIGH #13 sur l'archive ptr_slice.rs:900 est techniquement qualifié de faux positif précis, **mais le check HIGH GitHub reste rouge**.
- Réparation des graphes de dépendances : 31 descendants Babel rétablis ; archives et verrous npm historiques conservés ; générateurs historiques protégés contre une réexécution mutatrice.
- **Non résolu** : pnpm audit HIGH braces 3.0.3 / GHSA-vfj7-8cjw-p6xm (patch local, advisory présent) ; RustSec unmaintained proc-macro-error 1.0.4 et rustls-pemfile 1.0.4, glib 0.18.5 malgré rétroport ; cargo-deny advisories/licences FAILED ; CodeQL HIGH #13 ; aucune approbation actuelle garantie.
- Audit licences : 491 entrées du Cargo.lock dont 490 paquets tiers + application ; 450 rejets pour allowlist vide, cinq versions MPL-2.0, métadonnée de licence Cargo absente pour l'application. La proposition de politique est **non appliquée et non testée avec cargo-deny réel**. Vérifier notices, dépendances natives et droits de distribution avant distribution.
- **Non testé réellement** : APK Android, interfaces graphiques natives, expériences réelles Bolt/StackBlitz/Cursor/Claude, Miri/ASan et E2E complet. Les scans SonarCloud/APIsec/CodeQL Java-Kotlin sur l'ancien main échouent ou sont inexploitables pour diverses raisons documentées ; ne pas extrapoler la réussite des autres jobs.

## Travaux de #162 : état réel

- L'ancien candidat global enabled:false a été **archivé puis abandonné comme modification active** ; renovate.json final dans #162 est octet pour octet identique à celui de main (config:recommended).
- Propositions **inactives dans docs/proposals/** : Renovate enabled:true, cargo uniquement, automerge et platformAutomerge false, fenêtre 18–23 h Paris, prConcurrentLimit 5, prHourlyLimit 2, pruneStaleBranches:false, rebaseWhen:never ; Dependabot versions npm/Actions, Cargo sécurité avec limite PR versions = 0, sans ignores bloquant la sécurité.
- Validateur officiel Renovate 44.155.7, parseur officiel Dependabot, 16 cas horaires incluant DST 2026, simulation de fermeture et suppression : **succès dans la CI dédiée au dernier head**. Un test isolé montre **8 fermetures + 8 suppressions simulées** par défaut, zéro dans cette fonction avec pruneStaleBranches:false.
- **Limites** : pas de test du worker Renovate complet hébergé, pas de garantie sur les autres chemins d'écriture, ni coordination transactionnelle garantissant zéro doublon entre Renovate Cargo versions et Dependabot Cargo sécurité.
- Le fichier renovate.json dans #153 contient toujours enabled:false : harmoniser explicitement, conserver les anciennes variantes et ne pas fusionner #153 ou #162 aveuglément.

## PR de bots à protéger et réinventorier

Renovate : **#155, #156, #158, #159, #160, #161, #163, #164, #165, #166** (dix ouvertes au dernier relevé).

- #155 PostCSS SECURITY, doublon fonctionnel potentiel de Dependabot #146.
- #156 proposerait une **régression de Vite 8 vers 7.3.7** malgré son intitulé de mise à jour.
- #155/#158/#159/#160/#161/#163 retirent dans un verrou npm parallèle **84 noms, dont 51 optionnels**, au snapshot audité. Ne pas considérer chaque nom comme exécuté, mais ne pas éliminer ces représentations sans justification et accord.
- #164 chrono-tz 0.8 vers 0.10.
- #165 Reqwest 0.11 vers 0.13 : base main ancienne, à rapprocher de la migration HTTP déjà faite en #153.
- #166 rusqlite 0.29 vers 0.40 : vérifier compatibilité et dépendances sans fusion.
- Dependabot ouverts au relevé : **#138, #144, #145, #146, #148, #149, #150, #151, #152**.
- Anciennes PR de qualité #139/#140/#141 conservées. **La PR #154 est déjà fusionnée** dans main et a introduit le Renovate actif actuel.

## Transfert après plantages et compactions

Les longs historiques ChatGPT/Codex sont des références, mais **ne sont pas une base d'état fiable ou intégralement récupérable**. Deux tentatives passées de commentaire Codex ont été interrompues très longtemps sans retour ; la publication a ensuite été confirmée par les commentaires GitHub. Si une mutation est interrompue : **inspecter d'abord GitHub**, ne jamais la relancer aveuglément.

Le nouveau ChatGPT doit lire AGENTS.md, le [contrat de travail](WORKING_CONTRACT.md), cet index et les preuves des PR #153/#162, recontrôler les SHA, les PR apparues depuis et les jobs. Codex doit recevoir une mission unique, pas « continue tout ». Les agents doivent signaler lorsqu'il devient utile de repartir dans un chat propre, publier le relais sur GitHub et fournir le lien, sans multiplier les actions demandées à l'utilisatrice.

## Première mission à envisager après reprise

**En lecture seule d'abord :** vérifier le comportement du worker Renovate installé (pas seulement la fonction de nettoyage isolée) pour protéger **toutes** les PR/branches existantes, puis traiter la coordination des remédiations Cargo Dependabot et des mises à jour Cargo Renovate. Aucun déploiement/fusion, aucun changement d'alerte ou de sécurité sans accord. Conserver les propositions de #153/#162 inactives tant que ces blocages persistent.

La chronologie précise, les logs, rapports et archives volumineuses restent accessibles dans les deux index GitHub épinglés ci-dessus. Ce relais synthétise les faits connus, sans prétendre reproduire les transcriptions de tous les appels d'outils disparus.
