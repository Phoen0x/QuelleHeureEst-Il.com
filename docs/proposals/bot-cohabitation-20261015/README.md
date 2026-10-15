# Cohabitation Dependabot / Renovate — proposition inactive du 15 octobre 2026

FR : Ce dossier remplace l'orientation de suspension globale de #162. Il prépare les deux outils actifs, sans appliquer un changement de périmètre à main. Les configurations candidates sont hors des emplacements actifs. L'ancienne proposition enabled=false est conservée intégralement dans l'historique.

EN: Inactive proposal replacing #162's global suspension. Both tools remain intended to run. No new ownership configuration is deployed to main; previous variants are archived intact.

## Décision et limites

**Déploiement bloqué tant que la conservation intégrale des huit PR/branches et la coordination des correctifs de sécurité ne sont pas validées.** Un test du nettoyage seul ne prouve pas l'immuabilité de toutes les métadonnées/branches dans le worker complet ni dans l'app installée.

L'utilisateur a demandé d'étudier notamment Dependabot pour npm/Actions et Renovate pour Cargo. La recommandation préparée réserve les **versions Cargo** à Renovate mais garde **tous les correctifs de sécurité dans Dependabot**, y compris Cargo. Cette exception évite de désactiver une couverture transitive avant preuve de son remplacement. Une question facultative a été présentée à l'utilisatrice ; faute de réponse lors de la préparation, ce profil reste une recommandation **inactive**, pas une décision de déploiement.

Les anciens chevauchements doivent être conservés comme historiques. Une configuration d'écosystèmes ne fournit pas une transaction inter-bots : une mise à jour Cargo ordinaire peut aussi viser le correctif que Dependabot propose en urgence. Aucun engagement de « zéro nouveau doublon » n'est pris sans coordination supplémentaire validée.

## État source vérifié

| Référence | SHA |
|---|---|
| main | 235194a6fe825a6dac27012f07cbac2cc5d86794 |
| #153, branche chore/ci-phase1-reliability-20261013 | 0ebc167c8febf1b61752d1114f8135a59400c5f1 |
| #162 avant ce travail, branche chore/pause-renovate-preservation-20261015 | d4f67fe4b3af62e3261fc7c35e33c9dfae6addfc |

#153 et #162 sont ouvertes et non fusionnées ; #162 est un brouillon. main utilise config:recommended pour Renovate et des limites Dependabot à 0. Le commentaire historique « 0 = illimité » est incorrect : il bloque les PR de versions, pas celles de sécurité.

AGENTS.md de #153, .github/README.md et .bolt/prompt ont été lus. AGENTS.md est absent de main au relevé précédent. Les instructions de conservation sont maintenues. Ni les configurations propres aux IDE/agents ni les données applicatives ne sont normalisées ou nettoyées.

## Matrice de responsabilités proposée

| Écosystème / fonction | Dependabot | Renovate | Contrôle nécessaire |
|---|---|---|---|
| JavaScript / pnpm : versions | Responsable exclusif | Manager npm exclu | pnpm 8.15.9 après #153, conservation des variantes et verrous npm historiques |
| GitHub Actions : versions | Responsable exclusif | Manager github-actions exclu | Préserver auto-approve.yml ; contrôler les paths y compris lors des mises à jour de sécurité |
| Rust / Cargo : versions | Limite de versions à 0 | Responsable exclusif, manager cargo | Lock --locked, dépendances historiques/optionnelles et deux rétroports GLib |
| JavaScript / Actions : correctifs de sécurité | Responsable | Pas de PR de remédiation Renovate | Alertes et services GitHub doivent rester activés |
| Cargo : correctifs de sécurité | Responsable recommandé, y compris transitifs | Versions ordinaires seulement | Coordination avec une éventuelle PR Cargo ordinaire déjà ouverte |
| Alertes GitHub / RustSec / audits / CodeQL | Surveillance inchangée | Aucun état d'alerte modifié | Aucun ignore d'advisory ni seuil modifié |
| Merges | Décision humaine après CI | automerge et platformAutomerge false | Ne pas confondre approbation automatique existante et fusion |

Les [candidats Renovate](renovate.candidate.json) et [Dependabot](dependabot.candidate.yml) constituent la source commune à utiliser pour la future harmonisation de #153 et #162, après validation. Ils ne sont pas copiés dans leurs emplacements actifs dans cette mission.

### Pourquoi ne pas ignorer Cargo dans Dependabot ?

La documentation officielle indique Cargo compatible avec les mises à jour de sécurité et indique que l'option ignore affecte aussi ces mises à jour. Le code officiel IgnoreCondition.ignored_versions renvoie explicitement les versions ignorées en mode sécurité ; une plage générale pourrait donc neutraliser les remédiations Cargo. **Aucune ignore de dépendance/version n'est proposée.**

Le seul open-pull-requests-limit:0 ne bloque pas ces PR de sécurité : elles disposent d'une limite séparée. Omettre Cargo du YAML ne démontre pas non plus que GitHub n'en proposerait aucune sur le graphe de dépendances.

Les indicateurs Renovate vulnerabilityAlerts.enabled=false et osvVulnerabilityAlerts=false du candidat désignent ici **le producteur de PR de remédiation Renovate**, pas la désactivation des alertes GitHub, RustSec, CodeQL ou cargo audit. Ils sont inactifs tant que le profil n'est pas déployé. La couverture Dependabot doit être confirmée avant tout transfert ; aucune permission/règle de sécurité n'est modifiée.

Une variante « Renovate possède toute la sécurité Cargo » reste à étudier si choisie : ne pas désactiver Dependabot Cargo avant preuve de détection et remédiation équivalentes. OSV côté Renovate documente une couverture des dépendances **directes** ; cela ne suffit pas à garantir la couverture de tout Cargo.lock. La présence d'un mapping rust→crate pour les alertes GitHub n'est pas, à elle seule, une preuve de remédiation de tous les transitifs ni des migrations contraintes comme h2.

## Horaires et limites réelles

- Dependabot npm : 07:00, Europe/Paris, daily.
- Dependabot GitHub Actions : 08:00, Europe/Paris, daily.
- Entrée Cargo Dependabot : 06:00 Europe/Paris pour la configuration ; la limite de versions reste à 0.
- Renovate Cargo : cron **`* 18-22 * * *`**, Europe/Paris, soit 18:00 inclus jusqu'à 23:00 exclu, tous les jours.
- updateNotScheduled=false limite les mises à jour ordinaires hors fenêtre ; rebaseWhen=never réduit la réécriture automatique, sans constituer une garantie de gel des corps/titres/labels d'anciennes PR.
- La schedule Renovate est une fenêtre d'autorisation, **pas un déclencheur**. L'exécuteur doit réellement passer pendant la fenêtre. Aucun ordre strict, durée maximale ou absence de chevauchement avec un job Dependabot en retard n'est garanti.
- Dependabot daily concerne les jours ouvrés selon la référence GitHub ; les remédiations de sécurité ne sont pas contraintes à ce planning.
- Les correctifs de sécurité Renovate, si une autre variante les activait, peuvent ignorer schedule/quotas : ne pas les retarder artificiellement pour respecter la fenêtre.
- Les tests de l'implémentation publiée vérifient 17:59, 18:00, 22:59 et 23:00 en hiver, été, et les deux jours de changement d'heure 2026. Aucun passage réel du service à ces horaires n'est revendiqué.

## Les huit PR Renovate : examen et conservation

Les heads et noms de branches exacts sont conservés dans [legacy-prs.json](legacy-prs.json). Aucune n'est fermée, modifiée, réécrite ou commentée par cette mission.

| PR | Analyse des différences | Risque constaté / décision |
|---|---|---|
| [#155](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/155) | PostCSS SECURITY ; package-lock.json et pnpm-lock.yaml | Le lock npm perd 84 noms dont 51 optionnels ; chevauchement de paquet avec Dependabot #146. Conserver la PR et comparer les correctifs manuellement. |
| [#156](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/156) | Vite ^8.0.16 → ^7.3.5, titre v7.3.7 ; pnpm-lock modifié | Retour de version et coexistence avec plugin-react 6 à revoir ; aucune importation. |
| [#158](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/158) | eslint ; deux locks | Même perte npm de 84 noms / 51 optionnels ; pas de validation de conservation. |
| [#159](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/159) | autoprefixer ; deux locks | Même perte npm ; ne pas interpréter un lock npm parallèle comme jetable. |
| [#160](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/160) | react-refresh ^0.4.11 → ^0.5.0 ; package et deux locks | Même perte npm ; vérifier compatibilité ESLint, pas de modification ici. |
| [#161](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/161) | lucide-react ^0.344.0 → ^0.577.0 ; package et deux locks | Même perte npm ; changement avant 1.0 à tester. |
| [#163](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/163) | typescript-eslint ; deux locks | Même perte npm ; chevauchements ESLint possibles à qualifier par version/paquet. |
| [#164](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/164) | src-tauri/Cargo.toml : chrono-tz 0.8 → 0.10 | Mise à jour Cargo qui resterait dans le périmètre Renovate. Son gel intégral reste un point bloquant, même sans nettoyage. |

Ces chiffres sont obtenus par comparaison des noms de paquets dans les fichiers npm complets au head immuable de chaque PR et dans main ; il s'agit de pertes de **représentation dans ce lock**, pas d'une preuve que chaque package était compilé/utilisé ni que tous les autres locks perdent les mêmes noms. Les listes complètes sont dans [pr-name-differences.json](pr-name-differences.json). Aucun résultat n'autorise leur suppression.

Les différences pnpm ont également été examinées via les patches de tous les fichiers de ces PR ; aucun install ni re-résolution du projet n'est lancé. La mission ne certifie pas la compilabilité de ces propositions.

## Nettoyage et modification des PR historiques : résultat et arrêt

Changer enabledManagers vers cargo peut rendre les anciennes branches npm orphelines pour Renovate. Le comportement par défaut peut fermer leurs PR et supprimer les branches. Dans le test isolé du code publié, on retire intentionnellement les huit branches de la liste souhaitée : **8 fermetures et 8 suppressions simulées** apparaissent avec le nettoyage par défaut. Avec pruneStaleBranches=false, **aucun appel de fermeture/suppression/commentaire** n'est fait dans cette fonction.

Cela diffère du risque déjà trouvé dans #162 : enabled=false interrompait l'initialisation et pouvait perdre l'option locale avant le nettoyage. Le nouveau candidat reste enabled=true et ne prend pas ce chemin volontairement.

**Mais cette vérification ne couvre pas tout le worker ni la version de l'app installée.** Elle ne garantit pas que la PR Cargo #164 ne recevrait aucun nouveau corps/titre/label ni changement de branche par un autre chemin. rebaseWhen=never ne remplace pas une preuve de gel intégral.

**Opération arrêtée avant application du périmètre.** Il faut obtenir et tester un mécanisme côté exécuteur qui interdit les écritures sur ces huit numéros et refs, avec replay complet des fonctions réseau et vérification de zéro requête PATCH/merge/close/DELETE/push les visant. Un changement de branchPrefix n'est pas une solution validée : il peut recréer des PR et modifier la reconnaissance des anciennes branches. Aucun préfixe n'est modifié dans le candidat.

Il faut également une coordination capable de détecter les propositions inter-bots par écosystème, paquet et version/lockfile, avant création si l'objectif impose zéro nouveau doublon. Un check en lecture seule peut rendre un doublon visible et bloquer sa fusion s'il est requis, mais **n'empêche pas sa création**. Les configurations natives seules et leurs horaires ne fournissent pas de verrou partagé ni de mécanisme de gel intégral des anciennes PR.

## Harmonisation avec #153 et #162

1. L'ancienne configuration enabled=false de #162 est archivée par son blob exact et commit source, puis la configuration active de sa branche est remise **à l'identique de main**. Ainsi #162 cesse de proposer une suspension globale.
2. Les anciennes configurations Renovate/Dependabot de #153 et la description antérieure de #162 sont préservées dans docs/history/bot-cohabitation-20261015. Les archives antérieures restent intégrales.
3. Les deux PR doivent pointer vers ce **même profil inactif et les mêmes résultats**. Aucune configuration active de #153 n'est remplacée par un candidat dont le gel des PR et la coordination sécurité ne sont pas validés.
4. Lors d'une future intégration, l'ancien enabled=false de #153 ne doit pas écraser aveuglément le profil cohabitation ; la résolution doit être explicite, archivée et relue. Aucun merge, rebase ou résolution automatique n'est fait ici.
5. Les paramètres de conservation, limites de PR et exclusions historiques de #153 sont repris dans le candidat ; seule la répartition, le fuseau et les comportements explicitement décrits changent. Le YAML initial avec ses commentaires et son BOM est archivé intégralement.

## Validations et portée

- JSON Renovate, schéma officiel et **renovate-config-validator 44.155.7 --strict --no-global** : réussite locale, Node 24.19.0. Le warning RE2/RegExp reste visible ; aucun motif regex ne figure dans le candidat.
- YAML Dependabot et schéma **communautaire SchemaStore**, blob 1184c6f768ae117c3f4ea7cf3e1dca6d5e7fe76a : réussite Python locale. Ce schéma n'est pas présenté comme un validateur officiel GitHub.
- Implémentations publiées de schedule et prune : tests locaux réussis ; dépendances de calendrier réelles, heure simulée, appels plateforme/Git entièrement simulés, aucune écriture réelle sur le dépôt/GitHub.
- Un nouveau workflow de validation à permissions **contents:read seulement**, limité à la branche #162 et aux fichiers de proposition, vérifie à nouveau les candidats en copies temporaires. Il ne lance jamais Renovate contre le dépôt ni un updater Dependabot.
- Il exécute le parseur officiel **dependabot-core au commit abffc3c9512f572b6bfc36202442975efb700ea3**, avec ses trois fichiers Ruby vérifiés par blob SHA, ainsi que le validateur Renovate officiel. **Le résultat CI doit être lu après exécution ; sa seule présence n'est pas un succès.**
- Le parseur officiel ne prouve ni l'acceptation du service hébergé ni le support de toutes ses options dans tous les déploiements. La validation du service réel et ses paramètres administratifs demeurent à confirmer.
- Ruby est absent localement. L'helper Node du schéma communautaire a d'abord échoué faute d'Ajv dans l'outil ; le workflow installe explicitement Ajv 8.17.1 et js-yaml 4.1.1 dans son environnement privé. Aucun paquet du projet n'est ajouté/remplacé. L'échec initial n'est pas un succès revendiqué.
- Aucun build Rust/JS, audit de dépendances ou validation Android/StackBlitz/Cursor/Claude n'est refait pour ces documents et fixtures. Les CI/audits existants restent requis, avec leurs échecs connus ; aucun seuil, ignore, licence ou workflow de sécurité existant n'est modifié.

## Plan de déploiement sans perte

1. Conserver ce travail au stade de proposition, les huit PR/refs figées et les bots actuels non modifiés sur main.
2. Valider les candidats et lire le job de cette branche ; documenter les versions réellement utilisées. Tester un replay complet du worker avec les huit PR, y compris #164, et aucune écriture vers leurs identifiants/refs.
3. Confirmer l'activation des alertes et remédiations Dependabot sur les trois écosystèmes, les droits de lecture nécessaires et la couverture Cargo transitive. Ne pas désactiver un producteur de sécurité avant preuve du relais.
4. Définir le traitement des chevauchements historiques sans fermeture/suppression et valider la coordination des nouvelles propositions. Ne pas automatiser de commentaire/renommage sur ces huit PR.
5. Intégrer les garde-fous de #153 par décision humaine et vérifier qu'ils sont réellement présents et passent sur main : builds debug/release --locked, tests, Clippy, audits, contrôle des dépendances/options/archives et h2/deux rétroports GLib. Le système d'approbation automatique reste inchangé.
6. Préparer une modification d'activation unique reprenant exactement les candidats alors validés, avec archive des versions remplacées et résolution explicite des variantes #153/#162. Aucun déploiement partiel « Renovate limité / sécurité non relayée ».
7. Faire relire et décider la fusion par la propriétaire, sans automerge. Après fusion, lire les logs des deux services et comparer à nouveau les huit PR/heads/refs et les dépendances/locks à leurs références.
8. Maintenir les contrôles stricts et le gel des anciennes PR jusqu'à décision humaine explicite ; une réactivation future de leurs mises à jour serait une autre demande.

## Preuves et références

- [Référence officielle Dependabot](https://github.com/github/docs/blob/main/content/code-security/reference/supply-chain-security/dependabot-options-reference.md) : schedule, ignore, limites et options de sécurité sont distinguées par icônes.
- [Support des écosystèmes](https://github.com/github/docs/blob/main/data/reusables/dependabot/supported-package-managers.md) : Cargo possède un support Security updates.
- [IgnoreCondition officiel](https://github.com/dependabot/dependabot-core/blob/abffc3c9512f572b6bfc36202442975efb700ea3/common/lib/dependabot/config/ignore_condition.rb) : versions ignorées en mode sécurité.
- [Options Renovate 44.155.7](https://github.com/renovatebot/renovate/blob/44.155.7/docs/usage/configuration-options.md) : schedule, updateNotScheduled, pruneStaleBranches, rebaseWhen, vulnerabilityAlerts, OSV.
- [Nettoyage Renovate](https://github.com/renovatebot/renovate/blob/44.155.7/lib/workers/repository/finalize/prune.ts).
- [Fixtures et résultats](behavior-results.json), [test inactif](test-behavior.cjs.txt), [parseur Ruby inactif](test-dependabot.rb.txt), [preuves de provenance](evidence.json).

**Verdict : configurations préparées et validation ciblée disponible ; déploiement volontairement bloqué jusqu'à preuve de conservation intégrale et coordination des correctifs.** Aucune dépendance, PR historique, permission, alerte, règle de sécurité, politique de licence ou approbation automatique supprimée/affaiblie. Aucune fusion.

## English — secondary

The inactive shared proposal assigns npm/Actions version updates to Dependabot and Cargo versions to Renovate, while recommending Dependabot keep all security-fix PRs, including transitive Cargo dependencies. Renovate's 18:00–23:00 Europe/Paris schedule, DST boundaries and isolated pruning guard are tested; scheduling is not a trigger or a cross-bot lock.

The eight legacy PRs are examined and remain unchanged. Six npm locks lose 84 package names including 51 optional names; Vite is proposed back to 7 and chrono-tz to 0.10 in the other two PRs. Default cleanup is dangerous. Disabling pruning in its normal path does not prove that every other worker path leaves legacy Cargo PR #164 untouched. Full worker/app write-free replay and inter-bot security coordination remain deployment prerequisites.

#162's previous global-disable variant is archived and its active branch config restored exactly to main. #153's active proposal is preserved; both PRs reference these shared inactive candidates rather than silently overwriting historical variants. No dependency/lockfile/security-policy/licence/approval-workflow change, alert dismissal or PR merge/closure.

