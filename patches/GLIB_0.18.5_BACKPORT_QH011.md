# GLib 0.18.5 — rétroport VariantStrIter QH-011

Copie complète des **121 fichiers** de l'archive officielle crates.io, conservée dans
`docs/history/glib-qh011-20261023/glib-0.18.5.crate`.
SHA-256 : `233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5`.

Seuls `let mut p` et `&mut p` changent dans `src/variant_iter.rs`, selon
[gtk-rs-core#1343](https://github.com/gtk-rs/gtk-rs-core/pull/1343), commit
`b5a4071e439bef2b5eea76c3aa25e5ae84839e34`.
Le rétroport distinct PtrSlice de #153 **n'est pas importé** ; ce fichier reste
identique à l'archive officielle, comme tous les autres fichiers hors VariantStrIter.

La substitution Cargo `paths` conserve le nom/version GLib, l'entrée de registre,
son checksum et les avertissements RustSec. Aucun `[patch.crates-io]`, ignore ou
scanner modifié. `Scripts/check-glib-qh011.py` compare chaque fichier à l'archive,
les graphes/features à la référence et la source effectivement sélectionnée.

Lancer Cargo depuis la racine du dépôt ou `src-tauri`, notamment avec la CLI Tauri.
Depuis un autre répertoire, Cargo ne découvre pas automatiquement la configuration
du dépôt : revenir dans le dépôt, ou passer explicitement
`--config /chemin/du/depot/.cargo/config.toml` et `--manifest-path`.
Un `--manifest-path` seul depuis l'extérieur peut utiliser la source de registre
non corrigée ; ce contexte n'est pas une invocation validée du projet.

FR : les sources, métadonnées, dépendances, fonctionnalités, licences et commentaires
publiés sont conservés ; la crate est exclue des membres du workspace applicatif.
EN: published sources, metadata, dependencies, features, licenses and comments are
preserved; the crate is excluded from application workspace members.

Ce rétroport corrige le défaut mémoire localement ; **glib 0.18.5 reste signalé par
RUSTSEC-2024-0429**. Il ne constitue pas une nouvelle version officielle corrigée.
Voir [le rapport](../docs/reports/glib-qh011-20261023.md).
