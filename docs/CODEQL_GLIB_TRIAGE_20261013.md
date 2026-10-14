# Analyse des quatre alertes CodeQL GLib — 13 octobre 2026

## Français

**Conclusion : les quatre résultats examinés sont des faux positifs des chemins reconstruits par CodeQL. Aucun correctif de code tiers n'est nécessaire pour ces quatre chemins. Aucune alerte n'est supprimée, ignorée ou déclarée automatiquement résolue.**

Les conclusions portent sur les règles, positions et chemins suivants, pas sur toutes les API GLib ni sur toutes les alertes du dépôt.

| Repère | Règle | Position primaire | Classification |
| --- | --- | --- | --- |
| QL-1 | rust/cleartext-logging | vendor/glib-0.18.5/src/log.rs:85 | Faux positif : conversion booléenne et niveau de log incompatibles |
| QL-2 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/subclass/boxed.rs:76 | Faux positif : trait générique mal associé ; dérivation dans un module cfg(test) |
| QL-3 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/value.rs:462 | Faux positif : pointeur de chaîne associé à un GValue, sortie C non modélisée |
| QL-4 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/value.rs:470 | Faux positif : GError associé à GValue, garde non-null et sortie C non prises en compte |

### Preuves et limites de l'identification

La branche initiale est ded44f5f3ce41e5f6d092ca54f139a594c76fd8a. Le check GitHub CodeQL 115167665623 annonce six alertes au total. Le connecteur permet de consulter les checks, mais bloque les endpoints des alertes/annotations ; les analyses existantes ne conservaient pas le SARIF en artefact.

Un **nouveau diagnostic CodeQL dédié** exporte donc les résultats sans modifier les workflows existants, leurs règles, leurs seuils ou leurs permissions. Il utilise Rust en build-mode none et les requêtes par défaut de CodeQL. upload: false évite de publier un autre état ou de remplacer une analyse existante ; le SARIF complet reste disponible et aucun résultat n'est filtré dans ce fichier.

[Diagnostic n°38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513), commit d5e75292ed3caca6110c9ab4f740df33d5b096d8, CodeQL CLI 2.27.2. Le replay produit sept résultats Rust, dont les quatre positions demandées. Les trois autres positions ne sont pas qualifiées dans cette mission. Ce compte rendu n'assimile pas le nombre de résultats du replay au nombre d'alertes nouvelles affichées par GitHub.

Le [SARIF complet, artefact 11828886142](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/artifacts/11828886142) a l'empreinte SHA-256 4772fa6e1b0cf0767ea89172b14e1c9aef4054ea118d28f9986a76c561baf540. Les quatre résultats complets, avec codeFlows et relatedLocations, sont conservés dans docs/security/CODEQL_GLIB_EVIDENCE_20261013.json.

Les numéros d'alertes GitHub individuels n'ont pas été récupérés ; les repères QL-1 à QL-4 sont des identifiants de ce rapport, pas des numéros GitHub inventés. L'identification vérifiable utilise la règle, l'URI, la ligne et le chemin SARIF.

### QL-1 — log.rs:85

Le sink est :
```rust
panic!("Unknown log level: {value}")
```
Il appartient à impl FromGlib<u32> for LogLevel. Le chemin SARIF commence à g_uuid_string_is_valid dans auto/functions.rs:857, passe par translate.rs:1413–1414, puis sélectionne cette conversion de niveau de log.

Le wrapper uuid_string_is_valid a un type de retour **bool**. La fonction C renvoie gboolean, un entier signé C ; son impl Rust est FromGlib<ffi::gboolean> for bool. La conversion LogLevel attend au contraire **u32** et produit LogLevel. La résolution Rust concrète ne peut pas choisir FromGlib<u32> for LogLevel pour remplir le retour bool du wrapper UUID : le chemin reconstruit confond des implémentations de trait générique incompatibles.

De plus, le résultat du prédicat est une validation de format UUID, pas le contenu de l'UUID. Le panic du niveau de log formate un masque numérique. Le résultat ne démontre donc ni circulation d'un secret vers ce panic, ni journalisation d'un secret applicatif.

Test : validation UUID valide/invalide avec résultats typés bool, et conversion indépendante d'un masque Debug u32 vers LogLevel. Aucun journal de secret n'est produit.

### QL-2 — subclass/boxed.rs:76

La position primaire est la **dérivation de MyBoxed**, dans :
```rust
#[cfg(test)]
mod test {
    #[derive(Clone, Debug, PartialEq, Eq, glib::Boxed)]
    #[boxed_type(name = "MyBoxed")]
    struct MyBoxed(String);
}
```
Elle n'est pas une preuve que boxed_copy reçoit un pointeur NULL dans l'application.

Deux chemins représentatifs commencent par charset = ptr::null() avant g_get_console_charset (auto/functions.rs:344–347), ou out_charset = ptr::null() avant g_get_charset (manual_functions.rs:217–219). Ils passent ensuite par le helper générique from_glib_none et atterrissent sur l'implémentation synthétisée pour MyBoxed.

Les wrappers de charset convertissent une **chaîne gchar** vers GString ou Option<&GStr>. Ils ne demandent pas un MyBoxed(String). Le retour concret et les types de pointeurs/traits ne sélectionnent pas la dérivation MyBoxed. Le modèle traverse des implémentations génériques sans conserver ces contraintes concrètes.

L'initialisation NULL est en outre celle d'un argument de sortie écrit par GLib. La branche console_charset ne convertit la sortie que sous ret ; charset utilise une conversion nullable. Garder la valeur d'avant l'appel C comme si elle n'avait jamais été écrite crée un chemin supplémentaire non démontré.

Enfin, le module est cfg(test), et le paquet GLib est une dépendance exclue des membres du workspace. Cargo ne construit pas les tests d'une dépendance avec le binaire applicatif ou les tests du workspace. Ce MyBoxed n'est pas une API applicative exposée.

Preuves : types concrets des wrappers, tests de charset/error, configuration de workspace et règles Cargo sur les tests des dépendances. Aucun type MyBoxed n'est ajouté à l'application pour contourner le diagnostic.

### QL-3 — value.rs:462

Le sink est la lecture de (*src).g_type dans copy_into_value. Les chemins montrés prennent une sortie charset, puis from_glib_none, puis la macro wrapper Value et sa fonction de copie.

Un charset est un pointeur gchar, converti vers une chaîne Rust/GLib. Un Value encapsule un GValue. Le helper générique ne peut pas convertir une sortie charset en Value avec cette résolution de retour et ces implémentations concrètes. Aucun cast ou appel qui réaliserait cette conversion n'apparaît dans le chemin montré.

Le contrat GLib de g_value_copy exige un GValue source valide ; le wrapper Rust clone un GValue valide et initialise la destination avant copie. La copie indépendante reste valide après destruction de la source. L'allocation native utilise g_malloc0 pour une taille GValue non nulle : GLib termine sur échec d'allocation plutôt que de retourner silencieusement NULL.

Tests : clone d'un Value contenant une chaîne, destruction de l'original, lecture de la copie ; copie d'un BoxedValue, destruction des deux wrappers source, lecture de la copie possédée. Ces tests renforcent les contrats FFI ; ils ne prétendent pas prouver la sûreté de toutes les API unsafe.

### QL-4 — value.rs:470

Le sink est la lecture de (*value).g_type dans clear_value, avant g_value_unset.

Les chemins SARIF commencent notamment par error = ptr::null_mut() dans auto/functions.rs:197 ou 224. Après l'appel C, le wrapper convertit error avec from_glib_full **uniquement dans la branche non-null** et retourne crate::Error. Le chemin CodeQL l'associe ensuite aux fonctions de copie/libération de GValue, dont le type de pointeur et le type de retour sont différents.

Le pointeur GError est un résultat C alloué, pas un GValue. La conversion concrète est celle de glib::Error, jamais celle de Value. Le chemin montré ignore à la fois l'écriture de l'argument de sortie C, la garde error.is_null et la sélection du trait selon le type de retour.

Tests : échec contrôlé de filename_to_uri sur un chemin relatif, retour statiquement typé glib::Error, clone, destruction de l'original puis lecture du message ; construction et destruction d'un Value numérique initialisé à zéro. Aucune adresse NULL n'est déréférencée pour simuler une attaque.

### Références amont vérifiables

- Sources Rust inchangées dans [glib 0.18.5](https://github.com/gtk-rs/gtk-rs-core/tree/0.18.5/glib/src) : log.rs, value.rs, subclass/boxed.rs, translate.rs et les wrappers générés.
- [g_value_copy](https://docs.gtk.org/gobject/method.Value.copy.html) : copie d'un GValue valide.
- [g_value_unset](https://docs.gtk.org/gobject/method.Value.unset.html) : libération du contenu possédé.
- [g_value_set_boxed](https://docs.gtk.org/gobject/method.Value.set_boxed.html) et [g_value_take_boxed](https://docs.gtk.org/gobject/method.Value.take_boxed.html) : copie et transfert de propriété, avec traitement NULL explicite.
- [GLib 2.72.4 gboxed.c](https://github.com/GNOME/glib/blob/2.72.4/gobject/gboxed.c) : value_set_boxed_internal, boxed_proxy_value_copy/free et les flags de copie/propriété.
- [GLib 2.72.4 gvalue.c](https://github.com/GNOME/glib/blob/2.72.4/gobject/gvalue.c) : initialisation et copie des GValue.
- [Tests Cargo](https://doc.rust-lang.org/cargo/commands/cargo-test.html) : sélection des paquets testés, distincte de leurs dépendances.

### Exposition applicative et observation distincte

Les commandes Tauri de src-tauri/src/main.rs renvoient String, serde_json::Value et Vec<serde_json::Value>. La revue de src-tauri/src ne montre aucun appel direct à MyBoxed, register_boxed_type, BoxedValue, LogField ou à une conversion de sortie charset/erreur en GValue. Le frontend, les retours JSON et les caches ne démontrent aucun contrôle d'un pointeur natif par une entrée distante.

Tauri/GTK utilisent GLib indirectement. L'absence d'appel direct n'est pas une preuve générale d'absence d'exposition ; les quatre classifications reposent surtout sur les chemins impossibles et les contrats/types vérifiés ci-dessus.

Lors de la première lecture de log.rs, une signature distincte a été repérée : LogField::new lie la clé à 'a mais pas la référence value: &[u8]. Ce point est **distinct de l'alerte log.rs:85**. Aucun appel applicatif à cette API ni exploitation n'est démontré. La même signature apparaît dans glib 0.22.10 et aucun correctif amont vérifiable n'a été retrouvé dans la recherche menée. Aucun patch local inventé n'est appliqué dans cette mission ; ce point reste une observation séparée à faire confirmer en amont.

### Validation et conservation

Les modifications exécutables ont été validées sur le commit f78242e4fc5e311a4a7114ff0cc46b5fce0055ef. La finalisation suivante ajoute uniquement ce rapport, les preuves JSON et le passage du nouveau diagnostic à un déclenchement manuel ; elle ne change aucun code testé.

| Vérification | Résultat vérifié | Preuve GitHub |
| --- | --- | --- |
| cargo build --workspace --locked --verbose | Réussi, debug | [CI Rust 38427520573](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427520573/job/115400700304) |
| cargo test --workspace --locked --verbose | 13 tests d'intégration réussis, dont les 5 nouveaux ; 0 échec, 0 ignoré | Même job Rust |
| cargo build --workspace --release --locked --verbose | Réussi, release | Même job Rust |
| cargo test --workspace --release --locked --verbose | Les mêmes 13 tests réussis ; 0 échec, 0 ignoré | Même job Rust |
| cargo fmt --all -- --check | Réussi | [Qualité Rust 115400661011](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427509459/job/115400661011) |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Job réussi ; 34 avertissements du paquet tiers GLib restent visibles dans le journal | Même job qualité Rust |
| Contrôle de conservation des migrations précédentes | 446 noms de paquets conservés et 121 fichiers GLib vérifiés ; seul le correctif amont antérieur de VariantStrIter est autorisé par ce contrôle | Job Rust 115400700304 |
| Validation des workflows, lint/typecheck/build Vite | Jobs existants réussis automatiquement, sans modification JavaScript | [CI JS/TS 38427520885](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427520885) |
| Diagnostic CodeQL Rust | Analyse réussie, traces SARIF exportées ; les résultats restent présents | [Diagnostic 38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324) |

Les cinq nouveaux tests se trouvent dans src-tauri/tests/glib_codeql_contracts.rs. Les huit tests précédents (six VariantStrIter, deux HTTP) restent présents et passent également dans les deux profils. Ces tests exécutent les contrats concrets observés ; la réfutation des chemins génériques impossibles repose sur les types et le SARIF, pas sur une prétention à prouver tous les comportements par quelques tests.

L'environnement local ne dispose pas de Cargo et son accès réseau shell est indisponible ; les commandes de compilation et de test ci-dessus ont donc été exécutées par les workflows GitHub Actions existants, sur la branche de la PR.

Les jobs historiques Rust Security Audit, Rust Dependency Analysis et JS/TS Dependency Security restent en échec dans [le run sécurité 38427509459](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427509459). Aucun résultat de ces audits ni aucune politique n'est modifié par cette mission CodeQL. Les trois autres résultats Rust du replay restent hors du périmètre analysé.

Toutes les dépendances, options, archives, commentaires et sources vendored sont conservés. Aucun chemin exclu de CodeQL, aucune requête/sevérité réduite, aucun suppress/dismiss/ignore ajouté. Les alertes restent ouvertes et leurs checks restent visibles ; les conclusions du rapport ne valent pas modification automatique de leur état GitHub.

Tous les workflows présents avant la mission sont inchangés, y compris CodeQL, sécurité, Rust et approbation automatique. Seul un nouveau diagnostic lié à cette mission a été ajouté, puis rendu manuel après export. Il ne publie aucune analyse qui pourrait remplacer un état existant. Aucune fusion ni fermeture de PR.

## English

The four requested findings are classified as false positives of the reported paths, not as a blanket claim that GLib is vulnerability-free. The logging path incorrectly dispatches a boolean UUID predicate to a u32 LogLevel conversion. The boxed path selects a derive inside an excluded dependency's cfg(test) module for a concrete charset-to-string conversion. The Value paths confuse gchar/GError outputs with GValue and lose C out-parameter writes and Rust non-null guards/concrete trait types.

A dedicated diagnostic preserves full SARIF evidence without changing existing workflows or uploading a replacement scan. Five integration tests check concrete conversions and GLib copy/free contracts in debug and release. No vendor source change, dependency removal, advisory dismissal, scanner exclusion or approval-workflow change is introduced. A separate LogField constructor lifetime observation is documented without conflating it with the logging finding or applying an unverified local fix.
