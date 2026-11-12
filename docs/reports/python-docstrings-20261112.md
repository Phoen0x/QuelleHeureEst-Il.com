# Docstrings des gardes Python — 12 novembre 2026

**GO pour revue indépendante ; aucune fusion autorisée.** Branche `codex/restore-python-guard-docstrings-20261112`, créée depuis #198 `bc3d54bae109bd4fd53e2bf394934d0e0645a9bf`, arbre `9405c1ff2a950c138feca169ee13ab737cf19285`. PR brouillon ciblant uniquement `codex/harden-python-optimization-guards-20261112`. Le HEAD est celui du commit contenant ce rapport, indiqué dans la PR ; aucune auto-référence circulaire.

## Défaut reproduit et recherche

Sur les deux scripts de #198, `ast.get_docstring()` et `__doc__` valent **None** en mode normal : le bloc de refus précède la chaîne documentaire. Le texte existe mais sa fonction Python est perdue. Les [règles ast.get_docstring](https://docs.python.org/3/library/ast.html#ast.get_docstring), [-O](https://docs.python.org/3/using/cmdline.html#cmdoption-O) et [-OO](https://docs.python.org/3/using/cmdline.html#cmdoption-OO) sont lues dans les pages officielles téléchargées ; empreintes des pages dans les preuves. `-OO` supprime normalement les docstrings : aucun test ne réclame leur présence dans ce mode.

Les sept documents canoniques sont revérifiés aux mêmes SHA, avec réutilisation de leur lecture précédente dans la même session. #195 (`06190945ef5c92f6e49fd00c616505d3200f343c`) et #196 (`e67d7c3d66fc3069b1c1bab1c65a1b87b45e6c56`) sont réutilisées comme références documentaires inchangées, pas comme autorisations nouvelles. Aucun sous-agent. Les outils ne fournissent pas de sélecteur indépendant de modèle/vitesse ; aucune modification fictive de réglage n'est revendiquée.

## Correction minimale

Dans `Scripts/check-glib-qh011.py` et `Scripts/check-sqlite-rustsec.py`, le shebang reste identique ; la docstring originale vient immédiatement après, puis le même bloc de refus. Ses commentaires français/anglais, `import sys`, la condition **sys.flags.optimize != 0**, le type RuntimeError et le diagnostic restent identiques. Aucune autre importation ou validation n'est placée entre la docstring et le bloc. Le code continue de refuser l'optimisation avant les validations et lors d'un import.

Le contrôleur SQLite construit le fichier GLib attendu par concaténation d'un **préfixe documentaire exact**, du bloc exact et du reste de l'original authentifié. Il vérifie le préfixe historique puis **l'égalité de tous les octets du fichier actif**. Il ne recherche pas seulement une sous-chaîne et n'accepte pas plusieurs positions. Le préfixe contient le shebang et toute la docstring historique jusqu'à son saut de ligne final. Les SHA historiques PINS, archives et manifestes précédents ne sont pas changés.

L'adaptation additive vérifie aussi les 329 fichiers initiaux de #198 par SHA-256, blobs et modes, et reconstruit son arbre Git exact. Les deux contrôleurs précédents sont conservés à l'octet dans un nouveau dossier. Le nouveau manifeste est épinglé par son SHA-256 dans la garde. Les états antérieurs restent distinguables et les projections historiques demeurent inchangées. Aucun changement de logique métier, de graphe Cargo ou de seuil de validation.

## Tests exécutés

Environnement Linux repris, Python3.12.14, Node24.19.0 ; commandes depuis la racine du nouveau checkout avec l'environnement existant. **`node --test --test-concurrency=1 tests/dependency_updates/*.test.cjs` : 92 cas distincts réussis, sortie0, aucun échec, ignoré ou annulé.** Les 82 cas de #198 sont conservés à l'octet ; dix cas sont ajoutés. Aucun décompte des rejeux comme cas supplémentaires.

| Vérification | Résultat |
| --- | --- |
| AST SQLite/GLib, docstring textuelle et position | 2 cas : docstring historique exacte, première instruction, ligne2 après shebang ; bloc sys/refus suivant vérifié structurellement |
| Import normal, variable PYTHONOPTIMIZE absente et =0 | 4 cas : `__doc__` contient exactement le texte brut historique, sans exécuter main |
| Mutations de GLib et de son archive | 4 cas : ancien placement du garde, docstring réécrite, octets imprévus et archive altérée rejetés |
| Direct SQLite/GLib sous -O/-OO et PYTHONOPTIMIZE=1/2 | 8 refus, sortie1, diagnostic explicite, aucun PASS |
| Imports optimisés des deux modules | 4 refus, sortie1 |
| Wrapper Node sous PYTHONOPTIMIZE=1/2 | 2 refus propagés, sortie1, aucun PASS |
| SQLite et Node normaux, variable absente et =0 | 4 validations positives, sortie0 |
| GLib normal sur sa vue #194 authentifiée | 2 validations positives, sortie0 |
| GLib direct normal sur le candidat SQLite | 2 refus historiques attendus du manifeste, sortie1 ; tests réussis |
| Autres cas de conservation hérités | 60 cas réussis, dont mutations verrou vulnérable, wrapper/garde désactivés, pertes bundled/chrono, empreintes/archives et dépendances/manifeste inattendus |

Les six tests de docstrings comparent les octets des chaînes avec les sources historiques pré-durcissement, pas avec un texte nouvellement inventé. Les imports sont exécutés dans des processus isolés, bornés, avec `runpy.run_path(..., run_name='doc_probe')` ; aucun main ni opération de validation destructive n'est exécuté. Le comportement optimisé est testé séparément : aucune fausse attente de docstring en -OO.

Les gardes positives complètes sont exécutées par les tests SQLite et Node ; elles authentifient les graphes et rejouent la chaîne SQLite/GLib/Tokio/JS précédente. Aucun contrôle historique neutralisé. Syntaxe Python/Node, JSON, liens locaux, `git diff --check`, modes, blobs, SHA-256 et contrôle ciblé de confidentialité effectués avant publication. Les journaux bruts restent temporaires ; leurs empreintes et les noms/résultats des cas sont dans les preuves.

## Inventaire et conservation

**329 fichiers initiaux, 327 inchangés, deux modifiés avec originaux archivés, six ajouts, zéro suppression et changement de mode.**

Modifiés :

- `Scripts/check-sqlite-rustsec.py`
- `Scripts/check-glib-qh011.py`

Ajoutés :

- `docs/history/python-docstrings-20261112/Scripts/check-sqlite-rustsec.py`
- `docs/history/python-docstrings-20261112/Scripts/check-glib-qh011.py`
- `docs/history/python-docstrings-20261112/PORT.json`
- `tests/dependency_updates/python-docstrings.test.cjs`
- `docs/reports/python-docstrings-20261112.md`
- `docs/reports/python-docstrings-20261112-evidence.json`

[Manifeste de provenance et empreintes initiales](../history/python-docstrings-20261112/PORT.json) ; [preuves, comparaisons avant/après et résultats](python-docstrings-20261112-evidence.json). Tous les anciens documents, archives, variantes, commentaires, tests et modes sont conservés. Aucun changement de Cargo.lock, manifeste, dépendance, source native SQLite/GLib/Tauri, workflow, bot, licence ou protection. Les branches de #198/#197/#194/#183 et main ne sont pas modifiées.

## Limites et arrêt

Aucun test Rust, build complet ni audit Cargo/SQLite/GLib/CI n'est relancé : les seuls appels Cargo sont les métadonnées nécessaires à la garde. Leurs validations antérieures demeurent historiques. Clippy/RustSec/QH-012 et plateformes natives ne sont pas corrigés ou revalidés. Les autres scripts et les archives autonomes hors de la chaîne restent hors du périmètre durci, comme indiqué dans #198. Ce contrôle ne garantit pas l'intégrité face à un acteur remplaçant arbitrairement tous les scripts.

Aucun test final échoué ou ignoré, aucune fusion. **Prochaine action unique : revue indépendante ChatGPT de la nouvelle PR au SHA exact.**
