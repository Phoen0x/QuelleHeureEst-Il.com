# Pause temporaire de Renovate — provenance, vérifications et reprise
# Temporary Renovate pause — provenance, checks and reactivation

## Français — état et décision de fusion

**Proposition en brouillon. Ne pas fusionner avant de garantir l'absence de nettoyage automatique des PR Renovate existantes au niveau de l'exécuteur/service.** Aucune application sur main n'est revendiquée : cette branche est distincte et la décision finale appartient à la propriétaire du dépôt.

### Problème constaté

Observation du 15 octobre 2026, vers 09:24 Europe/Paris :

- main : `235194a6fe825a6dac27012f07cbac2cc5d86794` ; arbre `114ca6e1289d2e74d40fe47b81e3c8e8791c0acc`.
- #153 : ouverte, non fusionnée, tête `0ebc167c8febf1b61752d1114f8135a59400c5f1`.
- main ne possède pas les contrôleurs de conservation de #153 et utilise seulement `extends: ["config:recommended"]` pour Renovate.
- Le `enabled: false` présent dans la branche #153 ne s'applique pas à main tant que cette PR n'est pas intégrée.
- Une seule configuration Renovate reconnue est présente dans l'arbre main examiné : `renovate.json`. AGENTS.md est absent de main ; .github/README.md et .bolt/prompt ont été lus, ainsi que les instructions conservées sur #153 à titre de référence.
- 19 PR ouvertes au relevé : 6 Renovate, 9 Dependabot, #153 et 3 PR historiques ai-findings-autofix. Elles n'ont reçu aucune modification dans cette mission.

Les PR Renovate ne sont pas de simples propositions sans incidence sur les verrouillages :

| PR | Objet | Fichiers proposés au relevé |
|---|---|---|
| [#155](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/155) | PostCSS [SECURITY] | package-lock.json et pnpm-lock.yaml |
| [#156](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/156) | Vite annoncé v7.3.7 | package.json et pnpm-lock.yaml |
| [#158](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/158) | eslint | package-lock.json et pnpm-lock.yaml |
| [#159](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/159) | autoprefixer | package-lock.json et pnpm-lock.yaml |
| [#160](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/160) | eslint-plugin-react-refresh | package.json, package-lock.json et pnpm-lock.yaml |
| [#161](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/161) | lucide-react | package.json, package-lock.json et pnpm-lock.yaml |

La diff de #156 propose précisément `"vite": "^8.0.16"` → `"vite": "^7.3.5"`, malgré son titre d'update v7.3.7. D'autres PR réécrivent largement package-lock.json : par exemple #161 affiche 505 ajouts / 1204 suppressions dans ce fichier. Ces observations prouvent un risque de cohabitation et de régénération à revoir ; elles ne prouvent pas que chaque ligne supprimée constitue une dépendance injustement perdue. Aucun de ces correctifs n'est importé ici.

Les neuf PR Dependabot existantes sont #138, #144, #145, #146, #148, #149, #150, #151 et #152 ; elles restent ouvertes et inchangées. Les six PR Renovate ont `auto_merge: null` au relevé, sans garantie qu'une autre automatisation ne puisse évoluer ensuite.

### Changement actif strictement limité

Seul `renovate.json` est modifié parmi les fichiers préexistants. Les deux champs suivants sont ajoutés, en conservant exactement $schema et extends :

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended"
  ],
  "enabled": false,
  "automerge": false
}
```

`enabled: false` arrête le traitement des mises à jour du dépôt par Renovate selon la version étudiée. `automerge: false` exprime explicitement l'absence de fusion automatique par Renovate. Le second champ ne neutralise pas une automatisation GitHub indépendante ni une opération déjà en cours.

Les seuls ajouts sont la copie historique et ce README. Aucun workflow de validation supplémentaire n'est introduit ; aucune dépendance de l'application n'est installée ou modifiée.

### Archive intégrale et vérifiable

- Source : [renovate.json sur main au SHA de départ](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/235194a6fe825a6dac27012f07cbac2cc5d86794/renovate.json).
- Introduction : [bf6ceab262cb3e9e637ff47092b63fa8634d9b49 — Add renovate.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/bf6ceab262cb3e9e637ff47092b63fa8634d9b49).
- Commit source de l'archive : `235194a6fe825a6dac27012f07cbac2cc5d86794`.
- Copie conservée : [renovate.original.json](renovate.original.json).
- Taille : **114 octets**, fin de ligne finale comprise.
- Blob Git source et archive attendu : **5db72dd6a94fc07d18b0e6c0cf76e67ce982f1f9**.
- SHA-256 : **e80b4e42a3043bc12fa0640db4bac392d2bf770acf841360d7c8ceeeac2ec1a9**.

La copie est identique octet par octet ; aucun paramètre, commentaire ou formatage antérieur n'est perdu. La configuration originale ne contient pas de commentaire. Le nom et le chemin d'archive ne font pas partie des emplacements usuels de configuration active de Renovate.

### Point bloquant : disabled peut aussi nettoyer les PR

La [documentation officielle de enabled, version 44.155.7](https://github.com/renovatebot/renovate/blob/44.155.7/docs/usage/configuration-options.md#enabled) indique un nettoyage des PR/branches lors de la désactivation complète. La documentation générale de [pruneStaleBranches](https://github.com/renovatebot/renovate/blob/44.155.7/docs/usage/configuration-options.md#prunestalebranches) décrit une option pour désactiver ce nettoyage, mais il faut vérifier le contexte où elle est lue.

Chemin source examiné :

1. [init/index.ts](https://github.com/renovatebot/renovate/blob/44.155.7/lib/workers/repository/init/index.ts) clone la configuration ; la configuration du dépôt est fusionnée dans ce nouvel objet.
2. [configured.ts](https://github.com/renovatebot/renovate/blob/44.155.7/lib/workers/repository/configured.ts) lève `REPOSITORY_DISABLED_BY_CONFIG` lorsque enabled vaut false, avant la détection des vulnérabilités.
3. [repository/index.ts](https://github.com/renovatebot/renovate/blob/44.155.7/lib/workers/repository/index.ts) intercepte cette erreur puis appelle `pruneStaleBranches(config, [])` avec la configuration extérieure, car l'initialisation n'a pas retourné son objet fusionné.
4. [finalize/prune.ts](https://github.com/renovatebot/renovate/blob/44.155.7/lib/workers/repository/finalize/prune.ts) peut alors fermer les PR orphelines et supprimer leurs branches. Son arrêt `pruneStaleBranches: false` doit être effectif dans l'objet réellement utilisé.

Un test hors ligne exécutant les corps JS publiés de ces fonctions, avec fusion repo, I/O, plateforme et auxiliaires simulés, reproduit :
- candidat enabled=false, prune global=true : une fermeture et une suppression **simulées** ;
- même candidat avec pruneStaleBranches=false **uniquement dans le fichier repo** : même contre-exemple ;
- pruneStaleBranches=false dans la configuration extérieure de l'exécuteur : aucun appel de fermeture/suppression simulé.

Ce n'est pas une exécution de l'app GitHub installée : sa version et ses options globales ne sont pas connues. Le test démontre qu'un simple troisième champ local ne suffit pas à promettre la conservation ; cette protection inefficace n'est donc pas ajoutée au fichier actif.

**Prérequis humain avant fusion :** obtenir de l'opérateur Renovate une garantie/test de nettoyage désactivé au niveau effectif de l'exécuteur, ou suspendre les exécutions du service jusqu'à l'intégration des garde-fous et à la réactivation contrôlée. Aucun réglage d'app, permission, protection ou PR existante n'est modifié par cette mission. Si ce prérequis est impossible, demander l'accord pour une autre stratégie de pause avant d'abandonner enabled=false au niveau dépôt ; ne pas la substituer silencieusement.

### Sécurité : ce qui change et ce qui reste

| Fonction | Effet proposé |
|---|---|
| PR de versions Renovate | Suspendues une fois la configuration fusionnée et prise en compte |
| PR de sécurité produites par Renovate, dont le mécanisme vulnerabilityAlerts et les remédiations OSV si utilisées | Également suspendues pendant cette pause ; #155 illustre un correctif de sécurité Renovate déjà proposé |
| Maintenance/régénération de verrou par Renovate | Traitement interrompu avec le dépôt désactivé ; aucune régénération exécutée ici |
| CodeQL et .github/workflows/codeql.yml | Inchangés, blob 6045f8eebddacb766b1163aec67cab3b10613eea |
| Audits et .github/workflows/security-analysis.yml | Inchangés, blob 333a21398668fdc3b1e83f39ce60d7b0a349a417 |
| Tous les autres workflows, dont .github/workflows/auto-approve.yml | Inchangés ; auto-approve blob 2d2995cd9abfd42781a3d0942cc49d836a3d65ea |
| Dependabot alerts / dependency graph | Aucun réglage ou endpoint d'écriture de ces services n'est utilisé ; Renovate ne les désactive pas via ces champs |
| Dependabot Security Updates | Aucun changement de configuration/service ; poursuivent leur fonctionnement si activés côté GitHub |
| PR existantes, scans/alertes déjà présents | Aucun changement par l'agent ; attention au nettoyage Renovate futur décrit ci-dessus |

Les réglages effectifs Dependabot alerts/security-updates ne sont pas exposés dans la réponse du dépôt accessible : leur activation administrative initiale n'est **pas attestée**. La preuve est l'absence de modification de réglage/configuration, pas une affirmation que tous ces services étaient déjà actifs.

La configuration Dependabot actuelle de main reste intacte (blob `c91b6905b78503b435d6a6db5c7bb8652cdaf62a`) : écosystèmes npm et github-actions, fréquence quotidienne, limites de PR à 0. Son commentaire dit à tort « illimité » ; **0 désactive les PR de versions**, pas les PR de sécurité, qui ont un mécanisme/une limite distincts. Aucun Cargo n'est configuré sur main ; l'ajout prévu dans #153 n'est pas importé ici. Voir [documentation GitHub de la limite](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#open-pull-requests-limit).

La pause n'élimine pas les vulnérabilités existantes et ne permet pas d'assouplir les audits. Pendant la pause, surveiller les alertes et traiter les correctifs urgents par une revue manuelle qui conserve les dépendances et variantes. Aucune fusion de #155 ou d'une autre PR n'est proposée automatiquement.

### Vérifications réellement exécutées

| Contrôle | Résultat |
|---|---|
| JSON de l'original et du candidat | Réussite |
| Schéma officiel Renovate 44.155.7, Draft-07, original et candidat | Réussite via jsonschema Python ; schéma du paquet npm officiel |
| Validateur officiel 44.155.7, mode repo --strict --no-global | Code 0 : Config validated successfully against 1 file(s) |
| Comparaison structurelle du candidat | Exactement l'original + enabled=false et automerge=false |
| Archive | Blob Git, taille et SHA-256 identiques à l'original distant |
| Test de comportement isolé | Les trois cas ci-dessus et leurs assertions réussissent ; ils révèlent le prérequis de conservation |
| Builds/lint/Cargo/Android/clients IDE | Non exécutés : aucun fichier applicatif ni dépendance modifié |
| Application par Renovate sur main | Non testée et non revendiquée : PR non fusionnée, aucun run réel Renovate déclenché |

Node utilisé pour le validateur : **24.19.0**, compatible avec l'outil 44.155.7. Ce n'est pas une migration de la version Node du projet. L'installation npm de l'outil reste dans un cache isolé hors dépôt ; aucun manifeste/lock de l'application n'est régénéré, et pnpm reste le gestionnaire JavaScript du projet.

L'installation temporaire avec --ignore-scripts émet six avis de dépréciation de sous-dépendances (inflight, node-domexception, boolean, glob 6, rimraf 2, glob 10). Le validateur signale aussi **RE2 non disponible, repli sur RegExp** ; la configuration candidate n'a aucune expression régulière. Le code 0 est réel, mais ce warning n'est pas masqué.

Le premier accès npm sans permission réseau a échoué EPERM ; un second accès avec permission réseau sandboxée a réussi. Le schéma n'est pas suivi à la racine du tag GitHub demandé : la tentative de lecture y a échoué ; le schéma a ensuite été obtenu du paquet npm officiel. Le premier essai de fixture VM manquait les constantes importées ; la fixture a été corrigée pour charger les constantes du paquet puis tous les cas ont réussi. Ces essais ne sont pas présentés comme des défaillances du projet.

SHA-256 du schéma npm : `84e7cc4e672d3c184fcfc885c5ed19f28322c35c96868d78004ec2fa07354642`.
Intégrité npm 44.155.7 : `sha512-IzhdRP2lKWFeTLcbD7hzvpgxSnpcz6Tkzw7B4f2iwIT5DZ9eA3K0JLKzah+FZLkdMp+XJglG/lJEKfem0FVQhA==`.

Commandes de validation exécutées (cache privé, pas installation du projet) :

```sh
node --version
npm exec --offline --yes --ignore-scripts --cache /workspace/renovate-pause-npm-cache --package=renovate@44.155.7 -- renovate-config-validator --strict --no-global /workspace/renovate-pause-20261015/renovate.json
node /workspace/renovate-pause-20261015/check-disabled-cleanup.cjs
```

Le schéma a été chargé depuis `node_modules/renovate/renovate-schema.json`, validé avec `jsonschema.validators.validator_for(schema).check_schema(schema)`, puis appliqué aux deux JSON.

### Conservation et compatibilité

Seul le fichier de configuration Renovate actif change. Tous les manifestes, versions, dépendances, variantes Android/optionnelles, lockfiles pnpm/npm/Cargo, paramètres Tauri, StackBlitz/Bolt, Cursor/Claude/Codex, commentaires, scripts, code fantôme, archives et textes juridiques restent inchangés. La vérification finale des arbres Git doit confirmer 86 des 87 fichiers préexistants identiques, un seul fichier modifié et deux ajouts historiques, zéro suppression.

Cela prouve la conservation des configurations, pas leur exécution réelle dans chaque environnement. Aucune nouvelle dépendance de l'application, aucun script mutateur historique, aucun appel de fusion/fermeture de PR, aucun force-push.

### Réactivation après intégration de #153

1. Tant que le prérequis anti-nettoyage n'est pas garanti, garder cette PR en brouillon et traiter la suspension au niveau du service avec son opérateur ; l'agent ne modifie pas les permissions.
2. Si la pause est fusionnée, vérifier le SHA de main et le prochain journal réel Renovate ; ne pas déduire son application de la seule CI de PR.
3. Intégrer #153 par décision humaine et vérifier que ses contrôles de conservation, archives, variantes optionnelles et gardes de générateurs sont réellement présents et passent sur main.
4. #153 contient sa propre version de renovate.json. Si un conflit apparaît avec cette pause, conserver l'archive précédente et la configuration parallèle de #153 ; revoir explicitement enabled/automerge et les paramètres. Aucun merge/résolution de #153 n'est effectué ici.
5. Préparer une autre PR de réactivation, à partir du main alors courant : conserver les limites et protections de #153 ; autoriser Renovate seulement après revue, garder automerge=false et prévoir la conservation des PR/branches existantes.
6. Valider de nouveau schéma et CLI avec une version supportée, contrôler une mise à jour réelle en copie/PR de test : dépendances historiques, cinq racines Babel/React Refresh, variantes Android, locks, h2 et deux rétroports GLib.
7. Une fois la PR de réactivation fusionnée par la propriétaire et les paramètres du service compatibles, réactiver l'exécution Renovate puis vérifier son journal et la première PR. L'archive ici reste une référence historique ; **ne pas la recopier aveuglément sur la future configuration protégée**.

## English — secondary

This is a draft, minimal pause proposal based on main 235194a6fe825a6dac27012f07cbac2cc5d86794. Only enabled=false and automerge=false are added; the exact original configuration is archived with its Git blob, SHA-256 and origin commit. No dependencies, lockfiles, existing workflows, security/licensing policy or existing PRs are changed.

The JSON, official npm-shipped schema and Renovate 44.155.7 strict repository validator pass. An isolated test using published JS function bodies and mocked repository merging/platform/I/O demonstrates a cleanup hazard: repository-level pruneStaleBranches=false is insufficient on the disabled initialization error path. Effective executor-level protection or service suspension is therefore a prerequisite before merge. The installed GitHub App version/global settings are unknown; no real Renovate run or main application is claimed.

The pause also suspends security-remediation PRs produced by Renovate. Dependabot alerts/security updates and CodeQL/audit workflows are not disabled by this change. Existing reports and configurations remain intact; reactivation requires a separate reviewed PR after #153's preservation safeguards are on main.

## Annexe : preuve de comportement reproductible / Reproducible behavior evidence

Le code ci-dessous est une fixture **inactive dans cette documentation**. Pour le reproduire, utiliser une copie isolée avec le paquet renovate@44.155.7 installé, exporter RENOVATE_PACKAGE_ROOT (chemin dist terminé par /) et RENOVATE_PAUSE_FIXTURE_DIR (répertoire contenant le candidat renovate.json). Tous les appels GitHub et écritures de dépôt sont simulés. Seul le JSON de résultat est écrit dans cette copie isolée. Ce n'est pas un test de l'app installée.


```javascript
// FR : Test isolé ; tous les appels de plateforme et de fichiers sont simulés.
// EN: Isolated test; all platform and filesystem calls are mocked.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.env.RENOVATE_PACKAGE_ROOT || '/workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/renovate/dist/';
const fixture = process.env.RENOVATE_PAUSE_FIXTURE_DIR || '/workspace/renovate-pause-20261015';
const paths = ['workers/repository/configured.js', 'workers/repository/init/index.js', 'workers/repository/finalize/prune.js', 'workers/repository/index.js'];
const source = paths.map(p => fs.readFileSync(root+p, 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/^export \{.*\};\r?\n/gm, '')).join('\n');
async function run(local, globalPruning) {
  const events = [];
  const noop = () => {};
  const logger = {debug:noop,info:noop,trace:noop,warn:noop,once:{reset:noop}};
  const ctx = {
    ...require(root+'constants/error-messages.js'),
    console, structuredClone, logger, setMeta:noop, pkg:{version:'44.155.7'},
    GlobalConfig:{set:c=>c,get:k=>k==='localDir'?'mock-local':false},
    instrument:async(name,fn)=>fn(), applySecretsAndVariablesToConfig:({config})=>config,
    removeDanglingContainers:async()=>{}, clear:noop, clear$1:noop, splitInit:noop,
    ensureDir:async()=>{}, init:noop, initMutexes:noop, clone:structuredClone,
    PackageFiles:{clear:noop}, resetCaches:async()=>{}, initializeCaches:async()=>{},
    initApis:async c=>({...c,defaultBranch:'main'}),
    // FR : La fusion repo est simulée ; clone, arrêt et nettoyage sont le code publié.
    // EN: Repository merging is mocked; clone, stop and cleanup use published code.
    getRepoConfig:async c=>({...c,...local}), setRepositoryLogLevelRemaps:noop,
    setUserRepoConfig:noop, cloneSubmodules:async()=>{}, getAll:()=>[],
    detectVulnerabilityAlerts:async c=>{events.push('vulnerability-detection');return c;},
    platform:{findPr:async()=>({number:1,title:'mock',state:'open'}),updatePr:async p=>events.push(['updatePr',p.state])},
    scm:{isBranchModified:async()=>false,deleteBranch:async b=>events.push(['deleteBranch',b])},
    ensureComment:async()=>events.push('ensureComment'),
    getBranchList:()=>['renovate/mock-existing'],getReconfigureBranchName:()=> 'renovate/reconfigure',
    isNonEmptyStringAndNotWhitespace:s=>typeof s==='string'&&s.trim().length>0,
    isMultiBaseBranch:()=>false,uniqueStrings:(v,i,a)=>a.indexOf(v)===i,regEx:s=>new RegExp(s),
    handleError:async(c,e)=>e.message,processResult:(c,e)=>({res:e}),
    addSplit:noop,getSplits:()=>({total:0}),ATTR_RENOVATE_SPLIT:'mock',
    deleteLocalFile:async()=>{},rmCache:async()=>{},privateCacheDir:()=> 'mock-cache',
    isCloned:()=>false,resetRepositoryLogLevelRemaps:noop,
  };
  for(const s of ['PackageCacheStats','DatasourceCacheStats','HttpStats','HttpCacheStats','LookupStats','GetDatasourceReleasesStats','ObsoleteCacheHitLogger','AbandonedPackageStats','GitOperationStats'])ctx[s]={report:noop};
  vm.createContext(ctx);
  vm.runInContext(source,ctx,{filename:'unmodified-renovate-published-functions.js'});
  const result=await ctx.renovateRepository({repository:'mock/repository',enabled:true,pruneStaleBranches:globalPruning,branchPrefix:'renovate/',defaultBranch:'main',persistRepoData:true});
  return {result,events};
}
(async()=>{
  const candidate=JSON.parse(fs.readFileSync(fixture+'/renovate.json','utf8'));
  const baseline=await run(candidate,true);
  assert.equal(baseline.result.res,'disabled-by-config');
  assert.equal(baseline.events.filter(e=>Array.isArray(e)&&e[0]==='updatePr'&&e[1]==='closed').length,1);
  const localOnly=await run({...candidate,pruneStaleBranches:false},true);
  assert.equal(localOnly.result.res,'disabled-by-config');
  assert.equal(localOnly.events.filter(e=>Array.isArray(e)&&e[0]==='updatePr'&&e[1]==='closed').length,1);
  assert.equal(localOnly.events.filter(e=>Array.isArray(e)&&e[0]==='deleteBranch').length,1);
  assert(!localOnly.events.includes('vulnerability-detection'));
  const globalOff=await run(candidate,false);
  assert.equal(globalOff.result.res,'disabled-by-config');
  assert.deepEqual(globalOff.events,[]);
  const output={version:'44.155.7',method:'Published JS function bodies, imports/exports removed; repository config merge, I/O, stats, platform and global helpers mocked; no real repository call',candidate:baseline,local_only_prune_false:localOnly,global_prune_false:globalOff,assertions:'PASS',limit:'Not the installed GitHub App; app version and global options unknown'};
  fs.writeFileSync(fixture+'/disabled-cleanup-results.json',JSON.stringify(output,null,2)+'\n');
  console.log(JSON.stringify(output,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
```

### Résultats complets de la fixture

```json
{
  "version": "44.155.7",
  "method": "Published JS function bodies, imports/exports removed; repository config merge, I/O, stats, platform and global helpers mocked; no real repository call",
  "candidate": {
    "result": {
      "res": "disabled-by-config"
    },
    "events": [
      [
        "updatePr",
        "closed"
      ],
      [
        "deleteBranch",
        "renovate/mock-existing"
      ]
    ]
  },
  "local_only_prune_false": {
    "result": {
      "res": "disabled-by-config"
    },
    "events": [
      [
        "updatePr",
        "closed"
      ],
      [
        "deleteBranch",
        "renovate/mock-existing"
      ]
    ]
  },
  "global_prune_false": {
    "result": {
      "res": "disabled-by-config"
    },
    "events": []
  },
  "assertions": "PASS",
  "limit": "Not the installed GitHub App; app version and global options unknown"
}
```

### Sortie du validateur officiel

```text
 WARN: RE2 not usable, falling back to RegExp: regex validation may be inaccurate
       "err": {
         "code": "MODULE_NOT_FOUND",
         "requireStack": [
           "/workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/re2/re2.js",
           "/workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/renovate/dist/expose.js"
         ],
         "message": "Cannot find module './build/Release/re2.node'\nRequire stack:\n- /workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/re2/re2.js\n- /workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/renovate/dist/expose.js"
       }
       Error: Cannot find module './build/Release/re2.node'
       Require stack:
       - /workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/re2/re2.js
       - /workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/renovate/dist/expose.js
           at Module._resolveFilename (node:internal/modules/cjs/loader:1517:15)
           at wrapResolveFilename (node:internal/modules/cjs/loader:1071:27)
           at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1095:10)
           at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1122:12)
           at Module._load (node:internal/modules/cjs/loader:1294:5)
           at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
           at Module.require (node:internal/modules/cjs/loader:1617:12)
           at require (node:internal/modules/helpers:153:16)
           at Object.<anonymous> (/workspace/renovate-pause-npm-cache/_npx/f45526f69fea28f5/node_modules/re2/re2.js:4:13)
           at Module._compile (node:internal/modules/cjs/loader:1872:14)
 INFO: Validating /workspace/renovate-pause-20261015/renovate.json as repo config
 INFO: Config validated successfully against 1 file(s)
```
