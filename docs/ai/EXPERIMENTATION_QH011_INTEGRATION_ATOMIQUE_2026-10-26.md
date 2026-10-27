# QH-011 — Étude A : prototype d'intégration Tauri — 26 octobre 2026

## Nature et verdict historique

**Option A recommandée sous conditions ; option B générale NO-GO à ce stade.** Cette synthèse est rédigée pendant l'archivage du 27 octobre, après l'étude. Le [rapport original exact](../reports/qh011-atomic-integration-20261026/original/REPORT.md), ses [preuves et sa procédure](../reports/qh011-atomic-integration-20261026/NOTICE.md) sont conservés séparément. Aucun test ou build n'est rejoué pour cet archivage.

L'expérience étudie un **profil ACL vide et immuable** dans une copie externe de Tauri 2.11.6. Le code applicatif de #183 n'est pas intégré au prototype ni modifié. Ce n'est pas une solution générale prête à fusionner et ce n'est pas une validation de la migration Unicode. QH-011/T-003 restent PARTIELS et OUVERTS. Le [prototype Unicode antérieur](EXPERIMENTATION_QH011_UNICODE_ACL_NOGO_2026-10-26.md) conserve son NO-GO et ses deux échecs.

## Résultats à préserver distinctement

**22 cas runtime distincts réussis**, zéro échec/ignoré dans la dernière exécution, sortie 0 : **13 cas rejoués du conteneur autonome** et **neuf cas nouveaux** sur le vrai Builder et l'IPC avec MockRuntime. Le conteneur autonome sait admettre des changements dynamiques ; il n'est pas intégré à AppManager. Le profil installé les interdit volontairement. Ces deux propriétés ne sont pas interchangeables.

Les nouveaux cas vérifient : contexte vide admis ; remplacement distant rejeté avant initialisation des plugins ; remplacement vide revalidé ; scopes globaux ou orphelins rejetés ; ajout dynamique refusé avant callback ; commande locale synthétique encore utilisable après refus ; origine distante refusée ; plugin setup soumis au même contrôle. Ils ne valident pas les sept commandes réelles ou toutes les plateformes.

| Sonde de compilation séparée | Résultat historique |
|---|---|
| Jeton privé forgé | 101 / E0451, refus attendu |
| Verrou privé | 101 / E0616, refus attendu |
| __allow_command privé | 101 / E0624, refus attendu |
| Construction/remplacement brut de Context | 0, toujours compilable |

Le contrôle expérimental est **à l'installation par Builder::build**, avant création de l'autorité gérée et initialisation des plugins. Il ne rend pas impossible la construction native d'un Context brut. Le code hôte Rust demeure dans la frontière de confiance.

Échecs intermédiaires conservés : compilation 101 pour un import privé, corrigé vers tauri::ipc ; premier runtime 101 avec 21 réussites/une fixture échouée avant admission, faute de permission_sets ; fixture corrigée puis 22 réussites. Les diagnostics et avertissements sont archivés, sans transformer ces tentatives en succès.

## Versions, surface et limites

Debian 13.6 x86_64, Rust/Cargo 1.99.1 ; Tauri 2.11.6, runtime 2.11.3, build/codegen/macros 2.6.3, utils 2.9.3, URLPattern 0.3.0. Le probe active dynamic-acl et test, sans wry ; le GLib corrigé est explicitement sélectionné. Aucun verrou changé. Les opérations historiques étaient bornées : compilation 180 s, exemples 90 s chacun, runtime 30 s/CPU 10 s/1 Gio/core désactivé.

Contre la distribution officielle : quatre fichiers Tauri modifiés dans la copie (app.rs, ipc/authority.rs, ipc/mod.rs, manager/mod.rs), un module ajouté. Le corps resolve_access/deny et le fichier WebView IPC restent identiques. Les sources et différences sont des pièces inertes de diagnostic, aucun patch actif ou fork distribué.

Limites non résolues : transport codegen → runtime/cible non démontré ; marqueur et identité du matcher seulement dans un processus ; provenance release, caches typés et consommateurs plugins non qualifiés. Le profil vide contourne le besoin de transitions, il ne démontre pas leur atomicité générale. Android, Windows, macOS, GUI, release, Rust 1.90 exact et moteur Unicode non validés. Aucun audit exécuté dans cette étude ; aucune alerte déclarée résolue.

La recherche amont préalable et la comparaison des options sont conservées dans l'original et ses notes. Les méthodes d'autres projets ne sont pas présentées comme preuve d'équivalence de nos décisions ACL. La [qualification ultérieure, étude B](QUALIFICATION_QH011_CONTRAT_ACL_MINIMAL_2026-10-27.md) distingue le contrat minimal d'une interdiction de toutes capacités locales et précise la portée des artefacts ; elle ne modifie pas rétroactivement cet original.

## Conservation et relais

Parent documentaire : f2d05a7cb0e78e6a01a79b0d222c34b3d684c8a8. Code étudié : #183 f2eee4223a1ccf5b0866944580df8fd5979575dd ; main eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228 ; #187 228e36a048926d77e84c9bb47863b84d07d2b924. Les inventaires, extraits, transformations et omissions sont détaillés dans l'archive. Les 500 empreintes sources sont contrôlées, sans publier les copies complètes, caches ou binaires.

**Revue indépendante de #186 par ChatGPT V4**, sans implémentation, migration ou fusion automatique. QH-011/T-003 restent ouverts.
