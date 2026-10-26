# QH-011 — Diagnostic Unicode, URLPattern et ICU — 26 octobre 2026

## Statut, autorité et provenance

Diagnostic Codex en lecture seule, sous orchestration de **ChatGPT V4**. Cette synthèse est rédigée lors de la mission ultérieure d'archivage documentaire sur **#186** ; ce n'est ni un rapport contemporain retrouvé sur disque, ni une nouvelle exécution des expériences, ni une autorisation d'implémentation. Les preuves originales disponibles sont distinguées des extraits dérivés et des raisonnements. Aucune modification de la branche applicative n'a été effectuée.

**Verdict : GO sous conditions pour une éventuelle mission d'implémentation ultérieure ; NO-GO pour une mise à jour mécanique ou une publication du candidat expérimental en l'état.** La disparition de cinq avertissements ne démontre pas la compatibilité des permissions.

| Référence revérifiée pour l'archivage | SHA |
|---|---|
| main | `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228` |
| [#183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183), code étudié | `f2eee4223a1ccf5b0866944580df8fd5979575dd` |
| #186, parent documentaire avant archivage | `d6ff395753f8af639cac9b7681f40356fbf4b8a3` |
| #187, suivi documentaire | `228e36a048926d77e84c9bb47863b84d07d2b924` |

Environnement des expériences : Debian 13.6 x86_64, Rust/Cargo **1.99.1**, cargo-audit **0.22.2**. Node 24.19.0 et pnpm 8.15.9 appartiennent à l'environnement préparé ; aucune nouvelle validation Web n'est attribuée à cette étude. Les bibliothèques GTK 3/WebKitGTK 4.1 sont installées hors des répertoires système. La préparation Linux est décrite dans le [guide de #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f2eee4223a1ccf5b0866944580df8fd5979575dd/docs/development/linux-environment-20261022.md).

Les sources Cargo inspectées sont tracées par leurs informations VCS et les verrous : Tauri 2.11.6, tauri-utils 2.9.3/2.10.2, URLPattern 0.3.0/0.6.0. Voir la [provenance](../reports/qh011-unicode-acl-20261026/source-provenance.json), le [mode d'emploi des preuves](../reports/qh011-unicode-acl-20261026/NOTICE.md) et le [second diagnostic ACL](DIAGNOSTIC_QH011_COMPATIBILITE_ACL_UNICODE_2026-10-26.md).

## Expériences et changements Cargo réellement observés

Une copie extérieure au dépôt a reçu `cargo update -p tauri-utils --precise 2.10.2`. Le dépôt original, son index et ses 302 fichiers suivis sont restés inchangés. Trois verrous expérimentaux sont archivés comme **données inertes `.lock.txt`**, jamais comme verrous actifs du dépôt documentaire : avant, après résolution brute et variante restaurant les arêtes collatérales.

Résultat exact : **504 → 509 identités de paquets, 13 sortantes et 18 entrantes**. L'[inventaire des changements](../reports/qh011-unicode-acl-20261026/unicode/dependency-delta.json) conserve leurs versions, sources, checksums et dépendances ; les verrous conservent les octets complets.

| Identités sortantes | Identités entrantes |
|---|---|
| cfb 0.7.3 | cfb 0.14.0 |
| ctor 0.8.0 ; ctor-proc-macro 0.0.7 | ctor 1.0.13 |
| dtor 0.3.0 ; dtor-proc-macro 0.0.6 | — |
| infer 0.19.0 | infer 0.22.0 |
| tauri-utils 2.9.3 | tauri-utils 2.10.2 |
| urlpattern 0.3.0 | urlpattern 0.6.0 |
| unic-char-property, unic-char-range, unic-common, unic-ucd-ident, unic-ucd-version : tous 0.9.0 | Chaîne ICU déjà présente par IDNA, désormais aussi utilisée par URLPattern |
| — | alloc-no-stdlib 3.0.0 ; alloc-stdlib 0.3.0 ; brotli 9.0.0 ; brotli-decompressor 6.0.1 |
| — | cssparser 0.37.0 ; cssparser-macros 0.7.1 ; dom_query 0.28.0 ; html5ever 0.39.0 ; markup5ever 0.39.0 ; selectors 0.38.0 |
| — | json-patch 4.2.0 ; jsonptr 0.7.1 ; web-time 1.1.0 |

Les douze fonctionnalités résolues de tauri-utils restent les mêmes dans la comparaison : `brotli`, `build-2`, `cargo_metadata`, `compression`, `html-manipulation-2`, `proc-macro2`, `quote`, `resources`, `schema`, `schemars`, `swift-rs`, `walkdir`. ICU properties passe de `compiled_data` à `compiled_data,default` ; son défaut active les données compilées. Ctor change de version et de mécanisme de fonctionnalités : aucune équivalence native universelle des constructeurs n'est déduite d'un build Linux.

La famille Tauri reste **2.11.6**, runtime **2.11.3**, build/codegen/macros **2.6.3**. Un premier harnais non verrouillé a sélectionné des membres Tauri plus récents et échoué avec **19 erreurs** E0308/E0277/E0599. Cet échec est conservé par [extrait de diagnostic](../reports/qh011-unicode-acl-20261026/unicode/logs/runtime-new-unpinned-failure-excerpt.json), sans prétendre qu'il prouve une incompatibilité de la migration verrouillée. Le harnais ensuite fixé sur la famille correcte compile.

### Changements collatéraux à empêcher ou justifier

La résolution brute modifie six blocs de paquets communs, représentant sept substitutions d'arêtes :

| Paquet | Ancienne résolution → résolution brute |
|---|---|
| tempfile 3.27.0 | getrandom 0.4.3 → 0.3.4 ; windows-sys 0.61.2 → 0.52.0 |
| winreg 0.56.0 ; dirs-sys 0.5.0 | windows-sys 0.61.2 → 0.59.0 |
| winapi-util 0.1.11 ; rustix 1.1.5 ; errno 0.3.14 | windows-sys 0.61.2 → 0.52.0 |

Une variante temporaire restaure les six blocs initiaux exacts. `cargo metadata --locked --offline --all-features` y réussit et les variations de fonctionnalités Windows collatérales disparaissent. **Cette variante n'a pas été compilée.** Elle ne doit pas hériter des résultats du candidat brut.

## Unicode : versions, comportements et limites

Les tables UNIC étudiées utilisent **Unicode 10**. Les données ICU 2.3 inspectées correspondent à **Unicode 17**, avec provenance ICU4X `a14f2dad852be26bad277ae704abf27a15cbfed1`. Le comparateur distinct unicode-ident 1.0.27 annonce Unicode **18** et fournit des propriétés **XID**, pas les propriétés **ID** utilisées par URLPattern. Il n'est donc pas un substitut équivalent.

Le balayage exécuté des **1 112 064 valeurs scalaires** compte 20 582 ajouts et zéro retrait pour ID_Start, 21 132 ajouts et zéro retrait pour ID_Continue. Ce balayage de propriétés n'est pas un million de tests ACL, ni une preuve d'équivalence du parsing URLPattern.

| Caractère | Observation |
|---|---|
| U+11F00, Unicode 15 | Nouveau ID_Continue, pas ID_Start : peut prolonger un ancien nom de groupe et absorber un suffixe anciennement littéral. |
| U+11F02, Unicode 15 | Nouveau début de nom accepté. |
| U+1C89, Unicode 16 | Nouveau début de nom accepté. |
| U+309B, Unicode 1.1 | ID_Start accepté dans les deux chaînes ; XID_Start faux. Une restriction aux XID casserait un comportement légitime. |
| U+200C/U+200D | Changements des propriétés ID, mais exceptions explicites déjà présentes dans l'ancien tokenizer : pas de changement URLPattern dans les cas contrôlés. |

Les différences ne se limitent pas aux tables Unicode : le nouveau tokenizer ignore TAB/LF/CR dans les contextes observés et utilise des indices UTF-8 là où l'ancien employait des indices en caractères. Parsing, quantificateurs, noms partiels, noms dupliqués, captures et erreurs font partie du contrat de compatibilité.

## Matrice exécutée

Les vraies API `RemoteUrlPattern` et `RuntimeAuthority::resolve_access`, ainsi que les API brutes URLPattern pour les captures, ont été utilisées dans des harnais séparés. Les [fixtures](../reports/qh011-unicode-acl-20261026/unicode/cases.json) contiennent **659 enregistrements, 648 couples textuels distincts correspondant à 647 couples motif/URL normalisés distincts**, dont les 27 cas historiques. Les doublons et les exécutions sur deux versions ne sont pas additionnés comme nouveaux cas. Précision établie pendant l’archivage : le nombre historique 647 utilise les URL normalisées enregistrées par les harnais, pas les chaînes brutes des fixtures. La normalisation des segments pointés et la conversion IDNA expliquent les différences de représentation ; les données originales ne sont pas réécrites.

| Corpus | Résultat |
|---|---|
| 27 couples historiques | 24 équivalences, 3 divergences |
| 647 couples normalisés distincts | 534 équivalences, 113 divergences |
| Répartition des 113 divergences | 68 changements d'acceptation, 45 matching faux → vrai ; aucun vrai → faux observé dans ce corpus |

Exemples décisifs : `/:` suivi de U+11F02 ou U+1C89 est rejeté avant et accepté après ; `/:a` suivi de U+11F00 est accepté dans les deux versions mais passe de refus à autorisation pour `/value`. Pour une URL portant le suffixe encodé, les deux matchent, mais l'ancien capture `a=value` et le nouveau capture le nom prolongé avec une valeur comprenant le suffixe encodé. Un motif dupliquant anciennement `a` devient valide lorsqu'un des noms est prolongé. Les erreurs de `/:é:` passent de l'indice 3 à 4, celles de `/:東京:` de 4 à 8.

Les essais sont bornés : 20 secondes murales, 10 secondes CPU, 1 Gio pour les principaux exécutables ; le balayage des propriétés utilise 256 Mio. Les cinq exécutables consignés dans [bounded-run-status.json](../reports/qh011-unicode-acl-20261026/unicode/bounded-run-status.json) terminent avec sortie 0. Le second diagnostic rejoue le corpus brut et étend les essais : voir son rapport pour les comptes distincts.

## ACL et portée de sécurité

`RemoteUrlPattern` remplace les composants chemin/recherche/fragment vides concernés par des jokers avant construction. Sa logique d'enveloppe ne fournit pas de compatibilité historique lorsque le moteur sous-jacent change. Les capacités distantes finissent par appeler ce matching dans le résolveur Tauri.

Un élargissement synthétique de permission a été reproduit avec Tauri 2.11.6, commande de test, fenêtre autorisée et origine distante contrôlée. Aucune commande sensible réelle ni attaque WebView n'a été exécutée. Aucun usage ACL distant explicite n'a été trouvé dans le projet examiné. **L'exploitabilité de l'application n'est pas démontrée** ; l'absence d'usage trouvé ne prouve pas une sûreté universelle.

## Compilation, plateformes et audits historiques réellement retrouvés

| Vérification pendant le diagnostic 1 | Résultat / portée |
|---|---|
| `cargo test --workspace --locked` dans la copie migrée | Sortie 0 : six tests GLib et deux HTTP ; tests unitaires applicatifs : zéro. |
| `cargo test --workspace --release --all-features --locked` | Sortie 0 : les mêmes huit cas distincts, pas seize nouveaux tests. |
| Métadonnées filtrées Linux, Android, Windows, macOS, iOS, wasm, avec/sans toutes fonctionnalités | 24 résolutions réussies ; aucun build natif de ces autres plateformes. |
| Rust 1.90 exact | Non installé/testé ; nouveau MSRV déclaré par tauri-utils 2.10.2. Compilation réalisée avec 1.99.1. |
| Tests Web, nouvelle compilation frontend, GUI native, Android/Windows/macOS/iOS | Non exécutés par ce diagnostic. Le dist utilisé par les builds provenait de l'environnement précédent. |

Les comptes de nœuds résolus par défaut/toutes fonctionnalités sont respectivement : Linux 373/376 → 372/375 ; Android 326/329 → 331/334 ; Windows 341/344 → 341/344 ; macOS 339/341 → 338/340 ; iOS 330/332 → 329/331 ; wasm 280/283 → 279/282. Les sources, cibles, fonctionnalités et arêtes figurent dans les extraits normalisés sous `unicode/graphs/`. Leur transformation est décrite dans la provenance ; les métadonnées brutes complètes ne sont pas redistribuées.

Attention GLib : exécuter Cargo depuis le projet ou passer explicitement `--config <PROJECT>/.cargo/config.toml`. `--manifest-path` seul depuis l'extérieur peut utiliser la source de registre non rétroportée. Les expériences applicatives de cette étude ont utilisé leur copie correcte de cette configuration.

Les [audits JSON et leurs sorties](../reports/qh011-unicode-acl-20261026/unicode/audit-summary.json) établissent :

- avant : zéro vulnérabilité classée, **huit avertissements**, sortie **1** ;
- après : zéro vulnérabilité classée, **trois avertissements**, sortie **1** ;
- cinq avis UNIC `unmaintained` disparaissent seulement du graphe expérimental ;
- restent **RUSTSEC-2024-0429 glib 0.18.5**, **RUSTSEC-2024-0370 proc-macro-error 1.0.4**, **RUSTSEC-2025-0134 rustls-pemfile 1.0.4** ; aucun ignore ajouté.

Base retrouvée : RustSec `21d909e4c8bd4e14c7aea58bf980c881a0053ab1`, 1 352 avis. Les JSON d'audit ont `last-commit: null` ; le SHA est corroboré par le dépôt local de la base, pas inventé dans les résultats JSON. Ces audits ne sont pas relancés lors de l'archivage et ne décrivent pas nécessairement l'état futur du service.

## Conservation et décision ultérieure

Les 13 identités sortantes, les anciens verrous et leurs checksums doivent rester dans des archives exploitables, sans réactivation des anciennes dépendances dans le graphe actif. Les variantes, commentaires, tests, code fantôme, configurations et fonctionnalités existants doivent être préservés. La variante sans réorientations collatérales doit être compilée et testée avant toute adoption. Rust 1.90 et les plateformes natives restent à valider.

La recommandation technique est précisée par le diagnostic ACL : règles versionnées, validation bloquante des compatibilités non établies et décisions humaines explicites sur les changements. **QH-011/T-003 demeurent partiels et ouverts.** Aucune migration n'est autorisée par ce rapport ; retour à ChatGPT V4 pour revue indépendante avant toute nouvelle mission.
