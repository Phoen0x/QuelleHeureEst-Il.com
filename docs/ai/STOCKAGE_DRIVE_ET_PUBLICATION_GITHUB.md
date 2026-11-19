# Stockage Google Drive et source de vérité GitHub — règle durable

**Décision de l'utilisatrice du 19 novembre 2026.** Cette documentation ne constitue aucune autorisation de fusion, suppression, réécriture d'historique, modification de droits ou publication de données privées.

## 1. GitHub : source de vérité des informations techniques publiables

Le dépôt `Phoen0x/QuelleHeureEst-Il.com` est la source de vérité **versionnée** pour le code, les configurations, contrats d'agents, décisions, invariants, recherches, audits, corrections, limites, tests, preuves expurgées, empreintes et passations **publiables**. Ne pas laisser les nouvelles conclusions techniques durables uniquement dans ChatGPT, Codex ou Google Drive : publier une version contrôlée et expurgée dans les fichiers ou PR appropriés.

Cela ne signifie pas copier tout contenu non privé tel quel dans Git : gros binaires, caches, journaux temporaires et contenus soumis aux droits de tiers peuvent nécessiter des empreintes, une procédure reproductible et un pointeur vers leur source primaire. Une PR non fusionnée n'est pas automatiquement présente dans `main` ; identifier sa branche et son SHA. La CI et l'état GitHub courant font autorité pour les faits versionnés.

## 2. Drive : dossier racine unique pour QHEI

Tout fichier Google Drive appartenant au projet doit se trouver **exclusivement** dans le dossier racine privé de Mon Drive nommé `QuelleHeureEst-Il?.com`, ou dans un de ses sous-dossiers. Ne pas créer de dossiers parallèles dédiés au projet dans `ChatGPT`, à la racine ou dans des dossiers d'autres projets.

Arborescence initiale recommandée :

- `QuelleHeureEst-Il?.com/Archives privées/ChatGPT et Codex` : conversations et passations non publiques, copies brutes conservées ;
- `QuelleHeureEst-Il?.com/Archives privées/Rapports et preuves` : rapports bruts, preuves et données sensibles non publiables.

Les futurs sous-dossiers doivent rester descendants de cette même racine. Les identifiants et URL réels des ressources privées ne doivent être consignés que dans un **index privé du Drive**, jamais dans ce dépôt public.

Avant chaque création ou déplacement : rechercher l'emplacement existant, vérifier les doublons, l'identité, les permissions, les parents et la provenance. Préférer un déplacement conservant l'ID et l'historique ; vérifier les résultats. Ne supprimer, remplacer, dupliquer, déplacer un élément ambigu, partager ou modifier une permission sans autorisation explicite. L'organisation d'autres projets reste indépendante.

## 3. Frontière de confidentialité et preuves

Ne jamais publier en clair dans le dépôt public des transcriptions privées, secrets, identifiants d'accès, coordonnées, renseignements médicaux ou personnels, données de compte, chemins privés, logs non expurgés, URL/ID de dossiers privés ou pièces non redistribuables. Une information technique sensible exige une synthèse publique **expurgée** et suffisamment justifiée ; conserver le brut dans Drive privé sans lier directement les copies sensibles. La possibilité de lire un document ne prouve pas un droit à sa publication.

Un dossier Drive privé ne remplace pas GitHub comme référentiel de code et de décisions publiables, et GitHub ne doit pas devenir un miroir des archives privées. Documenter la provenance et les limites des preuves sans divulguer les données protégées.

## 4. Contrôles et limites

À la reprise d'un travail ou lors de la production d'une archive, vérifier la structure Drive accessible et rechercher les noms et termes techniques pertinents pour identifier les fichiers égarés. Une recherche par nom/texte **ne garantit pas** l'exhaustivité des fichiers non indexés, mal nommés ou sans droits d'accès ; consigner la limite sans inventer de certitude.

Toute publication GitHub reste soumise aux règles de conservation, de sécurité, de revue indépendante et d'autorisation humaine de fusion. Tant que cette règle est proposée dans une PR non fusionnée, signaler ce statut explicitement aux agents.

## 5. Références

- [Instructions des agents](../../AGENTS.md)
- [Contrat durable](WORKING_CONTRACT.md)
- [Index IA](README.md)
- [Politique de confidentialité](KNOWLEDGE_PRIVACY_POLICY.md)
- [Registre des décisions](REGISTRE_DECISIONS_ET_INVARIANTS.md)

Ce texte complète les instructions canoniques sans réécrire les rapports historiques.
