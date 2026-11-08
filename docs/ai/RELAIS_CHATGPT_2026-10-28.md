# Relais ChatGPT — état de reprise du 28 octobre 2026

**Nature :** consolidation impersonnelle des décisions et travaux encore ouverts, préparée pour la reprise après changement de conversation. **Photographie datée, non preuve d'exécution ou d'autorisation supplémentaire.** Source de vérité des états Git : GitHub, à relire au prochain démarrage.

**Base de consultation :** `main` = `8a1505d78452aae2bde18d6693e97bcb9b3793e8`. Les PR peuvent avancer après ce relevé.

## Décisions stables

- **Projet :** QuelleHeureEst-Il.com, application prioritairement Android, Rust/Tauri 2, logique métier locale/offline-first, sécurité, GrapheneOS, accessibilité et internationalisation, avec Web puis autres plateformes.
- **Propriété intellectuelle :** licence actuelle « tous droits réservés » inchangée. La présentation qualifie historiquement aussi le projet d'« open source » ; contradiction documentaire/juridique à étudier séparément, sans changer la licence implicitement.
- **Couverture gratuite GitHub :** privilégier l'analyse gratuite sur le code publié ; ne jamais confondre visibilité publique et confidentialité, ni licence restrictive et impossibilité technique de copie.
- **Conservation :** préserver versions, code fantôme, scripts historiques, dépendances optionnelles et preuves. Pas de nettoyage ou de réécriture destructive automatique.
- **Répartition :** ChatGPT = pilotage/revue indépendante ; Codex = réalisation de missions bornées ; fusion et changements sensibles réservés à la décision humaine. Signatures conventionnelles proposées : ChatGPT « Pantoine Damiel IV » / `openai/chatgpt` ; Codex « Matthieuh Sonnet VI » / `openai/codex`. Aucune signature textuelle seule ne prouve l'origine de l'action.

## Revues automatiques de PR : non activées au dernier constat

- **Aucune automatisation ChatGPT Work ni Codex Code Review n'a été activée à la dernière déclaration de la responsable du projet.** Aucune modification de configuration GitHub ne résulte de ce relais.
- Objectif différé : analyser automatiquement les PR ouvertes, prêtes pour revue, rouvertes ou mises à jour **sauf celles créées réellement par ChatGPT ou Codex** ; une PR humaine simplement modifiée par Codex reste éligible.
- Conserver les revues humaines, les checks GitHub/CI et les protections sur toutes les PR, y compris exclues de la revue IA automatique.
- Priorité aux mécanismes natifs Codex Code Review et à l'économie de quota ; vérifier officiellement si `All PRs` ou `Smart Trigger` accepte des exceptions **avant déclenchement**. Sinon, comparer les mécanismes de filtrage et la revue à la demande, sans présumer qu'un commentaire de bot déclenche Codex.
- Dédupliquer les revues par dépôt, numéro de PR et SHA. Signatures et labels déclaratifs doivent être vérifiés par une source de provenance contrôlée, faute de quoi **analyser**. Tester d'abord dans un dépôt de démonstration autorisé. Ne pas publier la liste ou les détails de dépôts privés dans les rapports publics.
- La convention de signature n'est **pas encore inscrite** dans AGENTS.md / WORKING_CONTRACT.md ; modification future seulement sur mission autorisée.

## PR documentaires : état observé

- **#186, #187, #189 : fusionnées.** L'inventaire préliminaire de doublons est sur `main` : [INVENTAIRE_PRELIMINAIRE_DOUBLONS_2026-10-27.md](../inventaires/INVENTAIRE_PRELIMINAIRE_DOUBLONS_2026-10-27.md).
- **#188 : ouverte.** Le SHA initial `202f0f7b03c74c9c00177d113361b2166c27fe9c` a avancé au commit **`c96ba0980f7af58a4bd251efad5cc86d0d0d8dc7`**, qui annonce la correction minimale des quatre documents et l'ajout d'une notice et d'un manifeste. **La revue indépendante de ce nouveau SHA et la décision de fusion restent à faire.** Ne pas appliquer les conclusions de l'ancien SHA comme validation du nouveau.
- **#190 : ouverte, en brouillon au relevé**, HEAD `e077c8cd59d815c8c6d42fbf850f24cdd53abcb6`, contient les quatre documents du plan préalable de #188. Propositions publiées mais pas corrections exécutables ; examiner la cohérence et l'ordre de fusion avec #188 avant décision.
- Décision concernant #188 : **correction minimale (quatre modifications, deux ajouts)**, pas de modification des archives brutes, pas de réécriture historique maintenant. Le risque de consultation des anciens commits est provisoirement accepté. Les trois documents secondaires du dossier et l'étude du traitement de l'historique public sont **explicitement différés**, non abandonnés.
- La capture brute `files-153.json` de #188 est invalide ; trois pages distinctes de 100+100+76 identifiants sont valides. L'archive ne doit être ni altérée ni réparée silencieusement. Examen post-correction à mener.
- Les 13 emplacements personnels P1 dans scripts/diagnostics sont un autre chantier, avec distinction entre anonymisation, portabilité et conservation de témoignages originaux. Aucune correction de scripts autorisée par ce relais.

## Dépendances, sécurité, validation

- **#183** : correctifs Vite/Tauri/Rust/HTTP, GLib et Tokio, tests partiels ; audit strict et validations natives non complètement résolus au dernier relevé. Ne pas conclure à une fusion possible sans nouvel examen au SHA courant.
- **#153** : chevauchements et travaux propres à rapprocher de #183 ; ensuite traiter les PR bots/de dépendances redondantes sans supprimer des variantes ni fermer des PR automatiquement.
- Sujets : `braces`, GLib/RUSTSEC-2024-0429, UNIC, `proc-macro-error`, `rustls-pemfile`, CI CodeQL, audits JavaScript/Rust, intégrations externes, validation Android/GrapheneOS et plateformes desktop.
- L'origine du compteur mobile Codex `+816 −1` n'a pas été déterminée ; ne pas inventer la ligne.
- Documentation historique : plusieurs README/relais contiennent encore des indications datées sur #186 désormais fusionnée ; corrections additives ultérieures sur PR autorisée, pas de falsification des comptes rendus d'époque.

## Vision produit et distribution

- Idée principale : interface unifiée de l'heure et des fuseaux, météo/prévisions, qualité de l'air, pollens et contexte des lieux, transparente et local-first.
- Les modules transports, actualités locales, agenda, amis et messages sont des **extensions éventuelles**, à dissocier du noyau.
- Pistes à arbitrer : widgets, heure contrôlée, fraîcheur et provenance, offline par catégorie de données, vigilance, radar/nowcasting, UV, cartes, comparateur de lieux/dates, alertes configurables, activité/itinéraires, historiques graphiques, préférences exportables, synchronisation locale facultative et raccourcis. Voir le rapport stratégique daté.
- Alpha envisagée **gratuite et limitée à dix utilisateurs** ; ouverture publique et commercialisation potentielles ultérieures. Les modes gratuits, achat unique, modules optionnels et services récurrents sont des pistes, pas des choix arrêtés. Vérifier les droits d'usage des fournisseurs gratuits avant commercialisation.

## Travaux explicitement non réalisés à ce stade

- Pas de nouvelle automatisation Work/Codex activée, pas de changement de sécurité, de licence, de protections ou de workflow.
- Pas de fusion de #188/#190, pas de réécriture historique, pas de modification des scripts.
- Pas de mise à jour générale du journal technique, de ROADMAP, des README ni des contrats par la présente publication. **Ce relais documentaire est un archivage demandé, pas une autorisation de modifier ces textes existants.**
- Pas de garantie d'exhaustivité des conversations ou des rapports temporaires ; seules les informations accessibles et publiables sont synthétisées. Détails personnels, références privées et conversations verbatim délibérément exclus.

## Reprise proposée

1. Relire les règles de `AGENTS.md`, `docs/ai/WORKING_CONTRACT.md` et `docs/ai/KNOWLEDGE_PRIVACY_POLICY.md`.
2. Contrôler d'abord les SHA/PR actuels et effectuer **la revue indépendante de #188 au SHA post-correction**.
3. Décider ensuite des fusions documentaires, puis de la faisabilité et du coût du filtrage pré-déclenchement de Codex Code Review.
4. Retrouver les rapports thématiques sous `docs/reports/`. Une seule mission et une seule prochaine action humaine à la fois.

**Statut : état de reprise public expurgé, n'implique aucune autre publication ni autorisation.**
