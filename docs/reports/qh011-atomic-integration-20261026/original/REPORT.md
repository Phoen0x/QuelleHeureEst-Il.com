# QH-011 — Solutions amont et prototype isolé — 26 octobre 2026

## 1. Verdict et périmètre

**GO sous conditions pour la qualification ultérieure de l'option A, NO-GO pour présenter cette expérience comme une intégration atomique Tauri générale.** L'application actuelle n'utilise pas de politique ACL distante ou dynamique déclarée. Un profil vide et immuable est donc un meilleur candidat proportionné qu'une refonte générale. Ce résultat n'autorise ni migration Unicode, ni publication, ni maintien d'un fork. Le NO-GO du prototype Unicode antérieur et ses deux échecs ne sont pas levés.

Le prototype réellement tenté ferme l'installation ordinaire d'un Context non vide dans le vrai Builder::build d'une copie de Tauri et bloque les ajouts sur l'autorité installée. Il n'intègre pas le conteneur dynamique général dans AppManager/IPC. Les deux familles de tests sont séparées : 13 cas du conteneur historique et neuf nouveaux cas d'intégration d'un profil vide. Ne pas attribuer l'admission dynamique réussie du premier au second, qui la refuse volontairement.

## 2. Références et environnement inspectés

Références initiales/finales relues sur GitHub :

| Référence | SHA réellement observé |
|---|---|
| main | eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228 |
| #183 | f2eee4223a1ccf5b0866944580df8fd5979575dd |
| #186 | f2d05a7cb0e78e6a01a79b0d222c34b3d684c8a8 |
| #187 | 228e36a048926d77e84c9bb47863b84d07d2b924 |

#186 a avancé avant la mission depuis cbdfbeed1c4fccdf9d6d20adad594ee40f568b10 : deux commits documentaires ajoutent l'obligation de recherche amont à AGENTS et au contrat, sans changer les archives atomiques. Les nouvelles consignes ont été lues et appliquées. Elles sont encore sur #186, pas sur main. Aucune de ces quatre références n'a changé entre les contrôles initial et final de cette mission.

Debian 13.6 x86_64 ; rustc 1.99.1 (58cf8f9c3 2026-10-13), cargo 1.99.1 (5f94df478 2026-08-27). Métadonnées résolues : Tauri 2.11.6, runtime 2.11.3, build/codegen/macros 2.6.3, tauri-utils 2.9.3, URLPattern 0.3.0. Le probe active uniquement dynamic-acl et test de Tauri, sans wry ; ce n'est pas le profil complet de l'application. Les sources GLib corrigées proviennent de la copie externe de #183 et sont sélectionnées par une configuration Cargo explicitement fournie. Aucun verrou n'est mis à jour, y compris celui du probe.

## 3. État de l'art effectué avant expérimentation

Sources consultées le 26 octobre 2026. Une date de document n'est pas une date de validation locale. Les tests déclarés par les auteurs ne sont pas attribués à cette mission.

| Source publique | Implémentation, versions et date | Preuves, limites et réutilisation |
|---|---|---|
| [KiCad MCP Pro](https://oaslananka.github.io/kicad-mcp-pro/security/rustsec-gtk3-unic-disposition/) | État du 5 octobre : Tauri 2.12.0, utils 2.10.1, runtime/wry 2.12.1, URLPattern 0.6.0 ; mise à jour du 20 octobre | Graphe et audit documentés, fichier JSON effectivement retrouvé sur main. Les cinq UNIC sortent ; risques GTK restants et dérive ultérieure explicités. Aucune preuve identifiée d'équivalence des anciennes décisions ACL ou d'admission atomique. La matrice desktop décrite ne valide pas Android pour notre projet. |
| [vacancyd](https://docs.vacancyd.com/dependency-policy/) | Gel daté du 16 septembre : utils 2.9.3+vacancyd.1, dépendance URLPattern 0.6 ; pas de changement Rust/JS dans cette bibliothèque | [policy/vendor.json](https://github.com/maxfield-allison/vacancyd/blob/2be2adc682054e3cd580ce61b4b598ee87af77e7/policy/vendor.json) vérifié : archive officielle, empreinte et diff permis, contrôleur annoncé. Modèle de rétroport étroit réutilisable, pas preuve de compatibilité ACL. Leur omission du verrou de développement doit devenir une archive inerte chez nous, pas une suppression. Ne pas copier leur politique d'audit. |
| [Tauri #8799](https://github.com/tauri-apps/tauri/issues/8799) | Demande du 6 février 2024, close le 19 février ; API dynamique aujourd'hui réellement présente dans 2.11.6 | Motive les permissions runtime pour localhost. Ce n'est pas un protocole de préparation/activation ni une preuve de révocation ou d'atomicité générale. |
| [Tauri #12968](https://github.com/tauri-apps/tauri/issues/12968) / [PR #12969](https://github.com/tauri-apps/tauri/pull/12969) | Demande du 13 mars 2025 encore ouverte ; PR Context::add_capability fermée sans fusion | Discussion mainteneurs : runtime_authority_mut, caché et instable, suffit au cas pytauri. Aucun nouveau point obligatoire d'admission livré par cette PR. Réutilisable comme information de compatibilité d'API, pas comme correctif. |
| [Discussion #14125](https://github.com/orgs/tauri-apps/discussions/14125) | 30–31 août 2025, non résolue | Suggestions de relance WebView, consentement et Manager::add_capability ; exemple de deny pour tenter une révocation. Aucune transaction validée ou garantie de révocation complète ; ne pas traiter le conseil communautaire comme contrat du moteur. |
| [Tauri #9343](https://github.com/tauri-apps/tauri/issues/9343) | 2 avril 2024, encore ouverte ; reproduction sur 2.0.0-beta.13, Rust 1.77.1 | Différence Android/Linux avec CustomProtocol et label. Reproduction liée, non rejouée. L'issue ouverte ne prouve pas que le défaut subsiste dans 2.11.6 ; interdit d'extrapoler les mocks Linux. |
| [GHSA-7gmj-67g7-phm9](https://github.com/tauri-apps/tauri/security/advisories/GHSA-7gmj-67g7-phm9) | Publié le 6 mai 2026, affecte 2.0 à 2.11.0, corrigé dès 2.11.1 | Confusion d'origine Windows/Android, PoC public décrit. La source locale 2.11.6 contrôle le suffixe complet .localhost ; aucun test natif de notre mission. Réutiliser le correctif déjà présent, ne pas le remplacer par un simple préfixe. Distinct de la migration Unicode. |
| [Documentation capabilities](https://github.com/tauri-apps/tauri-docs/blob/v2/src/content/docs/security/capabilities.mdx) | Branche v2, blob b7ff29d1b37d40d75fc1edeed4c94a2243717046 | Décrit fusion des droits, commandes personnalisées locales par défaut, cibles, hôte Rust de confiance et limite iframe Linux/Android. Pas de mécanisme d'admission atomique versionnée ni de protection contre un hôte Rust hostile. |

### Correctifs associés recherchés

- [Tauri #15660](https://github.com/tauri-apps/tauri/pull/15660), fusionné le 6 juillet 2026, commit dd725f4b13c30a86b398ccc59eb498f151f461c5 : manifeste utils passe URLPattern 0.3 → 0.6 et verrou amont modifié. La version stable utils 2.10.0 est publiée le 26 septembre. Ce n'est plus seulement une proposition. Le diff ne fournit pas une matrice d'équivalence des ACL historiques.
- [URLPattern #67](https://github.com/denoland/rust-urlpattern/commit/b047afee9b901e19928f87470ba722bbac05a27f), 17 septembre 2025 : remplace UNIC par ICU IdStart/IdContinue ; ajoute le test issue54 avec U+30FB. Ce test traite un comportement réel, pas la conservation de notre sémantique Unicode ancienne. Aucune de ces suites amont n'est exécutée ici.
- [Tauri #15291](https://github.com/tauri-apps/tauri/pull/15291), fusionné le 23 septembre 2026, utils 2.10.0/Tauri 2.12.0 : identifiants de scopes frais, cache créé, suppression de duplications de scopes partagés. Les fichiers finaux ajoutent resolve_assigns_scope_ids_from_base et add_capability_assigns_fresh_scope_ids. La description initiale de PR parle d'un helper rebase, mais le diff final emploie resolve_with_base_scope_id : ne pas confondre les deux versions. Pertinent pour une future option B, non rétroporté ici.
- [Tauri #11785](https://github.com/tauri-apps/tauri/pull/11785), fusionné le 26 novembre 2024 : initialisation du cache après ajout dynamique ; mécanisme présent dans la source 2.11.6. Ne remplace pas une cohérence d'instantané entre sélection de commande et scopes.
- [Tauri #16327](https://github.com/tauri-apps/tauri/pull/16327), ouverte depuis le 19 octobre 2026, non fusionnée au contrôle : suivi des fichiers supplémentaires lus par generate_context via include_bytes. Reproduction et tests déclarés dans la PR ; pas rejoués. Traite les entrées de build périmées, pas un transport sémantique authentifié.
- [Tauri #16072](https://github.com/tauri-apps/tauri/pull/16072), fusionné le 22 septembre 2026, Tauri 2.12.0 : change précisément la portée historique de deny. **Exclu** par la mission. Une montée globale Tauri 2.12 importerait notamment ce changement ; elle n'est pas un choix neutre.

Recherche ciblée par titres de PR et issues, puis lecture de sources. Aucun mécanisme complet de ValidatedPolicy/instantanés transactionnels équivalent à notre besoin n'a été identifié dans les résultats examinés. Cela ne prouve pas son absence de tous les dépôts/branches. Les trois recherches larges donnaient beaucoup de bruit de bots ; les résultats ont été affinés, pas assimilés à un audit exhaustif.

## 4. Exposition réelle et choix A/B

La copie des 302 fichiers suivis #183 reste exacte. Les deux tauri.conf.json n'ont aucune capacité explicite ; aucun répertoire de capacités suivi, plugin tiers enregistré, appel add_capability, remplacement d'autorité ou WebView distante construite n'a été trouvé dans les chemins actifs examinés. Les requêtes météo Reqwest ne sont pas des origines WebView distantes. Deux sorties générées antérieures debug/release, dont les journaux pointent explicitement vers ce checkout, contiennent capabilities.json = {} et aucun manifeste __app-acl__. Ce sont des artefacts historiques inspectés maintenant, pas une nouvelle génération.

Tauri conserve les manifestes core et **dynamic-acl est activé par défaut**, même si features=[] est écrit dans la dépendance. Il n'a pas été désactivé. Les sept commandes personnalisées conservent le comportement historique : locales disponibles sans manifeste applicatif. Absence d'ACL déclarée ne signifie donc pas absence de pouvoir backend. CSP est actuellement null ; le profil étudié ne traite pas une compromission de contenu local ni les problèmes iframe des WebViews natives.

| | Option A : profil actuel étroit | Option B : Tauri général |
|---|---|---|
| Contrat | Autorité vide puis immuable ; toute nouvelle fonctionnalité ACL exige réévaluation explicite | Politiques initiales/dynamiques arbitraires validées et activées |
| Compatibilité attendue | Aucun usage dynamique trouvé à casser ; contrôler aussi entrées de build et variantes | API publiques, macros, IPC, plugins, caches, provenance et révocation à qualifier |
| Portée expérimentale | Deux fichiers Tauri supplémentaires au-dessus de la sonde historique ; neuf cas MockRuntime | Patch multi-crates et transport de représentations non vides, non entrepris |
| Maintenance | Privilégier à terme un garde applicatif/build ou une API amont étroite ; ne pas transformer cette copie en fork permanent | Responsabilité durable de moteur ACL transactionnel, disproportionnée au besoin actuel |
| Verdict | Meilleur candidat, sous conditions ; les refus sont explicites et ne sont pas intégrés au produit | Pas de validation générale ; arrêt avant extension |

Un rétroport manifeste de style vacancyd est plus étroit qu'une mise à jour complète utils ou Tauri. Il ne résout pas, seul, les divergences Unicode ; sa proportionnalité ne vaut que si l'invariant de non-utilisation est prouvé et maintenu. Les anciens manifestes/verrous/identités devraient rester archivés, sans réactivation. Aucun rétroport ou déplacement de dépendance n'est effectué ici.

## 5. Prototype vraiment tenté et fichiers

Copies externes : candidate/ contient exactement les 302 fichiers applicatifs ; vendor/tauri-2.11.6 est une copie expérimentale ; probe/ est un crate autonome. Aucun original n'est modifié.

Par rapport à la sonde précédente, seuls src/app.rs et src/ipc/authority.rs de la copie Tauri changent. Builder::build valide et scelle l'autorité possédée avant AppManager::with_handlers, runtime et plugins. La validation refuse has_app_acl, les commandes allow/deny, tous scopes de commande et globaux non vides. Un remplacement Context reste constructible en Rust, mais doit repasser ce contrôle au build. Le flag privé scellé bloque les deux entrées d'ajout ; le contrôle public précède même RuntimeCapability::build. Les erreurs sont retournées, sans mutation de l'état actif.

Contre la distribution officielle : quatre fichiers modifiés (src/app.rs, src/ipc/authority.rs, src/ipc/mod.rs, src/manager/mod.rs) et un module ajouté (src/ipc/atomic_admission_probe.rs), aucun retiré. Les deux derniers changements de visibilité et l'export/module proviennent de la sonde historique. Les licences, resolve_access/deny et le fichier IPC WebView restent exactement identiques aux sources de référence.

Dans probe : Cargo.toml ajoute la fonctionnalité de test existante, configuration Cargo pointe explicitement sur les copies, src/lib.rs référence le nouveau src/application_profile.rs (neuf tests). Cargo.lock est strictement identique. Les quatre exemples de compilation sont repris à l'identique. Aucun codegen, macro, bibliothèque de plugins ou moteur Unicode n'est patché.

Ce Builder est volontairement restreint dans la copie ; ce n'est pas une API générale compatible de remplacement. Les programmes/plugins qui ajoutent des capacités seraient refusés. Aucun usage du projet n'est supprimé ou désactivé silencieusement : le produit n'est pas modifié et cette condition d'option A doit être revue avant une future intégration.

## 6. Tests exécutés et tentatives conservées

Commande de compilation : cargo --config <probe/.cargo/config.toml> test --lib --locked --offline --no-run --message-format=json, délai 180 s, jobs limités pendant la première compilation. Puis exécution directe du seul binaire de tests avec --nocapture --test-threads=1, 30 s murales, CPU 10 s, espace d'adressage 1 Gio, core désactivé.

- Première compilation : sortie 101, mauvais import RuntimeAuthority depuis la racine privée ; corrigé vers tauri::ipc. Trace attempt1-build.* conservée.
- Compilation suivante : sortie 0. Premier runtime : sortie 101, 21 réussis/1 échoué ; la fixture Manifest n'avait pas permission_sets, donc échec avant l'appel d'admission. Trace attempt2-tests.* conservée ; seule la fixture est corrigée.
- Dernière compilation : sortie 0, avec avertissements conservés dans les JSONL/logs (64 messages warning dans ce résultat, incluant dépendances et sonde). Aucun audit strict n'est déduit d'une compilation.
- Dernier runtime : **22 cas distincts, 22 réussis, zéro échoué, zéro ignoré, sortie 0**, 0,169 s. Ne pas additionner les rejeux en nouveaux cas.

Les neuf nouveaux cas : contexte vide admis ; remplacement distant rejeté avant initialisation plugin ; remplacement vide revalidé ; scope global seul rejeté ; scope de commande orphelin rejeté ; mutation dynamique refusée avant callback ; commande locale conservée après refus ; origine distante refusée pour la commande synthétique ; plugin setup soumis à la même admission et commande locale conservée.

Les 13 cas rejoués du conteneur historique couvrent initial/dynamique valides, refus sans effet partiel, motifs/permissions invalides, propriétaire, candidat périmé, deux threads concurrents, caches indépendants, scope épinglé, marqueur et identité de motif, relecture du validateur et deny inchangé. Ce conteneur reste **séparé du AppManager installé**. Ses collisions/fusions de scopes historiques ne sont pas corrigées par les nouveaux tests.

Quatre sondes de compilation, chacune cargo check --example ... --locked --offline et délai 90 s :

| Exemple | Code | Preuve |
|---|---|---|
| forge_token | 101/E0451 | Champs du jeton inaccessibles |
| manager_fence | 101/E0616 | Verrou privé |
| direct_fence | 101/E0624 | __allow_command privé |
| context_still_open | 0 | Construction/remplacement brut pré-installation reste compilable ; contrôle d'installation testé séparément |

Métadonnées locked/offline : sortie 0, provenance Tauri/GLib et versions vérifiées. Aucun grand rejeu Unicode, audit, suite Web, build applicatif, release, CLI ou CI n'est lancé.

## 7. Couverture, concurrence, transport et confiance

| Chemin/propriété | État démontré ou limite |
|---|---|
| parse_capabilities/get_capabilities et codegen réels | Lecture des sources/artefacts ; aucune nouvelle intégration du collecteur |
| Context → Builder::build → installation | Gate exécuté avec vraie API et MockRuntime, avant plugin/runtime ; refus non vide |
| Context mutable avant installation | Toujours possible, puis revalidation ; pas une politique active |
| Manager::add_capability / autorité installée | Erreur contrôlée dans le profil scellé ; aucune admission dynamique valide sur ce profil |
| Autorité autonome non installée | Constructible et modifiable par l'hôte ; pas de droit sur l'autorité gérée ; gate refuserait un état non vide |
| Accès générique Manager / __allow_command externes | Refus du compilateur, avec ruptures d'API natives potentielles |
| IPC et commande locale | Vrai chemin Tauri sous MockRuntime, pas GUI ; comportement local/remote testé sur greet synthétique |
| Provenance et scopes installés | Aucun scope/permission ACL actif dans le profil A ; cohérence obtenue par absence de transition, pas par un nouvel instantané IPC |
| Instantanés, révisions/propriétaire et caches dynamiques | Démontrés dans le conteneur historique seul ; cache String, pas tous les ScopeObject de plugins |
| Transport de version | Marqueur in-process et même matcher seulement ; transport build/codegen → cible non démontré |
| Rust hôte malveillant, unsafe, plugin qui effectue directement une opération native | Hors frontière de confiance ; aucune promesse de sandbox native |

Le flag de profil est privé, installé avant publication ; les ajouts ordinaires du Manager restent protégés par son Mutex. Le conteneur historique montre des candidats concurrents dont un devient périmé ; cette transaction n'est pas intégrée à l'IPC installé. Plusieurs opérations ne deviennent pas un lot atomique. Dans l'option B, l'instantané doit porter règles, scopes globaux/commande et provenance à travers Invoke, CommandItem et consommateurs, sinon une requête peut mélanger les versions. Les accès aux scopes typés et caches de plugins restent des points de lock/reentrance à étudier.

Pour une révocation, un instantané épinglé laisse finir l'invocation déjà admise ; il n'offre pas une révocation immédiate. L'option A ne fait aucune révocation : la politique installée demeure vide et immuable. Le comportement deny est conservé, même là où l'amont le change depuis.

Actuellement ExecutionContext::ToTokens réémet un motif sous forme de chaîne reparsée avec unwrap. De plus, referenced_by est conditionné par debug_assertions dans ResolvedCommand. La sonde ne transforme pas ces structures en artefact portable versionné/authentifié et ne crée pas de provenance release. Un simple hash ou marqueur contrôlé par le payload ne suffit pas. Le profil A rejette toute autorité non vide indépendamment de l'interprétation d'un motif ; cela réduit le besoin actuel mais **ne démontre aucun transport général fidèle**.

Conformément aux conditions d'arrêt, le prototype n'est pas étendu à l'option B : le transport général et la cohérence IPC/plugins resteraient non garantis. La surface nécessaire est celle déjà identifiée sur #186, plus les correctifs amont de scopes à examiner, sans les importer automatiquement.

## 8. Plateformes, risques et suite unique

MSRV déclaré dans les versions inspectées : 1.77.2 ; compilation réelle 1.99.1 seulement. La voie stable utils 2.10/Tauri 2.12 demande 1.90 : non testé avec ce compilateur exact ; les dépendances sélectionnées d'un éventuel rétroport devraient être requalifiées. Aucun Android, Windows, macOS, GUI ou release n'est validé. L'issue Android beta et l'avis d'origine justifient des tests natifs ; ni leur citation ni MockRuntime ne les remplacent. Entrées de build, filtrage plateforme et codegen hôte/cible restent à contrôler avant évolution.

Risques résiduels : nouveaux appels natifs/plugins ou capacités de configuration, paramètres injectés de build, artefacts périmés, origine native/iframe, éventuels effets de scopes globaux, provenance en release, cache typé, API cachées cassées et maintenance de copies locales. Une absence d'appel trouvée n'est pas une preuve formelle pour tous les programmes futurs. Aucune vulnérabilité exploitable du projet n'est annoncée par ces sondes.

Les avertissements RustSec existants ne sont pas réévalués et aucun audit n'est lancé ; aucune alerte n'est déclarée corrigée. Aucune migration de dépendance ou verrou applicatif. Les 302 hashes et l'index originaux sont inchangés, de même que la copie applicative et le verrou de probe. Diff, sources finales, premières tentatives, métadonnées, notes amont et résultats restent temporaires dans ce dossier ; aucun GitHub écrit.

**Prochaine étape unique proposée, non exécutée : revue indépendante par ChatGPT V4 de l'option A et de son contrat de non-utilisation avant toute décision de migration.** Le résultat ne justifie pas de poursuivre automatiquement un fork d'ACL général. Revenir avec #183 comme référence applicative et #186 comme archive durable antérieure.
