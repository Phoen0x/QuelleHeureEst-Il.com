# Portage ciblé des corrections pnpm et Tauri — après #178

Cette mission part exactement de `7826f7e10d0a420406a5b8e43a4da92efcea9cd6` (#178), sur une branche distincte, avec une PR en brouillon ciblant `fix/rust-tauri2-shell-feature` (#176). Aucun résultat historique n'est réécrit et aucune fusion n'est autorisée.

## Origine et périmètre des corrections

- [#153 au SHA relu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153), `0ebc167c8febf1b61752d1114f8135a59400c5f1` : rapports d'écarts, protections de dépendances, variantes et adaptation `get_webview_window` consultés avant modification.
- [Réparation initiale du graphe de #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/076b523ba719aa4c4bd0dd2f2c34807824602195) : import des seuls snapshots requis, sans ses changements ultérieurs de manifeste, d'overrides, de correctifs de sécurité ou de dépendances racines.
- [Dernier graphe précédant la migration partielle](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/e434b14c866395d05bb49c50034154e77ec2ee38) : seul snapshot Vite 7.3.5 repris afin de fermer aussi le graphe historique du Plugin React 4.7, sans le rendre accessible depuis les racines.
- `src-tauri/src/main.rs` : seul appel actif remplacé par `get_webview_window("main")`, comme dans #153. L'ancien appel reste en commentaire et le fichier entier reste archivé. Aucun changement de permissions, fonctionnalités ou configuration Tauri.

## Verrous et conservation

L'inventaire antérieur couvre tous les snapshots pnpm, leurs arêtes ordinaires/optionnelles et les racines, ainsi que les quatre représentations npm. Le verrou pnpm initial contient 298 snapshots, dont 63 optionnels ; il manque Plugin React 6 depuis une racine et Vite 7 depuis une variante historique. Son snapshot Vite 8 conserve des métadonnées incompatibles de Vite 7.

La réparation ajoute exactement 39 snapshots et corrige seulement `/vite@8.0.16`. Les 297 autres snapshots restent identiques. Aucun nœud, version ou variante native existante n'est supprimé ; tous les descendants nouveaux, y compris Android, WASM et les variantes des autres plateformes, restent dans le verrou. Le manifeste et toutes les références racines restent inchangés. Le peer optionnel Lightning CSS demeure dans la vraie variante Vite 7 ; Vite 8 déclare sa dépendance obligatoire conformément à #153. Les anciennes métadonnées Vite 8 restent intégrales dans l'archive.

Les [archives et différences exactes](../history/rust-178/PORT.json) contiennent l'origine et le contenu structuré de chaque snapshot porté, les empreintes avant/après et l'inventaire des représentations npm. Les fichiers `pnpm-lock.yaml`, `package.json` et `main.before.rs` de ce répertoire conservent les sources antérieures octet pour octet. `package-lock.main.json` est déjà un JSON invalide (ligne 1503) ; cette mission le conserve, avec le rapport de réparation et les deux autres verrous npm, sans exécuter leurs générateurs.

Le [contrôleur dédié](../validation/rust-176/check.py) exige 86 fichiers de #176 identiques et les deux sources modifiées intégralement archivées. Sur les 93 fichiers de #178, 89 restent identiques ; seuls le verrou, l'appel Rust et les deux fichiers de validation dédiés changent. Sept fichiers sont ajoutés. Tout autre changement, suppression, nouvelle permission ou modification de configuration est refusé. La configuration Tauri locale ajoutée par #178 reste inchangée.

Le [garde-fou générique de #153](../validation/rust-178/check-js-dependency-preservation.cjs) est repris sans modification (blob Git `72a00dd767c7761ff9a5aac62d301a004c11c37d`). Le [contrôle supplémentaire](../validation/rust-178/check-ported-graph.cjs) vérifie tous les snapshots et toutes les arêtes, même hors des racines, le portage exact et la non-réactivation de Vite 7 / Plugin React 4. Les anciennes variantes restent présentes sans être installées ni activées automatiquement. Les protections propres à #153 restent sur sa branche ; ce portage ne les déploie pas sur main.

## Validation et limites

La CI dédiée conserve `pull_request`, `contents: read`, le checkout au head exact sans credentials persistés et la copie temporaire de travail. Aucun workflow historique n'est modifié. La séparation installation/graphe/Vite expose chaque échec ; aucune étape obligatoire n'est facultative et aucun échec n'est transformé en succès.

Commandes prévues dans la CI : pnpm 8.15.9 / Node 22, `pnpm install --frozen-lockfile`, contrôle du graphe, `pnpm run vite:build`, puis `cargo build` / `cargo test` debug et release, toujours `--workspace --locked --verbose`, avec un unique verrou Cargo généré dans la copie temporaire et archivé. Les quatre commandes Rust restent tentées même si le frontend échoue ; le bilan reste alors en échec. Les journaux, versions, instantanés de conservation et verrous temporaires sont publiés en artifact pendant 14 jours.

Ce document décrit le protocole, pas une attestation de réussite. Les résultats effectifs, le SHA exact et les liens des journaux seront consignés dans la description de la nouvelle PR après exécution. Tout défaut supplémentaire reste bloquant et hors périmètre. Android, l'exécution graphique de Tauri, les audits de sécurité et le service Mend ne sont pas validés par cette CI.

Les instructions `AGENTS.md` et le contrat IA ont été lus depuis [la proposition documentaire](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/d6ca1f05dba2094410533b506bf02406b3f00143). Ils restent absents de main (`235194a6fe825a6dac27012f07cbac2cc5d86794`) et de cette chaîne ; leur découverte automatique par un nouvel agent n'est donc pas garantie. Les opérations GitHub utilisent le connecteur, dont l'interface n'expose pas de délai d'annulation paramétrable ; un délai d'affichage ne constitue pas une preuve d'arrêt distant. Les commandes réseau terminal nécessaires sont bornées avec arrêt forcé et tentatives limitées.
