# Archive QH-011 — Admission atomique Tauri — 26 octobre 2026

## Nature et inventaire

Archive documentaire de sondes déjà exécutées ; aucune intégration ni nouvelle campagne technique. [Synthèse d'archivage](../../ai/FAISABILITE_QH011_ADMISSION_ATOMIQUE_TAURI_2026-10-26.md), [rapport original exact](original/REPORT.md), [hypothèses originales](original/DESIGN.md).

- `original/` : REPORT, DESIGN et manifeste initial de 179 empreintes, octets exacts.
- `probe/` : Cargo.toml, Cargo.lock, configuration et cinq sources Rust originaux en `.txt`. Données inertes, hors workspace actif.
- `experimental/` : module nouveau original et différences des trois fichiers Tauri modifiés, en `.txt` ; preuve historique, pas patch produit ni fork publié.
- `logs/` : sorties complètes des tests et quatre sondes de compilation, stderr de compilation et métadonnées. Les chemins techniques d'environnement sont remplacés dans les logs ; aucune ligne d'avertissement n'est retirée.
- `records/` : codes, observations, intégrité originale, références, inventaires des sources Tauri avant/après et extraction de provenance/graphe Cargo.
- `third-party-notices/` : licences MIT/Apache-2.0 et origine VCS Tauri conservées exactement comme données documentaires. Sources complètes tierces non redistribuées.
- [source-inventory.json](source-inventory.json) : chacune des 179 pièces vérifiées, empreinte, octets publiés ou omis et raison. Un digest ne conserve pas les octets omis.
- [archive-provenance.json](archive-provenance.json) : correspondance source/archive et transformations explicites.
- [MANIFEST.json](MANIFEST.json), [PUBLICATION.json](PUBLICATION.json), [VALIDATION.json](VALIDATION.json) : empreintes, identités Git, conservation et contrôles de cette mission.

Les fichiers originaux conservés n'ont pas été modernisés silencieusement. Le rapport original et la configuration Cargo contiennent des chemins techniques génériques de la machine éphémère ; ils ne sont pas des chemins personnels ni une garantie de disponibilité future. Dans les logs : racine expérimentale → `<EXPERIMENT>`, checkout GLib → `<PROJECT>`, outils Cargo → `<CARGO_HOME>`, activation → `<ENVIRONMENT>`. Le graphe normalisé conserve identités, fonctionnalités et arêtes kind/target, sans chemins machine. Les hashes sources restent ceux des octets avant transformation.

## Pièces omises et disponibilité

La copie complète de Tauri reste locale : seuls son inventaire, les différences étroites et le nouveau module sont archivés. Les fichiers complets de métadonnées Cargo, messages JSONL du compilateur et inventaire du checkout original restent temporaires, avec empreintes ; les extraits pertinents sont publiés. Pas de cache, binaire, dump, conversation privée, données personnelles ou paramètre réseau privé. Aucune pièce indispensable retrouvée n'est remplacée par une preuve inventée. Les cinq observations JSON sont les seules traces autonomes avant/après émises.

## Résultats historiques à lire correctement

13 tests runtime : 13 PASS, zéro FAIL/ignoré, sortie 0. Quatre compilations d'exemples : `forge_token` 101/E0451, `manager_fence` 101/E0616, `direct_fence` 101/E0624, `context_still_open` 0. La dernière confirme un contournement encore non fermé, pas une admission générale réussie. Ressources historiques runtime : 30 s murales, 10 s CPU, 1 Gio d'espace d'adressage, core désactivé. Compilation de tests : sortie 0 ; exemples séparés car trois doivent échouer.

## Procédure de reproduction ultérieure — non rejouée pendant l'archivage

La procédure suivante est une reconstruction documentée à partir des sources/traces retrouvées, **non testée dans un environnement entièrement neuf**. Elle ne garantit ni disponibilité des registres ni compatibilité native multiplateforme.

1. Choisir un répertoire neuf hors de tout checkout original. Préparer Rust/Cargo 1.99.1 et les bibliothèques Linux GTK3/WebKitGTK4.1 et prérequis. Le guide environnement est sur #183, `docs/development/linux-environment-20261022.md`, commit `f2eee4223a1ccf5b0866944580df8fd5979575dd`. Ne pas désactiver TLS ou protections pour installer.
2. Acquérir les sources officielles de Tauri 2.11.6 avec le checksum du Cargo.lock archivé et contrôler leurs hashes contre `records/tauri-source-before.json`. Ne pas recopier un cache complet dans Git. Acquérir séparément le vendor GLib corrigé du même SHA #183 ; conserver ses licences. Les autres versions exactes sont dans le verrou expérimental.
3. Dans cette copie temporaire uniquement, reproduire les trois différences de `experimental/local-tauri.diff.txt` et copier le module `experimental/atomic_admission_probe.rs.txt` vers `src/ipc/atomic_admission_probe.rs`. Comparer tous les fichiers de la copie à `records/tauri-source-after.json`. Les trois restrictions/modifications et le module sont des preuves expérimentales, pas une autorisation d'intégration.
4. Reconstituer le crate `probe` depuis les fichiers `.txt`, en retirant uniquement ce suffixe. Adapter **explicitement** les deux chemins de `probe/.cargo/config.toml.txt` vers la copie Tauri et le vendor GLib corrigé. Cette adaptation change les octets du fichier de reproduction : conserver la configuration d'archive intacte. Le dossier actif n'appartient jamais au dépôt documentaire.
5. Depuis ce crate, charger l'environnement natif préparé, puis charger explicitement sa configuration Cargo :

```sh
timeout --kill-after=5s 180s cargo --config ./.cargo/config.toml test --lib --locked --offline --no-run --message-format=json
```

Le mode offline exige les paquets préalablement disponibles et vérifiés. Ne pas utiliser `cargo update`. Vérifier par les métadonnées que Tauri et GLib viennent des copies prévues. `--manifest-path` seul ne garantit pas le chargement de la configuration GLib.

6. Identifier l'exécutable de test dans la sortie `compiler-artifact` JSON pour ce crate. L'exécuter avec `--nocapture --test-threads=1` dans un processus enfant borné : timeout mural 30 s, RLIMIT_CPU 10, RLIMIT_AS 1073741824, RLIMIT_CORE 0. Ces limites sont celles du résultat historique ; selon les bibliothèques de la machine, un échec de ressources doit être signalé, pas masqué. Attendre exactement 13 tests, dont les assertions de concurrence et de scopes.
7. Vérifier séparément les exemples, sans lancer `cargo test --all-targets` qui mélangerait les compilations négatives :

```sh
timeout --kill-after=5s 90s cargo --config ./.cargo/config.toml check --example forge_token --locked --offline
timeout --kill-after=5s 90s cargo --config ./.cargo/config.toml check --example manager_fence --locked --offline
timeout --kill-after=5s 90s cargo --config ./.cargo/config.toml check --example direct_fence --locked --offline
timeout --kill-after=5s 90s cargo --config ./.cargo/config.toml check --example context_still_open --locked --offline
```

Attendre respectivement 101/E0451, 101/E0616, 101/E0624 et 0 ; vérifier la cause, pas seulement le code. Les avertissements doivent rester visibles. Aucun audit, moteur Unicode, transport codegen/cible, release, MSRV exact 1.90, GUI ou plateforme native autre que Linux n'est validé par cette reproduction ciblée.

## Vérification de l'archive

`python3 verify.py` ne compile ni ne rejoue les sondes : il contrôle les fichiers, empreintes, provenance, comptages et codes archivés. Le manifeste s'exclut lui-même ; ses identités sont données dans le compte rendu. Les règles et avis de sécurité ne sont pas modifiés. QH-011/T-003 restent ouverts ; le NO-GO Unicode précédent conserve ses deux échecs.
