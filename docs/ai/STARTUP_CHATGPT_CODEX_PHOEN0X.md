# Reprise Phoen0x — ChatGPT et Codex uniquement

**Portée :** applicable à ChatGPT et Codex dans le cadre des missions Phoen0x. **Non applicable à Claude et à Bolt/StackBlitz** : ne pas modifier leurs consignes. À effectuer au début d'une nouvelle conversation ou d'un nouvel environnement de travail, après une reprise sans contexte fiable ou lors d'un changement de dépôt ; pas à chaque message.

## Niveau 1 — Découverte indispensable

1. Identifier la mission, le dépôt cible, la branche, le SHA et les permissions. Vérifier l'état GitHub courant.
2. **Lister tous les dépôts Phoen0x accessibles**, sans supposer que la liste historique est complète.
3. Pour **chaque dépôt**, consulter sa **page de projet GitHub** (présentation, description et statut), **lire son README principal et tout README de présentation** (notamment `.github/README.md` lorsqu'il existe), relever la licence applicable, la branche par défaut et le lien vers le code. Consulter les pages de présentation liées depuis ces README.
4. Pour le dépôt ciblé, consulter aussi `AGENTS.md`, les consignes applicables, `LICENSE`, `SECURITY.md` et, pour QuelleHeureEst-Il.com, `docs/ai/WORKING_CONTRACT.md`, `docs/ai/README.md`, `docs/ai/KNOWLEDGE_PRIVACY_POLICY.md`, la roadmap et le backlog, puis les relais et PR pertinents.

**Ne jamais dire « tout lu » si des documents n'ont été vus que partiellement.** Signaler les absences et limites d'accès.

## Niveau 2 — Analyse approfondie à la demande

Étudier les autres dépôts dans le détail uniquement lorsqu'une dépendance, une mission transversale, un risque ou une demande l'exige. Éviter l'audit complet du code, des PR et de l'historique de tous les dépôts à chaque initialisation.

## Économie de contexte et traçabilité

- Résumer l'inventaire en **une ou deux lignes par dépôt**, avec rôle, statut, licence, liens et SHA lorsque disponible. Garder des références plutôt que recopier de longs fichiers ou conversations.
- Lire les documents longs en sections et approfondir à la demande. Ne pas recharger le contenu inchangé au **même SHA** dans une session où il a déjà été analysé ; après compaction, reprendre les résumés sourcés puis compléter les manques.
- Distinguer objectifs et fonctionnalités réelles, licence et déclarations historiques, PR non fusionnée et `main`, audit exécuté et annoncé.
- Ne pas publier de secrets, de données personnelles ni de conversations privées sur le dépôt public ; appliquer la politique de confidentialité.
- **Lire n'autorise aucune écriture.** Ne rien fusionner, supprimer, fermer ou modifier hors mission expressément autorisée.

À la reprise, donner un bilan concis des dépôts recensés/consultés, des limites et **une seule prochaine action**. Ce fichier versionné ne garantit pas sa découverte automatique dans un chat ou un outil dépourvu d'accès au dépôt ; ne pas revendiquer une mémoire automatique partagée.
