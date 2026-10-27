# Compte rendu — audit des PR ouvertes / Report — audit of open PRs

> Édition publique impersonnelle du 27 octobre 2026. Le relevé historique du 23 octobre est conservé ; cette édition ne constitue pas l’original à l’octet. Voir la [notice de confidentialité et d’intégrité](NOTICE_CONFIDENTIALITE_INTEGRITE_20261027.md).


*Vendredi 23 octobre 2026 · FR d'abord, EN en fin de document / French first, English at the end.*
*Rien n'a été poussé sur les branches des PR auditées, commenté, fermé ou fusionné. Les correctifs sont livrés sous forme de patchs (`patches/`).*

---

## 1. Verdict en bref

1. **38 PR ouvertes analysées. Aucune ne supprime un seul fichier** (statut `removed` : 0 sur 38).
2. Les gros chiffres de suppressions (−1 500 à −3 000 lignes) viennent **uniquement des lockfiles** (`package-lock.json`, `pnpm-lock.yaml`) réécrits par Renovate/Dependabot : suppressions de lignes, pas de fichiers.
3. Ces suppressions sont **en grande partie légitimes** : `main` est incohérent (§3). Restaurer ce qu'elles retirent serait une erreur.
4. **21 PR de lockfile se marchent dessus** : seule la première fusionnée passera sans conflit.
5. **Un vrai bug** : l'autofix **#139** appelle `ensureOrder(order, key)` alors que la fonction ne prend qu'un argument. Corrigé dans le patch C1.
6. **`vendor/glib-0.18.5` (ajouté par #153) n'est pas à supprimer** : c'est un rétroport local volontaire du correctif de RUSTSEC-2024-0429.
7. Presque toutes les PR échouent aux **mêmes checks**, cause dans les workflows (§4).

## 2. Méthode et limites

- Données : API REST GitHub (méta, fichiers, check-runs) + `git fetch` des têtes de PR, comparées à `main` (`eb3c940`).
- **Erreur corrigée en cours de route** : une première comparaison des lockfiles utilisait une référence `FETCH_HEAD` écrasée par mes propres fetch. Tous les chiffres ont été recalculés contre la vraie `main`.
- **Précision ajoutée après coup** : j'avais d'abord écrit que le `pnpm-lock.yaml` de `main` résolvait `plugin-react` 4.7.0. En réalité sa section `importers` dit `6.0.2(vite@8.0.16)`, mais **aucune entrée `/@vitejs/plugin-react@6.0.2` n'existe dans `packages`**, et une entrée orpheline `4.7.0(vite@7.3.5)` y reste. Le fichier est incohérent en interne.
- Non vérifié : les scripts PowerShell (pas de PowerShell ici), les logs des jobs CI (causes du §4 déduites des workflows), `cargo check`.
- Hors périmètre : les PR fermées, les alertes code scanning/Dependabot (API : 403), les issues #157 et #168.

## 3. Lockfiles

**Constat sur `main`** :

| Fichier | `vite` | `@vitejs/plugin-react` |
|---|---|---|
| `package.json` | `^8.0.16` | `^6.0.2` |
| `package-lock.json` | **7.3.5** (résolu) | **4.7.0** (tire `@babel/core` 7.29.7) |
| `pnpm-lock.yaml` (v6.0) | importer `8.0.16` | importer `6.0.2`, mais entrée absente de `packages` ; orphelin `4.7.0` |

**Ce que font les PR de bots** (ex. #169) : elles resynchronisent. `plugin-react` 6.1.2, `vite` 8.x, `rolldown`, et **84 noms de paquets retirés dont tout `@babel/*`**, conséquence normale de plugin-react 6. ~301 → 245 entrées dans `package-lock.json`.

PR concernées : #138, #144, #145, #146, #148, #149, #150, #151, #152, #155, #158, #159, #160, #161, #163, #169, #173, #174, #184 (+ #179, #183 ; #153 modifie `pnpm-lock.yaml`, −172 lignes).

- **#149–#152 (Dependabot)** passent `pnpm-lock.yaml` de `lockfileVersion '6.0'` à `'9.0'`. Rien ne fixe la version de pnpm (pas de `packageManager`).
- **#184 `[security]`** : lock en `vite` 8.1.6 ; #169 : 8.3.5. L'avis précis visé par #184 n'a pas pu être identifié ; CVE-2026-53571 est corrigé en 8.0.16, déjà déclaré.

## 4. Échecs CI communs

| Check | Fichier | Cause probable |
|---|---|---|
| `CodeQL Analysis (java-kotlin)` | `security-analysis.yml` | matrice `java-kotlin`, aucun `.java`/`.kt`/`gradlew` sur `main` |
| `Trigger_APIsec_scan` | `apisec-scan.yml` | secrets `apisec_username`/`apisec_password` absents |
| `Analysis` | `sonarcloud.yml` | `projectKey`/`organization` vides, `SONAR_TOKEN` probablement absent |
| `build` | `rust.yml` | non déterminée sans les logs |

#153 contient les modalités CI examinées au relevé historique. Principe technique rapporté : réserver les scans aux sources et contextes pertinents ; aucune modification de CI autorisée par la présente édition.

## 5. Fiche par groupe de PR

| Groupe | PR | +/− | Verdict |
|---|---|---|---|
| Lockfiles bots | 19 PR §3 | −1 200 à −3 000 | Légitime, redondant. Branche de resynchronisation préparée (C5). #149–152 gelées, non fermées |
| Cargo bumps | #164 chrono-tz 0.8→0.10, #165 reqwest 0.11→0.13, #166 rusqlite 0.29→0.40 | +1/−1 | Intervention différée au relevé historique. Trois sauts majeurs sans changement de code ; aucun `cargo check` rapporté pour ces propositions. |
| Actions | #185 `checkout` v6→v7 | +14/−14 | OK sous réserve de CI ; la v7.0.0 existe |
| Autofix IA | #139, #140, #141 | +14/−5, +14/−11, +23/−6 | #139/#141 : patchs C1–C3 préparés ; #140 différée sans patch. |
| Chaîne Rust/Tauri | #176 → #177, #178, #179 | +33, +334, +452, +4 713 | OK dans l'esprit. ⚠ #177–179 ciblent `fix/rust-tauri2-shell-feature`, pas `main` |
| Grosses PR | #153 (+116 172/−360) · #183 (+45 981/−81) | | 0 fichier supprimé. #153 : un seul conflit avec `main` (`AGENTS.md`), résolu localement (C6). #183 ajoute `Cargo.lock` (5 270 lignes) |
| Docs / audit | #162, #170, #171, #172, #186, #187 | purs ajouts | OK, ne rien toucher. Le `package-lock.json` de #170 sous `docs/audits/` est une preuve d'audit |

**`vendor/glib-0.18.5`** (121 fichiers, #153) : rétroport local du correctif de [RUSTSEC-2024-0429](https://rustsec.org/advisories/RUSTSEC-2024-0429) (`glib >=0.15.0, <0.20.0` touché, corrigé en `>=0.20.0`). La PR explique que Tauri impose gtk 0.18, donc glib 0.18. Protecteur, pas destructeur. Le contenu du rétroport n'a pas été validé ici.

## 6. Commits préparés (non poussés sur les PR) — `patches/`

Messages préparés français puis anglais, trailer `Co-Authored-By` de service seulement ; aucun lien de session nécessaire à la preuve.

| # | PR | Contenu | Vérification faite |
|---|---|---|---|
| C1 | #139 | `ensureOrder(order, key)` → `ensureOrder(key)` (l. 293) | `node --check` OK ; `git am` à froid OK |
| C2 | #139 | Restaure la note FR d'origine, suivie de l'EN | idem |
| C3 | #141 | Ajoute la ligne FR au commentaire WinRT (anglais seul) | `git am` à froid OK ; **script PowerShell non testé** |
| C5 | branche neuve | Resynchronise `package-lock.json` (npm 10.9.4) et `pnpm-lock.yaml` (pnpm 8.15.9, format 6.0 gardé) avec `package.json`, copie de l'ancien état dans `docs/history/lock-resync-20261023/before/` | `npm ci --dry-run` OK (245 paquets) ; `pnpm install --frozen-lockfile` OK ; `package.json` inchangé |
| C6 | #153 | Fusion de `main` dans la branche. Seul conflit : `AGENTS.md`, version de `main` (66 l.) conservée car sur-ensemble strict de celle de la PR (47 l.) | 0 marqueur de conflit ; 10 fichiers diffèrent de #153 (= ajouts de `main`) |

**Non préparés, par décision** : #140 (PowerShell), #164–166 (Cargo), fermeture de #149–152.

**Constat annexe sur la branche C5** : `pnpm run typecheck` et `pnpm run lint` **échouent** sur le code source (ex. `src/services/tauri.ts` importe `@tauri-apps/api/tauri`, chemin de l'API Tauri 1, alors que `package.json` demande `@tauri-apps/api ^2.11.0` ; `PollenCard.tsx` : erreur de type et variable inutilisée). Je n'ai **pas** comparé avec `main` (impossible d'y installer avec un lockfile incohérent) : l'origine exacte reste à confirmer. #183 modifie `src/services/tauri.ts`.

**Ordre de fusion suggéré** (à valider) : ① #153 (+ C6) → ② #176 → #177 → #178 → #179, puis #183 → ③ branche C5 (les autres PR de lockfile refermées par toi) → ④ #164–166 après `cargo check`.

## 7. Décisions techniques rapportées et points ouverts

Voir `JOURNAL_DECISIONS.md` pour le détail. Ouvert : version de pnpm (v6/v9), cohabitation npm/pnpm/yarn/bun avec `only-allow pnpm`, `postcss ^8.5.14` vs `^8.5.25`, `esbuild`/`rollup` et scripts alternatifs (voir `VARIANTES.md`).

## 8. Sources

- [RUSTSEC-2024-0429](https://rustsec.org/advisories/RUSTSEC-2024-0429)
- [CVE-2026-53571 (vite, corrigé en 6.4.3 / 7.3.5 / 8.0.16)](https://advisories.gitlab.com/npm/vite/CVE-2026-53571/)
- [PSWindowsUpdate 2.2.1.5](https://www.powershellgallery.com/packages/PSWindowsUpdate/2.2.1.5)
- [Exemple de bump `actions/checkout` 6.0.2 → 7.0.0](https://dart.googlesource.com/external/github.com/flutter/devtools/+/a549a2e3fdc02d9edb760cab5408ef59cb3de8b5%5E%21/)

---

## English summary

Read-only audit of 38 open PRs. **No PR deletes a file**; large deletion counts are lockfile line removals by Renovate/Dependabot and are mostly legitimate because `main` is internally inconsistent (`package.json` wants vite 8 / plugin-react 6; `package-lock.json` resolves vite 7 / plugin-react 4 + Babel; `pnpm-lock.yaml` has an importer pointing to a missing package plus orphan entries). One real bug: autofix #139 calls `ensureOrder(order, key)` but the function takes `(key)`. `vendor/glib-0.18.5` in #153 is an intentional local backport of the RUSTSEC-2024-0429 fix. Shared CI failures come from workflow config, which #153 addresses. Prepared (not pushed to PR branches): C1–C3 patches, C5 lockfile resync branch (validated with `npm ci --dry-run` and `pnpm install --frozen-lockfile`; typecheck/lint fail on source code, not compared with `main`), C6 merge of `main` into #153 (single conflict in `AGENTS.md`, `main`'s superset version kept). #140 and the Cargo bumps are intentionally left untouched.
