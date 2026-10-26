# QH-011 — Admission atomique Tauri : archivage de faisabilité — 26 octobre 2026

## Statut et provenance

**GO sous conditions pour un prototype ultérieur d'admission atomique uniquement.** L'admission obligatoire sur toute la chaîne Tauri n'est pas démontrée. La migration Unicode n'est ni validée ni autorisée ; le prototype Unicode–ACL précédent reste **NO-GO, 15 tests réussis et deux échecs bloquants**. QH-011/T-003 restent PARTIELS et OUVERTS.

Ce document est une **synthèse écrite pendant l'archivage**, après l'étude ; il ne remplace pas son [rapport original, conservé à l'octet](../reports/qh011-atomic-admission-20261026/original/REPORT.md). Les [preuves et la procédure](../reports/qh011-atomic-admission-20261026/NOTICE.md) distinguent originaux, transformations, extractions et omissions. Aucun test Rust/Web, build, audit ou CI n'est rejoué pour cet archivage.

Références vérifiées avant préparation : main `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228`, code #183 `f2eee4223a1ccf5b0866944580df8fd5979575dd`, parent documentaire #186 `fee9020e884f7596086e169941ec36ebe6175491`, #187 `228e36a048926d77e84c9bb47863b84d07d2b924`. Cette archive est publiée uniquement sur la branche existante de #186, sans fusion.

## Ce que les sondes historiques démontrent

Environnement de l'étude : Debian 13.6 x86_64, Rust/Cargo 1.99.1. Copie externe de Tauri 2.11.6, runtime 2.11.3, build/codegen/macros 2.6.3 et tauri-utils 2.9.3 ; GLib 0.18.5 corrigé de #183 explicitement sélectionné. Ces versions proviennent des traces retrouvées, pas d'une nouvelle compilation d'archivage.

**13 tests runtime distincts réussis, zéro échec, zéro ignoré, sortie 0.** Le [journal original](../reports/qh011-atomic-admission-20261026/logs/tests.stdout) et les sources sont conservés. Le conteneur expérimental démontre :

- `ValidatedPolicy` aux champs privés ; préparation sur un état indépendant et validation hors verrou de publication.
- Contrôle du propriétaire et de la révision ; rejet des candidats périmés ou d'une autre autorité.
- Remplacement atomique sous verrou et instantanés `Arc` cohérents ; état actif conservé après erreur.
- Admission initiale et dynamique dans le conteneur expérimental, y compris effets des scopes globaux.
- Conservation du comportement historique `deny`, sans correction de son interprétation.
- Épinglage des scopes d'une requête, caches séparés et conservation d'un marqueur et du même objet de motif en mémoire.

Ces sondes utilisent de vrais types et résolutions Tauri, mais un validateur synthétique et aucun AppManager/WebView intégré. Cinq observations JSON avant/après existent ; aucune trace JSON distincte n'est fabriquée pour les huit autres tests. Les assertions et le journal les documentent. Les tests de cache utilisent des valeurs `String`, pas tous les scopes typés des plugins.

## Quatre sondes de compilation distinctes

| Sonde | Sortie originale | Interprétation |
|---|---|---|
| Fabrication externe de `ValidatedPolicy` | 101, E0451 | Refus attendu des champs privés |
| Accès externe au verrou de l'autorité après restriction | 101, E0616 | Refus attendu |
| Accès externe à `__allow_command` après restriction | 101, E0624 | Refus attendu |
| Remplacement via `Context` | 0 | Compilation réussie : **voie encore ouverte** |

Les sorties 101 ne sont pas des tests runtime échoués dissimulés, et les quatre sondes ne s'ajoutent pas aux 13 tests runtime pour produire un total artificiel de succès. Les avertissements de compilation restent visibles dans les journaux.

## Obstacles et frontière de confiance

L'activation individuelle peut être atomique sans rendre atomique un workflow de plusieurs appels. Si A est activé puis B rejeté, A reste actif. Un lot doit être préparé et activé en une fois ; les effets externes d'un handler ne sont pas annulés.

Le Manager actuel verrouille déjà les ajouts ordinaires. L'étude ne prétend pas découvrir une exposition systématique de chaque étape intermédiaire. Le défaut de cohérence à traiter est aussi entre **sélection d'une commande et consommation de ses scopes** : les lectures actuelles peuvent consulter des révisions différentes. L'instantané doit suivre l'invocation et les helpers, pas seulement l'écriture de l'autorité.

Restent non intégrés : capacités initiales/supplémentaires, codegen, installation et remplacement de Context, routes publiques d'ajout et consommateurs IPC/plugins. Le macro de commande destructure exactement `Invoke` ; son adaptation potentielle fait partie du périmètre, ainsi que `CommandItem`, `CommandScope`, `GlobalScope` et les helpers WebView. Les champs ACL publics ne sont pas des reçus scellés de validation.

Le code Rust hôte est dans la frontière de confiance ; l'ACL ne sandboxe pas un hôte hostile ou `unsafe`. Cette limite ne dispense pas les API ordinaires de faire admettre les données candidates. Restreindre les accès publics étudiés casse réellement la compilation de certains usages, même si les éléments sont `doc(hidden)` ; compatibilité des plugins non démontrée.

La validation hors verrou et la destruction de l'ancien état hors verrou réduisent certains risques, sans preuve générale d'absence d'interblocage. Désérialisation des scopes, `Drop`, caches et verrous des plugins restent à qualifier. Les données externes consultées par un validateur doivent être figées ou versionnées.

L'épinglage permet à une invocation en cours de conserver ses droits antérieurs : ce n'est pas une révocation immédiate. La politique de révocation et les effets sensibles doivent être définis explicitement.

## Transport et limites de validation

Le codegen actuel émet des tables Rust et des chaînes de motifs distants reparsées au runtime. La sonde prouve seulement un transfert possédé **dans un même processus**, conservant marqueur et identité d'objet ; ni IR portable authentifiée, ni transport build/codegen → cible, ni équivalence hôte/cible ne sont démontrés. Une empreinte auto-déclarée n'authentifie pas une politique. Versions de schéma/moteur/cible et ancrage de confiance restent à définir ; validation build puis runtime à étudier.

**Non réalisés dans l'étude :** modification de moteur Unicode, migration Cargo applicative, audit, Rust 1.90 exact, release, GUI, validations natives Android/Windows/macOS ou test complet du transport généré hôte/cible. Les résultats d'audits et campagnes précédentes restent historiques et distincts ; aucune alerte n'est déclarée supprimée par ces sondes.

## Conservation et relais

L'archive publie uniquement des documents et des pièces expérimentales inertes. Les manifestes et sources Rust portent le suffixe `.txt` ; aucun patch actif ou fork Tauri n'est ajouté au produit. Les différences étroites sont conservées comme preuve textuelle, pas comme correctif intégré. Les licences tierces accompagnant ces extraits sont préservées ; les licences du dépôt ne changent pas.

Le README et le journal sont étendus en conservant leurs octets précédents. Tous les autres blobs et modes du parent doivent être identiques ; aucun ancien diagnostic n'est remplacé. Les contrôles d'archivage sont dans [VALIDATION.json](../reports/qh011-atomic-admission-20261026/VALIDATION.json), les fichiers et identités dans [PUBLICATION.json](../reports/qh011-atomic-admission-20261026/PUBLICATION.json).

**Seule suite : revue indépendante de #186 par ChatGPT V4.** Ni l'archive ni son verdict ne constituent une autorisation d'implémentation, de migration, de fusion ou de mission suivante.
