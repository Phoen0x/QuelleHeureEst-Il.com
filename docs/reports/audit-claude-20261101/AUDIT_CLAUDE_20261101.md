<!--
FR: Document NEUF, purement additif (aucun fichier existant modifié ni supprimé, conformément à AGENTS.md).
    Il consigne toutes les remarques d'une relecture externe (Claude) du dépôt, avec leur statut vérifié au 2026-11-01.
    Ce n'est ni une décision, ni une autorisation de fusion, ni un changement de licence.
EN: NEW, purely additive document (no existing file modified or deleted, per AGENTS.md).
    It records every remark from an external review (Claude) of the repository, with status verified on 2026-11-01.
    It is not a decision, a merge authorization, or a license change.
-->

# Audit externe (Claude) — remarques et statut au 2026-11-01 / External review (Claude) — remarks and status as of 2026-11-01

[Français](#français) · [English](#english)

---

## Français

### Périmètre et méthode

- Relecture demandée par ÆtherXYZ : README, présentation, ambitions, fonctionnalités.
- Première passe **trop rapide**, faite avant d'avoir lu `AGENTS.md`, les roadmaps et les docs IA. Plusieurs critiques étaient fausses : elles sont listées en section C pour mémoire.
- Chaque remarque de A/B est **revérifiée sur `main` au commit `8a1505d`** (1er novembre 2026). Pas de modification de code dans cette PR : documentation seulement.
- Légende : ✅ toujours valable · ⚠️ à vérifier / dépend d'une décision · ❌ retirée.

### A. Remarques toujours valables

| # | Sujet | Constat vérifié | Suggestion (non appliquée ici) |
|---|-------|-----------------|--------------------------------|
| A1 ✅ | Spec rendue comme du code | Dans `.github/README.md`, le contenu des lignes 5 à 233 est enfermé dans un bloc ```` ```markdown ````. GitHub l'affiche donc comme du code brut, pas comme une page mise en forme. | Retirer les deux fences (ou les commenter), **sans supprimer** le texte (règle ghost code). |
| A2 ✅ | Étapes d'installation fausses | `.github/README.md` : `git clone .../VotreOrg/QuelleHeureEst-Il.com.git` (placeholder) et `cd apps/desktop` (le dossier `apps/` n'existe pas ; le front est à la racine : `src/`, `src-tauri/`). | Remplacer par l'URL `Phoen0x/...` et les vraies commandes (`pnpm install`, `pnpm tauri dev`) ; garder l'ancienne version en commentaire. |
| A3 ✅ | Bloc de code non refermé | Le bloc `bash` du « Cloner le projet » (ligne 243) n'est jamais fermé avant le suivant : le rendu de la section d'installation est cassé (9 fences, nombre impair). | Fermer le bloc. |
| A4 ✅ | Deux README qui se masquent | GitHub affiche `.github/README.md` (prioritaire) ; le `README.md` racine, plus honnête et à jour, n'est donc pas celui que voient les visiteurs. | Garder les deux (choix assumé), mais ajouter en tête du `.github/README.md` un lien vers le suivi et la roadmap. |
| A5 ✅ | Ligne parasite | Le `README.md` racine commence par « README de l'app et pas de github », suivie de `---`. | Commenter cette ligne ou la déplacer en note HTML. |
| A6 ✅ | Pas de bandeau « objectif ≠ implémenté » dans la présentation | Le README racine le dit (« Les objectifs annoncés ne sont pas nécessairement déjà implémentés »), mais `.github/README.md`, celui qui s'affiche, présente tout au présent (« offrant heure locale, météo, pollen… »). | Ajouter le même avertissement en tête de `.github/README.md`, avec un état par fonctionnalité (prévu / en cours / testé). |
| A7 ✅ | Mention « open-source » | `.github/README.md` ligne 8 : « Application open-source » ; la section licence du même fichier et `LICENSE` disent l'inverse. Même constat pour `.bolt/prompt` (déjà noté T-014). | Décision à traiter via T-014, sans changer les droits à cette occasion. |
| A8 ✅ | Texte d'attribution trompeur dans l'UI | `src/components/Dashboard.tsx:71` affiche « Open-source & free to use ». Ça décrit Open-Meteo, mais côté utilisateur ça se lit comme une promesse sur l'app, qui est propriétaire. | Reformuler (ex. « Données : Open-Meteo, CC BY 4.0 »). |
| A9 ✅ | **Open-Meteo : usage non commercial** | Conditions publiques d'Open-Meteo (https://open-meteo.com/en/terms, consultées le 2026-11-01) : l'API gratuite est réservée à un usage non commercial (sites/apps privés ou à but non lucratif, sans abonnement ni publicité) ; limites 600/min, 5 000/h, 10 000/j par IP ; licence CC BY 4.0 (attribution). Un produit commercial ou avec pubs/abonnement exige l'offre payante. | **À trancher avant toute publication Google Play** si l'app est monétisée, ou si la licence propriétaire vise un usage commercial. Prévoir attribution CC BY 4.0 dans l'app. |
| A10 ✅ | Double chemin réseau | Le README impose « toute la logique métier, la gestion des APIs en Rust » (ligne 45), mais `src/services/weather.ts` et `src/services/geocoding.ts` appellent directement `fetch()` vers Open-Meteo, en parallèle des commandes Tauri (`src/services/tauri.ts` → `src-tauri/src/weather.rs`, `geocoding.rs`). Deux implémentations à maintenir, et le cache offline Rust peut être contourné. | Choisir un chemin unique (Rust) ; garder l'autre en commentaire. Tâche à ouvrir dans `TODO_TECHNIQUE.md`. |
| A11 ✅ | Langue par défaut | `src/hooks/useAppState.ts:10` : `language: 'en'`, alors que l'objectif est le français par défaut avec langues choisissables (déjà T-011). | Mettre `'fr'` par défaut et exposer un sélecteur ; cohérent avec T-011. |
| A12 ✅ | `SECURITY.md` non rempli | Le fichier est le modèle GitHub (« Use this section… », versions `?`). Aucun canal de signalement réel. | Le remplir (contact, versions supportées) — important pour un dépôt qui touche à la vie privée. |
| A13 ✅ | Sécurité / CI encore rouges | D'après `docs/TODO_TECHNIQUE.md` : T-002/T-003/T-004 ouverts (avis `braces`, avertissements `cargo-audit`, audit `npm audit` incohérent avec pnpm, CodeQL Java/Kotlin). T-001 coché ≠ sécurité globale validée (le fichier le dit déjà). | Suivre les tâches existantes ; ne rien désactiver. |
| A14 ⚠️ | Tests sur appareil | Les objectifs Android/GrapheneOS (hors ligne, permissions, notifications) ne sont documentés comme testés nulle part. | Ajouter un tableau « testé sur : appareil / OS / date ». |
| A15 ⚠️ | Mention PR #186 périmée | Le README racine dit « non fusionnée au 22 octobre 2026 ». La PR #186 a été fusionnée le 27 octobre 2026 (à revérifier sur GitHub). La mention est historique, pas fausse à sa date. | Ajouter « (fusionnée le 27 octobre 2026) » en gardant l'ancienne phrase en commentaire. |

### B. Points d'ambition / présentation

- **B1 ⚠️** La présentation est ambitieuse (météo, air, pollen, hors ligne, GrapheneOS, multi-plateforme). Le README racine et la roadmap sont honnêtes là-dessus ; la page affichée par GitHub l'est moins (voir A6). Prioriser un MVP lisible (heure locale + météo) pour la page publique.
- **B2 ⚠️** « Publication Play Store » figure dans les objectifs : voir A9 (Open-Meteo) et A12 (SECURITY) comme prérequis.
- **B3 ⚠️** Le dépôt a beaucoup de volume documentaire (ROADMAP, TODO, docs/ai, reports, inventaires). C'est voulu (traçabilité), mais un visiteur n'a aucun point d'entrée « 30 secondes » : un court paragraphe « Qu'est-ce que c'est / où en est-on / comment aider » en tête de `.github/README.md` suffirait.

### C. Remarques RETIRÉES (fausses ou levées par la lecture du contexte)

- ❌ **npm + pnpm en même temps**, lockfiles et variantes (`package-lock.main*.json`, snapshots) : choix volontaire (plusieurs outils : ChatGPT, Codex, Claude, Bolt, Cursor…). Aucune suppression à proposer.
- ❌ **Code commenté / variantes historiques / scripts Windows** : règle « ghost code » d'`AGENTS.md`, à conserver.
- ❌ **Dépôt « sans processus »** : le contrat `docs/ai/WORKING_CONTRACT.md` (ChatGPT audite, Codex exécute, humain décide) existe et est suivi ; mes premières critiques l'ignoraient.
- ❌ **Bilingue partout** : la règle FR→EN s'applique aux commentaires de code et aux README, pas à tous les docs de gouvernance.
- ❌ **« Roadmap = promesse »** : la ROADMAP dit explicitement le contraire.
- ❌ **Licence « manquante »** : `LICENSE` existe (tous droits réservés) ; le vrai sujet est la cohérence des mentions (A7, A8).

### D. Limites de cette relecture

- `.bolt/prompt` n'a pas pu être lu via l'outil web (site bloquant les robots) ; seul son contenu cité par T-014 est connu.
- Aucun build, aucun test, aucune exécution sur appareil n'ont été faits : constats de lecture de code uniquement.
- Les conditions Open-Meteo peuvent évoluer ; relire la page officielle avant décision.
- Cette PR n'autorise ni fusion, ni déploiement, ni modification de licence.

---

## English

### Scope and method

- Review requested by ÆtherXYZ: README, presentation, ambitions, features.
- The first pass was **too hasty**, done before reading `AGENTS.md`, the roadmaps and the AI docs. Several critiques were wrong; they are listed in section C for the record.
- Every A/B remark is **re-verified on `main` at commit `8a1505d`** (November 1, 2026). No code is changed in this PR: documentation only.
- Legend: ✅ still valid · ⚠️ to verify / depends on a decision · ❌ withdrawn.

### A. Remarks still valid

| # | Topic | Verified finding | Suggestion (not applied here) |
|---|-------|------------------|-------------------------------|
| A1 ✅ | Spec rendered as code | In `.github/README.md`, lines 5–233 are wrapped in a ```` ```markdown ```` block, so GitHub shows raw text instead of a formatted page. | Remove (or comment out) both fences, **without deleting** the text (ghost-code rule). |
| A2 ✅ | Wrong install steps | `git clone .../VotreOrg/QuelleHeureEst-Il.com.git` (placeholder) and `cd apps/desktop` (no `apps/` folder; the frontend is at the root: `src/`, `src-tauri/`). | Use the `Phoen0x/...` URL and the real commands (`pnpm install`, `pnpm tauri dev`); keep the old text commented. |
| A3 ✅ | Unclosed code fence | The "Cloner le projet" `bash` block (line 243) is never closed before the next one; the install section renders broken (9 fences, odd count). | Close the block. |
| A4 ✅ | Two READMEs hide each other | GitHub shows `.github/README.md` (higher priority); the more honest root `README.md` is not what visitors see. | Keep both (deliberate), but add a link to tracking and roadmap at the top of `.github/README.md`. |
| A5 ✅ | Stray line | Root `README.md` starts with "README de l'app et pas de github" followed by `---`. | Comment it out or move it to an HTML note. |
| A6 ✅ | No "goal ≠ implemented" banner in the displayed README | The root README says it; `.github/README.md` presents everything in the present tense. | Add the same warning plus a per-feature status (planned / in progress / tested). |
| A7 ✅ | "open-source" wording | `.github/README.md` line 8 says "open-source"; its own license section and `LICENSE` say the opposite. Same for `.bolt/prompt` (already T-014). | Handle via T-014 without changing rights incidentally. |
| A8 ✅ | Misleading attribution text in the UI | `src/components/Dashboard.tsx:71` shows "Open-source & free to use". It describes Open-Meteo, but users read it as a claim about the (proprietary) app. | Reword (e.g. "Data: Open-Meteo, CC BY 4.0"). |
| A9 ✅ | **Open-Meteo: non-commercial use** | Open-Meteo's public terms (https://open-meteo.com/en/terms, checked 2026-11-01): the free API is for non-commercial use only (private or non-profit sites/apps, no subscription or ads); limits 600/min, 5,000/h, 10,000/day per IP; CC BY 4.0 attribution. Commercial products, ads or subscriptions require a paid plan. | **Decide before any Google Play release** if monetized or if the proprietary license targets commercial use. Add CC BY 4.0 attribution in-app. |
| A10 ✅ | Two network paths | The README mandates all business logic and API handling in Rust (line 45), yet `src/services/weather.ts` and `geocoding.ts` call `fetch()` to Open-Meteo directly, alongside the Tauri commands (`src/services/tauri.ts` → `src-tauri/src/weather.rs`, `geocoding.rs`). Two implementations to maintain; the Rust offline cache can be bypassed. | Pick a single path (Rust); keep the other commented. Open a task in `TODO_TECHNIQUE.md`. |
| A11 ✅ | Default language | `src/hooks/useAppState.ts:10`: `language: 'en'`, while the goal is French by default with selectable languages (already T-011). | Default to `'fr'` and expose a selector; consistent with T-011. |
| A12 ✅ | `SECURITY.md` unfilled | It is the GitHub template (versions `?`). No real reporting channel. | Fill it in (contact, supported versions). |
| A13 ✅ | Security / CI still red | Per `docs/TODO_TECHNIQUE.md`: T-002/T-003/T-004 open (`braces` advisory, `cargo-audit` warnings, `npm audit` inconsistent with pnpm, CodeQL Java/Kotlin). T-001 checked ≠ global security validated (the file already says so). | Follow existing tasks; disable nothing. |
| A14 ⚠️ | On-device testing | Android/GrapheneOS goals (offline, permissions, notifications) are not documented as tested anywhere. | Add a "tested on: device / OS / date" table. |
| A15 ⚠️ | Stale PR #186 mention | Root README says "unmerged as of October 22, 2026". PR #186 was merged on October 27, 2026 (re-check on GitHub). It is historical, not wrong at its date. | Add "(merged October 27, 2026)" and keep the old sentence commented. |

### B. Ambition / presentation points

- **B1 ⚠️** The presentation is ambitious (weather, air, pollen, offline, GrapheneOS, multi-platform). The root README and roadmap are honest about it; the GitHub-displayed page less so (see A6). Prioritize a readable MVP (local time + weather) on the public page.
- **B2 ⚠️** "Play Store publication" is a stated goal: see A9 (Open-Meteo) and A12 (SECURITY) as prerequisites.
- **B3 ⚠️** The repo has a lot of documentation (ROADMAP, TODO, docs/ai, reports, inventories). It is intentional (traceability), but visitors have no 30-second entry point: a short "What is it / where are we / how to help" paragraph at the top of `.github/README.md` would do.

### C. WITHDRAWN remarks (wrong or lifted after reading the context)

- ❌ **npm + pnpm together**, lockfiles and variants (`package-lock.main*.json`, snapshots): deliberate (several tools: ChatGPT, Codex, Claude, Bolt, Cursor…). No deletion to suggest.
- ❌ **Commented code / historical variants / Windows scripts**: `AGENTS.md` "ghost code" rule, to be kept.
- ❌ **Repo "has no process"**: `docs/ai/WORKING_CONTRACT.md` (ChatGPT audits, Codex executes, human decides) exists and is followed; my first critiques ignored it.
- ❌ **Bilingual everywhere**: the FR→EN rule covers code comments and READMEs, not every governance doc.
- ❌ **"Roadmap = promise"**: the ROADMAP explicitly says otherwise.
- ❌ **License "missing"**: `LICENSE` exists (all rights reserved); the real issue is mention consistency (A7, A8).

### D. Limits of this review

- `.bolt/prompt` could not be read through the web tool (site blocks robots); only what T-014 quotes is known.
- No build, test or on-device run was performed: code-reading findings only.
- Open-Meteo terms may change; re-read the official page before deciding.
- This PR authorizes no merge, deployment or license change.
