# Validation CI indépendante de l'audit #170

Cette branche part de **ddcef79479a6804ed52c8cf92710f87d4d5404f9**, head audité de #170. Elle cible `test/renovate-full-worker-168` dans une nouvelle PR en brouillon. Elle ajoute uniquement le workflow `renovate-audit-ci.yml` et ce dossier. Les **138 blobs préexistants**, dont les sources et preuves de #170 et les archives de #162, restent inchangés. Les consignes de #167, le contrat IA, le relais et l'issue #168 ont été relus.

## Exécution et isolement

Le workflow est déclenché par **pull_request**, avec **contents: read uniquement**. Les trois actions sont épinglées par commit ; leurs tags ont été contrôlés par lecture GitHub. Il checkout le **head exact**, sans credential Git persistant, et utilise **Node.js 24.19.0**.

La préparation exécute le `prepare-tools.sh` historique sans le modifier : outils/verrou et clone amont dans `RUNNER_TEMP`, installation `npm ci --ignore-scripts`. Un contrôle séparé vérifie le verrou original, les versions installées, le tag 44.164.1, le commit amont `6cc889803a44be232802143499d904799f58abc0`, le SRI SHA-512 de l'archive npm et l'identité de tous ses fichiers avec l'installation. Le vérificateur historique compare aussi les cinq sourcemaps au code amont.

Le rejeu utilise **un espace réseau Linux sans interface externe**, distinct du réseau hôte. Les sources, outils et clone amont sont montés en lecture seule. Le processus redescend vers l'UID du runner, sans groupes supplémentaires ni capacités, avec `no_new_privs`. `env -i` ne transmet aucun token, proxy ou variable GitHub. Deux contrôles noyau/environnement, avant et après, sont obligatoires. L'indisponibilité de `sudo`, `unshare`, des mounts ou de `setpriv` est un **échec explicite**, sans repli vers une exécution connectée.

Dans cette isolation, le `reproduce.sh` de #170 est exécuté tel quel. Les seuls paramètres adaptés sont ses chemins externes. Le worker reste dirigé vers `audit/fixture`, avec faux SCM et fausse plateforme ; aucune exécution contre la production ou Mend.

Deux instantanés publics GitHub, via **GET sans token hors du worker**, comparent les dix PR, refs/SHA, titres, descriptions, labels, commentaires, reviews et commentaires inline avant/après. Une différence, une erreur API ou une limitation de débit fait échouer le contrôle. Ils ne constituent pas une preuve du comportement futur de Mend.

## Vérification indépendante

`independent-verify.py` ne reprend pas les verdicts du rapport initial : il charge les événements bruts et les 80 snapshots, recalcule les cibles protégées, compare les états et impose la présence unique des 40 scénarios dans les deux modes. Il impose les **22 PASS / 18 FAIL natifs**, les **40 confinements**, les injections, le contrôle positif, les méthodes inconnues, les évasions, les 16 instants Europe/Paris/DST et les compteurs effectifs V8 par fichier/fonction.

`guard-recheck.mjs` réexécute séparément **500 injections**, contrôle l'absence d'effets derrière le rejet, observe un effet positif sans barrière et exerce les trois méthodes inconnues. Huit tests du vérificateur exigent notamment qu'une exécution manquante, un FAIL masqué, un snapshot altéré, une couverture manquante, une injection manquante, un contrôle positif neutralisé ou une évasion manquante soient rejetés.

Les étapes obligatoires ne sont ni ignorées ni autorisées à échouer. `finalize.py` refuse tout statut missing/skipped/failure et toute preuve obligatoire absente. L'upload des artifacts s'effectue aussi en cas d'échec et échoue s'il n'y a aucun fichier. `completion.json` conserve le **head exact**, les étapes et le verdict. Les artifacts comprennent les journaux de préparation/rejeu, les résultats, mutations/piles, 80 snapshots, provenance, intégrité npm, contrôles d'isolement, instantanés GitHub et validations indépendantes. Rétention : 14 jours.

## Différences avec #170

- **Aucun fichier historique modifié.** Les nouveaux vérificateurs et l'isolation CI entourent les scripts existants.
- Le classificateur de #170 ignore les objets imbriqués dans les tableaux de payloads. Dans `artifact-lock-error`, six événements de statut portent ainsi une `branchName` protégée mais ne sont pas comptés comme tels. Le nouveau contrôle recalcule **15 tentatives protégées au lieu de 9**, à partir des quinze événements déjà conservés. Le scénario reste FAIL natif ; les totaux **22/18** et **40 confinements** sont inchangés. L'écart est enregistré explicitement dans `independent-verification.json`, sans réécrire le compteur ou les preuves historiques.
- Le contrôle de conservation respecte les conversions LF/CRLF imposées aux scripts Windows par les attributs Git historiques : il compare les blobs/modes Git et les fichiers après conversion Git canonique, puis vérifie les SHA-256 bruts de tout le dossier d'audit historique.

## Résultats constatés avant publication et lecture de la CI

Dans l'environnement local, avec les outils épinglés déjà présents : **80 rejeux réussis**, vérificateur historique exécuté, bilan indépendant **22 PASS / 18 FAIL natifs et 40 confinements**, **500 nouvelles injections**, trois opérations inconnues et **8 tests du vérificateur réussis**. L'environnement était vidé des credentials. Syntaxe shell, Python et YAML contrôlée ; comparaison des **138 blobs historiques** réussie. L'isolement privilégié par `sudo/unshare/mount` n'était pas disponible localement : il n'y est pas déclaré validé.

Les résultats GitHub Actions doivent être lus dans le run rattaché au **dernier head de cette PR**, puis dans `completion.json`, les contrôles d'isolement et les journaux/artifacts. Les résultats locaux ci-dessus ne remplacent pas une CI exécutée. Aucun succès de CI globale applicative ou des workflows de sécurité préexistants n'est revendiqué par ce dossier.

Premier essai GitHub, [run 38981473720](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38981473720), head `1bfc06557f44e2d07b4db7bafb5f304d9add71f9` : définition rejetée avant création de job, donc **aucun rejeu exécuté**. L'initialisation des chemins `runner.temp` a été déplacée de l'environnement de job vers une étape dédiée utilisant `RUNNER_TEMP`. Ce run n'est pas présenté comme une validation du banc.

Pour examiner hors CI des artifacts téléchargés :

```bash
export AUDIT_OUTPUT=/chemin/vers/artifact/extrait
python3 docs/audits/renovate-ci-170/independent-verify.py
python3 docs/audits/renovate-ci-170/check-verifier.py
```

## Limites et revue ChatGPT

Même si cette CI est verte, le verdict opérationnel reste **BLOQUÉ** : service Mend hébergé, adaptateur GitHub réel, protocole Git réseau/refs internes, verrous distribués et coordination inter-bots ne sont pas démontrés. Les FAIL natifs sont des contre-exemples conservés, pas des erreurs à neutraliser.

ChatGPT doit vérifier le head/base exacts, l'absence de modification des 138 blobs historiques et workflows existants, les permissions, le namespace réseau et l'environnement nettoyé, les contrôles npm/tag/commit, le recalcul des snapshots/événements et l'écart des six statuts imbriqués. Il doit lire les outcomes effectifs et les artifacts du run final, vérifier les tests négatifs et maintenir l'absence d'autorisation d'activation/fusion.
