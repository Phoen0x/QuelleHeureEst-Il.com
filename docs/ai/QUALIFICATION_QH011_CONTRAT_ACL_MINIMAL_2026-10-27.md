# QH-011 — Étude B : qualification du contrat ACL minimal — 27 octobre 2026

## Statut et provenance

**GO sous conditions pour cadrer un garde applicatif au build/démarrage sans fork Tauri.** Il ne s'agit ni d'une adoption fonctionnelle définitive, ni d'une validation Unicode, ni d'une autorisation d'implémentation. Cette synthèse est écrite pendant l'archivage ; le [rapport original exact](../reports/qh011-acl-contract-20261027/original/REPORT.md) et les [preuves statiques](../reports/qh011-acl-contract-20261027/NOTICE.md) restent distincts de l'[étude A expérimentale](EXPERIMENTATION_QH011_INTEGRATION_ATOMIQUE_2026-10-26.md).

**Aucun nouveau test Rust, Web, build, audit ou essai natif pendant la qualification.** Les contrôles statiques ont bien été exécutés ; ce ne sont pas des tests applicatifs. Aucun de ces contrôles n'est rejoué par la mission d'archivage, qui n'en vérifie que les octets et la cohérence.

## Constats et distinctions obligatoires

- Aucune capacité distante déclarée ni appel d'ajout dynamique trouvé dans les chemins actifs examinés. Cela ne prouve pas un abandon de besoin futur, ni une absence de risque local.
- Sept commandes Rust restent enregistrées : greet, search_location, get_weather, get_air_quality, get_pollen, get_cached_location, cache_location. Leurs effets réseau et cache doivent être préservés.
- Analyse AST de **19 fichiers**, 16 modules atteignables par imports runtime depuis main.tsx ; **six appels invoke** dans services/tauri.ts, actuellement non importé depuis cette entrée ; aucun import dynamique trouvé. Aucun fichier n'est désigné supprimable par ce résultat.
- Le parcours UI relié utilise fetch vers les données publiques et localStorage. Une réponse JSON distante n'est pas une WebView distante autorisée à appeler le backend.
- **dynamic-acl est compilé par défaut** dans Tauri 2.11.6, malgré features=[] côté application ; aucune désactivation proposée ou effectuée.
- **capabilities: [] n'interdit pas les fichiers de capacités** : get_capabilities sélectionne alors les fichiers, puis ajoute d'éventuelles capacités supplémentaires. Le capabilities.json historique seul ne certifie pas le Context final après combinaison inline/config/suppléments.
- Capacités locales statiques, ACL distantes et mutations runtime sont trois catégories différentes. Le contrat minimal peut conserver des permissions locales statiques explicitement revues. Une demande de permission Android à l'OS n'est pas automatiquement un ajout dynamique d'ACL Tauri.

Les sources du projet et les anciens artefacts indiquent un état vide attendu, mais aucun nouveau Context final ni aucune WebView native n'est validé. La nuance sur capabilities.json est une précision de l'étude B ; les textes de l'étude A et des anciennes archives restent intacts.

## Comparaison conservée des quatre approches

| Approche | Conclusion de la qualification |
|---|---|
| Configuration seule | Reflète le présent mais ne contraint pas durablement les appels natifs ou configurations futures ; insuffisante seule |
| Validation applicative build/démarrage | Préférée comme solution minimale sous frontière hôte de confiance ; entrées combinées, commandes, plugins et point d'installation à contrôler |
| Admission interne/scellement du profil vide | Plus restrictive que le contrat, maintenance et API à qualifier ; nécessité non démontrée pour l'application actuelle |
| Maintien temporaire des dépendances | État à conserver en attendant décision et preuves ; ne corrige aucune alerte par lui-même |

Sans patch Tauri, aucun wrapper n'intercepte universellement Manager::add_capability, les accès directs à RuntimeAuthority, le remplacement Context ou les accès natifs génériques au verrou. Le code Rust hôte reste de confiance ; le garde doit annoncer cette limite. Le contrat doit aussi contrôler le registre de commandes : une nouvelle commande locale pourrait élargir les droits sans changer remote.urls.

## Risques, avenir et plateformes

CSP null reste un risque distinct : l'absence de droits distants ne neutralise pas un contenu local compromis. Aucun exploit du produit n'est annoncé. Les variantes historiques Tauri 1/shell-open et les anciennes résolutions restent conservées sans réactivation. Android/GrapheneOS, le backend Rust/offline-first, cache durable, exports, notifications, géolocalisation et autres cibles demeurent des besoins ou pistes à qualifier, pas des fonctionnalités abandonnées. Certaines peuvent utiliser des permissions locales statiques ; leur réalisation exacte exige une décision ultérieure.

Douze métadonnées historiques (défaut/all-features, six cibles) ont été inspectées, sans nouvelle résolution ni compilation : Linux 373/376 nœuds ; Android 326/329 ; Windows 341/344 ; macOS 339/341 ; iOS 330/332 ; wasm 280/283. Ce sont des graphes, pas des validations natives. Les anciens résultats MockRuntime de l'étude A ne deviennent pas une validation des sept handlers réels. Aucun Android, Windows, macOS, iOS ou GUI natif qualifié ici.

Environnement de la qualification : Debian 13.6, Node 24.19.0, versions Rust/Cargo 1.99.1 lues seulement. Première tentative AST sortie 127 (ancien chemin Node absent), puis Node disponible utilisé, sortie 0, sans installation. Les preuves des commandes terminal n'ont pas toutes été émises en journaux autonomes : rapport/verification.json les consignent ; aucune sortie brute manquante n'est reconstruite.

## Conservation et décision

Les sept empreintes du manifeste source sont vérifiées ; les fichiers source et résultats AST, inventaires et versions sont archivés avec provenance. Le script est conservé à l'octet comme texte inerte ; il contient un chemin technique générique dont l'adaptation doit être explicite lors d'une reproduction. Les 500 empreintes de l'étude A vérifiées par B ne sont pas 500 tests.

Références : main eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228 ; #183 f2eee4223a1ccf5b0866944580df8fd5979575dd ; #186 f2d05a7cb0e78e6a01a79b0d222c34b3d684c8a8 ; #187 228e36a048926d77e84c9bb47863b84d07d2b924. Aucun changement applicatif, verrou, configuration, licence, règle d'audit, CI ou comportement deny. QH-011/T-003 restent PARTIELS et OUVERTS ; le NO-GO Unicode n'est pas levé.

**Prochaine action unique : revue indépendante de #186 par ChatGPT V4.** Aucune nouvelle expérience, implémentation ou migration ne découle de cet archivage.
