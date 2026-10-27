# Archive distincte A — Intégration expérimentale — 26 octobre 2026

Publication documentaire le 27 octobre, sans rejeu technique. [Synthèse d'archivage](../../ai/EXPERIMENTATION_QH011_INTEGRATION_ATOMIQUE_2026-10-26.md), [rapport original exact](original/REPORT.md), [décision avant prototype](original/SCOPE_DECISION.md). L'[étude B](../qh011-acl-contract-20261027/NOTICE.md) est postérieure et indépendante ; elle précise notamment le contrat minimal et la portée de capabilities.json sans réécrire cet original.

## Pièces et transformations

- original : rapport, décision et manifeste des 500 empreintes à l'octet.
- probe : sources finales, quatre exemples, manifeste, verrou et configuration, tous originaux sous suffixe .txt ; aucun workspace actif.
- experimental : module original et diff final étroit des quatre fichiers Tauri, en données inertes. Aucun patch intégré ni fork publié.
- records : résultats, versions, exposition, recherches propres à la mission et empreintes avant/après ; chemins génériques remplacés lorsque nécessaire.
- logs : stdout/stderr des tests, quatre exemples, compilation et tentatives échouées. Les avertissements sont conservés. Les diagnostics JSON sont des extractions compiler-message des JSONL originaux, pas de nouveaux logs bruts.
- historical-scripts : script de modification de copie original, texte inerte. Il attend l'état du prototype précédent ; **ne pas le lancer seul sur une source Tauri officielle en pensant reproduire le diff final complet**.

[archive-provenance.json](archive-provenance.json) décrit chaque copie, extraction et empreinte avant/après. [source-inventory.json](source-inventory.json) couvre les 500 sources vérifiées, y compris celles dont les octets sont omis. Le manifeste original s'exclut lui-même. Un digest ne préserve pas les octets omis.

Les logs/records transformés remplacent uniquement des racines techniques : STUDY_A, STUDY_B, PROJECT, PRIOR_PROBE, PRIOR_DIAGNOSTIC, ENVIRONMENT et CARGO_HOME, entre chevrons. Les originaux exacts gardent leurs chemins techniques génériques ; aucun chemin personnel ou paramètre réseau privé n'est ajouté. Aucun diagnostic n'est supprimé pour obtenir un succès.

Copies complètes de l'application et des dépendances, caches, binaires, metadata machine complète et JSONL d'artefacts ne sont pas publiés. Les sources du produit sont identifiées par #183 f2eee4223a1ccf5b0866944580df8fd5979575dd. Des JSON tiers de recherche sont omis par minimisation ; leurs empreintes et références publiques demeurent. Les licences MIT/Apache Tauri déjà archivées sont [conservées ici](../qh011-atomic-admission-20261026/third-party-notices/tauri-2.11.6/LICENSE_MIT.txt) et [ici](../qh011-atomic-admission-20261026/third-party-notices/tauri-2.11.6/LICENSE_APACHE-2.0.txt) ; aucune licence du dépôt n'est changée.

Les snapshots complets des sources intermédiaires avant correction d'import/fixture n'ont pas été retrouvés comme fichiers autonomes. Leurs erreurs exactes et diagnostics disponibles sont conservés ; aucune source ancienne n'est reconstruite sous couvert d'original. Les sources finales et résultats indispensables sont présents.

## Lecture des résultats

Dernier runtime : **22 cas distincts, 13 rejoués + neuf nouveaux, 22 réussis, 0 échec/ignoré, sortie 0**. Ne pas additionner les rejeux. Le premier runtime avait 21 réussites et un échec de construction de fixture ; la première compilation échouait sur un import privé. Les quatre compilations négatives/positive sont séparées : 101/E0451, 101/E0616, 101/E0624, puis 0 pour Context brut. Context est contrôlé à l'installation ; il reste constructible en Rust.

Le conteneur autonome admet des capacités dynamiques ; le profil installé les interdit. MockRuntime ne prouve ni GUI ni compatibilité multiplateforme. Option A sous conditions ; option B NO-GO ; aucune validation Unicode, aucun audit, MSRV exact 1.90, release ou test natif Android/Windows/macOS. Aucun effet sur le NO-GO Unicode antérieur.

## Reproduction ultérieure — procédure non rejouée ici

La reconstruction en environnement entièrement neuf n'est pas testée. Ne jamais exécuter dans le checkout original.

1. Préparer un répertoire extérieur neuf, Rust/Cargo 1.99.1 et les prérequis Linux du [guide #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f2eee4223a1ccf5b0866944580df8fd5979575dd/docs/development/linux-environment-20261022.md). Préserver TLS et protections.
2. Obtenir une copie officielle de tauri 2.11.6, checksum du Cargo.lock et origine VCS 9452ddee5ebefd9b678a94ff003521379df6c9ae. Les bibliothèques utils/runtime/build/codegen/macros restent 2.9.3/2.11.3/2.6.3. Ne pas migrer le verrou.
3. Dans la copie temporaire seulement, reproduire experimental/tauri-experimental.diff.txt, puis placer atomic_admission_probe.rs.txt dans src/ipc/atomic_admission_probe.rs. Comparer les sources pertinentes à records/tauri-source-after.json. Les marqueurs de cache Cargo ne sont pas des fichiers source à fabriquer pour satisfaire un inventaire.
4. Reconstituer le crate probe depuis les .txt, en retirant uniquement ce suffixe. Copier séparément le vendor GLib corrigé de #183 avec ses licences ; adapter explicitement les deux chemins de la configuration pour pointer vers les copies Tauri et GLib. Garder les originaux d'archive intacts. Le manifeste du probe contient test et dynamic-acl, sans wry.
5. Depuis le probe, avec l'environnement natif préparé, compiler uniquement la bibliothèque de tests :

```sh
timeout --kill-after=5s 180s cargo --config ./.cargo/config.toml test --lib --locked --offline --no-run --message-format=json
```

Les paquets doivent déjà être disponibles pour offline. Vérifier la provenance des manifestes par metadata ; --manifest-path seul ne garantit pas le GLib corrigé.

6. Identifier le seul exécutable de ce crate dans compiler-artifact ; exécuter --nocapture --test-threads=1 dans un enfant avec timeout mural 30 s, RLIMIT_CPU 10, RLIMIT_AS 1073741824 et RLIMIT_CORE 0. Attendre les 22 tests distincts ; ne pas présenter un dépassement de ressources comme succès.
7. Compiler séparément chaque exemple avec cargo check --example NAME --locked --offline et la même configuration explicite, délai 90 s. Vérifier le diagnostic attendu, pas seulement le code. Éviter --all-targets qui mêlerait les exemples volontairement refusés à la suite runtime.

La [procédure antérieure](../qh011-atomic-admission-20261026/NOTICE.md) donne le contexte du conteneur 13 cas, pas un résultat de 22 cas par elle-même. Aucun audit ou transport codegen/cible complet n'est validé par ce rejeu ciblé.

## Contrôles documentaires

python3 verify.py vérifie uniquement les octets, inventaires, provenances et résultats archivés ; il ne rejoue aucune sonde. [MANIFEST.json](MANIFEST.json) inventorie l'archive, [PUBLICATION.json](PUBLICATION.json) les fichiers Git et [VALIDATION.json](VALIDATION.json) les contrôles. QH-011/T-003 restent ouverts. Revue ChatGPT V4 avant toute autre mission.
