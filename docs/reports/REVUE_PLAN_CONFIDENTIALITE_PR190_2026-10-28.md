# Revue ChatGPT — plan de confidentialité #190 et correction #188

**Nature :** avis indépendant sur le **plan** de la PR #190, non audit complet du correctif de #188. État de référence au 28 octobre 2026. Ne vaut ni autorisation de fusion ni validation du code applicatif.

## Sources du projet

- [PR #190](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/190), plan `docs/reports/pr188-correction-plan-20261027/`, HEAD `e077c8cd59d815c8c6d42fbf850f24cdd53abcb6`.
- [PR #188](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/188), audit historique des PR, source de départ `202f0f7b03c74c9c00177d113361b2166c27fe9c`, **nouveau HEAD observé `c96ba0980f7af58a4bd251efad5cc86d0d0d8dc7`**.
- `REPORT.md`, `EXTRAITS_PROPOSES.md`, `CHEMINS_PLAN.csv` et `MANIFESTE_CORRECTION_PROPOSE.json` dans la branche #190. Les 63 sections de propositions ont été lues. Leurs coordonnées renvoient au SHA historique, pas nécessairement au HEAD post-correction.

## Conclusions sur le plan préalable

1. **Favorable au périmètre minimal** : reformuler `JOURNAL_DECISIONS.md`, `SAVE_STATE.md`, `COMPTE_RENDU.md`, `data/README.md` ; ajouter une notice de confidentialité/intégrité et un manifeste. Les trois documents secondaires restants sont différés.
2. **Conservation indispensable** : archive originale de 1 995 059 octets, SHA-256 `84c00d03b9b53990d26abc73c999288ba704d5996a59ed74f9d37f9e3386375a`, quatre patchs et autres témoignages inchangés ; ne pas exécuter de patch.
3. **Capture #153** : `files-153.json` invalide et contaminée par une erreur du proxy ; pages séparées `f153-1/2/3.json` valides et 276 identités distinctes selon les preuves rapportées. Préserver le brut et documenter précisément le statut de chaque membre.
4. **Confidentialité** : remplacer les citations conversationnelles et attributions contextualisées par des décisions techniques impersonnelles ; ne pas qualifier des auteurs GitHub, pseudonymes ou identités de bots publics de secrets sans preuve.
5. **Historique** : une édition ordinaire ne supprime ni anciens commits, ni clones/forks/caches. Le risque résiduel est accepté pour cette étape ; l'étude de l'historique et des documents secondaires demeure une tâche future.
6. **Chemins personnels** : 13 P1 recensés dans des scripts/diagnostics préexistants, hors périmètre #188. Réparer les scripts actifs et anonymiser les témoignages sont des opérations distinctes nécessitant tests et autorisation.

## Ajustements demandés

- Les textes de #190 sont **des propositions déjà publiées dans une branche publique** ; ne pas écrire « non publiées » lorsqu'on parle du plan. Elles n'étaient pas encore appliquées à #188 au SHA de départ.
- Les empreintes projetées ne prouvent pas les octets du commit final ; recalculer les empreintes réelles et vérifier le manifeste sans auto-hachage circulaire.
- Les transformations doivent conserver les décisions historiques et distinguer clairement le relevé du 23 octobre de l'édition ultérieure.

## État évolutif — attention au SHA

Un nouveau commit `c96ba098...` a été observé sur #188 après la préparation et la revue du plan. Le commit annonce précisément la correction minimale de quatre documents avec notice et manifeste. **Ce constat confirme la présence des fichiers, mais pas encore le respect de chaque critère de validation.**

La prochaine revue doit notamment vérifier :
- diff depuis `202f0f7b...`, modes et fichiers réellement touchés ;
- absence de nouvelles informations sensibles dans les versions publiées ;
- conservation exacte de l'archive et des quatre patchs ;
- références du manifeste, hashes, 118 membres, JSON invalide, trois pages/276 entrées ;
- liens et décisions techniques préservés ;
- état des checks, conflits et protections GitHub au nouveau SHA ;
- absence d'exécution de tests applicatifs non affirmés.

**Verdict : GO sur le principe du plan minimal ; revue indépendante post-implémentation à faire ; NO-GO sur la fusion de #188 tant que cette revue n'a pas abouti.** La PR #190 reste une archive de planification à ordonner séparément.
