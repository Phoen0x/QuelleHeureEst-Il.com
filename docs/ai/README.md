# IA — relais et protocole de développement

**Journal commun des IA :** [incidents, solutions, preuves et idées en attente](JOURNAL_DE_BORD_TECHNIQUE.md). Toute IA doit le consulter à la reprise, puis documenter les nouveaux incidents et les résolutions prouvées sur la branche autorisée, sans données privées ni écrasement d'historique. Cette nouvelle entrée documentaire est proposée par la PR #186 et n'est pas encore sur `main`.

**Shared AI engineering log:** [incidents, fixes, evidence, and pending ideas](JOURNAL_DE_BORD_TECHNIQUE.md). Review it at handoff and record confirmed outcomes on the authorized branch, without personal data, history rewrites, or unauthorized edits. This journal is proposed by draft PR #186; it is not yet on `main`.


Ce répertoire est la porte d'entrée stable pour reprendre le projet après un changement de conversation ChatGPT ou une compaction/interruption de Codex.

- [Relais vérifié du 16 octobre 2026](PROJECT_RELAY_2026-10-16.md) : photographie datée, décisions, PR, commits, résultats et inconnues. **Ne pas considérer cette photographie comme l'état courant sans nouvel accès à GitHub.**
- [Contrat durable de travail avec les IA](WORKING_CONTRACT.md) : rôles, permissions, préservation, preuves, reprise après panne, communication et limites.
- [Instructions de projet AGENTS.md](../../AGENTS.md) : contenu repris **à l'identique** du fichier de la PR #153 pour éviter une consigne concurrente.
- [Rapports détaillés de #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0ebc167c8febf1b61752d1114f8135a59400c5f1/docs/reports/pr153-relais-20261014/README.md).
- [Rapport et configuration candidate de #162](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/4d4efbb05793bf4bfc0eee8a27eb026cb8f1dd9a/docs/proposals/bot-cohabitation-20261015/README.md).

**Statut de publication :** ce répertoire est proposé par une PR documentaire séparée. Tant que cette PR n'est pas fusionnée, les nouveaux agents doivent utiliser ses liens sur la branche et ne pas supposer qu'il est déjà sur main.

**Consigne de reprise :** lire ces trois documents, vérifier main et les PR auprès de GitHub, présenter brièvement les écarts avec la photographie, puis choisir **une seule mission suivante**. Aucune modification automatique.

## Complément de collaboration — français

Le texte ci-dessus est conservé comme contexte de #167 : la mention « à l'identique » décrit sa publication initiale. Le complément actuel de [AGENTS.md](../../AGENTS.md) renvoie au [contrat, sections 7 à 13](WORKING_CONTRACT.md#7-passage-de-relais-obligatoire) : relais et bilan obligatoires, portée du bilinguisme, réseau borné, reprise après panne, découverte des règles et ergonomie des échanges. Les commentaires/annotations techniques du code et les README suivent l'ordre français puis anglais ; conversations, prompts, bilans et relais restent en français sauf demande contraire.

Le [rapport de vérification documentaire](COLLABORATION_VALIDATION_2026-10-16.md) indique la base, les contrôles et les limites. Au relevé décrit dans ce rapport, `AGENTS.md` et `docs/ai/WORKING_CONTRACT.md` sont **absents de main** : cette PR et #167 ne sont pas fusionnées. Un nouvel agent partant de main ne découvrira pas automatiquement ces règles. Lui fournir le lien de la PR et son SHA ; relire l'état GitHub actuel, sans fusion automatique ni transfert manuel des fichiers.

À la fin d'une mission Codex pilotée par ChatGPT, donner le statut réel, les liens, le SHA, les tests, les blocages et le destinataire, puis terminer par : « Mission terminée. Reviens voir ChatGPT avec le numéro de cette PR pour sa revue indépendante. » L'orchestrateur fournit une seule prochaine action et, lorsqu'il délègue à Codex, le prompt prêt à copier.

## Collaboration addendum — English

The text above remains as #167 context: “identical” refers to its initial publication. The current [AGENTS.md](../../AGENTS.md) addendum points to [contract sections 7–13](WORKING_CONTRACT.md#7-passage-de-relais-obligatoire): mandatory handoff and final report, language scope, bounded network calls, failure recovery, instruction discovery and interaction ergonomics. Technical code comments/annotations and repository READMEs use French followed by English; conversations, prompts, reports and handoffs remain in French unless the user requests otherwise.

The [documentary verification report](COLLABORATION_VALIDATION_2026-10-16.md) records the baseline, checks and limitations. At the recorded observation, `AGENTS.md` and `docs/ai/WORKING_CONTRACT.md` are **absent from main**: this PR and #167 remain unmerged. An agent starting from main will not discover these rules automatically. Provide the PR link and exact SHA, recheck current GitHub state, and require neither automatic merging nor manual file transfer.

At the end of a ChatGPT-directed Codex mission, provide the actual status, links, SHA, tests, blockers and recipient, then end with the exact French sentence quoted above. The orchestrator provides one next action and, when delegating to Codex, a ready-to-copy prompt.

## Références de continuité et confidentialité — français

- [Audit de couverture de l'ancienne conversation ChatGPT — 21 octobre 2026](SESSION_CHATGPT_INITIAL_AUDITS_COMPLETENESS_2026-10-21.md) : rapprochement des premiers audits et de la création de #167 avec les documents déjà versionnés, sans données privées ni transcription.
- [Politique de mémoire technique et de confidentialité](KNOWLEDGE_PRIVACY_POLICY.md) : ce qui est conservé dans GitHub, ce qui doit rester privé, extraction expurgée depuis les conversations et contrôle séparé de chaque session. **Ne jamais publier de données personnelles ou de diagnostic pour expliquer une préférence de travail.**
- [Relais du Codex récent — 21 octobre 2026](SESSION_CODEX_COMPLETENESS_2026-10-21.md) : couverture datée de la session récente, notamment #170–#179, avec limites de preuve explicites.
- [Relais du Codex ancien #153/#162 — 21 octobre 2026](SESSION_CODEX_PR153_PR162_COMPLETENESS_2026-10-21.md) et [JSON de preuves](SESSION_CODEX_PR153_PR162_COMPLETENESS_2026-10-21_EVIDENCE.json) : inventaire des décisions fondatrices, audits, garde-fous et limites, distinct de la session récente.
- **État vérifié au 21 octobre 2026 :** les deux conversations Codex et l'ancienne conversation ChatGPT des premiers audits ont chacune un relais versionné, distinct, relu par l'orchestrateur. Leur couverture concerne les informations encore accessibles, non les transcriptions perdues ou toutes les autres conversations. Les inventaires d'alertes privées, les preuves CI temporaires et toute autre conversation demandent encore une vérification spécifique. **Le dépôt ne contient pas une sauvegarde exhaustive de tous les chats.**

## Continuity and privacy references — English

- [Initial ChatGPT conversation coverage audit — October 21, 2026](SESSION_CHATGPT_INITIAL_AUDITS_COMPLETENESS_2026-10-21.md): maps early reviews and the #167 handoff to existing versioned sources, without personal data or transcripts.
- [Technical knowledge and privacy policy](KNOWLEDGE_PRIVACY_POLICY.md): what belongs in GitHub, what must remain private, redacted extraction from conversations, and separate auditing of each session. **Never publish personal information or diagnoses to explain a workflow preference.**
- [Recent Codex handoff — October 21, 2026](SESSION_CODEX_COMPLETENESS_2026-10-21.md): covers the recent Codex session and its stated evidence limits.
- [Earlier Codex handoff (#153/#162) — October 21, 2026](SESSION_CODEX_PR153_PR162_COMPLETENESS_2026-10-21.md) and [evidence JSON](SESSION_CODEX_PR153_PR162_COMPLETENESS_2026-10-21_EVIDENCE.json): separate audit of the earlier session.
- **Verified status on October 21, 2026:** the two Codex sessions and the earlier ChatGPT initial-audits conversation each have a separately versioned handoff. Coverage is limited to accessible information and does not certify recovered transcripts, every other conversation, private security inventories or expiring CI artifacts. **No comprehensive archival claim is justified.**

## Nouveau relais ChatGPT V3 → V4 — 23 octobre 2026

- **[Sauvegarde technique intégrale du relais ChatGPT V3 → V4](SESSION_CHATGPT_V3_TO_V4_RELAY_2026-10-23.md)** : photographie vérifiée de main, #183/#186/#187 et des quatre dépôts Phœn0x accessibles, chronologie des correctifs HTTP/2, Vite, braces, Tokio et GLib, inventaires et SHA Git, validations locales/CI distinguées, huit avertissements Rust résiduels, autres chantiers et prochaine étude Unicode non destructive.
- **À la reprise V4 :** lire ce relais **sur la PR #186 tant qu'elle n'est pas fusionnée**, le journal commun, le contrat et la politique de confidentialité, puis revérifier les SHA. La personne responsable **conserve sa conversation Codex actuelle** et ne crée qu'une nouvelle conversation ChatGPT. Aucune modification de code ni fusion ne découle automatiquement du relais.
- **Conservation limitée aux faits publics** : pas de transcription de chat, secret, identifiant privé, contenu de fichiers sensibles, garantie de restitution de tous les logs éphémères. Les constats antérieurs restent documentés ci-dessous.

### ChatGPT V3 → V4 technical continuity — 23 October 2026

- [Current V3 → V4 technical handoff](SESSION_CHATGPT_V3_TO_V4_RELAY_2026-10-23.md) documents verified project refs, code/security changes and evidence, pending warnings and workstreams. **A dated public technical snapshot, not a verbatim chat or private-data backup.**
- Keep the **existing Codex conversation**; restart only ChatGPT, validate GitHub refs, and do not automatically merge or modify code.

## Relais courant ChatGPT V2 → V3 — 22 octobre 2026

- [Relais opérationnel ChatGPT V2 → V3](SESSION_CHATGPT_V2_TO_V3_RELAY_2026-10-22.md) : état vérifié des PR, consolidation de #183 (HTTP/2 et JavaScript), limites CI/sécurité, environnement de développement reproductible, chantiers différés et prochaine mission Vite proposée. **Photographie datée, à vérifier de nouveau avant toute écriture ou fusion.**
- Mise à jour documentaire : **#175 a été fusionnée dans main le 21 octobre 2026** ; les mentions ci-dessus de documents absents de main concernent le contexte historique de #167/#172, et non l'état actuel.
- Les comptes rendus #183 cités dans ce relais sont **sur une PR non fusionnée**. Les futurs agents doivent recevoir le SHA et la référence explicite de la PR ; le relais V2 → V3 lui-même reste sur sa branche documentaire avant validation de sa fusion.
- Ce document ne contient pas les conversations intégrales ni des informations personnelles ; toute opération GitHub nouvelle exige sa propre autorisation.

## Current ChatGPT V2 → V3 handoff — October 22, 2026

- [Current technical handoff](SESSION_CHATGPT_V2_TO_V3_RELAY_2026-10-22.md) covers verified PR state, HTTP/2 and JavaScript work on #183, outstanding CI/security issues, reproducible environment guidance and proposed Vite follow-up. It is **a dated snapshot, not live GitHub state**.
- **#175 merged into main on October 21, 2026.** Earlier claims that these AI instructions were missing from main describe the historical #167/#172 context.
- #183's work and this new handoff remain in separate unmerged PR branches until explicit authorization; neither should be treated as already merged. No private conversation transcript or personal data is archived here.
