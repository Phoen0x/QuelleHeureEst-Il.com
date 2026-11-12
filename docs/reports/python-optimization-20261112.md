# Refus des modes Python optimisés — 12 novembre 2026

**GO pour revue indépendante, aucune fusion autorisée.** Périmètre : entrées actives SQLite et GLib et chaîne Node vers SQLite. Base #197 `20825fc01d4f7fd03239093feacf26863ed65b3f`, arbre `1bc867ea5ce31bbf3dfcfdbb04ab480ea58fbc9c` ; branche `codex/harden-python-optimization-guards-20261112`, PR brouillon ciblant uniquement `codex/fix-sqlite-rustsec-2026-0459-20261111`. Le SHA publié est celui du commit contenant ce rapport, indiqué dans la PR, sans auto-référence circulaire.

## Recherche et diagnostic avant modification

Les [options Python](https://docs.python.org/3/using/cmdline.html#cmdoption-O) et la [spécification assert](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement) ont été téléchargées et lues : `-O` supprime les assertions et le code conditionné par `__debug__`, `-OO` supprime aussi les docstrings. `PYTHONOPTIMIZE` active la même optimisation, un entier indiquant son niveau. La source [Bandit B101](https://bandit.readthedocs.io/en/latest/plugins/b101_assert_used.html) n'a pas été accessible (erreur HTTP), elle n'est pas déclarée consultée. Le premier accès sandbox aux sites Python a échoué ; une permission réseau limitée a permis la lecture, sans désactiver TLS ni certificat.

Python **3.12.14** : avant correction, les deux contrôleurs exécutés avec `-O` puis `-OO` affichent **PASS**, sortie **0**. SQLite normal passe (0) ; GLib normal rejette (1) le manifeste SQLite plus récent, comme attendu pour ce garde historique. Sous optimisation, GLib prétend donc valider ce même candidat malgré son refus normal. Les six résultats avant sont conservés dans [les preuves](python-optimization-20261112-evidence.json). Aucun test destructif ni modification de dépendance pendant ce diagnostic.

Chaîne inspectée : wrapper Node → Python SQLite → import du module GLib ; puis processus enfants sur vues historiques authentifiées. Les options de ligne de commande Python ne sont pas automatiquement propagées aux processus enfants ; `PYTHONOPTIMIZE` est hérité. La détection au sommet est indispensable avant toute projection. Les archives restent des données historiques et ne sont pas des points d'entrée supportés. Le protocole de reprise et les sept documents canoniques ont été revérifiés par SHA ; #195 et #196 sont relues au SHA déjà connu, sans modification. Les présentations multi-dépôts déjà examinées dans cette même session sont réutilisées, sans nouvel audit général.

## Solution minimale A

Les deux contrôleurs vérifient **explicitement** `sys.flags.optimize != 0` et lèvent `RuntimeError` avec diagnostic français puis anglais. Il ne s'agit pas d'une assertion ; le refus est donc conservé même lorsque Python retire les assertions. Le bloc précède les autres imports et toute opération de validation et s'exécute également lors d'un import. Sortie **1**, aucun PASS. Node propage le refus du processus Python, sans modification du wrapper.

Solution B non retenue : remplacer toutes les assertions agrandirait inutilement la surface du correctif et modifierait les diagnostics attendus par les tests historiques. Les assertions restent utilisables uniquement après le refus obligatoire de l'optimisation.

`Scripts/check-glib-qh011.py` ne reçoit que le bloc de refus. `Scripts/check-sqlite-rustsec.py` reçoit le même bloc et une adaptation additive de conservation : validation exacte de la nouvelle entrée GLib contre son original + bloc autorisé, authentification des 323 fichiers de #197, et copie de l'ancien GLib authentifié lors de la reconstitution historique. Les anciennes valeurs de PINS et SHA ne sont pas remplacées. Le manifeste nouveau est lui-même épinglé par SHA-256 dans la garde ; il reconstitue l'identité Git exacte de #197.

## Conservation

323 fichiers initiaux : **321 inchangés**, deux contrôleurs modifiés et archivés à l'octet, **six ajouts**, zéro suppression et zéro changement de mode. Le wrapper Node, tous les tests antérieurs, Cargo.lock, les manifestes, les sources Rust/GLib/Tauri, les archives anciennes, variantes, commentaires et workflows sont inchangés.

Fichiers modifiés :

- `Scripts/check-sqlite-rustsec.py`
- `Scripts/check-glib-qh011.py`

Fichiers ajoutés :

- `docs/history/python-optimization-20261112/Scripts/check-sqlite-rustsec.py`
- `docs/history/python-optimization-20261112/Scripts/check-glib-qh011.py`
- `docs/history/python-optimization-20261112/PORT.json`
- `tests/dependency_updates/python-optimization.test.cjs`
- `docs/reports/python-optimization-20261112.md`
- `docs/reports/python-optimization-20261112-evidence.json`

[PORT.json](../history/python-optimization-20261112/PORT.json) conserve les blobs, modes et SHA-256 des fichiers initiaux. Les [preuves](python-optimization-20261112-evidence.json) indiquent également les anciennes/nouvelles empreintes des deux contrôleurs. Les originaux ne sont pas réécrits ni rendus artificiellement conformes. La projection rejoue les gardes SQLite/GLib/Tokio/JS antérieures inchangées sur les octets pour lesquels elles ont été écrites.

## Tests réels

Commandes depuis la racine du candidat, environnement Linux repris, Node24.19.0 ; Python3.12.14. Pas de construction d'un nouvel environnement ni d'installation d'outil.

| Chemins après correction | Résultat |
| --- | --- |
| SQLite `python3 -O`, `-OO` | sortie1, diagnostic explicite, aucun PASS |
| SQLite `PYTHONOPTIMIZE=1`, `2` | sortie1, diagnostic explicite, aucun PASS |
| GLib direct `python3 -O`, `-OO` | sortie1, diagnostic explicite, aucun PASS |
| GLib direct `PYTHONOPTIMIZE=1`, `2` | sortie1, diagnostic explicite, aucun PASS |
| Wrapper Node `PYTHONOPTIMIZE=1`, `2` | sortie1, diagnostic Python propagé, aucun PASS |
| Imports SQLite et GLib sous `-O`/`-OO` | quatre refus explicites, sortie1 |
| SQLite normal, variable absente et `=0` | deux succès, sortie0 |
| Wrapper Node normal, variable absente et `=0` | deux succès, sortie0 |
| GLib direct sur la vue #194 authentifiée, variable absente et `=0` | deux succès, sortie0 |
| GLib direct sur le candidat SQLite, variable absente et `=0` | deux refus historiques attendus du manifeste, sortie1 ; pas un échec du test |

**22 nouveaux cas distincts** : 14 refus optimisés, six validations normales, deux refus historiques normaux attendus. Pas d'addition des rejeux. `node --test --test-concurrency=1 tests/dependency_updates/*.test.cjs` exerce les **60 cas antérieurs +22 nouveaux =82 cas distincts**. La garde positive complète est aussi exécutée directement. Les tests historiques incluent verrou SQLite vulnérable, wrapper désactivé, garde désactivée, pertes bundled/chrono, empreintes, archives et changements non autorisés. Les mutants restent dans des copies temporaires ; aucun fichier de production n'est muté par les tests.

`git diff --check`, analyses syntaxiques Python via `ast.parse`, vérification syntaxique Node, liens locaux, JSON, octets et modes Git sont contrôlés. Les journaux complets restent temporaires hors dépôt ; leurs SHA-256 et résumés sont publiés dans les preuves, sans chemins personnels ni traces privées. Les résultats de la suite finale et ses codes de sortie y sont repris.

## Limites et travaux exclus

Ce correctif protège une configuration d'interpréteur inadaptée. Il ne garantit pas l'intégrité d'un dépôt dont tous les scripts pourraient être librement remplacés. Les copies archivées antérieures gardent leurs octets historiques : leur exécution autonome optimisée ne constitue pas une validation supportée. Un import externe ayant déjà désactivé ou modifié arbitrairement le code reste hors frontière.

L'inspection identifie aussi `Scripts/check-http2-183-preservation.py` et `Scripts/run-glib-variant-regressions.py`, qui utilisent des assertions mais ne sont pas appelés par la chaîne active étudiée. Ils sont conservés, pas déclarés durcis par cette mission ciblée. Aucun élargissement silencieux du périmètre.

Aucun test Rust, build applicatif, audit SQLite/GLib/RustSec, scanner ou campagne CI générale n'est relancé : seuls les cargo metadata nécessaires aux gardes sont exécutés. Les 19 tests Rust, builds et audits de #197 au SHA source sont des résultats historiques, pas réexécutés ici. Les avertissements RustSec, diagnostics Clippy, formatage et limites QH-012 demeurent inchangés. Aucun test natif Android/Windows/macOS/GUI. Aucun workflow, bot, licence, protection ou PR préexistante modifié. Aucune fusion.

**Prochaine action unique : revue indépendante ChatGPT de la nouvelle PR en brouillon au SHA exact.**
