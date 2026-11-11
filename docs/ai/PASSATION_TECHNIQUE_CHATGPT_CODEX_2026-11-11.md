# Relais technique ChatGPT / Codex — QuelleHeureEst-Il.com — 11 novembre 2026

**Nature :** synthèse technique publique, impersonnelle et datée. **Statut : proposition documentaire ; PR en brouillon.**
Ce fichier ne reproduit aucune conversation privée, aucune donnée de compte, aucun secret, ni aucune télémétrie personnelle. Il ne remplace ni les sources GitHub, ni les rapports détaillés, ni les décisions humaines. Les états indiqués sont historiques et doivent être revérifiés au HEAD courant.

## 1. Gouvernance et méthode

- **Responsabilités :** décision humaine sur les changements sensibles et fusions ; ChatGPT coordonne, mène les recherches préalables et la revue indépendante ; Codex réalise les tâches ciblées sur branches isolées ; GitHub, les SHA et les journaux CI déterminent l'état réellement publié.
- **Recherche préalable obligatoire :** documentation officielle, changelogs, avis de sécurité, issues/PR et correctifs amont, solutions communautaires éprouvées, versions, disponibilité et compatibilité. Présenter les faits prouvés, les hypothèses et les limites **avant** les migrations complexes.
- **Conservation :** ne pas effacer le code fantôme, commentaires, variantes historiques, configurations, dépendances optionnelles, archives, preuves ni expériences négatives. Un audit vert artificiel ou une disparition d'avertissement ne prouve pas une correction.
- **GitHub :** aucune fusion, fermeture/suppression de PR, bypass, force-push, modification de ruleset, de bots, de licences, de workflow d'approbation ou d'audit sans autorisation expresse distincte.
- **Preuves :** branche, SHA, arbre/blobs/modes, diff, commandes, environnement, sorties réelles, checks, logs, rapports, provenance, tests réellement exécutés, tests ignorés et limites.
- **Prompts et relais :** fournir un prompt complet avec périmètre, réglages par rôle, critères de conservation et d'acceptation, une seule prochaine action et un relais exploitable en cas d'interruption.
- **Modèles / vitesse :** pour chaque prompt et chaque agent, recommander le modèle réellement sélectionnable, l'effort, la vitesse, un repli et la justification. **Vitesse Standard/Normale uniquement** pour Codex/Work et sous-agents jusqu'à modification explicite de la règle ; Rapide suspendu, Ultrarapide exclu, GPT-6 Astra en Rapide/Ultrarapide non autorisé. Ne pas attribuer une sélection fictive aux outils sans sélecteur.
- **Confidentialité :** seuls les constats techniques impersonnels et liens publics ont leur place ici. Les archives privées et exports de conversations sont hors de ce dépôt.

**Documents canoniques :** `AGENTS.md`, `docs/ai/WORKING_CONTRACT.md`, `docs/ai/README.md`, `docs/ai/KNOWLEDGE_PRIVACY_POLICY.md`, `docs/ai/REGISTRE_DECISIONS_ET_INVARIANTS.md`, `docs/ai/JOURNAL_DE_BORD_TECHNIQUE.md` et `docs/ai/STARTUP_CHATGPT_CODEX_PHOEN0X.md`.
La proposition [#195](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/195) complète les règles de sélection des modèles sans valoir fusion ni entrée automatiquement active sur main.

## 2. Historique des PR pertinentes (photographie du 11 novembre 2026)

| PR | HEAD examiné | État, portée et limites |
| --- | --- | --- |
| [#153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153) | `0ebc167c8febf1b61752d1114f8135a59400c5f1` | Fiabilisation CI, graphes et tests ; travaux très larges, chevauchements et conflits ; non fusionnée. |
| [#183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183) | `f2eee4223a1ccf5b0866944580df8fd5979575dd` | Déblocages JS, HTTP/2, Tauri 2, Rust/Tokio et GLib VariantStrIter ; tests partiels et audits stricts encore ouverts. |
| [#194](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/194) | `d35eb03ff7e63a77fcc1094a9292b87992e3337d` | Branche dédiée dérivée de #183, correctif officiel GLib Slice vide → PtrSlice ; **brouillon, non fusionnée**. |
| [#195](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/195) | `06190945ef5c92f6e49fd00c616505d3200f343c` | Guide modèle/effort/vitesse et règle Standard ; brouillon, non fusionnée. |
| [#166](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/166) | `dc9aed72b1c5590825750074f088a46822def4f2` | Proposition Renovate `rusqlite 0.29 → 0.41`, manifeste uniquement, sans migration lockfile ni validation complète ; non fusionnée. |

## 3. GLib / PR #194 — verdict technique circonscrit

- Correctif officiel gtk-rs `Slice → PtrSlice` : https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214 ; issue amont #2042.
- `VariantStrIter` déjà rétroporté sur #183 ; avertissement [RUSTSEC-2024-0429](https://rustsec.org/advisories/RUSTSEC-2024-0429.html) encore lié à l'identité de version `glib 0.18.5`.
- Comparaison Git #183 → #194 : **302 → 309 blobs ; 299 fichiers historiques inchangés ; trois modifications archivées ; sept ajouts ; aucune suppression ni changement de mode**.
- Le blob `ptr_slice.rs` corrigé et les six tests supplémentaires sont identiques à ceux de #153. Les huit tests d'intégration précédents sont préservés.
- Codex a **déclaré** 14 tests Rust distincts réussis en debug et release, seize rejets de mutations attendus et des graphes Cargo inchangés. Cette déclaration n'est pas une reproduction indépendante des journaux locaux.
- Clippy strict a été déclaré en échec (code 101), huit diagnostics d'applicatif inchangé. La CI de sécurité contient des étapes tolérant les erreurs, d'où le maintien du **NO-GO de fusion**.
- CodeQL a ouvert une trace sur la copie historique `docs/history/.../ptr_slice.rs:900` et non sur la nouvelle branche de conversion corrigée ; préserver la trace et la revue plutôt que la fermer automatiquement.

## 4. SQLite — nouvel avis et migration à traiter séparément

- Avis [RUSTSEC-2026-0459](https://rustsec.org/advisories/RUSTSEC-2026-0459.html) / CVE-2026-119375 : `libsqlite3-sys 0.26.0` avec SQLite embarquée, lecture de données non initialisées sur certaines incohérences de taille de pages base/WAL.
- Correctif SQLite officiel : https://github.com/sqlite/sqlite/commit/e5bf119821f25be1d7f10ef0a2edbe175289166e.
- Candidate officielle : `rusqlite 0.41.1`, `libsqlite3-sys 0.39.x` et SQLite embarquée 3.54.0 ou ultérieure, sous réserve des fonctionnalités, MSRV, licences et plateformes.
- #194 déclare `rusqlite = { version = "0.29", features = ["bundled", "chrono"] }`. Le code métier Rust vérifié utilise le cache JSON sans appel direct identifié à une connexion SQLite ; cela ne constitue **pas** une preuve d'inexploitabilité universelle.
- L'étude de migration doit reprendre #194 comme base, protéger les variantes et transformer les gardes strictement, mettre à jour le verrou reproductible et prouver la version SQLite effectivement liée. Le simple changement de manifeste de #166 est insuffisant.
- **Mission Cloud SQLite** : interrompue lors des analyses préalables ; aucun commit ni PR SQLite publiés au dernier relevé GitHub. Le contenu temporaire de la session Codex est inconnu depuis GitHub. Une nouvelle reprise doit d'abord interroger cet espace de travail et réutiliser ses travaux, sans réexécuter inutilement les recherches.

## 5. QH-012 / CI — causes déjà documentées

La version actuelle de `.github/workflows/security-analysis.yml` conserve un workflow transversal historique apparu avec la [PR #96](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/96). Les statuts de jobs ne reflètent pas nécessairement les commandes critiques parce que certaines étapes utilisent `continue-on-error: true` ; le résumé affiche des coches de succès statiques.

Constats observés dans les logs de #194 :

- `cargo audit --deny warnings` échoue en réalité, mais le job englobant peut être vert ; l'avis SQLite récent modifie les chiffres d'avis par rapport aux audits d'octobre.
- `cargo-deny-action@v1` reçoit `--all-targets`, argument invalide ; #153 utilise v2 sans cet argument.
- Rust Build / Clippy dans le workflow transversal sans prérequis GLib/GObject/GIO natifs ; la CI Rust dédiée de #183 installe ces bibliothèques mais est déclenchée pour main / PR vers main, pas nécessairement pour les PR imbriquées vers #183.
- `npm install` / `npm audit` sont incohérents avec le projet et son verrouillage pnpm ; #153 fournit un audit pnpm figé.
- CodeQL Java/Kotlin échoue faute de source applicable ; #153 propose une matrice restreinte aux langages présents, à réexaminer sans désactiver l'audit de code existant.
- Android Lint affiche succès alors qu'aucun `gradlew` n'est présent ; absence de Gradle = non applicable, pas validation Android.
- SonarCloud requiert une configuration absente ; #153 propose une exécution conditionnelle.
- OWASP génère son SARIF sous `reports/` mais l'ancien workflow tente un téléversement depuis un mauvais chemin ; variante #153 corrige la trajectoire.
- Semgrep a effectivement produit et téléversé du SARIF dans le relevé, mais l'action historique est dépréciée et emploie des entrées obsolètes.

**Objectif futur :** états exacts PASS / FAIL / SKIPPED / NOT CONFIGURED, conservation des scanners et des limitations, tests de mutations du reporting, zéro modification silencieuse du workflow auto-approve ni des protections. Le résumé de #153 doit lui-même être vérifié (coches statiques persistantes).

## 6. Actions à conserver séparées

1. **Reprise Codex SQLite** depuis le workspace déjà utilisé, puis nouvelle PR brouillon ciblant #194, avec audit amont et preuves.
2. **Revue indépendante SQLite** : versions et sources effectivement liées, graphes/features toutes cibles pertinentes, tests, gardes, conservation, scans et risques.
3. **Fiabilisation CI / QH-012** sur branche et PR distinctes à partir des éléments éprouvés #153 ; éviter les faux succès et expliquer les skips sans désactiver des scanners.
4. **Clippy applicatif** : corrections circonscrites, séparées de SQLite et de la fiabilisation CI.
5. **Audits dépendances, consolidation #153/#183/#194**, plateformes et revue documentaire #195 : chacune avec décision explicite.

Ne fermer, fusionner, rebâtir ou réécrire aucune branche historique sans décision spécifique. La prochaine session doit vérifier les HEAD, checks, règles et journaux **au moment de l'action**.

## 7. Limites et relais

Cette note constitue **un inventaire technique public à portée limitée**, pas une récupération exhaustive de toutes les conversations/agents, ni une preuve de validation des tests, de l'APK Android, de GUI Linux ou de toutes les plateformes. Les archives personnelles, captures, télémétries de compte et transcriptions intégrales sont conservées hors de GitHub. Toute récupération d'une session Codex inaccessible doit être annoncée comme telle.

**Prochaine étape technique :** reprendre la mission SQLite dans son environnement existant avec vitesse Standard/Normale ; recueillir les résultats publiés avant la contre-expertise indépendante.
