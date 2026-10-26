# QH-011 — NO-GO de l'implémentation expérimentale Unicode–ACL — 26 octobre 2026

## Conclusion et portée

**NO-GO pour le prototype effectivement testé.** Le candidat Cargo préservé compile et satisfait plusieurs contrôles applicatifs, mais deux critères obligatoires de compatibilité et de sécurité échouent. Ce résultat **ne démontre pas qu'aucune solution alternative puisse fonctionner**. Aucun fork, patch supplémentaire de Tauri, correctif de `deny` ou intégration applicative de la sonde n'a été entrepris pour transformer les échecs en succès.

Cette synthèse est rédigée pendant une mission ultérieure d'archivage documentaire sous orchestration de **ChatGPT V4**, sur #186 uniquement. Aucun essai technique, compilation ou audit n'est relancé pendant l'archivage. Le [rapport original local](../reports/qh011-unicode-acl-nogo-20261026/original/REPORT.md), les sources et les sorties réellement retrouvées sont préservés séparément. Une synthèse nouvelle ou un extrait dérivé n'est jamais présenté comme une nouvelle trace expérimentale.

Références revérifiées avant la collecte :

| Référence | SHA |
|---|---|
| main | `eb3c9403fa97db5ccf1fb4b13e3b0872e36c8228` |
| [#183](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/183), code étudié | `f2eee4223a1ccf5b0866944580df8fd5979575dd` |
| #186, parent documentaire | `de9d3a1424a43d365169a66888ee5ad66882c565` |
| #187, suivi documentaire | `228e36a048926d77e84c9bb47863b84d07d2b924` |

Les deux diagnostics précédents restent intacts : [Unicode/URLPattern/ICU](DIAGNOSTIC_QH011_UNICODE_URLPATTERN_ICU_2026-10-26.md) et [ACL/scopes](DIAGNOSTIC_QH011_COMPATIBILITE_ACL_UNICODE_2026-10-26.md). Ils ne sont pas remplacés par ce rapport.

## Architecture expérimentale réellement construite

Dans un clone local indépendant, le seul fichier suivi modifié était `Cargo.lock`. Il faisait passer tauri-utils 2.9.3 → 2.10.2 et URLPattern 0.3.0 → 0.6.0, UNIC → ICU, en restaurant les six blocs collatéraux. Huit archives inertes étaient ajoutées. Le GLib vendored et sa configuration Cargo étaient copiés et préservés.

La sonde `policy-prototype` était une crate Rust **séparée**, non membre du workspace applicatif. Son [code intégral et ses 17 tests](../reports/qh011-unicode-acl-nogo-20261026/prototype/src/lib.rs.txt) sont archivés comme texte inerte, avec manifestes, verrou et fixtures exacts. Elle utilise les vraies API Tauri 2.11.6, runtime 2.11.3, build/codegen/macros 2.6.3 et tauri-utils 2.10.2. Elle ne remplace ni `build.rs`, ni `invoke_handler`, ni l'autorité du projet.

Le protocole essayé comportait deux versions :

- `legacy-urlpattern-0.3` : autorise les configurations sans motif distant non vide ; toute compatibilité distante non prouvée devient `HistoricalRemoteUnproven`, sans abandon de règle. Cette stratégie conservatrice demeure fonctionnellement incomplète.
- `reviewed-urlpattern-0.6` : exige un instantané identique de l'enveloppe complète, incluant manifestes, permissions/scopes, capacités, labels et cible. Les revues utilisées sont **des fixtures synthétiques**, pas des approbations humaines réelles ou un mécanisme de signature prêt à produire.

Le garde utilise RemoteUrlPattern puis Resolved::resolve et transforme les erreurs de construction en résultats contrôlés. La liaison d'un instantané complet n'est pas une preuve d'équivalence sémantique entre les deux moteurs. Le prototype n'est pas présenté comme une couche de sécurité intégrée.

## A — U+309B : compatibilité fonctionnelle non satisfaite

Fixture `id-not-xid` :

| Élément | Valeur exacte |
|---|---|
| Motif | `https://example.invalid/:゛` — le caractère après `:` est **U+309B** |
| URL | `https://example.invalid/value` |
| Commande / fenêtre / WebView | `probe` / `main` / `view` |
| Capacité | `rule`, locale désactivée, permission `allow-narrow` |
| Ancienne décision Tauri | **Autorisé**, selon le rejeu conservé de tauri-utils 2.9.3 |
| Garde du prototype historique | **Construction rejetée**, erreur `HistoricalRemoteUnproven` |
| Test | `acceptance_historical_u309b_remains_available` : **FAILED** |

Le motif est historiquement légitime ; U+309B est ID_Start sans être XID_Start. Le refus explicite évite une admission sans preuve, mais ne préserve pas le comportement historique demandé. Il ne suffit donc pas de dire que le garde est restrictif pour qualifier sa compatibilité.

Preuves : [fixture originale](../reports/qh011-unicode-acl-nogo-20261026/prototype/fixtures/cases.json), [ancienne observation sélectionnée](../reports/qh011-unicode-acl-nogo-20261026/counterexamples/old-selected.json), [stdout de la suite](../reports/qh011-unicode-acl-nogo-20261026/logs/prototype-tests.stdout) et [erreurs originales](../reports/qh011-unicode-acl-nogo-20261026/logs/prototype-tests.stderr). Le test fait `expect` sur le résultat afin d'exiger la compatibilité ; sa panique de test ne doit pas être confondue avec une erreur non contrôlée du garde.

## B — Ajout dynamique : couverture de validation insuffisante

Le test `acceptance_raw_dynamic_api_cannot_bypass_construction_policy` construit d'abord une autorité avec version historique, quatre permissions synthétiques de manifeste et **aucune capacité**. Cette construction passe. Il appelle ensuite directement la vraie API `RuntimeAuthority::add_capability`, avec la capacité suivante :

```json
{"identifier":"rule","local":false,"windows":["main"],"permissions":["allow-narrow"],"remote":{"urls":["https://example.invalid/:a𑼀"]}}
```

Le caractère final du nom est **U+11F00**. Pour `probe`, fenêtre `main`, WebView `view`, origine distante `https://example.invalid/value`, l'ancienne interprétation refuse. L'ajout dynamique hors enveloppe de revue réussit, puis la nouvelle autorité retourne un accès. L'assertion exigeant `access.is_none()` échoue avec le message enregistré : `unvalidated dynamic rule widened access after a successful legacy construction gate`.

**Aucune trace JSON autonome de cette assertion n'a été émise.** La décision est déduite du code exact du test et de son assertion échouée enregistrée, pas d'une trace d'exécution inventée. Les entrées et la provenance de cette synthèse figurent dans [failures.json](../reports/qh011-unicode-acl-nogo-20261026/counterexamples/failures.json).

Il s'agit d'un appel Rust synthétique de confiance démontrant une lacune du garde proposé, **pas d'une exploitation distante démontrée de l'application réelle**. Un garde initial ou un wrapper optionnel n'intercepte pas automatiquement toutes les API. Aucun point central d'intégration satisfaisant le contrat complet n'a été démontré. La voie exigeant une conception ou extension supplémentaire a été arrêtée, sans fork ni nouveau patch vendored.

## C — Même booléen, permissions effectives différentes

Le [contre-exemple de scopes](../reports/qh011-unicode-acl-nogo-20261026/counterexamples/failures.json) demeure :

| Chaîne | Commande autorisée | Entrées applicables |
|---|---|---|
| Ancienne | Oui | A, scope 1 : `allow safe`, `deny secret` |
| Nouvelle | Oui | A/scope 1 **et B/scope 2**, ce dernier avec `allow *` |

Les deux scopes sont configurés dans les magasins, mais seul A est applicable à cette requête dans l'ancienne interprétation. La nouvelle interprétation rend aussi B applicable. Comparer seulement les booléens, ou seulement le magasin complet de scopes, manquerait ce changement. Les résultats sélectionnés conservent contenu et provenance des permissions ; les tests ne prétendent pas avoir validé leur consommation complète par des scopes typés dans une WebView.

## Résultats historiques préservés, sans nouveau rejeu

| Contrôle de l'expérimentation | Résultat réellement retrouvé |
|---|---|
| Prototype ACL | **17 tests : 15 réussis, 2 échoués, 0 ignoré ; sortie 101** |
| Matrice statique dans le prototype | **65 enregistrements, 63 scénarios distincts** ; contrôle via les vraies API, contenu/provenance des scopes compris |
| Rejeux des exécutables antérieurs | **68 scénarios ACL**, 70 enregistrements par version ; **674 couples textuels URLPattern**, 678 enregistrements ; sorties 0 et résultats identiques aux archives |
| Web/sécurité | **34 tests réussis**, 0 ignoré ; sortie 0 |
| TypeScript, ESLint, Vite, installation pnpm figée hors ligne | Sortie 0 chacun |
| Cargo tree toutes cibles/fonctionnalités et metadata | Sortie 0 ; résolution, pas validation native de toutes les cibles |
| Compilation Rust debug et release/toutes fonctionnalités | Sortie 0 |
| Tests Rust debug | **6 GLib + 2 HTTP**, tous réussis ; 0 test unitaire applicatif |
| Tests Rust release/toutes fonctionnalités | Les **mêmes huit cas distincts** réussissent ; ne pas compter seize cas |
| Conservation additionnelle | PASS ; **trois mutations distinctes rejetées**, sorties des gardes 1 |
| Contrôleur historique sur candidat migré | **Échec, sortie 1**, `Only the application GLib dev-test edge may change` |
| Même contrôleur sur vue initiale exacte | Réussite, sortie 0 |

Les rejeux antérieurs utilisent des **binaires conservés**, non recompilés contre le candidat. Leurs empreintes sont préservées dans [baseline-replay-status.json](../reports/qh011-unicode-acl-nogo-20261026/records/baseline-replay-status.json). Ils ne constituent pas une validation de l'intégration de la sonde. Les données intégrales des diagnostics antérieurs restent disponibles dans l'archive précédente ; ici les références, empreintes et observations nécessaires sont conservées sans duplication des binaires.

Les tests du prototype sont bornés à 30 secondes murales, 10 secondes CPU et 1 Gio ; les rejeux de matrices à 20 secondes, 10 secondes CPU et 1 Gio ; core désactivé. Ces durées ne sont pas des performances garanties en production.

## Conservation du candidat expérimental

**504 → 509 paquets Cargo**, **13 identités sortantes archivées et 18 entrantes**. Les anciens verrous, manifestes, configuration et build.rs sont conservés comme textes inertes avec leurs empreintes. Le [delta](../reports/qh011-unicode-acl-nogo-20261026/candidate-history/dependency-delta.json) conserve versions, sources, checksums et dépendances. Le [verrou final candidat](../reports/qh011-unicode-acl-nogo-20261026/locks/candidate-preserved.lock.txt) est une preuve historique, pas un verrou actif de #186.

Les six blocs `tempfile`, `winreg`, `dirs-sys`, `winapi-util`, `rustix`, `errno` sont restaurés exactement. La seule différence de fonctionnalités d'un paquet commun est ICU properties : `compiled_data` → `compiled_data,default`. Tauri 2.11.6, Tokio 1.54.1, Reqwest 0.12.28, h2 0.4.20 et GLib 0.18.5 sont préservés. UNIC et h2 0.3.27 ne sont pas actifs dans le candidat. Le verrou pnpm reste inchangé : **409 snapshots, 140 optionnels**, variantes et patch braces conservés.

Le contrôle additionnel rejette une perte d'option Cargo, une perte de snapshot pnpm et une réorientation Windows. **Il ne remplace pas le contrôleur historique en échec.** Aucun ancien contrôleur n'a été modifié ou réancré pour rendre le candidat vert. Le contrôleur historique passe sur sa vue initiale exacte seulement.

Contrairement au premier diagnostic, cette expérimentation a effectivement compilé et testé la variante qui restaure les six blocs. Les 301 autres fichiers suivis du candidat restent identiques ; le checkout original et son index demeurent inchangés.

## Audits et limites

Audit Rust strict : **0 vulnérabilité classée, 3 avertissements, sortie 1**. Restent RUSTSEC-2024-0370 (`proc-macro-error 1.0.4`), RUSTSEC-2025-0134 (`rustls-pemfile 1.0.4`) et RUSTSEC-2024-0429 (`glib 0.18.5`). Base RustSec figée `21d909e4c8bd4e14c7aea58bf980c881a0053ab1`, 1 352 avis ; pas de mise à jour distante revendiquée, aucun ignore ajouté. Les cinq avertissements UNIC disparaissent seulement du verrou expérimental.

Audits pnpm de cette campagne : **0 avis, sortie 0**, pour le complet et la production ; réponses structurées conservées, respectivement 305 et 7 dépendances déclarées par le service. Aucune erreur HTTP 503 n'est transformée en réussite. Ces réponses datées **ne démontrent pas une résolution amont officielle de braces ni la sûreté de toutes les variantes historiques**. Aucun changement de politique d'audit n'a été effectué.

Environnement de l'expérimentation : Debian 13.6 Linux x86_64, Rust/Cargo 1.99.1, Node 24.19.0, pnpm 8.15.9. **Rust 1.90 exact, Android/Windows/macOS/iOS natifs, GUI/WebView et application complète des scopes typés/globaux ne sont pas validés.** Aucun exploit du projet réel n'est démontré. Une comparaison de fixtures ne prouve pas une équivalence universelle des moteurs.

## Reproduction, pièces omises et suite

Le [mode d'emploi](../reports/qh011-unicode-acl-nogo-20261026/NOTICE.md), le manifeste, les provenances et le vérificateur permettent de contrôler l'archive sans relancer Rust. Le script de reproduction préparé copie seulement les sources finales dans un répertoire neuf, puis ne compile/exécute que sur option explicite ; il n'a pas été exécuté pendant l'archivage. Le rejeu de la suite doit conserver sa **sortie 101** et les deux échecs, pas les neutraliser.

Copies complètes du dépôt, binaires, caches, métadonnées brutes avec chemins et journaux complets restent temporaires. Les empreintes des pièces omises ne garantissent pas la disponibilité future de leurs octets. Les fichiers retrouvés, absences éventuelles, transformations et références antérieures sont distingués dans l'inventaire et la provenance.

**Le résultat technique reste NO-GO ; QH-011/T-003 demeurent PARTIELS et OUVERTS.** Ce rapport documentaire n'autorise aucune nouvelle implémentation, migration, correction de deny, publication de code ou fusion. Prochaine action unique : revue indépendante de #186 par **ChatGPT V4**.
