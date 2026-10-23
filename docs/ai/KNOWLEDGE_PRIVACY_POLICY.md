# Mémoire durable du projet et frontière de confidentialité

## Objet et autorité

Le dépôt public `Phoen0x/QuelleHeureEst-Il.com` constitue la **source de vérité versionnée du projet** : instructions aux agents, décisions de maintenance, contraintes, analyses, correctifs, preuves publiables, limites et historique des missions. Les conversations ChatGPT et Codex servent au travail, mais **ne sont pas des archives fiables ni automatiquement partagées entre sessions**.

**Le dépôt n'est pas la mémoire personnelle de la personne responsable du projet.** Les préférences de méthode de travail peuvent devenir des consignes impersonnelles pour les IA ; leur origine personnelle, les conversations privées et les informations permettant d'identifier ou de profiler une personne ne doivent pas être transférées.

Cette règle s'applique à ChatGPT, Codex, sous-agents et agents futurs. Elle précise le contrat existant, sans autoriser une fusion, une activation de bot ni une modification de politique de sécurité/licence.

## Informations à consigner dans GitHub

1. **Instructions stables :** objectifs produit et architecture ; rôle de chaque agent ; règles de collaboration, de langue, d'autonomie, d'autorisation humaine, de conservation, de confidentialité, de tests et de sécurité ; modalités de reprise après interruption.
2. **Décisions et justifications :** ce qui a été choisi, refusé, différé, laissé comme variante historique, ainsi que les conséquences et conditions de réexamen. Séparer décision validée, proposition, hypothèse et question en attente.
3. **Travaux des PR/issues :** numéros, liens, base et SHA exacts, périmètre, différences, réutilisation de travaux antérieurs, tests réellement exécutés, risques, découvertes, régressions et suites éventuelles. Les descriptions de PR sont utiles, mais les faits durables doivent aussi être présents dans des fichiers versionnés.
4. **Sécurité et dépendances :** identifiants publics d'avis, sévérité *vérifiée*, état et portée du correctif, preuves de conservation des graphes, options natives/Android, licences, contrôles non conclusifs. Ne pas qualifier une alerte de résolue ou une CI de verte sur la base d'un contournement, d'une simulation ou d'une ancienne branche.
5. **Preuves reproductibles :** commandes et versions, configurations de test, SHA, rapports et journaux expurgés quand publiables ; indiquer explicitement l'expiration des artifacts externes. Un digest seul n'archive pas les octets ; ne pas promettre une conservation permanente des logs CI.
6. **Contexte intersessions :** décisions encore utiles, travaux en cours, obstacles, inconnues et prochain point de reprise. Lorsqu'un détail déjà versionné existe, référencer son chemin et son SHA plutôt que dupliquer tout le texte.

## Données à exclure du dépôt public

- Identité civile, coordonnées, adresse, localisation privée, identifiants de comptes personnels, échanges personnels, relations, éléments biographiques et informations permettant un profilage non nécessaire au projet.
- Configuration du matériel privé, inventaire des appareils personnels, habitudes et environnement domestique ; distinguer cela des **cibles techniques du produit** (p. ex. Android, GrapheneOS, Rust/Tauri, offline-first), qui peuvent figurer dans les spécifications.
- État de santé, diagnostic, handicap ou motif personnel d'une préférence ; **décrire uniquement le comportement attendu des agents**. Exemple partageable : « une seule action demandée à la fois, prompts prêts à copier, bilans brefs ».
- Mots de passe, jetons, clés, cookies, identifiants d'accès, valeurs de secrets, journaux contenant des secrets, données client/utilisateur ou extraits d'applications connectées sans autorisation. Ne jamais inclure de secret en testant l'expurgation.
- Copie intégrale de conversations ChatGPT/Codex, captures brutes, mémoires privées ou descriptions d'incidents personnels. Extraire uniquement les règles et faits techniques **nécessaires**, reformulés et filtrés.

**Règle de minimisation :** lorsqu'une consigne fonctionne sans référence personnelle, supprimer cette référence avant publication. En cas d'incertitude, ne pas publier l'information ; signaler seulement qu'un élément privé a été écarté, sans le paraphraser.

## Procédure de consolidation des conversations et des PR

1. Pour **chaque conversation Codex**, demander à l'agent qui dispose encore du contexte de dresser le relevé des règles/décisions/essais utiles non encore dans Git, de les comparer au dépôt et de déposer un relais expurgé. La première conversation auditée ne prouve rien sur une seconde conversation.
2. Pour **les conversations du projet ChatGPT**, utiliser seulement les éléments réellement accessibles à l'agent orchestrateur. Regrouper les préférences opératoires en règles impersonnelles ; ne pas affirmer avoir lu une conversation inaccessible.
3. Parcourir les PR/issues/rapports existants pour identifier les informations persistantes seulement dans une description de PR ou dans un artifact temporaire ; créer un inventaire avec **source, état, décision, emplacement versionné, manque éventuel**. Ne pas importer toutes les sorties brutes, ni changer les conclusions historiques.
4. Trier chaque proposition en **règle stable**, **décision validée**, **historique daté**, **information non vérifiée**, **donnée privée exclue**. Toute contradiction entre sources doit être signalée, non arbitrée silencieusement.
5. Consigner les règles durables dans `AGENTS.md`, `docs/ai/WORKING_CONTRACT.md` et leurs documents thématiques ; lier depuis `docs/ai/README.md`. Les comptes rendus datés vont sous `docs/ai/` ou `docs/reports/`. Garder les archives techniques pertinentes et les variantes historiques sans suppression destructrice.
6. Avant toute écriture, relire le head distant, limiter les fichiers, refuser les écritures concurrentes sur la même branche et vérifier qu'aucun contenu privé n'est ajouté. Après publication, contrôler le nouveau SHA et les blobs préservés ; conserver les preuves de cette vérification.
7. Réévaluer la complétude **à chaque changement de session et à chaque jalon majeur**, sans prétendre à une synchronisation automatique. Les traces perdues, les outils inaccessibles et les preuves expirées doivent rester marqués « non récupérables / non vérifiables ».

## Préférences de collaboration partageables

- Discussions, prompts, comptes rendus et relais en français ; commentaires techniques du code et fichiers README en français puis anglais, conformément au contrat.
- Une mission isolée à la fois, une seule prochaine action humaine, un mini-bilan clair et, pour Codex, un prompt prêt à copier.
- ChatGPT pilote et effectue une revue indépendante sur GitHub ; Codex réalise les modifications sur branche dédiée ; aucun agent ne certifie seul sa propre réussite.
- Relais explicite à la fin de chaque mission, avant compaction, instabilité ou renouvellement de session ; pas de transfert manuel imposé lorsque les outils ont déjà les éléments.
- Aucun merge, fermeture de PR, réécriture d'historique, activation de bot, assouplissement de sécurité, changement juridique ou suppression de dépendances/archives sans autorisation expresse.
- Préserver les fonctionnalités désactivées, commentaires, archives, variantes historiques et dépendances facultatives sans les réactiver par accident ; tester et qualifier honnêtement les résultats.

## Découvrabilité, contrôles et limites

**Point d'entrée :** `AGENTS.md` → `docs/ai/WORKING_CONTRACT.md` → `docs/ai/README.md` → ce document et les relais datés.

Tant que les règles sont seulement dans **une PR en brouillon**, elles ne sont pas automatiquement disponibles sur `main` ; fournir la référence et le SHA à chaque nouvel agent. Une future fusion exige une décision humaine séparée.

**État au 21 octobre 2026 :** le relais de complétude de **la première conversation Codex** est enregistré dans `docs/ai/SESSION_CODEX_COMPLETENESS_2026-10-21.md`. L'inventaire complet de l'autre conversation Codex, des autres conversations ChatGPT et des tableaux privés de sécurité **n'est pas certifié**. Les rapports historiques et les artifacts temporaires ont des limites connues.

**Confidentialité rétroactive :** une édition sur une branche ne supprime pas les anciennes occurrences de données déjà inscrites dans les commits, descriptions de PR, copies ou forks. Toute éventuelle réécriture d'historique ou demande de purge est une opération distincte, à risque, nécessitant décision explicite et inventaire préalable ; ne jamais la faire automatiquement.

**Critère de sortie :** le dépôt peut être déclaré « relais opérationnel disponible » lorsque les règles utiles identifiées et publiables sont référencées, mais **jamais « archivage exhaustif de toutes les conversations »** sans accès et audit vérifiables de chacune.
