# Contrat durable de travail IA — QuelleHeureEst-Il.com

## 1. Répartition des responsabilités

- **L'utilisatrice** décide des objectifs, du comportement produit, des licences, des permissions, des changements sensibles et de toute fusion.
- **ChatGPT (pilotage et audit)** recherche les preuves dans GitHub, définit une mission isolée avec critères d'acceptation, relit les diffs et journaux au SHA exact, signale les lacunes et propose **une seule prochaine action concrète**. Il ne se contente jamais de reproduire le compte-rendu d'un agent.
- **Codex (exécution)** reçoit une mission circonscrite et une branche de travail dédiée ; il inspecte, modifie uniquement le périmètre autorisé, teste, documente le résultat et crée une PR sans fusion. Ne pas prolonger indéfiniment une même session : transmettre puis repartir sur une tâche fraîche.
- **GitHub et sa CI** sont la source de vérité pour les fichiers versionnés, les SHA, les PR, les checks et journaux. Un résultat sans preuve doit être qualifié comme tel.
- **Autres IA et sous-agents** : lecture/revue indépendante par défaut. Au plus un agent écrivain par branche/périmètre à un instant donné ; pas de modifications parallèles du même verrou ou fichier.

## 2. Contraintes non négociables

1. Préserver toutes les dépendances directes, transitives, optionnelles et natives, y compris les variantes de plateforme/Android, leurs versions et leurs représentations dans les lockfiles. Toute différence doit être justifiée et revue ; **ne pas supprimer automatiquement**.
2. Conserver les fichiers historiques, archives, commentaires, code fantôme, variantes désactivées et les configurations distinctes de Git/GitHub, StackBlitz/Bolt, Cursor, Claude et ChatGPT/Codex. Une duplication apparente n'autorise pas une suppression. Ne pas réactiver du code historique dans les artefacts par inadvertance.
3. Ne pas modifier sans autorisation explicite les licences, textes juridiques, règles de sécurité, seuils d'audit, permissions, protections de branche ni le workflow .github/workflows/auto-approve.yml.
4. Ne pas fusionner, fermer ou supprimer une PR/branche, lancer d'automerge, forcer un push ou réécrire une autre branche sans autorisation explicite.
5. Ne jamais rendre un audit vert en masquant l'alerte, en supprimant une dépendance, ou en ajoutant un ignore non autorisé.
6. Avant une action susceptible de fermer ou de modifier des PR de bots, vérifier le **comportement effectif du service complet** et les protections des PR existantes ; une simulation isolée ne suffit pas.
7. Conserver les priorités techniques décrites dans AGENTS.md, dont Rust-first, local/offline-first, priorité Android, vie privée, GrapheneOS et commentaires français puis anglais.

## 3. Déroulement standard : une seule mission à la fois

1. **Cadrage.** Consulter AGENTS.md et les rapports pertinents ; lire l'état GitHub actuel, les PR et SHA concernés, les variantes historiques. Délimiter une seule mission, les fichiers autorisés, les risques et les critères mesurables.
2. **Exécution.** Travailler sur branche distincte avec changements minimaux, sauvegarde des sources historiques et synchronisation du SHA avant toute écriture. Ne pas appliquer d'anciens générateurs mutateurs sans vérification du garde-fou.
3. **Validation.** Indiquer les commandes et versions exactes, environnements, SHA, résultats debug/release, lockfiles, lint/format, tests, audits et CI. Distinguer clairement succès, échec, skipped, tests simulés, analyses en lecture seule et vérifications jamais réalisées. Tester Android et les environnements réels seulement quand l'outillage requis est effectivement disponible ; ne rien certifier sans exécution.
4. **Publication.** Lier la PR, les commits, journaux CI, archives conservées, limites et questions humaines. Laisser la PR ouverte ; attendre une revue indépendante et l'accord de l'utilisatrice.
5. **Audit indépendant.** ChatGPT compare diff, arbres/blobs, versions, exécution des tests au dernier head et risques entre branches ; il n'accorde pas de validation sur la seule déclaration « fait » de Codex.

## 4. Résilience : plantages, compaction et nouvelles conversations

- Lorsqu'une session devient longue, instable ou change de phase, **l'agent doit proposer spontanément un nouveau chat/une nouvelle tâche** ; il ne doit pas attendre une perte de contexte complète.
- **Avant le basculement**, publier ou actualiser un relais versionné sous docs/ai/ sur une branche/PR documentaire, sans toucher au code applicatif, et fournir un lien GitHub directement consultable. Ne pas obliger l'utilisatrice à copier ou téléverser un fichier lorsque l'agent peut publier lui-même.
- Le relais doit contenir décisions/contraintes, état daté de main et PR avec SHA, ce qui a effectivement été testé, erreurs/interruption, opérations incertaines, références immuables, prochaine tâche, et les écarts avec les rapports antérieurs.
- **Une conversation neuve ne récupère pas automatiquement l'intégralité de l'ancienne.** Elle relit les documents disponibles puis re-vérifie l'état distant. Ne pas promettre une récupération exhaustive de traces perdues.
- Si une mutation d'outil est interrompue ou sa réponse inconnue, **relire l'état distant avant toute répétition** ; jamais de retry aveugle susceptible de doubler un commit/commentaire/PR.
- Chaque nouveau rapport met à jour des faits datés sans réécrire les archives : les preuves anciennes restent consultables et le dernier état prévaut pour les décisions à venir.

## 5. Ergonomie des échanges

- Réponses directes, courtes et structurées autour d'**une seule action demandée à l'utilisatrice**. Éviter de lui déléguer des transferts et inventaires réalisables directement par les outils disponibles.
- Donner le résultat concret d'abord ; proposer les détails supplémentaires uniquement lorsqu'ils sont nécessaires.
- Ne jamais promettre d'avoir publié, fusionné, exécuté un test ou transféré une conversation sans confirmation effective de l'outil.

## 6. Répartition cible des bots (décision, mais non déployée)

- Dependabot : correctifs de sécurité tous écosystèmes y compris Cargo/transitifs, mises à jour de versions JavaScript/pnpm et GitHub Actions.
- Renovate : versions Cargo ordinaires, fenêtre 18 h–23 h Europe/Paris, sans automerge. Les horaires ne suffisent pas à garantir absence de doublons ou ordre strict.
- Les candidats sont dans docs/proposals/bot-cohabitation-20261015 de la PR #162 ; **ils sont inactifs sur main**. Ne pas activer sans protection vérifiée des PR/branches existantes et coordination des éventuels doublons Cargo/sécurité.
- Le fichier renovate.json de la PR #153 contient encore enabled:false : résoudre explicitement les variantes historiques avant toute intégration, sans écrasement silencieux.

**Autorité :** ces règles codifient les instructions communiquées par l'utilisatrice, mais la présente PR n'est pas une autorisation de fusion, de déploiement ni de changement juridique. Les détails du projet dans AGENTS.md demeurent en vigueur.
