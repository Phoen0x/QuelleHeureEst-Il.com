# Bots de dépendances : configuration et conservation — 13 octobre 2026

## Français

Dependabot est configuré pour **pnpm, Cargo et GitHub Actions**. Renovate reste explicitement **désactivé** afin d'éviter deux producteurs concurrents de mises à jour. Un nouveau contrôle de conservation examine toutes les PR, quel que soit leur auteur ; les auteurs Bot et branches dependabot/renovate ont en plus un périmètre de fichiers borné.

Ces changements sont préparés sur #153, pas encore actifs comme configuration des bots sur main. Aucun merge, aucune fermeture de PR, aucune modification de l'approbation automatique, des workflows de sécurité ou de la politique de licences.

### État observé et mécanismes audités

| Mécanisme | État observé avant cette mission | Décision |
| --- | --- | --- |
| Dependabot npm | Racine, quotidien, limite 10, groupe minor/patch ; ancien verrou npm encore présent avec pnpm | Garder npm comme valeur d'écosystème officielle de pnpm ; déclarer pnpm@8.15.9 et exclure les verrous npm historiques des mises à jour de versions |
| Dependabot Cargo | Aucune entrée | Ajouter Cargo à la racine du workspace et de Cargo.lock, limite 5 |
| Dependabot Actions | Quotidien, limite 5, groupe minor/patch | Conserver le dispositif ; exclure les archives et le workflow d'approbation des mises à jour de versions |
| Renovate | PR d'onboarding #154 ouverte, config:recommended proposée, aucun fichier actif sur la branche initiale | Ajouter un profil désactivé ; pas de mise à jour ou de fusion de #154 |
| lockfile-maintenance.yml | workflow_dispatch uniquement, permissions contents:read, candidat exporté en artefact | Inchangé ; pas de push ni de PR automatique |
| js-security-maintenance.yml | workflow_dispatch uniquement, candidat et audits exportés | Inchangé ; attention au manifeste/versions figés dans son générateur historique |
| Autres automatismes | Trois PR ai-findings-autofix observées, scripts Windows historiques ; aucun fichier de configuration Snyk/Depfu/Updatecli détecté | Aucun changement ni suppression ; absence de fichier ne prouve pas l'absence d'app externe |

Neuf PR Dependabot JS étaient ouvertes au relevé, plus l'onboarding Renovate #154. Le type version/sécurité de chacune n'a pas été certifié ; on ne déduit donc pas une occupation des plafonds de versions du seul nombre total. Les réglages et installations d'applications externes ne sont pas intégralement accessibles dans ce contexte.

### Déclencheurs, plafonds et gestionnaires

| Écosystème Dependabot | Répertoire | Horaire quotidien configuré | Plafond de PR de versions |
| --- | --- | --- | --- |
| Cargo | / | 06:00 UTC | 5 |
| JavaScript/pnpm, valeur npm | / | 07:00 UTC | 10 |
| GitHub Actions | / | 08:00 UTC | 5 |

Les groupes minor/patch ne couvrent que version-updates. Ils ne prouvent pas une compatibilité ABI/API : notamment, une hausse minor d'un paquet Rust 0.x peut imposer une migration. Les mises à jour major ne sont pas ignorées et nécessitent leur propre revue. Aucun ignore de version, de paquet vulnérable ou d'advisory n'est ajouté.

Selon la [référence Dependabot](https://github.com/github/docs/blob/main/content/code-security/reference/supply-chain-security/dependabot-options-reference.md), les PR de sécurité ont un plafond distinct fixe de **10**, non réglable par open-pull-requests-limit. Le planning quotidien et ces plafonds ne garantissent ni l'heure d'exécution effective ni l'ouverture de toute PR : erreurs de résolution, credentials, quotas et PR déjà ouvertes peuvent bloquer le service.

Les options exclude-paths sont marquées **Version updates only** dans cette référence. Elles protègent les scans de versions, mais ne constituent pas une garantie universelle pour les PR de sécurité. Le contrôle CI vise aussi les PR de sécurité et les autres auteurs.

pnpm est pris en charge par Dependabot sous package-ecosystem: npm ; une valeur pnpm serait invalide. package.json indique désormais **packageManager: pnpm@8.15.9**, cohérent avec les CI existantes et le verrou v6. Tous les autres champs du manifeste sont identiques à leur version initiale. En présence des verrous multiples historiques, le champ et les exclusions améliorent la sélection du gestionnaire, sans promettre qu'un service de sécurité ne touchera jamais un ancien verrou. Une telle modification est détectée par la conservation CI.

Cargo utilise la racine /, car le workspace et Cargo.lock y sont définis. docs et vendor sont exclus des recherches de versions afin de ne pas traiter des variantes archivées ou le paquet tiers rétroporté comme des projets à moderniser séparément. Cela ne supprime aucun paquet de la résolution active.

### Renovate et coordination

renovate.json est validé par le validateur officiel **44.155.7**. Il déclare enabled:false et automerge:false. Les seuls managers prévus sont npm, cargo et github-actions, avec des exclusions des archives, vendor, node_modules et anciens verrous npm. Les plafonds de profil sont 5 PR simultanées et 2 par heure ; lockFileMaintenance est désactivé.

**Aucune PR Renovate de dépendance n'est attendue tant que le profil reste désactivé.** Ces plafonds sont une préparation de profil, pas la preuve d'un service Renovate actif. Pour basculer ultérieurement, il faudra revoir la coordination : mettre les plafonds Dependabot de versions à zéro ne désactive pas ses PR de sécurité. Il faut donc également éviter le chevauchement de producteurs de PR de sécurité.

La proposition config:recommended de #154 est conservée comme référence dans docs/history/dependency-bots-20261013/renovate-PR154-proposal.json. #154 reste ouverte ; son éventuelle adoption ultérieure peut entrer en conflit avec ce profil. Les réactions futures du service d'onboarding une fois une configuration adoptée sur main ne sont pas contrôlées par cette PR.

### Contrôle de conservation

Le nouveau workflow dependency-preservation.yml est séparé des workflows existants. Il se déclenche sur les PR vers main : opened, synchronize, reopened et ready_for_review. Il n'a que contents:read, ne conserve pas les credentials du checkout, ne demande aucun secret et n'installe pas les dépendances de l'application. Le parseur YAML est isolé, sans dépendance applicative ajoutée. Le validateur Renovate est installé temporairement par pnpm.

Scripts/check-dependency-update-preservation.py vérifie :

- maintien des noms dans dependencies, devDependencies, optionalDependencies et peerDependencies JS, des peers optionnels et références patchedDependencies ;
- maintien des dépendances Cargo dans les groupes root/workspace/target/dev/build, des identités d'origine, flags optional/default-features, features précédentes, features de production par défaut et exclusions du workspace ;
- maintien des noms de paquets Cargo.lock et des noms, variantes optionnelles, liens optionnels et peers optionnels du verrou pnpm ; changement de format refusé ;
- aucune suppression de fichier de la référence ; anciens package-lock*.json et fichiers docs/history ou propositions historiques inchangés octet pour octet ;
- aucun nouveau verrou concurrent yarn/npm-shrinkwrap/bun ou package-lock généré, et pnpm 8.15.9 conservé comme gestionnaire ;
- rejet des clés JSON/YAML dupliquées et des symlinks sur les fichiers parsés, sans interpréter les anciens verrous npm volontairement conservés tels quels.

Pour les PR identifiées Bot ou branches dependabot/renovate, les modifications de fichiers sont bornées aux manifestes/verrous actifs et configurations de bots. Les sources vendored, patchs et contrôleurs ne peuvent pas être réécrits par cette voie. Les workflows ne peuvent subir que des changements de références uses ; les commandes, déclencheurs et autres contenus sont conservés. Le workflow auto-approve.yml est entièrement interdit de modification par ce périmètre. Les nouveaux fichiers de bot sont limités à sa configuration ou à des archives.

Ces vérifications sont conservatrices : une disparition transitive légitime, une migration de source Cargo ou un changement de flags peut être refusé et doit être examiné plutôt que supprimé silencieusement. Elles ne rendent pas une nouvelle version sûre ou compatible. Les installations gelées, builds, tests et audits existants restent nécessaires.

### Amorçage limité et écarts antérieurs

Le premier contrôle contre la vraie base de #153, **c39a87e1d693382f34ca38bcaa68e032a9bcbc29**, a correctement relevé des écarts **antérieurs à cette mission** : 31 noms de paquets Babel, le peer optionnel vite/lightningcss et la feature Tauri shell-open. Ces écarts ne sont pas qualifiés comme de faux positifs du contrôle. Leur réactivation dans la résolution actuelle dépasserait cette mission et pourrait réintroduire une configuration Tauri incompatible.

Le verrou ancien est préservé dans docs/history/pnpm-lock.before-phase1-repair.yaml, identique au verrou de base utilisé dans le relevé de #138. La variante Cargo contenant shell-open reste dans docs/history/before-ci-phase1/src-tauri/Cargo.toml. Ces archives ne sont pas modifiées.

Le workflow autorise un **unique amorçage explicite** : seulement #153, seulement la base c39a87e, seulement si cette base ne possède pas encore le nouveau contrôleur. Il compare alors au commit immuable **c0169878bbd24ba28bc17c1886bb4eada464bf39**, état avant cette mission. Un avertissement visible annonce cet amorçage. Toute autre combinaison sans contrôleur de base échoue.

Après adoption du contrôleur sur la base, la comparaison utilise **la vraie base de chaque PR**, et le contrôleur est exécuté depuis cette base. Il n'existe pas d'exception permanente pour Babel, lightningcss ou shell-open. Ce premier succès vérifie la conservation pendant la mission bots ; il n'est pas une certification rétroactive de tout le diff main → #153.

### Cas réel #138 et PR existantes

La comparaison en lecture seule des verrous de base/head de #138 relève **84 noms de paquets absents**, dont **51 variantes optionnelles**, notamment les variantes Android esbuild et rollup. Les noms totaux passent de 288 à 240 ; le nombre de disparitions dépasse la différence nette car d'autres noms apparaissent.

Cela prouve des suppressions à examiner, pas que chacune est nécessairement injustifiée. Le nouveau contrôleur les détecterait, ainsi que la réécriture du verrou npm historique. Aucune correction, rebase, fermeture, fusion ou message n'a été envoyé à #138. Les autres PR existantes ne sont pas modifiées.

### Validation et limites effectives

Les changements exécutables ont été vérifiés sur **d6316a5a77f0b4a663996b3c1e6dd0911c2dfed4**. Le dernier ajout de documentation et de preuves ne change pas le contrôleur, les tests ou la configuration validés.

| Vérification | Résultat réellement observé | Preuve |
| --- | --- | --- |
| Contrôle de conservation, amorçage c016987 | Réussi ; avertissement d'amorçage visible | [Run 38450920280, job 115481284979](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920280/job/115481284979) |
| Régressions du contrôleur | **12 tests réussis**, couvrant versions conservées, suppressions JS/Cargo, optionnels, archives, Actions, doubles clés et symlinks | Même job |
| Validateur officiel Renovate 44.155.7, --strict | Réussi ; 7 avertissements de sous-dépendances dépréciées de l'outil temporaire restent visibles | [Job 115481284505](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920280/job/115481284505) |
| Schéma Dependabot SchemaStore | Validation locale réussie, options choisies vérifiées contre la référence GitHub | Source de schéma et documentation dans les preuves |
| Syntaxe YAML et compilation Python | Vérifications locales réussies | PyYAML et py_compile locaux |
| actionlint existant | Réussi | [JS/TS CI 38450920067, job 115481281742](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920067/job/115481281742) |
| Lint, typecheck, build Vite et conservation JS préexistante | Réussis, installation pnpm gelée | [Job 115481281391](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920067/job/115481281391) |
| Comparaison des manifestes JS de cette mission | Tous les champs préexistants identiques ; seul packageManager ajouté | Vérification locale JSON et arbres Git |
| Comparaison #138 | 84 noms / 51 noms optionnels disparus, sans modification de la PR | Relevé de verrous, preuves JSON |

La première variante YAML du nouveau workflow a échoué sur une commande non entourée de guillemets ; elle est archivée. La variante corrigée comparant directement à main a ensuite relevé les écarts anciens ci-dessus ; elle est aussi archivée. Le résultat final ne les efface pas et limite explicitement son amorçage.

Aucun moteur Dependabot/Cargo en service n'a été lancé manuellement : la validation concerne la syntaxe, les schémas, le contrôle et les CI, pas la promesse d'une future PR réellement produite par GitHub. Aucun test de planification réelle, accès registry privé ou réglage d'app n'a été simulé.

Les audits et leurs politiques sont inchangés. Les problèmes indépendants précédemment documentés restent hors de cette mission ; aucune suppression de dépendance, d'advisory ou de licence n'est utilisée pour faire passer ce contrôle.

Le check de conservation n'a pas été rendu obligatoire dans les réglages GitHub. Le ruleset Ægis visible demande une revue et protège contre suppression/force-push, sans règle de statut obligatoire dans la réponse consultée. L'endpoint de protection classique retourne 403 ; une protection supplémentaire ne peut donc être certifiée.

**Un check en échec rend la suppression visible, mais ne garantit pas à lui seul l'interdiction de fusion.** Il faut exiger ce check et protéger son workflow/contrôleur dans les réglages de branche. Ces réglages et l'approbation automatique ne sont pas changés ici.

Le contrôleur de base réduit la possibilité qu'une PR réécrive son propre script après amorçage, mais le workflow pull_request et les réglages du dépôt restent des éléments à protéger/revoir. L'amorçage exécute le nouveau contrôleur de #153 et nécessite la revue habituelle de cette première adoption. Les tests du contrôleur sont du code de PR, exécuté sans secrets ni permissions d'écriture.

Les noms/options comparés ne prouvent pas tous les comportements du code fantôme, la compatibilité d'une dépendance, le bon traitement de tout format futur ni l'absence de réactivation par une modification applicative humaine. Des comptes techniques non identifiés comme Bot peuvent échapper au périmètre de fichiers supplémentaire ; les contrôles de noms/options/archives restent appliqués à toutes les PR.

Les mises à jour de versions peuvent remplacer des versions dans les verrous actifs tout en gardant leurs noms/options. Les anciennes versions restent dans Git et dans les archives déjà conservées ; le contrôle n'archive pas automatiquement chaque nouveau verrou généré par un bot. Les verrous npm historiques restent physiquement intacts et ne deviennent pas le gestionnaire actif.

Les configurations Dependabot/Renovate seront effectives après adoption sur la branche par défaut et selon les réglages des services. Le workflow ne rétroactive pas les checks sur toutes les PR anciennes : elles devront recevoir un événement de PR après adoption. Aucun état d'alerte, workflow de sécurité, règle de licence ou approbation n'est modifié pour obtenir un résultat vert.

### Conservation du résultat

Entre le commit initial **c0169878bbd24ba28bc17c1886bb4eada464bf39** et le résultat final, **aucun fichier n'est supprimé**. Seuls deux fichiers préexistants sont modifiés : **.github/dependabot.yml** et **package.json**. Leurs versions antérieures sont archivées intégralement avec des blobs Git identiques.

Les nouvelles configurations/contrôleurs, leurs tests et variantes de travail sont ajoutés. Tous les workflows préexistants sont inchangés octet pour octet, y compris auto-approve, les workflows de sécurité et de maintenance. Tous les manifestes Cargo, Cargo.lock, pnpm-lock.yaml, anciens package-lock*.json, dépendances applicatives, options, code fantôme, patchs et archives précédentes sont conservés. Aucune PR existante n'est fusionnée ni fermée ; les seules écritures Git concernent la branche de #153, et le compte rendu est publié uniquement sur #153.

## English

Dependabot now declares pnpm through its npm ecosystem, Cargo at the workspace root and GitHub Actions, with explicit UTC schedules and version-PR caps. Existing dependency declarations and lockfiles are preserved. Renovate is explicitly disabled to avoid duplicate version-update producers; its onboarding PR remains untouched.

A separate read-only PR check detects dependency/optional-feature/name removal, historical lock/archive changes and out-of-scope bot edits. Twelve regression tests and the official Renovate validator are used. A single documented #153 bootstrap compares to the immutable pre-mission commit; subsequent checks use the actual PR base and its checker.

The protection is detection unless GitHub requires the check. Security PR caps/exclusions differ from version updates; installed app settings, workflow tampering and full ghost-code semantics are not universally controlled. The observed #138 lockfile removals and earlier phase-one differences remain documented rather than hidden or silently grandfathered into future checks. No PR was merged or closed, and existing security/approval workflows and licensing policy are unchanged.
