# Audit isolé du worker Renovate 44.164.1 — issue #168

**Verdict : BLOQUÉ ; aucune activation.** Le gel intégral par les options natives est réfuté dans les fixtures. Une barrière globale expérimentale conserve les objets protégés dans les scénarios simulés, mais empêche aussi les nouvelles écritures et peut interrompre le worker. Ce résultat n'autorise aucune cohabitation en production ni aucune fusion.

## Sources et état contrôlés

- Issue [#168](https://github.com/Phoen0x/QuelleHeureEst-Il.com/issues/168), lue intégralement ; aucun commentaire au premier relevé.
- Instructions, contrat et relais de [#167 au SHA adf9efda058f389a9acf99c70f2a096c91a3871a](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/adf9efda058f389a9acf99c70f2a096c91a3871a/docs/ai), ainsi que son AGENTS.md, blob `f7e63ee9cc0602b7fba93e686dd2c1dafa131317`. AGENTS.md est absent de main au relevé.
- [#162 au SHA 4d4efbb05793bf4bfc0eee8a27eb026cb8f1dd9a](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/4d4efbb05793bf4bfc0eee8a27eb026cb8f1dd9a/docs/proposals/bot-cohabitation-20261015) : ses treize pièces sont conservées octet pour octet dans [reference-162](reference-162/README.md), y compris variantes et fixtures. Ses discussions et preuves CI ont été consultées. Les validations historiques 44.155.7 ne sont pas présentées comme des tests 44.164.1.
- Branche dédiée `test/renovate-full-worker-168`, depuis main `235194a6fe825a6dac27012f07cbac2cc5d86794`. Les SHA de main, #153, #162 et #167 ont été recontrôlés, sans modification de leurs branches.
- Amont : tag **44.164.1**, commit **6cc889803a44be232802143499d904799f58abc0**. Paquet npm 44.164.1 épinglé par verrou/intégrité. Les sources embarquées dans les sourcemaps des cinq fichiers demandés sont identiques aux sources de ce commit : [provenance](evidence/final/provenance.json).
- Node **24.19.0**, npm **11.9.0**, Python et OS exacts dans la provenance. Installation des outils hors dépôt, scripts npm désactivés. Le validateur conserve l'avertissement RE2 indisponible/fallback RegExp : [journal](evidence/validator.log). Aucune certification de la version installée chez Mend.

Les dix PR **#155, #156, #158, #159, #160, #161, #163, #164, #165, #166** sont inventoriées avec PR, branche, SHA de ref, titre, description, labels, état et discussions dans [fixtures](fixtures/github-before.json). Une nouvelle lecture GitHub confirme leur identité complète : [contrôle de conservation](evidence/github-preservation.json). Aucun commentaire de cette mission n'a été envoyé à ces PR.

## Ce qui a réellement tourné

Le paquet publié exécute réellement `renovateRepository`, son initialisation/configuration, l'extraction Cargo, la recherche/segmentation des mises à jour, `writeUpdates`, `processBranch`, `ensurePr`, la finalisation et le nettoyage. Aucun de ces workers n'est remplacé. Le fichier `hooks.mjs` substitue seulement les interfaces plateforme/SCM/Git et l'exécution de commandes. Une injection explicite dans la frontière de génération d'artefacts Cargo produit l'échec de verrou demandé ; elle est documentée dans le code.

L'API GitHub est une **fausse interface plateforme**, reliée à un transport symbolique et à un état en mémoire. Elle ne teste pas la sérialisation REST/GraphQL de l'adaptateur GitHub réel. Le SCM ne clone/pousse aucun dépôt : il utilise dix identités historiques et un manifeste Cargo minimal à trois dépendances. Les releases sont déterministes et synthétiques ; les arbres Git historiques et les registres réels ne sont pas rejoués. Les fichiers locaux éventuels restent sous un nouveau `/tmp/renovate-worker-168-*`.

L'horloge Date/Luxon est injectée. Nock interdit le réseau ; TCP/TLS, fetch et les processus enfants sont aussi bloqués. Les méthodes inconnues des interfaces échouent et rendent le contrôle du banc rouge, même si le worker absorbe leur exception. Le dépôt de production ne sert jamais de cible au worker : son nom de fixture est `audit/fixture`, son endpoint `https://api.invalid/`, aucun token n'est transmis au worker. Les seules écritures GitHub de la mission concernent la nouvelle branche et sa PR documentaire/de tests.

Le mode `native` laisse les écritures **uniquement dans le modèle en mémoire**, pour observer les effets et contrôler que les tests ne sont pas rendus artificiellement verts. Le mode `barrier` refuse toute écriture à la même frontière et journalise l'appel et sa pile avant l'exception. Cette barrière de gel global est une **proposition hors production**, pas une configuration Mend ni un mécanisme sélectif opérationnel pour de nouvelles PR.

## Résultats et contre-exemples

La [matrice complète](evidence/final/MATRIX.md) couvre **40 scénarios × 2 modes = 80 exécutions**. « PASS natif » signifie uniquement aucun appel d'écriture vers les dix objets protégés et snapshots protégés identiques dans ce scénario. « PASS barrière » signifie confinement des effets, y compris quand le worker se termine en erreur. Aucun PASS ne signifie service hébergé validé.

| Validation exécutée | Résultat |
|---|---|
| Gel protégé, options natives, scénarios couverts | **22 PASS / 18 FAIL** |
| Confinement par barrière globale, snapshots avant/après | **40 PASS / 0 FAIL** |
| Mutations injectées vers dix PR, commentaires, labels, reviews, commits, statuts, refs, merge/GraphQL et push symboliques | **500 rejets PASS**, effet non exécuté |
| Contrôle positif sans barrière et trois méthodes inconnues | **PASS** |
| Tentatives d'évasion par processus enfant/push, exec, TCP, TLS et fetch POST | **5 rejets PASS** |
| Calendrier réel 44.164.1, 16 instants hiver/été/jours DST, intégrés au worker | **PASS**, 32 exécutions sur les deux modes |
| Validateur officiel 44.164.1 `--strict --no-global` | **PASS**, warning RE2 conservé |
| Sourcemaps des cinq fichiers comparées au tag contrôlé | **5 PASS** |
| Commande de reproduction complète puis vérification des preuves extraites | **PASS** |

Contre-exemples observés dans le worker réel, avec effets exclusivement simulés :

- Cargo seul reconnaît les **trois** branches #164–166. Avec `pruneStaleBranches:false` et `rebaseWhen:never`, un passage ordinaire les laisse intactes dans la fixture.
- Avec le nettoyage natif activé, les sept branches npm orphelines donnent **7 fermetures + 7 suppressions** simulées.
- `enabled:false` dans le fichier du dépôt, qui contient pourtant `pruneStaleBranches:false`, conduit au nettoyage sur la configuration extérieure : **10 fermetures + 10 suppressions** simulées. Ce chemin d'erreur n'applique pas le garde local.
- Rebase demandé par titre, label, case et dashboard : écritures Cargo malgré `rebaseWhen:never`. Le label de rebase peut être retiré avant la vérification du label d'arrêt. `stopUpdatingLabel` seul ne constitue donc pas un gel absolu ; une case cochée le contourne aussi dans la fixture.
- Les changements de titre/corps/labels et de branche cible provoquent les PATCH correspondants. Les conflits peuvent provoquer une réécriture ; une branche éditée ou retargetée peut recevoir un commentaire.
- Absence de Cargo.lock, erreur de génération d'artefact et erreur `repository-changed` sont exercées séparément. Cette dernière est une injection à la frontière SCM : aucun mécanisme distribué de lease Mend n'est attesté.
- Erreur de création de PR sur nouvelles branches de fixture : les dix anciennes restent intactes. Cas 502 sur une branche existante dont la PR est simulée absente des lectures : le worker supprime les **trois branches Cargo** après échec de création. Le contrôle natif l'observe ; la barrière bloque avant la première réécriture.
- Changer seulement le préfixe en gardant `branchPrefixOld` retrouve les branches historiques : ce n'est pas une solution de protection validée.

La couverture précise V8, prise autour de chaque appel du worker, est conservée par scénario dans les résultats détaillés. Totaux : `renovateRepository` **80**, `initRepo` **80**, `extractDependencies` **76**, `writeUpdates` **76**, `processBranch` **222**, `ensurePr` **39**, `pruneStaleBranches` **74**, `finalizeRepo` **72**. Ces nombres attestent l'exécution, pas une couverture exhaustive des chemins. Les sorties prématurées de config, de label et de dashboard sont visibles ; les chemins après rejet ne sont pas artificiellement poursuivis.

## Reproduction et preuves

Préparation, dans des dossiers extérieurs au projet et avec Node 24.19.0 :

```bash
export AUDIT_TOOLS=/tmp/renovate-168-tools
export AUDIT_UPSTREAM=/tmp/renovate-168-upstream
export AUDIT_OUTPUT=/tmp/renovate-168-proof
bash docs/audits/renovate-worker-168/prepare-tools.sh
bash docs/audits/renovate-worker-168/reproduce.sh
```

La préparation télécharge les outils ; le rejeu n'effectue aucune opération réseau autorisée et ne nécessite aucun accès GitHub. Dans cette session, `reproduce.sh` a réellement abouti avec les outils sous `/workspace/renovate-audit-tools`, l'amont sous `/workspace/renovate-44.164.1` et la sortie `/tmp/renovate-168-reproduction`. Le [bilan reproduit](evidence/reproduction-verification.json) et le [retour de commande](evidence/reproduction-command.log) sont conservés.

Les preuves brutes sont dans [full-replay.tar.xz](evidence/full-replay.tar.xz) : journaux, mutations avec payloads/piles, résultats et couverture, **80 snapshots complets avant/après**, garde-fous, provenance et validation. Les snapshots sont décompressés à l'intérieur du tar pour éviter quatre-vingts répétitions coûteuses. Pour les revérifier :

```bash
mkdir -p /tmp/renovate-168-review
tar -xJf docs/audits/renovate-worker-168/evidence/full-replay.tar.xz -C /tmp/renovate-168-review
AUDIT_OUTPUT=/tmp/renovate-168-review/final node docs/audits/renovate-worker-168/verify.mjs
```

[development-attempts.tar.xz](evidence/development-attempts.tar.xz) conserve les tentatives 02–05 avec leurs échecs et journaux ; elles ne sont pas des validations finales. La première tentative signalait notamment `getAllBranchUpdateDates`/`ensureCommentRemoval` non modélisés et n'initialisait pas encore le logger. Son journal intégral n'a pas été conservé lors d'une erreur locale de compactage des sorties générées ; aucune preuve de réussite ne lui est attribuée. L'erreur de compactage a été corrigée, les archives finales ont été reconstruites à partir de la reproduction complète puis extraites et revérifiées. Aucun fichier historique du dépôt n'a été supprimé ou modifié par ce conditionnement.

Autres traces d'environnement : le premier clonage a échoué sans accès réseau dans le sandbox ; l'installation npm a d'abord échoué sur son cache hors des racines autorisées, puis a réussi avec un cache isolé sous `/workspace`. Plusieurs appels ont été interrompus à l'arrivée de nouveaux messages ; l'état a été relu avant toute reprise. Ces incidents ne sont pas qualifiés comme des tests du worker réussis.

Le contrôle whitespace signale la ligne vide finale du README archivé de #162. Elle est conservée pour maintenir son blob exact ; les autres fichiers ajoutés passent ce contrôle. Les fichiers `.log` de preuves sont ajoutés explicitement malgré l'exclusion historique des logs dans le dépôt.

## Limites, NOT RUN et décision

| Domaine | État et garantie non démontrée |
|---|---|
| Code statique des cinq fichiers demandés | Inventorié dans [static-call-inventory.json](evidence/static-call-inventory.json) ; un appel statique n'est pas une exécution |
| Worker complet isolé | Exécuté avec les frontières décrites, sur des données synthétiques et dix identités historiques |
| Adaptateur GitHub REST/GraphQL réel, batch/alias/IDs opaques | **NOT RUN** ; les 500 rejets portent sur le transport symbolique, pas la résolution réelle de toutes les cibles d'une API |
| Git réseau, trees historiques exacts, signatures, refs internes de cache | **NOT RUN** ; `clearRenovateRefs` reçoit une fixture vide. Aucun protocole réel de push/delete n'est exercé |
| Lease/lock du service distribué, courses concurrentes, reprise après crash | **NOT RUN** ; `repository-changed` est une faute contrôlée, pas une preuve de verrouillage effectif |
| CLI Cargo et génération réelle des lockfiles | **NOT RUN** ; les manipulations de manifeste passent dans le worker, mais les releases et erreurs d'artefacts sont simulées |
| Application Mend hébergée, version/options/installations effectives | **NOT RUN**, aucune garantie de gel ou de refus d'écriture en production |
| Coordination Renovate/Dependabot et sécurité Cargo/transitifs | **NON RÉGLÉE**, hors de cette mission ; aucune remédiation ni alerte désactivée |
| Tests applicatifs, Android, builds Rust/JS et audits de sécurité existants | **NOT RUN** dans cette mission ; aucun succès global de CI revendiqué |

La barrière globale constitue un témoin de confinement reproductible. Elle ne suffit pas à permettre des nouvelles PR tout en garantissant le gel des dix anciennes dans le service réel. **La protection intégrale nécessaire à une activation reste non démontrée.** Aucun déploiement, aucune fusion et aucune modification des configurations actives, dépendances, verrous, workflows, permissions, licences ou mécanismes de sécurité n'est proposé ici.

## Revue indépendante demandée à ChatGPT

1. Vérifier au SHA exact de cette PR que la diff n'ajoute que ce dossier et que les blobs préexistants, les branches #153/#162/#167 et les dix PR/refs sont conservés.
2. Contrôler le tag/SHA amont, l'intégrité npm/verrou et les cinq comparaisons de sourcemaps ; examiner les remplacements de frontière et l'injection Cargo.
3. Rejouer `reproduce.sh`, extraire les preuves, relire les payloads/piles et la couverture par scénario ; vérifier les 18 FAIL natifs et les sorties précoces derrière les PASS de confinement.
4. Auditer les résolutions de cibles et voies d'écriture absentes du faux transport, les refs internes, les courses/locks et les limites de la fixture ; ne pas attribuer au Mend réel la barrière du banc.
5. Maintenir le verdict BLOQUÉ. Une éventuelle barrière opérationnelle et sa vérification dans un environnement contrôlé distinct nécessiteront une autre mission ; la coordination inter-bots reste séparée.
