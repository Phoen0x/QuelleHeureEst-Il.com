# glib 0.18.5 — rétroport / backport

FR : copie intégrale de l'archive crates.io glib-0.18.5.crate, SHA-256 233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5. Les 121 fichiers publiés sont conservés. Seules deux lignes de src/variant_iter.rs changent : let mut p et &mut p, selon gtk-rs-core#1343, commit b5a4071e439bef2b5eea76c3aa25e5ae84839e34.

La configuration Cargo paths substitue ces sources sans changer l'entrée de registre du verrouillage. Le contrôle Scripts/check-rust-warnings-backport.py vérifie l'archive, tous les fichiers et le manifeste réellement utilisé. Les trois avertissements Rust restent visibles et bloquants dans l'audit strict. Les références sous docs/history ne sont pas des membres compilés du workspace.

EN: complete copy of the published crate archive with the SHA-256 above. All 121 files are retained. Only the exact upstream two-line VariantStrIter fix changes source code. Cargo paths selects the patched source while retaining the registry lock entry and advisory visibility. The preservation check verifies every file and the manifest actually selected by Cargo. Strict audits remain blocking on all three warnings.

Upstream fix: https://github.com/gtk-rs/gtk-rs-core/pull/1343
Report: ../docs/RUST_WARNINGS_20261013.md
