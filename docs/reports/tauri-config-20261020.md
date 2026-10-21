# Configuration Tauri au bon emplacement — 20 octobre 2026

## Source et comparaison

Branche `fix/tauri-config-after-177`, issue exactement de `f77ec17c1ce9ef7455122d00427a5e815ae7e1c1` ([#177](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/177)), ciblant `fix/rust-tauri2-shell-feature` ([#176](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/176)). Les anciennes PR ne sont pas modifiées. Le rapport original de #177 est conservé comme photographie historique ; le présent document décrit uniquement le complément.

La configuration racine historique `tauri.conf.json`, blob `76d38f4eaa8ff42b11c808aa196d203dcf2f04d5`, est conservée octet pour octet. La configuration de [#153 sous src-tauri](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/src-tauri/tauri.conf.json), blob `37aca3088286ad0900ed1b651d2c1f56c2af2e01`, ajoute le schéma Tauri 2 et utilise pnpm dans les hooks. Identifiant, version, nom, fenêtres, sécurité, URL de développement et chemin des assets sont autrement identiques.

Le nouveau `src-tauri/tauri.conf.json` reprend exactement les valeurs racines et ajoute seulement `$schema: https://schema.tauri.app/config/2`. Les hooks npm historiques sont conservés : aucun changement de gestionnaire de paquets n'est nécessaire pour corriger l'emplacement. `frontendDist: ../dist` désigne désormais le dossier dist racine depuis src-tauri. Aucun changement de permission, fonctionnalité, identifiant applicatif, CSP ou comportement de fenêtre n'est introduit.

## Frontend et périmètre de validation

La préparation des assets reprend Node 22, pnpm 8.15.9, `pnpm install --frozen-lockfile` puis `pnpm run vite:build` du [workflow #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/.github/workflows/rust.yml). Elle s'exécute uniquement dans la copie temporaire déjà contrôlée par #177. Les actions de préparation sont épinglées à des commits ; les versions réellement utilisées sont journalisées.

Aucun verrou n'est régénéré pour contourner un échec frontend ; aucun stub d'assets, changement des sources ou import des autres corrections de #153 n'est autorisé. Un défaut frontend supplémentaire reste un échec explicite. Les quatre commandes Rust de #177 restent tentées en debug/release après les prérequis Linux et la résolution Cargo, même si la préparation frontend échoue. Aucun `continue-on-error` ni changement du workflow Rust historique.

## Conservation stricte

- Les **88 fichiers de #176**, manifestes et verrouillages historiques compris, restent identiques.
- Le contrôleur vérifie aussi les **91 fichiers du SHA #177**, en autorisant uniquement la modification des deux fichiers de validation dédiés : le workflow et son contrôleur. Les 89 autres fichiers, notamment le rapport de #177, restent identiques.
- Deux nouveaux fichiers seulement par rapport à #177 sont admis : `src-tauri/tauri.conf.json` et ce rapport. La liste des ajouts par rapport à #176 reste exacte, sans autorisation générique sur un dossier.
- La nouvelle configuration est comparée structurellement à la configuration historique, avec la seule addition du schéma. Une différence de réglage supplémentaire échoue.
- Le frontend devient une étape obligatoire du bilan et son journal une preuve obligatoire. Toute étape obligatoire échouée, ignorée ou dépourvue de preuve empêche un bilan vert.
- Les fichiers du checkout, ceux de la copie temporaire et le verrou Cargo de l'essai sont vérifiés après exécution. Les artifacts et les preuves de #177 restent consultables ; aucun historique n'est réécrit.

## Résultats et limites

Les contrôles locaux, le SHA publié, les résultats effectifs des quatre commandes Rust, les défauts éventuellement découverts et les liens du run, du job et de l'artifact sont consignés dans la description de cette nouvelle PR. Un échec pendant la compilation ne constitue pas une exécution réussie des tests unitaires.

La configuration Tauri de #153 sert de référence, pas d'autorisation pour importer ses changements applicatifs, icônes ou dépendances. Si un défaut nouveau apparaît après celui de l'emplacement, il est documenté sans être corrigé dans cette mission. Le frontend, Android, les interfaces graphiques, la sécurité et le fonctionnement offline ne sont pas déclarés validés sans exécution correspondante.

Les paquets système, Node et la toolchain préinstallée sont observés et journalisés mais pas figés bit pour bit. Le verrou Cargo généré uniquement dans la copie temporaire est archivé. Les règles IA de #175 restent absentes des branches sources au relevé et doivent être ouvertes depuis leur PR.

ChatGPT doit vérifier les arbres au SHA exact, la configuration historique et la seule addition du schéma, la liste stricte des fichiers autorisés, les logs frontend/Rust et les preuves de conservation. Toute correction suivante nécessite une mission distincte. Aucune fusion autorisée.
