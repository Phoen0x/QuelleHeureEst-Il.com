# C6 — fusion de `main` dans la branche de #153 / merge `main` into #153's branch

FR : un commit de fusion ne passe pas bien par `git am`. Voici la recette exacte, déjà vérifiée en local (commit `75ee090` sur la branche locale `local/pr-153-merge-main`, non poussé).
EN: a merge commit does not travel well through `git am`. Here is the exact recipe, already verified locally (commit `75ee090` on local branch `local/pr-153-merge-main`, not pushed).

```bash
git fetch origin main pull/153/head
git switch -c merge-main-153 FETCH_HEAD
git merge --no-commit --no-ff origin/main     # un seul conflit : AGENTS.md
git checkout --theirs AGENTS.md               # theirs = main
git add AGENTS.md
git commit
```

FR : **seul conflit : `AGENTS.md`** (ajouté des deux côtés). La version de `main` (66 lignes) est un sur-ensemble strict de celle de la PR (47 lignes : 19 lignes de plus côté `main`, aucune de moins). Elle est conservée, donc rien n'est perdu. Après la fusion, 10 fichiers diffèrent de la tête de #153 : `AGENTS.md` et les 9 fichiers de `docs/ai/` ajoutés sur `main` depuis.
EN: **only conflict: `AGENTS.md`** (added on both sides). The `main` version (66 lines) is a strict superset of the PR version (47 lines: 19 more lines on the `main` side, none fewer). It is kept, so nothing is lost. After the merge, 10 files differ from #153's head: `AGENTS.md` and the 9 `docs/ai/` files added to `main` since.
