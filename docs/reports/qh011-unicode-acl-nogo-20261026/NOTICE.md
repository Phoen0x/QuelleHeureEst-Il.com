# Archive du NO-GO QH-011 Unicode–ACL — 26 octobre 2026

## Français — statut et organisation

Pièces historiques d'une expérimentation locale, archivées sur #186. **NO-GO technique maintenu**, QH-011/T-003 ouverts. La [synthèse](../../ai/EXPERIMENTATION_QH011_UNICODE_ACL_NOGO_2026-10-26.md) est rédigée pour l'archivage ; `original/REPORT.md` et `original/DESIGN.md` sont des originaux retrouvés, conservés exactement. Aucun essai technique n'a été refait pour cet archivage.

- `original/EVIDENCE_SHA256.json` : manifeste original retrouvé, **65/65 entrées présentes et conformes** au moment de la collecte. Ce n'est pas le manifeste des seuls fichiers publiés.
- `archive-provenance.json` : origine relative de chaque pièce sélectionnée, empreinte source, empreinte archivée et transformation. Une substitution de chemin ou sélection de lignes n'est jamais présentée comme une copie exacte.
- `MANIFEST.json` : SHA-256, tailles, modes et identités Git des pièces publiées, hors manifeste lui-même.
- `PUBLICATION.json` : inventaire du changement documentaire et blobs/modes du parent ; aucune modification applicative autorisée.
- `source-inventory.json` : pièces retrouvées, sélectionnées ou omises et leurs empreintes. Caches, binaires et copies complètes sont exclus. Les empreintes ne remplacent pas les octets omis.
- `prototype/` : source exacte des 17 tests, manifestes/verrou inertes `.txt`, fixtures originales. `new-results.json` est le résultat de référence du diagnostic antérieur : la nouvelle matrice statique le compare aux observations réelles, mais n'émet pas de nouvelle trace JSON par cas. Les assertions et leur PASS sont la preuve de cette comparaison.
- `counterexamples/` : observations sélectionnées dans les rejeux et synthèse explicitement dérivée des cas A/B/C. Le cas dynamique échoué n'a pas produit de trace JSON autonome ; le code et l'assertion enregistrée sont conservés.
- `records/` et `logs/` : codes de sortie, audits datés, conservation et mutations, sorties originales ou expurgées ; les compilations ne conservent que des lignes pertinentes, sans extraits de sources tierces.
- `candidate-history/` et `locks/` : anciens fichiers et verrous expérimentaux **inertes**, sans activation dans le workspace de #186.
- `graphs/` : données dérivées sans chemins ni paramètres de registre privés. Le graphe Cargo normalisé est comparé à celui déjà archivé pour la variante préservée ; les définitions complètes antérieures restent dans [l'archive du premier diagnostic](../qh011-unicode-acl-20261026/NOTICE.md).
- `historical-scripts/*.txt` : scripts expérimentaux retrouvés, avec substitutions de chemins lorsque nécessaires. Ils supposent la disposition locale et ne doivent pas être lancés directement depuis cette archive.

Les données sont synthétiques : domaines `.invalid`, commande `probe`, chemins de scopes `safe`/`secret` et éventuels identifiants fictifs de fixtures. Aucun secret ou donnée d'utilisateur réel n'est inclus. Les données RustSec conservent leurs licences et références ; les avis présents sont marqués CC0-1.0. Aucun fichier source tiers, SDK, cache ou binaire n'est redistribué et aucune licence du dépôt n'est modifiée.

## Vérification documentaire hors ligne

Avec Python 3.11 ou ultérieur :

```sh
python /chemin/vers/cette-archive/verify.py
```

Cette commande vérifie des empreintes et la cohérence de résultats **déjà enregistrés**. Elle ne lance ni Rust, ni Node, ni audit, ni expérience. Un PASS documentaire ne change pas les deux échecs d'acceptation, la sortie 101 du prototype, la sortie 1 de l'audit Rust ou le rejet du contrôleur historique sur candidat.

## Procédure de reproduction future — non exécutée pendant l'archivage

Préconditions : Linux natif préparé, Rust/Cargo 1.99.1, GTK/WebKit et dépendances natives disponibles, cache des sources Cargo complet pour le mode hors ligne, copie vérifiée de #183 `f2eee4223a1ccf5b0866944580df8fd5979575dd` avec son GLib vendored. Aucun de ces prérequis n'est installé par l'archive. Le [guide Linux de #183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f2eee4223a1ccf5b0866944580df8fd5979575dd/docs/development/linux-environment-20261022.md) reste une référence, pas une garantie de machine neuve.

```sh
python /chemin/vers/cette-archive/reproduce-prototype.py \
  --project-config /chemin/vers/copie-verifiee/.cargo/config.toml \
  --output /tmp/qh011-nogo-reproduction
```

Sans `--run`, le script prépare uniquement les fichiers dans un répertoire neuf extérieur à la copie du projet et à l'archive. Avec `--run`, il compile la suite exacte hors ligne, en passant explicitement la configuration GLib, puis l'exécute. Compilation bornée à 300 secondes ; tests à 30 secondes murales, 10 secondes CPU, 1 Gio, core désactivé. Les sorties sont conservées. **Le code de sortie réel des tests est propagé : 101 est attendu pour les deux échecs historiques, pas transformé en succès.** Aucune modification d'un checkout, aucun commit ou accès réseau n'est effectué par ce script. Sa syntaxe est contrôlée ; ni préparation ni exécution de ce nouveau script n'ont été lancées pendant l'archivage.

Pour reproduire ultérieurement les validations applicatives, créer une autre copie isolée du SHA #183, conserver les fichiers initiaux, placer le verrou `locks/candidate-preserved.lock.txt` uniquement dans cette copie et appliquer explicitement sa configuration Cargo. Les commandes exactes et sorties historiques figurent dans `records/web-status.json`, `records/rust-status.json`, et les scripts expérimentaux inertes. Ne jamais appliquer ce verrou au dépôt original ou documentaire. Les gardes historiques refusent ce candidat ; ce refus fait partie du résultat à reproduire. Les trois mutations de conservation exigent aussi une copie avec ses objets Git et le snapshot initial ; elles ne sont pas des commandes autonomes sur un dossier documentaire.

Les rejeux des 68 scénarios et 674 couples ont utilisé des binaires conservés : ils sont seulement référencés par leurs empreintes ici. Leurs sources, fixtures et résultats antérieurs sont [déjà archivés](../qh011-unicode-acl-20261026/NOTICE.md) au parent `de9d3a1424a43d365169a66888ee5ad66882c565`. Leurs octets binaires ne sont pas conservés dans GitHub.

## Limites et références omises

Le dossier complet original/candidat/vue historique, les snapshots exhaustifs de chemins hérités, la base RustSec, les binaires, métadonnées brutes et certains journaux complets restent temporaires. Le JSONL de compilation du prototype n'est pas publié ; ses empreintes et la sortie concise de compilation le référencent. Les graphes dérivés suppriment les chemins et URL de registre ; leurs transformations sont documentées.

Tous les fichiers essentiels annoncés ont été retrouvés. Il n'existe pas de nouvelle trace JSON autonome de l'assertion dynamique ni de sortie JSON par ligne de la nouvelle matrice statique ; aucune n'a été fabriquée. L'absence de ces traces n'est pas masquée par les synthèses. Rust 1.90 exact, plateformes natives autres que Linux, GUI/WebView et consommation complète des scopes typés/globaux restent non validés. Aucun constat de sûreté universelle ou d'exploitation distante du produit n'est ajouté.

## English — scope, integrity and replay limits

This archive preserves the tested prototype's **NO-GO**, not a proof that every alternative must fail. It contains recovered original reports, final prototype source and fixtures, recorded exits and selected logs. Derived counterexamples and path-redacted excerpts are explicitly identified. The original 65-entry evidence manifest was fully verified. No technical experiment, build or audit was repeated during documentary archiving.

`verify.py` performs offline integrity and recorded-result consistency checks only. A documentary PASS does not change the prototype's 15 passing / 2 failing tests and exit 101, the failed historical guard on the migrated candidate, or the strict Rust audit's exit 1 with three warnings.

The prototype and lockfiles are inert `.txt` attachments. `reproduce-prototype.py` requires the prepared Linux environment, cached Cargo sources and the reviewed project configuration for vendored GLib. It only prepares files by default. Explicit `--run` enables an offline build (300-second bound) and test execution (30-second wall, 10-second CPU, 1 GiB, no core dump). It propagates the real exit, including the expected historical 101. Only its syntax was checked during archiving; the new replay script was not executed.

Full checkouts, caches, binaries, raw host-path metadata and complete compiler logs are not published. Digests do not guarantee future availability of omitted bytes. The dynamic assertion and fresh static matrix emitted no separate per-case JSON traces; source, recorded assertions and reference fixtures are preserved without inventing traces. Native Android/Windows/macOS/iOS, GUI/WebView, Rust 1.90 and full typed-scope enforcement remain unvalidated. ChatGPT V4 must independently review; no further implementation is authorized by this archive.
