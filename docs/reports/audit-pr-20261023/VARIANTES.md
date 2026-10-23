# Variantes de `package.json` et de lockfiles / `package.json` and lockfile variants

*Inventaire de lecture seule. Rien n'est refusionné ni supprimé. / Read-only inventory. Nothing is merged or deleted.*

## 1. Lockfiles et fichiers liés sur `main`

| Fichier | État constaté |
|---|---|
| `package-lock.json` | JSON valide, `lockfileVersion` 3, 301 entrées ; résout `vite` 7.3.5 et `plugin-react` 4.7.0 alors que `package.json` demande `^8.0.16` / `^6.0.2` |
| `pnpm-lock.yaml` | `lockfileVersion '6.0'` ; importer `plugin-react 6.0.2` sans entrée correspondante dans `packages` ; orphelins `4.7.0` |
| `package-lock.main.json` | **JSON invalide** (erreur ligne 1503 : fragment tronqué). Entrée par défaut du script `Scripts/fix-package-lock-merge.mjs` |
| `package-lock.main.fixed.json` | JSON valide ; sortie par défaut du même script |
| `package-lock.fix-report.json` | JSON valide ; rapport par défaut du même script |

FR : les trois derniers sont conservés tels quels (preuve de la réparation).
EN: the last three are kept as-is (evidence of the repair).

## 2. `package.json` alternatifs (snapshots sous `docs/history/`, ajoutés par #153, #179, #183)

| Variante | PR | Écarts avec le `package.json` actif |
|---|---|---|
| `dependency-gaps-20261013/main` | #153 | aucun |
| `dependency-gaps-20261013/before` | #153 | + `esbuild 0.28.1`, + `rollup 4.61.1`, `postcss ^8.5.25`, + scripts `check:dependencies`, `test:security` |
| `dependency-bots-20261013` | #153 | idem `before` |
| `js-security-20261013` | #153 | aucun |
| `rust-178` | #179, #183 | aucun |
| `js-security-183-20261022` | #183 | + script `test` |
| `vite-qh010-20261022` | #183 | + `esbuild 0.28.1`, + `rollup 4.61.1`, `postcss ^8.5.25`, + scripts `check:dependencies`, `test`, `test:security` |

Sur 21 dépendances au total, **3 diffèrent** entre variantes : `esbuild`, `rollup`, `postcss`. Aucune dépendance du `package.json` actif n'est absente d'une variante.

Hors périmètre de cet inventaire : `docs/audits/renovate-worker-168/tooling/package.json` (#170), jeu d'outils d'audit distinct.

## 3. Décisions déjà prises

- `esbuild` / `rollup` : **ne pas ajouter** au `package.json` actif ; documenté ici.
- Scripts `check:dependencies`, `test:security`, `test` : **rien supprimé** ; documentés ici. Je n'ai pas vérifié ici que les fichiers de `Scripts/` qu'ils appellent existent sur `main`.
- `postcss` : **non décidé**.

## 4. Questions à poser avant toute refusion

1. Pourquoi `esbuild` et `rollup` avaient-ils été ajoutés explicitement dans l'historique (forcer une version corrigée ?). Je ne connais pas la raison d'origine.
2. Les scripts `check:dependencies`, `test:security`, `test` : à rendre exécutables, ou à ranger sous une clé inerte (`"//"`) ?
3. Quel outil lit quel lockfile (npm, pnpm, yarn, bun) et lesquels doivent rester synchronisés ?
4. Faut-il créer un `yarn.lock` / `bun.lock` ? Et que faire de `preinstall: npx only-allow pnpm` ?
5. Que faire des snapshots `docs/history/**` : refusion de leur contenu utile dans le `package.json` actif, ou simple conservation ?
