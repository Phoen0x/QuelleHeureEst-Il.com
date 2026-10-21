# IA — relais et protocole de développement

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
- [Relais de complétude Codex — 21 octobre 2026](SESSION_CODEX_COMPLETENESS_2026-10-21.md) : constat daté, limité à une seule conversation ; les preuves à expiration et les traces perdues ne sont pas certifiées récupérables.
- **État :** la seconde conversation Codex, les autres conversations ChatGPT et les inventaires courants d'alertes privées nécessitent des contrôles distincts ; ne pas annoncer un archivage exhaustif avant ces vérifications.

## Continuity and privacy references — English

- [Initial ChatGPT conversation coverage audit — October 21, 2026](SESSION_CHATGPT_INITIAL_AUDITS_COMPLETENESS_2026-10-21.md): maps early reviews and the #167 handoff to existing versioned sources, without personal data or transcripts.
- [Technical knowledge and privacy policy](KNOWLEDGE_PRIVACY_POLICY.md): what belongs in GitHub, what must remain private, redacted extraction from conversations, and separate auditing of each session. **Never publish personal information or diagnoses to explain a workflow preference.**
- [Codex completeness handoff — October 21, 2026](SESSION_CODEX_COMPLETENESS_2026-10-21.md): a dated report covering one conversation only; expired artifacts and lost traces cannot be certified as recoverable.
- **Status:** the other Codex conversation, remaining ChatGPT project conversations and current private security alert inventories require separate checks. No comprehensive archival claim is justified yet.
