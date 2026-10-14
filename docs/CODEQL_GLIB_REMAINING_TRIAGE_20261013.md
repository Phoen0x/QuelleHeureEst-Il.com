# Trois résultats Rust CodeQL restants — GLib 0.18.5

## Français

**Conclusion : les trois chemins du diagnostic complet sont des faux positifs, pour des raisons différentes. Les résultats dans object.rs confondent des types de pointeurs et des implémentations de traits incompatibles. Celui dans ptr_slice.rs confond la destruction d'un élément avec la libération du tableau qui contient cet élément. Un défaut réel distinct de conversion de Slice vide a aussi été confirmé dans le même fichier : il est documenté avec une proposition amont non appliquée, sans exposition applicative démontrée.**

| Repère de ce rapport | Règle | Position primaire exacte | Classification |
| --- | --- | --- | --- |
| QL-5 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/object.rs:470:28–31 | Faux positif : gchar/GError ne sont pas GObject |
| QL-6 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/object.rs:493:28–31 | Faux positif : erreur/hostname convertis vers leurs types concrets, jamais ObjectRef |
| QL-7 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/collections/ptr_slice.rs:900:21–22 | Faux positif : le slot reste alloué après drop_in_place du wrapper |

Les repères QL-5 à QL-7 ne sont pas des numéros d'alertes GitHub. Les quatre autres résultats de ce même diagnostic ont déjà été qualifiés dans CODEQL_GLIB_TRIAGE_20261013.md ; ce rapport historique reste intact.

### Provenance exacte

Le [diagnostic GitHub Actions 38425272324, job 115392909513](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513) a analysé le commit d5e75292ed3caca6110c9ab4f740df33d5b096d8 avec CodeQL CLI 2.27.2, Rust build-mode none.

Le [SARIF complet non filtré, artefact 11828886142](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/artifacts/11828886142) porte l'empreinte SHA-256 4772fa6e1b0cf0767ea89172b14e1c9aef4054ea118d28f9986a76c561baf540. Son export intégral dans le journal contient sept enregistrements CODEQL_RESULT_BEGIN/END. Les sept ont été réextraits du journal durant cette mission et comparés à l'extraction précédente : correspondance exacte.

Les trois enregistrements restants sont conservés intégralement, avec codeFlows et relatedLocations, dans docs/security/CODEQL_GLIB_REMAINING_EVIDENCE_20261013.json. Ce JSON constitue une extraction de résultats du SARIF, pas une nouvelle analyse ni un SARIF de remplacement. Le diagnostic existant, les audits, les workflows et leurs règles ne sont pas modifiés.

La branche au début de cette mission était 0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370. La comparaison et les références de lignes ci-dessous utilisent les sources vendored de ce commit, identiques aux sources analysées dans les trois fichiers.

### QL-5 — ObjectRef::from_glib_none, object.rs:470

Le sink primaire est :
```rust
debug_assert_ne!((*ptr).ref_count, 0);
```
Il se trouve dans l'implémentation :
```rust
impl FromGlibPtrNone<*mut gobject_ffi::GObject> for ObjectRef
```

Le SARIF conserve quatre chemins représentatifs :

1. auto/functions.rs:344–347 : charset NULL avant g_get_console_charset, puis translate.rs:1621–1622/from_glib_none et object.rs:468–470.
2. manual_functions.rs:217–219 : out_charset NULL avant g_get_charset, puis le même helper et le même sink.
3. auto/functions.rs:197–208 : error NULL avant g_file_set_contents, puis from_glib_full, un passage par translate.rs:1688–1689 (conversion const générique), from_glib_none et ce sink.
4. auto/functions.rs:224–237 : variante g_file_set_contents_full, même détour générique.

La conversion console produit **Option<GString>**, la conversion charset **Option<&GStr>**. Le pointeur natif est gchar, pas GObject. Les branches erreur produisent **crate::Error**, via un **GError**, pas un ObjectRef. Les helpers génériques sélectionnent une implémentation selon le type de pointeur et le retour Rust ; aucune sélection de cette implémentation GObject ne satisfait ces types. Le détour from_glib_full → from_glib_none montré pour un GError ne correspond donc pas à son implémentation concrète.

Les initialisations NULL sont des variables de sortie C. Le wrapper console ne convertit sa sortie que sous son booléen de succès ; les sorties nullable utilisent une conversion Option. Les erreurs ne sont converties que dans la branche error non-null. Ces faits renforcent la réfutation, mais les types incompatibles suffisent déjà à rendre les chemins affichés impossibles.

Les sources liées ne se limitent pas aux quatre exemples : les positions des relatedLocations des deux résultats ObjectRef ont été lues, soit **85 positions distinctes dans 11 fichiers**. Elles initialisent des variables GError/error/err ou des sorties gchar (charset, hostname, composantes URI, chemins). Aucune de ces initialisations ne fournit un GObject. La liste exhaustive est archivée dans le JSON de preuves. Les quatre chemins affichés sont ceux réellement présents dans codeFlows ; aucun chemin supplémentaire n'est inventé.

Contrat réel : la conversion unsafe reçoit un **GObject vivant, non-null et possédant une référence valide**. g_object_ref_sink acquiert une référence supplémentaire sur un objet non flottant ou absorbe sa référence flottante. Elle ne garantit pas la sûreté d'un pointeur arbitraire fourni par un appelant unsafe.

### QL-6 — ObjectRef::from_glib_full, object.rs:493

Le sink est la même lecture du compteur, dans :
```rust
impl FromGlibPtrFull<*mut gobject_ffi::GObject> for ObjectRef
```

Quatre chemins sont exportés : error de g_file_set_contents (197 → 208), error de sa variante full (224 → 237), hostname de g_filename_from_uri (276 → 280) et error de cette même fonction (277 → 282). Ils passent par translate.rs:1630–1631 puis ObjectRef::from_glib_full.

Les deux premières sorties et la dernière ont les types **GError*/crate::Error**. La sortie hostname a le type **gchar*/Option<GString>**. Un hostname NULL est un cas prévu par le wrapper et produit None. Il n'est ni converti en ObjectRef, ni dereférencé comme GObject.

Pour un vrai GObject, from_glib_full **consomme une référence déjà possédée**, sans incrémenter son compteur. ObjectRef::Drop appelle g_object_unref sur l'objet pointé. Les tests comptent les références avant/après les conversions none et full et vérifient la finalisation par WeakRef.

Les deux sinks object.rs sont dans des debug_assert : ces lectures de ref_count sont absentes d'un build release normal. Ce fait n'est pas utilisé pour dispenser la conversion réelle de son contrat unsafe ; les chemins sont réfutés par les types, indépendamment des optimisations.

### QL-7 — PtrSlice::truncate, ptr_slice.rs:900

Le codeFlow est court et ne part d'aucune entrée applicative :

- ligne 898 : ptr::drop_in_place::<T>(p as *mut T), adresse considérée invalide par la trace ;
- ligne 900 : p, destination du ptr::write qui pose le NULL terminal.

Le code effectif est :
```rust
while self.len > len {
    self.len -= 1;
    let p = self.ptr.as_ptr().add(self.len);
    ptr::drop_in_place::<T>(p as *mut T);
    ptr::write(
        p,
        Ptr::from(ptr::null_mut::<<T as GlibPtrDefault>::GlibType>()),
    );
}
```

Il faut distinguer **p**, adresse d'un slot dans le tableau de pointeurs, et **la valeur du pointeur stockée dans ce slot**, adresse d'un objet natif.

T implémente le trait unsafe TransparentPtrType : le wrapper a la représentation du pointeur vers son type FFI. La macro de wrapper GObject l'implémente explicitement (object.rs:704–709). La conversion p as *mut T donne donc l'adresse du wrapper dans le tableau ; elle ne transforme pas p en adresse du GObject.

Pour un glib::Object, la destruction descend vers ObjectRef::Drop (object.rs:389–394), qui passe self.inner.as_ptr à g_object_unref. GLib décrémente le compteur et peut libérer **le GObject** ; il ne libère pas le tableau de PtrSlice. Les autres destructeurs examinés suivent la même séparation : Shared appelle MM::unref(inner), Boxed appelle MM::free(inner), GStringPtr appelle g_free(self.0.as_ptr()). Ce sont les adresses contenues dans les wrappers, pas l'adresse du slot.

L'allocation du tableau est conservée pendant truncate : aucune modification de capacity, aucun g_free/g_realloc sur le tableau dans cette méthode. Sa libération est dans PtrSlice::Drop, **après** la destruction des éléments, avec g_free(self.ptr.as_ptr()) si capacity != 0.

Les bornes comptent également : la méthode retourne si self.len <= len ; sinon elle décrémente self.len avant de calculer le slot. Sous les invariants valides du conteneur, ce slot appartient à l'allocation initiale. Un PtrSlice vide avec NonNull::dangling ne pénètre pas dans la boucle. Les constructeurs unsafe exigent un tableau valide ; set_len exige les éléments et le terminateur correspondants. Un appelant qui viole ces contrats ou une implémentation unsafe incorrecte de TransparentPtrType ne constitue pas une exposition démontrée via les API sûres examinées.

L'écriture NULL réinitialise une mémoire de slot encore allouée, après la fin de vie de son ancien wrapper. La trace ne démontre aucune utilisation du GObject libéré. C'est un **faux positif de cette invalidation d'adresse**, pas une preuve générale que toutes les opérations PtrSlice sont exemptes de défauts.

### Correctifs et comparaison amont

La comparaison avec [gtk-rs-core 0.22.10](https://github.com/gtk-rs/gtk-rs-core/tree/0.22.10/glib/src) conserve les deux conversions ObjectRef et leurs assertions ; le chemin drop_in_place suivi de ptr::write est également conservé dans truncate pour les types nécessitant une destruction.

Un correctif particulièrement pertinent a été examiné : [3971101c82643035c15380c3f4af19ecccd09bb2](https://github.com/gtk-rs/gtk-rs-core/commit/3971101c82643035c15380c3f4af19ecccd09bb2), daté du 29 avril 2026, « Fix theoretical use-after-frees if dropping an item panics ». Son auteur précise :

> This is currently not a problem because all collections require the item type to implement TransparentType or TransparentPtrType, which are unsafe traits that are only implemented by the glib::wrapper! macro and require the Drop impl to not panic (among other things).

Cette explication amont est citée comme telle ; les commentaires locaux de ces traits ne documentent pas aussi complètement cette exigence. Le correctif réinitialise certains états avant destruction et ajoute une branche needs_drop dans truncate. **Il conserve exactement drop_in_place(p) puis ptr::write(p, NULL) pour les types avec destructeur.** Il ne corrige donc pas l'invalidation d'adresse prétendue par cette trace et ne justifie pas un backport pour QL-7.

Un autre correctif consulté, [2477663](https://github.com/gtk-rs/gtk-rs-core/commit/2477663dbf34cd75d879e0ace53fd0a4e4e6f857), concerne les débordements dans reserve/extend/push. Ce sujet ne réalise pas le chemin SARIF de truncate et aucune migration globale n'est importée ici.

### Défaut réel distinct : conversion d'une Slice vide

Le correctif [b31265df94876febf259089a19de9c23d2468214](https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214), du 19 septembre 2026, corrige [l'issue amont #2042](https://github.com/gtk-rs/gtk-rs-core/issues/2042). **Le code concerné est bien présent dans glib 0.18.5, ptr_slice.rs:1047–1070.**

Slice::into_raw renvoie NULL si len == 0 ; le destructeur de la Slice libère son éventuelle allocation réservée. La conversion sûre From<Slice<T>> construit pourtant NonNull::new_unchecked(ptr) sans tester NULL, puis prépare le terminateur en réutilisant l'ancien capacity. Construire ce NonNull NULL viole déjà le contrat Rust ; dans le cas réservé-vide, le pointeur est NULL et la capacité sauvegardée peut empêcher une réallocation avant l'écriture. Il s'agit donc d'un **défaut réel du code tiers accessible par une API sûre**, même sans prouver une attaque applicative.

Ce défaut n'est pas la libération du slot supposée dans le codeFlow 898 → 900. La trace ne passe ni par la conversion Slice → PtrSlice, ni par sa construction invalide. Les tests de truncate utilisent une construction Vec → PtrSlice valide et ne prétendent pas couvrir la conversion vide défectueuse.

Une proposition isolée est conservée dans **docs/security/proposals/UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch**. Elle reprend le correctif fonctionnel amont : si into_raw renvoie NULL, vérifier len == 0 et retourner PtrSlice::new ; sinon conserver le chemin non vide. Seule une traduction française du nouveau commentaire est ajoutée avant son texte anglais. Les fonctions avant/après et le patch amont sont archivés dans les preuves.

La proposition passe **git apply --check** contre la source vendored exacte, et un contrôle confirme que le fichier source reste inchangé. **Elle n'est pas appliquée, activée ni validée en exécution.** Les résultats CI ci-dessous concernent les contrats des trois chemins SARIF, pas ce rétroport. Le comportement invalide du paquet actuel n'est pas exécuté pour obtenir un crash.

Pour valider ce rétroport séparément, reprendre les cas du test amont test_from_slice_empty : conversion non vide, vide sans réserve, vide avec réserve, puis destruction/réutilisation. Il faut compiler et tester le paquet corrigé en debug/release et étendre le contrôle de conservation existant pour vérifier uniquement le delta amont autorisé dans ptr_slice.rs. La présente mission d'analyse laisse ce contrôle, les audits et toutes les sources préexistantes inchangés. Le défaut reste explicitement **non corrigé sur la branche**, avec correctif concret proposé et sans chemin applicatif identifié.

Références de contrats :

- [GLib 2.72.4 gobject.c](https://github.com/GNOME/glib/blob/2.72.4/gobject/gobject.c), g_object_ref_sink et g_object_unref : absorption/incrément de références et finalisation de l'objet pointé.
- [Rust ptr::drop_in_place](https://doc.rust-lang.org/std/ptr/fn.drop_in_place.html) : destruction du contenu à l'adresse.
- [Rust ptr::write](https://doc.rust-lang.org/std/ptr/fn.write.html) : écriture dans une adresse valide et correctement alignée.
- Sources GLib vendored : translate.rs:2632–2636, object.rs:389–394/466–498, collections/ptr_slice.rs:82–96/603–608/689–695/889–905, boxed.rs:531–536, shared.rs:461–466, gstring.rs:751–756.

### Exposition applicative

Les quatre sources Rust actives main.rs, cache.rs, geocoding.rs et weather.rs ont été lues à la révision initiale. Aucun appel direct à PtrSlice, ObjectRef, aux helpers from_glib_* ni aucune implémentation applicative de TransparentPtrType n'apparaît. Les entrées Tauri transportent des chaînes, nombres et JSON ; aucun chemin vers une adresse native arbitraire n'est démontré.

Tauri/GTK emploient GLib indirectement. ObjectRef et PtrSlice sont du code tiers actif, **pas du code fantôme à supprimer**. L'absence d'appel direct ne prouve pas une absence absolue d'exposition ; les classifications ci-dessus reposent sur les chemins/types et la propriété mémoire vérifiés.

### Vérifications

Les cinq nouveaux tests de src-tauri/tests/glib_codeql_remaining_contracts.rs ont été exécutés sur le commit 715d38bc9368ecf5fc1711e4bb608e9014b8feae. Les derniers fichiers ajoutés ensuite sont uniquement le rapport, les preuves et une proposition inactive ; aucun code testé n'est modifié.

| Vérification | Résultat | Preuve |
| --- | --- | --- |
| cargo build --workspace --locked --verbose | Réussi, debug | [Rust 38438659916 / 115439191070](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438659916/job/115439191070) |
| cargo test --workspace --locked --verbose | 18 tests d'intégration réussis, dont les 5 nouveaux ; 0 échec/ignoré | Même job Rust |
| cargo build --workspace --release --locked --verbose | Réussi, release | Même job Rust |
| cargo test --workspace --release --locked --verbose | Les mêmes 18 tests réussis ; 0 échec/ignoré | Même job Rust |
| cargo fmt --all -- --check | Réussi | [Qualité Rust 115439156348](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438649670/job/115439156348) |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Job réussi ; 34 avertissements du paquet tiers GLib restent visibles | Même job qualité |
| Garde de conservation antérieure | 446 noms de paquets / 121 fichiers GLib conservés ; correctif VariantStrIter précédent vérifié | Même job Rust |
| Exclusion du code fantôme des artefacts | Contrôle réussi sur dist et le binaire release | Même job Rust |
| Lint/typecheck/build Vite et validation des workflows | CI existantes réussies automatiquement | [JS/TS CI 38438659813](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438659813) |
| CodeQL sur le commit testé | Analyses exécutées avec succès ; check de résultats toujours en échec avec 6 alertes élevées | [Check 115439489458](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153/checks?check_run_id=115439489458) |
| Proposition inactive pour le défaut de conversion vide | git apply --check réussi ; aucune exécution ni source modifiée | Vérification locale uniquement |

Les nouveaux tests vérifient : une référence GObject acquise par from_glib_none ; un transfert possédé par from_glib_full sans incrément supplémentaire ; un hostname NULL traité par Option<GString> ; la finalisation de deux objets tronqués avec maintien/réutilisation du tableau ; les cas vide, longueur inchangée, zéro et appels répétés. Les treize tests précédents sont conservés et passent également dans les deux profils.

Cargo n'est pas disponible dans l'environnement local et son réseau shell est indisponible ; les compilations/tests ont été exécutés dans GitHub Actions, sans changer les workflows. Les jobs Rust Security Audit, Rust Dependency Analysis et JS/TS Dependency Security restent en échec dans le run 38438649670 : aucun audit ni aucune politique n'a été modifié pour cette mission.

Les tests ne passent aucun pointeur invalidé ni NULL à une API unsafe exigeant un objet valide. Ils vérifient des références réelles, la finalisation des objets, le maintien des allocations et leur réutilisation. Ils ne constituent ni un test Miri ni une instrumentation AddressSanitizer et ne prouvent pas à eux seuls l'absence de tout comportement indéfini ; la revue source/FFI et les preuves amont complètent leurs résultats.

### Conservation et états GitHub

La comparaison des arbres Git entre la révision initiale 0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370 et le résultat final vérifie **zéro modification et zéro suppression de fichier préexistant**. Quatre fichiers sont ajoutés : cinq tests de contrat, ce rapport, les preuves JSON et la proposition inactive. Toutes les dépendances, options, verrouillages, archives, sources vendored, commentaires, variantes et code fantôme sont conservés. Tous les workflows et scripts préexistants sont inchangés, y compris le diagnostic, la garde de conservation, les audits et l'approbation automatique.

Aucune alerte n'est masquée, ignorée ou dismissée. Le rapport ne change pas son état GitHub et ne promet pas un check CodeQL vert. Les audits et problèmes antérieurs restent visibles. Aucun correctif source ni changement de dépendance n'est nécessaire pour les trois chemins examinés. Aucune fusion ni fermeture de PR.

## English

The three remaining records from the complete diagnostic have been qualified. ObjectRef findings conflate gchar/GError outputs with incompatible GObject conversions, including a nullable hostname handled as Option<GString>. The PtrSlice trace marks an array slot invalid after dropping its pointer-sized wrapper, although the destructor releases the pointed-to native object and the array allocation remains owned until PtrSlice itself is dropped.

The reviewed upstream panic-hardening change explicitly keeps drop_in_place followed by ptr::write for types with destructors; it does not support treating this exact sequence as a use-after-free. A separate real safe-constructor bug in the empty Slice-to-PtrSlice conversion is confirmed in glib 0.18.5. A concrete upstream-derived patch is preserved as an unapplied proposal: dry-run applicability is checked, but runtime backport validation has not been performed and the bug remains unfixed. No application exposure or connection to the truncate trace is demonstrated. Other collection fixes are documented without importing unrelated migrations. Five focused integration tests check none/full reference ownership, nullable output handling, actual object finalization, allocation preservation and truncate boundary cases. Existing sources, dependencies, historical reports, workflows, audit/licensing policy and automatic approval are preserved. No alert state is changed.
