# Registre canonique des décisions et invariants — QuelleHeureEst-Il.com

**Statut :** registre de référence proposé le **8 novembre 2026** dans une PR documentaire distincte. Les faits liés à GitHub ci-dessous constituent une **photographie datée** ; ils doivent être revérifiés au début de chaque mission. La présence de ce document dans une branche non fusionnée ne le rend pas automatiquement accessible depuis `main`.

**But :** fournir une entrée unique qui explique **ce qui a été décidé**, **pourquoi**, **ce qui reste incertain** et **où vérifier les preuves**, sans remplacer les textes historiques ou introduire de nouvelles autorisations. Les sources primaires (GitHub, fichiers versionnés et checks au SHA correspondant) priment sur ce résumé en cas d'écart.

## A. Méthode de lecture et d'actualisation

1. Lire [AGENTS.md](../../AGENTS.md), [WORKING_CONTRACT.md](WORKING_CONTRACT.md), [README.md](README.md) et [KNOWLEDGE_PRIVACY_POLICY.md](KNOWLEDGE_PRIVACY_POLICY.md), puis **ce registre** avant toute recommandation ou intervention sur les PR, la CI, les protections, les bots, les licences ou les dépendances.
2. Vérifier le **dépôt, la branche de départ, le SHA exact de `main`, la tête des PR, les règles de protection, les checks et les droits réellement disponibles**. Ne pas présenter une observation datée comme garantie actuelle.
3. Pour chaque sujet, distinguer : **invariant confirmé**, **décision validée**, **état observé**, **proposition non activée**, **hypothèse à vérifier** et **décision requise**.
4. **Ne pas confondre** possibilité technique de contourner une protection et autorisation humaine, CI verte et absence de risque, PR fusionnable techniquement et prête pour la publication.
5. En cas de désaccord entre cette page et les sources, **ne pas arbitrer silencieusement** : noter la divergence, citer les deux références et obtenir une décision si nécessaire.
6. Actualiser l'entrée concernée **lors d'un jalon important** (décision, nouvelle PR, modification de ruleset, fusion, changement d'état de sécurité) uniquement dans une branche et un périmètre autorisés. Conserver les décisions anciennes sous forme datée et les liens vers leurs preuves ; ne pas réécrire les comptes rendus d'origine.
7. À chaque reprise, présenter en quelques lignes les écarts de SHA/statut, les risques et **une seule prochaine action**. Aucun mécanisme de synchronisation automatique ni de mémoire exhaustive n'est implicite.

## B. Invariants permanents, sans dérogation implicite

| Identifiant | Règle | Source d'autorité |
|---|---|---|
| INV-001 | **Conservation historique :** ne pas supprimer/écraser les variantes, commentaires utiles, scripts historiques, dépendances optionnelles, code fantôme ou preuves ; conserver le code neutralisé hors des artefacts de production. | [AGENTS.md](../../AGENTS.md), [contrat](WORKING_CONTRACT.md) |
| INV-002 | **Confidentialité :** aucun secret, donnée personnelle, conversation intégrale ou information d'un dépôt privé n'est copié ici ; retenir les décisions techniques impersonnelles, pas leurs causes personnelles. | [Politique de confidentialité](KNOWLEDGE_PRIVACY_POLICY.md) |
| INV-003 | **Gouvernance :** ChatGPT coordonne et contrôle les missions Codex ; Codex peut réaliser des missions bornées ; revue indépendante après publication ; une seule écriture par branche/périmètre. **Aucune fusion, suppression, fermeture de PR, réécriture d'historique, activation de bot, changement de licence ou de protection sans autorisation explicite.** | [Contrat](WORKING_CONTRACT.md), [AGENTS.md](../../AGENTS.md) |
| INV-004 | **Preuves :** citer SHA, PR, tests, erreurs, skips et limites ; les tests annoncés ne remplacent pas leur vérification. Les contrôles d'intégrité documentaire ne prouvent pas un build applicatif. | [Contrat](WORKING_CONTRACT.md), [journal](JOURNAL_DE_BORD_TECHNIQUE.md) |
| INV-005 | **Recherche amont préalable** avant correctif complexe, migration, fork, expérimentation de sécurité ou prototype : documentations officielles, correctifs, advisories, versions, issues et comparaison des stratégies. | [AGENTS.md](../../AGENTS.md), [contrat](WORKING_CONTRACT.md) |
| INV-006 | **Produit :** Android prioritaire, Rust/Tauri 2, logique métier locale, mode offline-first cible, français par défaut, langues sélectionnables, permissions minimales, compatibilité GrapheneOS visée. Distinguer ambition et fonctionnalités testées. | [AGENTS.md](../../AGENTS.md), [roadmap](../ROADMAP.md) |
| INV-007 | **Licence :** état effectif « tous droits réservés » ; ne pas la transformer en licence open source ou commerciale par simple mise à jour de documentation. Les formulations historiques contradictoires sont un sujet juridique/documentaire distinct. | [LICENSE](../../LICENSE), [roadmap](../ROADMAP.md) |

## C. Règles GitHub, approbation et contournement

**Observation API GitHub du 8 novembre 2026 :** `main` au SHA `8a1505d78452aae2bde18d6693e97bcb9b3793e8`, protégé.

### GIT-001 — ÆgisRuleSet

- [Règle GitHub ÆgisRuleSet](https://github.com/Phoen0x/QuelleHeureEst-Il.com/rules/16192629), **active** sur `refs/heads/main` au relevé ; impose la voie PR pour les contributeurs ordinaires, **une approbation**, la révocation des approbations obsolètes après push, et des restrictions contre suppression et historique non fast-forward.
- Le ruleset comporte une **équipe bénéficiant d'un contournement `bypass_mode: always`**. La connexion GitHub utilisée pour ce relevé **ne peut pas confirmer l'appartenance effective d'un compte à l'équipe**. L'autorisation de bypass déclarée par la responsable du projet est **compatible** avec la configuration ; ne pas la transformer en preuve indépendante d'appartenance.
- **Aucun check de statut obligatoire n'est déclaré dans ce ruleset** au relevé. Des jobs rouges peuvent donc être un sujet d'analyse de qualité et de sécurité sans être une condition de branche explicitement requise par **ce** ruleset. Vérifier d'autres protections/règles applicables si l'accès le permet ; l'API de protection classique peut retourner 403 à l'intégration.
- Le bypass est une **faculté d'exception** et non une méthode normale de validation : conserver revue indépendante, analyse de risques et décision explicite pour chaque fusion. **Ne pas confondre « bypass de règles » et `git push --force`.**

### GIT-002 — Approbation automatique existante

- Le [workflow `.github/workflows/auto-approve.yml`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/main/.github/workflows/auto-approve.yml) prévoit une **approbation croisée** entre comptes pré-autorisés, conditionnée notamment à **CodeQL** et à l'absence de certains commits Bolt/StackBlitz. Cela n'est ni une nouvelle fonctionnalité à créer ni une autorisation d'assouplir cette politique.
- Pour [#188](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/188#issuecomment-6361970869), l'approbation automatique a été **refusée à cause de CodeQL Java/Kotlin**. Ce refus n'établit pas l'absence de droits de bypass ni le caractère obligatoire de CodeQL dans ÆgisRuleSet.
- Une approbation technique générée par un workflow **ne remplace pas** la revue indépendante et la décision de la responsable ; ne pas modifier ni contourner ce workflow sans mission et autorisation séparées.

### GIT-003 — Revue IA automatique sélective (proposition non activée)

- Objectif : Codex Code Review analyse les PR **sauf celles réellement créées par ChatGPT ou Codex**, mais analyse les PR humaines simplement modifiées par ces agents ; en cas de provenance incertaine, analyser. Conserver les protections et audits pour toutes les PR.
- Signatures proposées : `AI-Origin: openai/chatgpt` / `AI-Agent: Pantoine Damiel IV` et `AI-Origin: openai/codex` / `AI-Agent: Matthieuh Sonnet VI`. **Déclaratives et falsifiables**, insuffisantes seules pour une exclusion fiable.
- Vérifier les possibilités de filtrage **avant consommation de quota** et les déclencheurs réellement pris en charge. Ne pas présumer qu'un commentaire de bot déclenche Codex. Comparer solutions natives, déclenchement manuel, filtres externes et coût ; tester sur dépôt de démonstration avec accord. **Aucune activation Work/Codex Code Review, aucun changement des workflows ou des protections n'est autorisé par le présent registre.**
- Une règle intitulée « Code Quality Copilot review for default branch » était **désactivée** au relevé. **Copilot Code Review et Codex Code Review sont des dispositifs différents** ; ne pas déduire l'état de l'un de l'autre.

## D. Pourquoi les chantiers existent et où reprendre

| ID | Portée et raison d'être | Dernier constat / décision | Références |
|---|---|---|---|
| CH-153 | **Phase 1 de fiabilisation CI** : réparer le graphe pnpm et les verrous reproductibles, permettre les builds Tauri/Rust, exécuter réellement les tests/audits, améliorer les scanners sans masquer la dette, préserver graphes et archives. **Ce n'est pas une PR « rendre les checks verts à tout prix ».** | [#153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153) ouverte, non fusionnée, HEAD `0ebc167c8febf1b61752d1114f8135a59400c5f1`. Des avis de sécurité/licences et conditions de validation restent ouverts ; ne pas fusionner dans l'urgence pour rendre une autre PR documentaire fusionnable. | [Index #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/reports/pr153-relais-20261014/README.md), [CI_SETUP](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/CI_SETUP.md) |
| CH-162 | Cohabitation Dependabot/Renovate, prévention des doublons et suppression de variantes/branches ; séparation versions et sécurité. | [#162](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/162) ouverte, non fusionnée. Propositions documentées, **non activées sur `main`** ; vérification des workers hébergés et de la coordination non achevée. | [Proposition #162](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/162), [contrat](WORKING_CONTRACT.md) |
| CH-183 | Déblocages applicatifs, Tauri, Rust/HTTP, Vite/JS, Tokio/GLib, dépendances et sécurité ; examen des impacts multi-plateformes, licences et conservation. | [#183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183) ouverte, non fusionnée, HEAD `f2eee4223a1ccf5b0866944580df8fd5979575dd` ; audit strict et validations natives **non pleinement satisfaits** au relevé. | [Journal technique](JOURNAL_DE_BORD_TECHNIQUE.md), [backlog](../TODO_TECHNIQUE.md) |
| CH-188 | Audit documentaire/historique des PR et conservation des preuves ; correction minimale des quatre documents à rendre impersonnels + notice et manifeste. | [#188](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/188) ouverte, non fusionnée, HEAD `c96ba0980f7af58a4bd251efad5cc86d0d0d8dc7`. **Revue documentaire indépendante ChatGPT : GO sous conditions**, avec vérifications des empreintes des documents, de l'identité Git de l'archive et des liens ; les 118 membres ne sont **pas** tous revérifiés indépendamment. Historique public et documents secondaires **délibérément différés**, non supprimés. La description de PR a été actualisée le 8 novembre 2026, sans changement de commit. | [#188](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/188), [plan #190](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/190) |
| CH-190 | Conserver le plan de correction et les preuves préparatoires de #188. | [#190](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/190) ouverte **en brouillon**, non fusionnée ; décider de son traitement après #188, sans effacer l'historique. | [#190](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/190) |
| CH-191 | Archiver les relais ChatGPT, la revue de confidentialité et l'inventaire fonctionnel expurgés. | [#191](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/191) ouverte, non fusionnée ; éviter les doublons. | [#191](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/191) |
| CH-192 | Revue externe et vérification de remarques sur la documentation/architecture. | [#192](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/192) ouverte **en brouillon**, non fusionnée. Conserver comme avis distinct, pas comme décision déjà implémentée. | [#192](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/192) |

**CI / #188 :** les jobs Rust build, CodeQL Java/Kotlin, APIsec et SonarCloud échouent déjà sur la base `main` au relevé. Exemples d'origine vérifiée dans les logs : feature Tauri 1 `shell-open` invalide sous Tauri 2 ; aucune source Java/Kotlin analysable ; SonarCloud non renseigné ; APIsec visant l'exemple `VAmPI` sans authentification exploitable. Le job Nexploit était annulé, cause précise non prouvée. #153 et #183 contiennent **des correctifs candidats en branche**, non déployés sur `main`. **Ne pas « réparer » cette CI en désactivant des alertes, ni confondre corrections documentaires de #188 et validation complète de l'application.**

## E. Reprise et arbitrages restants

1. **Avant une fusion documentaire :** relire le diff et le HEAD courants, les notices de confidentialité, les preuves et la protection en vigueur. Les PR documentaires peuvent être évaluées **séparément** du chantier technique #153, sans prétendre que les CI échouées sont acceptables globalement. Un bypass éventuellement autorisé doit rester une décision humaine explicite, motivée et traçable.
2. **Avant une fusion technique (#153/#183) :** rapprocher les variantes et chevauchements, refaire installations reproductibles, tests, audits/licences et contrôles de conservation au SHA retenu ; ne jamais se satisfaire d'une baisse artificielle des alertes.
3. **Avant d'activer des bots ou Code Review :** étude de faisabilité, provenance des PR, coûts, sécurité des workflows, tests de cas négatifs et consentement explicite. Ne pas présumer de l'activation ou de la configuration actuelles sans vérification.
4. **Confidentialité différée :** trois documents secondaires liés à #188, chemins personnels repérés ailleurs, anciennes versions accessibles et examen de l'historique. Aucun traitement rétroactif autorisé ici.
5. **Survie des décisions :** lors d'un incident ou arbitrage ultérieur, mettre à jour le [journal des incidents](JOURNAL_DE_BORD_TECHNIQUE.md) et ajouter une entrée sourcée ici si elle affecte durablement une règle ou la reprise ; **ne pas supprimer l'ancien état**.

**Prochaine étape conseillée au 8 novembre 2026 :** faire revoir indépendamment **cette PR documentaire de registre**, vérifier les liens/versions et obtenir une autorisation humaine distincte avant sa fusion sur `main`. Les décisions de fusion de #188/#190/#191 restent distinctes.

**Limites de preuve :** inventaire ciblé des sources accessibles ; pas d'audit exhaustif de chaque conversation, dépôt, artifact, archive binaire, protection non visible par l'intégration ou état interne des services tiers. Aucun test applicatif, build, expérimentation de bypass ni essai d'activation Codex/Work réalisé par ce registre.

## F. Mise à jour de classement — 8 novembre 2026 (après le relevé initial)

**Changement de métadonnées de PR effectué avec autorisation explicite, sans nouveau commit sur leurs branches :**

- [#162](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/162), [#170](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/170), [#178](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/178) et [#179](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/179) : **converties en brouillon** pour correspondre à leurs travaux non terminés ou à leurs descriptions mentionnant un brouillon. Aucune de leurs branches n'a été synchronisée ou fusionnée.
- [#192](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/192) : **passée en Ready for review** comme rapport documentaire achevé ; cela ne vaut **pas** autorisation de fusion ni validation automatique de ses liens externes.
- [#188](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/188) : branche **en retard sur `main`** mais sans conflit signalé ; ne pas créer un merge de synchronisation qui invaliderait les preuves au SHA contrôlé sans nécessité explicite.
- Les autres PR gardent leur état, notamment [#190](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/190) en brouillon et [#191](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/191)/[#193](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/193) ouvertes pour revue. **Aucune fusion et aucun bypass exécutés durant ce reclassement.**

Les mentions plus haut (« #162 ouverte », « #192 en brouillon ») sont des **photographies prises avant ce reclassement** et restent conservées à dessein. Pour l'état courant, consulter l'API GitHub plutôt que ces observations datées.
