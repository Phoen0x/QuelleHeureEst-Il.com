# Notice de confidentialité et d’intégrité — édition du 27 octobre 2026

Cette notice accompagne la **correction documentaire minimale autorisée sur #188** : quatre documents modifiés et deux fichiers ajoutés, sans harmonisation générale. Elle distingue les relevés du 23 octobre 2026 de leur édition publique du 27 octobre. Les décisions techniques, dates, références, incertitudes et limites historiques sont conservées ; les citations de réponses de conversation et les attributions personnelles inutiles des passages concernés sont reformulées.

Le point de départ est #188 au SHA `202f0f7b03c74c9c00177d113361b2166c27fe9c`. Le [plan de correction soumis en #190](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/e077c8cd59d815c8c6d42fbf850f24cdd53abcb6/docs/reports/pr188-correction-plan-20261027/REPORT.md) et ses [extraits proposés](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/e077c8cd59d815c8c6d42fbf850f24cdd53abcb6/docs/reports/pr188-correction-plan-20261027/EXTRAITS_PROPOSES.md) sont des pièces antérieures de planification. Les libellés de proposition sont adaptés ici à l’édition réellement préparée et les empreintes recalculées ; les empreintes projetées du brouillon ne sont pas présentées comme des résultats effectifs.

## Périmètre et statut

Les quatre documents édités sont le [journal des décisions](JOURNAL_DECISIONS.md), l’[état de reprise](SAVE_STATE.md), le [compte rendu](COMPTE_RENDU.md) et le [README des données](data/README.md). Cette notice et le [manifeste de correction](MANIFESTE_CORRECTION_20261027.json) sont ajoutés. Les 43 lignes sources reformulées sont identifiées dans le manifeste, avec les identités et empreintes des documents avant/après, sans recopier les anciennes citations ni les valeurs personnelles.

Le README principal du dossier, `PROMPT_AUDIT_PR.md` et `INVENTAIRE_PR.md` ne sont pas harmonisés dans cette mission. Des attributions isolées et formulations historiques y restent présentes. Les patchs, variantes, autres archives et fichiers applicatifs sont inchangés. Les chemins personnels de scripts et diagnostics ailleurs dans le dépôt restent hors périmètre. Cette édition minimale ne certifie donc pas l’anonymisation de l’ensemble du dépôt.

Les constats anciens concernant les PR, les versions, les outils, les tests, les erreurs ou la CI restent **des observations datées**. Cette reformulation ne les actualise pas rétroactivement et ne valide pas leur exactitude globale. Les anciens conseils de fusion et instructions de reprise ne constituent aucune autorisation actuelle. Aucune nouvelle conclusion applicative ou de sécurité n’est déduite de cette édition.

## Conservation et risque historique accepté

**Aucune réécriture de l’historique Git n’est effectuée.** Les anciens commits restent consultables dans l’historique public et peuvent également subsister dans des PR, clones, forks, caches ou copies externes. Modifier les versions courantes ne les efface pas. Ce risque résiduel est explicitement accepté pour cette étape ; les documents secondaires et la question de l’historique public pourront faire l’objet d’une mission ultérieure, avec autorisation distincte.

Les références Git et empreintes d’origine assurent la traçabilité sans republier de copie supplémentaire des passages personnels. Les fichiers originaux ont aussi été conservés temporairement pour les contrôles ; aucun coffre privé durable ni purge externe n’est attesté. Une empreinte établit une identité d’octets, pas l’anonymat, la véracité d’un rapport ou l’authenticité rétroactive d’une collecte.

## Archive brute et anomalie de collecte

L’archive [audit-data-20261023.tar.gz](data/audit-data-20261023.tar.gz) est conservée **sans modification, recompression ni substitution** : **1 995 059 octets**, SHA-256 `84c00d03b9b53990d26abc73c999288ba704d5996a59ed74f9d37f9e3386375a`. Ses **118 fichiers réguliers** sont inventoriés avec leurs tailles, empreintes et états de parsing dans le manifeste : 116 JSON valides, un JSON invalide et un fichier texte.

Le membre `files-153.json` est **invalide comme JSON**, avec 809 994 octets. Il partage les 809 759 premiers octets de `f153-1.json` ; au décalage binaire 809759, base zéro, la fermeture finale du tableau de la page valide est remplacée par un message d’erreur du proxy. Le parseur JSON échoue au caractère 803045, ligne 1, colonne 803046 ; caractères et octets diffèrent à cause de l’encodage UTF-8. Cette observation décrit les octets ; la cause opérationnelle précise de la capture initiale n’est pas démontrée. La pièce reste une preuve d’échec de collecte et **n’est pas réparée silencieusement**.

Les trois membres séparés `f153-1.json`, `f153-2.json` et `f153-3.json` sont des tableaux JSON valides de **100 + 100 + 76 entrées**, couvrant **276 noms de fichiers distincts**. Les 276 identifiants de blobs correspondent à l’arbre Git `c47b0f38b469c66a80b177d039141fede40d5652` de #153 au SHA `0ebc167c8febf1b61752d1114f8135a59400c5f1`. Les empreintes des pages sont consignées dans le manifeste. Aucun jeu dérivé n’est substitué à une capture d’origine.

Cette correspondance étaye l’inventaire de #153, sans authentifier une réponse HTTP ancienne ni prouver que chaque conclusion historique reposait sur la bonne page. Les listes brutes ne doivent pas être déclarées toutes valides. Le caractère public des sources ne suffit pas à prouver l’absence de données sensibles.

## Vérifications et limites de cette correction

Les contrôles documentaires portent sur les sources du plan publié, les blobs Git d’origine, les quatre transformations, les empreintes avant/après, les 118 membres de l’archive, les trois pages et leurs 276 identités, les liens locaux, la confidentialité des ajouts et le périmètre des six fichiers. Le manifeste décrit les octets effectivement préparés ; il exclut son propre hachage pour éviter l’auto-référence. Le commit qui le contient et le compte rendu de publication fournissent son identité externe. La revue indépendante reste en attente.

Aucun patch archivé n’est appliqué. Aucun script actif, code applicatif, configuration, dépendance, verrou, licence, workflow, bot, protection ou politique d’audit n’est modifié. Aucun build, audit, test Rust/Web ou essai natif n’est rejoué pour cette correction documentaire. La CI éventuelle doit être examinée au SHA publié ; cette notice ne la déclare pas réussie.

**La correction n’autorise aucune fusion.** La décision pré-fusion nécessite une revue indépendante de #188 au nouveau SHA par ChatGPT V4. L’harmonisation secondaire et tout traitement historique restent hors de cette mission.
