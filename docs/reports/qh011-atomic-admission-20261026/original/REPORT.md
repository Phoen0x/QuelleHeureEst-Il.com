# QH-011 — Faisabilité de l'admission atomique Tauri — 26 octobre 2026

## Conclusion

**GO sous conditions pour un prototype ultérieur d'intégration de l'admission atomique.** Les primitives de préparation, validation, scellement, contrôle de concurrence et activation cohérente sont réalisables avec les vrais types de Tauri 2.11.6. L'encapsulation peut fermer deux voies natives étudiées. **Aucune admission obligatoire complète dans Tauri n'est démontrée** : Context, génération initiale, Manager et consommateurs IPC ne sont pas intégrés au conteneur expérimental. Le verdict ne porte pas sur la migration Unicode ; le NO-GO précédent n'est pas levé.

Aucune modification du checkout original, commit, push, PR, commentaire GitHub, migration Cargo applicative, suppression historique ou correction de deny. Les modifications sont dans une copie externe des sources Tauri, uniquement pour ces sondes.

## Références, environnement et sources

HEAD vérifiés au début : main `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228`, #183 `f2eee4223a1ccf5b0866944580df8fd5979575dd`, #186 `fee9020e884f7596086e169941ec36ebe6175491`, #187 `228e36a048926d77e84c9bb47863b84d07d2b924`. Instructions et diagnostics archivés consultés ; rapport architectural local toujours disponible.

Linux Debian 13.6 x86_64, Rust/Cargo 1.99.1, environnement natif préparé. Métadonnées vérifiées : Tauri 2.11.6 vient exactement de la copie expérimentale ; tauri-utils 2.9.3, runtime 2.11.3, build/codegen/macros 2.6.3 restent les versions de référence. GLib 0.18.5 pointe vers le vendor corrigé original, en lecture seule, via la configuration explicitement fournie. Rust 1.90, release, GUI et autres plateformes natives ne sont pas testés.

Sources principales : Tauri src/ipc/authority.rs, src/lib.rs, src/manager/mod.rs, src/webview/mod.rs, src/ipc/mod.rs et command.rs ; tauri-utils src/acl/build.rs, mod.rs, resolved.rs ; tauri-codegen src/context.rs et tauri-macros src/command/wrapper.rs. Le callback IPC du runtime 2.11.3 ne constitue pas un mécanisme indépendant de validation de politique.

## Quatre réponses

1. **Centraliser initial/supplémentaire/dynamique : plausible, partiellement démontré.** La sonde admet un état initial pré-résolu et des ajouts dynamiques par un même validateur de confiance. Les collecteurs et codegen réels doivent encore être reliés à ce passage avant activation.
2. **Fermer les insertions/remplacements directs : partiellement démontré.** Les restrictions de visibilité ferment les accès génériques au Mutex et __allow_command. Le jeton validé a des champs privés. Le remplacement via Context reste accessible et doit être contrôlé à l'installation ou par une API adaptée.
3. **Préparer puis activer sans état partiellement modifié : démontré pour le conteneur de sonde.** La publication est unique sous Mutex après contrôle propriétaire/révision ; une erreur laisse l'état actif inchangé. La cohérence d'une requête exige en plus un instantané épinglé pour les scopes, pas seulement une écriture atomique.
4. **Transport de politique versionnée sans changement d'interprétation : démontré seulement dans le processus.** Marqueur et même objet de motif survivent à l'activation sans reparsing. Le transport build/codegen → runtime demeure à concevoir ; les versions actuelles reparsent les chaînes distantes.

## Sondes et patch local exact

Le conteneur expérimental `PolicyStore` est un module ajouté à la copie de Tauri, avec accès aux vrais champs privés de RuntimeAuthority et ScopeManager. Il ne remplace pas AppManager. Il utilise la vraie résolution et la fusion Tauri sur une copie de travail, puis appelle un validateur synthétique sur les tables et manifestes. **Ce validateur n'est pas une politique métier complète, un moteur Unicode ou une preuve de provenance en production.**

Fichiers de Tauri modifiés dans la copie :

- src/ipc/authority.rs : déclaration de la sonde ; conversion d'une erreur de résolution en erreur retournée au lieu d'un unwrap ; restriction pub(crate) de __allow_command.
- src/ipc/mod.rs : export de faisabilité.
- src/manager/mod.rs : champ runtime_authority restreint à pub(crate).
- Nouveau src/ipc/atomic_admission_probe.rs : protocole et lectures épinglées expérimentaux.

Le corps de resolve_access, dont la condition deny observée, est conservé exactement. La fusion des scopes existante est réutilisée, pas corrigée. Les licences de la copie restent inchangées. L'inventaire et le diff sont dans local-tauri-changes.json et local-tauri.diff.

## Architecture minimale éprouvée

Le store possède un Mutex privé contenant révision, version et Arc de l'autorité. Le validateur est fourni par l'hôte de confiance à sa création, pas par un payload d'ajout. Pour préparer : épingler brièvement l'état courant ; relâcher le verrou ; copier les données et reconstruire des caches indépendants ; parser/résoudre/fusionner dans cette copie ; valider les effets ; produire ValidatedPolicy à champs privés.

Le jeton contient propriétaire de store, révision attendue, version et Arc candidat. Il n'implémente pas de désérialisation donnant accès aux champs. À l'activation : vérifier propriétaire, acquérir le Mutex, vérifier révision/version, vérifier le dépassement de compteur, remplacer l'autorité et publier la nouvelle révision. Le verrou est libéré avant destruction de l'ancien Arc. Les lecteurs épinglent ensemble version et autorité, puis utilisent le même Arc pour règles et scopes.

Signatures de la sonde, pas API proposée comme stable :

- try_new(acl, resolved, version, validator) -> Result<PolicyStore, AdmissionError>
- prepare_json(&self, input) -> Result<ValidatedPolicy, AdmissionError>
- prepare_embedded(&self, version, acl, resolved) -> Result<ValidatedPolicy, AdmissionError>
- prepare_direct_grant(&self, command, context) -> Result<ValidatedPolicy, AdmissionError>
- activate(&self, validated) -> Result<revision, AdmissionError>
- pin(&self) -> Result<PinnedPolicy, AdmissionError>

Les données de préparation sont possédées, sans relecture de fichier pendant l'activation. Le jeton n'est pas un authentificateur cryptographique : il atteste un parcours de validation dans ce processus. Toute politique externe ou tout état mutable consulté par le validateur doit être figé/versionné aussi ; un callback capturant une règle externe mutable non versionnée échapperait au seul contrôle de révision du store.

## Résultats exécutés

Compilation de la suite : sortie 0. **13 tests, 13 réussis, 0 échoué, 0 ignoré ; sortie 0**. Binaire exécuté en 0,127 s, borne 30 s murales, 10 s CPU, 1 Gio, core désactivé. Compilation bornée à 180 s ; vérifications de visibilité à 90 s par exemple.

1. État initial valide admis, état initial interdit rejeté.
2. Capacité dynamique valide invisible avant activation ; commandes et scope global visibles ensemble après.
3. Entrée et motif malformés rejetés sans changer l'état.
4. Permission inconnue retournée comme erreur, sans panique dans ce parcours.
5. Rejet après résolution/fusion dans la copie : aucun scope global ou de commande publié.
6. Deux threads préparent à la même révision : une activation réussit, l'autre reçoit Conflict ; aucune fusion silencieuse du candidat périmé.
7. Jeton préparé pour un autre store refusé, état inchangé.
8. Version et identité de l'objet de motif conservées ; version incompatible refusée.
9. Requête épinglée : anciens scopes conservés après publication d'un état utilisant le même identifiant pour un autre scope.
10. Caches reconstruits indépendants ; ancien instantané et ses caches conservés.
11. Validateur capable de relire le store sans réentrer dans le verrou de publication.
12. Capacité à scope global seulement rejetée par le validateur avant activation.
13. Comportement deny conservé, y compris refus sur contexte différent ; insertion directe interdite par la politique synthétique rejetée.

Cinq observations JSON avant/après sont conservées : admission valide, rejet après staging, scope global seul rejeté, concurrence et requête épinglée. Les autres propriétés ont leurs assertions et sorties de tests, pas une trace JSON autonome inventée.

Vérifications de compilation externes :

| Exemple | Code réel | Résultat |
|---|---|---|
| Fabrication du jeton | 101, E0451 | Champs privés : refus attendu |
| Accès générique Manager au Mutex après restriction | 101, E0616 | Refus attendu |
| Appel externe à __allow_command après restriction | 101, E0624 | Refus attendu |
| Remplacement via Context | 0 | **Route encore ouverte** |

Ces trois codes 101 sont des preuves de rejet du compilateur, pas des tests runtime masqués. Le dernier résultat est une limite obligatoire, pas un succès d'encapsulation globale.

## Tableau des voies

| Voie | Statut dans cette étude | Intégration encore nécessaire |
|---|---|---|
| parse_capabilities | À modifier/relier | Collecter des données brutes, aucun pouvoir d'activation ; sortie vers admission commune |
| get_capabilities, capacités en ligne/supplémentaires | À modifier/relier | Admettre après combinaison et filtrage, conserver ordre/fusions historiques |
| Resolved::resolve | Utilisé dans les préparations ; sortie brute non validée par elle-même | Aucun Resolved arbitraire ne doit être installable dans l'autorité gérée |
| RuntimeAuthority::new | Utilisé comme constructeur interne de copie ; public encore non contrôlé hors sonde | Factory contrôlée ou validation obligatoire avant installation |
| Context construction/remplacement | **Non couvert**, compilation positive conservée | Contrôle final avant installation ; propriétaire/politique d'instance à lier |
| Activation initiale générée | Non intégrée | Nouvelle factory de runtime et propagation des erreurs avant exposition IPC |
| Manager::add_capability | À modifier dans le produit | Doit appeler la préparation/activation, pas l'ancienne mutation directe |
| RuntimeAuthority::add_capability | Réutilisation interne sur copie, pas de routage global | Éliminer toute voie d'activation non admise |
| __allow_command | Accès externe restreint dans la copie | Routage interne via préparation validée, ou entrée explicitement réservée à l'hôte |
| Accès générique Manager | Fermé par la visibilité dans la copie | Compatibilité des usages externes à examiner |
| Scopes globaux | Préparés et validés dans la sonde, même sans commande | Leur consommation réelle doit utiliser le même instantané |
| IPC, CommandScope et GlobalScope | Non intégrés | Épinglage de la révision jusqu'à la consommation, propagation des handles |
| Plugins et helpers WebView | Frontière native de confiance ; consommation réelle non qualifiée | Distinguer même invocation et nouvelle opération explicite |
| Code Rust hostile/unsafe ou actions natives directes | Hors frontière de confiance | Une ACL ne sandboxe pas l'hôte natif |

Les champs publics Invoke.acl et CommandItem.acl ne sont pas des reçus de validation immuables. Le code Rust hôte/les handlers peuvent les manipuler ; la future preuve ne doit pas reposer uniquement sur un Vec public de règles. Ceci n'est pas présenté comme une exploitation distante.

## Atomicité et concurrence

Le Manager actuel prend déjà le Mutex autour d'un ajout dynamique : il sérialise ses lectures/écritures ordinaires. L'étude ne prétend pas qu'il expose systématiquement chaque étape de fusion aux lecteurs. La sonde ajoute une préparation isolée, une validation globale et le contrôle explicite de candidat périmé.

La publication d'une opération est atomique sous le protocole du store. Plusieurs opérations séparées ne forment pas une transaction globale : si A réussit puis B échoue, A reste publiée et peut avoir été observée. Un lot unique préparé sur une révision est nécessaire pour une atomicité de workflow ; des effets métiers externes ne sont pas annulés par ce mécanisme.

Une requête déjà sélectionnée peut autrement lire les scopes d'une nouvelle révision : l'IPC actuel libère le verrou après resolve_access, puis CommandScope/GlobalScope se réfèrent à l'autorité courante ; le helper public Webview::resolve_command_scope fait lui aussi des lectures séparées. La sonde reproduit le mélange possible via les vrais identifiants/tables sans créer de WebView, et démontre la solution d'épinglage dans son conteneur. Ce n'est pas une reproduction GUI de course.

Les instantanés donnent une isolation de lecture, pas une révocation instantanée des actions déjà admises. La politique doit préciser le sort des invocations en cours. Une révocation immédiate exigerait contrôles/annulation avant les effets sensibles et coopération des plugins ; l'admission ne rend pas atomiques les I/O d'un handler.

Le validateur est exécuté hors verrou ; la destruction de l'ancien état est différée hors verrou ; le test de relecture exclut un interblocage simple. Cela ne prouve pas l'absence de tous les interblocages : ScopeObject::deserialize, Drop, caches et locks de plugins/GUI restent à qualifier. Dans le code actuel certaines désérialisations typées sont appelées sous le verrou du gestionnaire. Reconstruire tous les caches peut aussi changer le coût et le calendrier de désérialisation ; les tests de cache emploient une valeur synthétique String, pas tous les types de plugins.

## Transport build/codegen/runtime

Actuellement les tables Resolved, scopes, globs et contextes sont émis en code Rust. Un motif distant est réémis comme chaîne puis reparsé à l'initialisation. Un objet Rust privé ValidatedPolicy ne traverse pas spontanément la frontière entre processus de compilation et runtime.

La sonde prouve seulement un transfert possédé en mémoire : marqueur Version conservé et même adresse d'objet RemoteUrlPattern avant/après activation. Aucune adresse n'est publiée dans les observations. Elle ne transporte ni matcher sérialisé entre architectures ni IR authentifiée par signature.

Pour un prototype ultérieur : format explicite avec versions de schéma/moteur/normalisation, cible et empreinte de politique ; validation du build pour diagnostic précoce puis validation de l'artefact runtime avant activation. Une empreinte auto-déclarée n'est pas une autorisation : l'ancrage doit venir du build ou d'une politique de confiance distincte. Une IR portable pourrait éviter le reparsing URLPattern ; sinon un parsing explicitement versionné et une vérification d'équivalence restent à prouver. Aucun de ces transports complets n'est implémenté ici.

## API et surface d'un éventuel patch suivant

Les champs privés, types scellés et pointeurs de snapshots sont des mécanismes internes possibles. Les changements de visibilité démontrés sont des **ruptures de compilation réelles** pour les usages testés, même pour un élément doc(hidden). Manager::add_capability peut potentiellement conserver son Result public en changeant son implémentation ; RuntimeCapability::build doit avoir un parcours fallible pour les données standard. Les paniques arbitraires d'un callback natif ne sont pas convertibles universellement, notamment avec panic=abort.

Choix à décider : factory fallible remplaçant les constructions brutes, ou validation finale du Context avant installation tout en conservant des données pré-initialisation brutes. La seconde option préserve plus d'API mais exige que l'installation soit réellement obligatoire ; elle ne couvre pas automatiquement des usages natifs autonomes de RuntimeAuthority.

Surface identifiée, non implémentée :

- Tauri authority.rs/nouveau module : états, jetons, révisions, admission et consommateurs de scopes.
- Tauri manager/mod.rs et app.rs : installation initiale contrôlée et propagation d'erreurs depuis with_handlers, actuellement infallible.
- Tauri lib.rs : Context et API Manager.
- Tauri webview/mod.rs : pinning IPC et resolve_command_scope.
- Tauri ipc/mod.rs et ipc/command.rs : transport d'un instantané dans Invoke/CommandItem.
- Tauri ipc/capability_builder.rs : traitement fallible des chaînes et builders standards.
- tauri-macros 2.6.3 command/wrapper.rs : le macro destructure exactement Invoke {message,resolver,acl} et construit CommandItem ; ajouter un champ impose une adaptation.
- tauri-codegen 2.6.3 context.rs et tauri-utils 2.9.3 ToTokens : marquage, factory et contrat du transport initial, selon l'option retenue.

Il n'est pas nécessaire de modifier le moteur Unicode pour éprouver ce protocole. Une intégration complète touche toutefois plusieurs frontières d'API et n'est pas un correctif d'une seule ligne. La compatibilité plugins, Rust 1.90, release, Android/Windows/macOS et GUI/WebView n'est pas démontrée. Aucune campagne générale, audit, CI ou migration n'est lancée.

## Point d'arrêt

Contrôles finaux : les quatre références GitHub ont été relues et correspondent exactement aux SHA ci-dessus. Les 302 fichiers suivis du checkout original sont identiques à leurs empreintes initiales ; l'index est inchangé (SHA-256 `022e7df574e8a28f8a2b14cf85c4432b1019078cad96e60857b034162829590e`) et `git status --porcelain` est vide. Le détail figure dans original-after-verification.json et github-refs-final.json. EVIDENCE_SHA256.json inventorie les empreintes des preuves temporaires, hors sa propre empreinte.

Les primitives sont démontrées localement ; l'obligation sur toutes les voies et le transport host/cible restent conditionnels. **GO sous conditions concerne l'admission atomique uniquement**, pas la migration Unicode entière. Les sources, tests, cinq observations avant/après, sorties des quatre sondes de compilation, diff et empreintes restent temporaires dans ce dossier. Revenir à ChatGPT V4 pour revue indépendante, sans intégration ni publication supplémentaire et sans démarrage automatique d'une autre mission.
