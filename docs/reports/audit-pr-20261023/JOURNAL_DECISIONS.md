# Journal des décisions / Decision log

> Édition publique impersonnelle du 27 octobre 2026. Le relevé historique du 23 octobre est conservé ; cette édition ne constitue pas l’original à l’octet. Voir la [notice de confidentialité et d’intégrité](NOTICE_CONFIDENTIALITE_INTEGRITE_20261027.md).


*Relevé des décisions techniques rapportées le 23 octobre 2026. Édition publique impersonnelle du 27 octobre 2026 : les décisions et incertitudes sont conservées, sans reproduire les réponses de conversation. Les identités Git et empreintes des originaux sont consignées dans le manifeste de correction lié par la notice de provenance.*
*Technical decisions reported on October 23, 2026. Impersonal public edition dated October 27, 2026: decisions and uncertainties are retained without quoting conversation replies. Original Git identities and digests are recorded in the correction manifest linked by the provenance notice.*

## 1. Déroulé / Timeline

1. **Demande initiale :** analyser le dépôt et ses PR, puis préparer des correctifs contre les suppressions injustifiées sans modifier les branches auditées. Lecture du dépôt et REST rapportées disponibles ; authentification héritée non utilisable, écriture initialement refusée, GraphQL et alertes restreints. Livrable : `PROMPT_AUDIT_PR.md`.
2. **Accès documentaire ultérieur :** l’outil rapporte ensuite une permission d’écriture utilisée seulement pour la branche documentaire ; les alertes code scanning/Dependabot restent en 403. Cet état historique n’autorise aucune écriture actuelle.
3. **Audit** des 38 PR ouvertes → `COMPTE_RENDU.md`. Une erreur de méthode (référence `FETCH_HEAD` écrasée) a été détectée et corrigée avant toute conclusion ; une imprécision sur `pnpm-lock.yaml` corrigée ensuite.
4. **Arbitrages techniques :** les choix rapportés sont consignés ci-dessous ; ils ne valent pas autorisation actuelle d’appliquer les patchs.
5. **Dépôt** de ce dossier dans une PR en brouillon.

## 2. Décisions / Decisions

| Sujet | Décision technique rapportée au 23 octobre 2026 | Conséquence |
|---|---|---|
| CI (#153) | Rechercher des scans adaptés aux sources et au contexte. Les modalités documentées dans #153 sont historiques, non activées par cette édition. | Aucun changement de workflow autorisé ici. |
| Format pnpm-lock v6/v9 | Choix du format de verrou non arbitré ; version de pnpm à distinguer du format du verrou. | #149–152 en attente ; C5 garde le format 6.0. |
| package-lock.json et variantes | Préserver fichiers, dépendances et options ; examiner séparément la réconciliation des variantes et ses questions ouvertes. | Aucun retrait ; ancien état des verrous conservé dans `docs/history/`. |
| PR pivot lockfile | Préparer une branche de travail indépendante des branches de bots. | C5 est un correctif préparé, non une fusion ou fermeture de PR autorisée. |
| Alternatives package.json | Clarifier les usages attendus avant toute réconciliation fonctionnelle. | Questions conservées dans `VARIANTES.md`. |
| #140 (PowerShell) | Intervention différée. | Aucun patch préparé. |
| Cargo #164–166 | Intervention différée, compatibilité non validée. | Aucun patch préparé. |
| Outils utilisés | Le besoin de plusieurs gestionnaires est à préciser ; aucun nouvel outil ou verrou choisi par défaut. | Contradiction avec `only-allow pnpm` à arbitrer ; pas de verrou yarn/bun créé. |
| esbuild / rollup | Ne pas ajouter de dépendance active dans cette étape ; documenter les variantes. | Voir `VARIANTES.md`. |
| Scripts `check:dependencies`, `test:security`, `test` | Préserver les scripts et documenter leur statut avant décision. | Aucun retrait. |
| postcss `^8.5.14` / `^8.5.25` | Version plancher non arbitrée. | Question ouverte. |
| Patchs | Préparer les propositions comme fichiers de preuve sans application aux PR. | C1, C2, C3, C5 et recette C6 conservés ; #140 et Cargo exclus. |
| Branche lockfile | Préparation locale uniquement. | C5 rapporté comme généré et vérifié à l’époque ; pas de publication comme PR de code. |
| PR documentaire | Créer un dossier documentaire neuf, sans éditer les fichiers applicatifs. | Dossier `docs/reports/audit-pr-20261023/`, PR initialement en brouillon. |
| Attribution | Utiliser un trailer `Co-Authored-By` de service sans lien de session. | Pas de lien de conversation dans le message de commit ou la description. |

## 3. Points ouverts / Open items

1. **Version de pnpm** à utiliser (6.0 vs 9.0) : à vérifier par `pnpm --version` sur la machine principale.
2. **npm / pnpm / yarn / bun** : `preinstall: npx only-allow pnpm` bloque les trois autres ; aucun lockfile yarn/bun. À arbitrer.
3. **Refusion des `package.json` et lockfiles alternatifs** : questions à poser (voir `VARIANTES.md`).
4. **postcss** : plancher `^8.5.14` ou `^8.5.25`.
5. **Alertes de sécurité** : non lues (403). Copier la liste depuis l'onglet Security si utile.
6. **typecheck/lint** : erreurs sur le code source, origine à confirmer (voir `COMPTE_RENDU.md` §6).
7. **#140, #164–166** : en attente.
