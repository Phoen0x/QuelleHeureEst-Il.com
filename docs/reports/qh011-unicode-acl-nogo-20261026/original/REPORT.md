# QH-011 — Expérimentation locale Unicode / URLPattern / ACL — 26 octobre 2026

**Verdict : NO-GO. Aucun commit, push ou changement GitHub.** La résolution Cargo préservée compile et ses régressions applicatives passent ; la stratégie ACL complète n'est pas intégrable en l'état du prototype. Deux exigences d'acceptation échouent. La voie nécessitant une extension non autorisée est arrêtée, sans patch de Tauri, sans correction de deny et sans publication.

## Références et environnement

HEAD vérifiés avant et après : main `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228` ; #183 `f2eee4223a1ccf5b0866944580df8fd5979575dd` ; #186 `de9d3a1424a43d365169a66888ee5ad66882c565` ; #187 `228e36a048926d77e84c9bb47863b84d07d2b924`. Aucun n'a changé.

Copie créée par clone local indépendant, sans hardlinks Git, puis checkout détaché au SHA #183. Les 302 fichiers sources ont été comparés avant toute édition. Le checkout original et son index restent identiques aux empreintes initiales et propres. Debian 13.6 x86_64 ; Node 24.19.0, pnpm 8.15.9, Rust/Cargo 1.99.1. Rust 1.90 exact n'est pas installé et n'a pas été testé ; aucune installation supplémentaire n'a été entreprise après le rejet architectural. Aucune qualification native Android, Windows, macOS, iOS ou GUI.

## Architecture réellement construite

1. `candidate/` : copie applicative ; seul fichier suivi modifié : `Cargo.lock`. La migration à tauri-utils 2.10.2 / URLPattern 0.6.0 est résolue hors ligne ; les six blocs collatéraux sont restaurés exactement. Huit archives inertes sont ajoutées sous `docs/history/unicode-qh011-experimental-20261026/`.
2. `policy-prototype/` : crate Rust séparée, non membre du workspace applicatif. Elle utilise Tauri 2.11.6 et tauri-utils 2.10.2, avec runtime 2.11.3 et build/codegen/macros 2.6.3. Elle ne remplace ni `build.rs`, ni `invoke_handler`, ni le résolveur du projet.
3. `check-conservation.py` et `test-conservation.py` : contrôle structurel additif externe et trois mutations dans des copies, sans réancrage des gardes historiques.
4. `baseline-guard-view/` : reconstruction exacte du snapshot avant migration, destinée uniquement au contrôle historique inchangé ; ce n'est pas le candidat migré.

Les hypothèses et rejets ont été écrits avant le code dans `DESIGN.md`. Le manifeste exact des fichiers modifiés/ajoutés et les codes de sortie sont dans `RESULTS.json`.

## Protocole versionné implémenté dans la sonde

`build_policy` reçoit une enveloppe versionnée avec configuration complète : manifestes, définitions de permissions/scopes, capacités, plateformes/cible. La version `legacy-urlpattern-0.3` n'autorise actuellement que les configurations sans motif distant non vide ; tout motif distant non qualifié produit une erreur contrôlée et aucune règle n'est retirée silencieusement. Cette restriction est volontairement reconnue comme incomplète : elle n'est pas une compatibilité historique suffisante.

La version `reviewed-urlpattern-0.6` exige l'égalité de l'enveloppe complète avec un instantané de revue explicitement fourni. Dans les tests, ces revues sont des **fixtures synthétiques**, pas des approbations humaines réelles, ni un système de signatures ou d'autorisation prêt à produire. Les changements de scopes, permissions, labels, provenance et plateformes invalident la liaison testée. Les motifs sont parsés avec la vraie API RemoteUrlPattern avant Resolved::resolve ; erreurs de parsing/résolution et paniques de résolution deviennent des erreurs de construction. Les décisions proviennent du vrai RuntimeAuthority.

Cette sonde démontre une partie du protocole de validation, pas un moteur de compatibilité historique, une couverture complète des chemins IPC ou une intégration de production. Elle n'applique aucune liste noire de caractères Unicode. Les noms modernes U+11F02/U+1C89, U+309B, domaines internationaux et chemins multilingues fonctionnent sous version moderne avec la revue synthétique exacte.

## Échecs bloquants réellement exécutés

La suite du prototype compte **17 tests : 15 réussis, 2 échoués, 0 ignoré ; sortie réelle 101**.

- `acceptance_historical_u309b_remains_available` : un motif légitime historique se heurte à `HistoricalRemoteUnproven`. Le refus est explicite, mais la compatibilité fonctionnelle exigée n'est pas remplie. Admettre tous les anciens motifs sans preuve réintroduirait les élargissements connus ; aucune équivalence générale n'est inventée.
- `acceptance_raw_dynamic_api_cannot_bypass_construction_policy` : après une construction legacy valide sans capacité distante, un appel à la vraie API `RuntimeAuthority::add_capability` accepte la capacité U+11F00 hors enveloppe de revue, puis autorise `/value`. Un garde initial ou un wrapper optionnel ne constitue pas une interception globale.

Le second cas met en évidence une lacune de couverture de l'intégration proposée. L'appel est effectué par du code Rust synthétique de confiance, pas par une attaque distante prouvée. Aucun exploit du produit actuel n'est établi.

Les sources de Tauri 2.11.6 confirment que RuntimeCapability::build retourne une CapabilityFile, que les chaînes et CapabilityBuilder sont acceptés et que Manager::add_capability appelle l'autorité interne sans crochet de validation versionnée. RemoteUrlPattern conserve son matcher dans un champ privé fixé au type URLPattern. Un simple invoke_handler applicatif ne couvre pas tous les plugins/chemins IPC. Aucun point d'extension central satisfaisant l'invariant complet n'a été démontré.

Une intégration complète demanderait une conception supplémentaire : compilation de compatibilité réellement prouvée et/ou point de validation commun aux chemins statiques/dynamiques. Modifier le tokenizer embarqué, forker/patcher Tauri ou remplacer l'architecture d'autorité n'a pas été entrepris. **L'expérience ne prouve pas qu'aucune autre solution sans fork n'existe** ; elle prouve que cette sonde ne suffit pas. La voie est arrêtée conformément à la mission.

## Matrices, scopes et refus

Le test de matrice du prototype exécute 65 enregistrements statiques, soit 63 scénarios distincts, avec les API réelles, et compare booléen, provenance, identifiants et contenu des scopes de commande aux résultats enregistrés. Cela ne constitue pas une validation des scopes typés dans une WebView. La liaison des définitions de scopes globaux à la revue est testée par mutation ; leur application par un consommateur réel n'est pas démontrée.

Les trois exécutables caches du diagnostic précédent ont aussi été rejoués : 70 observations par version de RuntimeAuthority (68 scénarios distincts) et 678 observations URLPattern (674 couples textuels distincts). Les résultats sont identiques aux archives. Les binaires n'ont pas été recompilés contre le workspace candidat ; leurs empreintes et cette limite figurent dans `baseline-replay-status.json`. Ils sont des témoins de comparaison, pas une validation de l'intégration.

Ces rejeux couvrent captures, offsets, contrôles TAB/LF/CR, normalisation/encodage, domaines/ports/chemins, fenêtres OU WebViews, origines locales/distantes, filtres de plateformes, plugins et capacités dynamiques. Le premier corpus reste 648 couples textuels / 647 après normalisation. Les exécutables de matrice sont bornés à 20 s murales / 10 s CPU / 1 Gio ; le binaire de tests du prototype à 30 s / 10 s CPU / 1 Gio ; core désactivé.

La même commande reçoit toujours dans la fixture de changement de scope : ancienne résolution A/1 ; nouvelle résolution A/1+B/2, où B permet `*` et A était limité à `safe` avec refus de `secret`. Le prototype observe ces scopes et leur provenance ; il ne présente pas le booléen commun vrai comme une compatibilité. La version moderne synthétiquement revue admet ce résultat **uniquement comme fixture de comportement explicite**, pas comme changement humainement approuvé dans le projet.

Le comportement deny de Tauri reste intact : existence d'une entrée de refus pour une commande entraîne le refus dans les cas étudiés, même sur une autre origine. Il n'a été ni corrigé ni masqué. Aucun abandon silencieux de règle n'est proposé.

## Conservation Cargo et pnpm

504 → 509 paquets ; 13 identités sortantes et 18 entrantes. Les anciens verrous/manifeste/configuration/build.rs sont archivés comme texte, avec empreintes ; les 13 identités sortantes conservent versions, sources, checksums et dépendances dans le verrou et le delta. Les 301 autres fichiers suivis sont byte-identiques, y compris commentaires, code fantôme, contrôleurs, licences, workflows et configuration GLib.

Les blocs tempfile, winreg, dirs-sys, winapi-util, rustix et errno sont exactement ceux du verrou initial. Pour les paquets communs, les seules arêtes sémantiques modifiées vont de tauri-utils 2.9.3 vers 2.10.2 dans six composants Tauri ; aucun autre changement d'identité/source/checksum n'est admis. L'unique différence de fonctionnalités d'un paquet commun est ICU properties : compiled_data → compiled_data+default. Les fonctionnalités Tauri, dont dynamic-acl, sont conservées.

Tauri 2.11.6, runtime 2.11.3, build/codegen/macros 2.6.3, Tokio 1.54.1, Reqwest 0.12.28, h2 0.4.20 et GLib 0.18.5 sont préservés. Aucun UNIC ni h2 0.3.27 dans le graphe actif candidat. Le verrou pnpm est identique : **409 snapshots, 140 optionnels**, patch braces `ij22dduv7f6wi3glhwl7jmdbrm`, Vite 8.1.6 et plugin-react inchangés.

La garde structurelle additionnelle passe et rejette trois mutations distinctes : perte d'une option Cargo, perte d'un snapshot pnpm, réintroduction de la réorientation Windows. Le contrôle historique inchangé passe sur la vue exacte avant migration ; sur le candidat, `pnpm check:dependencies` échoue avec « Only the application GLib dev-test edge may change », sortie 1. Ce rejet demeure un blocage : aucune assertion historique n'a été retirée ou réancrée pour le faire disparaître. Les suites historiques de mutations des contrôleurs n'ont pas été rejouées sur un candidat déjà refusé, où leur interprétation aurait été trompeuse.

## Validations exécutées pendant cette mission

| Commande / groupe | Résultat réel |
|---|---|
| pnpm install --frozen-lockfile --offline | Sortie 0 |
| pnpm list --depth Infinity --json et inventaire intégral du verrou | Sortie 0 ; 409 snapshots / 140 optionnels |
| TypeScript et ESLint | Sortie 0 chacun |
| Web + sécurité braces/Vite | 34 tests, tous réussis, 0 ignoré |
| Vite build | Sortie 0 |
| cargo tree --workspace --locked --offline --all-features --target all | Sortie 0 ; h2 0.4.20 présent, ancien h2/UNIC absents |
| cargo metadata --locked --offline --all-features | Sortie 0 ; GLib pointe exactement vers le vendor de la copie |
| cargo build --workspace --locked --offline | Sortie 0 |
| cargo test --workspace --locked --offline | 6 GLib + 2 HTTP réussis, 0 unité applicative, 0 ignoré |
| cargo build --workspace --release --all-features --locked --offline | Sortie 0 |
| cargo test --workspace --release --all-features --locked --offline | Les mêmes 8 cas réussissent ; pas 16 tests distincts |
| Prototype de politique | 17 tests : 15 PASS / 2 FAIL / 0 ignoré, sortie 101 |
| Garde structurelle additive / mutations | PASS ; trois mutations rejetées |
| Garde historique sur candidat | ÉCHEC, sortie 1 |
| Garde historique sur vue initiale exacte | PASS, sortie 0 |

Contrairement au premier diagnostic qui n'avait fait que des métadonnées sur la variante restaurant les six blocs, cette mission compile et teste effectivement cette variante en debug et release. Ces succès ne valident pas une intégration ACL inexistante.

## Audits réellement exécutés

`cargo audit --deny warnings --no-fetch --db <base figée> --json` : **sortie 1**, zéro vulnérabilité classée, trois avertissements : RUSTSEC-2024-0370 proc-macro-error 1.0.4, RUSTSEC-2025-0134 rustls-pemfile 1.0.4, RUSTSEC-2024-0429 glib 0.18.5. Base RustSec figée retrouvée au commit `21d909e4c8bd4e14c7aea58bf980c881a0053ab1`, 1 352 avis ; ce n'est pas une mise à jour de la base distante. Aucune option d'ignore, désactivation yanked, acceptation de base obsolète ou changement de seuil. Les cinq avertissements UNIC disparaissent seulement du verrou expérimental.

pnpm audit complet : sortie 0, réponse structurée valide, 305 dépendances déclarées par le service, zéro avis ; production : sortie 0, sept dépendances, zéro avis. Pas d'erreur HTTP 503 ou de configuration dans ces réponses, listes muted vides, configuration du projet inchangée. **Ces réponses datées ne démontrent pas une résolution amont de braces ni l'absence de risque de toutes les variantes historiques.** Aucune correction JS n'a été effectuée.

## Limites et publication ultérieure

MSRV 1.90 non exécuté ; seules résolutions toutes cibles et compilations natives Linux avec 1.99.1. Aucun GUI/IPC complet, APK/AAB ou test natif Windows/macOS/iOS. Les tests de scopes typés et globaux en consommation réelle restent manquants. Une comparaison de configurations/fixtures ne prouve pas l'équivalence universelle des langages URLPattern, ni la présence d'un point d'intégration de production.

Les preuves sont locales et temporaires : sources, verrous inertes, runners et fixtures permettent une reproduction sous environnement préparé ; compilation hors ligne et rejeux binaires dépendent des caches/outils natifs présents. Les caches, binaires, fichiers ignorés dist/node_modules/gen et journaux peuvent expirer. Aucune nouvelle preuve GitHub durable n'a été publiée.

**Aucun lot de code n'est proposé à publication en l'état.** La proposition minimale ultérieure serait un rapport documentaire et les preuves d'échec, après revue ChatGPT V4 et nouvel accord explicite ; toute reprise de code doit d'abord lever le blocage de compatibilité et d'intégration, sans changer deny ni affaiblir les gardes. Aucun démarrage automatique d'une seconde mission. Revenir à ChatGPT V4 pour la revue indépendante.
