# GLib Slice → PtrSlice — rétroport P1 du 11 novembre 2026

**Correctif et régressions validés sous Linux ; revue complète bloquée par Clippy strict (sortie 101). PR en brouillon uniquement, aucune fusion autorisée.**

Base exacte de #183 : `f2eee4223a1ccf5b0866944580df8fd5979575dd`. La branche dédiée cible `codex/fix-development-validation-20261021`, jamais main. Main inspectée : `ac5ea3a04b721a7f4071cd375708fc9bef0a85a6`. Les consignes canoniques ont les mêmes blobs que lors de leur lecture du 8 novembre ; contexte sourcé réutilisé, sans audit nouveau des autres projets.

## Sources et correction

- [Défaut amont #2042](https://github.com/gtk-rs/gtk-rs-core/issues/2042).
- [Correctif b31265df](https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214).
- [Précondition NonNull](https://doc.rust-lang.org/stable/core/ptr/struct.NonNull.html#method.new_unchecked).
- [Substitutions Cargo](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html).
- [Rétroport et tests de #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/src-tauri/tests/glib_empty_slice.rs).

Le seul delta GLib nouveau concerne From<Slice<T>> : NULL retourne PtrSlice::new(), capacité zéro. Le chemin non vide est inchangé. Une Slice vide ayant réservé un tampon le libère dans into_raw ; sa capacité ne doit pas être réutilisée. Le fichier corrigé et les six tests sont identiques à l'octet aux sources de #153. Les commentaires existants sont conservés ; l'annotation française précède celle en anglais. Aucun test ne déclenche volontairement le défaut initial.

La garde construit en mémoire le fichier attendu depuis l'archive officielle et les deux fonctions avant/après intégrales épinglées dans son source. L'égalité reste stricte sur l'ensemble du fichier. Les assertions historiques, l'arbre initial de 165 fichiers et ses gardes restent vérifiés. Une seconde photographie de 302 fichiers authentifie les sources de #183 et ferme précisément la liste des sept nouveaux fichiers. Les sources modifiées avant correction sont archivées avec modes, blobs et SHA-256 dans [PORT.json](../history/glib-empty-ptrslice-20261111/PORT.json).

## Résultats réellement exécutés

| Contrôle | Résultat |
|---|---|
| cargo metadata --locked --offline --format-version 1, racine puis src-tauri | Réussi ; GLib résolu vers vendor/glib-0.18.5 dans les deux contextes |
| Comparaison graphes avant/après | 502 nœuds résolus par défaut identiques, fonctionnalités et arêtes incluses ; 504 entrées du verrou conservées |
| Contrôleur de conservation | Réussi ; vérification des graphes par défaut et toutes fonctionnalités, des 121 fichiers et des gardes historiques |
| cargo test --workspace --locked --offline --verbose | 14 intégrations réussies, zéro échec/ignoré ; zéro test unitaire dans le binaire |
| cargo test --workspace --release --locked --offline --verbose | Les mêmes 14 cas réussis, zéro échec/ignoré |
| node --test tests/dependency_updates/glib-qh011.test.cjs | 16 mutations rejetées ; 12 historiques et quatre nouvelles |
| Vite build direct | Réussi ; frontend embarqué préparé pour les builds Rust |
| cargo clippy --workspace --locked --offline --all-targets --all-features -- -D warnings | Échec 101 : huit diagnostics dans les sources applicatives inchangées |
| git diff --check | Réussi |

Les quatorze cas distincts sont les six conversions vides/propriété nouvelles, les six VariantStrIter historiques et les deux HTTP. Debug/release représentent 28 exécutions, pas 28 cas différents. Les 16 mutations sont une suite distincte, pas des tests Rust. Les tests natifs internes et exemples du vendor restent exclus du workspace.

Clippy signale les imports json inutilisés dans cache/weather, les imports redondants serde_json/urlencoding et quatre fonctions de cache non utilisées. Leur correction serait hors périmètre ; aucune annotation de tolérance ni changement de seuil n'est ajouté. Des avertissements GLib tiers et le profil release déclaré dans un sous-paquet restent affichés. Le profil release effectif n'est pas modifié.

## Incidents et limites

Les premières commandes sous permissions par défaut ont échoué : sous-processus Node EPERM et écoute HTTP locale interdite. Les exécutions finales utilisent une permission réseau ciblée de l'exécuteur ; aucune configuration de sécurité, vérification TLS ou garde n'est désactivée. Le premier build Rust manquait du frontend ; il a été généré, puis les tests relancés. Une première représentation de chemins du manifeste était quotée par Git ; la collecte NUL la remplace sans altérer les octets historiques. Une mutation de suppression du test révélait FileNotFoundError : une assertion explicite vérifie désormais sa présence, puis les 16 cas sont rejoués. Clippy manquait initialement ; le composant officiel correspondant à Rust 1.99.1 a été installé hors dépôt avant l'échec strict rapporté.

Pas d'audit Rust/pnpm neuf, de test Android/Windows/macOS, GUI, Miri ou sanitizer. Le kit Linux et ses caches sont réutilisés ; cela ne prouve pas une reconstruction sur machine neuve. Le warning RustSec GLib reste attaché à l'identité 0.18.5 malgré le rétroport. Aucun avis n'est ignoré. Les résultats détaillés expurgés et les empreintes des journaux temporaires figurent dans [les preuves](glib-empty-ptrslice-20261111-evidence.json) ; ces empreintes ne garantissent pas la conservation durable des logs.

## Conservation et publication

Trois fichiers modifiés seulement : le source PtrSlice, le contrôleur Python et sa suite négative. Sept ajouts : six régressions Rust dans un fichier, quatre fichiers d'archive/provenance, ce rapport et son JSON. Les 299 autres blobs/modes de #183 sont conservés ; les trois originaux modifiés sont archivés. Les manifestes, verrous, configuration Cargo, point d'entrée JS, autres sources GLib, variantes et archives QH-011 restent inchangés. L'archive officielle est intacte (SHA-256 `233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5`).

Aucun workflow, bot, permission, licence ni protection n'est modifié. La CI doit être consultée au SHA publié via la PR ; elle n'a pas été déclenchée manuellement et aucun succès n'est anticipé ici. Le commit contenant ces fichiers lie les preuves au candidat ; le rapport final fournit son SHA, sans auto-référence circulaire.

**Statut : correctif recevable pour examen technique en brouillon, acceptation complète non acquise à cause de Clippy. Prochaine action unique : revue indépendante par ChatGPT, sans fusion.**
