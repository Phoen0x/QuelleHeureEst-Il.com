# Gardes des anciens générateurs de candidats

FR : Cette mission protège les entrées historiques sans migrer les dépendances ni nettoyer les configurations parallèles. Référence de départ : f308ee1b97cc53bdadaf87041f82a5198b6b07e0. Les six versions complètes remplacées sont archivées sous `docs/history/candidate-generators-20261013/`, avec empreintes SHA-256 brutes. Les archives existantes restent intactes.

EN: This task guards historical entrypoints without migrating dependencies or cleaning up parallel configurations. Baseline: f308ee1b97cc53bdadaf87041f82a5198b6b07e0. Six complete previous versions are archived with raw SHA-256 digests. Existing archives are unchanged.

## Protections avant écriture

| Entrée | Référence compatible et protection |
|---|---|
| prepare-rust-h2-candidate.py | Manifeste et verrou exacts avant migration h2 ; root Cargo d'origine. Refus si configuration Cargo, vendor GLib ou test HTTP existe déjà. |
| prepare-rust-warnings-candidate.py | Manifeste et verrou exacts avant rétroport GLib ; root Cargo d'origine. Refus si override Cargo, vendor GLib ou test VariantStrIter existe déjà. |
| rust-h2-migration.yml et rust-warnings-migration.yml | Garde immédiatement après setup Python, **avant les copies de référence, les commandes Cargo et la première installation frontend**. Les copies anciennes ne peuvent donc pas contourner le contrôle de l'état initial. |
| js-security-maintenance.yml | Manifestes/verrou exacts avant l'ancien audit JS ; pnpm 8.15.9 obligatoire. Garde avant installation et répétée inline juste avant writeFileSync. L'état actuel contenant les cinq racines Babel/React Refresh est refusé. |
| lockfile-maintenance.yml | Référence actuelle exacte, incluant package/lock, h2 et les deux fichiers GLib rétroportés ; pnpm 8.15.9 et manifeste identique à HEAD. Garde avant régénération et contrôle de conservation exact avant export. Tout changement de résolution produit par ce rejeu est un échec. |

FR : Les scripts Rust fonctionnent désormais en **contrôle seul par défaut** ; `--check` est explicite et équivalent. `--generate` est nécessaire pour atteindre le corps historique, et il ne contourne aucune garde. Sur la branche actuelle, les deux anciens préparateurs et l'ancien générateur de sécurité JS échouent avant écriture : ils ne sont plus compatibles avec cet état déjà migré et corrigé. Le rejeu de maintenance du verrou est strictement borné à la référence courante examinée ; il n'est pas un outil général de mise à jour.

EN: Rust entrypoints are **check-only by default**; `--check` is equivalent. `--generate` is required to reach the historical body and bypasses no guard. Current migrated/patched state is refused by both old Rust preparers and the old JS security generator. Lock maintenance is bounded to the exact reviewed current state, not general updating.

## Contrôles sans mutation

FR : `Scripts/candidate_safety.py` et `Scripts/candidate-safety.cjs` utilisent les bibliothèques standard Python/Node, sans installation de dépendance applicative. Ils exigent la racine du dépôt, refusent les fichiers liés, vérifient les états et les six archives, et ne possèdent pas d'option force. Le contrôle pnpm appelle seulement `pnpm --version` ; un échec de cette commande est aussi bloquant. Il exige **8.15.9 exactement**, et une version Node satisfaisant la contrainte Vite. Aucune installation ou régénération n'est effectuée par les contrôleurs.

EN: Python/Node standard-library guards require repository root, reject linked files, verify states and six archives, and expose no force option. The pnpm check only calls `pnpm --version`, fails closed on errors, requires exactly 8.15.9 and a Vite-compatible Node version. Guards install or regenerate nothing.

```sh
python3 Scripts/candidate_safety.py --check current-conservation
node Scripts/candidate-safety.cjs --check current-conservation
node Scripts/candidate-safety.cjs --check-pnpm
python3 Scripts/prepare-rust-h2-candidate.py --check
python3 Scripts/prepare-rust-warnings-candidate.py --check
```

FR : `current-conservation` est un contrôle de l'état actuel, **pas une autorisation de rejouer les migrations anciennes**. Il couvre les cinq racines Babel/React Refresh via le manifeste, toutes les variantes optionnelles via le verrou complet, la migration h2 via le manifeste/verrou Cargo et les deux rétroports GLib via leurs fichiers et l'override. Les empreintes du texte actif ne normalisent que CRLF vers LF **en mémoire**, pour la compatibilité des checkouts Windows. Les archives sont comparées octet par octet. Aucun fichier n'est normalisé sur disque.

EN: `current-conservation` checks current state and **does not authorize old migrations**. Complete manifest/lock fingerprints cover Babel roots, optional variants and h2; source/config fingerprints cover both GLib backports. Active-text CRLF is normalized to LF **in memory only** for Windows checkouts. Archives are byte-exact; no file is normalized on disk.

## Compatibilité et limites réelles

FR : Aucune règle propre à GitHub, Git, StackBlitz/Bolt, Cursor, Claude ou Codex n'est remplacée. Les contrôles Node ne demandent pas Python ; les contrôles Rust Python ne demandent pas Node ou Cargo. Les fichiers npm parallèles, `.bolt`, `.cursor`, les deux configurations Tauri, AGENTS, les archives et les dépendances restent conservés. Le script de maintenance qui utilise git show exige logiquement un vrai checkout et un HEAD cohérent ; il refuse une matérialisation partielle au lieu d'inventer un manifeste.

EN: No client-specific configuration is replaced. Node checks need no Python; Rust Python checks need no Node or Cargo. Parallel npm locks, Bolt/Cursor/Tauri configurations, AGENTS, archives and dependencies remain. Maintenance using git show requires an actual checkout and consistent HEAD and refuses a partial materialization.

FR : Ces gardes préviennent les erreurs de contexte, pas un utilisateur malveillant capable de modifier les scripts, leurs empreintes ou d'appeler directement une archive/commande système. Elles supposent les exécutables du PATH fiables et n'offrent pas de transaction contre les écritures concurrentes entre contrôle et exécution ; coordonner les outils sur une branche. Une future modification légitime du graphe est refusée tant que la référence du générateur n'a pas été revue et archivée. Les archives ne sont jamais lancées automatiquement. Les workflows gardent leurs commandes d'audit et leurs permissions ; aucun push ou merge automatique n'est ajouté.

EN: Guards prevent context mistakes, not malicious modification or direct archive/system execution. They trust PATH executables, provide no transaction against concurrent writes, and conservatively reject future graph changes until reviewed. Audit commands/permissions remain; no automatic push or merge is added.

## Tests

FR : La suite de régressions utilise exclusivement des copies temporaires : refus des états courants, contrôle positif des anciennes références sans génération, refus de pnpm 11/10/8.15.8/absent, perte d'une racine Babel ou variante Android, altération des rétroports/verrou h2, configuration/test déjà présent, archive altérée, mauvais cwd, lien symbolique et arguments de contournement. Elle compare les empreintes de **tous les fichiers de la copie avant/après** et place des exécutables sentinelles pour détecter toute commande Cargo ou pnpm mutatrice. Un Git temporaire vérifie la protection contre restauration d'un mauvais HEAD. Les gardes CRLF sont testées sans écriture de normalisation. Le workflow dédié teste Ubuntu et Windows avec pnpm 8.15.9/Node 22, sans installer le projet.

EN: Temporary-copy tests cover incompatible states/managers, dependency/backport loss, existing outputs/configs, altered archives, wrong cwd, symlinks and bypass arguments. Full-file fingerprints prove no writes; sentinel executables detect mutating tool calls. Temporary Git checks HEAD safety; CRLF checks write nothing. Dedicated Ubuntu/Windows CI uses pnpm 8.15.9/Node 22 without project installation.

FR : Les résultats CI vérifiés sont consignés ci-dessous. Localement, les contrôles de conservation et refus actuels passent ; le sandbox refuse les processus enfants de Node (EPERM), donc les tests exigeant la sonde pnpm/Git restent à vérifier sur CI. Les anciennes données manquantes ou divergentes du dossier partiel ne sont pas réécrites : le dépôt distant complet sert de référence. Aucun corps mutateur historique n'est exécuté pour ces tests, même sur une référence positive.

EN: Verified CI results are recorded below. Local current checks/refusals pass; Node child processes are denied by the sandbox (EPERM), so pnpm/Git probe tests need CI. Missing/divergent historical materializations are not rewritten; the complete remote repository is authoritative. No mutating historical body is executed, including positive-baseline tests.

## Encodage des générations historiques

FR : Les corps historiques utilisent write_text sans encoding explicite. La garde exige donc un encodage Python par défaut UTF-8 **avant d'autoriser --generate**, sans modifier ces corps. Si ce n'est pas le cas, elle refuse avant écriture et indique Python -X utf8. Le contrôle seul reste possible. Le workflow dédié définit PYTHONUTF8=1 ; un test simule cp1252 sur une référence compatible et prouve que le corps ne s'exécute pas. La première variante de la garde et du workflow reste archivée. Les messages Python Windows de la première exécution étaient mal rendus ; la dernière exécution les affiche correctement.

EN: Historical bodies use write_text without explicit encoding, so --generate requires a UTF-8 Python default before any body executes. Non-UTF-8 defaults are rejected; check-only remains available. Dedicated CI sets PYTHONUTF8=1; an isolated cp1252 test proves refusal without writes. Previous guard/workflow versions are archived. Windows messages render correctly in the final run.

## Résultats réellement vérifiés

FR : Source validée **32b646058f64890d072118f41736e27b602093d5**. Le commit de compte-rendu suivant ne modifie que la documentation. Aucun générateur mutateur n'a été exécuté : les références positives ont été contrôlées avec --check ou le mode par défaut ; les appels --generate testés ont été refusés sur leurs copies.

EN: Validated source **32b646058f64890d072118f41736e27b602093d5**. The following report commit changes documentation only. No mutating generator ran: positive baselines used checks/default mode; tested --generate calls were refused on copies.

| Contrôle | Résultat |
|---|---|
| Gardes Ubuntu, snapshots avant/après et sentinelles | **21 tests réussis**, puis vrais contrôles Node/Python et pnpm 8.15.9 sans diff des manifestes/verrous. [Job 115558934745](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934745) |
| Gardes Windows, CRLF, Git HEAD, pnpm et UTF-8 | **21 tests réussis**, mêmes contrôles sans diff. [Job 115558934819](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934819) |
| Ensemble des contrôleurs | **41 tests Python réussis**. [Job 115558934423](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934423) |
| Installation JS gelée, conservation et tests | Succès : 335 entrées accessibles, 95 noms optionnels ; **10 tests braces + 3 tests Babel/Refresh/bundle**, 53 modules de production contrôlés. Même job. |
| ESLint, typecheck, Vite et actionlint | Succès. Même job. |
| Rust debug et tests du workflow de sécurité existant | Succès, **24 tests**. [Job 115558933907](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558933907) |
| rustfmt et Clippy existants | Succès ; avertissements tiers GLib visibles. [Job 115558934586](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934586) |
| Audits existants | Échecs inchangés : braces, 3 avertissements Rust, advisories/licences cargo-deny. [JS](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934136), [Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558933738), [cargo-deny](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934042) |

FR : Localement, **17 tests** ont passé sur une copie utilisant les archives exactes distantes, puis le nouveau test non UTF-8 a passé. Les sondes enfant Node ne pouvaient pas être validées dans le sandbox EPERM ; elles sont entièrement validées par les jobs Ubuntu/Windows ci-dessus. Une archive du dossier local partiel différait d'un saut de ligne de la version distante ; elle n'a pas été réécrite. Les tests CI utilisent le dépôt complet.

FR : L'API GitHub a annoncé mergeable:false / dirty et les jobs pull_request attendus ne sont pas apparus pour ces pushes. Le diagnostic de cet état n'est pas revendiqué ici ; la comparaison API indiquait aussi une branche ahead sans commit behind. Une validation push **bornée à la branche de #153** a donc été ajoutée au seul nouveau workflow de tests. Aucune fusion, rebase ou modification des règles d'approbation n'a été tentée. Ce statut devra être réexaminé séparément avant une éventuelle fusion, qui reste exclue de cette mission.

EN: Seventeen isolated local tests and the additional non-UTF-8 test passed; Node subprocess probes were blocked locally but fully passed in Ubuntu/Windows CI. A local historical materialization differed by a newline and was not rewritten. GitHub reported mergeable:false/dirty while its compare endpoint reported ahead with no behind commits; no conflict diagnosis is claimed. The new test workflow therefore has a push trigger limited to #153's branch. No merge/rebase/approval-policy change was attempted.

FR : Les blobs Git des huit entrées actives protégées, des configurations parallèles et de toutes les archives préexistantes restent ceux du commit de départ. Seuls les deux scripts de préparation et les quatre workflows de génération existants changent ; les gardes, tests, preuves et archives sont ajoutés. Aucun fichier ni dépendance n'est supprimé. Le build release, un APK, une session réelle StackBlitz/Bolt/Cursor/Claude et les écritures des anciens corps sur un état historique ne sont pas prétendus testés dans cette mission.

EN: Protected active inputs, parallel configurations and all pre-existing archives retain their original Git blobs. Only two existing preparers and four candidate workflows change; guards/tests/evidence/archives are added. No dependency or file is deleted. This task does not claim release/Android packaging, actual client sessions, or mutating historical replay validation.
