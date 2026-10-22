# Journal de bord technique commun — incidents, solutions et problèmes ouverts

> **Registre commun pour ChatGPT, Codex et les autres agents du projet.** Créé le 22 octobre 2026. Il sert à **retrouver rapidement un problème, ce qui a été tenté, la solution retenue, les preuves et les limites**. Il n'efface ni les rapports complets ni les états historiques. Appliquer [la politique de confidentialité](KNOWLEDGE_PRIVACY_POLICY.md), le [contrat IA](WORKING_CONTRACT.md) et les [consignes racine](../../AGENTS.md).

## Mode d'emploi et autorité

**Premier réflexe pour toute IA :** lire l'[index IA](README.md), le [relais V2 → V3](SESSION_CHATGPT_V2_TO_V3_RELAY_2026-10-22.md), puis le présent journal et les rapports détaillés liés aux tâches envisagées. Lire ce document depuis **la branche de la PR #186** tant que celle-ci n'est pas fusionnée ; les correctifs #183 et #153 restent sur leurs PR respectives. **Revérifier toutes les références distantes** avant intervention.

- **Lorsqu'un problème survient**, rechercher son identifiant ici avant de repartir de zéro. Si nouveau, créer une entrée datée. Si connu, **compléter** l'entrée avec la nouvelle tentative, le SHA et le résultat ; ne pas effacer les diagnostics précédents ni transformer un état historique en vérité présente.
- Consigner au minimum : **identifiant, date, statut, symptôme précis, cause vérifiée ou hypothèse, tentative(s), résolution/contournement, preuves (PR/SHA/CI/tests), limites, prochaine action**. Signaler la différence entre *réparé*, *atténué*, *non reproduit*, *bloqué* et *non testé*.
- Ne jamais considérer un job vert parce qu'il contient des étapes `continue-on-error` ou des contrôles informatifs : examiner **les logs des étapes**. Aucune résolution sans confirmation au **SHA livré**.
- **Ne pas réexécuter automatiquement** un script historique potentiellement mutateur. Lire le code/les archives et la base d'origine ; conserver les fichiers, lockfiles, variantes facultatives/natives et commentaires. Tout changement de sécurité, permission, licence, bot ou merge exige une autorisation distincte.
- Les incidents de conversations, outils et environnements Cloud ne sont **pas** des traces pérennes. Versionner les synthèses **publiables et expurgées**. Les journaux bruts contenant des secrets ou chemins privés ne doivent pas être publiés.
- Si une mission n'autorise pas l'écriture Git, proposer une entrée de journal dans le rapport de mission et demander au pilote une publication documentaire **séparée**. Ne pas modifier `main` ou d'autres PR pour « tenir le journal ».
- Maintenir **un seul index commun** : les rapports de la PR source sont les preuves détaillées ; les références de ce registre conduisent à ces preuves. Un état `partiellement résolu` garde ses blocages explicitement ouverts.
- Ne pas assimiler ce registre initial à « tous les événements jamais survenus » : **il recense les incidents accessibles et documentés**, et doit être enrichi à mesure que d'autres preuves deviennent disponibles.

### Statuts employés

- **RÉSOLU (périmètre donné)** : correctif vérifié sur le SHA concerné, mais pas nécessairement fusionné ou livré à l'utilisateur.
- **PARTIEL / ATTÉNUÉ** : amélioration démontrée, problème non entièrement résolu ou signalement toujours actif.
- **OUVERT** : défaut présent au dernier contrôle ; aucune correction démontrée.
- **BLOQUÉ / NON TESTÉ** : environnement, dépendance externe ou validation manquante.
- **HISTORIQUE** : problème ancien documenté ; état actuel à revérifier avant tout travail.

## Index des incidents — relevé initial du 22 octobre 2026

| ID | Domaine / symptôme | État au relevé | Source et résolution ou blocage |
|---|---|---|---|
| QH-001 | Consignes IA absentes de `main` lors de la reprise | **RÉSOLU** sur `main` | [#175 fusionnée](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/175), index `docs/ai/README.md` ; les anciens textes sur #167 restent historiques |
| QH-002 | Verrou pnpm incohérent, snapshots manquants, install figée impossible | **RÉSOLU** sur #183 | [Déblocage #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/development-validation-20261021.md), origines [#153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153)/[#179](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/179), snapshots historiques gardés |
| QH-003 | Cargo : feature Tauri 1 `shell-open` invalide sous Tauri 2 | **RÉSOLU** sur #176/#183 | [Rapport #176](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/50399f2a74cf77f4216187628ec163495906e241/docs/reports/rust-shell-open-20261019.md), ancienne déclaration conservée en commentaire et archive |
| QH-004 | Configuration Tauri au mauvais emplacement ; mauvais contexte CLI | **RÉSOLU** sur #183 | [Rapport #178](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/50399f2a74cf77f4216187628ec163495906e241/docs/reports/tauri-config-20261020.md), [déblocage #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/development-validation-20261021.md) |
| QH-005 | Icône attendue par le build Tauri absente | **RÉSOLU** sur #179/#183 | [Rapport icône #179](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/50399f2a74cf77f4216187628ec163495906e241/docs/reports/rust-icon-179-20261021.md), blob identique à #153 ; CI de #179 historiquement bloquée sur allowlist |
| QH-006 | Imports Tauri API 1 et erreurs de types pollen/badge | **RÉSOLU** sur #183 | [Rapport de développement](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/development-validation-20261021.md), 2 tests Web réellement exécutés |
| QH-007 | `h2 0.3.27` / RUSTSEC-2026-0258 dans le verrou Cargo | **RÉSOLU** sur #183, pas sur main | [Migration HTTP/2](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/http2-183-20261022.md) ; Reqwest 0.12.28, h2 0.4.20, Tauri 2.11.6 conservé, 2 tests HTTP en CI |
| QH-008 | Vulnérabilités JavaScript transitives et dérives des options natives | **PARTIEL** sur #183 | [Audit JS #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/js-security-183-20261022.md), 32 → 6 avis pnpm **d'après l'audit Codex** ; 324 noms, 337 snapshots initiaux, 95 optionnels préservés |
| QH-009 | `braces 3.0.3` / GHSA-vfj7-8cjw-p6xm | **ATTÉNUÉ, signalement officiellement ouvert** — contrôle du 22 octobre 2026 | [Patch et 10 tests #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/js-security-183-20261022.md) conservés ; [revue indépendante des limites et échecs consommateurs](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/248ad883be20b0fa915498b3825ca5143de08e40/docs/ai/REVUE_CHATGPT_V3_QH009_2026-10-22.md) ; pas de version corrigée, pas de retrait, T-002 non cochée, **aucune modification #183** |
| QH-010 | Cinq avis sur Vite 8.0.16 | **RÉSOLU dans le périmètre de #183, NON FUSIONNÉ** ; initialement **OUVERT** à `bdda4ab` | [Correctif 8.1.6 et mesures](<https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/docs/reports/vite-qh010-20261022.md>) ; [revue indépendante ChatGPT V3](<https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/ba6e584909b6f38f8403d2b728b848e36f39859c/docs/ai/REVUE_CHATGPT_V3_QH010_2026-10-22.md>) ; six avis pnpm initiaux → un seul (`braces`), sans validation globale de #183 |
| QH-011 | Audit Rust strict : neuf avertissements malgré suppression de l'avis h2 | **OUVERT** | [Rapport h2 #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/http2-183-20261022.md) ; 7 `unmaintained`, GLib 0.18.5 `unsound`, Tokio 1.54.0 `yanked` ; `cargo audit --deny warnings` échoue |
| QH-012 | GitHub CI sécurité : audits npm/pnpm incohérents, CodeQL Java/Kotlin | **OUVERT** | [CI sécurité #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39719158230) ; `npm audit` malgré projet pnpm, `only-allow pnpm`, erreur CodeQL « no Java/Kotlin source » + argument non reconnu ; ne pas désactiver de scanner |
| QH-013 | Bibliothèques natives Linux indisponibles en chemins système ; WebKit GUI | **PARTIEL / BLOQUÉ GUI** | [Reconstruction Debian](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/development/linux-environment-20261022.md) : 132 archives signées extraites hors système ; builds debug/release réussis localement ; GUI natif non validé |
| QH-014 | Android : outillage présent, application/APK non prouvée | **NON TESTÉ** | [Reconstruction Linux](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/development/linux-environment-20261022.md) : JDK 21, SDK/NDK, cible Rust arm64 ; absence d'émulateur/KVM, aucune validation Android |
| QH-015 | Renovate / Dependabot : risque de suppression de variantes et branches | **OUVERT, changements différés** | [Relais projet](PROJECT_RELAY_2026-10-16.md), [proposition #162](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/162), [tests #170](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/170)/[#171](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/171) ; aucune modification des bots sans accord |
| QH-016 | Audits juridiques/licences et alertes GLib sur #153 | **OUVERT / partiel historique** | [Relais #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/reports/pr153-relais-20261014/README.md), [chronologie](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/reports/pr153-relais-20261014/CHRONOLOGIE_REPRISE.md) ; fixes GLib spécifiques sur #153, pas de transfert implicite à #183 |
| QH-017 | `git diff --cached --check` signale des lignes de contexte du patch `braces` | **OUVERT, diagnostic qualifié** | [Rapport JS #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/bdda4abf3430bc5bda20176538c08533694c83f7/docs/reports/js-security-183-20261022.md), 21 espaces de contexte de diff unifié ; ne pas supprimer patch ni désactiver contrôle pour verdir |
| QH-018 | Perte possible de contexte après nouvelle session / environnement Cloud | **ATTÉNUÉ, pas de sauvegarde exhaustive** | [Relais V2 → V3](SESSION_CHATGPT_V2_TO_V3_RELAY_2026-10-22.md), [politique](KNOWLEDGE_PRIVACY_POLICY.md), rapports versionnés ; les scripts et logs bruts Cloud restent potentiellement éphémères |


### Mise à jour QH-010 — 22 octobre 2026 — cinq avis Vite corrigés sur #183

- **État historique (à conserver) :** au `bdda4abf3430bc5bda20176538c08533694c83f7`, Vite 8.0.16 était exposé aux cinq GHSA recensées ci-dessus ; QH-010 était **OUVERT**, et Vite 8.1.6 n'était qu'un candidat à évaluer.
- **Correction et portée :** Codex a publié un commit descendant direct, [`66f4d47f0b10f07c80a3ac257c3f76947bff8051`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/66f4d47f0b10f07c80a3ac257c3f76947bff8051), sur la [PR #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183) **toujours ouverte en brouillon**. Vite actif **8.1.6 exact**, plugin-react **6.0.2** ; les cinq avis ne concernent plus sa version active. **RÉSOLU au périmètre du commit uniquement ; non intégré dans `main`.**
- **Audit JS :** [audits pnpm et preuves structurées](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/docs/reports/vite-qh010-20261022-evidence.json) documentés par Codex : **6 → 1** entrée (cinq Vite retirées ; `braces 3.0.3` / QH-009 **reste HIGH et signalé** malgré un patch local), `pnpm audit` complet **sort 1**, audit production **0 → 0**. La comparaison pnpm n'a pas été relancée par ChatGPT : indépendance assurée pour les sources Git et la CI, pas par une seconde exécution de tout l'environnement Codex.
- **Conservation vérifiée indépendamment :** comparaison Git avant/après : **133 → 144 fichiers**, **129 blobs/modes inchangés**, **4 modifiés avec originaux archivés au blob SHA identique**, **11 ajoutés**, **0 supprimé** ; **384 snapshots pnpm antérieurs textuellement identiques**, plus 24 nouveaux = **408**, variantes optionnelles **121 → 140** ; `Cargo.lock` inchangé. Les anciennes versions Vite restent en archive, **inactives**. Reqwest applicatif 0.12.28, h2 0.4.20 et Tauri 2.11.6 conservés selon les contrôles de la mission ; aucune source Rust modifiée.
- **Tests :** Codex documente **31 cas JavaScript** et **2 HTTP debug + 2 HTTP release**, ainsi que builds Rust debug/release et CLI Tauri sans bundle, réussis **localement**, non réexécutés intégralement par ChatGPT. [CI Rust GitHub 39730707512](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707512) **SUCCESS** au SHA publié : installation figée, contrôles frontend, Vite 8.1.6 et **deux tests HTTP debug réellement exécutés**. Tests Windows/WSL, Android, GUI natif et installateurs **non validés**.
- **Blocages distincts inchangés :** QH-009 (`braces`), QH-011 (`cargo audit --deny warnings` échoue avec **neuf avertissements** malgré zéro vulnérabilité classée) et QH-012 ([CI sécurité 39730707704](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707704) **FAILURE**, CodeQL Java/Kotlin sans sources ; `npm install/npm audit` utilise un autre périmètre et bute sur `only-allow pnpm` ; SonarCloud/APIsec en échec). Les jobs portant `continue-on-error` ne certifient pas leurs commandes.
- **Références :** [rapport technique Codex](<https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/docs/reports/vite-qh010-20261022.md>) · [revue indépendante ChatGPT V3](<https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/ba6e584909b6f38f8403d2b728b848e36f39859c/docs/ai/REVUE_CHATGPT_V3_QH010_2026-10-22.md>) · [backlog public/développeurs proposé par la PR #187](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/187), tâche T-001.
- **Prochaine action du journal :** reporter l'état *résolu sur #183* dans le suivi documentaire sans cocher les audits globaux ni modifier les autres PR. **Aucune fusion vers `main` autorisée**.

### Mise à jour QH-009 — recherche et revue indépendante du 22 octobre 2026

- **Statut : ATTÉNUÉ ; alerte HIGH ouverte ; NON résolu officiellement.** [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) toujours active pour `braces <=3.0.3` sans version corrigée ; [CVE-2026-93687](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/93xxx/CVE-2026-93687.json) `PUBLISHED`. Dernière version npm 3.0.3 selon la recherche Codex. [Correctif amont #72](https://github.com/micromatch/braces/pull/72) et [contestation de l'avis #10132](https://github.com/github/advisory-database/pull/10132) fermés **sans fusion** ; la contestation de la validité du CVE est un débat, pas un retrait.
- **Cible et absence de changement :** [PR #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183) `66f4d47f0b10f07c80a3ac257c3f76947bff8051` **avant et après cette mission**. Codex n'a rien publié, pas même le prototype testé hors dépôt ; `main` inchangée. Les **408 snapshots pnpm et 140 optionnels** sont préservés, sans nouveau diff.
- **Dépendances confirmées directement par ChatGPT :** `tailwindcss 3.4.19 → chokidar 3.6.0 / micromatch 4.0.8 / fast-glob 3.3.3 → braces 3.0.3` **avec patch pnpm sur les trois chemins actifs** ; outillage de développement/build/watch. Les motifs Tailwind du projet sont fixes ; Codex n'a identifié aucun passage direct d'entrées utilisateur à ces API, mais ne garantit pas l'absence de risque via les fichiers/plugins/configurations tiers.
- **Patch effectivement présent :** [`patches/braces-3.0.3.patch`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/66f4d47f0b10f07c80a3ac257c3f76947bff8051/patches/braces-3.0.3.patch), blob `1a0f684bb519b44b5f20a19cfd104525411435d7`, limite de profondeur 64, dix tests historiques. ChatGPT a vérifié que le code amont `expand` suit aussi les liens `parent` et que **ce patch ne teste pas la cyclicité de ces liens**.
- **Échecs et limites expérimentales, rapportés par Codex et NON reproduits par ChatGPT :** `expand` bloqué par un **cycle `parent` d'AST**, timeout **2 s / sortie 124** ; expansion de faible profondeur générant **16 384 résultats** ; profondeur seule insuffisante pour borner l'effort ; motif hostile provoquant un **rejet asynchrone non géré de Chokidar** (sortie de processus 1), y compris dans une situation de surveillance avec glob fixe. **6 tests consommateurs réussis, 1 échec** lors de la recherche : cet échec est distinct des suites historiques.
- **Copie embarquée Vite :** Codex a inspecté l'archive npm Vite 8.1.6 et rapporte une **copie non patchée de `braces 3.0.3`** dans son bundle. ChatGPT **n'a pas reproduit l'inspection binaire** ; a contrôlé le code Vite 8.1.6 : `disableGlobbing: true` par défaut, non contredit par `vite.config.ts` du projet. Aucun exploit démontré de la copie embarquée par la configuration en place. Ne pas confondre existence d'octets embarqués et chemin d'exécution dangereux confirmé.
- **Autres expériences Codex, non réexécutées par ChatGPT :** archive npm officielle réconciliée par intégrité ; patch appliqué hors checkout conforme aux fichiers installés ; **764 tests amont / 764 réussis** pour l'amont, le patch et un prototype extérieur, **24 000 assertions** comparatives réussies dans leur périmètre ; **31 tests habituels du projet réussis** ; `pnpm audit` avant/après **1 HIGH, sortie 1**, production **0, sortie 0** ; audit Rust strict **sortie 1, neuf avertissements** ; installation figée, TS, ESLint, build Vite et Cargo tree réussis. Les compilations Rust debug/release et CLI Tauri **n'ont pas été relancés lors de cette recherche** ; leur [CI Rust antérieure au même SHA](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39730707512) reste verte. Android, Windows/WSL et GUI natif non testés.
- **Décision :** maintenir **QH-009 ATTÉNUÉ** et **T-002 non cochée** ; aucune migration minimale fiable ni version officielle corrigée démontrée. Une éventuelle correction des cycles `parent`, des frontières de confiance ou des rejets asynchrones relève d'une **nouvelle mission autorisée**, avec contrôles de compatibilité et conservation, sans la présenter comme une clôture officielle de la GHSA. **QH-010 reste résolu uniquement sur #183** et la sécurité/CI globales restent ouvertes.
- **Preuve de revue :** [compte rendu indépendant ChatGPT V3, avec séparation des constats vérifiés et essais Codex](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/248ad883be20b0fa915498b3825ca5143de08e40/docs/ai/REVUE_CHATGPT_V3_QH009_2026-10-22.md). Aucun prototype, sortie expérimentale brute ou nouveau test hors dépôt n'est versionné par cette mise à jour.

### Quelques diagnostics à ne pas confondre

- **Réparation ≠ fusion :** les corrections sur #183 sont sur une **PR en brouillon** et ne sont pas encore sur `main`.
- **Avis corrigé ≠ audit global réussi :** malgré h2 corrigé, `cargo audit --deny warnings` échoue encore. Malgré 26 entrées pnpm éliminées selon Codex, six entrées pnpm et les alertes `npm audit` du workflow restent distinctes.
- **Build Rust ≠ GUI/Android validés :** compilation Linux/CI réussie n'atteste ni APK, ni lancement WebKit natif, ni intégration matérielle.
- **Archives conservées ≠ exécution active :** les anciens snapshots vulnérables peuvent rester consultables historiquement sans être reliés au graphe actif.
- **État des audits ≠ état éternel :** revoir les bases de vulnérabilités, la version de Vite et les SHA à chaque mission.

## Idées et travaux prévus — distincts des incidents

Les idées restent traçables **avant implémentation**, pour éviter qu'elles se perdent dans une conversation.

| ID | Idée | Décision / état | Critère de reprise |
|---|---|---|---|
| IDÉE-001 | **`public/robots.txt`** pour le frontend Vite | **Souhait exprimé, non commencé.** Chemin Vite visé ; à confirmer selon le déploiement réel. `robots.txt` régule l'exploration, **ne rend pas une ressource confidentielle**. | Établir environnement public, politique d'indexation et domaine canonique ; puis créer/tester le fichier dans une mission distincte |
| IDÉE-002 | **`sitemap.xml`** | Piste associée à robots.txt, **non validée comme obligation**. | Confirmer URLs publiques, navigation et stratégie d'indexation avant génération |
| IDÉE-003 | Vérifier packaging Android et GUI natif | **Priorité produit**, mais preuve de compilation/usage non obtenue. | Reproduction sur cible Android et/ou environnement graphique natif approprié |
| IDÉE-004 | Fiabiliser les audits GitHub sans masquage | **Planifié, hors mission Vite.** | Couvrir pnpm audit, tests sécurité JS, CodeQL Java/Kotlin et audit Rust par changements séparés |
| IDÉE-005 | Examiner les documents historiques susceptibles de relever d'un stockage privé distinct | **Différé expressément** ; aucune suppression, déplacement ou purification automatique. | Inventaire et autorisation spécifique, sans publier ici les données privées |

## Habitudes collectives à ne pas perdre

Ce paragraphe est **un rappel**, et non une règle concurrente au contrat :

- **Une mission à la fois**, des actions concrètes limitées et, pour Codex, des prompts complets prêts à copier.
- **Langue française** pour les échanges ; commentaire technique ou README : **français puis anglais**.
- Réutiliser les solutions et rapports déjà élaborés ; **ne pas recommencer une recherche ou une installation par oubli du contexte**. Signaler explicitement quand la preuve manque.
- ChatGPT effectue **une revue GitHub indépendante** après chaque publication Codex, y compris arbres Git, code, tests et étapes réelles de CI. **Pas de fusion par automatisme.**
- Préserver les dépendances, options facultatives, anciennes variantes et toutes les archives ; toute exception explicitée et étayée.
- Pour les tâches longues en Cloud, autoriser autant que possible l'**exécution réversible et sécurisée sans interventions répétées** ; ne jamais donner une autonomie implicite pour des suppressions distantes, des fusions, des changements de licence/sécurité ou des opérations irréversibles.
- **Informer rapidement des blocages**, fournir un mini-bilan proactif et **une seule prochaine action**. Les changements de modèle ou d'effort de raisonnement se décident selon la complexité de chaque mission ; aucune configuration unique n'est universellement obligatoire.

## Modèle de nouvelle entrée (à copier à la fin du journal)

### QH-019 — [Titre descriptif] — [date]

- **Statut et périmètre :** [OUVERT / PARTIEL / RÉSOLU sur PR #… / BLOQUÉ, sans prétendre fusion]
- **Symptôme / impact :** [message d'erreur, commande, conditions, impact exact]
- **Cause :** [vérifiée avec source, ou hypothèse explicitement indiquée]
- **Tentatives et échecs :** [chronologie concise, diagnostics pertinents, pas de secrets]
- **Correction ou mitigation :** [ce qui a réellement changé, y compris limites]
- **Preuves :** [repo, PR, branche, SHA, lien de CI, cas réellement exécutés]
- **Conservation :** [fichiers historiques, options et versions non perdues]
- **Reste à résoudre :** [conditions pour changer le statut]
- **Prochain relais :** [agent destinataire et une seule action suivante]

Lorsqu'une entrée est ajoutée, actualiser sa ligne d'index au-dessus. **Ne pas transformer le présent modèle en incident réel** tant qu'il n'est pas renseigné.
