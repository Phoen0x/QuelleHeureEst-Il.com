# Validation Rust dédiée après #176

## Source et portée

La branche `ci/rust-validation-176` part exactement de `3e1f4177d2c1417b62121559ec9f39e8ca342394` et cible la branche `fix/rust-tauri2-shell-feature` de [#176](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/176). Les 88 fichiers de cette source, dont le workflow Rust, les manifestes, les verrouillages et les sources applicatives, doivent conserver leurs blobs et modes Git.

La mission ajoute uniquement le workflow `rust-validation-176.yml`, son contrôleur `check.py` et ce rapport. Aucun correctif applicatif supplémentaire, changement de dépendance ou de configuration des bots n'est autorisé. Les règles IA de #175 sont lues depuis cette PR, car elles restent absentes de la branche source au relevé.

## Prérequis repris de #153

Référence : [workflow Rust de #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/.github/workflows/rust.yml), blob `30d920b4c6c73f5e1dc3b1d43123fb7893f38d75`.

Le runner est Ubuntu 22.04. La liste reprise est : `build-essential`, `libwebkit2gtk-4.1-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`, `patchelf`, `libssl-dev`, `libxdo-dev`. GLib >= 2.70 est vérifié avec `pkg-config` avant compilation. Les versions système et Rust effectivement présentes sont enregistrées ; l'image GitHub et ses paquets ne sont pas figés bit pour bit.

Les étapes frontend, les fichiers Tauri corrigés, le verrou Cargo, les dépendances migrées et les autres changements de #153 ne sont pas importés. Un éventuel défaut révélé après les prérequis doit rester visible.

## Exécution et conservation

Le workflow se déclenche sur `pull_request` ciblant uniquement la branche de #176, avec `contents: read`, sans secret supplémentaire ni persistance des identifiants Git. Checkout et upload-artifact sont épinglés à des commits. Le head exact, la base #176, les arbres Git et les octets du checkout sont contrôlés avant l'exécution.

Les commandes travaillent sur une copie temporaire des fichiers vérifiés. La source #176 ne contient pas de `Cargo.lock` racine : `cargo generate-lockfile` le crée uniquement dans cette copie et l'archive immédiatement. Les quatre commandes partagent ce verrou et utilisent `--locked` :

1. `cargo build --workspace --locked --verbose`
2. `cargo test --workspace --locked --verbose`
3. `cargo build --workspace --release --locked --verbose`
4. `cargo test --workspace --release --locked --verbose`

Chaque commande est tentée même si une commande précédente échoue, dès lors que les prérequis et la résolution ont réussi. Aucun `continue-on-error`, aucune modification de fonctionnalité ou de configuration ne rend les résultats verts. Un échec conserve son statut. Les commandes Cargo sont bornées à 900 secondes chacune et le job à 45 minutes ; les téléchargements ont leurs propres délais et une seule répétition réseau autorisée.

Après exécution, les fichiers du checkout et de la copie sont comparés aux empreintes initiales ; le verrou temporaire doit rester identique. Le bilan échoue si une commande obligatoire échoue, est ignorée ou n'a pas de preuve. Les journaux, les versions, le verrou et les contrôles sont publiés en artifact pendant 14 jours, même après échec.

## Résultats et limites

Les résultats effectivement obtenus, le SHA livré et les liens du run, du job et de l'artifact sont consignés dans la description de la nouvelle PR. Aucun résultat de #153 n'est attribué à cette validation. Une commande `cargo test` lancée mais arrêtée pendant la compilation n'exécute aucun test unitaire : cette distinction doit rester explicite.

Ce protocole ne garantit pas un build complet avant exécution. La résolution initiale dépend de l'index Cargo au moment du run ; l'artifact conserve le verrou exact pour une reproduction ultérieure. Les contrôles documentaires locaux ne remplacent pas les compilations CI. Android, interfaces graphiques, fonctionnement offline et audits de sécurité ne sont pas validés par cette mission.

ChatGPT doit auditer indépendamment le diff au head exact, les 88 fichiers conservés, la liste des prérequis, les commandes réellement lancées et leurs journaux, le verrou temporaire et les contrôles de conservation. Tout défaut applicatif suivant sera traité dans une mission distincte. Aucune fusion autorisée.
