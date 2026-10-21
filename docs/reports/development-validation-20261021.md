# Déblocage du développement — 21 octobre 2026

## Périmètre et base

Base : `main` au SHA `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228`. Branche : `codex/fix-development-validation-20261021`. Cette mission corrige l'installation pnpm figée, la compilation Tauri 2 et les contrôles Web. Elle ne fusionne ni ne modifie les PR existantes, les workflows, permissions, licences ou configurations de bots.

## Réutilisation et conservation

- Le verrou pnpm est repris intégralement de [#179](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/179), SHA `b7c96646ef7a00a048b646918be5f2547b479426`. Le manifeste de dépendances et le verrou historique de cette PR ont été comparés octet pour octet à la base avant portage.
- Les gardes de conservation, le manifeste de provenance `docs/history/rust-178/PORT.json` et les copies de référence proviennent du même SHA. Le contrôle exécuté trouve **337 snapshots, 302 accessibles, 35 historiques non réactivés, 95 optionnels**. Les 298 anciens snapshots sont tous conservés ; seul celui de Vite 8 est corrigé et 39 snapshots manquants sont ajoutés. Aucun snapshot n'est supprimé.
- Les quatre représentations npm restent inchangées, y compris leur variante historiquement invalide. Le gestionnaire actif reste pnpm, imposé par le `preinstall` existant ; aucun support npm nouveau n'est revendiqué.
- Les adaptations `shell-open` / `get_webview_window` et la configuration sous `src-tauri` sont reprises de la chaîne #176–#179. Les anciennes variantes restent commentées et les sources complètes sont conservées sous `docs/history/development-validation-20261021`.
- L'icône est reprise de [#153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153), SHA `0ebc167c8febf1b61752d1114f8135a59400c5f1`, blob `fde760bc8173080d1ca767a2cd217c9317e902ab`. Son identité Git a été recalculée avant écriture. Aucun générateur d'icônes ni nouvelle ressource graphique n'est utilisé.
- Le nouveau `Cargo.lock` fixe **506 paquets**. Tauri Rust est limité à la série `~2.11.0` pour correspondre à @tauri-apps/api 2.11.0. Le verrou fixe tauri 2.11.6 et ses composants à la famille publiée dans le Cargo.lock officiel de cette version (build/macros/codegen 2.6.3, runtime 2.11.3, runtime-wry 2.11.4, utils 2.9.3). Les autres contraintes Rust sont conservées. La feature inexistante `shell-open` est retirée de la configuration active ; sa ligne historique reste conservée. Les profils existants restent inchangés.
- La configuration Tauri à la racine est préservée. Aucun changement de CSP, permission ou politique de sécurité n'est introduit. Les schémas générés sont ignorés spécifiquement ; `src-tauri/gen/android` n'est pas exclu.

## Contrôles Web corrigés

Le script `tauri` se place explicitement dans `src-tauri` avant de lancer le CLI ; `build` et `tauri:dev` l'utilisent. Cela évite que l'ancienne configuration racine fasse traiter le Cargo.toml de workspace comme un paquet, sans supprimer cette configuration historique.

Le chemin d'import Tauri 1 est remplacé par `@tauri-apps/api/core`, avec la variante ancienne conservée. Le résultat optionnel du cache est typé explicitement.

Le composant pollen utilisait une conversion qui incluait aussi la propriété `time: string[]`, et comparait les niveaux français à la valeur inexistante `none`. Ses clés sont désormais issues de `HourlyPollen`, sans conversion forcée, et le niveau nul est comparé à `aucun`. L'ancien index de types reste commenté et la source précédente est archivée en texte pour ne pas réactiver le code historique dans les builds ou le lint.

Deux tests de rendu réels couvrent les concentrations nulles et positives : affichage et disparition du badge « All Clear ». Ils utilisent les dépendances déjà présentes et le runner Node, sans nouvelle dépendance racine.

## Validations réellement exécutées

Environnement : Node 24.19.0, pnpm 8.15.9, Rust/Cargo 1.99.1, GTK 3.24.49, WebKitGTK 2.54.0. Les prérequis natifs ont été préparés dans l'environnement de développement depuis les paquets Debian signés, sans désactiver leurs vérifications.

| Contrôle | Résultat |
| --- | --- |
| `pnpm install --frozen-lockfile` | PASS |
| `node docs/validation/rust-178/check-ported-graph.cjs` | PASS, variantes historiques et optionnelles conservées |
| `pnpm run typecheck` | PASS |
| `pnpm run lint` | PASS, aucun ignore de contrôle ajouté |
| `pnpm test` | **2 tests exécutés, 2 réussis**, aucun ignoré |
| `pnpm run vite:build` | PASS |
| Interface Web dans Chromium | PASS : rendu React, changement de thème et d'unité, persistance après rechargement, aucune erreur JavaScript |
| `cargo build --workspace --locked --jobs 3` | PASS ; les avertissements préexistants restent visibles |
| `pnpm run tauri build --debug --no-bundle` | PASS, frontend reconstruit et binaire natif généré par le vrai CLI |
| `cargo test --workspace --locked --jobs 3` | Commande réussie mais **0 test Rust** : aucune couverture unitaire native revendiquée |
| `git diff --check` | PASS |

Les contrôles utilisent les vrais outils et les vrais sources. Les commandes réseau ont des délais explicites ; la compilation Rust est bornée à vingt minutes et réutilise son cache.

## Limites et revue

Le démarrage graphique natif a été tenté sous Xvfb. Il est bloqué dans cette machine par l'emplacement système attendu des processus WebKit, absent sous `/usr/lib` et non inscriptible avec les permissions disponibles. Le build natif et le démarrage Web sont validés séparément ; aucune réussite du GUI natif n'est revendiquée et aucun sandbox WebKit n'a été désactivé pour contourner cet obstacle.

Les profils release, les bundles d'installation, Android sur appareil/émulateur et les audits de sécurité complets ne sont pas validés par cette mission. Les avertissements de code Rust existants et les échecs historiques de CI ne sont pas masqués. Les résultats CI au nouveau SHA doivent être relus indépendamment ; les anciens statuts des PR #176–#179 ne sont pas substitués à ces vérifications.

Le rapport et les archives contiennent uniquement les faits techniques nécessaires ; aucun contenu personnel, secret ou journal réseau brut n'est publié. Destinataire : revue indépendante par ChatGPT au SHA indiqué dans la PR, avant toute décision de fusion.
