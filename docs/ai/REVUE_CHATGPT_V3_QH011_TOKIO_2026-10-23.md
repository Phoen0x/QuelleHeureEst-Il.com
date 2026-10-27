# Revue indépendante ChatGPT V3 — QH-011 / Tokio 1.54.1 — 23 octobre 2026

**Verdict : correction ciblée de RUSTSEC-2026-0384 VÉRIFIÉE et acceptée sur [#183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183) au SHA `d033c8ea819614b4676f4db057ee3ef62c33f264` ; PR ouverte en brouillon et non fusionnée. QH-011 / T-003 restent OUVERTS : l'audit Rust strict échoue encore sur huit avertissements. Aucune approbation de fusion ni résolution globale de la sécurité.**

## Références et portée de cette revue

- Avant : [`fb3ff18a7829a7ac997e7569cabc8ed3a9603aca`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/fb3ff18a7829a7ac997e7569cabc8ed3a9603aca), après : [`d033c8ea819614b4676f4db057ee3ef62c33f264`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/d033c8ea819614b4676f4db057ee3ef62c33f264). **Un seul commit supplémentaire** sur #183, sans fusion.
- `main` `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228` ; tête de #186 `568bb986d83d862153349c0c1b09132bc2e868eb`, de #187 `6dc7ef9d6899331bf859dd1687c135a89ffcb852` avant la présente actualisation documentaire.
- [Rapport complet Codex](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/d033c8ea819614b4676f4db057ee3ef62c33f264/docs/reports/tokio-qh011-20261023.md) · [preuves structurées](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/d033c8ea819614b4676f4db057ee3ef62c33f264/docs/reports/tokio-qh011-20261023-evidence.json).
- **Statuts de preuve distincts :** comparaison des sources GitHub / SHA et lecture des journaux GitHub Actions **vérifiées indépendamment par ChatGPT** ; batteries exhaustives locales réalisées dans le runtime Codex **rapportées par Codex, non réexécutées en entier par ChatGPT**.

## Correction de l'avis officiellement publié

- [RUSTSEC-2026-0384](https://rustsec.org/advisories/RUSTSEC-2026-0384.html) / GHSA-5wjr-9356-4wc8, signalée le **21 octobre 2026** : condition de concurrence de `tokio::time::Interval` en runtime multithread susceptible de provoquer une utilisation mémoire après libération. Seule `tokio 1.54.0` était concernée dans l'intervalle pertinent ; première version corrigée **1.54.1**, publiée le 21 octobre, issue du [correctif officiel #8692](https://github.com/tokio-rs/tokio/pull/8692) et de sa [release](https://github.com/tokio-rs/tokio/releases/tag/tokio-1.54.1).
- **[VÉRIFIÉ PAR CHATGPT]** `Cargo.lock` n'a changé que pour **deux lignes du paquet Tokio** : `1.54.0 → 1.54.1` et checksum officiel `a0c168a4… → b52fd325…`. Aucune entrée d'une autre dépendance modifiée ; **504 paquets Cargo avant/après, 503 autres entrées identiques**. Aucun `Cargo.toml` ni autre manifeste modifié.
- **[RAPPORTÉ PAR CODEX]** `cargo metadata/tree --locked --target all` conserve les fonctionnalités `full`, `rt-multi-thread`, `time` et les quatorze consommateurs directs résolus ; MSRV Tokio `1.85` inchangée, toolchain de validation `1.99.1`. Les six réorientations Windows proposées lors d'une première résolution Cargo n'ont pas été publiées. Les essais `--locked` sont annoncés réussis ; un graphe Windows effectivement construit n'est pas démontré.
- La correction est dans le **graphe actif** ; le verrou original contenant `1.54.0` reste archivé pour la traçabilité, mais n'est pas réactivé.

## Conservation — indépendamment vérifiée

- Deux arbres Git complets : **157 → 165 fichiers**, **155 anciens fichiers identiques en SHA + mode**, **2 modifiés**, **8 ajoutés**, **zéro supprimé**. Les deux fichiers modifiés (`Cargo.lock` et `docs/validation/rust-178/check-ported-graph.cjs`) ont été copiés dans `docs/history/tokio-qh011-20261023/` : leurs **blob SHA archivés sont exactement les SHA antérieurs**, confirmés directement. `PORT.json` comporte l'inventaire exact des **157** fichiers initiaux, modes et empreintes concordants.
- **[VÉRIFIÉ DANS LA CI]** Garde de conservation **PASS** pour : 504 dépendances Cargo (Tokio comme unique changement), **409 snapshots pnpm inchangés et 140 optionnels**, historique et patch `braces` hash `ij22dduv7f6wi3glhwl7jmdbrm` conservés. Tauri 2.11.6, Reqwest 0.12.28/0.13.5, h2 0.4.20, Vite 8.1.6 et plugin React 6.0.2 non modifiés. Le code fantôme, les variantes historiques et le graphe JS ne sont pas modifiés.
- Contrôleur additif `Scripts/check-tokio-qh011.cjs` et tests nouveaux ; entrée `docs/validation/rust-178/check-ported-graph.cjs` adaptée avec copie exacte archivée. Conservation ne signifie pas absence de limitations dans les contrôleurs : des tests de mutation historiques ont été rapportés localement, pas intégralement relancés en CI.

## Validations GitHub Actions au SHA publié

- **[CI Rust dédiée #39875121149](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39875121149) SUCCESS**, terminée après la rédaction initiale du rapport Codex : `pnpm install --frozen-lockfile` valide, garde du graphe **PASS**, TypeScript, ESLint, build Web Vite **8.1.6**, **22 tests Node réussis, zéro ignoré, zéro échoué**, compilation Rust verrouillée et **2 tests HTTP réussis en profil debug**. Les traces HTTP sont `http1_json_client_remains_compatible` et `http2_json_uses_patched_transport`.
- [CodeQL Advanced #39875121155](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39875121155) et [Semgrep #39875121200](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39875121200) terminés avec succès dans leur périmètre.
- **[CI Security & Quality #39875121271](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39875121271) FAILURE** : CodeQL Java/Kotlin échoue sans code analysable. Le job Rust audit affiché comme réussi contient en réalité `cargo audit --deny warnings` **exit 1 avec 8 avertissements** ; le job JS utilise `npm install` rejeté par `only-allow pnpm`, puis `npm audit` sur un autre périmètre, avec **10 avis et exit 1**. Des jobs tolèrent des commandes échouées : les statuts verts ne suffisent pas. APIsec et SonarCloud continuent d'échouer ; certains contrôles externes restent hors périmètre.

## Campagne locale Codex, non entièrement réexécutée par ChatGPT

- **59 cas Node distincts**, 63 exécutions avec répétitions comptées séparément ; **2 tests HTTP distincts** réussis en debug **et release**, builds Rust debug/release, `cargo tree/metadata`, vérifications de fonctionnalités et CLI Tauri sans bundle annoncés réussis. Les suites amont `braces` de 764 tests et 24 000 comparaisons appartiennent aux **missions précédentes** et ne sont pas artificiellement attribuées à Tokio.
- Audit Rust comparé sur la même base RustSec : **AVANT : 1 vulnérabilité, 9 avertissements, exit 1** ; **APRÈS : 0 vulnérabilité classée, 8 avertissements, exit 1**. Les **huit avertissements résiduels** sont : sept dépendances `unmaintained` (`proc-macro-error`, `rustls-pemfile`, cinq `unic-*`) et `glib@0.18.5` `unsound`. Ces résultats sont corroborés pour **l'audit final** par les logs de CI, pas pour toutes les comparaisons locales.
- `pnpm audit` complet : **1 HIGH `braces`, exit 1** ; production : **0, exit 0**, résultats locaux rapportés par Codex. Aucune correction de la GHSA `braces` dans ce commit Tokio.
- Aucun test Android, Windows/WSL, GUI natif, installateur, Loom/Miri ni stress mémoire spécifique Tokio. Une CI Linux verte ne constitue pas une validation native de ces plateformes.

## Décision et suite

1. **RUSTSEC-2026-0384 corrigé dans le périmètre #183 au SHA `d033c8ea`**, revue indépendante des sources Git/CI favorable. Version non fusionnée à `main`. Le verrou historique n'est pas une vulnérabilité active s'il reste une archive non exécutée.
2. **QH-011 = PARTIEL / OUVERT et T-003 = non cochée**. Le reste du chantier est **la remédiation des huit avertissements** et le rétablissement d'un vrai audit strict, sans suppressions opportunistes, nouveaux `ignore` ou assouplissement.
3. **QH-009/T-002 toujours ATTÉNUÉ/OUVERT** ; résidus Chokidar, expansion `braces` et copie Vite embarquée toujours documentés ; **QH-010 corrigé sur #183 seulement**.
4. **QH-012/T-004 sécurité CI toujours OUVERTE**, processus externes et matrices à réparer sans désactiver de scanner. Aucune fusion, fermeture, modification des licences, bots, permissions, workflows ou `main`.
5. **Prochaine mission proposée, distincte et à autoriser** : cartographier et traiter **les huit avertissements Cargo/RustSec restants** (chaînes inverses, correctifs réellement disponibles, compatibilité Rust/GLib/variantes et options), d'abord par diagnostic ; aucun changement technique par cette seule revue documentaire.

Ce document est un **compte rendu indépendant** et ne prétend ni à une revérification exhaustive des tests locaux Codex ni à une validation globale de fusion.
