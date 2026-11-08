# Correctif ciblé du manifeste Tauri 2

## Origine et réutilisation

Base : `main` au SHA `235194a6fe825a6dac27012f07cbac2cc5d86794`. Le job Rust de [#175](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/175) échoue avant compilation : `tauri ^2.0` ne fournit pas la fonctionnalité `shell-open` demandée par `src-tauri/Cargo.toml`.

Ce correctif n'est pas une nouvelle conception. Il reprend la correction déjà réalisée dans [le commit 4e126a1 de #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/4e126a1265931c4032d6b31d06886d4acface5ea), puis la conservation de la déclaration historique documentée dans [DEPENDENCY_GAPS_20261013.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/DEPENDENCY_GAPS_20261013.md#tauri-shell-open). #153 reste non fusionnée ; son périmètre comprend d'autres changements qui ne sont pas importés ici.

La recherche GitHub et la lecture des PR ouvertes ont été effectuées avant modification. #169 porte sur les versions JavaScript de Tauri et ne corrige pas cette déclaration Cargo. Aucune de ces PR n'est modifiée ou fusionnée.

## Usages et conservation

La revue des points d'entrée Rust, des services et composants TypeScript/React, de `package.json` et de `tauri.conf.json`, complétée par une recherche de `shell`, `opener`, `window.open`, des plugins et des appels d'ouverture, n'a trouvé aucun usage applicatif de shell/opener. Les appels HTTP sont des clients de données, les `setOpen` sont l'état de recherche et `open_devtools()` ouvre les outils de développement en debug. Cela ne démontre pas l'absence universelle d'un comportement indirect.

La déclaration historique entière reste commentée dans le manifeste, avec commentaires français puis anglais. Tauri conserve la contrainte `2.0`, ses fonctionnalités par défaut et `custom-protocol`. Aucune dépendance n'est supprimée ou migrée ; aucun plugin shell/opener ni aucune permission n'est ajouté sans besoin fonctionnel établi. Les autres sources, configurations, archives et verrous existants restent identiques à la base.

## Vérification et portée

- Contrôles locaux : parsing TOML avec Python 3.12.14 ; comparaison structurelle avant/après garantissant les mêmes dépendances et versions et la seule différence active `tauri.features = []` ; présence de la déclaration historique ; `git diff --check`.
- Preuve historique distincte : [CI Rust de #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38644691084/job/116128530473), au SHA `0ebc167c8febf1b61752d1114f8135a59400c5f1`, compilation debug/release et tests réussis. Ces résultats ne valent pas validation de la présente branche : #153 contient aussi des adaptations de sources, configuration, dépendances et environnement CI.
- Les résultats des commandes Rust réellement tentées et les contrôles GitHub au SHA livré sont consignés dans la description de la PR. Un échec ultérieur à la résolution ne doit pas être masqué ni assimilé à un build réussi.

La machine de travail ne dispose initialement ni de `rustc` ni de `cargo`. L'accès Docker local a d'abord été refusé ; une demande de montage du socket a échoué dans le bac à sable avant exécution (`Not a directory`). Le contrôle explicite du socket avec permission réseau a ensuite réussi (Docker 28.4.0). Cela établit un accès alternatif fonctionnel, sans prétendre résoudre la cause du premier refus. Les accès réseau de préparation sont bornés et les commandes interrompues sont vérifiées avant reprise.

## Limites et relais

Cette PR corrige la cause identifiée de résolution Cargo. La réussite complète du build, des tests, du packaging Android ou de l'exécution graphique ne peut être affirmée sans preuves au SHA livré. Les autres défauts préexistants révélés par la compilation doivent être signalés, sans reprendre aveuglément toute la PR #153 ni modifier les protections CI ou alertes.

ChatGPT doit comparer le diff à la base exacte, contrôler la conservation des dépendances et de la variante historique, examiner les résultats Rust au head livré et distinguer ce portage ciblé des preuves historiques de #153. Aucune fusion autorisée. Les règles IA proposées dans #175 restent absentes de `main` au relevé de cette mission.
