# Inventaire des 38 PR ouvertes / Inventory of the 38 open PRs

*Données collectées le 2026-10-23 matin via l'API REST GitHub (état à ce moment-là ; l'état des PR peut avoir changé depuis). `main` = `eb3c940`. « Checks KO » = nombre de noms de checks distincts en échec sur la dernière tête.*
*Data collected on the morning of 2026-10-23 via the GitHub REST API (state at that time; PR state may have changed since).*

| PR | Auteur | Branche | +/− lignes | Fichiers | État de fusion | Checks KO | Groupe | Verdict / patch |
|---|---|---|---|---|---|---|---|---|
| #138 | dependabot[bot] | `dependabot/npm_and_yarn/npm_and_yarn-30ae9b537b` → `main` | +762/−1837 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #139 | AetherXYZ | `ai-findings-autofix/Scripts-fix-package-lock-merge.mjs` → `main` | +14/−5 | 1 | blocked | 4 | Autofix IA | Bug réel ensureOrder → patchs C1 + C2. |
| #140 | AetherXYZ | `ai-findings-autofix/Scripts-purgewindowsupdate.ps1` → `main` | +14/−11 | 1 | blocked | 4 | Autofix IA | En attente (« on fait rien pour le moment ») ; -Force retiré, ordre de repli inversé, non testable ici. |
| #141 | AetherXYZ | `ai-findings-autofix/Scripts-WindowsFullUpdate.ps1` → `main` | +23/−6 | 1 | blocked | 4 | Autofix IA | Patch C3 (ligne FR au commentaire) ; reste conservé. |
| #144 | dependabot[bot] | `dependabot/npm_and_yarn/multi-2ac5173c29` → `main` | +1117/−2018 | 3 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #145 | dependabot[bot] | `dependabot/npm_and_yarn/multi-babed0ba47` → `main` | +1110/−2034 | 3 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #146 | dependabot[bot] | `dependabot/npm_and_yarn/postcss-8.5.25` → `main` | +929/−1468 | 3 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #148 | dependabot[bot] | `dependabot/npm_and_yarn/nanoid-3.3.18` → `main` | +482/−1203 | 1 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #149 | dependabot[bot] | `dependabot/npm_and_yarn/postcss-selector-parser-6.1.4` → `main` | +2099/−3043 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. Gelée : lockfile v9, décision pnpm en attente. |
| #150 | dependabot[bot] | `dependabot/npm_and_yarn/browserslist-4.28.9` → `main` | +2123/−3063 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. Gelée : lockfile v9, décision pnpm en attente. |
| #151 | dependabot[bot] | `dependabot/npm_and_yarn/baseline-browser-mapping-2.11.22` → `main` | +2099/−3042 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. Gelée : lockfile v9, décision pnpm en attente. |
| #152 | dependabot[bot] | `dependabot/npm_and_yarn/js-yaml-4.3.2` → `main` | +2099/−3043 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. Gelée : lockfile v9, décision pnpm en attente. |
| #153 | AetherXYZ | `chore/ci-phase1-reliability-20261013` → `main` | +116172/−360 | 276 | dirty | 4 | Grosse PR | Conflit unique AGENTS.md ; fusion locale C6 (recette) ; vendor/glib-0.18.5 à conserver ; corrige la CI (décision CI : scans pertinents). |
| #155 | renovate[bot] | `renovate/npm-postcss-vulnerability` → `main` | +912/−1489 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #158 | renovate[bot] | `renovate/eslint-monorepo` → `main` | +935/−1529 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #159 | renovate[bot] | `renovate/autoprefixer-10.x-lockfile` → `main` | +910/−1512 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #160 | renovate[bot] | `renovate/eslint-plugin-react-refresh-0.x` → `main` | +865/−1471 | 3 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #161 | renovate[bot] | `renovate/lucide-monorepo` → `main` | +865/−1471 | 3 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #162 | AetherXYZ | `chore/pause-renovate-preservation-20261015` → `main` | +2394/−0 | 21 | blocked | 4 | Docs / audit | OK, purs ajouts ; ne rien toucher (preuves d'audit). |
| #163 | renovate[bot] | `renovate/typescript-eslint-monorepo` → `main` | +1007/−1603 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #164 | renovate[bot] | `renovate/chrono-tz-0.x` → `main` | +1/−1 | 1 | blocked | 5 | Cargo (bot) | En attente (« on fait rien pour le moment ») ; sauts majeurs, cargo check requis. |
| #165 | renovate[bot] | `renovate/reqwest-0.x` → `main` | +1/−1 | 1 | blocked | 5 | Cargo (bot) | En attente (« on fait rien pour le moment ») ; sauts majeurs, cargo check requis. |
| #166 | renovate[bot] | `renovate/rusqlite-0.x` → `main` | +1/−1 | 1 | blocked | 5 | Cargo (bot) | En attente (« on fait rien pour le moment ») ; sauts majeurs, cargo check requis. |
| #169 | renovate[bot] | `renovate/tauri-monorepo` → `main` | +962/−1553 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #170 | AetherXYZ | `test/renovate-full-worker-168` → `main` | +14814/−0 | 51 | blocked | 4 | Docs / audit | OK, purs ajouts ; ne rien toucher (preuves d'audit). |
| #171 | AetherXYZ | `test/renovate-audit-ci-170` → `test/renovate-full-worker-168` | +656/−0 | 11 | blocked | 4 | Docs / audit | OK, purs ajouts ; ne rien toucher (preuves d'audit). |
| #172 | AetherXYZ | `docs/ai-collaboration-handoff-167` → `docs/ai-relay-working-contract-20261016` | +115/−0 | 4 | blocked | 4 | Docs / audit | OK, purs ajouts ; ne rien toucher (preuves d'audit). |
| #173 | dependabot[bot] | `dependabot/npm_and_yarn/multi-05c505ab13` → `main` | +507/−1206 | 1 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #174 | dependabot[bot] | `dependabot/npm_and_yarn/source-map-js-1.2.2` → `main` | +500/−1199 | 1 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #176 | AetherXYZ | `fix/rust-tauri2-shell-feature` → `main` | +33/−1 | 2 | blocked | 4 | Chaîne Rust/Tauri | OK dans l'esprit ; variante shell-open conservée en commentaire. |
| #177 | AetherXYZ | `ci/rust-validation-176` → `fix/rust-tauri2-shell-feature` | +334/−0 | 3 | unstable | 2 | Chaîne Rust/Tauri | Cible fix/rust-tauri2-shell-feature, pas main ; check validate en échec (177, 178). |
| #178 | AetherXYZ | `fix/tauri-config-after-177` → `fix/rust-tauri2-shell-feature` | +452/−0 | 5 | unstable | 2 | Chaîne Rust/Tauri | Cible fix/rust-tauri2-shell-feature, pas main ; check validate en échec (177, 178). |
| #179 | AetherXYZ | `fix/rust-lock-api-after-178` → `fix/rust-tauri2-shell-feature` | +4713/−4 | 17 | blocked | 4 | Chaîne Rust/Tauri | Cible fix/rust-tauri2-shell-feature, pas main ; recouvrements probables avec #183 non testés. |
| #183 | AetherXYZ | `codex/fix-development-validation-20261021` → `main` | +45981/−81 | 76 | blocked | 3 | Grosse PR | 0 suppression de fichier ; ajoute Cargo.lock ; recouvrements probables avec #179. |
| #184 | renovate[bot] | `renovate/npm-vite-vulnerability` → `main` | +850/−1864 | 2 | blocked | 5 | Lockfiles (bot) | Légitime (resynchro) mais redondant ; absorbé par C5. À refermer/rebaser par Sasha après C5. |
| #185 | renovate[bot] | `renovate/actions-checkout-7.x` → `main` | +14/−14 | 5 | blocked | 5 | Actions (bot) | OK sous réserve de CI ; checkout v7.0.0 existe. |
| #186 | AetherXYZ | `docs/chatgpt-v2-v3-relay-20261022` → `main` | +287/−0 | 3 | blocked | 4 | Docs / audit | OK, purs ajouts ; ne rien toucher (preuves d'audit). |
| #187 | AetherXYZ | `docs/project-roadmap-20261022` → `main` | +346/−0 | 11 | blocked | 4 | Docs / audit | OK, purs ajouts ; ne rien toucher (preuves d'audit). |

**Fichiers supprimés par l'ensemble de ces 38 PR : 0.** / **Files deleted by all 38 PRs: 0.**
