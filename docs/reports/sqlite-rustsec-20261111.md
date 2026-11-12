# SQLite — RUSTSEC-2026-0459 — 11–12 novembre 2026

## Décision et périmètre

**GO pour revue indépendante du correctif ciblé ; aucune autorisation de fusion.** La résolution active utilise `rusqlite 0.41.1`, `libsqlite3-sys 0.39.1`, SQLite **3.54.1** avec `bundled` et `chrono`. RUSTSEC-2026-0459 disparaît dans un nouvel audit comparable et la version/source SQLite liée est vérifiée à l'exécution. Les builds et les 19 tests Rust distincts passent en debug/release ; les 60 cas de conservation passent. **Audit strict, Clippy et formatage global restent en échec**, détaillés ci-dessous. La CI distante n'est pas présumée réussie.

Base exacte : [#194](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/194), commit `d35eb03ff7e63a77fcc1094a9292b87992e3337d`, arbre `bec9bfb986855bbe6c73426983b2198726b2dede`. Branche dédiée : `codex/fix-sqlite-rustsec-2026-0459-20261111`, PR destinée exclusivement à `codex/fix-glib-empty-ptrslice-pr183-20261111`. Le SHA du commit contenant ce rapport est celui de son URL GitHub et de la PR, sans auto-référence circulaire. Aucun changement des branches sources, de main, #183, #166, des workflows, bots, licences, politiques ou protections.

La reprise du 12 novembre retrouve la branche locale propre sur #194 ; aucun changement SQLite, commit supplémentaire ou publication n'avait été effectué. Les messages intermédiaires des deux analyses précédentes sont récupérés ; leurs sessions et rapports finaux ne sont plus accessibles. La recherche déjà étayée est réutilisée et les versions/crates/provenances sont complétées. Les propositions #195 (`06190945ef5c92f6e49fd00c616505d3200f343c`) et #196 (`e67d7c3d66fc3069b1c1bab1c65a1b87b45e6c56`) sont relues sans les modifier ni leur attribuer une autorisation supplémentaire. main est vérifié à `ac5ea3a04b721a7f4071cd375708fc9bef0a85a6`, #183 à `f2eee4223a1ccf5b0866944580df8fd5979575dd`.

## Recherche préalable et alternatives

- [Avis officiel RustSec](https://rustsec.org/advisories/RUSTSEC-2026-0459.html), CVE-2026-119375, GHSA-72w2-rjgg-q729 : tailles de pages WAL/base incompatibles et mémoire non initialisée. Crates embarquées affectées `0.6.0` à `0.38.2`, corrigées à partir de `0.39.0` pour SQLite ordinaire. Aucun couple hostile de fichiers n'est construit pendant cette mission.
- [Correctif SQLite `e5bf119821f25be1d7f10ef0a2edbe175289166e`](https://github.com/sqlite/sqlite/commit/e5bf119821f25be1d7f10ef0a2edbe175289166e) : dans `sqlite3WalReadFrame`, si `nOut > sz`, remise à zéro de `pOut+sz`, puis lecture limitée à `sz`. Le fragment est présent dans les deux amalgamations téléchargées, natives et WASM ; leurs empreintes sont conservées dans [SOURCES.json](../history/sqlite-rustsec-20261111/SOURCES.json).
- [rusqlite v0.41.1](https://github.com/rusqlite/rusqlite/releases/tag/v0.41.1), publié le 28 octobre 2026 : dépendance sys `^0.39.0`. Le verrou résout effectivement **0.39.1**, vérifié dans la crate et les métadonnées, et non seulement supposé depuis ce tag.
- [SQLite 3.54.1](https://sqlite.org/releaselog/3_54_1.html), 16 octobre 2026 : également préférable à 3.54.0 pour son correctif 32 bits. La version initialement embarquée par sys 0.26.0 est **3.41.2**.
- [#166](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/166), `dc9aed72b1c5590825750074f088a46822def4f2` : seul `src-tauri/Cargo.toml` change (`0.29`→`0.41`), sans verrou ni campagne de validation. Référence historique conservée, aucune fusion/modification.

| Stratégie | Décision, avantages et limites |
| --- | --- |
| Migration officielle | Retenue : source publiée, suivi amont, fonctionnalité SQLite conservée, compilation locale et tests possibles. Ruptures d'API de plusieurs versions mineures à considérer pour de futurs usages ; aucun appel métier `rusqlite::Connection` identifié dans les sources actuelles. |
| Rétroport C sur sys 0.26 | Non retenu : maintiendrait une amalgamation locale et son système de build, ses preuves de provenance et sa maintenance multiplateforme. Aucun avantage démontré ici ; avis de version probablement toujours visible. Aucun rétroport expérimenté. |
| SQLite système corrigée | Non activé : version et options variables selon OS, machines et distribution, complexité Android et reproductibilité moindre. La garde refuse les substitutions explicites `LIBSQLITE3_SYS_USE_PKG_CONFIG` et `SQLITE3_LIB_DIR`. |
| SQLCipher | Variante distincte, non activée : l'avis indique que sys 0.39.0/0.39.1 avec `sqlcipher-src 419.0.6` embarque encore SQLite 3.53.4 affecté. Aucun raisonnement « sys corrigé donc SQLCipher corrigé ». |

Le cache métier utilise des fichiers JSON ; l'exposition actuelle à SQLite est faible/non démontrée, **pas une preuve générale d'inexploitabilité**. La dépendance et sa fonctionnalité future sont conservées.

## Graphe et fonctionnalités

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Paquets Cargo.lock / toutes fonctionnalités | 504 | 501 |
| Métadonnées par défaut, toutes cibles représentées | 502 | 499 |
| rusqlite | 0.29.0 | 0.41.1 |
| libsqlite3-sys | 0.26.0 | 0.39.1 |
| SQLite embarquée | 3.41.2 | 3.54.1 |

Identités sortantes du verrou actif, toutes conservées dans le verrou et les graphes historiques : `ahash@0.8.12`, `allocator-api2@0.2.21`, `fallible-iterator@0.2.0`, `hashbrown@0.14.5`, `hashlink@0.8.4`, `libsqlite3-sys@0.26.0`, `rusqlite@0.29.0`, `zerocopy-derive@0.8.63`, `zerocopy@0.8.63`.

Identités entrantes : `fallible-iterator@0.3.0`, `hashlink@0.12.2`, `libsqlite3-sys@0.39.1`, `rsqlite-vfs@0.2.0`, `rusqlite@0.41.1`, `sqlite-wasm-rs@0.6.3`.

`hashlink` modernise sa table vers `hashbrown 0.17.1` déjà présent : activation de `default-hasher` et arête vers `foldhash 0.2.0` déjà présent. L'ancienne chaîne ahash/allocator-api2/zerocopy disparaît de la résolution active avec hashbrown0.14.5, sans destruction de sa représentation archivée. `fallible-iterator` passe à0.3.0. Tous les autres nœuds existants, fonctionnalités et arêtes sont identiques, à l'exception de l'arête applicative rusqlite.

`bundled`, `chrono`, `modern_sqlite` sont conservés. La nouvelle version exprime le cache existant via les fonctionnalités par défaut `cache`, `hashlink`, et `ffi-sqlite-wasm-rs`. Sur `cfg(all(target_family="wasm",target_os="unknown"))`, `sqlite-wasm-rs0.6.3`/`rsqlite-vfs0.2.0` apparaissent, avec une amalgamation3.54.1 également inspectée. Les arêtes conditionnelles vers sys et chrono sont décrites intégralement dans [TRANSFORMATIONS.json](../history/sqlite-rustsec-20261111/TRANSFORMATIONS.json). La feature sys minimale passe de3.14.0 à3.45.3. Aucun SQLCipher actif. Les dépendances facultatives applicatives `httpdate` et `rustls-pemfile` restent inchangées.

Tauri2.11.6, runtime2.11.3, Reqwest0.12.28, h2 0.4.20, Tokio1.54.1 et les **121 sources GLib** restent inchangés. Le graphe pnpm garde ses **409 snapshots, dont140 optionnels** ; aucun paquet npm, script Windows, code fantôme ou variante n'est modifié.

Les crates entrantes sont MIT, sauf fallible-iterator et hashlink à choix MIT/Apache-2.0. SQLite conserve sa provenance domaine public. `foldhash` (Zlib) était déjà présent ; son nouvel usage est explicite. Les versions rusqlite/sys déclarent MSRV **1.89 / 1.88**, hashlink 1.85, WASM/VFS 1.81. **Le compilateur exact1.89 n'a pas été testé**, et ces valeurs ne certifient pas le MSRV de toute l'application. Aucun audit de licence complet n'est lancé ; aucune licence n'est modifiée.

## Conservation et adaptation additive des gardes

[PORT.json](../history/sqlite-rustsec-20261111/PORT.json) contient les 309 blobs, modes et SHA-256 de #194. Trois fichiers modifiés sont conservés à l'octet : manifeste, verrou, ancien wrapper. Les 306 autres fichiers initiaux doivent rester identiques. Aucun fichier supprimé, aucun mode modifié, **14 ajouts**.

Le wrapper appelle une nouvelle garde SQLite. Celle-ci authentifie le tree Git initial, les archives et les transformations bornées ; refuse tout autre changement de manifeste/verrou, nœud, feature, arête ou cible ; vérifie l'origine registry et les fichiers des crates, les sources SQLite et le chargement du GLib vendored depuis racine et src-tauri. Les transformations et graphes sont épinglés par SHA-256 dans la garde, pas seulement approuvés par un manifeste modifiable.

Une vue temporaire reconstitue ensuite exactement les 309 fichiers initiaux et lance le wrapper #194 **inchangé**, qui rejoue les gardes GLib, Tokio, braces, Vite et JS sur leurs propres vues historiques. Aucun SHA historique n'est réancré, aucune assertion historique n'est supprimée. Les anciens tests restent inchangés ; l'absence d'objet Git initial dans un checkout réduit est testée. Les captures de graphes sont des **données normalisées produites pendant la mission**, sans chemins de cache ; elles ne prétendent pas être les octets des sorties cargo metadata brutes. La déclaration0.29 est également gardée en commentaire.

| Fichier | Action |
| --- | --- |
| `src-tauri/Cargo.toml` | modifié ; original archivé |
| `Cargo.lock` | modifié ; original archivé |
| `docs/validation/rust-178/check-ported-graph.cjs` | modifié ; original archivé |
| `docs/history/sqlite-rustsec-20261111/src-tauri/Cargo.toml` | ajouté |
| `docs/history/sqlite-rustsec-20261111/Cargo.lock` | ajouté |
| `docs/history/sqlite-rustsec-20261111/docs/validation/rust-178/check-ported-graph.cjs` | ajouté |
| `docs/history/sqlite-rustsec-20261111/PORT.json` | ajouté |
| `docs/history/sqlite-rustsec-20261111/TRANSFORMATIONS.json` | ajouté |
| `docs/history/sqlite-rustsec-20261111/graph-before.json` | ajouté |
| `docs/history/sqlite-rustsec-20261111/graph-all-before.json` | ajouté |
| `docs/history/sqlite-rustsec-20261111/SOURCES.json` | ajouté |
| `Scripts/check-sqlite-rustsec.py` | ajouté |
| `tests/dependency_updates/sqlite-rustsec.test.cjs` | ajouté |
| `src-tauri/tests/sqlite_security.rs` | ajouté |
| `src-tauri/tests/json_cache_preservation.rs` | ajouté |
| `docs/reports/sqlite-rustsec-20261111.md` | ajouté |
| `docs/reports/sqlite-rustsec-20261111-evidence.json` | ajouté |

Les empreintes des originaux et livrables, les cas nommés, codes de sortie et empreintes des journaux temporaires sont dans [les preuves structurées](sqlite-rustsec-20261111-evidence.json). Les octets des sources tierces, caches, SDK, bibliothèques natives et journaux bruts ne sont pas ajoutés au dépôt. Leurs références et empreintes utiles sont conservées ; aucune promesse de pérennité des fichiers temporaires Cloud.

## Validation réellement exécutée

Environnement Linux avec prérequis locaux Debian13 repris : rustc1.99.1, Cargo1.99.1, Clippy0.1.99, rustfmt 1.10.0, cargo-audit0.22.2, Node24.19.0/pnpm8.15.9, GTK3.24.49, WebKitGTK2.54.0, GLib2.84.4. Caches et cible de compilation réutilisés ; **pas une reconstruction sur machine vierge**. rustfmt a été installé à l'extérieur du dépôt. Répertoire : racine du candidat, avec `.cargo/config.toml` inchangé ; vérification supplémentaire depuis src-tauri.

| Commande / contrôle | Résultat réel |
| --- | --- |
| `cargo update -p rusqlite --precise 0.41.1`, puis `cargo fetch --locked` | 0 ; seule famille SQLite modifiée selon comparaison |
| `cargo metadata --locked --offline --format-version 1` avant/après ; variante `--all-features` | 0 ; graphes archivés/comparés ; même source GLib depuis les deux répertoires |
| `cargo tree --locked --offline --target all --all-features -e features` | 0 ; absence de sys 0.26 dans le graphe actif, variantes conditionnelles inventoriées |
| `cargo build --workspace --locked --offline` | 0 |
| `cargo build --workspace --release --locked --offline` | 0 |
| `cargo test --workspace --locked --offline` | 0 ; **19 cas distincts**, 0 échec/ignoré |
| `cargo test --workspace --release --locked --offline` | 0 ; les mêmes19 cas, 0 échec/ignoré |
| `node docs/validation/rust-178/check-ported-graph.cjs` | 0 ; garde SQLite et toute la cascade historique PASS |
| `node --test --test-concurrency=1 tests/dependency_updates/*.test.cjs` | 0 ; première campagne58 cas,45 historiques+13 SQLite |
| `node --test tests/dependency_updates/sqlite-rustsec.test.cjs` après ajout des2 refus de substitution système | 0 ;15 casSQLite. **60 casdistincts au total**, pas73 |
| `cargo fmt --all -- --check` | **1** ; build.rs, cache.rs et main.rs historiques ; cache également découvert par le nouveau test |
| `rustfmt --check --edition 2021 --config skip_children=true` sur les2 nouveaux tests | 0 ; aucun fichier historique reformaté |
| `cargo clippy --workspace --locked --offline --all-targets --all-features -- -D warnings` | **101** ; import historique `json` inutilisé visible dans le nouveau test de cache |
| Même commande Clippy avec `--keep-going` | **101** ; confirme aussi8 diagnostics applicatifs historiques ; aucune suppression/allow |
| `cargo-audit audit --db … --no-fetch --deny warnings --json` | **1 avant /1 après**, neuf avertissements persistants |
| `node node_modules/vite/bin/vite.js build` | 0 ; préparation du frontend embarqué, pas nouvelle installation pnpm ni suite Web |
| `cargo check --locked --offline -p rusqlite --target aarch64-linux-android --verbose` | 0 ; NDK28.2.13676358/API24, C compilé, `bundled`/`chrono` visibles dans rustc ; pas application complète |
| Syntaxe Python/Node, diff Git, archives/blobs/modes | Contrôlés sans mutation applicative supplémentaire |

Les 19 tests comprennent12 GLib (6 historiques VariantStrIter+6 Slice),2 HTTP historiques,4 SQLite et1 cache JSON. Le cache utilise le vrai module et un processus enfant isolé par APPDATA ; ce sous-processus n'ajoute pas un deuxième cas au décompte. Les casSQLite vérifient version et source_id réellement liés, chrono/Unicode, transaction/rollback/intégrité et WAL normal partagé/réouvert. **Aucun exploit ni test mémoire indéfinie.** Le cache JSON conserve les trois types de données et rejette les données invalides.

Les 15 négatifs SQLite rejettent : retour au verrou vulnérable, version annoncée sans vraie arête, dépendance h2 non autorisée, perte de bundled/chrono, suppression d’archive, empreinte historique altérée, manifeste imprévu, garde GLib désactivée, wrapper désactivé (contrôle direct), suppression du test SQLite, réintroduction de l’ancienne source, transformation altérée et les deux substitutions système. Mutations dans des copies temporaires, sans destruction du candidat.

Le profil release défini dans src-tauri reste signalé comme ignoré car il n'est pas à la racine du workspace : succès du profil Cargo effectif, **pas preuve de z/LTO**. Les avertissements tiers GLib sont conservés. La suite amont rusqlite/SQLite, Miri et sanitizers ne sont pas exécutés.

## Audits comparables et limites

Commande exacte sur chaque verrou : `cargo-audit audit --db <copie-RustSec> --no-fetch --deny warnings --json`, avec **contrôle des versions retirées non désactivé**, aucune ignore, aucun seuil modifié. Base fraîche clonée et identique avant/après : `e57e387b7eb75130ba53e800737107f46344bf2d`, **1 471 avis**. Le JSON de l'outil retourne last-commit/last-updated null ; le SHA est vérifié séparément par Git, pas inventé depuis le JSON.

| Audit | Avant | Après |
| --- | --- | --- |
| Vulnérabilités classées | 1 : RUSTSEC-2026-0459/sys 0.26.0 | 0 |
| Non maintenues | 7 | 7 identiques |
| Unsound | 2 | 2 identiques |
| Sortie stricte | 1 | 1 |

| Identifiant restant | Dépendance | Classe |
| --- | --- | --- |
| RUSTSEC-2024-0370 | `proc-macro-error 1.0.4` | unmaintained |
| RUSTSEC-2025-0134 | `rustls-pemfile 1.0.4` | unmaintained |
| RUSTSEC-2025-0081 | `unic-char-property 0.9.0` | unmaintained |
| RUSTSEC-2025-0075 | `unic-char-range 0.9.0` | unmaintained |
| RUSTSEC-2025-0080 | `unic-common 0.9.0` | unmaintained |
| RUSTSEC-2025-0100 | `unic-ucd-ident 0.9.0` | unmaintained |
| RUSTSEC-2025-0098 | `unic-ucd-version 0.9.0` | unmaintained |
| RUSTSEC-2024-0429 | `glib 0.18.5` | unsound |
| RUSTSEC-2026-0486 | `rustix 1.1.5` | unsound |

Le neuvième avertissement `rustix` est déjà présent dans **l'audit initial de cette mission** ; il ne doit pas être présenté comme causé par SQLite ni masqué par les chiffres des missions d'octobre. Le rétroport GLib ne modifie pas l'identité de version reconnue par RustSec. La disparition de l'avis SQLite est corroborée par les octets C corrigés, la résolution et le source_id exécuté ; elle ne prouve pas l'absence de toute vulnérabilité.

## Incidents et essais non concluants

- Avant interruption : premier clone terminal refusé par connexion proxy dans le sandbox ; reprise avec permission réseau limitée a réussi. TLS, certificats et protections restent actifs.
- Métadonnées après migration en `--offline` : échec 101 car les nouvelles crates n'étaient pas en cache. `cargo fetch --locked` borné a téléchargé les six crates ; métadonnées rejouées avec succès.
- Premier générateur de provenance : mauvais chemin du cache crate ; échec explicite corrigé avant création de SOURCES.json. Aucun faux résultat publié.
- rustfmt initialement absent : installé hors dépôt, puis contrôles exécutés.
- Première commande Android avec `-p rusqlite --features bundled,chrono` : 101, Cargo refuse de sélectionner les features d'un paquet externe au workspace. Commande corrigée sans ces arguments ; le graphe applicatif fournit bien les deux features, vérifiées dans la ligne rustc.
- Clippy global 101 et fmt 1 sont maintenus. Le nouveau test du cache reproduit aussi un diagnostic historique, sans corriger ce fichier hors périmètre. Aucun échec de test positif ou de garde final.

## Plateformes, CI et prochaine revue

Linux : builds/exécution des tests démontrés ; pas GUI native. Android ARM64 : seulement vérification ciblée de compilation rusqlite et SQLite C avec NDK/API24. **Pas APK/AAB, émulateur, appareil, GrapheneOS, ni application Android complète validés.** Windows/macOS/WASM : analyse des graphes et sources, pas compilation/exécution native ; les sources WASM 3.54.1 sont inspectées, pas testées. MSRV exact1.89 non exécuté. Les options SQLCipher demanderaient leur propre mission et correction.

À la lecture de #194 :31 checks, dont3 échecs CodeQL au SHA de base. Les workflows inchangés comportent toujours `continue-on-error` et des résumés trompeurs : un job vert ne valide pas audit, licence, build ou Clippy. La CI du nouveau SHA doit être consultée après création de la PR, avec état et journaux dans son descriptif/compte rendu ; **aucune anticipation d'un succès distant dans ce rapport prépublication**. Pas de dispatch manuel ni changement de workflow. Les essais locaux ne remplacent pas ces preuves CI.

**Action unique : revue indépendante par ChatGPT de la nouvelle PR en brouillon, au SHA exact, avant toute décision de fusion.** Aucun autre chantier commencé et aucune fusion autorisée.
