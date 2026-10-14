# PR #153 — index complet des comptes rendus et du relais

FR : Tous les comptes rendus et toutes les pièces du dossier local de relais sont accessibles sur GitHub depuis cet index. La publication documentaire n'applique aucune proposition, licence, règle d'audit ou migration. Aucun code, dépendance, workflow existant ou système d'approbation n'est modifié.

EN: Complete GitHub-accessible report and handoff index. Documentation only; all proposals remain unapplied. No code, dependency, existing workflow, approval system or audit/licensing policy is changed.

## Dossier à donner à l'autre agent

- [Chronologie, actions, tentatives, résultats, limites et instructions de reprise](CHRONOLOGIE_REPRISE.md)
- [Rapport consolidé intégral : timeline de 44 entrées, rapports précédents et audit actuel](RELAIS_COMPLET.md)
- [Toutes les pièces — archive ZIP complète, 418 fichiers inventoriés](DOSSIER_COMPLET.zip)
- [Manifeste des fichiers, tailles et SHA-256](MANIFEST_SHA256.json)
- [Empreintes vérifiables avec sha256sum](SHA256SUMS)

L'archive conserve intégralement les journaux, JSON, SARIF, rapports, sources amont, copies historiques et fixtures disponibles. Les copies locales partielles sont signalées `LOCAL_NON_AUTORITATIVE` ; les instructions et rapports distants sont épinglés sous `REMOTE_PINNED_138f029`. Les archives, scripts et propositions ne doivent pas être exécutés ou appliqués automatiquement.

**SHA-256 de DOSSIER_COMPLET.zip** : `095bf4a93c7b59610f973cbbf2730bf21d92e5abf685b97e59bd9fc6c5e9951a`.
**Blob Git attendu de l'archive** : `87dea71ea9cc065402d8d5555b55c024adabb4c8`.

## Audit licences cargo-deny — mission actuelle

- [Rapport juridique et technique intégral](AUDIT_LICENCES.md)
- [Inventaire des 490 paquets registry + application](INVENTAIRE_LICENCES.md)
- [Sources vérifiables des 40 déclarations complémentaires](PREUVES_LICENCES.md)
- [Rapport publié dans la conversation #153](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6179334516)
- [Annexe 1 publiée](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6179348981)
- [Annexe 2 publiée](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6179349436)

Conclusion documentaire : 450 rejets faute d'allowlist ; 5 versions MPL-2.0 nécessitent des conditions de distribution ; quelleheureest n'a pas de métadonnée de licence Cargo malgré le texte propriétaire existant. Sept exigences permissives satisfont logiquement 485/490 expressions tierces. **Politique proposée non appliquée et non exécutée avec cargo-deny** ; toute décision juridique/modification doit être autorisée séparément.

## Comptes rendus antérieurs déjà publiés

| Mission | Rapport GitHub |
|---|---|
| Phase 1 / réparation du lock pnpm / CI | [Description de #153 et preuves initiales](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153) ; [CI_SETUP](../../CI_SETUP.md) |
| 27 alertes JavaScript | [JS_SECURITY_AUDIT](../../JS_SECURITY_AUDIT_20261013.md), résumé dans la description de #153 |
| Migration h2 | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6139049558) |
| Trois avis Rust / VariantStrIter | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6140053427) |
| Quatre chemins GLib CodeQL | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6150733380) |
| Trois chemins GLib restants | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6151473992) |
| Rétroport Slice vide → PtrSlice | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6151901679) |
| Dependabot / Renovate / conservation | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6153834951) |
| Écarts historiques Babel/lightningcss/shell-open | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6154474552) |
| Compatibilité multi-outils | [Matrice intégrale](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6154969050) |
| Gardes des générateurs | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6157746393) |
| Stabilisation et conflit Git | [Compte rendu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6160210718) |
| Alerte HIGH CodeQL #13 | [Compte rendu et preuves](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6160528214) |

## État et limites du snapshot

Le dossier de relais capture l'état **138f029e44c4b63abef8d5315845b360814f76f3**, avant la présente publication. Ses passages « non publié » et ses plans de reprise sont **historiques** : les trois commentaires ci-dessus et cette publication documentaire les remplacent pour l'état de publication. Les essais interrompus restent documentés sans réécriture.

Toutes les traces anciennes ne sont pas récupérables après les interruptions/compactions ; cette limite est déclarée dans le relais, sans invention de commandes ni résultats. Les historiques avant correction restent conservés et explicitement distingués de l'état actuel.

L'ajout documentaire ne valide aucun nouveau build/audit ni environnement Android/StackBlitz/Cursor/Claude. Les résultats CI cités restent rattachés à leurs SHA historiques. Les audits et décisions humaines non résolus restent tels quels. **Aucune fusion : la décision appartient à la propriétaire du projet.**

