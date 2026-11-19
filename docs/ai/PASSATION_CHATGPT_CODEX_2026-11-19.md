# Passation publique ChatGPT / Codex — QuelleHeureEst-Il.com — 19 novembre 2026

**Nature :** photographie technique datée, publiable et expurgée. **Statut : PR documentaire en brouillon, non fusionnée.** Cette passation ne contient ni conversation privée, ni identifiant de dossier Google Drive, ni secret. Les rapports historiques restent intacts ; revérifier tous les HEAD et journaux à chaque reprise.

## 1. Autorité et méthodes

- Dépôt de référence : `Phoen0x/QuelleHeureEst-Il.com`. `main` observée au commit `ac5ea3a04b721a7f4071cd375708fc9bef0a85a6`, le 19 novembre 2026.
- Ordre de lecture obligatoire : `AGENTS.md`, `docs/ai/WORKING_CONTRACT.md`, `docs/ai/README.md`, `docs/ai/KNOWLEDGE_PRIVACY_POLICY.md`, `docs/ai/REGISTRE_DECISIONS_ET_INVARIANTS.md`, `docs/ai/JOURNAL_DE_BORD_TECHNIQUE.md`, puis les relais et les rapports des PR concernés.
- L'utilisatrice arbitre les actions sensibles et toute fusion. ChatGPT orchestre la recherche préalable et effectue la revue indépendante au SHA exact. Codex réalise uniquement les missions bornées, en branches dédiées, et publie en brouillon sans fusion.
- Une seule écriture concurrente par périmètre. Ne pas lancer de nouvel agent écrivain sur le verrou Cargo, les gardes ou les branches de la chaîne pendant une mission active. Préserver les commentaires, configurations désactivées, code fantôme, scripts Windows, variantes, versions et archives. Ne pas masquer un scanner ou contourner les protections pour obtenir un statut vert.
- Langue de conversation et des prompts : français. Commentaires techniques du code et README : français puis anglais. Les nouveaux logiciels visent une interface multilingue sélectionnable, français par défaut.
- Avant correction complexe, mise à jour, sécurité ou prototype : comparer la documentation officielle, les releases, avis et correctifs amont, issues/PR, retours techniques, compatibilités MSRV/plateformes et limites ; privilégier le correctif minimal éprouvé.
- Configuration Codex de travail demandée au relevé : GPT-6.1 Sol, réflexion élevée, vitesse Standard/Normale ; mode Rapide suspendu et Ultrarapide exclu pour tous les modèles. Les valeurs réellement disponibles doivent être confirmées dans l'outil, jamais inventées.
- La [politique de stockage et de publication](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/201) est en brouillon : Drive constitue le stockage **privé** centralisé du projet, GitHub reste la source de vérité versionnée pour les faits techniques **publiables**. Aucun lien/identifiant de Drive privé ne doit être copié dans ce fichier.

## 2. Chaîne de PR techniques : état du 19 novembre 2026

| PR | Objet | HEAD constaté | Base / état |
| --- | --- | --- | --- |
| [#183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183) | HTTP/2, JS, Tokio, Tauri 2.11 et mesures de sécurité | `f2eee4223a1ccf5b0866944580df8fd5979575dd` | base `main`, ouverte |
| [#194](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/194) | GLib : conversion `Slice` vide en `PtrSlice` sûre | `d35eb03ff7e63a77fcc1094a9292b87992e3337d` | base #183, brouillon |
| [#197](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/197) | SQLite embarquée / RUSTSEC-2026-0459 | `20825fc01d4f7fd03239093feacf26863ed65b3f` | base #194, brouillon |
| [#198](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/198) | Gardes Python : rejet de `-O` / `-OO` | `bc3d54bae109bd4fd53e2bf394934d0e0645a9bf` | base #197, brouillon |
| [#199](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/199) | Restaurer les docstrings et l'authentification historique | `86aae25c0be8479e2ffbfa7b09254d4b0c9810b6` | base #198, brouillon |
| [#200](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/200) | `rustix 1.1.5 → 1.1.6` / RUSTSEC-2026-0486 | `15538878281d2cfad14389ef634551218192e2c6` | base #199, brouillon |

**Important :** la PR #200 a été publiée le 19 novembre. Le rapport Codex et les preuves sont accessibles dans [le rapport rustix](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/15538878281d2cfad14389ef634551218192e2c6/docs/reports/rustix-20261119.md) et [ses preuves](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/15538878281d2cfad14389ef634551218192e2c6/docs/reports/rustix-20261119-evidence.json). **La revue indépendante ChatGPT de #200 reste à réaliser.** Le `GO pour revue indépendante` écrit par Codex ne vaut ni revue effectuée ni autorisation de fusion.

D'après les résultats **déclarés par Codex**, la transformation finale de `Cargo.lock` ne modifie que la version et le checksum de `rustix`, `tempfile 3.27.0` est conservé, 111 cas de gardes/mutations réussissent (92 hérités + 19 nouveaux), 19 tests Rust distincts par profil debug/release passent et trois sondes ciblées passent. Ces résultats locaux ne sont **pas réexécutés indépendamment** au moment de ce relais. L'audit strict comparable demeure en échec : 12 → 11 avertissements, zéro vulnérabilité classée, suppression signalée de l'avis rustix uniquement ; les trois nouveaux avis chrono/chrono-tz précèdent cette migration. Aucune validation Windows/macOS native, APK/AAB, GUI, MSRV exact n'est revendiquée.

La CI distante de #200 affiche **30 checks réussis et deux échecs CodeQL Java/Kotlin** au relevé. Certaines étapes Rust/audit/build échouent *à l'intérieur de jobs pourtant réussis* ; ne pas interpréter 30/32 comme une CI réellement verte. La PR #200 reste **NO-GO de fusion tant que la revue indépendante et les autres prérequis ne sont pas satisfaits**.

## 3. Documents de gouvernance et relais

- [#195](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/195) : politique des modèles/réflexion/vitesse, brouillon non fusionné, HEAD `06190945ef5c92f6e49fd00c616505d3200f343c`.
- [#196](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/196) : relais technique public du 11 novembre, brouillon non fusionné, HEAD `e67d7c3d66fc3069b1c1bab1c65a1b87b45e6c56`. Le présent document le **complète** sans le réécrire.
- [#201](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/201) : dossier racine Google Drive unique + source de vérité GitHub publique, brouillon non fusionné, HEAD `74359487bfeb1ca4730d1abd2bf3643db5a658e4`.
- [#153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153) : proposition d'audit/fiabilisation profonde non à intégrer en bloc sans arbitrage. Les écarts GLib, URLPattern/Unicode et verrous doivent rester explicitement comparés.
- [#188](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/188), [#191](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/191), [#192](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/192), [#193](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/193) : fusionnées le 8 novembre 2026, ne pas répéter les anciens rapports affirmant qu'elles étaient ouvertes.
- Les autres PR Renovate/Dependabot et les propositions #162/#170 sont des chantiers distincts ; leurs nouveaux HEAD ne doivent pas être intégrés dans la chaîne ci-dessus sans qualification.

## 4. Incidents et priorités de reprise

**Priorité immédiate : contre-expertise indépendante de #200** au SHA publié : arbre et modes Git, inventaire 335 fichiers, archives de trois originaux, une seule identité `rustix` modifiée, checksum officiel, provenance, graphes/features, tests réellement déclarés et logs des jobs CI. Faire une revue en lecture seule. En cas de défaut, préparer une mission Codex minimaliste et distincte ; aucune fusion.

**Après cette revue : QH-012, mission distincte**, portant sur la fiabilité de la CI et ses faux verts : `continue-on-error`, bibliothèques GLib/GIO/GObject dans les jobs Linux, `npm audit` au lieu d'une stratégie compatible pnpm, cargo-deny et arguments invalides, CodeQL Java/Kotlin sans sources, configuration scanner et restitution des statuts PASS/FAIL/SKIPPED/NOT_CONFIGURED. Ne pas supprimer un scanner, désactiver un check, changer protections/rulesets ou mélanger ce chantier au correctif rustix. Réutiliser les diagnostics et alternatives de #153, dont les résultats historiques ne valent pas validation du HEAD courant.

**Autres travaux conservés :** QH-009 `braces` ; QH-011 Unicode/URLPattern/ACL et avertissements GLib ; dépendances `unic-*` et `chrono`/timezone ; maintien des versions désactivées, flux Android/GrapheneOS, reproductibilité et sûreté. Ne pas considérer ces questions résolues par une publication partielle.

## 5. Continuité privée (sans données privées dans le dépôt)

Le projet dispose d'un **dossier Google Drive privé unique**, avec index de liens internes, archives de conversation datées et sauvegardes ZIP. Les archives du 11 novembre et du 19 novembre demeurent distinctes et préservées. Un brouillon Gmail d'index privé daté du 11 novembre existe ; il n'a pas été envoyé. Son contenu est daté et ne doit pas être présenté comme un inventaire à jour après #200/#201. Ne pas exposer ici les liens/IDs privés ni exiger de l'utilisatrice une copie que des outils autorisés peuvent consulter.

Les archives privées sont des **synthèses structurées de contenu accessible**, et non un export complet et littéral de toutes les conversations ChatGPT/Codex, données Cloud, messages de sous-agents ou logs non conservés. À la clôture d'une session Codex encore ouverte, obtenir un inventaire final des décisions, essais, branches, SHA et limites non déjà déposés ; comparer avant d'ajouter du contenu, ne pas écraser les relais anciens.

## 6. Consignes de passage à ChatGPT et Codex

**Nouvelle conversation ChatGPT :** partir de ce document public au SHA précis, consulter les règles canoniques et les PR #195/#196/#201 lorsqu'elles ne sont pas fusionnées, puis les sources exactes de #200 ; interroger GitHub en direct avant toute recommandation. Procéder à une revue indépendante **sans écriture** de #200. Consigner les conclusions dans un relais technique publiable séparé si elles matérialisent de nouvelles décisions et conserver le contexte privé dans Drive uniquement.

**Nouvelle session Codex :** ne pas supposer avoir hérité de la mémoire de l'ancienne session ou de l'intégralité des échanges. Lire `AGENTS.md`, le contrat, le registre, l'index IA et ce relais sur sa PR ; vérifier les branches et SHA. Ne commencer **aucune nouvelle correction** tant que ChatGPT n'a pas rendu son audit #200 et que l'utilisatrice n'a pas validé le périmètre d'une nouvelle mission. Aucune fusion, fermeture ou réécriture de PR. Remettre en fin de mission l'URL, base/HEAD, tests/résultats exacts, preuves, risques et destinataire du relais.

## 7. Critères d'une passation exploitable

- Tous les documents publics sont accessibles à leur SHA/PR et leur statut fusionné/non fusionné est indiqué.
- Les archives privées sont disponibles dans leur dossier autorisé et le pointeur Gmail est explicitement qualifié de non envoyé.
- Les résultats Codex et leur revue indépendante sont **clairement distingués**.
- Les modifications techniques et la gouvernance ne sont pas engagées automatiquement ; une seule prochaine action humaine est proposée.
- **Prochaine action :** revue indépendante ChatGPT de la PR #200 au SHA `15538878281d2cfad14389ef634551218192e2c6`.

*Cette passation complète les précédentes sans requalifier rétroactivement leurs dates ni autoriser de fusion.*
