# Intégration conservatrice de main dans #153 — 2026-10-14

FR : Sauvegarde vérifiable avant intégration : commit 573b5139019538dc908fee01b0d7f638ef71b66c, arbre bc00c1ea8c46fb7b97723fe85943e5d06f9ccbe5 ; inventaire complet dans integration-evidence.json. Ce commit reste le premier parent de la fusion et donc un ancêtre accessible. Aucun historique n'est réécrit.

EN: The original head and full tree inventory are retained; the original head remains the first parent/ancestor. No history rewrite.

FR : main 235194a6fe825a6dac27012f07cbac2cc5d86794 diffère du merge-base c39a87e1d693382f34ca38bcaa68e032a9bcbc29 uniquement par l'ajout de renovate.json. #153 a aussi ajouté ce fichier, avec enabled:false et des limites de préservation. La comparaison Git à trois voies sur les blobs vérifiés reproduit le conflit add/add. L'ancienne comparaison 45 ahead/0 behind utilisait l'ancien main ; la comparaison avec le main actuel donne 45 ahead/2 behind. Le SHA base encore annoncé par l'API de PR était ancien : ceci ne rend pas la comparaison avec l'ancien SHA une preuve d'absence de conflit actuel.

EN: Current main adds only renovate.json; both sides added different versions. Exact-blob three-way Git comparison reproduces add/add. The old ahead-only comparison used the previous main; current main is two commits ahead of the merge-base.

FR : Résolution : garder le blob actif de #153 inchangé, archiver la configuration de main intégrale, intégrer main comme second parent. Ne pas activer le preset config:recommended et ne pas toucher à #154. L'approbation automatique, les audits, les licences, les manifestes/verrous, les variantes optionnelles et toutes les archives préexistantes sont inchangés.

EN: Keep #153's active config unchanged, archive main's complete variant, integrate main as second parent. No activation or unrelated PR modification.

FR : Le contrôle d'amorçage de conservation était borné à l'ancien SHA main. Sa variante intégrale est archivée ; la variante active accepte seulement l'ancien SHA et le nouveau SHA main relu (aucun autre fichier de base changé). Les vérifications de conservation et des écarts historiques restent obligatoires. Test local du YAML et de cinq cas SHA : deux bases acceptées, trois bases non examinées refusées. Les résultats CI finaux et le verdict seront publiés sur la PR après exécution.

EN: Preservation bootstrap adds only the exact reviewed new-main SHA; previous full workflow archived. Existing preservation/historical checks remain mandatory. YAML and five SHA cases passed. Final CI/results follow in PR report.
