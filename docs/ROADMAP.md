# Feuille de route — QuelleHeureEst-Il.com

> **État public initial au 22 octobre 2026, références de sécurité et de suivi actualisées le 23 octobre 2026.** Ce document expose les objectifs du produit, **pas** une promesse de livraison ni une liste de fonctionnalités déjà validées. Les priorités sont réévaluées sur preuves. Aucun calendrier de sortie n'est annoncé.

## Présentation et statut

QuelleHeureEst-Il.com ambitionne d'être une **application native multiplateforme**, **Android d'abord**, avec un cœur **Rust/Tauri 2**, un fonctionnement **local et hors ligne en priorité**, des permissions minimales et un français par défaut sélectionnable avec d'autres langues. Les écrans Web/React existants sont une interface, pas l'architecture native finale.

Le produit vise à fournir, pour un lieu choisi, l'heure et le fuseau horaire, la météo, la qualité de l'air, les pollens et d'autres informations environnementales. Les données doivent à terme pouvoir être recoupées entre sources gratuites avec provenance et signalement des divergences. **Des écrans, appels d'API et composants existent, mais ils ne prouvent pas un MVP Android, un mode hors ligne complet ou la compatibilité GrapheneOS.**

## À réaliser — vue accessible à tous

Une case non cochée signifie que **l'objectif complet n'est pas encore attesté**, y compris si des composants partiels existent. Les lettres P0/P1/P2/P3 sont des niveaux de priorité relatifs, pas des dates.

### P0 — Fondations indispensables

- [ ] **R-001 · Sécurité et reproductibilité :** fiabiliser les dépendances, les builds et les audits sans masquer les alertes ; vérifier les preuves avant toute diffusion. **État vérifié le 23 octobre 2026 :** la [PR #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183) est **ouverte, hors brouillon, non fusionnée**. Elle comprend le durcissement `braces` (GHSA toujours ouverte), la correction **Tokio 1.54.0 → 1.54.1** (RUSTSEC-2026-0384 corrigé sur la PR) et le [rétroport minimal de GLib `VariantStrIter` au SHA `f2eee422`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/f2eee4223a1ccf5b0866944580df8fd5979575dd), compilé et testé en CI Linux ; **RUSTSEC-2024-0429 reste officiellement signalé**. L'audit Cargo strict reste en échec (**0 vulnérabilité classée, 8 avertissements, sortie 1**) et la CI sécurité globale demeure non verte ; Windows/Android/macOS et GUI non validés. **Attention :** GLib vendored n'est chargé que si Cargo découvre la configuration du dépôt ou reçoit `--config` explicitement. Voir [T-002/T-003/T-004](TODO_TECHNIQUE.md), la [revue indépendante GLib](ai/REVUE_CHATGPT_V3_QH011_GLIB_2026-10-23.md) et le [journal #186](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/ef68b2a3255fde1281330da21d8e43102e5960fd/docs/ai/JOURNAL_DE_BORD_TECHNIQUE.md). **Jalon non coché et aucune fusion autorisée.**
- [ ] **R-002 · Application Android native :** produire et tester un véritable build Android/Tauri sur la cible, puis vérifier les permissions et comportements requis pour GrapheneOS.
- [ ] **R-003 · Rust/local/offline-first :** rapprocher logique métier, agrégation, cache et accès aux données du backend local, sans dépendance obligatoire à une API payante.

### P1 — Parcours principal

- [ ] **R-004 · Heure et fuseaux :** établir une heure locale robuste, changements d'heure et calculs de fuseaux correctement validés, y compris hors ligne.
- [ ] **R-005 · Environnement :** météo, prévisions, qualité de l'air, pollution et pollens, avec gestion d'erreurs et présentation de sources/provenance.
- [ ] **R-006 · Mode hors ligne :** cache durable, fraîcheur visible, dernier état connu et dégradation progressive après perte de réseau.
- [ ] **R-007 · Langues, accessibilité et sobriété :** français sélectionné par défaut, autres langues choisissables, interfaces accessibles et fonctionnement sur appareils modestes.

### P2 — Distribution et usages complémentaires

- [ ] **R-008 · Web et découvrabilité :** stabiliser la publication du site, puis décider de l'indexation, d'un `robots.txt` et éventuellement d'un `sitemap.xml` ; ces fichiers ne protègent pas la confidentialité.
- [ ] **R-009 · Expérience utilisateur :** favoris, historique, profils et exports JSON/CSV, chacun avec validations fonctionnelles et de vie privée.
- [ ] **R-010 · Autres cibles :** vérifier progressivement Windows, Linux, macOS, iOS, appareils portables, TV et self-hosting selon la faisabilité réelle.

### P3 — Idées futures, pas des engagements

Plus de données météo/environnement, phases lunaires, calendrier et événements, transports et trafic, itinéraires, conseils contextuels, services sociaux et autres pistes décrites dans [la présentation du projet](../.github/README.md). Leur périmètre, leur pertinence et leurs implications de confidentialité restent à décider.

## Comprendre l'avancement

- **Pour les personnes qui développent ou auditent :** consulter le [backlog technique](TODO_TECHNIQUE.md), où figurent les tâches précises, priorités, critères de sortie, références de PR et blocages.
- **Pour les agents IA :** commencer par [AGENTS.md](../AGENTS.md), le [contrat](ai/WORKING_CONTRACT.md) et l'[index des relais](ai/README.md), puis le backlog technique ; ne pas inférer qu'une case est cochée parce qu'une PR est ouverte.
- **Pour les incidents et leurs résolutions :** le [journal technique commun de la PR #186](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/ef68b2a3255fde1281330da21d8e43102e5960fd/docs/ai/JOURNAL_DE_BORD_TECHNIQUE.md) fait foi pour les problèmes documentés ; il n'est **pas encore sur `main`** à ce relevé.
- **Pour les conditions juridiques :** lire [LICENSE](../LICENSE). L'accès public au dépôt ne signifie pas qu'il soit sous licence libre ; aucune licence n'est modifiée par cette feuille de route.

**Mise à jour :** chaque jalon ne devient terminé qu'après preuves applicables (SHA, tests, environnement et, lorsque nécessaire, validation réelle du produit). Aucun effacement de l'historique lors des mises à jour.
