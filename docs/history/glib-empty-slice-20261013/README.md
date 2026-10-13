# Archive du rétroport GLib Slice vide — 13 octobre 2026

## Français

Les variantes précédentes sont conservées intégralement : le fichier ptr_slice.rs avant correction et le contrôleur de conservation avant extension. Elles ne sont pas des cibles du workspace Cargo et ne doivent pas être réactivées automatiquement.

Le correctif fonctionnel provient de gtk-rs/gtk-rs-core, commit b31265df94876febf259089a19de9c23d2468214. conversion-before.rs.txt et conversion-after.rs.txt permettent au contrôleur actif de vérifier l'unique remplacement autorisé, avec empreintes SHA-256 fixées. La variante publiée originale reste aussi dans docs/history/rust-warnings-20261013/glib-0.18.5.crate.

La proposition historique docs/security/proposals/UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch reste inchangée : son nom décrit son état lors de la mission précédente. Le nouveau rapport décrit son application et les validations actuelles.

Aucune dépendance, option, archive antérieure, règle d'audit, politique de licences ou workflow n'est remplacé dans cette archive. Le backport VariantStrIter précédent reste autorisé et vérifié.

## English

The previous complete ptr_slice.rs and preservation checker are retained as inactive history outside Cargo workspace targets. The exact allowed conversion-body replacement is pinned by SHA-256 and linked to upstream commit b31265df94876febf259089a19de9c23d2468214. Existing historical archives and the original inactive proposal remain unchanged. See the new backport report for current execution results.
