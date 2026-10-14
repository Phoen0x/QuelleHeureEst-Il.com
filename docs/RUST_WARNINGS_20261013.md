# Avertissements Rust — 13 octobre 2026

## Français

Cette intervention sur la PR #153 traite RUSTSEC-2024-0370 (proc-macro-error), RUSTSEC-2025-0134 (rustls-pemfile) et RUSTSEC-2024-0429 (glib). Elle ne modifie ni JavaScript, ni l'approbation automatique, ni la politique de licences.

### Corrections et blocages

**Le défaut de mémoire de glib peut être corrigé localement, mais les trois avertissements de registre restent visibles.** Aucun avis n'est ignoré, aucun paquet n'est retiré du verrouillage et aucun nom/version n'est modifié pour échapper aux outils.

| Paquet initial | Origine | Analyse |
| --- | --- | --- |
| proc-macro-error 1.0.4 | glib-macros 0.18.5 et gtk3-macros 0.18.2, via GTK/Tauri | Avis de non-maintenance ; aucune version corrigée annoncée |
| rustls-pemfile 1.0.4 | Dépendance optionnelle historique directe de quelleheureest | Avis de non-maintenance pour toutes les versions ; aucun usage dans les sources applicatives actuelles |
| glib 0.18.5 | GTK 0.18 et les liaisons de la pile GTK/WebKit/Tauri | Comportement indéfini dans VariantStrIter ; version officiellement corrigée >=0.20 |

Les chaînes exactes sont relevées avec cargo tree --locked --target all --all-features. Le drapeau all-features est nécessaire pour rendre visible la dépendance rustls-pemfile optionnelle.

#### proc-macro-error

[RUSTSEC-2024-0370](https://rustsec.org/advisories/RUSTSEC-2024-0370.html) décrit un projet non maintenu, et non un défaut avec un correctif publié : patched = []. RustSec propose manyhow ou proc-macro2-diagnostics comme alternatives. Leur adoption implique de migrer les macros des bibliothèques GTK en amont, pas simplement de changer la version dans Cargo.lock.

Sous la contrainte de conserver le paquet historique, même optionnel, son avis reste signalé par les outils. Ajouter une alternative en conservant proc-macro-error dans le graphe ne résoudrait pas cet avertissement. Aucun remplacement artificiel, alias trompeur ou version fictive n'est utilisé.

#### rustls-pemfile

[RUSTSEC-2025-0134](https://rustsec.org/advisories/RUSTSEC-2025-0134.html) indique que le dépôt est archivé et que toutes les versions restent concernées (patched = []). Une mise à jour vers la dernière enveloppe rustls-pemfile ne corrigerait donc pas l'avis de non-maintenance.

Le successeur recommandé est rustls-pki-types >=1.9, trait PemObject ; rustls-pki-types est déjà présent dans le verrouillage. La pile HTTP applicative a déjà été migrée vers Reqwest 0.12 dans l'intervention h2. Aucun appel à rustls-pemfile n'existe dans src-tauri/src ; le paquet reste uniquement une référence optionnelle volontaire. Sa déclaration =1.0.4 et optional = true est conservée intégralement, comme demandé.

#### glib

[RUSTSEC-2024-0429](https://rustsec.org/advisories/RUSTSEC-2024-0429.html) concerne next, nth, last, next_back et nth_back de VariantStrIter. Un pointeur initialement NULL était passé comme référence immutable à g_variant_get_child, qui écrit dedans via un argument variadique. Cela viole les règles Rust et peut provoquer un accès NULL avec optimisations.

Le correctif exact de [gtk-rs/gtk-rs-core#1343](https://github.com/gtk-rs/gtk-rs-core/pull/1343), commit b5a4071e439bef2b5eea76c3aa25e5ae84839e34, consiste à remplacer let p par let mut p, puis &p par &mut p. Aucune autre ligne du paquet publié ne change.

Tauri 2.12.3, dernière version stable vérifiée, impose gtk 0.18. GTK 0.18 et la pile associée imposent glib 0.18. Une tentative réelle cargo update -p glib --precise 0.20.0 est rejetée par le solveur. GTK 0.19 utilise désormais gtk-rs-core 0.22, mais ne satisfait pas les contraintes GTK 0.18 de Tauri et de ses autres dépendances. Une migration de toute cette pile ne constitue pas une mise à jour compatible isolée.

Le paquet glib 0.18.5 complet est donc conservé sous vendor/glib-0.18.5, avec une substitution de sources Cargo par paths et le nom/version original. Il est exclu des membres du workspace pour garder ses références et tests amont sans les activer automatiquement. Un test Linux direct utilise le même paquet que Tauri pour exercer toutes les opérations affectées, y compris en release.

### Origine, reproductibilité et conservation

L'archive officielle glib-0.18.5.crate est conservée sous docs/history/rust-warnings-20261013. Son SHA-256 est `233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5`, identique au checksum du verrouillage initial. Tous les fichiers de l'archive sont copiés, sans nettoyage. Le contrôle Scripts/check-rust-warnings-backport.py compare chaque octet de chaque fichier avec l'archive, sauf les deux changements exacts autorisés dans src/variant_iter.rs. Les commentaires et métadonnées originaux restent inchangés.

Cargo.toml, Cargo.lock, src-tauri/Cargo.toml et la CI Rust initiaux sont archivés. Toutes les dépendances initiales, leurs fonctionnalités et les déclarations optionnelles sont conservées. Le contrôle de conservation h2 existant continue également de s'exécuter.

La configuration .cargo/config.toml utilise un vrai rétroport de source via paths, mécanisme Cargo prévu pour les petites corrections sans changement du graphe de dépendances. L'entrée glib du verrouillage, y compris sa source de registre et son checksum d'origine, reste identique ; cargo metadata doit en parallèle prouver que le code compilé provient bien du répertoire vendor. Elle ne revendique pas une version glib >=0.20. Les audits conservent le droit de signaler glib 0.18.5 ; leur état n'est pas présenté comme vert pour cette raison.

Une première configuration par [patch.crates-io] a été testée puis **rejetée** : les outils omettaient automatiquement l'avis glib sur le paquet devenu local. Elle n'est pas retenue dans la correction active. La configuration paths évite cette perte d'identité de registre. La [documentation Cargo](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html#paths-overrides) précise que cette substitution ne peut pas changer les dépendances du paquet ; la comparaison exhaustive de l'archive respecte cette contrainte.

La compilation doit être lancée depuis le dépôt, comme dans la CI, pour charger sa configuration Cargo. Les commandes --manifest-path lancées depuis un répertoire extérieur ne chargent pas automatiquement .cargo/config.toml. Le contrôle permanent vérifie le manifeste réellement sélectionné, au lieu de présumer que le rétroport a été utilisé.

### Vérifications

[Validation du candidat n°38354572622](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38354572622/job/115154338603), Ubuntu 22.04, Rust stable 1.99.0 :

| Contrôle | Résultat réel |
| --- | --- |
| Migration isolée glib 0.20 | Rejet du solveur : gtk exige ^0.18 |
| Archive + fichiers du rétroport | 121 fichiers conservés, deux lignes amont modifiées |
| Dépendances | 446 noms et 491 entrées de versions conservés |
| Entrée glib du verrouillage | Identique à la référence : version, registre, checksum et dépendances |
| Source réellement résolue | cargo metadata sélectionne vendor/glib-0.18.5 |
| cargo fmt --all -- --check | Réussi |
| cargo build --workspace --locked | Réussi |
| cargo test --workspace --locked | 8 tests d'intégration réussis : 6 GLib + 2 HTTP ; 0 échec ; binaire sans tests unitaires |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Réussi |
| cargo build --workspace --release --locked | Réussi |
| cargo test --workspace --release --locked | Les mêmes 8 tests réussissent avec optimisations |
| Marqueurs historiques dans dist/ et binaire release | Contrôle réussi |
| cargo audit (0.22.2) | Code 0 ; 0 vulnérabilité bloquante, 3 avertissements visibles |
| cargo audit --deny warnings | Code 1 : les 3 avis initiaux restent bloquants |
| cargo deny check, action v2, politique inchangée | advisories FAILED, licenses FAILED ; bans et sources OK |

L'audit JSON confirme une liste d'exclusions vide et les trois IDs RUSTSEC-2024-0370, RUSTSEC-2025-0134 et RUSTSEC-2024-0429. **Aucun avertissement n'est éliminé du registre**, même si le défaut de code glib est corrigé. RUSTSEC-2026-0258 h2 reste absent.

Cargo-deny émet l'erreur de non-maintenance proc-macro-error dans la vue de résolution par défaut de l'action existante. Cargo audit conserve aussi la couverture de rustls-pemfile optionnel et de l'entrée glib de registre. Les erreurs de licences sont constatées et laissées inchangées, sans ajout d'autorisation, d'exception ou de modification de politique.

Le workflow du candidat reste en échec pour refléter les audits bloquants. Ses étapes diagnostiques poursuivent l'export des preuves ; le bilan final échoue. La première tentative par patch local est archivée comme configuration rejetée. La seconde, via paths, est la seule configuration retenue.

La CI Rust permanente exécute le contrôle de conservation/source ainsi que les tests debug et release. Le générateur de candidat devient manuel après validation. Le terminal local ne dispose pas de Cargo et son accès au proxy échoue ; les compilations et audits revendiqués ci-dessus sont exécutés dans GitHub Actions, pas localement.

### Limites

La validation couvre la compilation native Linux et les itérateurs GLib en debug/release, ainsi que les tests HTTP locaux existants. Elle ne constitue pas une compilation APK ni une validation sur appareil Android ou un test complet de l'interface GTK.

Les deux avertissements de non-maintenance ne peuvent pas être éliminés tout en conservant les paquets concernés dans le graphe, y compris comme dépendances optionnelles. Le défaut glib est réellement corrigé par le rétroport testé, mais son avertissement de registre persiste tant qu'une migration complète vers une version reconnue >=0.20 n'est pas compatible avec la pile Tauri utilisée.

## English

This work preserves all original dependencies, optional declarations, comments and historical files. proc-macro-error and rustls-pemfile advisories mark entire unmaintained package lines, with no patched releases. Keeping those packages in the dependency graph necessarily keeps their warnings visible. rustls-pemfile is only a deliberate optional reference; there is no active application API to migrate.

The glib VariantStrIter memory-safety defect is addressed by the exact two-line upstream fix from gtk-rs-core#1343, backported onto the complete, checksum-verified glib 0.18.5 package. Name and version remain unchanged. Tauri's GTK 0.18 constraints reject an isolated upgrade to glib 0.20. The original crate archive is retained and every vendored file is verified against it. Debug and optimized release regressions cover all affected iterator operations. No advisory suppression, dependency deletion, automatic-approval change, JavaScript change or license-policy change is introduced.
