# Rétroport GLib : conversion d'une Slice vide vers PtrSlice

## Français

Le correctif amont [b31265df94876febf259089a19de9c23d2468214](https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214), lié à [gtk-rs-core #2042](https://github.com/gtk-rs/gtk-rs-core/issues/2042), est appliqué à GLib 0.18.5. Cette correction traite le défaut réel distinct découvert pendant l'analyse CodeQL ; elle ne prétend pas résoudre les chemins SARIF précédemment qualifiés comme faux positifs.

### Défaut et correction minimale

Slice::into_raw renvoie NULL lorsque la longueur vaut zéro. Dans ce cas, la Slice détruite libère également son éventuelle allocation réservée. La conversion From<Slice<T>> pour PtrSlice<T> utilisait ce pointeur pour construire NonNull::new_unchecked et conservait l'ancienne capacité. Le cas vide violait ainsi le contrat de NonNull ; la variante réservée-vide pouvait écrire dans NULL en prenant une capacité déjà libérée pour une allocation réutilisable.

La correction teste ptr.is_null : si vrai, elle vérifie len == 0 en debug et retourne PtrSlice::new, avec capacité zéro. La branche non vide conserve l'allocation et prépare le terminateur comme auparavant. Aucune version ni dépendance n'est changée.

La proposition historique docs/security/proposals/UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch a été relue et conservée intacte. Le code source appliqué est celui de cette proposition. Les corps des fonctions ont été comparés à la source du commit amont : **identiques après retrait des seules lignes de commentaires**. La différence documentaire est le commentaire français placé avant le commentaire anglais amont.

Le commit amont modifie aussi une documentation de Slice::into_raw et ajoute un test interne au paquet. Le rétroport limite les changements vendored au corps de la conversion dans ptr_slice.rs ; les tests sont placés dans le workspace applicatif, car le paquet vendored reste exclu des membres et ses tests internes ne sont pas exécutés par cargo test --workspace.

### Tests ajoutés

src-tauri/tests/glib_empty_slice.rs contient six régressions Linux :

| Test | Contrat vérifié |
| --- | --- |
| empty_slice_conversion_returns_fresh_reusable_storage | Slice vide sans réserve : capacité zéro, sentinelle NULL, push/pop et réutilisation |
| reserved_empty_slice_conversion_discards_freed_capacity | Slice vide avec capacité réservée : ancienne capacité abandonnée, nouvelle allocation utilisable |
| emptied_reserved_slice_conversion_is_reusable | Slice contenant un élément puis vidée : réserve conservée par Slice mais abandonnée par la conversion vide |
| nonempty_slice_preserves_contents_and_null_termination | Trois messages comme dans le test amont, portés par des GError natifs : copies possédées après destruction des sources, terminateur et truncate/push |
| converted_slice_owns_objects_until_their_last_reference_is_dropped | Transfert de GObject sans référence supplémentaire, pop/destruction observée par WeakRef, réutilisation d'une Slice réservée-vide |
| converting_then_truncating_finalizes_each_owned_object | Finalisation du dernier élément lors de truncate et du premier lors de la destruction du conteneur |

Les accès unsafe des tests lisent uniquement les sentinelles des conteneurs construits valides. Les tests ne passent pas de pointeur arbitraire ou invalidé aux API FFI. Les WeakRef vérifient la finalisation réelle des objets, au-delà d'une simple vérification de longueur.

### Archives et contrôle de conservation

docs/history/glib-empty-slice-20261013 conserve intégralement :

- vendor/glib-0.18.5/src/collections/ptr_slice.rs, variante précédant ce rétroport ;
- Scripts/check-rust-warnings-backport.py, contrôleur précédent ;
- les corps de conversion avant/après et leurs empreintes ;
- les métadonnées et patches amont dans upstream-verification.json ;
- une explication française puis anglaise de leur statut historique.

La première variante des tests reprenant GStringPtr::from(&str), indisponible en 0.18.5, est également conservée dans src-tauri/tests/glib_empty_slice.upstream-api-incompatible.rs. Les fixtures actives utilisent Error::new, un wrapper GError transparent et possédé déjà disponible ; les trois messages amont et les scénarios de propriété sont conservés.

Ces fichiers sont hors des cibles Cargo du workspace. Ils restent des références inactives, pas des alternatives réactivées dans l'application. Le paquet original publié reste également archivé dans docs/history/rust-warnings-20261013/glib-0.18.5.crate ; les archives et rapports antérieurs ne sont pas réécrits.

Le contrôleur actif garde tous ses contrôles antérieurs, y compris les dépendances conservées, les options, le verrouillage registry GLib, le chemin réellement résolu par cargo metadata et le rétroport VariantStrIter. Il ajoute uniquement l'autorisation du remplacement de fonction prévu dans ptr_slice.rs :

- le fichier archivé avant modification doit être identique à celui du paquet publié ;
- le corps avant correction doit apparaître exactement une fois ;
- les empreintes SHA-256 des corps avant/après et du contrôleur archivé sont fixées dans le script ;
- tous les autres octets des **121 fichiers GLib** restent comparés au paquet original, avec le seul delta VariantStrIter précédemment autorisé.

Il n'existe aucune exception générale pour ptr_slice.rs ni aucun affaiblissement des audits. Des vérifications locales négatives confirment le rejet d'une modification source supplémentaire, d'un retour à la conversion défectueuse et d'une altération de la variante de référence après correction. Le contrôle local positif passe jusqu'à l'étape cargo metadata, indisponible localement ; le contrôle complet est exécuté en CI.

### Résultats réellement vérifiés

Le code et les six nouveaux tests ont été validés sur le commit **bd2e21aaccafc02baf20807809feb235a55e8c7d**. Les fichiers de rapport et de preuves ajoutés ensuite ne modifient aucun code testé.

| Vérification | Résultat réellement observé | Preuve GitHub |
| --- | --- | --- |
| cargo build --workspace --locked --verbose | Réussi, debug | [Rust 38442051602, job 115450834959](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442051602/job/115450834959) |
| cargo test --workspace --locked --verbose | **24 tests d'intégration réussis**, dont 6 nouveaux ; 0 échec, 0 ignoré | Même job Rust |
| cargo build --workspace --release --locked --verbose | Réussi, release | Même job Rust |
| cargo test --workspace --release --locked --verbose | **Les mêmes 24 tests réussis**, 0 échec, 0 ignoré | Même job Rust |
| cargo fmt --all -- --check | Réussi | [Qualité Rust 115450800290](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800290) |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Job réussi ; **34 avertissements tiers GLib toujours visibles** | Même job qualité |
| Contrôles de conservation complets, dont cargo metadata --locked | Réussis ; 446 noms historiques conservés, 121 fichiers GLib contrôlés et source vendored corrigée effectivement résolue | Job Rust 115450834959 |
| Exclusion des références historiques des artefacts | Contrôle existant réussi sur dist et binaire release ; archives nouvelles hors cibles Cargo, aucun include vers ces archives | Même job Rust |
| cargo audit --deny warnings | **Échec : 3 avertissements refusés**, listés ci-dessous | [Audit Rust 115450800367](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800367) |
| cargo-deny, action existante | **advisories FAILED, licenses FAILED ; bans ok, sources ok** | [Analyse dépendances 115450800678](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800678) |
| pnpm audit --audit-level=moderate, déclenché automatiquement | **Échec : 1 alerte high braces** ; aucun changement JavaScript | [Audit JS 115450800193](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800193) |
| Lint, typecheck, build Vite et validation des workflows | Jobs existants réussis automatiquement | [JS/TS CI 38442051634](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442051634) |
| Vérifications locales supplémentaires du contrôleur | Positif réussi avant cargo metadata ; trois cas de modification/reversion/référence altérée correctement rejetés | Contrôles locaux, détaillés plus haut |

Les avertissements de cargo audit sont :

- **proc-macro-error 1.0.4 — RUSTSEC-2024-0370**, paquet non maintenu ;
- **rustls-pemfile 1.0.4 — RUSTSEC-2025-0134**, paquet non maintenu, dépendance historique optionnelle conservée ;
- **glib 0.18.5 — RUSTSEC-2024-0429**, VariantStrIter : correctif source amont antérieur conservé et testé, identité registry inchangée donc avertissement toujours présent.

Le refus d'advisory explicitement affiché par cargo-deny concerne proc-macro-error ; ses refus de licences restent en échec avec la politique existante, sans modification. L'alerte JS conservée est **GHSA-vfj7-8cjw-p6xm**, braces 3.0.3. Le rétroport actuel ne traite aucun de ces sujets indépendants.

Au moment de la vérification du commit testé, le check CodeQL **115451282377** a la conclusion **neutral**. GitHub indique qu'une configuration Rust du workflow security-analysis.yml présente sur main manque pour comparer les alertes de la PR. Son résumé exact est conservé dans les preuves ; ce résultat n'est pas assimilé à un audit vert et aucun workflow n'est modifié pour le contourner.

Les dix-huit tests précédents (contrats CodeQL, VariantStrIter et HTTP) restent présents et réussissent aussi dans les deux profils. La garde continue à vérifier le correctif VariantStrIter exact et la migration h2 précédente.

L'environnement local n'a ni Cargo ni rustfmt et son réseau shell est indisponible. Les compilations, tests, Clippy et audits ont été exécutés dans GitHub Actions via les workflows existants. Les résultats de ces jobs, y compris les échecs, sont les preuves citées.

### Périmètre final et limites

La comparaison des arbres Git depuis **f149328e91bf0379f31d73b664d80dbe85f49617** vérifie **aucune suppression**. Seuls deux fichiers préexistants changent : **vendor/glib-0.18.5/src/collections/ptr_slice.rs** (rétroport de la conversion) et **Scripts/check-rust-warnings-backport.py** (autorisation strictement bornée du delta). Leurs variantes antérieures sont archivées avec des blobs Git **identiques octet pour octet**.

Les manifestes, Cargo.lock, pnpm-lock.yaml, les options, les autres sources GLib, les archives antérieures, les rapports historiques et la proposition inactive initiale restent inchangés. Tous les workflows préexistants, dont l'approbation automatique, sont identiques à leur version initiale. Aucune règle d'audit ni politique de licences n'est changée. Les seuls ajouts sont les régressions, leurs références/archives, ce rapport et les preuves.

La PR reste ouverte et aucun merge n'est effectué. Aucun état d'alerte n'est modifié manuellement ; aucune exclusion, ignore ou dismissal n'est ajouté.

La première exécution des tests avec le constructeur de chaîne du paquet amont récent a échoué à la compilation (E0308). La variante est archivée ; les tests actifs adaptés à Error::new de glib 0.18.5 sont ceux du commit validé indiqué ci-dessus. La correction du paquet reste identique au rétroport amont.

La résolution garde GLib 0.18.5 et son identité registry/checksum dans Cargo.lock. Le warning RustSec historique GLib peut donc rester présent même si les défauts source rétroportés sont corrigés. Aucun advisory, résultat CodeQL, exclusion ou seuil n'est masqué pour présenter un audit vert.

Les conclusions CodeQL et le constat de proposition inactive dans les rapports précédents décrivent leur état historique et sont conservés intégralement. Ce rapport documente l'application et la validation nouvelles. Aucun autre correctif de collections, migration de dépendance, changement JavaScript ou modification de politique de licences n'est introduit.

Les tests Linux debug/release et la revue amont ne constituent pas une validation Android en appareil, un test Miri ou un passage AddressSanitizer. Aucun nouvel accès réseau ni comportement fonctionnel applicatif n'est ajouté.

## English

The exact upstream empty Slice-to-PtrSlice conversion fix from gtk-rs-core commit b31265df94876febf259089a19de9c23d2468214 is backported to glib 0.18.5. NULL from an empty Slice now produces a fresh PtrSlice with zero capacity instead of constructing an invalid NonNull and retaining already-freed reserved capacity. The nonempty path is preserved.

Six integration regressions cover empty, reserved-empty, emptied-after-pop and nonempty slices, NULL termination, reuse, native object ownership and finalization. Complete previous source/checker variants and all earlier archives are preserved. The preservation checker permits only the pinned upstream function replacement while retaining all existing dependency/lockfile/source checks. Existing workflows, automatic approval, auditing rules and license policy remain unchanged; no warning or alert is hidden.
