# Complément de sauvegarde — audit de la seconde branche ChatGPT V3 — 26 octobre 2026

> **Statut :** annexe additive au [relais V3 → V4](SESSION_CHATGPT_V3_TO_V4_RELAY_2026-10-23.md). Synthèse de l'audit de complétude remis par la seconde branche de ChatGPT V3 ; pas de revalidation des expériences locales Codex. Aucun secret, transcript privé, donnée personnelle ni artefact éphémère inclus. Tous les statuts GitHub cités sont datés et doivent être revérifiés.

## Conclusion

La seconde branche ne signale **aucune omission critique** du relais principal. Elle relève des précisions utiles à la reprise V4, qui complètent sans remplacer les documents historiques ni les preuves de #183, #186 et #187.

## Compléments importants

1. **Contrat IA — section 14 :** le relais initial mentionne les sections 1 à 13 de `docs/ai/WORKING_CONTRACT.md`. **Lire les sections 1 à 14** : la section 14 traite de la mémoire durable, de la vie privée et des audits de complétude. Garder la formulation historique dans le relais original ; cette annexe corrige la consigne opérationnelle.
2. **Exposition GLib :** selon l'étude Codex sur les sources Rust des **504 paquets résolus**, aucun appel applicatif explicite aux cinq méthodes `VariantStrIter` affectées n'a été trouvé en dehors de GLib, de ses exemples ou de ses tests. **Le crash est reproduit dans un harnais, pas démontré dans l'interface du projet**. L'absence d'appel direct ne prouve pas l'absence d'appel indirect. Le rétroport deux lignes de [#183 `f2eee422`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/f2eee4223a1ccf5b0866944580df8fd5979575dd) reste accepté dans son périmètre ; RustSec continue de signaler la version 0.18.5, audit strict exit 1.
3. **Auto-approbations :** workflow `Auto Approve PR (Approved Users Only)` : [#174 échec](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39901616726), [#173 échec](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39901588909), [#162 réussite](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/39901462530), état du 23 octobre. Rien ne prouve un automerge ou une politique de permissions approuvée ; T-004/T-013 restent à investiguer.
4. **Reproductibilité de l'étude huit avis :** Debian **13.6**, Rust/Cargo **1.99.1**, `cargo-audit 0.22.2`, base RustSec **`640bf5a9f06e66d8721e8772766531fe77c8630d`**, **1 349 avis** (22 octobre), **88 recherches inverses Cargo** rapportées, résultat : 0 vulnérabilité classée + 8 avertissements + sortie 1. Le rétroport GLib utilise une base RustSec **ultérieure** `c244ff02630e2e4e1eb69e01914b14a37dad7cbb`. Deux instantanés successifs, non contradictoires.
5. **PEM, 15 cas synthétiques :** Codex a observé **13 comportements normalisés identiques** ; `PUBLIC KEY` et `CERTIFICATE REQUEST` sont reconnus par l'API `rustls-pki-types::PemObject`, mais ignorés par l'ancienne API. Les types DER, filtres et erreurs diffèrent ; **aucune validité cryptographique réelle de certificats testée**. Ne pas autoriser de migration ni supprimer l'option historique `rustls-pemfile = "=1.0.4"`.

## Précisions secondaires

- **PEM optionnel :** `cargo tree -i rustls-pemfile` peut échouer quand le paquet n'est pas sélectionné ; il apparaît avec `--all-features`. Cela ne signifie pas qu'il soit absent du verrou.
- **Diffs des bots au 23 octobre (lignes, pas identités sémantiques) :** #174 `package-lock.json` +500/−1199 ; #173 +507/−1206 ; #184 `package-lock.json` +560/−1182 et `pnpm-lock.yaml` +290/−682 ; #169 `package-lock.json` +565/−1249 et `pnpm-lock.yaml` +397/−304. Les quinze synchronisations fusionnaient `main` **vers les branches de PR**, jamais l'inverse ; exigent des comparaisons de graphes, pas des jugements sur nombre de lignes.
- **Licence et présentation :** `README.md` racine minimal ; `.github/README.md` est la présentation détaillée contenant l'expression « open-source », tandis que `LICENSE` réserve les droits. T-014 ouvert, aucune modification juridique autorisée.
- **Statut historique :** `docs/ai/README.md` peut encore appeler #186 « draft » dans un contexte ancien. Depuis le 23 octobre, #183/#186/#187 étaient ouvertes et **hors brouillon** à la photographie. Garder le passé daté et revalider GitHub avant tout emploi du mot « actuel ».
- **Fin de mission Codex :** une mission diagnostic en lecture seule n'a pas toujours de PR nouvelle. Il serait pertinent de distinguer formellement les missions avec PR (numéro et SHA) des diagnostics sans publication (référence étudiée et preuves). **Proposition non encore adoptée dans le contrat**.
- **Continuité :** la seconde branche V3 a mené la revue Tokio et son suivi, l'étude des huit avis, la préparation de mission GLib et l'audit Phœn0x ; la revue définitive GLib et la synchronisation finale sont dans l'autre branche. Ne pas attribuer le même travail aux deux branches.
- **Gel d'application :** une interface s'arrêtait sur « analyse des logs », mais le navigateur permettait la poursuite. La cause n'est pas établie. Conserver la conversation **Codex existante**, renouveler seulement le chat ChatGPT.

## Suite

Lire le [relais V3 → V4](SESSION_CHATGPT_V3_TO_V4_RELAY_2026-10-23.md), puis cette annexe, le journal, les tâches sur #187 et le contrat **sections 1–14**. Revalider les SHA, la CI et les statuts GitHub. La prochaine étude candidate `tauri-utils 2.9.3 → 2.10.2` / `urlpattern 0.3 → 0.6` / ICU reste **non autorisée** par ce relais ; commencer en lecture seule sur demande, qualifier les trois divergences Unicode/ACL, les 13 anciennes identités Cargo et les variantes historiques.

Aucune fusion, écriture de code, réactivation de code fantôme, désactivation d'audit ou changement de statut de PR n'est autorisé par cette annexe.
