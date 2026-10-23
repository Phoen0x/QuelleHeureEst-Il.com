# Journal des décisions / Decision log

*Résumé fidèle de la conversation du vendredi 23 octobre 2026 avec Claude. Ce n'est pas une transcription mot à mot ; les réponses de Sasha aux questions à choix sont citées telles quelles.*
*Faithful summary of the 23 October 2026 conversation with Claude. Not a verbatim transcript; Sasha's answers to the multiple-choice questions are quoted as given.*

## 1. Déroulé / Timeline

1. **Demande initiale** : analyser le repo, puis préparer un prompt auto-adressé pour auditer les PR et préparer, sans rien modifier, des commits qui retirent les suppressions « inutilement destructrices ». → Accès vérifié : lecture du repo et API REST OK ; pas de PAT de Sasha (`GH_TOKEN` invalide) ; push d'abord refusé, GraphQL bloqué, code scanning/Dependabot en 403 ; navigateur et contrôle de l'ordinateur indisponibles (plan gratuit). Livré : `PROMPT_AUDIT_PR.md`.
2. **Installation** de la GitHub App Claude (liens fournis). Après installation : push autorisé (testé à blanc, `permissions.push = true`). Code scanning/Dependabot restent en 403 : pas d'option de permission supplémentaire trouvée par Sasha ; non bloquant.
3. **Audit** des 38 PR ouvertes → `COMPTE_RENDU.md`. Une erreur de méthode (référence `FETCH_HEAD` écrasée) a été détectée et corrigée avant toute conclusion ; une imprécision sur `pnpm-lock.yaml` corrigée ensuite.
4. **Choix** présentés à Sasha (ci-dessous), puis préparation des patchs.
5. **Dépôt** de ce dossier dans une PR en brouillon.

## 2. Décisions / Decisions

| Sujet | Réponse de Sasha (citée) | Conséquence |
|---|---|---|
| CI (#153) | « Bah on dois faire que les scans ne se lancent que quand ils sont pertinents quoi... » | Scans conditionnels ; `java-kotlin` retiré. Pas de PR de code poussée pour l'instant |
| Format pnpm-lock v6/v9 | « Je ne sais pas » | #149–152 gelées, non fermées. C5 garde le format 6.0 |
| package-lock.json et variantes | « j'en sais rien on garde tout on supprime rien. je garde les pnpm et les autres types car j'utilise plusieurs outils différents. et il faut considerer les p.jspon alternatifs comme des versions à refusionner correctement aussi. attention a ne pas faire nimp et bien faire exactement ce que je veux. je prefere un code gardé ou mis en commentaire plutot qu'un bout de code supprimé. » | Aucune suppression. Variantes à refusionner **plus tard, avec questions** (`VARIANTES.md`). Ancien état des lockfiles conservé dans `docs/history/` |
| PR pivot lockfile | « 3. de quoi c'est plus une pr de bot ? » (après explication) puis « Branche neuve par moi (Recommandé) » | C5 : branche neuve générée par Claude, aucun bot ne l'écrase |
| Alternatives package.json | « Bah en gros c'est ca mais faudra ptet plus qu'un tableau mdr. y'a bcp de questions a me poser pour cerner ce que j'imagine jpense. » | Prévoir un échange de questions avant toute refusion |
| #140 (PowerShell) | « on fait rien pour le moment » | Aucun patch |
| Cargo #164–166 | « on fait rien pour le moment j'imagine » | Aucun patch |
| Outils utilisés | « jsp jcrois y'a besoin de yarn, bun, pnpm, et npm. j'utilises chat gpt, codex, claude, bolt, cursor, copilot, etc etc... » | Contradiction notée avec `only-allow pnpm` ; pas de `yarn.lock`/`bun.lock` pour l'instant |
| esbuild / rollup | « Ne pas les ajouter, documenter » | Documenté dans `VARIANTES.md` |
| Scripts `check:dependencies`, `test:security`, `test` | « j'en sais rien supprime pas et note dans le compte rendu » | Rien supprimé ; noté dans `VARIANTES.md` |
| postcss `^8.5.14` / `^8.5.25` | « Ne pas décider maintenant » | Ouvert |
| Patchs | « tu prépares tous les commits de toutes tes propositions en les inscrivant dans ou avec le compte rendu » | `patches/` (C1, C2, C3, C5, C6) ; #140 et Cargo exclus car « on fait rien » |
| Branche lockfile | « Maintenant, en brouillon local » | C5 générée, validée, non poussée comme PR de code |
| PR documentaire | « la 1 mais un document neuf pas d'edition de document actuel. » | `docs/reports/audit-pr-20261023/`, **fichiers neufs uniquement**, PR en brouillon |
| Attribution | « Co-Authored-By seulement » | Trailer sans lien de session ; description de PR sans lien de session |

## 3. Points ouverts / Open items

1. **Version de pnpm** à utiliser (6.0 vs 9.0) : à vérifier par `pnpm --version` sur la machine principale.
2. **npm / pnpm / yarn / bun** : `preinstall: npx only-allow pnpm` bloque les trois autres ; aucun lockfile yarn/bun. À arbitrer.
3. **Refusion des `package.json` et lockfiles alternatifs** : questions à poser (voir `VARIANTES.md`).
4. **postcss** : plancher `^8.5.14` ou `^8.5.25`.
5. **Alertes de sécurité** : non lues (403). Copier la liste depuis l'onglet Security si utile.
6. **typecheck/lint** : erreurs sur le code source, origine à confirmer (voir `COMPTE_RENDU.md` §6).
7. **#140, #164–166** : en attente.
