# Archive distincte B — Contrat ACL minimal — 27 octobre 2026

[Synthèse d'archivage](../../ai/QUALIFICATION_QH011_CONTRAT_ACL_MINIMAL_2026-10-27.md) et [rapport original exact](original/REPORT.md). Ce diagnostic statique est distinct du [prototype de l'étude A](../qh011-atomic-integration-20261026/NOTICE.md).

## Résultats et pièces

**GO sous conditions pour cadrer un garde build/démarrage sans fork**, pas adoption définitive ni migration Unicode. Aucun test Rust, build, audit, essai natif ou rejeu de la suite A pendant cette qualification. Les opérations statiques existaient bien : AST de 19 fichiers/16 modules runtime, six appels invoke dans le wrapper non importé, comparaisons et inventaires. Sept commandes Rust à préserver, fetch/localStorage dans le parcours UI. Première tentative Node sortie 127, autre chemin Node 24.19.0 disponible ensuite utilisé, sortie 0. Aucun outil installé.

- original/REPORT.md et original/EVIDENCE_SHA256.json : octets exacts.
- historical-scripts/frontend-inventory.cjs.txt : script AST original exact, inerte, avec chemin technique générique. Aucun build ni exécution du frontend n'est effectué par sa logique.
- records : sorties AST, inventaires, graphes historiques, vérifications et références. Les racines machine sont explicitement remplacées ; [archive-provenance.json](archive-provenance.json) conserve hashes avant/après.
- [source-inventory.json](source-inventory.json) couvre les sept entrées sources toutes retrouvées et vérifiées. Le manifeste s'exclut lui-même ; il n'est pas une huitième preuve expérimentale.

Le script et les originaux ne sont pas transformés silencieusement. Les sept données sources ont une représentation d'archive ; certaines restent transformées, pas publiées à l'octet. Les sorties terminal brutes des vérifications de versions et de la première erreur Node n'ont pas été émises en fichiers autonomes dans le dossier : rapport et verification.json les consignent. Elles ne sont pas inventées ici. Les métadonnées de plateformes référencent les graphes historiques de la première étude Unicode ; elles ne prouvent ni compilation croisée ni exécution native.

## Limites à conserver

dynamic-acl compilé n'est pas dynamic-acl utilisé. capabilities: [] sélectionne potentiellement les fichiers ; capabilities.json provenant des fichiers ne certifie pas le Context final après inline/configuration/suppléments. La qualification conserve les capacités locales statiques futures comme possibilité soumise à accord, sans les assimiler à des ACL distantes ou mutations dynamiques. Les permissions demandées à l'OS Android sont une autre catégorie.

Le garde applicatif proposé suppose l'hôte Rust de confiance et n'intercepte pas toutes les API natives publiques. CSP null et les droits des commandes locales restent des risques distincts. Android/offline-first, plugins et variantes historiques ne sont pas abandonnés ; aucun Android/Windows/macOS/iOS/GUI n'est validé. QH-011/T-003 restent ouverts et le prototype Unicode précédent reste NO-GO.

## Reproduction statique ultérieure — non exécutée ici

1. Lire les références immuables du rapport. Obtenir une copie externe de #183 f2eee4223a1ccf5b0866944580df8fd5979575dd ; ne modifier aucun original. Ne pas substituer l'actuel main sans requalification.
2. Préparer Node 24.19.0 et les dépendances figées déjà disponibles du projet. Le TypeScript effectivement chargé est indiqué dans records/frontend-inventory.json. Aucune installation ou réinstallation n'est exécutée pendant l'archivage.
3. Copier le script inerte vers un dossier extérieur ; adapter explicitement la constante root pour cette copie du projet, sans modifier le script d'archive. Il écrit son résultat à côté de lui-même. Exécuter avec borne murale 20 s et --max-old-space-size=128. Il ne charge que le parseur TypeScript, n'exécute pas l'application et ne compile aucun fichier.
4. Comparer les 19 sources, les six appels et l'absence d'import du wrapper depuis main.tsx à records/frontend-inventory.json. Les modules de types exclus du graphe runtime ne sont pas déclarés supprimables.
5. Vérifier les configs, sources et hashes de #183 listés dans records/inventory.json. Les graphes de records/platforms.json sont historiques ; une nouvelle résolution Cargo serait une opération distincte, non nécessaire pour vérifier cette archive. Les anciens graphes restent dans [l'archive Unicode](../qh011-unicode-acl-20261026/NOTICE.md).

Cette procédure est documentée, non rejouée dans un environnement neuf ; elle ne remplace aucun test de fonctionnalité native. Aucune nouvelle source de données personnelle, position réelle ou configuration réseau n'est nécessaire.

## Contrôles documentaires

python3 verify.py vérifie uniquement les empreintes, provenance et comptages archivés. [MANIFEST.json](MANIFEST.json), [PUBLICATION.json](PUBLICATION.json) et [VALIDATION.json](VALIDATION.json) décrivent les contrôles de cette publication. Les rapports originaux sont conservés séparément des deux synthèses nouvelles. Aucune implémentation ou mission suivante automatique ; revue indépendante par ChatGPT V4.
