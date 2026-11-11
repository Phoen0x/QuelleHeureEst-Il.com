# Choix des modèles et outils — protocole permanent Phoen0x

**Recherche initiale : 11 novembre 2026.** Guide documentaire révisable ; ne modifie aucune permission, règle CI, ni disponibilité réelle.

## Règle applicable à chaque prompt et à chaque rôle

Avant chaque prompt à ChatGPT, Codex, Work ou un sous-agent, distinguer les rôles et indiquer pour chacun : **expérience/outil, modèle exact sélectionnable, réflexion, vitesse, alternative, disponibilité constatée, coût/quota relatif, sources officielles vérifiées et date**. Pour les outils sans sélecteur indépendant, écrire « non sélectionnable » ; ne jamais inventer de réglage. Revalider les options réelles avant toute mission importante et lorsque l'interface, le forfait ou les modèles changent. Une recommandation n'est pas une confirmation du réglage appliqué.

Ne jamais garantir zéro erreur : vérifier les sources, adapter le modèle à la difficulté, puis demander preuves et revue indépendante. Une augmentation d'effort ne compense ni un accès manquant ni des tests inexistants.

## Disponibilité et coûts — photographie du 11 novembre 2026

- **ChatGPT Chat** : sous GPT-6, les niveaux Instantané, Moyen et Élevé utilisent GPT-6 Sol ; Très élevé et Pro dépendent de l'abonnement. Le sélecteur Plus documenté comprend Instantané, Moyen et Élevé. GPT-6.1 Sol n'est pas une option de Chat classique.
- **Projets ChatGPT** : héritent des possibilités du compte et de l'espace de travail. Leur simple existence n'explique pas à elle seule une option absente du sélecteur.
- **Codex / Work** : GPT-6.1 Sol est adapté aux tâches complexes et au compromis performance/consommation ; GPT-6 Astra aux investigations et livrables les plus difficiles. Modèles et niveaux proposés varient selon l'accès réel.
- **Réflexion** : commencer à Moyen pour une tâche bornée ; Élevé pour une tâche difficile ; Très élevé/Ultra uniquement lorsqu'ils sont effectivement accessibles et que leur intérêt est justifié. Les intitulés API ne correspondent pas forcément aux choix de l'application.
- **Vitesse — décision opérationnelle du 11 novembre 2026** : **Standard/Normale uniquement** pour les missions Codex/Work et leurs sous-agents, quel que soit le modèle ou l'effort. **Rapide suspendu pour tous les modèles jusqu'à nouvel accord explicite de l'utilisatrice. Ultrarapide exclu sans exception tant qu'aucune décision explicite contraire n'a été donnée. En particulier, ne jamais proposer ni utiliser GPT-6 Astra en Rapide ou Ultrarapide.** Ne pas inférer une exception d'un quota disponible ou d'une échéance de réinitialisation.
- **Quotas Work/Codex** : réserve commune, avec éventuellement deux fenêtres simultanées (cinq heures, sept jours). La consommation varie selon modèle, effort, vitesse et tâche. Ne jamais transformer des pourcentages instantanés en budget fixe de tokens.

## Retour d'expérience et décision de vitesse — 11 novembre 2026

**Décision en vigueur pour les nouvelles recommandations, sans limite de date présumée :**

- Utiliser **Standard/Normale** pour toute mission Codex/Work, agent principal et sous-agents inclus ; si la vitesse n'est pas réglable, consigner la vitesse effectivement observée et signaler l'impossibilité de la modifier.
- **Ne sélectionner Rapide pour aucun modèle** tant que l'utilisatrice ne l'a pas réautorisé explicitement. **Ne sélectionner Ultrarapide pour aucun modèle**, sauf nouvelle décision explicite qui remplace cette interdiction.
- **GPT-6 Astra en Rapide ou Ultrarapide est particulièrement exclu**. Astra reste éligible en vitesse Standard/Normale selon la difficulté et le quota.
- Le choix de réflexion (Moyen, Élevé, etc.) et celui du modèle restent indépendants de la vitesse ; ne pas diminuer automatiquement l'effort nécessaire pour compenser une vitesse Standard.
- Retenir comme retour d'expérience qu'une mission Cloud complexe peut épuiser une fenêtre d'usage avant d'avoir publié son livrable. Imposer des jalons de reprise, la réutilisation de l'état existant et l'absence d'analyses redondantes.
- Ne pas publier ici les quotas individuels, leur solde, leurs échéances, les identifiants de session ou toute autre télémétrie personnelle.

**English:** Standard/Normal speed only for all Codex/Work roles. Fast is suspended until explicit user re-authorization; Ultrafast is prohibited unless explicitly overturned. In particular, never recommend or use GPT-6 Astra in Fast or Ultrafast. Keep milestone-based resumability and private usage outside the public repo.

## Matrice de recommandations de départ

| Rôle | Expérience | Modèle si disponible | Réflexion | Vitesse | Alternative |
|---|---|---|---|---|---|
| Coordination, contre-expertise et arbitrage de PR | Chat dans Projet | GPT-6 Sol | Élevé | Non réglable séparément | Moyen pour lecture simple |
| Question courte, synthèse | Chat | GPT-6 Sol | Instantané ou Moyen | Non réglable séparément | Élevé si forte incertitude |
| Implémentation complexe, migration et tests (ex. SQLite) | Codex | GPT-6.1 Sol | Élevé | Standard/Normale | Astra Moyen si difficulté exceptionnelle |
| Audit de sécurité particulièrement difficile | Codex ou Work distinct | GPT-6 Astra | Moyen puis Élevé si utile | Standard/Normale | GPT-6.1 Sol Élevé si budget serré |
| Modification mécanique, documentation | Codex ou Work | Modèle économique disponible | Faible/Moyen selon menu | Standard/Normale | Sol Moyen |
| Recherche et livrable multi-apps | Work | GPT-6.1 Sol | Moyen, voire Élevé | Standard/Normale | Astra Moyen pour cas exceptionnel |

Ce tableau n'est **ni un classement absolu ni une configuration déjà appliquée**. Astra à effort moindre peut surpasser Sol à effort élevé ; choisir selon les critères mesurables du travail et le quota disponible. Ne jamais confondre le **mode Rapide** avec le **niveau de réflexion Élevé**.

## Outils sans modèle sélectionnable

Recherche Web, connecteur GitHub, terminal, compilateurs Rust, Python, pnpm et GitHub Actions ne fournissent pas dans cette orchestration un sélecteur autonome de modèle/effort/vitesse. Indiquer les réglages de **l'agent pilote** et les capacités de l'outil, et non attribuer un modèle fictif à l'outil. Chat coordonne et examine ; Work prend en charge la recherche/livrable multistep ; Codex exécute le code, les tests et les revues techniques. Les preuves au SHA exact et les validations de sécurité sont indépendantes des modèles.

## Confidentialité, quotas et entretien

Avant une mission consommatrice, vérifier les deux soldes et heures de réinitialisation **actuels si l'utilisatrice les communique**, puis adapter l'ordre des missions. Ne pas prétendre connaître les quotas en temps réel ni leur coût exact. **Ne jamais inscrire dans ce dépôt public les chiffres d'utilisation privés, horaires de session individuels, captures, secrets ou détails personnels.**

À chaque nouvelle délégation, vérifier dans la documentation officielle la disponibilité, l'effort et les options de vitesse. En cas d'écart, documenter l'incertitude et proposer une alternative accessible. Actualiser ce fichier par PR documentaire sans réécrire les décisions historiques.

## Sources officielles (consultées le 11 novembre 2026)

- https://help.openai.com/fr-fr/articles/20001354-gpt-6-and-other-models-in-chatgpt
- https://help.openai.com/fr-fr/articles/10169521-projects-in-chatgpt
- https://help.openai.com/fr-fr/articles/20001275-chatgpt-work-and-codex
- https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex
- https://developers.openai.com/api/docs/guides/model-selection
- https://openai.com/fr-FR/index/practical-guide-building-gpt-6/

## English — operating summary

Before every prompt and for each separate role, state exact selectable model, reasoning effort, speed, fallback, eligibility, official sources and quota trade-off. Distinguish Chat, Work, Codex and tools without their own model controls. Recheck current offerings and never claim a recommendation has been applied automatically. Do not publish private usage snapshots. No merge, security-policy change or bypass is authorized by this guidance.
