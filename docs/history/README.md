# Références historiques / Historical references

FR : Les fichiers sous `before-ci-phase1/` sont des copies intégrales du commit de base `c39a87e1d693382f34ca38bcaa68e032a9bcbc29`. Ils conservent les commentaires, les variantes de configuration et le code remplacés par les corrections de la PR 153. `pnpm-lock.before-phase1-repair.yaml` conserve le verrouillage incohérent de la branche avant réparation. Ne pas supprimer ni réactiver automatiquement ces références.

Ces fichiers ne sont ni des workflows actifs, ni des membres du workspace Cargo, ni des entrées Vite ou des fichiers sous `public/`. Ils restent hors des bundles et exécutables. Le build natif embarque seulement `dist/`. Les imports historiques neutralisés restent en commentaires dans les sources actives ; les outils de développement restent derrière `cfg(debug_assertions)`.

EN: Files under `before-ci-phase1/` are complete copies from base commit `c39a87e1d693382f34ca38bcaa68e032a9bcbc29`. They preserve comments, configuration variants and code replaced by PR 153 fixes. `pnpm-lock.before-phase1-repair.yaml` preserves the branch's inconsistent lockfile before repair. Never automatically delete or reactivate these references.

These files are neither active workflows, Cargo workspace members, Vite entry points nor files under `public/`. They remain outside bundles and executables. The native build embeds only `dist/`. Disabled historical imports remain commented in active sources; development tools remain behind `cfg(debug_assertions)`.
