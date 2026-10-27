# QH-011 — Qualification du contrat ACL minimal, option A — 27 octobre 2026

## 1. Verdict

**GO sous conditions pour cadrer un garde minimal applicatif sans fork, pas pour adopter définitivement le contrat ou migrer les dépendances.** Aucun besoin actuel d'ACL distante ou d'ajout dynamique Tauri n'a été identifié dans les sources et parcours examinés. Cela ne prouve ni l'absence de besoin futur, ni la compatibilité native Android, ni l'absence de risques des commandes locales. L'approche 2 est recommandée, avec l'approche 4 comme état opérationnel tant que ses preuves manquent. L'option A interne à Tauri n'est pas démontrée indispensable pour l'application actuelle ; elle reste nécessaire à examiner seulement si une interception obligatoire de toutes les API natives ordinaires devient une exigence explicite.

Le contrat proposé est **moins restrictif qu'une ACL entièrement vide et figée** : interdire les capacités distantes et les mutations dynamiques n'interdit pas des permissions locales statiques explicitement approuvées. Le prototype précédent refuse aussi ces dernières ; le généraliser aux besoins futurs pourrait créer une restriction injustifiée. Aucun choix fonctionnel n'est adopté dans cette mission. QH-011/T-003 restent ouverts ; le NO-GO Unicode antérieur et ses deux échecs restent inchangés.

## 2. SHA et environnement

Références relues avant l'analyse, identiques aux valeurs fournies :

| Référence | SHA |
|---|---|
| main | eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228 |
| #183 | f2eee4223a1ccf5b0866944580df8fd5979575dd |
| #186 | f2d05a7cb0e78e6a01a79b0d222c34b3d684c8a8 |
| #187 | 228e36a048926d77e84c9bb47863b84d07d2b924 |

Checkout lu : /workspace/work/glib-qh011-20261023/repo. Les 302 fichiers suivis correspondent à l'inventaire initial conservé ; index et statut propres vérifiés. Les compléments de recherche amont lus dans AGENTS et contrat sont sur #186, pas encore sur main. Contrat sections 1–14, confidentialité, index et quatre rapports QH-011 archivés consultés ; roadmap et backlog #187 relus.

Debian GNU/Linux 13.6 x86_64 ; Node 24.19.0 réellement utilisé, TypeScript installé pour l'analyse AST ; rustc 1.99.1 (58cf8f9c3), cargo 1.99.1 (5f94df478) vérifiés par leurs exécutables absolus. Aucun Cargo de compilation/résolution n'est lancé. L'ancien chemin outils/node/bin/node n'existe plus : première commande statique sortie 127, puis utilisation du Node disponible dans le runtime, sortie 0. Aucun outil n'est réinstallé, aucun activate.sh modifié. Les autres capacités de l'ancien environnement ne sont pas requalifiées par ces vérifications.

## 3. Recherche publique préalable

Consultation le 27 octobre 2026, avant inventaire applicatif approfondi. Les docs vivantes ne remplacent pas les sources versionnées 2.11.6 :

- [Capacités Tauri 2](https://v2.tauri.app/security/capabilities/), page datée du 3 septembre 2026 : fusion des droits, sélection des fichiers, accès distant explicite, commandes applicatives locales par défaut et confiance dans Rust. Limite iframe Linux/Android documentée.
- [Permissions](https://v2.tauri.app/security/permissions/) et [autorité runtime](https://v2.tauri.app/security/runtime-authority/), cette dernière datée du 22 février 2025 : permissions/scopes injectés aux commandes ; leur existence n'est pas une sandbox du code natif.
- [IPC](https://v2.tauri.app/concept/inter-process-communication/), [plugins natifs](https://v2.tauri.app/develop/plugins/) et [plugins mobiles](https://v2.tauri.app/develop/plugins/develop-mobile/) : distinguer le pont JavaScript, les commandes Rust et les permissions système mobiles.
- [Configuration](https://v2.tauri.app/reference/config/) : sources/cibles/configurations à considérer. L'implémentation exacte de get_capabilities dans utils 2.9.3 est la référence pour la liste vide et les fichiers supplémentaires.
- [Manager/Context, tag Tauri 2.11.6](https://github.com/tauri-apps/tauri/blob/tauri-v2.11.6/crates/tauri/src/lib.rs), blobs Git lus : lib.rs 261f7e887de0415ce4aace281d1c33ea7db9d061 ; [RuntimeAuthority](https://github.com/tauri-apps/tauri/blob/tauri-v2.11.6/crates/tauri/src/ipc/authority.rs), blob 8bb81e398f26950de7f2ed8afe10e713f7840f1b. Manager::add_capability prend le verrou et appelle l'autorité ; Context::runtime_authority_mut est public, caché et instable ; __allow_command est public dans la version officielle. Les pages docs.rs exactes étaient inaccessibles via l'outil Web : sources GitHub et crate locale utilisées, sans inventer une lecture de docs.rs.
- [GHSA-7gmj-67g7-phm9](https://github.com/tauri-apps/tauri/security/advisories/GHSA-7gmj-67g7-phm9), publié le 6 mai 2026 : confusion d'origine Windows/Android, corrigée dès 2.11.1. La source 2.11.6 inspectée utilise le suffixe complet .localhost ; aucun test natif n'est déduit de cette lecture.
- [#12969](https://github.com/tauri-apps/tauri/pull/12969), mars 2025, fermé sans fusion : ne stabilise pas une admission Context. [#15291](https://github.com/tauri-apps/tauri/pull/15291), fusionné le 23 septembre 2026, scopes dynamiques ; [#16072](https://github.com/tauri-apps/tauri/pull/16072), fusionné le 22 septembre, change deny ; [#16327](https://github.com/tauri-apps/tauri/pull/16327), proposé depuis le 19 octobre, entrées supplémentaires codegen. États relus ; aucun de ces correctifs n'est appliqué. Le correctif deny reste interdit par la mission.

La recherche précédente dans atomic-integration-20261026 reste utilisée comme preuve historique, pas comme campagne rejouée. Aucun nouveau prototype n'est conçu. Le connecteur n'expose pas de délai d'annulation configurable ; aucune écriture distante n'est tentée.

## 4. Quatre approches

| Approche | Surface envisagée, non modifiée | Couverture réelle | Limites et Android |
|---|---|---|---|
| 1. Configuration seule | Aucune modification de Tauri ; conserver l'absence de règles distantes | État déclaratif courant, traitement standard des origines par Tauri | N'intercepte pas Manager, Context, plugins natifs ou futurs ajouts. capabilities: [] ne signifie pas refuser tous les fichiers. Classification/iframe et permissions OS à tester nativement. Insuffisant comme garantie durable seul. |
| 2. Validation build/démarrage | Contrat versionné, garde des entrées réellement combinées, point d'entrée de construction, registre commandes/plugins, tests ; aucun fork à privilégier | Crédible pour ce programme précis et ses dépendances natives de confiance, sans API de mutation exposée au frontend | N'offre pas d'interposition universelle sur les méthodes publiques Tauri. Validation au démarrage doit qualifier ses données accessibles : Context n'offre pas d'énumération publique complète des tables actives. Vérifier artefact/codegen et tout code entre génération et build. Cible et overrides doivent être explicites ; Android reste à tester. |
| 3. Scellement interne expérimental | Copie Tauri : contrôle Builder, flag privé et restrictions d'accès ; rupture possible d'API | Neuf cas MockRuntime et treize cas du conteneur séparé dans l'étude antérieure, pas dans cette mission | Plus restrictif que le contrat : refuse également toutes capacités locales. Maintenance et plugins à qualifier ; pas de transport général ou validation Android. Aucune preuve qu'il soit indispensable à l'app actuelle. |
| 4. Maintien temporaire | Aucun changement de dépendance/configuration | Préserve état et compatibilité connus, sans inventer de sûreté nouvelle | Ne corrige pas les avis ; aucune preuve supplémentaire d'Android ou sécurité native. État à conserver en attendant décision et critères de l'approche 2. |

## 5. Inventaire actif, historique et futur

### Configurations et activation

Deux tauri.conf.json suivis : racine et src-tauri. Ils sont sémantiquement identiques sauf $schema. Le script pnpm tauri entre dans src-tauri et generate_context!() n'a pas d'argument supplémentaire : la configuration src-tauri est le chemin courant. La variante racine est préservée ; si elle est sélectionnée explicitement, elle doit entrer dans le périmètre du garde. Aucune surcharge plateforme suivie, aucun dossier/fichier capabilities ou permissions applicatif suivi. Une fenêtre de contenu applicatif, sans URL externe déclarée ; devUrl http://localhost:5173 et frontendDist ../dist. CSP null : ce contrat ne constitue pas une mitigation générale de scripts locaux compromis.

build.rs appelle seulement tauri_build::build. Aucun AppManifest::commands, plugin inline ou pattern personnalisé de capacités. Les sources Tauri lisent aussi les configurations de cible, TAURI_CONFIG, fichiers de capacités et options supplémentaires de generate_context. Leur absence d'usage connu ne permet pas d'ignorer ces entrées dans un futur garde.

**Correction de portée par rapport aux résumés précédents :** capabilities.json = {} signifie ici que la carte des capacités provenant des fichiers est vide. tauri-build 2.6.3 l'enregistre avant le get_capabilities effectué au codegen. Des entrées inline/configuration ou supplémentaires peuvent encore être combinées ensuite. Le fichier seul, même avec l'absence de manifeste __app-acl__, n'est donc pas une attestation exhaustive du Context final. Les deux artefacts historiques debug/release sont cohérents avec les sources actuelles sans règle ; absence totale active est attendue par lecture de source mais non réattestée dans une WebView native ou un Context généré fraîchement. Les anciens paramètres injectés ne sont pas reconstitués silencieusement.

### Cargo, plugins et scopes

Tauri ~2.11.0 résout 2.11.6 ; runtime 2.11.3, runtime-wry 2.11.4, wry 0.55.1, utils 2.9.3. Les fonctionnalités défaut Tauri incluent dynamic-acl ; le features=[] applicatif ne retire pas ces défauts. custom-protocol est la fonctionnalité applicative par défaut. Les options historiques httpdate et rustls-pemfile restent présentes et inactives par défaut, actives avec all-features. Aucun tauri-plugin-* dans les graphes filtrés historiques inspectés ; aucun Builder.plugin ou gestionnaire de plugin dans le code actif. Les plugins core internes ne sont pas une absence de code/plugin natif : leurs dix manifestes existent dans les sorties précédentes.

Aucun CommandScope/GlobalScope ou RemoteUrlPattern utilisé explicitement par les sept handlers, aucune politique globale applicative déclarée. Les commandes accèdent directement à Rust et au système : absence de scope Tauri ne signifie pas accès sans conséquence. Aucune API add_capability, remplacement Context, création/navigation de WebView externe, protocole personnalisé applicatif ou export d'un tel contrôle au frontend identifié dans les sources actives.

### Commandes conservées

| Commande Rust | Effet vérifié dans la source | Appel frontend présent | Usage du parcours courant |
|---|---|---|---|
| greet(name) | Retourne un texte | Aucun wrapper | Enregistrée, pas appelée depuis l'UI examinée |
| search_location(query) | Reqwest HTTPS vers géocodage, query encodée | tauriApi.searchLocations | Wrapper non importé depuis l'entrée actuelle |
| get_weather(lat,lon) | Reqwest HTTPS prévisions | tauriApi.getWeather | Idem |
| get_air_quality(lat,lon) | Reqwest HTTPS qualité air | tauriApi.getAirQuality | Idem |
| get_pollen(lat,lon) | Reqwest HTTPS pollen | tauriApi.getPollen | Idem |
| get_cached_location() | Lit location.json du cache Rust | tauriApi.getCachedLocation | Idem |
| cache_location(location) | Sérialise/écrit location.json | tauriApi.cacheLocation | Idem |

Toutes restent enregistrées via generate_handler! et doivent être conservées. Aucun paramètre de scope, filtre de fenêtre métier ou consentement spécifique dans ces handlers. Lecture/écriture et réseau doivent faire partie des futurs tests locaux ; un simple booléen de permission ne suffit pas. Le contrat ne doit pas introduire silencieusement un manifeste applicatif qui ferait perdre le chemin local de compatibilité.

### Parcours frontend réellement reliés

Analyse TypeScript AST : 19 fichiers source examinés, 16 modules accessibles par imports runtime depuis main.tsx ; aucun import dynamique trouvé. Les six appels invoke sont tous dans services/tauri.ts, non accessible depuis cette entrée. Les types et déclarations non exécutables ne sont pas du code à supprimer. C'est une analyse statique, pas une observation de clics ou preuve formelle pour tout JavaScript futur.

App → useAppState et SearchBar appellent les services Web de géocodage/météo/air, utilisent fetch et localStorage (cache, réglages, dernier lieu). Les pollens affichés proviennent aussi des données air horaires ; le handler Rust get_pollen n'est pas relié par cette entrée. Connexion/déconnexion via navigator.onLine, pas de permission géolocalisation demandée dans ce code ; MapPin est une icône. L'heure/fuseau et les réglages sont traités localement. Le fonctionnement offline est partiel, pas un mode natif complet validé.

Domaines publics de données : geocoding-api.open-meteo.com, api.open-meteo.com, air-quality-api.open-meteo.com et pollen-api.open-meteo.com côté Rust. Le dernier n'est pas utilisé par les services Web reliés. Il s'agit de réponses JSON, pas de pages WebView autorisées à appeler l'IPC. Les images sociales Bolt sont des métadonnées HTML ; aucun script externe, iframe ou injection HTML brute trouvé dans le périmètre actif examiné. Ce constat ne prouve pas l'absence de XSS.

### Historique et feuille de route

Les archives development-validation conservent main.rs, le wrapper Tauri 1 et shell-open ; les autres manifestes/verrous historiques GLib/HTTP/Tokio restent intacts. Ces références ne sont pas membres du workspace actif et ne doivent ni être supprimées ni réactivées pour l'audit. Variantes npm/pnpm Windows/Android/WASI et dépendances optionnelles demeurent des représentations à conserver, pas des preuves d'exécution produit sur ces plateformes.

Roadmap #187 : Android/GrapheneOS, backend Rust/local/offline-first, agrégation/provenance, cache durable, langues/a11y, exports/favoris et autres cibles restent des objectifs, pas des fonctionnalités validées. Les exports, notifications ou géolocalisation pourraient utiliser des permissions **locales statiques** et des permissions système mobiles : aucun besoin intrinsèque d'ACL distante/dynamique n'en découle. Le mécanisme précis reste à décider. Aucun système d'extensions distantes non fiables n'est actuellement implémenté ou exigé explicitement par la roadmap relue ; s'il est envisagé ensuite, il faut une nouvelle qualification, pas le déclarer abandonné aujourd'hui.

## 6. Matrice plateformes

Les comptes ci-dessous sont les nœuds de métadonnées **historiques** filtrées avant migration, relues sans nouvelle résolution. Les six entrées Cargo/config/source clés du dossier before sont identiques à #183 ; ce n'est ni une compilation croisée, ni une exécution native. Les fonctionnalités Tauri de ces métadonnées peuvent être unifiées entre cibles : un nom de feature Windows dans une ligne Linux ne prouve pas que du code Windows ait été compilé.

| Cible | Nœuds défaut/all-features historiques | Capacités/commandes attendues | IPC/protocoles et artefacts | Validation manquante |
|---|---|---|---|---|
| Linux x86_64 | 373 / 376 ; GTK 0.18.2, WebKitGTK 2.0.2, Wry | Pas de capacité déclarée ; sept commandes locales enregistrées | Protocole tauri et devUrl ; exécutables debug/release antérieurs retrouvés ; ancien mock 22 cas distincts | GUI/WebView du produit, provenance complète du Context et sept vrais handlers non rejoués |
| Android aarch64 | 326 / 329 ; JNI/NDK/Wry | Même intention statique ; aucun manifeste/app mobile suivi qualifié | Mappage http(s)://tauri.localhost, branches origine spécifiques et avertissement iframe ; aucun APK/AAB de ce projet attesté | Build/application native, pont, cache/chemins, réseau, permissions OS et GrapheneOS ; aucune compatibilité Android déclarée |
| Windows MSVC x86_64 | 341 / 344 ; WebView2 | Même intention, pas de plugin tiers résolu | Mappage .localhost, variantes historiques conservées ; aucun MSI/EXE natif Windows attesté | Build et exécution WebView2/IPC, cache APPDATA, différences origine |
| macOS aarch64 | 339 / 341 ; ObjC/Wry | Même intention, capacités locales futures à qualifier | Protocole local/WKWebView ; aucun .app/DMG attesté | Compilation/exécution/signature et comportement IPC natif |
| iOS aarch64 | 330 / 332 ; ObjC/Wry | Objectif futur, aucune validation de politique native | Protocole local/WKWebView ; aucun IPA attesté | Projet mobile, plugin/OS et exécution réelle |
| Web, wasm et variantes autres | wasm : 280 / 283, résolution uniquement | Frontend navigateur utilise fetch/localStorage ; pas d'IPC Tauri dans ce parcours ; le graphe wasm ne prouve pas que le backend Tauri soit supporté en wasm | TV, wearables, self-host et paquets WASI historiques ne sont pas des cibles natives qualifiées | Pas de garanties déduites des snapshots ; chaque distribution nécessite son périmètre propre |

Pour toutes les lignes, aucun nouveau test fonctionnel natif exécuté dans cette mission. Les options httpdate/rustls-pemfile restent conservées ; elles n'ajoutent pas d'API ACL dynamique. Le seul objectif mobile actuel ne suffit pas à imposer des droits distants. Un service self-host consommé par fetch n'est pas une WebView distante dotée d'IPC ; choisir cette dernière architecture demanderait une décision différente.

## 7. Contrat précis proposé, non adopté

Périmètre : version/cible/configuration explicites du produit natif, code hôte et dépendances Rust de confiance. Frontend local moins privilégié, données réseau non fiables. Les garanties ne sandboxent pas du Rust hostile.

1. Aucune capacité avec remote activable, y compris via configuration inline, fichiers supplémentaires, override, plugin ou mutation native connue. Refuser la configuration incompatible, sans omettre silencieusement une règle ni la réduire par matching.
2. Aucune mutation runtime des capacités/permissions/scopes Tauri, même locale, depuis les chemins applicatifs et plugins approuvés. Conserver dynamic-acl compilé ; toute nouvelle utilisation nécessite une décision et une version de contrat.
3. Conserver les sept commandes locales, arguments, effets et comportement d'origine. Figer le registre initial et faire revoir explicitement toute nouvelle commande/alias/plugin ou nouveau consommateur de scopes. Une commande custom ajoutée sans manifeste devient accessible localement : contrôler seulement remote.urls manquerait cette extension de droits.
4. Aujourd'hui, aucune capacité locale n'est déclarée. Le contrat minimal peut autoriser ultérieurement un **ensemble statique local explicitement revu**, sans promettre qu'il restera toujours vide. Aucun passage automatique d'un profil vide à ces permissions.
5. Les permissions Android/iOS demandées à l'OS, les requêtes HTTP/HTTPS et l'ajout de droits Tauri sont distincts. Le contrat n'interdit pas les deux premières catégories par principe ; leur besoin doit être décidé et testé.
6. Archiver les variantes inactives dans leur état exact ; empêcher leur découverte accidentelle par les globs de build et leur activation automatique. Une variante conservée n'est pas abandonnée fonctionnellement : sa réactivation est une opération revue.

Où le déclarer : document technique versionné et registre machine lisible de cible/configuration/commandes/plugins/permissions admises, avec référence au SHA et critères de changement. Ce sont des propositions de futur correctif, aucun fichier produit n'est ajouté.

## 8. Garde minimal et contournements

Recommandation : approche 2 sans fork, dans une frontière hôte de confiance, et maintien des dépendances en attendant validation.

- Valider les **entrées effectivement combinées** par les mêmes versions d'API/configuration que codegen : plateforme, TAURI_CONFIG et CLI --config, répertoires/globs, capacités inline/référencées/supplémentaires et manifestes/plugins. Ne pas déduire l'absence de règles de capabilities: [] ou du fichier capabilities.json seul. Suivi des entrées et régénération fraîche nécessaires ; #16327 n'est pas une garantie publiée à importer silencieusement.
- Contrôler que generate_context ne reçoit pas de chemins non revus et que rien ne remplace/altère l'autorité entre génération et Builder. Le démarrage peut vérifier la liaison de l'artefact validé et du point d'entrée de confiance ; cela ne donne pas une énumération stable des champs privés du Context. Ne pas annoncer un garde complet qui ne peut lire ce qu'il certifie.
- Recenser et verrouiller par revue/contrôles les appels natifs d'ajout/remplacement, les plugins, le registre réel des commandes, les scopes et protocoles. Les recherches textuelles sont des aides, pas une preuve résistante aux alias, macros ou dépendances malveillantes. Toute variation de la base approuvée doit provoquer une réévaluation explicite.
- Tester les refus négatifs et les comportements locaux, puis les vrais parcours natifs ; aucune exception ou règle silencieusement ignorée pour faire passer le garde.

Sans modification de Tauri, on **ne peut pas intercepter universellement** les appels directs Manager::add_capability, RuntimeAuthority::add_capability/__allow_command, Context::runtime_authority_mut ou l'accès générique au Mutex natif encore public dans la version officielle. Ces API ne sont pas exposées aux sept commandes actuelles. Un wrapper initial n'empêche pas un plugin de confiance de les appeler ensuite. Une exigence de scellement obligatoire contre tous les appels Rust ordinaires dépasse donc le garde applicatif proposé ; elle demande restrictions/API internes Tauri, compatibilité plugins et preuve native distinctes. Même cela ne sandboxerait pas unsafe ou des opérations natives directes.

## 9. Preuves et tests

Exécuté maintenant : contrôle des quatre HEAD ; lecture des sources publiques/versionnées et documents projet ; analyse AST TypeScript (sortie 0 après correction du chemin d'outil absent, première sortie 127 conservée comme incident) ; comparaison JSON des configurations ; inspection de douze métadonnées historiques défaut/all-features sur six cibles ; comparaison des six entrées correspondantes ; vérification des 500 empreintes de la mission précédente et des 302 fichiers/index/statut originaux. Aucun test Rust découvert/exécuté dans cette mission, aucun nouveau cas natif.

Réutilisé, pas rejoué : 22 tests du 26 octobre (13 conteneur séparé et neuf cas de profil vide avec MockRuntime), sorties finales 0 ; quatre sondes 101/101/101/0 ; premières erreurs et limites conservées. Le greet synthétique de ces tests n'est pas une exécution des sept handlers réels. Les anciens binaires Linux et capacités ne deviennent pas une nouvelle validation par leur lecture.

Non exécuté : installation, tests Web, Rust/GLib/HTTP, audits, builds/release, génération fraîche du Context, tests Android/Windows/macOS/iOS, GUI, MSRV exact 1.90. Aucun résultat d'audit actuel affirmé. Les pièces JSON et rapports nouveaux restent temporaires hors dépôt dans acl-contract-20261027 ; les 500 pièces d'origine restent intactes. Les configurations injectées d'anciens builds ne sont pas fabriquées.

## 10. Conditions d'un futur correctif et arrêt

Conditions essentielles : décision explicite sur le contrat et sa frontière native ; acceptation de garder possibles les capacités locales statiques futures ; spécification du garde couvrant les entrées complètes de build ; tests d'injection/refus sans publication partielle ; préservation des sept commandes et de leurs caches/réseau dans un harnais isolé ; vrais essais Android et GUI des origines locales/distant/iframe/protocoles ; reprise des garanties GLib/HTTP et de conservation uniquement lors d'une mission d'implémentation autorisée. Les variables réseau privées, caches utilisateurs ou paramètres personnels ne sont pas nécessaires aux preuves publiques.

Le **GO sous conditions ne vaut pas adoption durable universelle**, ne supprime aucune alerte et n'autorise pas une migration Unicode. Pour l'état courant, aucun besoin de l'option 3 n'est établi ; ne pas maintenir un fork uniquement parce que la sonde a compilé. Si la garantie demandée inclut tous les appels natifs futurs sans frontière de confiance, l'approche 2 est insuffisante et la qualification doit rester bloquée.

Prochaine action unique : **revue indépendante de ce contrat et de l'approche 2 par ChatGPT V4**, avec #183 comme référence applicative et #186 comme archive antérieure, avant tout correctif. Aucune mission suivante ne démarre.
