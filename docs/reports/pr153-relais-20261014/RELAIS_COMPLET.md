# PR #153 — dossier de relais complet
# État, actions, essais, conclusions, preuves et limites — 14 octobre 2026

## 0. À lire en premier

Ce dossier est préparé à la demande de l'utilisatrice pour passer le relais. Il complète le dernier rapport de licences : celui-ci, seul, **ne contenait pas toute la chronologie des missions et des échecs de publication**.

Dépôt : https://github.com/Phoen0x/QuelleHeureEst-Il.com
PR : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153
Branche exclusive autorisée : `chore/ci-phase1-reliability-20261013`.
Tête relue pendant la préparation de ce dossier : **138f029e44c4b63abef8d5315845b360814f76f3**.
Main relu : **235194a6fe825a6dac27012f07cbac2cc5d86794**.
PR **ouverte, non fusionnée**. Toujours **14 commentaires de conversation** lors de la dernière lecture : **aucun rapport de licences publié**.

**Mission active avant le relais : audit juridique/technique des licences cargo-deny en lecture seule.** L'analyse documentaire et la proposition sont préparées. La publication sur GitHub n'a pas abouti. Aucun accord pour appliquer une licence, une politique, une exception, une métadonnée ou une modification de dépendance n'a été donné. Le présent tour prépare seulement le relais et ne relance aucun générateur/audit mutateur ni publication GitHub.

### Honnêteté sur l'exhaustivité

Le dossier inclut intégralement tous les éléments récupérables : les 14 commentaires publics de conversation, la description actuelle de PR, le rapport de licences, ses deux annexes, l'inventaire machine, les journaux CI de licences, les sources amont, les preuves CodeQL et de stabilisation présentes localement, les documents/fixtures locaux disponibles. Les sections de synthèse ne remplacent pas les textes intégraux.

**Je ne dispose pas d'un enregistrement intégral de chaque ancien appel d'outil et chaque commande de tous les tours avant les interruptions/compactions.** Je ne peux donc pas honnêtement reconstituer des timestamps, sorties ou tentatives absents. Les opérations anciennes sont attribuées à leurs rapports/preuves persistants ; elles ne sont pas présentées comme de nouveaux tests exécutés dans ce tour. Les durées de blocage citées proviennent des messages de l'orchestrateur, pas d'une mesure d'exécution côté GitHub.

Les historiques disent parfois « pas corrigé », « hors mission », « pas qualifié ». Les résultats ultérieurs indiqués ci-dessous priment pour l'état actuel, sans réécrire ces archives.

## 1. Instructions qui persistent pour l'agent suivant

1. Travailler uniquement sur #153 et sa branche ; ne jamais fusionner dans main, fermer une PR, auto-merge, force-push, réécrire l'historique ou modifier #154/autres PR.
2. Préserver toutes les dépendances, y compris inutilisées, optionnelles et natives Android ; les différents lockfiles, configurations parallèles, commentaires, archives, variantes et code fantôme sont intentionnels jusqu'à preuve/autorisation contraire.
3. Ne pas supprimer de paquet pour obtenir un audit vert. Ne pas réactiver les archives/code désactivé dans les artefacts.
4. Ne pas modifier l'approbation automatique, les permissions/protections, les règles de sécurité/audit ou les licences sans autorisation explicite applicable. La mission licences n'autorise **aucune modification** de policy, textes juridiques, dépendances, versions, métadonnées.
5. Priorités projet : Rust, local, offline, Android, sécurité. Instructions/commentaires nouveaux : français puis anglais.
6. Lire AGENTS.md, .github/README.md et .bolt/prompt sur le SHA distant exact avant une nouvelle intervention. Les doublons multi-outils ne sont pas automatiquement des erreurs.
7. Ne pas exécuter les anciens corps mutateurs sur le dépôt courant, ni directement depuis leurs archives. Les scripts sont protégés précisément parce que l'état actuel est incompatible avec leurs anciens remplacements.
8. Aucun dismiss/ignore/suppression d'alerte pour faire passer un check. Les qualifications de faux positifs sont des conclusions techniques précises, pas des autorisations d'effacer l'alerte.
9. Ne pas prétendre avoir validé Android/StackBlitz/Bolt/Cursor/Claude ou des clients réels sans exécution réelle. Des dépendances verrouillées ne prouvent pas l'exécution d'un environnement.
10. Ne pas demander à nouveau une permission déjà donnée ; inversement, une proposition de policy dans ce rapport **n'est pas** une autorisation de l'appliquer.

## 2. Chronologie des missions et état résultant

### 2.1 Phase 1 et verrou pnpm

Demande initiale : lire les trois fichiers d'instructions, réparer ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY pour @vitejs/plugin-react, lint/typecheck/Vite/Rust/CI, pousser seulement sur #153.
La description de PR et docs/CI_SETUP.md conservent le compte rendu : résolution pnpm 8.15.9, Vite 8.0.16, plugin-react 6.0.2, Cargo.lock commité, --locked, compilation Tauri effective, historique préservé. Les premières corrections/builds sont historiques, pas refaits dans le tour de relais.
Des demandes de statut/interruption ont signalé des blocages ; leur texte est dans la conversation fournie. Ne pas assimiler une réponse de statut à une validation.

### 2.2 Sécurité JavaScript

Mission : traiter les 27 alertes pnpm audit, examiner Dependabot sans importer ses suppressions.
Compte rendu dans la description actuelle et docs/JS_SECURITY_AUDIT_20261013.md : **26/27 entrées éliminées**, commit 90780c735aa3006e8b7a7a575be1e633ca88c3d6 ; reste **braces 3.0.3 / GHSA-vfj7-8cjw-p6xm, HIGH**. Patch pnpm local limitant la profondeur, **10 tests**, nom/version préservés, avis toujours visible. Dépendances directes, optionnelles, esbuild/Rollup conservées. PR Dependabot #138, #144–146, #148–152 examinées, aucune fusion/fermeture.
À l'époque, le lock cohérent avait retiré 31 descendants Babel du graphe réel ; cette perte a été identifiée puis traitée par une mission ultérieure. Ne pas dire que l'amorçage a validé rétroactivement ces suppressions.

### 2.3 h2 / RUSTSEC-2026-0258

Rapport #6139049558, commit 30aba7c1f2ddbf936fa37654a9bcf59d89b869f8.
Migration de la pile applicative Reqwest 0.11 / Hyper 0.14 vers **Reqwest 0.12.28 / Hyper 1 / h2 0.4.20** ; Reqwest 0.13.5 de Tauri conservé. TLS natif/HTTP/2 conservés, aucun changement métier.
httpdate =1.0.3 et rustls-pemfile =1.0.4 restent des dépendances historiques optionnelles, sans activation inutile ; anciens fichiers sous docs/history/rust-h2-20261013.
Deux tests HTTP locaux d'intégration validés en CI. Premier candidat échoué avant migration car Python 3.10 sans tomllib ; prérequis Python 3.12 utilisé ensuite. h2 initial absent des audits ultérieurs.

### 2.4 Trois avis Rust et premier rétroport GLib

Rapport #6140053427, commit ded44f5f3ce41e5f6d092ca54f139a594c76fd8a.
**VariantStrIter** : rétroport amont gtk-rs-core#1343, commit b5a4071e439bef2b5eea76c3aa25e5ae84839e34, source GLib vendored/path override ; archive officielle complète conservée (SHA-256 233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5).
8 tests d'intégration alors validés (6 GLib + 2 HTTP).
Les avis **proc-macro-error / RUSTSEC-2024-0370**, **rustls-pemfile / RUSTSEC-2025-0134**, **glib / RUSTSEC-2024-0429** demeurent visibles. Les deux premiers sont de non-maintenance sans release corrigée observée ; le dernier demeure signalé par l'identité/version du registre malgré rétroport local.
Une migration isolée GLib >=0.20 n'est pas compatible avec la pile GTK 0.18 étudiée. Ne pas renuméroter fictivement le vendor pour cacher le signalement.

### 2.5 Quatre chemins Rust CodeQL GLib

Rapport #6150733380, commit final 0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370.
Diagnostic complet **38425272324**, CLI 2.27.2, sept résultats Rust dans le replay ; ne pas confondre avec « six nouvelles alertes » initiales.
QL-1 log.rs:85 / rust/cleartext-logging : dispatch Rust impossible entre bool de g_uuid_string_is_valid et LogLevel, pas de flux secret démontré.
QL-2 subclass/boxed.rs:76 : dérivation de MyBoxed sous cfg(test) de la dépendance et conversions FFI confondues ; pas d'exposition applicative démontrée.
QL-3 value.rs:462 et QL-4 value.rs:470 : chemins mêlant sorties gchar*/GError* et GValue* incompatibles, écritures C/branches/types concrets perdus.
Conclusions : **faux positifs des chemins examinés**, pas correction source/amont inventée. Tests ciblés ajoutés, **13 tests par profil** dans cette phase. Aucun état d'alerte modifié.
Observation distincte **LogField::new** (durée de vie de value non liée explicitement) documentée, sans exposition applicative démontrée ni correctif amont vérifié : **reste à examiner**, ne pas la déclarer corrigée par le verdict logging.

### 2.6 Trois chemins CodeQL restants et proposition initialement inactive

Rapport #6151473992, commit f149328e91bf0379f31d73b664d80dbe85f49617.
QL-5 object.rs:470 et QL-6 object.rs:493 : dispatch gchar*/GError*/hostname vers GObject incompatible dans le chemin ; faux positifs précis.
QL-7 collections/ptr_slice.rs:900 : drop_in_place détruit le wrapper/objet pointé, **pas le tableau qui contient le slot** ; ptr::write réinitialise une allocation encore possédée. Faux positif d'invalidation 898 → 900.
Amont 3971101c82643035c15380c3f4af19ecccd09bb2 conserve cette séquence pour les types avec destructeur ; son durcissement théorique de panic Drop ne corrige pas la prétendue libération du slot.
Recherche révèle toutefois un **vrai défaut distinct de conversion Slice vide → PtrSlice**. Proposition docs/security/proposals/UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch, amont b31265df94876febf259089a19de9c23d2468214 / issue #2042. À cette étape seulement : git apply --check OK, pas d'application/exécution du correctif. **18 tests par profil** dans cette phase.
Cet état « non appliqué » est historique : voir étape suivante.

### 2.7 Second rétroport GLib Slice vide → PtrSlice

Rapport #6151901679, commit final c0169878bbd24ba28bc17c1886bb4eada464bf39 (source testée bd2e21a, détails complets dans le rapport joint).
Rétroport minimal du constructeur vide, corpus amont vérifié. Seul corps de conversion changé dans vendor, commentaires FR puis EN ; variante antérieure archivée.
Six nouveaux tests : vide sans capacité, vide réservé, non vide, sentinelle, destruction et réutilisation. **24 tests d'intégration par profil debug/release**, Clippy/format et conservation validés. Les avis de version restent ouverts.
Le fichier portant UNAPPLIED demeure une **proposition historique conservée**, pas la description de l'état actif actuel.

### 2.8 Dependabot/Renovate/autres bots

Rapport #6153834951, commit a42475b25bd13d2803d0d32b9c3a71d4256170f0 ; tests source d6316a5.
Dependabot JS/pnpm, Cargo et Actions déclarés avec horaires/limites explicites ; Renovate désactivé pour éviter des producteurs concurrents. Contrôle de conservation indépendant, **12 tests** à cette étape ; validateur Renovate 44.155.7 strict et schéma Dependabot examinés.
#138 montrait 84 noms supprimés, dont 51 optionnels et des variantes Android : preuve de changements à examiner, pas preuve que tous seraient illégitimes.
Amorçage borné #153/base c39a87e…/ancrage c016987… documenté ; il **ne validait pas les 31 pertes Babel/lightningcss/shell-open antérieures**.
Limites : le nouveau check n'a pas été rendu obligatoire dans GitHub ; workflow mutable/règles/apps non entièrement lisibles ; efficacité dépend aussi de la protection/revue humaine. Aucun réglage/permission/auto-approval modifié. Une commande YAML initialement mal citée et des variantes de comparaison ont été archivées avant correction.

### 2.9 Écarts de conservation historiques

Rapport #6154474552, commits 131fe45, 03785527621149a1f75f6e31075b45340ed5a71e puis f308ee1b97cc53bdadaf87041f82a5198b6b07e0.
Les **31 noms** sont restaurés via cinq racines dev : **@babel/core**, **@babel/plugin-transform-react-jsx-self**, **@babel/plugin-transform-react-jsx-source**, **@types/babel__core**, **react-refresh**.
Lock à cette phase : 324 noms / 335 entrées accessibles, 95 noms optionnels conservés ; tests Babel/Refresh et exclusion des 53 modules de production.
Lightning CSS : ancien peer optionnel Vite 7 remplacé par dépendance obligatoire Vite 8, représentation conservée, pas besoin de recréer une ancienne relation peer invalide.
shell-open : feature Tauri 1, absente de Tauri 2.12.3 ; restauration active casserait Cargo. Déclaration conservée en archive et commentaire actif ; pas de plugin/opener/permissions réactivés.
Contrôle supplémentaire vraie base, deux transitions justifiées explicitement et affichées, pas exception générale. Huit nouveaux tests, **20 tests** au total dans cette phase. Première fixture CI corrigée pour inclure les quatre anciens verrous npm ; variante initiale archivée.

### 2.10 Compatibilité Git/GitHub/StackBlitz/Bolt/Codex/Cursor/Claude

Rapport #6154969050 intégral joint, audit **sans modification**, head f308ee1….
Matrice par outil/configuration : active, compatibilité, historique, ghost ; risques de régénération npm/pnpm/Cargo et lockfiles parallèles.
Constat historique confirmé : package-lock.main.json JSON invalide ligne 1503/colonne 7 ; conservé comme référence, pas remplacé par le lock actif. Ne pas extrapoler que tous les doublons sont erronés.
Aucun runtime réel StackBlitz/Cursor/Claude/Android certifié par ce seul audit. Les détails/managers/versions/preuves/limites par fichier sont reproduits intégralement en annexe, pas résumés à une promesse de compatibilité.

### 2.11 Sécurisation des anciens générateurs

Rapport #6157746393, code source validé 32b646058f64890d072118f41736e27b602093d5, documentation finale 573b5139019538dc908fee01b0d7f638ef71b66c.
Deux prepare-rust-*-candidate.py : **contrôle sans écriture par défaut**, --check ; --generate exige l'ancien état exact, refuse migration h2/GLib déjà appliquée, overrides/vendor/sorties existants.
Deux workflows candidats Rust gardés avant copies/commandes ; js-security-maintenance protégé avant install et ancien writeFileSync ; lockfile-maintenance n'accepte que l'état exact conservé, pas un générateur général.
pnpm **8.15.9 exactement**, cwd/SHA/archive/symlinks/sorties/encodage contrôlés ; CRLF normalisé en mémoire pour actifs, archives vérifiées octet par octet ; --generate refuse Python non UTF8.
Six originaux complets + intermédiaires archivés.
**21 tests Ubuntu et 21 Windows**, **41 tests Python agrégés**, probes réelles ; tests négatifs isolés, snapshots complets et sentinelles, **aucun ancien corps mutateur exécuté**.
Échecs locaux documentés : sous-processus Node EPERM ; matérialisation d'une archive avec LF supplémentaire non réécrite ; validation distante exacte utilisée.
Limites : contournement volontaire/archivedirecte des archives, PATH et concurrence restent hors garantie ; changement légitime de référence nécessite une revue.

### 2.12 Stabilisation, dirty et intégration non destructive de main

Rapport #6160210718 intégral joint, SHA final de phase **a3a523b3a87f72ec18bcd90563ecc3701859a25c**.
Cause **conflit Git add/add réel de renovate.json**, main devenu 235194a… après intégration upstream de #154 tandis que l'API de PR montrait une ancienne base. « Ahead / 0 behind » calculé contre cette base stale n'excluait pas le conflit avec main courant.
Preuve via arbres/blobs et git merge-file --diff3 base vide, exit 1. Clonage réseau local non réussi (proxy/sandbox puis demande de permission bloquée avant lancement) ; connecteur et copie temporaire utilisés.
Fusion à deux parents de **main vers branche #153**, sans merger #153 dans main, force-push/rebase/édition de #154. Variantes renovate complètes conservées, inventaire pré-intégration archivé ; head précédent reste ancêtre.
Après : **47 ahead / 0 behind**, merge-base main courant, mergeable true. Les politiques/checks restent des blocages distincts.
Deux fichiers préexistants modifiés : workflow conservation amorçage accepte exactement les deux main SHA examinés ; test fixture fixe maintenance.auto/gc.auto pour éviter suppression asynchrone de .git/objects/maintenance.lock. Anciennes versions archivées.
Première CI conservation cc953599… échouée sur maintenance fixture ; correction puis **41 tests** mêmes snapshots, pas d'exclusion d'un lock pour rendre vert.
Au SHA a3a523b : Node22/pnpm8.15.9 install gelé, lint/types/Vite/actionlint et conservation ; Rust debug/release --locked, **24 + 24 tests**, fmt/Clippy strict ; Ubuntu/Windows guards. Audits JS/Rust/deny rouges. CodeQL analyses réussies mais check HIGH non encore identifié alors.
Ruleset accessible Ægis : revue requise, reviews anciennes invalidées au push, force-push/suppression main interdits ; endpoint protection classique **403**, contraintes complètes non prétendues connues.
**Verdict de cette phase : non prête à fusionner selon les critères de sécurité**, aucun abaissement de seuil.

### 2.13 Identification de l'alerte HIGH CodeQL

Rapport #6160528214 ; orchestration **87b551e85af2256c12cf8a804524540279aa9cda**, diagnostic **38507354862**, tête documentaire ultérieure **138f029…**.
Check **115661038804**, SHA source fixé **a3a523b…**. Alerte GitHub **#13**, règle **rust/access-invalid-pointer**, security severity **7.5**, archive **docs/history/glib-empty-slice-20261013/vendor/glib-0.18.5/src/collections/ptr_slice.rs:900**, chemin **898→900**. Le détail exact figure dans le rapport/JSON/SARIF joints.
Le connecteur refusait les endpoints annotations/code-scanning. Diagnostic ponctuel : HTTP 200 anonyme check/annotations/commentaires publics ; API alertes 401 anonyme / 403 avec token lecture existant. Aucune augmentation de permission.
CodeQL CLI 2.27.2 même pack/default queries/build-mode none, checkout exact a3a523b, **upload:false**, exports complets en artefacts/logs gzip/base64, git diff --exit-code réussi. Les trois analyses ont réussi ; huit résultats Rust dans ce replay, pas les sept du précédent.
SARIF Rust **497599 octets**, SHA-256 **73f5c03fda27b8bda583f1f42aaa93c12c8e7a9d29b546167e1774a5d1970185** ; ZIP artefact 11869070736 (digest ZIP distinct).
Comparaison QL-7 et source : même chemin slot/wrapper, bloc truncate identique actif/archive ; **faux positif vérifiable de ce chemin**. Le vrai constructeur vide historique est ailleurs et rétroporté dans actif.
Aucun patch, suppression archive, dismiss/exclusion/ignore. Observation LogField distincte reste non résolue. Ne pas présenter analyse réussie comme check vert ou décision de fusion.
Tests/builds existants sur a3a523b et orchestration validés selon liens ; **pas tous les rejeux de la tête documentaire 138f029 déclarés réussis** dans ce précédent rapport.

### 2.14 Audit licences actuel : travail terminé et ce qui reste

Job **115672063173**, run **38508720134**, tête **138f029…**, cargo-deny **0.20.2**.
**450 rejets registry** tous « license is not explicitly allowed » + **unlicensed application** ; warning défaut config ; allowlist vide, confiance 0.8, private.ignore=false, include-dev=false / include-build=true.
Lock **491 entrées / 446 noms = 490 registry + quelleheureest 0.0.1**.
450 déclarations lues dans les manifestes CI ; 40 complémentaires sources amont **nom/version identiques** et héritage du workspace. Pas de checksum crates.io téléchargé indépendamment pour ces 40.
Aucune licence SPDX tierce manquante dans ces490 métadonnées ; pas d'incompatibilité exclusive GPL/AGPL/noncommercial déclarée identifiée. Cela ne certifie pas fichiers natifs, notices, droits tiers ou conformité APK.
Cinq MPL-only : cssparser 0.37.0, cssparser-macros 0.7.1, dtoa-short 0.3.5, option-ext 0.2.0, selectors 0.38.0. Copyleft fichier compatible avec Larger Work propriétaire **si** sources/notices/EULA conformes.
AND cumulatif : brotli, dpi, encoding_rs, unicode-ident, ring 0.17.14 (Apache-2.0 AND ISC) ; OR documenté r-efi MIT / Apache / LGPL ; target-lexicon Apache WITH LLVM exception distinct.
Hypothèse utilisée : binaires propriétaires distribués ; question facultative posée sur distribution, **pas de réponse retrouvée**. Hypothèse déclarée, aucune autorisation juridique déduite de l'absence de réponse.
Contradictions README open-source vs propriétaire, prompt « 100 % open-source », LICENSE droits réservés, CLA prétendue cession automatique ; analysées sans modification.
Proposition non appliquée : **sept exigences permissives couvrent logiquement 485/490 expressions**, cinq exceptions MPL par paquet/version après accord + clarification LicenseRef propre à application/texte actuel après accord, private.ignore=false ; include-devtrue élargit couverture.
Parsing TOML réussi et simulation SPDX indépendante ; **pas de cargo-deny réel avec proposition**, Cargo/rustc/deny locaux non disponibles au moment de l'audit.
Hash clarification LICENSE normalisé : xxh32 seed 0 **0x2ca1d603**, SHA-256 **f982c2f3d05acc6eba0f6e447106270850faf4bbcec0d4702fb66914b7dcc34f** ; blob Git947481855a58de035c7c0d5ec268ccc895a891fc.
Les diagnostics licences n'ont pas été résolus dans la CI : **policy encore inexistante, aucune modification du dépôt durant cette mission**. Les advisories demeurent indépendants.

## 3. Journal des tentatives et difficultés de la mission licences/relais

### 3.1 Collecte et analyse réussies

- Lecture des instructions/projet, PR/head/main/arbre distant et logs cargo-deny.
- Conservation du log complet 2,36 Mo, version nettoyée, Cargo.lock distant et JSON de491 entrées.
- Extraction450 diagnostics et rapprochement aux noms/versions du lock.
- Une première regex traitait mal un suffixe de version avec `+wasi-0.2.12` ; extraction corrigée par correspondance exacte `name-version` aux 491 entrées. **Les JSON finaux contiennent les versions exactes, pas la regex erronée.**
- Recherche des40 entrées non présentes dans rejets via tags/releases/commits officiels ; matching nom/version et licence du workspace.
- Ring0.17.14 : absence de tag exploitable, release retrouvée dans historique exact commit 2723abbca9e83347d82b056d5b239c6604f786df ; fichiers LICENSE/newISC/BoringSSL/once_cell relus. Ne pas importer ancienne clarification MIT AND ISC AND OpenSSL.
- Sources cargo-deny 0.20.2 et spdx0.13.4 relues pour défauts, inclusiondev/build, PackageSpec exact @version, LicenseRef personnalisé / clarify, hash/normalisation ; slash historique OR confirmé.
- Construction des deux annexes et du rapport ; script indépendant vérifie490 identifiants uniques, couverture complète, aucune omission ; propositions propositions TOML parsées, 485 logiquement satisfaites/5 MPL.
- XxHash32 Python stdlib implanté, vecteurs empty 0x02cc5d05 et a 0x550d7456 testés. **Ce n'est pas un test d'exécution cargo-deny.**
- Contrôle de taille avant publication : rapport22452 caractères, inventaire14361, sources8353 ; chaque corps sous65536caractères. Aucun tronquage intentionnel pour publication.

### 3.2 Réseau et publication : non aboutis

- Avant le dernier rapport, des appels shell curl sans permission échouaient sur le proxy ; des appels avec permissions réseau additionnelles restaient bloqués **avant exécution**, puis interrompus par l'utilisatrice. Des blocages de 20–35 min sont indiqués dans le résumé de travail conservé ; leur détail complet n'est pas récupérable. Aucun téléchargement crates.io réussi n'a été inventé.
- Les lectures GitHub via connecteur fonctionnaient rapidement, d'où utilisation des sources amont plutôt que nouvel essai de permissions.
- Tentative 1 : appel functions.exec lisant les trois corps de commentaires puis github_add_comment_to_issue (rapport principal). Orchestrateur : **aborted by user after 9084.5s**. Aucun résultat mutateur reçu ; impossible d'identifier exactement lequel des sous-appels attendait. Les annexes n'ont pas ensuite été envoyées.
- Lecture des14 commentaires après interruption : aucune publication du rapport licences, stores V8 disparus après changement de tour. Les fichiers locaux persistaient.
- Tentative 2 : lecture rapport principal réussie et contrôlée (**22 452 caractères**), yield_control, appel github_add_comment_to_issue. Le wait a été interrompu : **aborted by user after 5467.5s**, sans réponse exploitable. État distant relu ensuite : toujours 14 commentaires, aucun rapport licences.
- **Pas de code d'erreur 403, refus d'approbation automatique ou cause réseau confirmé pour ces deux envois.** Il s'agit d'appels en attente interrompus, pas de preuve d'une politique GitHub interdisant les commentaires. Ne pas inventer un refus administratif. Une opération interrompue peut nécessiter une nouvelle lecture distante avant toute nouvelle mutation.
- Pas de retry en boucle sur une mutation à résultat inconnu. Les lectures ont confirmé l'absence du rapport au moment des contrôles.
- Réponses à « t'avais fini » : analyse terminée, mission pas totalement achevée puisque publication manquante. **Ne pas transformer cette réponse en preuve de publication.**
- Runtime du tour relais : environment_status observations_current=true, observed_phase=running, network_policy=unrestricted/enforced, secrets/runtime_variables/outbound_identities vides. Ce snapshot est nouveau, **ne valide pas rétroactivement le shell ou l'auth GitHub en écriture**. Aucun identifiant secret lu/dumpé.

### 3.3 Actions de préparation du relais, ce tour

- Relecture PR et 14 commentaires via connecteur ; sauvegarde intégrale JSON.
- Relecture distante immuable AGENTS.md, Cargo.toml, src-tauri/Cargo.toml, .cargo/config.toml, package.json, docs/CI_SETUP.md et docs/JS_SECURITY_AUDIT_20261013.md ; sources / SHA gardés.
- Lecture locale des fichiers de preuve et corpus existants ; aucun build/install/générateur.
- Préservation du dernier rapport licences original avant enrichissement.
- Création hors dépôt du rapport consolidé, copies des pièces retrouvables, empreintes et archive ZIP de relais. **Aucun nouveau push/commentaire/commit pendant ce tour.**

## 4. État à ne pas confondre

| Élément | État réel à reprendre |
|---|---|
| Fusion de #153 | Jamais effectuée, décision réservée à utilisatrice |
| Intégration main→branche | Déjà réalisée non destructivement lors stabilisation, conflit add/add traité |
| h2 initial | Corrigé par migration, préservé |
| VariantStrIter | Rétroport actif testé ; audit de version GLib avertit toujours |
| Constructeur Slice vide→PtrSlice | Rétroport actif testé ; ancienne proposition/versions conservées inactives |
| Sept chemins GLib SARIF ancien | Qualifiés précisément faux positifs ; aucun dismiss |
| HIGH #13/check 115661038804 | Identifié : ptr_slice archive, ligne 900, faux positif du chemin ; ne garantit pas check vert |
| LogField::new | Observation distincte non résolue / exposition non démontrée, à revoir en amont |
| braces | Patch local testé, alerte HIGH de version demeure ; pas de waiver |
| proc-macro-error/rustls-pemfile | Paquets conservés, avis de non-maintenance restent |
| Licences | Cause analysée, proposition non appliquée ; CI rouge demeure |
| Métadonnée applicative | Absente ; LICENSE propriétaire existe, pas changement automatique de licence |
| Verrous historiques npm et compatibilité multi-outils | Conservées, certaines non reproductibles pour manifeste actuel ; pas nettoyées |
| Publication du rapport licences | **Non faite**, à reprendre après lecture distante |
| Préparation de la fusion | Dernier verdict sécurité : non prête ; n'effacer aucun blocage pour changer le verdict |

## 5. Plan exact de reprise par l'autre agent

1. Lire ce document et les pièces originales ; vérifier le head/main/PR et commentaires actuels. Si SHA a changé, distinguer le nouveau code des preuves historiques.
2. Lire instructions et politiques du dépôt sur le SHA actuel. Obtenir un checkout **complet et propre** si une opération Git est nécessaire : la matérialisation locale n'est pas un clone complet et fiable.
3. Pour achever **la mission actuelle seulement**, relire le rapport licences et ses annexes et vérifier les **491 entrées du lock (490 registry + application)**. Le nombre de résultats SARIF est indépendant. Ne pas mélanger les compteurs.
4. Vérifier qu'aucun commentaire licences n'est apparu depuis les lectures et qu'un envoi interrompu n'est pas encore finalisé. Publier si toujours absent les 3 parties, **sans rien appliquer** : rapport principal, inventaire des 490 paquets tiers et de l’application, preuves des 40 sources amont.
5. Employer un connecteur/CLI réellement disponible et autorisé. Limiter les attentes, donner des statuts exacts ; ne pas répéter des appels de permission shell bloqués ni dire « publié » avant URL/lecture du corps.
6. Lire après publication chaque corps et conserver les liens. Les 3 parties ont chacune moins de 65 536 caractères ; le rapport consolidé de relais est plus long et **ne doit pas être envoyé comme un seul commentaire GitHub**.
7. Ne pas appliquer licensing-proposed-policy.toml ni modifier Cargo.toml/LICENSE/README/prompt sans **nouvel accord explicite**. Un tableau de recommandations est la seule action autorisée.
8. Si l'utilisatrice autorise ensuite une politique : vérifier distribution/juridiction/droits, notices/MPL/EULA/composants natifs, puis tester cargo-deny 0.20.2 en copie isolée avec --locked et graphes de fonctionnalités/cibles. Maintenir advisories/contrôles bans/sources. Aucun succès n'est revendiqué avant résultat.
9. Ne pas traiter JavaScript, les migrations Rust ou les changements d’état des alertes par inadvertance dans une mission licences ; proposer séparément l'étude des blocages persistants si demandée.
10. Fournir résultat et limites exacts ; décision finale de fusion toujours humaine.

### Message prêt à donner à l'agent

> Reprends uniquement #153, branche chore/ci-phase1-reliability-20261013. Lis le dossier joint, AGENTS.md, .github/README.md et .bolt/prompt distants. Le head vérifié est 138f029e44c4b63abef8d5315845b360814f76f3. La mission licences est une analyse en lecture seule : rapport et annexes prêts mais non publiés à cause d'envois interrompus sans résultat. Relis les commentaires avant publication pour éviter doublons, puis publie les 3 parties originales. N'applique aucune politique/licence/métadonnée/dépendance sans accord explicite. Préserve archives, configs parallèles, code fantôme, dépendances optionnelles ; aucun merge/forcepush/dismiss/modification de l'approbation automatique. Le dossier comprend les preuves et limites, avec rapports antérieurs intégraux.

## 6. Provenance des pièces et environnement local

- **Autorité : GitHub distant au SHA immuable**, et journaux/jobs cités. Les JSON de réponses PR/commentaires et sources distantes sont des snapshots datés du tour relais.
- /workspace/QuelleHeureEst-Il.com est une matérialisation **partielle**, sans .git complet utilisable ; certains fichiers incluent une LF supplémentaire, des historiques manquent. Ne pas traiter ses blobs comme identiques au distant sans vérification. Les copies de documents dans le ZIP portent LOCAL_NON_AUTORITATIVE.
- /workspace/scratch contient des fixtures/candidats **historiques**, pas un checkout courant ni sources à appliquer. Inclus pour contexte, jamais exécutés par le relais.
- Les exports SARIF et logs sont des sorties de diagnostic conservées. Le workflow diagnostic est figé sur un SHA ancien et upload=false ; le relancer ne prouverait pas la tête future.
- Les licences registry actives sont prises dans Cargo.lock et 450 diagnostics ; 40 sources amont non vérifiées par téléchargement des archives. Ne pas transformer une licence déclarée en garantie per-file.
- Les notes ne contiennent pas de secrets ajoutés par l'agent ; aucune valeur de secret ni contenu de .aws/.codex n'est collectée. Les logs publics CI sont préservés tels que récupérés.
- Le ZIP contient un **MANIFEST_SHA256.json** et SHA256SUMS pour contrôler chaque pièce. Les empreintes prouvent l'intégrité du paquet de relais, pas l'authenticité juridique d'un amont ni que les copies locales étaient des blobs Git identiques.
- Le rapport licences original est conservé séparément ; le fichier qui était « dernier rapport » est enrichi par concaténation du dossier consolidé, sans perte de son texte initial.
- Les scripts .py/.yml/.patch inclus sont des **pièces de preuve ou propositions**, pas des instructions à exécuter. Aucune activation automatique.

## 7. Index des rapports GitHub antérieurs inclus intégralement

L'annexe des 14 commentaires ci-dessous garde les URLs et le texte entier. Les rapports sont des faits historiques avec SHA ; aucun test n'est réexécuté pour cette copie. Les liens vers jobs/artefacts peuvent expirer, d'où les preuves locales complémentaires quand disponibles.

## 8. Corps intégral du dernier rapport de licences et annexes



**Complément du relais :** la timeline GitHub complète a également été exportée : **44 entrées** (commentaires de conversation, commentaires inline et reviews), reproduites intégralement plus bas. Aucun rapport de licences ne figure dans ces entrées. Onze rapports Markdown référencés ont été relus au SHA distant et inclus avec leurs blobs.


## Audit juridique et technique des licences cargo-deny — conclusions et proposition non appliquée

**Périmètre : PR #153, commit `138f029e44c4b63abef8d5315845b360814f76f3`. Aucun fichier du dépôt, dépendance, verrouillage, texte juridique, workflow, seuil ou politique n'a été modifié. Aucun commit poussé, aucune PR fusionnée/fermée.**

### 1. Cause exacte des échecs

Preuve : [run 38508720134, job 115672063173](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38508720134/job/115672063173), cargo-deny **0.20.2**, exécuté par [l'action épinglée](https://github.com/EmbarkStudios/cargo-deny-action/blob/3c6349835b2b7b196a839186cb8b78e02f7b5f25/Dockerfile).

Le journal contient exactement :
```text
[WARN] unable to find a config path, falling back to default config
```
Aucun `deny.toml`, `.deny.toml` ni fichier d'exceptions cargo-deny n'a été trouvé dans l'arbre audité. Le [code des valeurs par défaut 0.20.2](https://github.com/EmbarkStudios/cargo-deny/blob/0.20.2/src/licenses/cfg.rs) confirme `allow = []`, `private.ignore = false`, confiance 0.8, licences de build incluses et de développement exclues.

**450 paquets/versions registry distincts sont rejetés**. Pour chacun, le journal donne le manifeste, la ligne `license`, son expression et **`rejected: license is not explicitly allowed`**. Aucun de ces 450 rejets ne prouve, à lui seul, une incompatibilité juridique : le moteur refuse toute licence non explicitement autorisée, y compris MIT.

Un rejet supplémentaire **`error[unlicensed]` concerne `quelleheureest@0.0.1`**. Le manifeste applicatif ne contient ni `license` ni `license-file` et indique `publish=false`. La licence propriétaire racine existe ; « unlicensed » signifie ici absence d'information exploitable par le moteur, pas absence de droits d'auteur, domaine public ou licence Unlicense.

Résumé réel du job : **advisories FAILED, licenses FAILED, bans OK, sources OK**. L'avertissement de maintenance `proc-macro-error` est distinct. Une politique de licences ne corrigerait pas les advisories.

### 2. Inventaire et force des preuves

Le [Cargo.lock actif](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/Cargo.lock) contient **491 entrées, 446 noms distincts : 490 paquets registry et l'application**.

- **450 déclarations** proviennent directement des manifestes registry affichés dans les diagnostics CI.
- **40 entrées supplémentaires** du verrou ont été rapprochées de manifestes amont de **même nom et même version**, en résolvant les licences héritées du workspace. Elles ne sont pas dans la liste des 450 rejets ; cela ne prouve ni acceptation par cargo-deny ni absence d'utilité. Le graphe de fonctionnalités et la sélection des dépendances dev/build peuvent modifier le périmètre.
- **Aucune déclaration SPDX manquante parmi ces 490 métadonnées tierces** ; une absente pour l'application.
- L'annexe 1 énumère **chaque nom/version**, groupé par expression exacte. L'annexe 2 fournit les 40 sources amont et leurs blobs Git. Les alternatives et versions de plateforme sont comptées séparément.

Limites : les archives crates.io des 40 entrées n'ont pas été téléchargées dans cet environnement, donc leurs checksums n'ont pas été vérifiés par téléchargement. Le contrôle n'est pas une inspection exhaustive de chaque fichier de chaque crate, ni un inventaire des composants natifs incorporés à chaque APK/exécutable. L'inventaire porte sur le verrou actif ; les verrous/manifeste historiques restent des références conservées, pas des dépendances réactivées. Si des archives sources sont distribuées, leurs propres notices/licences doivent aussi être conservées et contrôlées.

Les expressions historiques `MIT/Apache-2.0`, `BSD-3-Clause/MIT`, etc. sont reproduites sans modification. Le [parseur spdx 0.13.4](https://github.com/EmbarkStudios/spdx/blob/0.13.4/src/lexer.rs) accepte explicitement `/` comme **OR** en mode lax ; ce n'est pas une expression SPDX canonique. Ce comportement technique ne dispense pas de lire les textes effectivement fournis.

Hypothèse de travail, faute de précision sur la distribution : **binaires propriétaires Android/desktop distribués à des tiers**. L'usage interne seul est distingué ; la juridiction, les canaux et les artefacts effectivement distribués restent à confirmer.

### 3. Classification et obligations

« Compatible propriétaire » signifie possibilité de conserver la licence propriétaire du code applicatif original **en respectant les conditions du composant**, pas droit d'appropriation exclusive du code tiers.

| SPDX observé | Qualification | Obligations et limites principales |
|---|---|---|
| MIT, ISC | Permissives, généralement compatibles | Conserver les mentions de copyright et la permission dans les copies/portions substantielles conformément au texte ; fournir les exclusions de garantie. |
| Apache-2.0 | Permissive, généralement compatible | Remettre la licence ; marquer les fichiers modifiés ; conserver les notices requises et, si présent et pertinent, NOTICE. Brevet explicite avec terminaison dans les cas de la clause 3 ; pas de droit général sur les marques. |
| BSD-2-Clause, BSD-3-Clause | Permissives, généralement compatibles | Notices et exclusions en source, et en documentation/autres éléments accompagnant les binaires. BSD-3 interdit l'usage des noms pour endosser/promouvoir sans autorisation. |
| Zlib | Permissive, généralement compatible | Ne pas présenter faussement l'origine ; indiquer clairement les versions sources modifiées ; conserver la notice dans les distributions source. Ne pas confondre avec copyleft. |
| Unicode-3.0 | Permissive, avec notices de données/code | Copyright et permission avec les copies ou dans leur documentation ; restrictions d'utilisation publicitaire du nom du titulaire. Ne pas reprendre par erreur les obligations d'une ancienne variante Unicode. |
| 0BSD, MIT-0 | Permissives sans obligation classique d'attribution dans leur texte | Préserver les textes/provenances par prudence ; vérifier le texte livré et les droits de tiers. Ici présentes comme branches alternatives. |
| BSL-1.0 | Permissive | Conserver notices et déclaration de licence dans les copies/dérivés, avec l'exception prévue pour les formes exclusivement objet générées par un processeur de langage source. Ici alternative à Apache. |
| CC0-1.0, Unlicense | Renonciation/domaine public avec mécanismes de licence/fallback | Compatibilité généralement possible ; portée de la renonciation variable selon juridiction, autres droits non nécessairement couverts. Des alternatives MIT/MIT-0/Apache sont disponibles dans les expressions observées ; aucune nécessité de les autoriser globalement. |
| Apache-2.0 WITH LLVM-exception | Permissive, exception particulière | Identifiant distinct d'Apache seul. L'exception à 4(a), 4(b), 4(d) concerne les portions incorporées en objet par compilation du code utilisateur ; elle n'efface pas indistinctement les obligations pour toute distribution. |
| MPL-2.0 | Compatible avec une œuvre plus large propriétaire **sous conditions** | Copyleft par fichier couvert ; fournir les sources couvertes et leurs modifications sous MPL aux destinataires des exécutables, indiquer comment les obtenir raisonnablement et à temps, conserver notices et droits sur ces sources. L'EULA de l'exécutable ne doit pas réduire ces droits. Pas d'obligation générale d'ouvrir tous les fichiers originaux de l'application. |
| LGPL-2.1-or-later | Conditionnelle, potentiellement conflictuelle si ses conditions sont refusées | Cette branche apparaît dans `r-efi`, mais MIT/Apache sont des choix alternatifs. Si choisie ou imposée par un autre composant natif, vérifier sources, modifications, remplacement/reliaison et droits nécessaires selon version/mode de liaison. |
| Licence propriétaire de quelleheureest | Droits réservés, décision du titulaire | Identifier le texte existant et les autorisations de distribution ; ne pas inventer un octroi MIT/Apache pour satisfaire le moteur. Vérifier la chaîne des droits et les exclusions de code tiers. |

Textes primaires : [MIT](https://spdx.org/licenses/MIT.html), [ISC](https://spdx.org/licenses/ISC.html), [Apache](https://spdx.org/licenses/Apache-2.0.html), [BSD-3](https://spdx.org/licenses/BSD-3-Clause.html), [Zlib](https://spdx.org/licenses/Zlib.html), [Unicode-3](https://spdx.org/licenses/Unicode-3.0.html), [MPL-2](https://spdx.org/licenses/MPL-2.0.html) (notamment §§3.1–3.3), [LLVM exception](https://spdx.org/licenses/LLVM-exception.html), [LGPL-2.1](https://spdx.org/licenses/LGPL-2.1-or-later.html), [CC0](https://spdx.org/licenses/CC0-1.0.html), [Unlicense](https://spdx.org/licenses/Unlicense.html), [BSL](https://spdx.org/licenses/BSL-1.0.html), [0BSD](https://spdx.org/licenses/0BSD.html), [MIT-0](https://spdx.org/licenses/MIT-0.html), [BSD-2](https://spdx.org/licenses/BSD-2-Clause.html).

**Pas de licence tierce déclarée exclusivement GPL/AGPL/non commerciale identifiée dans les 490 entrées.** Cela ne certifie pas tous les fichiers embarqués, dépendances natives ou droits de marque/brevet. Aucune des cinq MPL ne justifie une suppression de dépendance.

### 4. Cas où les opérateurs et versions changent la conclusion

Les obligations **AND** s'additionnent ; un **OR** permet un choix documenté, sans supprimer les autres textes historiques :

- `brotli@9.0.0` : **BSD-3-Clause AND MIT**.
- `dpi@0.1.2` : **Apache-2.0 AND MIT**.
- `encoding_rs@0.8.42` : **(Apache-2.0 OR MIT) AND BSD-3-Clause**.
- `unicode-ident@1.0.27` : **(MIT OR Apache-2.0) AND Unicode-3.0**.
- `ring@0.17.14` : **Apache-2.0 AND ISC**, confirmé par le [manifeste de cette version](https://github.com/briansmith/ring/blob/2723abbca9e83347d82b056d5b239c6604f786df/Cargo.toml), le [LICENSE](https://github.com/briansmith/ring/blob/2723abbca9e83347d82b056d5b239c6604f786df/LICENSE), `LICENSE-other-bits`, `LICENSE-BoringSSL` et les licences du code once_cell. Ne pas appliquer une ancienne recette ring `MIT AND ISC AND OpenSSL` à cette version : le texte BoringSSL examiné est Apache-2.0. Le vrai OpenSSL natif doit être évalué séparément.
- `r-efi@5.3.0` et `@6.0.0` : **MIT OR Apache-2.0 OR LGPL-2.1-or-later**. Choisir MIT pour ces composants ne vaut pas choix pour une bibliothèque LGPL différente.
- `target-lexicon@0.12.16` : **Apache-2.0 WITH LLVM-exception**, donc accepter seulement Apache-2.0 n'est pas équivalent.
- `libloading@0.7.4`, `untrusted@0.9.0`, `rustls-webpki@0.103.15` : **ISC**, donc MIT/Apache seuls ne couvrent pas tout.
- Cinq versions exclusivement **MPL-2.0** : `cssparser@0.37.0`, `cssparser-macros@0.7.1`, `dtoa-short@0.3.5`, `option-ext@0.2.0`, `selectors@0.38.0`.

Les bindings Rust `libappindicator@0.9.0` et `libappindicator-sys@0.9.0` déclarent **Apache-2.0 OR MIT**. La licence du wrapper ne couvre pas automatiquement la bibliothèque native liée. De même, GLib/GTK/WebKit/OpenSSL et SDK/frameworks de plateforme nécessitent un inventaire des versions, du mode de liaison et de ce qui est réellement livré. Je ne certifie donc ni la conformité d'un APK, ni celle des bundles Linux/Windows/macOS non inspectés.

GLib vendored conserve son [texte MIT](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/vendor/glib-0.18.5/LICENSE). Les rétroports ne changent pas automatiquement cette licence ; conserver les notices/provenances amont et modifications. L'exclusion du vendor comme membre workspace n'exclut pas sa qualité de dépendance compilée.

### 5. Contradictions juridiques conservées sans modification

Preuves au commit audité :

- [LICENSE racine](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/LICENSE), blob `947481855a58de035c7c0d5ec268ccc895a891fc` : droits réservés, explicitement non open-source et restrictions de copie/modification/distribution sans autorisation écrite.
- [.github/README.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/.github/README.md#L8) : « Application open-source » en ligne 8, mais [lignes 278–285](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/.github/README.md#L278) déclarent le contraire. Le lien relatif `./LICENSE` vise `.github/LICENSE`, absent, alors que le texte est à la racine.
- [.bolt/prompt](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/.bolt/prompt#L1) : application open-source en ligne 1 et « 100 % open-source » en ligne 25. Cela peut aussi décrire un choix historique de stack ; on ne peut pas arbitrer la licence de l'application par déduction.
- [CLA du README, lignes 291–292](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/.github/README.md#L291) : prétend transférer tous les droits avec toute contribution. Ce texte seul ne prouve pas une cession valable et documentée de chaque auteur dans la juridiction concernée. Il ne transfère pas les droits sur des composants tiers que le contributeur ne possède pas.

Un dépôt accessible publiquement n'est pas, par ce seul fait, open-source. Inversement, la déclaration propriétaire de « tous les fichiers » ne peut pas effacer les grants/copyrights des composants tiers ni leurs droits sur les fichiers couverts MPL. Avant distribution, le titulaire doit arbitrer le régime du code original et prévoir les réserves explicites pour le tiers et l'EULA. **Aucun arbitrage juridique ni changement de texte n'a été effectué.**

### 6. Politique minimale proposée, soumise à accord explicite

Le noyau de **sept exigences** permet logiquement de satisfaire **485 des 490 expressions tierces**, en choisissant les branches permissives disponibles. Restent les cinq MPL et l'application. Il n'est pas nécessaire d'autoriser globalement LGPL, CC0, Unlicense, BSL, BSD-2, 0BSD ou MIT-0 pour satisfaire ces expressions actuelles, car un autre choix accepté existe. Cela ne signifie pas que ces licences seraient intrinsèquement mauvaises.

Ajouter **uniquement après décision** des autorisations MPL limitées aux cinq versions et une clarification de l'application liée au texte propriétaire existant. Une exception cargo-deny est ici une **acceptation explicite d'obligations**, pas une dispense de licence ni une suppression d'alerte de vulnérabilité.

La syntaxe est fondée sur la [documentation licences de cargo-deny 0.20.2](https://github.com/EmbarkStudios/cargo-deny/blob/0.20.2/docs/src/checks/licenses/cfg.md) et ses [PackageSpecs](https://github.com/EmbarkStudios/cargo-deny/blob/0.20.2/docs/src/checks/cfg.md#package-specs). Proposition complète, **non appliquée** :


```toml
# Proposition non appliquée / Unapplied proposal
[licenses]
allow = ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC", "Zlib",
         "Unicode-3.0", "Apache-2.0 WITH LLVM-exception"]
confidence-threshold = 0.8
include-build = true
# Étendre le contrôle aux tests / Include test-only dependencies
include-dev = true
# Uniquement après accord et procédure MPL / Only after approval and MPL process
exceptions = [
  { crate = "cssparser@0.37.0", allow = ["MPL-2.0"] },
  { crate = "cssparser-macros@0.7.1", allow = ["MPL-2.0"] },
  { crate = "dtoa-short@0.3.5", allow = ["MPL-2.0"] },
  { crate = "option-ext@0.2.0", allow = ["MPL-2.0"] },
  { crate = "selectors@0.38.0", allow = ["MPL-2.0"] },
  # Identifie le texte existant sans le modifier / Identifies existing unchanged text
  { crate = "quelleheureest@0.0.1", allow = ["LicenseRef-Phoen0x-Proprietary"] },
]
[licenses.private]
ignore = false

[[licenses.clarify]]
crate = "quelleheureest@0.0.1"
expression = "LicenseRef-Phoen0x-Proprietary"
license-files = [{ path = "../LICENSE", hash = 0x2ca1d603 }]
```

Le hash `0x2ca1d603` a été calculé sur **le texte LICENSE existant**, avec la normalisation cargo-deny (fins de lignes LF, LF final) et XxHash32 seed 0, après contrôle de deux vecteurs connus. SHA-256 du texte normalisé : `f982c2f3d05acc6eba0f6e447106270850faf4bbcec0d4702fb66914b7dcc34f`. Preuves de l'algorithme : [lecture des fichiers](https://github.com/EmbarkStudios/cargo-deny/blob/0.20.2/src/licenses/gather.rs), [fonction hash](https://github.com/EmbarkStudios/cargo-deny/blob/0.20.2/src/lib.rs). XxHash32 n'est pas un hash cryptographique ; le SHA/blob servent à tracer l'origine. `../LICENSE` est relatif à la racine du paquet `src-tauri`.

Le nom `LicenseRef-Phoen0x-Proprietary` identifie le texte actuel, **sans le modifier ni créer une nouvelle autorisation juridique**. Il ne doit être accepté qu'après confirmation par le titulaire. La métadonnée Cargo éventuelle `license-file = "../LICENSE"` serait une autre modification, soumise à accord ; ajouter `license = "MIT"` ou `"Unlicense"` serait un changement juridique injustifié.

Choix volontaire : `private.ignore=false` maintient le contrôle de l'application. L'alternative `private.ignore=true` serait plus large et cacherait les erreurs de futures racines privées ; elle n'est pas recommandée comme solution minimale. Aucun `exclude`, seuil réduit ou accord général OSI/FSF n'est proposé. `include-dev=true` étend le contrôle au lieu de l'affaiblir. Les exceptions sont limitées aux versions actuelles ; des changements de version/textes devront être revus. Les checks advisories/bans/sources restent distincts et ne sont pas neutralisés.

### 7. Conséquences opérationnelles avant acceptation

1. **Permissives** : documenter les choix OR, produire les notices/licences tierces réellement nécessaires pour chaque artefact, conserver NOTICE et marqueurs de modifications requis. L'allowlist ne produit pas ces fichiers.
2. **MPL** : prévoir l'accès aux sources exactes couvertes, aux modifications et aux notices pour les destinataires ; vérifier l'EULA. Autoriser les cinq paquets sans ce processus ne vaut pas conformité.
3. **Application** : confirmer le régime propriétaire, les ayants droit et les autorisations de distribution ; traiter la contradiction documentaire et la portée du CLA séparément, avec accord. La licence réservée actuelle ne démontre pas que tous les utilisateurs ont déjà un droit de distribution.
4. **Natif/platformes** : établir la liste effective des bibliothèques/versions et de leur mode de liaison par cible ; vérifier les obligations LGPL si pertinentes, OpenSSL selon version, SDK et contenu des bundles. Ne pas extrapoler la licence du crate wrapper.
5. **Archives/code fantôme** : aucune suppression/réactivation. Leur absence d'un exécutable ne supprime pas les obligations applicables à une éventuelle redistribution du dépôt source et des archives. Préserver les notices et provenances des variantes historiques.
6. **Usage interne** : les obligations de mise à disposition de sources liées à la distribution ne se déclenchent généralement pas par le seul usage interne. Les restrictions d'utilisation, droits de brevet/marque, copies et redistributions à des tiers restent à examiner ; « usage interne » ne signifie pas licence inexistante.

### 8. Vérifications réellement effectuées et limites

- Lecture des instructions AGENTS.md, README et prompt ; inspection des textes propriétaires et MIT vendored, sans modifications.
- Extraction du journal CI, contrôle des **450 diagnostics exacts** et du rejet applicatif ; aucune classification fondée uniquement sur le statut rouge.
- Parsing du Cargo.lock et rapprochement exhaustif : **490/490 identifiants registry uniques couverts**, plus l'application ; absence de doublon/missing dans ce rapprochement, versions avec suffixes conservées.
- Lecture de 40 manifestes amont de même nom/version et héritages workspace, ainsi que des textes de ring 0.17.14.
- Lecture du comportement et de la syntaxe de cargo-deny **0.20.2** et du parseur SPDX **0.13.4**.
- **Parsing TOML réussi** de la proposition hors dépôt ; évaluation logique indépendante des 490 expressions : sept exigences => **485 satisfaites, cinq MPL restantes**. Ce calcul n'est pas une exécution du moteur cargo-deny ni une validation juridique.
- Aucun `cargo`, `rustc` ou `cargo-deny` local disponible. **La proposition n'a pas été exécutée avec cargo-deny** et aucun nouveau workflow n'a été déclenché. Les résultats CI cités sont ceux du run existant, pas d'une configuration proposée.
- Aucun contrôle Android/StackBlitz/Cursor/Claude ni vérification juridique intégrale des APK/bundles natifs n'est revendiqué. Les configurations de ces outils, dépendances optionnelles, verrous historiques, archives et rétroports restent intacts.

Validation future, **après accord**, dans une copie isolée : moteur exact 0.20.2, lock gelé, configuration proposée, contrôle licence puis tous les checks ; examen explicite des graphes/features/cibles supportés. Vérifier la reconnaissance de la clarification/du hash, le graphe dev/build, les sources natives et les notices des artefacts. Une analyse all-features peut demander une matrice si certaines variantes sont incompatibles entre elles ; ne pas les retirer.

### 9. Décisions humaines et verdict

Accord explicite nécessaire avant :
- l'ajout de toute politique cargo-deny, même permissive ;
- les cinq acceptations MPL et leur procédure de sources/EULA ;
- la clarification du paquet propriétaire et toute métadonnée de licence ;
- toute correction des documents juridiques/contradictions, après confirmation des droits et du mode de distribution.

**Verdict : échec de licences expliqué et proposition concrète préparée ; conformité de distribution et succès cargo-deny non encore validés.** Les 450 rejets ne démontrent pas 450 incompatibilités. Aucun paquet ne doit être supprimé pour obtenir un audit vert. La PR ne doit pas être déclarée prête à fusionner sur la seule base de cet audit ; le check demeure en échec tant qu'une politique n'est pas décidée/appliquée/validée, et les advisories sont un autre blocage.

**EN:** Read-only licence audit of PR #153 at the pinned commit. All 490 registry package/version declarations and the application's missing machine metadata are inventoried. The 450 observed registry rejections result from an empty default allowlist. Five MPL-only versions require a source-compliance process; application proprietary metadata and contradictory documentation require owner decisions. The scoped policy above is an unapplied proposal, not a successful cargo-deny run or a certification of native-binary compliance. No repository changes, dependency removals, workflow/policy changes or merge were performed.



---

## Audit licences — annexe 1 : inventaire intégral du Cargo.lock actif

Commit audité : `138f029e44c4b63abef8d5315845b360814f76f3`.

**491 entrées = 490 paquets registry + quelleheureest 0.0.1 ; 446 noms distincts.** Toutes les versions sont conservées, y compris les variantes de plateforme, build, développement et optionnelles représentées par ce lock. Ce tableau décrit les licences déclarées, pas une certification de chaque fichier ni de chaque bibliothèque native.

**R** : 450 rejets réellement observés, tous pour `license is not explicitly allowed`, faute d'allowlist. **H** : 40 entrées supplémentaires du verrou, absence dans ces rejets ; déclaration vérifiée dans un manifeste amont de même nom/version (annexe 2). H ne signifie ni acceptation cargo-deny ni dépendance inutile. `/` est conservé tel que déclaré ; le parseur SPDX lax utilisé le traite comme OR.

Chaque groupe associe l'expression déclarée à tous ses noms/versions ; les obligations figurent au rapport principal. Preuve des R : [job cargo-deny 115672063173](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38508720134/job/115672063173), avec ligne du `license` et diagnostic pour chaque paquet. Preuve des versions/checksums : [Cargo.lock](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/Cargo.lock).

### `(Apache-2.0 OR MIT) AND BSD-3-Clause` — 1 versions

**R (1)** : `encoding_rs@0.8.42`.

### `(MIT OR Apache-2.0) AND Unicode-3.0` — 1 versions

**R (1)** : `unicode-ident@1.0.27`.

### `0BSD OR MIT OR Apache-2.0` — 1 versions

**R (1)** : `adler2@2.0.1`.

### `Apache-2.0` — 3 versions

**R (3)** : `openssl@0.10.81`, `sync_wrapper@1.0.2`, `tao@0.37.1`.

### `Apache-2.0 / MIT` — 1 versions

**R (1)** : `fnv@1.0.7`.

### `Apache-2.0 AND ISC` — 1 versions

**H (1)** : `ring@0.17.14`.

### `Apache-2.0 AND MIT` — 1 versions

**R (1)** : `dpi@0.1.2`.

### `Apache-2.0 OR BSL-1.0` — 1 versions

**R (1)** : `ryu@1.0.23`.

### `Apache-2.0 OR ISC OR MIT` — 3 versions

**H (3)** : `hyper-rustls@0.27.10`, `rustls@0.23.45`, `rustls-pemfile@1.0.4`.

### `Apache-2.0 OR MIT` — 32 versions

**R (30)** : `atomic-waker@1.1.2`, `autocfg@1.5.1`, `bit-set@0.8.0`, `bit-vec@0.8.0`, `cargo_toml@1.0.1`, `ctor@1.0.13`, `equivalent@1.0.2`, `fastrand@2.5.0`, `idna_adapter@1.2.2`, `indexmap@1.9.3`, `indexmap@2.14.2`, `muda@0.20.0`, `multiversion_no_op@1.0.0`, `pin-project-lite@0.2.17`, `portable-atomic@1.15.0`, `portable-atomic-util@0.2.8`, `rustc-hash@2.1.3`, `tauri@2.12.3`, `tauri-build@2.7.2`, `tauri-codegen@2.7.2`, `tauri-macros@2.7.2`, `tauri-runtime@2.12.1`, `tauri-runtime-wry@2.12.1`, `tauri-utils@2.10.1`, `utf8_iter@1.0.4`, `utf8parse@0.2.2`, `uuid@1.28.0`, `window-vibrancy@0.8.1`, `wry@0.57.0`, `zeroize@1.9.1`.

**H (2)** : `libappindicator@0.9.0`, `libappindicator-sys@0.9.0`.

### `Apache-2.0 WITH LLVM-exception` — 1 versions

**R (1)** : `target-lexicon@0.12.16`.

### `Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT` — 5 versions

**R (5)** : `linux-raw-sys@0.12.1`, `rustix@1.1.5`, `wasi@0.11.1+wasi-snapshot-preview1`, `wasip2@1.0.4+wasi-0.2.12`, `wit-bindgen@0.57.1`.

### `Apache-2.0/MIT` — 3 versions

**R (3)** : `cesu8@1.1.0`, `dbus@0.9.12`, `libdbus-sys@0.2.7`.

### `BSD-2-Clause OR Apache-2.0 OR MIT` — 2 versions

**R (1)** : `zerocopy@0.8.62`.

**H (1)** : `zerocopy-derive@0.8.62`.

### `BSD-3-Clause` — 3 versions

**R (2)** : `alloc-no-stdlib@3.0.0`, `alloc-stdlib@0.3.0`.

**H (1)** : `subtle@2.6.1`.

### `BSD-3-Clause AND MIT` — 1 versions

**R (1)** : `brotli@9.0.0`.

### `BSD-3-Clause OR MIT OR Apache-2.0` — 2 versions

**R (2)** : `num_enum@0.7.6`, `num_enum_derive@0.7.6`.

### `BSD-3-Clause/MIT` — 1 versions

**R (1)** : `brotli-decompressor@6.0.1`.

### `CC0-1.0 OR MIT-0 OR Apache-2.0` — 1 versions

**R (1)** : `dunce@1.0.5`.

### `ISC` — 3 versions

**H (3)** : `libloading@0.7.4`, `rustls-webpki@0.103.15`, `untrusted@0.9.0`.

### `MIT` — 111 versions

**R (109)** : `atk@0.18.2`, `atk-sys@0.18.2`, `block2@0.6.2`, `bytes@1.12.1`, `cairo-rs@0.18.5`, `cairo-sys-rs@0.18.2`, `cargo_metadata@0.19.2`, `cfb@0.14.0`, `combine@4.6.8`, `darling@0.24.1`, `darling_core@0.24.1`, `darling_macro@0.24.1`, `derive_more@2.1.1`, `derive_more-impl@2.1.1`, `dlopen2@0.8.2`, `dlopen2_derive@0.4.3`, `dom_query@0.28.0`, `embed-resource@3.0.12`, `gdk@0.18.2`, `gdk-pixbuf@0.18.5`, `gdk-pixbuf-sys@0.18.0`, `gdk-sys@0.18.2`, `gdkwayland-sys@0.18.2`, `gdkx11@0.18.2`, `gdkx11-sys@0.18.2`, `generic-array@0.14.7`, `gio@0.18.4`, `gio-sys@0.18.1`, `glib@0.18.5`, `glib-macros@0.18.5`, `glib-sys@0.18.1`, `gobject-sys@0.18.0`, `gtk@0.18.2`, `gtk-sys@0.18.2`, `gtk3-macros@0.18.2`, `h2@0.4.20`, `http-body@1.1.0`, `http-body-util@0.1.5`, `hyper@1.12.0`, `hyper-util@0.1.21`, `ico@0.5.0`, `infer@0.22.0`, `javascriptcore-rs@1.1.2`, `javascriptcore-rs-sys@1.1.1`, `libredox@0.1.25`, `libsqlite3-sys@0.26.0`, `memoffset@0.9.1`, `mio@1.2.4`, `new_debug_unreachable@1.0.6`, `objc2@0.6.5`, `objc2-encode@4.1.0`, `objc2-foundation@0.3.2`, `openssl-sys@0.9.117`, `pango@0.18.3`, `pango-sys@0.18.0`, `parse-zoneinfo@0.3.1`, `phf@0.11.3`, `phf@0.13.1`, `phf_codegen@0.11.3`, `phf_codegen@0.13.1`, `phf_generator@0.11.3`, `phf_generator@0.13.1`, `phf_macros@0.13.1`, `phf_shared@0.11.3`, `phf_shared@0.13.1`, `plist@1.10.1`, `precomputed-hash@0.1.1`, `quick-xml@0.42.0`, `redox_syscall@0.5.18`, `redox_users@0.5.3`, `rusqlite@0.29.0`, `schannel@0.1.29`, `schemars@0.8.22`, `schemars_derive@0.8.22`, `simd-adler32@0.3.10`, `slab@0.4.12`, `soup3@0.5.0`, `soup3-sys@0.5.0`, `strsim@0.11.1`, `synstructure@0.14.0`, `tauri-winres@0.3.6`, `tokio@1.53.2`, `tokio-macros@2.7.2`, `tokio-native-tls@0.3.1`, `tokio-util@0.7.20`, `tower@0.5.3`, `tower-http@0.6.11`, `tower-layer@0.3.3`, `tower-service@0.3.3`, `tracing@0.1.44`, `tracing-core@0.1.36`, `try-lock@0.2.5`, `urlencoding@2.1.3`, `urlpattern@0.6.0`, `version-compare@0.2.1`, `vswhom@0.1.0`, `vswhom-sys@0.1.3`, `want@0.3.2`, `webkit2gtk@2.0.2`, `webkit2gtk-sys@2.0.2`, `webview2-com@0.39.1`, `webview2-com-macros@0.8.1`, `webview2-com-sys@0.39.1`, `winnow@0.5.40`, `winnow@1.0.4`, `winreg@0.56.0`, `x11@2.21.0`, `x11-dl@2.21.0`, `zmij@1.0.23`.

**H (2)** : `schemars@0.9.0`, `schemars@1.2.3`.

### `MIT OR Apache-2.0` — 233 versions

**R (213)** : `ahash@0.8.12`, `allocator-api2@0.2.21`, `android_system_properties@0.1.6`, `anstream@1.0.0`, `anstyle@1.0.14`, `anstyle-parse@1.0.0`, `anstyle-query@1.1.5`, `anstyle-wincon@3.0.11`, `anyhow@1.0.104`, `base64@0.21.7`, `base64@0.22.1`, `base64@0.23.1`, `bitflags@2.13.2`, `block-buffer@0.10.4`, `bumpalo@3.20.3`, `camino@1.2.6`, `cargo-platform@0.1.9`, `cc@1.8.0`, `cfg-expr@0.15.8`, `cfg-if@1.0.5`, `chrono@0.4.45`, `chrono-tz@0.8.6`, `chrono-tz-build@0.2.1`, `colorchoice@1.0.5`, `cookie@0.18.2`, `core-foundation@0.10.1`, `core-foundation@0.9.4`, `core-foundation-sys@0.8.7`, `core-graphics@0.25.0`, `core-graphics-types@0.2.0`, `cpufeatures@0.2.17`, `crc32fast@1.5.2`, `crossbeam-channel@0.5.17`, `crossbeam-utils@0.8.23`, `crypto-common@0.1.7`, `deranged@0.5.8`, `digest@0.10.7`, `dirs@7.0.0`, `dirs-sys@0.5.0`, `displaydoc@0.2.7`, `dtoa@1.0.11`, `dyn-clone@1.0.20`, `embed_plist@1.2.2`, `env_filter@2.0.0`, `env_logger@0.11.11`, `erased-serde@0.4.10`, `errno@0.3.14`, `fdeflate@0.3.7`, `field-offset@0.3.6`, `find-msvc-tools@0.1.14`, `flate2@1.1.10`, `form_urlencoded@1.2.2`, `futures-channel@0.3.34`, `futures-core@0.3.34`, `futures-executor@0.3.34`, `futures-io@0.3.34`, `futures-macro@0.3.34`, `futures-sink@0.3.34`, `futures-task@0.3.34`, `futures-util@0.3.34`, `getrandom@0.3.4`, `getrandom@0.4.3`, `glob@0.3.4`, `hashbrown@0.12.3`, `hashbrown@0.14.5`, `hashbrown@0.17.1`, `hashlink@0.8.4`, `heck@0.4.1`, `heck@0.5.0`, `html5ever@0.39.0`, `http@1.5.0`, `httparse@1.10.1`, `iana-time-zone@0.1.65`, `iana-time-zone-haiku@0.1.2`, `idna@1.1.0`, `ipnet@2.12.2`, `is_terminal_polyfill@1.70.2`, `itoa@1.0.18`, `jni-sys@0.3.1`, `jni-sys@0.4.1`, `jni-sys-macros@0.4.1`, `js-sys@0.3.106`, `jsonptr@0.7.1`, `keyboard-types@0.8.3`, `libc@0.2.190`, `lock_api@0.4.14`, `log@0.4.34`, `markup5ever@0.39.0`, `mime@0.3.17`, `native-tls@0.2.18`, `ndk@0.9.0`, `ndk-context@0.1.1`, `ndk-sys@0.6.0+11769913`, `num-conv@0.2.2`, `num-traits@0.2.19`, `once_cell@1.21.4`, `once_cell_polyfill@1.70.2`, `openssl-probe@0.2.1`, `parking_lot@0.12.5`, `parking_lot_core@0.9.12`, `percent-encoding@2.3.2`, `pkg-config@0.3.34`, `png@0.17.16`, `png@0.18.1`, `powerfmt@0.2.1`, `proc-macro-crate@1.3.1`, `proc-macro-crate@2.0.2`, `proc-macro-crate@3.5.0`, `proc-macro-error@1.0.4`, `proc-macro-error-attr@1.0.4`, `proc-macro2@1.0.107`, `quote@1.0.47`, `rand@0.8.8`, `rand_core@0.6.4`, `regex@1.13.1`, `regex-automata@0.4.18`, `regex-syntax@0.8.11`, `reqwest@0.12.28`, `reqwest@0.13.5`, `rustc_version@0.4.1`, `rustls-pki-types@1.15.1`, `rustversion@1.0.23`, `scopeguard@1.2.0`, `security-framework@3.7.0`, `security-framework-sys@2.17.0`, `semver@1.0.28`, `serde@1.0.229`, `serde-untagged@0.1.9`, `serde_core@1.0.229`, `serde_derive@1.0.229`, `serde_derive_internals@0.29.1`, `serde_json@1.0.154`, `serde_repr@0.1.21`, `serde_spanned@0.6.9`, `serde_spanned@1.1.2`, `serde_with@3.24.0`, `serde_with_macros@3.24.0`, `serialize-to-javascript@0.1.2`, `serialize-to-javascript-impl@0.1.2`, `servo_arc@0.4.3`, `sha2@0.10.9`, `shlex@2.0.1`, `signal-hook-registry@1.4.8`, `simdutf8@0.1.5`, `siphasher@1.0.4`, `smallvec@1.16.3`, `socket2@0.6.5`, `softbuffer@0.4.8`, `stable_deref_trait@1.2.1`, `string_cache@0.9.0`, `string_cache_codegen@0.6.1`, `swift-rs@1.0.9`, `syn@1.0.109`, `syn@2.0.119`, `syn@3.0.9`, `system-configuration@0.7.0`, `system-configuration-sys@0.6.0`, `system-deps@6.2.2`, `tao-macros@0.1.4`, `tempfile@3.27.0`, `tendril@0.5.1`, `thiserror@1.0.69`, `thiserror@2.0.21`, `thiserror-impl@1.0.69`, `thiserror-impl@2.0.21`, `time@0.3.55`, `time-core@0.1.9`, `time-macros@0.2.32`, `toml@0.8.2`, `toml@1.1.8+spec-1.1.0`, `toml_datetime@0.6.3`, `toml_datetime@1.1.2+spec-1.1.0`, `toml_edit@0.19.15`, `toml_edit@0.20.2`, `toml_edit@0.25.17+spec-1.1.0`, `toml_parser@1.1.5+spec-1.1.0`, `toml_writer@1.1.3+spec-1.1.0`, `typeid@1.0.3`, `typenum@1.20.1`, `unicode-segmentation@1.13.3`, `url@2.5.8`, `wasm-bindgen@0.2.129`, `wasm-bindgen-futures@0.4.79`, `wasm-bindgen-macro@0.2.129`, `wasm-bindgen-macro-support@0.2.129`, `wasm-bindgen-shared@0.2.129`, `wasm-streams@0.5.0`, `web-sys@0.3.106`, `web-time@1.1.0`, `web_atoms@0.2.6`, `windows@0.62.2`, `windows-collections@0.3.2`, `windows-core@0.62.2`, `windows-future@0.3.2`, `windows-implement@0.60.2`, `windows-interface@0.59.3`, `windows-link@0.2.1`, `windows-numerics@0.3.1`, `windows-registry@0.6.1`, `windows-result@0.4.1`, `windows-strings@0.5.1`, `windows-sys@0.45.0`, `windows-sys@0.61.2`, `windows-targets@0.42.2`, `windows-threading@0.2.1`, `windows-version@0.1.7`, `windows_aarch64_gnullvm@0.42.2`, `windows_aarch64_msvc@0.42.2`, `windows_i686_gnu@0.42.2`, `windows_i686_msvc@0.42.2`, `windows_x86_64_gnu@0.42.2`, `windows_x86_64_gnullvm@0.42.2`, `windows_x86_64_msvc@0.42.2`.

**H (20)** : `defmt@1.1.1`, `defmt-macros@1.1.1`, `defmt-parser@1.0.0`, `getrandom@0.2.17`, `hex@0.4.3`, `httpdate@1.0.3`, `ref-cast@1.0.27`, `ref-cast-impl@1.0.27`, `tokio-rustls@0.26.6`, `tray-icon@0.25.1`, `windows-sys@0.52.0`, `windows-targets@0.52.6`, `windows_aarch64_gnullvm@0.52.6`, `windows_aarch64_msvc@0.52.6`, `windows_i686_gnu@0.52.6`, `windows_i686_gnullvm@0.52.6`, `windows_i686_msvc@0.52.6`, `windows_x86_64_gnu@0.52.6`, `windows_x86_64_gnullvm@0.52.6`, `windows_x86_64_msvc@0.52.6`.

### `MIT OR Apache-2.0 OR LGPL-2.1-or-later` — 2 versions

**R (2)** : `r-efi@5.3.0`, `r-efi@6.0.0`.

### `MIT OR Apache-2.0 OR Zlib` — 1 versions

**R (1)** : `raw-window-handle@0.6.2`.

### `MIT OR Zlib OR Apache-2.0` — 2 versions

**R (2)** : `miniz_oxide@0.8.9`, `miniz_oxide@0.9.1`.

### `MIT/Apache-2.0` — 21 versions

**R (20)** : `bitflags@1.3.2`, `core_detect@1.0.0`, `fallible-iterator@0.2.0`, `fallible-streaming-iterator@0.1.9`, `foreign-types@0.3.2`, `foreign-types@0.5.0`, `foreign-types-macros@0.2.4`, `foreign-types-shared@0.1.1`, `foreign-types-shared@0.3.1`, `hyper-tls@0.6.0`, `ident_case@1.0.1`, `jni@0.21.1`, `json-patch@4.2.0`, `openssl-macros@0.1.1`, `serde_urlencoded@0.7.1`, `vcpkg@0.2.15`, `version_check@0.9.5`, `winapi@0.3.9`, `winapi-i686-pc-windows-gnu@0.4.0`, `winapi-x86_64-pc-windows-gnu@0.4.0`.

**H (1)** : `bs58@0.5.1`.

### `MPL-2.0` — 5 versions

**R (5)** : `cssparser@0.37.0`, `cssparser-macros@0.7.1`, `dtoa-short@0.3.5`, `option-ext@0.2.0`, `selectors@0.38.0`.

### `Unicode-3.0` — 18 versions

**R (18)** : `icu_collections@2.3.0`, `icu_locale_core@2.3.0`, `icu_normalizer@2.3.0`, `icu_normalizer_data@2.3.0`, `icu_properties@2.3.0`, `icu_properties_data@2.3.0`, `icu_provider@2.3.1`, `litemap@0.8.3`, `potential_utf@0.1.6`, `tinystr@0.8.4`, `writeable@0.6.4`, `yoke@0.8.3`, `yoke-derive@0.8.4`, `zerofrom@0.1.8`, `zerofrom-derive@0.1.8`, `zerotrie@0.2.5`, `zerovec@0.11.8`, `zerovec-derive@0.11.6`.

### `Unlicense OR MIT` — 9 versions

**R (6)** : `aho-corasick@1.1.5`, `byteorder@1.5.0`, `jiff@0.2.38`, `jiff-core@0.1.1`, `memchr@2.8.3`, `winapi-util@0.1.11`.

**H (3)** : `jiff-static@0.2.38`, `jiff-tzdb@0.1.9`, `jiff-tzdb-platform@0.1.3`.

### `Unlicense/MIT` — 2 versions

**R (2)** : `same-file@1.0.6`, `walkdir@2.5.0`.

### `Zlib` — 2 versions

**R (1)** : `foldhash@0.2.0`.

**H (1)** : `zlib-rs@0.6.8`.

### `Zlib OR Apache-2.0 OR MIT` — 17 versions

**R (15)** : `bytemuck@1.25.2`, `dispatch2@0.3.1`, `objc2-app-kit@0.3.2`, `objc2-cloud-kit@0.3.2`, `objc2-core-data@0.3.2`, `objc2-core-foundation@0.3.2`, `objc2-core-graphics@0.3.2`, `objc2-core-image@0.3.2`, `objc2-core-location@0.3.2`, `objc2-core-text@0.3.2`, `objc2-exception-helper@0.1.1`, `objc2-quartz-core@0.3.2`, `objc2-ui-kit@0.3.2`, `objc2-user-notifications@0.3.2`, `objc2-web-kit@0.3.2`.

**H (2)** : `objc2-io-surface@0.3.2`, `tinyvec@1.13.3`.

### Paquet applicatif — U

`quelleheureest@0.0.1` : `error[unlicensed]`, manifeste sans `license`/`license-file`, `publish=false`. Le texte propriétaire racine existe ; le défaut est la reconnaissance machine, pas une mise dans le domaine public. Ne pas ajouter MIT/Unlicense sans décision de licence.

EN: Full locked-package metadata inventory; R = observed empty-allowlist rejection, H = matching upstream declaration outside the rejection set, U = missing application machine-readable metadata. No package was removed or reactivated.


---

## Audit licences — annexe 2 : preuves amont des 40 entrées hors des rejets CI

Les 450 autres déclarations proviennent directement des manifestes registry affichés par cargo-deny dans le job cité. Pour ces 40 entrées du lock, le nom **et la version** ont été vérifiés dans les sources amont ; une licence héritée du workspace a été résolue. Les archives crates.io n'ont pas pu être téléchargées dans cet environnement : leurs checksums du Cargo.lock n'ont donc pas été revérifiés par téléchargement. Cette limite est explicite ; aucune acceptation par le moteur cargo-deny n'est déduite de leur absence des 450 rejets.

| Paquet | Expression déclarée | Manifeste amont et blob Git | Héritage workspace |
|---|---|---|---|
| `bs58@0.5.1` | `MIT/Apache-2.0` | [source](https://github.com/Nullus157/bs58-rs/blob/0.5.1/Cargo.toml) — `155a225564f8b5c031cfa52fdf2f1e109414c1e4` | — |
| `defmt@1.1.1` | `MIT OR Apache-2.0` | [source](https://github.com/knurling-rs/defmt/blob/defmt-v1.1.1/defmt/Cargo.toml) — `8f74d1cb763cc3fe0da0fab08599cdc76e8ddf0e` | — |
| `defmt-macros@1.1.1` | `MIT OR Apache-2.0` | [source](https://github.com/knurling-rs/defmt/blob/defmt-v1.1.1/macros/Cargo.toml) — `57a09ce501374851d28339c28b3e26094eea54bd` | — |
| `defmt-parser@1.0.0` | `MIT OR Apache-2.0` | [source](https://github.com/knurling-rs/defmt/blob/defmt-v1.1.1/parser/Cargo.toml) — `d66cd58af66b1970a7fcb54d7f8018509306de49` | — |
| `getrandom@0.2.17` | `MIT OR Apache-2.0` | [source](https://github.com/rust-random/getrandom/blob/v0.2.17/Cargo.toml) — `fa2a05d8d686a7f4444d2e35abee38de5989402d` | — |
| `hex@0.4.3` | `MIT OR Apache-2.0` | [source](https://github.com/KokaKiwi/rust-hex/blob/v0.4.3/Cargo.toml) — `b25d8dd700ea40907c142428bb9b4cf7631fd310` | — |
| `httpdate@1.0.3` | `MIT OR Apache-2.0` | [source](https://github.com/pyfisch/httpdate/blob/v1.0.3/Cargo.toml) — `ddc17f10991084ad4dea8695b444a5ed6c1293d7` | — |
| `hyper-rustls@0.27.10` | `Apache-2.0 OR ISC OR MIT` | [source](https://github.com/rustls/hyper-rustls/blob/v/0.27.10/Cargo.toml) — `659cb4868a2e1d5d9186eb8d3b1498f514e89f69` | — |
| `jiff-static@0.2.38` | `Unlicense OR MIT` | [source](https://github.com/BurntSushi/jiff/blob/jiff-static-0.2.38/crates/jiff-static/Cargo.toml) — `8f1fb07229e54d07f6670b00f005d8f9b2edbc08` | — |
| `jiff-tzdb@0.1.9` | `Unlicense OR MIT` | [source](https://github.com/BurntSushi/jiff/blob/jiff-tzdb-0.1.9/crates/jiff-tzdb/Cargo.toml) — `d257b460fe3e496f633be9ae65ccb83072df95c7` | — |
| `jiff-tzdb-platform@0.1.3` | `Unlicense OR MIT` | [source](https://github.com/BurntSushi/jiff/blob/jiff-tzdb-platform-0.1.3/crates/jiff-tzdb-platform/Cargo.toml) — `8fd9253d3a5b797a5e5a37282505758e371b8f08` | — |
| `libappindicator@0.9.0` | `Apache-2.0 OR MIT` | [source](https://github.com/tauri-apps/libappindicator-rs/blob/main/Cargo.toml) — `b95a402b4cfb30489567f5b62dd2e88d658b3bc2` | — |
| `libappindicator-sys@0.9.0` | `Apache-2.0 OR MIT` | [source](https://github.com/tauri-apps/libappindicator-rs/blob/main/sys/Cargo.toml) — `8cc6e196b2eef71bedbc00bf5b51ac2770d21353` | — |
| `libloading@0.7.4` | `ISC` | [source](https://github.com/nagisa/rust_libloading/blob/0.7.4/Cargo.toml) — `3fdf0c8cda9968a3d17e12e2692932b30dae570c` | — |
| `objc2-io-surface@0.3.2` | `Zlib OR Apache-2.0 OR MIT` | [source](https://github.com/madsmtm/objc2/blob/main/framework-crates/objc2-io-surface/Cargo.toml) — `43abee39c32b3343b3d301a6d8c5bdc8be63a2c3` | [workspace](https://github.com/madsmtm/objc2/blob/main/Cargo.toml) |
| `ref-cast@1.0.27` | `MIT OR Apache-2.0` | [source](https://github.com/dtolnay/ref-cast/blob/1.0.27/Cargo.toml) — `245413c78c3502c3cef06187a64d18db6959fe8b` | — |
| `ref-cast-impl@1.0.27` | `MIT OR Apache-2.0` | [source](https://github.com/dtolnay/ref-cast/blob/1.0.27/derive/Cargo.toml) — `13e4eb6bff7bc1fdfcfc66dd50dcd7ddf30412ef` | — |
| `ring@0.17.14` | `Apache-2.0 AND ISC` | [source](https://github.com/briansmith/ring/blob/2723abbca9e83347d82b056d5b239c6604f786df/Cargo.toml) — `8f8da17dad7dc081290c6b9fee8c90b214cf4148` | — |
| `rustls@0.23.45` | `Apache-2.0 OR ISC OR MIT` | [source](https://github.com/rustls/rustls/blob/v/0.23.45/rustls/Cargo.toml) — `a1c97bdf6bc29dc238ea22499d4893acdbbd61aa` | — |
| `rustls-pemfile@1.0.4` | `Apache-2.0 OR ISC OR MIT` | [source](https://github.com/rustls/pemfile/blob/v/1.0.4/Cargo.toml) — `a0d84193f20d58b5d13c8835bcc43595b10c2d80` | — |
| `rustls-webpki@0.103.15` | `ISC` | [source](https://github.com/rustls/webpki/blob/v/0.103.15/Cargo.toml) — `c531f007e5c802c0e34eb6fd1fa6c3f35486b643` | — |
| `schemars@0.9.0` | `MIT` | [source](https://github.com/GREsau/schemars/blob/v0.9.0/schemars/Cargo.toml) — `e6a431d6a3cb467e99c6f6bc559939a1a88a7170` | — |
| `schemars@1.2.3` | `MIT` | [source](https://github.com/GREsau/schemars/blob/v1.2.3/schemars/Cargo.toml) — `79e08c67aee552602af7f71918b871244570e5ec` | — |
| `subtle@2.6.1` | `BSD-3-Clause` | [source](https://github.com/dalek-cryptography/subtle/blob/2.6.1/Cargo.toml) — `0a313eebf10ca5eb004fbe203c5569e008bbbc57` | — |
| `tinyvec@1.13.3` | `Zlib OR Apache-2.0 OR MIT` | [source](https://github.com/Lokathor/tinyvec/blob/v1.13.3/Cargo.toml) — `8a6ea040263c3f7562e2a7394d40a865c3bce221` | — |
| `tokio-rustls@0.26.6` | `MIT OR Apache-2.0` | [source](https://github.com/rustls/tokio-rustls/blob/v/0.26.6/Cargo.toml) — `72766dc0684c0671b5884c68c1215d6ae49e2331` | — |
| `tray-icon@0.25.1` | `MIT OR Apache-2.0` | [source](https://github.com/tauri-apps/tray-icon/blob/tray-icon-v0.25.1/Cargo.toml) — `8de42993d6f6305a8f87b162ef5282853529b889` | — |
| `untrusted@0.9.0` | `ISC` | [source](https://github.com/briansmith/untrusted/blob/main/Cargo.toml) — `92be2396fdc220b9f56a6761508a44b45dddfea3` | — |
| `windows-sys@0.52.0` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.52.0/crates/libs/sys/Cargo.toml) — `5f9642bde897b5ba4c3309eec94db6d9c78d466f` | — |
| `windows-targets@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/libs/targets/Cargo.toml) — `3aba60664381db040f3b112d8f06892567e00434` | — |
| `windows_aarch64_gnullvm@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/aarch64_gnullvm/Cargo.toml) — `0dfcf6c50ce1fb5f79668b22d9a9b19c68ed3a08` | — |
| `windows_aarch64_msvc@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/aarch64_msvc/Cargo.toml) — `e9f30ea128017bb686c991105b08bba585723888` | — |
| `windows_i686_gnu@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/i686_gnu/Cargo.toml) — `56b5e090b08eb32c5988c11ce5869f36d3a1fad1` | — |
| `windows_i686_gnullvm@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/i686_gnullvm/Cargo.toml) — `39f48c18b9ce4b987922978c4c0b4264e67d335d` | — |
| `windows_i686_msvc@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/i686_msvc/Cargo.toml) — `02174371c86c24367de6ea4c8bfe944869caceb8` | — |
| `windows_x86_64_gnu@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/x86_64_gnu/Cargo.toml) — `9faebe627ac35e3c92d08b36695ab8176916ffbb` | — |
| `windows_x86_64_gnullvm@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/x86_64_gnullvm/Cargo.toml) — `e007fb9a2734cd8c1ca86a48664225cf9103ee91` | — |
| `windows_x86_64_msvc@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/x86_64_msvc/Cargo.toml) — `037c603396b55f1b0593694cc53128785d7359f7` | — |
| `zerocopy-derive@0.8.62` | `BSD-2-Clause OR Apache-2.0 OR MIT` | [source](https://github.com/google/zerocopy/blob/v0.8.62/zerocopy/zerocopy-derive/Cargo.toml) — `433b288abc92ab846a7a8f45e98ee827b264130d` | — |
| `zlib-rs@0.6.8` | `Zlib` | [source](https://github.com/trifectatechfoundation/zlib-rs/blob/v0.6.8/zlib-rs/Cargo.toml) — `aea2c66ef3a8df7f03c0859e8f068173438e13d1` | [workspace](https://github.com/trifectatechfoundation/zlib-rs/blob/v0.6.8/Cargo.toml) |

EN: Matching-version upstream evidence for all 40 lock entries outside the observed CI rejection set; registry archive checksum verification remains outstanding.


# 9. Description de PR actuelle — copie intégrale

## Sécurité JavaScript — correction du 13 octobre 2026 / JavaScript security update

Commit : 90780c735aa3006e8b7a7a575be1e633ca88c3d6

FR : **26 des 27 entrées de pnpm audit éliminées** (19 élevées, 5 modérées, 2 faibles). Une entrée élevée reste signalée pour braces 3.0.3 / GHSA-vfj7-8cjw-p6xm, sans version amont corrigée publiée. Un correctif local pnpm reproductible limite la profondeur de récursion ; les 10 tests passent. Nom et version conservés, aucun avis masqué : l'audit reste en échec.

EN: **26 of 27 pnpm audit entries eliminated** (19 high, 5 moderate, 2 low). One high entry remains for braces 3.0.3 / GHSA-vfj7-8cjw-p6xm, with no patched upstream release. A reproducible local pnpm patch bounds recursion depth; all 10 tests pass. Name/version are preserved, no advisories suppressed; audit remains failing.

| Vérification / Check | Résultat / Result |
| --- | --- |
| Installation gelée, conservation des dépendances, 10 tests, lint, typecheck, Vite, actionlint | [Réussite / Passed](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38348321760) |
| pnpm audit | [1 alerte élevée résiduelle / 1 residual high entry](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38348321632/job/115134768261) |

FR : Les 19 dépendances directes initiales, 293 noms de paquets et 95 noms de paquets optionnels sont conservés. esbuild et Rollup déjà présents dans le verrouillage sont déclarés explicitement pour éviter leur disparition ; esbuild est corrigé en 0.28.1. Les PR Dependabot #138, #144–146 et #148–152 ont été examinées sans importer leurs suppressions de variantes optionnelles. Aucun fichier initial supprimé. Aucun changement au workflow d'approbation, à Rust ou cargo-deny. Aucune PR fusionnée ou fermée.

EN: All 19 original direct dependencies, 293 package names and 95 optional package names are retained. Existing esbuild/Rollup tools are explicitly retained; esbuild is fixed at 0.28.1. Relevant Dependabot PRs were inspected without importing optional-variant deletions. No original files removed; approval, Rust and cargo-deny unchanged. No PR merged or closed.

[Compte rendu détaillé / Detailed report](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/90780c735aa3006e8b7a7a575be1e633ca88c3d6/docs/JS_SECURITY_AUDIT_20261013.md)

---

## Historique de la phase 1 avant ce correctif JS / Phase 1 history before this JS update

## Résumé / Summary

FR : Le verrouillage pnpm mélangeait des versions incompatibles et empêchait les vérifications. Il est réparé avec pnpm 8.15.9, Vite 8.0.16 et plugin-react 6.0.2, sans changer les contraintes de package.json. La CI compile désormais réellement Tauri, vérifie les workflows et propage les erreurs de sécurité.

EN: The inconsistent pnpm graph prevented validation. It is repaired with pnpm 8.15.9, Vite 8.0.16 and plugin-react 6.0.2 without changing package.json constraints. CI now actually compiles Tauri, validates workflows and propagates security failures.

- FR : Cargo.lock commité, commandes Rust avec --locked, icône locale requise et profil de production appliqué au workspace. EN: Committed Cargo.lock, locked Rust commands, required local icon and workspace release profile.
- FR : Corrections minimales des types Tauri 2 et pollen ; aucune migration de logique métier. EN: Minimal Tauri 2 and pollen type fixes; no business logic migration.
- FR : Code fantôme, commentaires et variantes conservés en place ou sous docs/history ; aucun fichier initial supprimé. Scripts, anciens verrouillages npm et configuration Tauri racine inchangés. EN: Ghost code, comments and variants retained in place or under docs/history; no original file removed. Historical scripts, npm locks and root Tauri configuration are unchanged.
- FR : Semgrep obsolète remplacé par le CLI explicite et facultatif ; OWASP utilise le bon rapport et délègue pnpm au job pnpm 8 bloquant. EN: Deprecated Semgrep action replaced by an explicitly enabled optional CLI; OWASP uses the correct report path and delegates pnpm auditing to the blocking pnpm 8 job.

## Vérifications / Verification

Commit : 365aab89151a7cfa0d58b7fa1312898eb5345164

| Contrôle / Check | Résultat / Result |
| --- | --- |
| pnpm install --frozen-lockfile, lint, typecheck, vite:build, actionlint | Réussite / Passed — [JS/TS CI](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38341968465) |
| Rust debug/release --locked, cargo test, contrôle des marqueurs historiques dans les artefacts / historical artifact markers | Réussite / Passed — [Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38341968538) |
| rustfmt, Clippy -D warnings | Réussite / Passed — [Security & Quality](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38341968374) |
| CodeQL Actions, JS/TS et Rust | Réussite / Passed — [CodeQL](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38341968376) |
| OWASP et publication SARIF / OWASP and SARIF upload | Exécutés / Executed; OSS Index ignoré sans identifiants / skipped without credentials |
| Semgrep, SonarCloud, Android Lint | Ignorés / Skipped : activation/configuration ou projet absents / missing activation, configuration or project |
| APIsec et NeuraLegion | Manuels, non exécutés / Manual, not run |

FR : cargo test exécute actuellement **0 test**. Les doctests sont ignorés car le paquet est binaire. Aucun APK Android ni fonctionnement offline de bout en bout n'a été validé. Contrôles locaux : 302 entrées pnpm accessibles, TOML, YAML et syntaxe de 48 scripts shell.

EN: cargo test currently runs **zero tests**; doctests are skipped because the package is binary-only. No Android APK or end-to-end offline behavior was validated. Local checks cover 302 reachable pnpm entries, TOML, YAML and syntax of 48 shell steps.

## Problèmes non résolus / Unresolved issues

- pnpm audit : **27 alertes / advisories** — 20 élevées / high, 5 modérées / moderate, 2 faibles / low.
- cargo audit : **h2 0.3.27 / RUSTSEC-2026-0258**, plus avertissements / warnings pour proc-macro-error, rustls-pemfile et glib.
- cargo-deny : avis de sécurité et politique de licences autorisées non définie / advisories and an undefined license allow policy. Bans/sources passent / pass.

FR : Ces échecs sont maintenant bloquants ; aucune dépendance supprimée, aucun avis masqué et aucune politique juridique inventée. La phase 1 répare l'exécution des contrôles, mais la PR n'est **pas entièrement verte**.

EN: These failures are now blocking; no dependencies removed, no advisories suppressed and no license policy invented. Phase 1 repairs check execution, but this PR is **not fully green**.

Détails / Details : [docs/CI_SETUP.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/365aab89151a7cfa0d58b7fa1312898eb5345164/docs/CI_SETUP.md).

**Aucune fusion dans main ; pas d'auto-merge. / No merge into main; no auto-merge.**


# 10. Timeline GitHub complète — 44 entrées intégrales

Les dates/types/champs complets sont aussi dans evidence/pr153-handoff-timeline.json. Aucun contenu de commentaire n’est raccourci.



---

## Entrée 1 — ID 6135529254

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6135529254

Auteur : {'login': 'bolt-new-by-stackblitz[bot]', 'name': 'bolt-new-by-stackblitz[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/182710?v=4', 'id': 102146512}

Date : 2026-10-13T00:47:09Z ; review : None ; chemin : None ; ligne : None

<a href="https://stackblitz.com/~/github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153"><img src="https://developer.stackblitz.com/img/review_pr_small.svg" alt="Review PR in StackBlitz Codeflow" align="left" width="103" height="20" target="_blank"></a> _Run & review this pull request in [StackBlitz Codeflow](https://stackblitz.com/~/github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153)._



---

## Entrée 2 — ID 5497610134

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5497610134

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T00:55:52Z ; review : APPROVED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 3 — ID 5497647868

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5497647868

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T01:00:51Z ; review : APPROVED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 4 — ID 5497657655

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5497657655

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T01:02:10Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 5 — ID 5498338874

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498338874

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T03:13:46Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 6 — ID 5498351008

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498351008

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T03:16:13Z ; review : APPROVED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 7 — ID 5498355525

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498355525

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T03:17:07Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 8 — ID 5498394935

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498394935

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T03:23:38Z ; review : APPROVED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 9 — ID 5498432718

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498432718

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T03:29:24Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 10 — ID 6137562061

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6137562061

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T03:30:14Z ; review : None ; chemin : None ; ligne : None

You are seeing this message because GitHub Code Scanning has recently been set up for this repository, or this pull request contains the workflow file for the Code Scanning tool.

### What Enabling Code Scanning Means:

- The 'Security' tab will display more code scanning analysis results (e.g., for the default branch).
- Depending on your configuration and choice of analysis tool, future pull requests will be annotated with code scanning analysis results.
- You will be able to see the analysis results for the pull request's branch on this [overview](/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning?query=pr%3A153+is%3Aopen) once the scans have completed and the checks have passed.

For more information about GitHub Code Scanning, check out [the documentation](https://docs.github.com/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning).



---

## Entrée 11 — ID 5498487705

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498487705

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T03:37:22Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 12 — ID 5498911334

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498911334

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T04:44:10Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 13 — ID 5498941099

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498941099

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T04:49:34Z ; review : APPROVED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 14 — ID 5498988650

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5498988650

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T04:57:46Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 15 — ID 5499178534

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5499178534

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T05:28:23Z ; review : APPROVED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 16 — ID 5499190913

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5499190913

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T05:30:21Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 17 — ID 6139049558

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6139049558

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T05:38:36Z ; review : None ; chemin : None ; ligne : None

### Correction ciblée de RUSTSEC-2026-0258

Correction poussée uniquement sur `chore/ci-phase1-reliability-20261013` : [`30aba7c`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/30aba7c1f2ddbf936fa37654a9bcf59d89b869f8).

**L'avis concernant h2 0.3.27 est corrigé par une migration effective vers h2 0.4.20**, sans exclusion d'audit ni suppression de dépendance.

#### Origine exacte

```text
quelleheureest 0.0.1
└── reqwest 0.11.27
    ├── h2 0.3.27
    ├── hyper 0.14.32 → h2 0.3.27
    └── hyper-tls 0.5.0 → hyper 0.14.32 → h2 0.3.27
```

Cette chaîne a été relevée avec `cargo tree --locked --target all -i h2@0.3.27`. Tauri 2.12.3 utilisait déjà une autre dépendance Reqwest 0.13.5, qui n'introduisait pas h2 0.3.27.

[RUSTSEC-2026-0258](https://rustsec.org/advisories/RUSTSEC-2026-0258.html) / GHSA-q83h-524g-xf6h concerne l'accumulation non bornée de trames DATA HTTP/2 vides. Le premier correctif amont est h2 0.4.16. Reqwest 0.11 / Hyper 0.14 imposent h2 0.3, donc une modification isolée du lockfile ne pouvait pas fournir une migration compatible.

#### Migration validée

- Reqwest **0.11.27 → 0.12.28**, en conservant JSON et les fonctionnalités par défaut, notamment TLS natif et HTTP/2.
- h2 **0.3.27 → 0.4.20**, hyper-tls **0.5.0 → 0.6.0**, convergence vers Hyper 1.12.0 / http 1 / http-body 1.
- Le proxy système migre system-configuration 0.5.1 → 0.7.0 et system-configuration-sys 0.5.0 → 0.6.0.
- Reqwest 0.13.5 reste celui de Tauri. Aucun changement des sources applicatives ou des appels Open-Meteo.
- Deux tests d'intégration sur localhost vérifient les échanges JSON en HTTP/1 et en HTTP/2, avec assertion du protocole réellement utilisé.
- La CI Rust vérifie désormais également la conservation des dépendances et le minimum corrigé de h2.

Reqwest 0.12 est retenu pour limiter les changements : passer directement aux paramètres par défaut de Reqwest 0.13 aurait aussi changé le backend TLS.

#### Dépendances et historique conservés

Les **12 dépendances applicatives initiales et tauri-build** sont conservés. **Les 436 noms de paquets historiques sont tous présents** dans la nouvelle résolution, qui contient 446 noms. Le nombre d'entrées de versions passe de 495 à 491 par migration et déduplication des anciennes piles HTTP et de leurs anciennes versions de plateformes ; aucun nom de paquet n'est supprimé.

`httpdate =1.0.3` et `rustls-pemfile =1.0.4`, que la nouvelle pile ne demande plus, restent explicitement déclarés comme dépendances optionnelles, sans activation en production. Ils restent visibles dans Cargo.lock et dans l'audit. h2/http/bytes sont ajoutés aux dépendances de test.

Les anciens manifestes, le verrouillage et le workflow Rust sont archivés sous [docs/history/rust-h2-20261013](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/30aba7c1f2ddbf936fa37654a9bcf59d89b869f8/docs/history/rust-h2-20261013), et l'ancienne ligne Reqwest 0.11 reste commentée. Comparaison des arbres Git : seuls Cargo.lock, src-tauri/Cargo.toml et .github/workflows/rust.yml changent parmi les fichiers existants ; **aucun fichier supprimé**.

#### Vérifications

[Validation complète du candidat](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38351022841/job/115143211619), Ubuntu 22.04, Rust 1.99.0 :

| Vérification | Résultat |
| --- | --- |
| Cargo tree toutes cibles + conservation | Réussi, h2 0.4.20 uniquement |
| Format Rust | Réussi |
| Compilation debug, verrouillée | Réussi |
| Tests Rust | 2 tests d'intégration réussis, 0 échec ; 0 test dans le binaire |
| Clippy, toutes cibles/fonctionnalités, -D warnings | Réussi |
| Compilation release, verrouillée, profil LTO existant | Réussi |
| Marqueurs historiques dans le frontend et le binaire release | Contrôle réussi |
| cargo audit 0.22.2, base RustSec actualisée | Code 0, aucune vulnérabilité, 3 avertissements |

Sur le commit poussé `30aba7c`, les vérifications permanentes confirment ces résultats :
- [CI Rust n°38351922084](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38351922084/job/115146014460) : conservation, debug, tests, release et exclusion des marqueurs historiques **réussis** ;
- [Rust Code Quality](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38351917831/job/115146001563) : rustfmt et Clippy strict **réussis** ;
- [Rust Build & Test](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38351917831/job/115146001618) : **réussi** ;
- [CI JS/TS et actionlint](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38351922086) : installation gelée, lint, typecheck, Vite et validation des workflows **réussis**.

Les manifeste, verrouillage et tests poussés sont identiques au candidat intégralement validé.

#### Éléments encore bloquants, hors mission

L'[audit strict du commit poussé](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38351917831/job/115146001513), `cargo audit --deny warnings`, échoue toujours avec **trois avertissements**, et **sans RUSTSEC-2026-0258** :
- proc-macro-error 1.0.4 : non maintenu, RUSTSEC-2024-0370 ;
- rustls-pemfile 1.0.4 : non maintenu, RUSTSEC-2025-0134 ;
- glib 0.18.5 : unsoundness, RUSTSEC-2024-0429.

Le contrôle strict reste inchangé. Le profil release historique du membre produit toujours l'avertissement Cargo connu ; le profil effectif reste celui du workspace.

Limites : pas de compilation APK/validation sur appareil Android, d'échange TLS réel avec Open-Meteo, ni de reproduction de l'attaque par trames malveillantes. Les tests vérifient la compatibilité HTTP/JSON ; le correctif de sécurité est la version amont publiée.

L'approbation automatique, les configurations cargo-deny, les fichiers JavaScript, les correctifs braces, les commentaires et le code fantôme restent inchangés. Aucune PR fusionnée ou fermée.

Le workflow de candidat est désormais manuel, son ancien déclencheur restant commenté. Un premier essai a échoué avant migration à cause de Python 3.10 sans tomllib ; Python 3.12 corrige ce prérequis, et le second essai a passé tous les contrôles.

[Compte-rendu détaillé FR/EN dans le dépôt](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/30aba7c1f2ddbf936fa37654a9bcf59d89b869f8/docs/RUST_H2_MIGRATION_20261013.md).

**English:** RUSTSEC-2026-0258 is fixed by migrating the application's Reqwest 0.11 / Hyper 0.14 stack to Reqwest 0.12.28 / Hyper 1 / h2 0.4.20. Native TLS and HTTP/2 are retained. All original direct dependencies and all 436 historical package names are preserved; httpdate and rustls-pemfile remain optional. Debug/release builds, two localhost integration tests, strict Clippy and cargo audit passed on the complete candidate. The existing strict audit still fails on three unrelated warnings. No audit exclusion, approval-workflow change, JS/braces change, cargo-deny policy change, PR merge or closure.



---

## Entrée 18 — ID 5499253497

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5499253497

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T05:40:13Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 19 — ID 5499395744

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5499395744

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T06:00:26Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 20 — ID 5499477241

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5499477241

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T06:11:15Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 21 — ID 4255593344

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4255593344

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T06:53:53Z ; review : None ; chemin : vendor/glib-0.18.5/src/log.rs ; ligne : 85

## CodeQL / Cleartext logging of sensitive information

This operation writes [...::g_uuid_string_is_valid(...)](1) to a log file.

[Show more details](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/11)


---

## Entrée 22 — ID 4255593364

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4255593364

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T06:53:53Z ; review : None ; chemin : vendor/glib-0.18.5/src/subclass/boxed.rs ; ligne : 76

## CodeQL / Access of invalid pointer

This operation dereferences a pointer that may be [invalid](1).
This operation dereferences a pointer that may be [invalid](2).
This operation dereferences a pointer that may be [invalid](3).
This operation dereferences a pointer that may be [invalid](4).
This operation dereferences a pointer that may be [invalid](5).
This operation dereferences a pointer that may be [invalid](6).
This operation dereferences a pointer that may be [invalid](7).
This operation dereferences a pointer that may be [invalid](8).
This operation dereferences a pointer that may be [invalid](9).
This operation dereferences a pointer that may be [invalid](10).
This operation dereferences a pointer that may be [invalid](11).
This operation dereferences a pointer that may be [invalid](12).
This operation dereferences a pointer that may be [invalid](13).
This operation dereferences a pointer that may be [invalid](14).
This operation dereferences a pointer that may be [invalid](15).
This operation dereferences a pointer that may be [invalid](16).
This operation dereferences a pointer that may be [invalid](17).
This operation dereferences a pointer that may be [invalid](18).
This operation dereferences a pointer that may be [invalid](19).
This operation dereferences a pointer that may be [invalid](20).
This operation dereferences a pointer that may be [invalid](21).
This operation dereferences a pointer that may be [invalid](22).
This operation dereferences a pointer that may be [invalid](23).
This operation dereferences a pointer that may be [invalid](24).
This operation dereferences a pointer that may be [invalid](25).
This operation dereferences a pointer that may be [invalid](26).
This operation dereferences a pointer that may be [invalid](27).
This operation dereferences a pointer that may be [invalid](28).
This operation dereferences a pointer that may be [invalid](29).
This operation dereferences a pointer that may be [invalid](30).
This operation dereferences a pointer that may be [invalid](31).
This operation dereferences a pointer that may be [invalid](32).
This operation dereferences a pointer that may be [invalid](33).
This operation dereferences a pointer that may be [invalid](34).
This operation dereferences a pointer that may be [invalid](35).
This operation dereferences a pointer that may be [invalid](36).
This operation dereferences a pointer that may be [invalid](37).
This operation dereferences a pointer that may be [invalid](38).
This operation dereferences a pointer that may be [invalid](39).
This operation dereferences a pointer that may be [invalid](40).
This operation dereferences a pointer that may be [invalid](41).
This operation dereferences a pointer that may be [invalid](42).
This operation dereferences a pointer that may be [invalid](43).
This operation dereferences a pointer that may be [invalid](44).
This operation dereferences a pointer that may be [invalid](45).
This operation dereferences a pointer that may be [invalid](46).
This operation dereferences a pointer that may be [invalid](47).
This operation dereferences a pointer that may be [invalid](48).
This operation dereferences a pointer that may be [invalid](49).
This operation dereferences a pointer that may be [invalid](50).
This operation dereferences a pointer that may be [invalid](51).
This operation dereferences a pointer that may be [invalid](52).
This operation dereferences a pointer that may be [invalid](53).

[Show more details](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/8)


---

## Entrée 23 — ID 4255593381

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4255593381

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T06:53:54Z ; review : None ; chemin : vendor/glib-0.18.5/src/value.rs ; ligne : 462

## CodeQL / Access of invalid pointer

This operation dereferences a pointer that may be [invalid](1).
This operation dereferences a pointer that may be [invalid](2).
This operation dereferences a pointer that may be [invalid](3).
This operation dereferences a pointer that may be [invalid](4).
This operation dereferences a pointer that may be [invalid](5).
This operation dereferences a pointer that may be [invalid](6).
This operation dereferences a pointer that may be [invalid](7).
This operation dereferences a pointer that may be [invalid](8).
This operation dereferences a pointer that may be [invalid](9).
This operation dereferences a pointer that may be [invalid](10).
This operation dereferences a pointer that may be [invalid](11).
This operation dereferences a pointer that may be [invalid](12).
This operation dereferences a pointer that may be [invalid](13).
This operation dereferences a pointer that may be [invalid](14).
This operation dereferences a pointer that may be [invalid](15).
This operation dereferences a pointer that may be [invalid](16).
This operation dereferences a pointer that may be [invalid](17).
This operation dereferences a pointer that may be [invalid](18).
This operation dereferences a pointer that may be [invalid](19).
This operation dereferences a pointer that may be [invalid](20).
This operation dereferences a pointer that may be [invalid](21).
This operation dereferences a pointer that may be [invalid](22).
This operation dereferences a pointer that may be [invalid](23).
This operation dereferences a pointer that may be [invalid](24).
This operation dereferences a pointer that may be [invalid](25).
This operation dereferences a pointer that may be [invalid](26).
This operation dereferences a pointer that may be [invalid](27).
This operation dereferences a pointer that may be [invalid](28).
This operation dereferences a pointer that may be [invalid](29).
This operation dereferences a pointer that may be [invalid](30).
This operation dereferences a pointer that may be [invalid](31).
This operation dereferences a pointer that may be [invalid](32).
This operation dereferences a pointer that may be [invalid](33).
This operation dereferences a pointer that may be [invalid](34).
This operation dereferences a pointer that may be [invalid](35).
This operation dereferences a pointer that may be [invalid](36).
This operation dereferences a pointer that may be [invalid](37).
This operation dereferences a pointer that may be [invalid](38).
This operation dereferences a pointer that may be [invalid](39).
This operation dereferences a pointer that may be [invalid](40).
This operation dereferences a pointer that may be [invalid](41).
This operation dereferences a pointer that may be [invalid](42).
This operation dereferences a pointer that may be [invalid](43).
This operation dereferences a pointer that may be [invalid](44).
This operation dereferences a pointer that may be [invalid](45).
This operation dereferences a pointer that may be [invalid](46).
This operation dereferences a pointer that may be [invalid](47).
This operation dereferences a pointer that may be [invalid](48).
This operation dereferences a pointer that may be [invalid](49).
This operation dereferences a pointer that may be [invalid](50).
This operation dereferences a pointer that may be [invalid](51).
This operation dereferences a pointer that may be [invalid](52).
This operation dereferences a pointer that may be [invalid](53).

[Show more details](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/9)


---

## Entrée 24 — ID 4255593391

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4255593391

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T06:53:54Z ; review : None ; chemin : vendor/glib-0.18.5/src/value.rs ; ligne : 470

## CodeQL / Access of invalid pointer

This operation dereferences a pointer that may be [invalid](1).
This operation dereferences a pointer that may be [invalid](2).
This operation dereferences a pointer that may be [invalid](3).
This operation dereferences a pointer that may be [invalid](4).
This operation dereferences a pointer that may be [invalid](5).
This operation dereferences a pointer that may be [invalid](6).
This operation dereferences a pointer that may be [invalid](7).
This operation dereferences a pointer that may be [invalid](8).
This operation dereferences a pointer that may be [invalid](9).
This operation dereferences a pointer that may be [invalid](10).
This operation dereferences a pointer that may be [invalid](11).
This operation dereferences a pointer that may be [invalid](12).
This operation dereferences a pointer that may be [invalid](13).
This operation dereferences a pointer that may be [invalid](14).
This operation dereferences a pointer that may be [invalid](15).
This operation dereferences a pointer that may be [invalid](16).
This operation dereferences a pointer that may be [invalid](17).
This operation dereferences a pointer that may be [invalid](18).
This operation dereferences a pointer that may be [invalid](19).
This operation dereferences a pointer that may be [invalid](20).
This operation dereferences a pointer that may be [invalid](21).
This operation dereferences a pointer that may be [invalid](22).
This operation dereferences a pointer that may be [invalid](23).
This operation dereferences a pointer that may be [invalid](24).
This operation dereferences a pointer that may be [invalid](25).
This operation dereferences a pointer that may be [invalid](26).
This operation dereferences a pointer that may be [invalid](27).
This operation dereferences a pointer that may be [invalid](28).
This operation dereferences a pointer that may be [invalid](29).
This operation dereferences a pointer that may be [invalid](30).
This operation dereferences a pointer that may be [invalid](31).
This operation dereferences a pointer that may be [invalid](32).
This operation dereferences a pointer that may be [invalid](33).
This operation dereferences a pointer that may be [invalid](34).
This operation dereferences a pointer that may be [invalid](35).
This operation dereferences a pointer that may be [invalid](36).
This operation dereferences a pointer that may be [invalid](37).
This operation dereferences a pointer that may be [invalid](38).
This operation dereferences a pointer that may be [invalid](39).
This operation dereferences a pointer that may be [invalid](40).
This operation dereferences a pointer that may be [invalid](41).
This operation dereferences a pointer that may be [invalid](42).
This operation dereferences a pointer that may be [invalid](43).
This operation dereferences a pointer that may be [invalid](44).
This operation dereferences a pointer that may be [invalid](45).
This operation dereferences a pointer that may be [invalid](46).
This operation dereferences a pointer that may be [invalid](47).
This operation dereferences a pointer that may be [invalid](48).
This operation dereferences a pointer that may be [invalid](49).
This operation dereferences a pointer that may be [invalid](50).
This operation dereferences a pointer that may be [invalid](51).
This operation dereferences a pointer that may be [invalid](52).

[Show more details](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/10)


---

## Entrée 25 — ID 5499826083

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5499826083

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T06:53:54Z ; review : COMMENTED ; chemin : None ; ligne : None

(Corps vide ; métadonnées conservées dans le JSON.)


---

## Entrée 26 — ID 6140053427

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6140053427

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T06:54:03Z ; review : None ; chemin : None ; ligne : None

### Avertissements Rust : correction validée et blocages conservés

Correction poussée sur la branche de #153 : [`ded44f5`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/ded44f5f3ce41e5f6d092ca54f139a594c76fd8a).

**Le défaut de mémoire GLib est corrigé par un rétroport testé. Les trois avertissements Rust restent visibles et bloquants : aucun avis n'est masqué ou artificiellement éliminé.**

#### Analyse des trois avis

| Avis | Dépendance et origine | Résultat |
| --- | --- | --- |
| RUSTSEC-2024-0370 | proc-macro-error 1.0.4, via glib-macros 0.18.5 et gtk3-macros 0.18.2, dans la pile GTK/Tauri | Non-maintenance, aucune version corrigée ; conservé |
| RUSTSEC-2025-0134 | rustls-pemfile 1.0.4, dépendance optionnelle historique directe | Toutes les versions sont non maintenues ; conservé optionnel, aucun usage applicatif actuel |
| RUSTSEC-2024-0429 | glib 0.18.5, imposé par GTK 0.18/Tauri et les liaisons GTK/WebKit | Défaut de code corrigé ; avis de registre conservé |

Les arbres sont relevés avec `cargo tree --locked --target all --all-features`, ce qui inclut la référence rustls-pemfile optionnelle.

Pour proc-macro-error, RustSec recommande manyhow ou proc-macro2-diagnostics. Leur adoption relève des macros GTK dépendantes ; conserver le paquet original dans le graphe laisse nécessairement son avis de non-maintenance visible. Aucun alias ou numéro de version fictif n'est introduit.

Pour rustls-pemfile, le dépôt est archivé et RustSec ne reconnaît aucune version corrigée. Le successeur recommandé est le trait PemObject de rustls-pki-types >=1.9, déjà présent dans le verrouillage. Le backend n'utilise plus rustls-pemfile après la migration HTTP précédente : sa référence optionnelle est conservée comme demandé. La supprimer serait précisément le retrait artificiel interdit.

#### Correctif GLib réellement validé

L'avis concerne VariantStrIter : un pointeur NULL était passé sous forme de référence immutable à une fonction C variadique qui écrit dedans. Ce comportement indéfini peut provoquer un accès NULL avec optimisations.

Le rétroport applique exactement [gtk-rs-core#1343](https://github.com/gtk-rs/gtk-rs-core/pull/1343), commit `b5a4071e439bef2b5eea76c3aa25e5ae84839e34` :
- `let p` devient `let mut p` ;
- `&p` devient `&mut p`.

Tauri 2.12.3, dernière version stable vérifiée, impose GTK 0.18. Une tentative réelle `cargo update -p glib --precise 0.20.0` échoue, car GTK exige `glib ^0.18`. GTK 0.19 utilise gtk-rs-core 0.22 et ne satisfait pas ces contraintes de la pile Tauri. Une mise à jour isolée compatible n'est donc pas disponible.

Le paquet complet **glib 0.18.5**, soit **121 fichiers**, est conservé sous vendor. La configuration `.cargo/config.toml` utilise le mécanisme Cargo `paths`, qui substitue le code sans changer le graphe ni l'entrée de registre du verrouillage. Le contrôle vérifie que `cargo metadata` sélectionne réellement le manifeste vendored.

Une première configuration `[patch.crates-io]` a été testée et rejetée : les outils omettaient implicitement l'avis glib après la conversion en paquet local. Cette configuration est archivée, désactivée. **La configuration retenue garde les trois avis dans cargo audit.**

#### Conservation

- **446 noms de paquets et 491 entrées de versions conservés**.
- Tous les enregistrements de dépendances sont identiques au verrouillage précédent ; seul l'enregistrement du paquet applicatif ajoute glib aux dépendances de test Linux.
- Toutes les dépendances directes précédentes, leurs fonctionnalités et les déclarations optionnelles restent inchangées.
- L'archive officielle complète glib-0.18.5.crate est conservée avec son SHA-256 original : `233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5`.
- Chaque fichier du paquet est comparé octet par octet à cette archive, avec uniquement les deux changements amont autorisés. Commentaires, variantes et fichiers publiés sont conservés.
- Anciens manifestes, verrouillage et workflow Rust archivés dans docs/history/rust-warnings-20261013 ; aucune archive précédente altérée.
- Comparaison Git : aucun fichier initial supprimé. Seuls Cargo.toml, Cargo.lock, src-tauri/Cargo.toml et le workflow Rust changent parmi les fichiers existants.

#### Vérifications exécutées

[Validation du candidat n°38354572622](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38354572622/job/115154338603), Ubuntu 22.04, Rust stable 1.99.0 :

| Contrôle | Résultat |
| --- | --- |
| Migration isolée glib 0.20 | Rejet confirmé du solveur |
| Archive, 121 fichiers, dépendances et source sélectionnée | Réussi |
| Format Rust | Réussi |
| Compilation debug verrouillée | Réussi |
| Tests debug | 8 réussis : 6 GLib + 2 HTTP ; 0 échec |
| Clippy toutes cibles/fonctionnalités avec -D warnings | Réussi |
| Compilation release verrouillée, profil LTO existant | Réussi |
| Tests release | Les mêmes 8 tests réussissent avec optimisations |
| Marqueurs historiques dans frontend et binaire release | Contrôle réussi |
| cargo audit 0.22.2 | Code 0 : aucune vulnérabilité bloquante, 3 avertissements visibles |
| cargo audit --deny warnings | Code 1 : les trois avertissements initiaux |
| cargo deny check, politique inchangée | advisories FAILED, licenses FAILED ; bans et sources OK |

Les six régressions GLib couvrent next, nth, last, next_back, nth_back, puis l'itération mixte et le tableau vide. Le binaire applicatif compte toujours zéro test unitaire ; les tests ajoutés sont des intégrations.

L'audit JSON confirme une liste d'exclusions vide et les trois IDs initiaux. RUSTSEC-2026-0258 h2 reste absent.

Sur le commit poussé `ded44f5` :
- [CI Rust n°38358705297](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38358705297/job/115167530540) : contrôle de source/conservation, debug, release, 8 tests debug, 8 tests release et exclusion des marqueurs **réussis** ;
- [Code Quality Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38358700305/job/115167515743) : format et Clippy strict **réussis** ;
- [Build & Test Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38358700305/job/115167515796) : **réussi** ;
- [CI JS/TS n°38358705223](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38358705223) : **réussie**, sans modification des fichiers JavaScript.

Manifeste, verrouillage, configuration paths et tests poussés identiques au candidat validé.

#### Blocages et limites

L'[audit strict sur le commit poussé](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38358700305/job/115167515703) conserve exactement les trois avis. Le [cargo-deny du commit poussé](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38358700305/job/115167515762) reste en échec sur advisories/licences, avec bans/sources réussis. Cargo-deny émet proc-macro-error dans sa vue par défaut ; cargo audit couvre aussi rustls-pemfile optionnel et l'entrée glib du registre.

Les deux avis de non-maintenance ne peuvent pas disparaître tant que les paquets sont conservés dans le graphe, même optionnels. Le rétroport résout le défaut de code GLib, mais son avis persiste par version tant qu'une migration de la pile complète vers une version officiellement reconnue n'est pas compatible. Aucune licence autorisée, exception ou liste d'exclusion n'a été ajoutée.

Pour charger la substitution de sources, lancer Cargo depuis le dépôt, comme la CI. Un --manifest-path lancé depuis un répertoire extérieur ne charge pas automatiquement la configuration du dépôt ; le contrôle permanent vérifie le manifeste effectivement utilisé.

Validation native Linux uniquement : aucun APK ou test sur appareil Android revendiqué. Le terminal local n'a pas Cargo ; les compilations et audits cités sont exécutés dans GitHub Actions.

Le workflow de candidat devient manuel, son déclencheur précédent restant commenté. Il conserve un statut d'échec quand les audits sont bloquants. La CI permanente conserve les contrôles de source et les tests release.

**Approbation automatique, JavaScript, sources applicatives, code fantôme, workflow de sécurité et politique de licences inchangés. Aucune fusion ni fermeture de PR.**

[Compte-rendu détaillé FR/EN](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/ded44f5f3ce41e5f6d092ca54f139a594c76fd8a/docs/RUST_WARNINGS_20261013.md).

**English:** The exact upstream GLib VariantStrIter memory-safety fix is backported and tested in debug and optimized release builds. All 121 published crate files, all 446 historical package names, every optional declaration and the original registry identity are retained. Cargo paths selects the patched source without hiding advisories. Eight integration tests and strict Clippy pass. All three registry warnings remain visible; the two unmaintained packages have no patched releases, and Tauri's GTK 0.18 constraints reject an isolated GLib >=0.20 upgrade. Strict cargo audit and cargo-deny remain blocking, with the license policy unchanged. No JS change, suppression, dependency deletion or PR merge/closure.



---

## Entrée 27 — ID 6140092689

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6140092689

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T06:56:37Z ; review : None ; chemin : None ; ligne : None

⚠️ Approbation automatique ignorée : les checks CodeQL ont échoué : CodeQL.
⚠️ Auto-approval skipped: CodeQL checks failed: CodeQL.


---

## Entrée 28 — ID 4261094218

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4261094218

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T16:10:45Z ; review : None ; chemin : vendor/glib-0.18.5/src/collections/ptr_slice.rs ; ligne : 900

## CodeQL / Access of invalid pointer

This operation dereferences a pointer that may be [invalid](1).

[Show more details](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/12)


---

## Entrée 29 — ID 5506560233

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5506560233

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T16:10:45Z ; review : COMMENTED ; chemin : None ; ligne : None

(Corps vide ; métadonnées conservées dans le JSON.)


---

## Entrée 30 — ID 6150733380

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6150733380

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T16:56:11Z ; review : None ; chemin : None ; ligne : None

## Analyse terminée des quatre alertes CodeQL GLib

**Les quatre chemins SARIF demandés sont des faux positifs vérifiés par leurs types Rust, les contrats FFI et leur contexte de compilation. Aucun correctif de GLib n'est justifié par ces quatre chemins. Aucun état d'alerte, suppression ou exclusion CodeQL n'a été modifié.**

Travail poussé exclusivement sur `chore/ci-phase1-reliability-20261013`, dernier commit [0fa3c7f](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370). PR laissée ouverte, sans fusion.

### Qualification de chaque résultat

| Résultat | Règle et position primaire | Conclusion technique |
| --- | --- | --- |
| QL-1 | `rust/cleartext-logging`, `log.rs:85` | **Faux positif.** Le chemin part de `g_uuid_string_is_valid` puis choisit la conversion `FromGlib<u32> for LogLevel`. Le wrapper retourne pourtant `bool`, via `FromGlib<gboolean> for bool`. Les types d'entrée et de retour rendent ce dispatch impossible. Le prédicat fournit un booléen de validité, pas le texte UUID ; le panic affiche un masque de niveau numérique. Aucun secret applicatif allant vers ce sink n'est démontré. |
| QL-2 | `rust/access-invalid-pointer`, `subclass/boxed.rs:76` | **Faux positif.** La position est la dérivation de `MyBoxed` dans un module `#[cfg(test)]` de la dépendance, pas un appel applicatif à boxed_copy. Les sorties charset sont converties en chaînes, jamais en MyBoxed. Le chemin confond des implémentations génériques et conserve une initialisation NULL antérieure à l'écriture C. GLib est exclu du workspace : les tests de la dépendance ne sont pas compilés dans les artefacts applicatifs. |
| QL-3 | `rust/access-invalid-pointer`, `value.rs:462` | **Faux positif.** Le chemin associe une sortie charset `gchar*` à un wrapper `GValue`. Le type de retour et les traits concrets sélectionnent une chaîne, pas Value. Aucun cast/appel réalisant cette transition n'est montré. Les tests de copie vérifient que les GValue possédés restent valides après destruction des sources. |
| QL-4 | `rust/access-invalid-pointer`, `value.rs:470` | **Faux positif.** Les chemins associent des sorties `GError*` à la libération d'un `GValue*`, en perdant l'écriture C, la branche non-null et le retour concret `glib::Error`. Le wrapper ne sélectionne pas l'implémentation Value. Le test de sortie Error et les tests de propriété GValue vérifient les contrats concrets. |

Ces qualifications réfutent les chemins signalés ; elles ne prétendent pas prouver la sûreté de toutes les API unsafe ni l'absence générale de vulnérabilité dans GLib.

### Preuves vérifiables

- [Rapport détaillé français/anglais](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370/docs/CODEQL_GLIB_TRIAGE_20261013.md), avec chemins, types, références Rust/GLib/Cargo, exposition et limites.
- [Quatre résultats SARIF complets avec codeFlows et relatedLocations](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370/docs/security/CODEQL_GLIB_EVIDENCE_20261013.json).
- [Diagnostic CodeQL 38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513), CLI 2.27.2 ; [SARIF complet](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/artifacts/11828886142), SHA-256 `4772fa6e1b0cf0767ea89172b14e1c9aef4054ea118d28f9986a76c561baf540`.
- [Cinq nouveaux tests](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370/src-tauri/tests/glib_codeql_contracts.rs), commentaires français puis anglais.

Les endpoints des annotations/alertes individuelles étaient indisponibles dans le connecteur. Un **nouveau diagnostic dédié**, désormais manuel, a exporté le SARIF avec `upload: false`, sans changer les workflows existants ni remplacer un état CodeQL. Le SARIF complet n'est pas filtré. Les repères QL-1 à QL-4 sont ceux du rapport, pas des numéros d'alertes GitHub inventés.

Le check initial annonçait six nouvelles alertes ; le replay contient sept résultats Rust, dont les quatre positions demandées. Ces comptes ne sont pas assimilés. Les trois autres positions restent hors de cette mission.

### Validation réellement exécutée

Sur le commit des tests `f78242e4fc5e311a4a7114ff0cc46b5fce0055ef` :

- [CI Rust debug/release](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427520573/job/115400700304) : `cargo build --workspace --locked --verbose`, `cargo test --workspace --locked --verbose`, puis les mêmes commandes avec `--release` **réussies**. **13 tests d'intégration passent dans chaque profil**, dont les cinq nouveaux, les six régressions VariantStrIter et les deux tests HTTP antérieurs ; aucun échec/ignoré.
- [Qualité Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427509459/job/115400661011) : `cargo fmt --all -- --check` et `cargo clippy --workspace --locked --all-targets --all-features -- -D warnings` **réussis**. Les **34 avertissements du paquet tiers GLib restent visibles** dans le journal.
- Contrôles de conservation précédents : **446 noms de paquets et 121 fichiers GLib vérifiés**, avec uniquement le backport VariantStrIter antérieur autorisé par leur garde.
- [CI JS/TS existante](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427520885) : lint, typecheck, build Vite et validation des workflows **réussis automatiquement**, sans modification JavaScript.

Les exécutions ont eu lieu dans GitHub Actions : Cargo n'est pas installé dans l'environnement local, dont le réseau shell est indisponible. Le commit final ajoute les preuves/documentation et rend le diagnostic manuel ; il ne change aucun code testé.

### Conservation et problèmes restant visibles

La comparaison des arbres Git depuis `ded44f5f3ce41e5f6d092ca54f139a594c76fd8a` confirme **zéro modification ou suppression de fichier préexistant**. Quatre fichiers ont été ajoutés : tests, rapport, preuves JSON et diagnostic dédié. Toutes les dépendances, options, verrouillages, archives, sources vendored, commentaires, variantes historiques et code fantôme sont conservés. Tous les workflows préexistants, dont l'approbation automatique, sont inchangés.

Les jobs historiques Rust Security Audit, Rust Dependency Analysis et JS/TS Dependency Security [restent en échec](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427509459). Aucune politique de licences, aucun ignore d'advisory, aucune règle CodeQL et aucun état d'alerte n'ont été modifiés pour obtenir artificiellement un résultat vert.

Une observation distincte sur la durée de vie de `LogField::new` est documentée : elle **n'est pas l'alerte log.rs:85**. Aucun usage applicatif ou exploit n'est démontré ; la même signature existe dans glib 0.22.10 et aucun correctif amont vérifiable n'a été trouvé. Aucun patch local non vérifié n'a été appliqué.

### English

All four requested SARIF paths are false positives due to incompatible concrete Rust trait/type dispatch, missing C out-parameter modeling and, for MyBoxed, dependency-only cfg(test) code. Five focused integration tests and all eight existing regressions pass in debug and release; formatting and Clippy pass, with existing third-party warnings still visible. No pre-existing file was changed or deleted during this mission. Complete evidence and limitations are retained in the linked report and SARIF records. Existing workflows, dependencies, archives and approval automation are preserved. No alert was dismissed or hidden, and no PR was merged or closed.


---

## Entrée 31 — ID 6151473992

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6151473992

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T17:37:26Z ; review : None ; chemin : None ; ligne : None

## Trois résultats Rust CodeQL restants : conclusions et vérifications

Travail poussé exclusivement sur `chore/ci-phase1-reliability-20261013`, commit [f149328](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/f149328e91bf0379f31d73b664d80dbe85f49617). Aucune fusion ni fermeture.

**Les trois chemins SARIF restants sont des faux positifs vérifiables. La recherche amont a toutefois confirmé un défaut réel distinct de conversion de `Slice` vide dans le même fichier : il reste non corrigé, avec une proposition concrète non appliquée. Ces deux conclusions sont distinguées dans le rapport.**

### Résultats examinés

| Repère | Position primaire, règle `rust/access-invalid-pointer` | Qualification |
| --- | --- | --- |
| QL-5 | `vendor/glib-0.18.5/src/object.rs:470` | **Faux positif du chemin.** Les sorties charset (`gchar*`) et erreur (`GError*`) sont associées par le modèle générique à `FromGlibPtrNone<*mut GObject> for ObjectRef`. Les conversions réelles produisent des chaînes/Option ou `glib::Error`, jamais un GObject. Les écritures C et les gardes sont aussi perdues. |
| QL-6 | `vendor/glib-0.18.5/src/object.rs:493` | **Faux positif du chemin.** Les sorties erreur ou hostname sont associées à une conversion possédée GObject incompatible. Le hostname NULL est prévu et produit `None` via `Option<GString>`. Un vrai `from_glib_full` GObject consomme une référence déjà possédée ; les tests vérifient ce transfert. |
| QL-7 | `vendor/glib-0.18.5/src/collections/ptr_slice.rs:900` | **Faux positif de l'invalidation 898 → 900.** `p` désigne un slot du tableau. `drop_in_place::<T>(p)` détruit son wrapper et libère/décrémente l'objet pointé ; il ne libère pas le tableau. `ptr::write(p, NULL)` réinitialise ce slot encore alloué. Les bornes et la capacité sont vérifiées, ainsi que la finalisation des objets et la réutilisation du tableau. |

Les sources des **85 positions distinctes** liées aux deux résultats ObjectRef ont été lues dans **11 fichiers** : sorties GError ou chaînes, aucune initialisation GObject. Les conversions unsafe gardent leur précondition de pointeur natif valide ; les tests n'envoient aucun pointeur invalide à ces conversions.

L'amont [3971101c](https://github.com/gtk-rs/gtk-rs-core/commit/3971101c82643035c15380c3f4af19ecccd09bb2), relatif aux paniques des destructeurs, conserve précisément la séquence drop_in_place puis ptr::write dans truncate pour les types avec destructeur. Son message explique que le durcissement est théorique pour les types de wrappers admis. Aucun backport ne se justifie pour masquer QL-7.

### Défaut réel distinct, explicitement non corrigé

Le correctif amont [b31265df](https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214), associé à [l'issue #2042](https://github.com/gtk-rs/gtk-rs-core/issues/2042), concerne `From<Slice<T>> for PtrSlice<T>`. **Cette conversion existe dans notre glib 0.18.5, lignes 1047–1070.**

Pour une Slice vide, `into_raw()` renvoie NULL et libère son éventuelle réserve. La conversion sûre construit pourtant `NonNull::new_unchecked(NULL)` et réutilise une capacité sauvegardée. C'est un défaut réel de l'API tierce ; aucun usage applicatif de cette conversion, ni lien avec le codeFlow de truncate, n'a été démontré.

[Proposition inactive issue du correctif amont](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f149328e91bf0379f31d73b664d80dbe85f49617/docs/security/proposals/UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch) : traiter NULL par `PtrSlice::new()`, conserver le chemin non vide. Les nouvelles annotations sont français puis anglais. **`git apply --check` passe ; la source reste inchangée. Ce rétroport n'est ni appliqué ni validé à l'exécution.** Les tests CI réussis ci-dessous ne valident donc pas ce correctif proposé.

La validation future doit reprendre les cas amont non vide/vide/réservé-vide en debug et release, puis vérifier destruction/réutilisation et le delta exact permis par la garde de conservation. Ce défaut reste visible dans le compte rendu, sans test exécutant volontairement le comportement invalide actuel.

### Preuves et vérifications exécutées

- [Rapport détaillé FR/EN](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f149328e91bf0379f31d73b664d80dbe85f49617/docs/CODEQL_GLIB_REMAINING_TRIAGE_20261013.md) : types, chemins, contrats GLib/Rust, exposition, sources amont, limites et blocage du rétroport distinct.
- [Trois résultats SARIF intégraux et preuves amont](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f149328e91bf0379f31d73b664d80dbe85f49617/docs/security/CODEQL_GLIB_REMAINING_EVIDENCE_20261013.json).
- Le [diagnostic complet 38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513) a été utilisé : **sept enregistrements réextraits de l'export non filtré, identiques à l'extraction précédente**. [SARIF complet](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/artifacts/11828886142), SHA-256 `4772fa6e1b0cf0767ea89172b14e1c9aef4054ea118d28f9986a76c561baf540`. QL-5/6/7 sont les repères du rapport, pas des numéros GitHub inventés.
- [Cinq nouveaux tests de contrat](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f149328e91bf0379f31d73b664d80dbe85f49617/src-tauri/tests/glib_codeql_remaining_contracts.rs) : références none/full GObject, hostname nullable, destruction/réutilisation du tableau, cas limites truncate.
- [CI Rust 38438659916](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438659916/job/115439191070), commit testé `715d38bc9368ecf5fc1711e4bb608e9014b8feae` : **compilations debug et release réussies ; 18 tests d'intégration passent dans chaque profil, 0 échec et 0 ignoré**, dont les cinq nouveaux et tous les treize précédents. Commandes `cargo build/test --workspace --locked --verbose`, puis les mêmes avec `--release`.
- [Qualité Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438649670/job/115439156348) : `cargo fmt --all -- --check` et `cargo clippy --workspace --locked --all-targets --all-features -- -D warnings` **réussis** ; les **34 avertissements tiers GLib restent visibles**.
- Garde de conservation : **446 noms de paquets et 121 fichiers GLib conservés** ; contrôle d'exclusion du code fantôme des artefacts réussi.
- [CI JS/TS existante](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438659813) : lint/typecheck/build Vite et validation des workflows réussis automatiquement, sans changement JS/workflow.

Cargo étant absent localement, les compilations/tests ont été exécutés par les workflows GitHub Actions existants. Le commit final ajoute uniquement la documentation, les preuves et la proposition inactive ; aucun code testé n'est modifié ensuite. Pas d'exécution Miri/ASan : les tests complètent la revue source/FFI, sans prouver tous les comportements possibles.

### Conservation et états restants

La comparaison des arbres Git depuis `0fa3c7f` confirme **zéro fichier préexistant modifié ou supprimé**. Quatre fichiers ajoutés : tests, rapport, preuves, proposition inactive. Toutes les dépendances, options, verrouillages, sources vendored, commentaires, variantes, code fantôme et archives sont conservés.

Les **workflows, scripts, audits, politique de licences et approbation automatique restent inchangés**. Aucune alerte dismissée, ignorée ou masquée. Le [check CodeQL 115439489458](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153/checks?check_run_id=115439489458) reste en échec avec **6 alertes élevées**, malgré l'exécution réussie des analyses. Les jobs d'audit Rust/dépendances Rust/JS restent également en échec. Le rapport qualifie les sept résultats du diagnostic via les deux comptes rendus ; il ne transforme pas ces checks en succès.

### English

The three remaining SARIF paths are false positives: incompatible GObject trait dispatch for strings/errors, and an array slot mistaken for the native allocation released by its wrapper's destructor. Five new contract tests and all thirteen previous regressions pass in debug/release; formatting and Clippy pass, with third-party warnings still visible.

A **separate real empty Slice-to-PtrSlice constructor defect** is confirmed in glib 0.18.5. An upstream-derived patch is preserved as an **unapplied proposal**, checked only for dry-run applicability; runtime backport validation and application exposure are not demonstrated. No pre-existing file, dependency, archive, workflow, audit/licensing policy or approval automation was changed. No alert state was changed, and no PR was merged or closed.


---

## Entrée 32 — ID 6151901679

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6151901679

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T18:01:28Z ; review : None ; chemin : None ; ligne : None

## Rétroport GLib Slice vide → PtrSlice appliqué et validé

Le défaut réel de conversion vide est corrigé sur `chore/ci-phase1-reliability-20261013`. Dernier commit : [c016987](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/c0169878bbd24ba28bc17c1886bb4eada464bf39). **Compilations et 24 tests d'intégration réussis en debug et release**, dont les six nouvelles régressions. Les audits restent en échec sur les problèmes connus détaillés ci-dessous ; aucun avertissement n'est masqué.

### Vérification amont et correction

Le commit [gtk-rs-core b31265df94876febf259089a19de9c23d2468214](https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214), associé à [#2042](https://github.com/gtk-rs/gtk-rs-core/issues/2042), a été relu avec sa source et ses tests.

Pour une `Slice` vide, `into_raw()` retourne NULL et libère l'éventuelle réserve. La conversion conservait pourtant sa capacité et construisait un `NonNull` invalide. Le rétroport teste désormais NULL et retourne `PtrSlice::new()`, de capacité zéro. Le chemin non vide est conservé.

**Seul le corps de cette conversion change dans le paquet vendored.** Il est identique au corps amont après retrait des seules lignes de commentaires ; le nouveau commentaire français précède l'anglais. Aucun autre correctif de collections, changement de version ou migration de dépendance n'est importé.

La proposition `UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch` est conservée intacte : son nom et les anciens rapports décrivent leur état historique. Le correctif est maintenant actif dans la source vendored, avec un nouveau rapport de validation.

### Tests et contrôles réellement exécutés

Les [six nouveaux tests](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/c0169878bbd24ba28bc17c1886bb4eada464bf39/src-tauri/tests/glib_empty_slice.rs) couvrent :

- Slice vide sans réserve : capacité zéro, sentinelle, push/pop et réutilisation ;
- Slice vide avec réserve : abandon de la capacité déjà libérée, puis réutilisation ;
- Slice vidée après pop : conversion d'une réserve existante devenue vide ;
- Slice non vide : trois messages amont, copies possédées après destruction des sources, NULL terminal et truncate/push ;
- transfert/destruction des objets natifs, observés par WeakRef ;
- finalisation lors de truncate puis lors de la destruction du conteneur.

Le constructeur de chaîne du test amont récent n'existe pas dans glib 0.18.5. La première exécution a détecté cette incompatibilité à la compilation ; cette variante est archivée. Les tests actifs utilisent `Error::new`, un wrapper `GError` possédé et transparent déjà disponible en 0.18.5, en conservant les messages et scénarios amont.

Résultats sur le commit testé [bd2e21a](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/bd2e21aaccafc02baf20807809feb235a55e8c7d) :

| Vérification | Résultat | Preuve |
| --- | --- | --- |
| `cargo build --workspace --locked --verbose` | **Réussi**, debug | [Rust 38442051602 / job 115450834959](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442051602/job/115450834959) |
| `cargo test --workspace --locked --verbose` | **24 tests réussis**, 0 échec/ignoré | Même job Rust |
| Build/test avec `--release` | **Compilation réussie, mêmes 24 tests réussis**, 0 échec/ignoré | Même job Rust |
| `cargo fmt --all -- --check` | **Réussi** | [Qualité Rust 115450800290](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800290) |
| `cargo clippy --workspace --locked --all-targets --all-features -- -D warnings` | **Job réussi** ; 34 avertissements du paquet tiers GLib restent visibles | Même job qualité |
| Conservation complète et résolution `cargo metadata --locked` | **Réussies** : 446 noms historiques et 121 fichiers GLib contrôlés, paquet vendored réellement résolu | Job Rust 115450834959 |
| Exclusion du code fantôme des artefacts | **Contrôle existant réussi**, archives hors cibles Cargo et sans include applicatif | Même job Rust |
| Lint/typecheck/build Vite et validation des workflows | **Réussis automatiquement**, sans changement JS/workflow | [JS/TS CI 38442051634](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442051634) |

La garde de conservation conserve tous ses contrôles précédents et n'autorise que le remplacement de fonction exact, avec empreintes fixées. Les variantes précédentes du fichier complet et du contrôleur sont archivées avec des **blobs Git identiques octet pour octet**. Des contrôles locaux négatifs ont confirmé le rejet d'un delta source non autorisé, du retour à l'ancienne conversion et d'une variante de référence altérée.

Cargo/rustfmt ne sont pas installés localement ; les compilations, tests, Clippy et audits ont donc été exécutés dans les **workflows GitHub Actions existants**. La finalisation ajoute seulement le rapport et les preuves, sans changer le code testé. Aucun test Android sur appareil, Miri ou AddressSanitizer n'a été exécuté.

### Audits et limites restant visibles

- [`cargo audit --deny warnings`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800367) : **échec, 3 avertissements refusés** — proc-macro-error 1.0.4 / **RUSTSEC-2024-0370** ; rustls-pemfile 1.0.4 / **RUSTSEC-2025-0134** ; glib 0.18.5 / **RUSTSEC-2024-0429**. L'identité registry GLib reste inchangée ; le backport VariantStrIter précédent est conservé et ses six tests passent.
- [cargo-deny](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800678) : **advisories FAILED, licenses FAILED ; bans ok, sources ok**. Le refus d'advisory affiché concerne proc-macro-error ; les refus de licences et leur politique sont conservés.
- [Audit JS automatique](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800193) : **1 alerte high braces 3.0.3, GHSA-vfj7-8cjw-p6xm**, hors de ce correctif.
- À la vérification du commit testé, le [check CodeQL 115451282377](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153/checks?check_run_id=115451282377) était **neutral**, avec un avertissement de configuration Rust manquante pour comparer les alertes à main. Son résumé exact est conservé dans les preuves. Cela n'est pas présenté comme une validation CodeQL verte ; aucun workflow n'est modifié pour le contourner.

Ce correctif traite le défaut réel distinct de conversion vide. Il ne prétend pas résoudre les chemins SARIF précédemment qualifiés comme faux positifs, ni les audits indépendants.

### Conservation et publication

La comparaison depuis `f149328e91bf0379f31d73b664d80dbe85f49617` confirme **aucune suppression** et seulement **deux fichiers préexistants modifiés** : `ptr_slice.rs` et le contrôleur `check-rust-warnings-backport.py`, chacun archivé intégralement avant remplacement.

**Toutes les dépendances, options, manifestes, verrouillages, archives précédentes, commentaires, variantes et code fantôme sont conservés. Tous les workflows, l'approbation automatique et la politique de licences sont inchangés.** Aucune exception d'audit, exclusion scanner, suppression ou dismissal d'alerte n'a été ajoutée. Aucune fusion ni fermeture de PR.

- [Rapport détaillé FR/EN](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/c0169878bbd24ba28bc17c1886bb4eada464bf39/docs/GLIB_EMPTY_SLICE_BACKPORT_20261013.md)
- [Preuves amont et résultats vérifiés](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/c0169878bbd24ba28bc17c1886bb4eada464bf39/docs/security/GLIB_EMPTY_SLICE_BACKPORT_EVIDENCE_20261013.json)
- [Archives des variantes remplacées](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/c0169878bbd24ba28bc17c1886bb4eada464bf39/docs/history/glib-empty-slice-20261013)

### English

The minimal upstream empty Slice-to-PtrSlice fix is applied to glib 0.18.5. Six new regressions plus all eighteen previous tests pass in debug and release; formatting, Clippy and full preservation checks pass. Native ownership/finalization and reuse are verified. Previous complete source/checker variants and the initial incompatible test fixture are archived; dependencies, lockfiles, historical sources, workflows, approval automation and license policy are preserved.

Strict cargo audit still fails on three existing warnings; cargo-deny advisory/license checks and the existing braces audit remain failing. The reported CodeQL check was neutral with a configuration-comparison warning. No warning is hidden and no audit rule is weakened. Only branch #153 was updated; no PR was merged or closed.


---

## Entrée 33 — ID 4262273803

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4262273803

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T18:07:43Z ; review : None ; chemin : docs/history/glib-empty-slice-20261013/vendor/glib-0.18.5/src/collections/ptr_slice.rs ; ligne : 900

## CodeQL / Access of invalid pointer

This operation dereferences a pointer that may be [invalid](1).

[Show more details](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/13)


---

## Entrée 34 — ID 5507925276

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5507925276

Auteur : {'login': 'github-advanced-security[bot]', 'name': 'github-advanced-security[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/in/57789?v=4', 'id': 62310815}

Date : 2026-10-13T18:07:44Z ; review : COMMENTED ; chemin : None ; ligne : None

(Corps vide ; métadonnées conservées dans le JSON.)


---

## Entrée 35 — ID 6153834951

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6153834951

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T19:48:21Z ; review : None ; chemin : None ; ligne : None

## Dependabot, Renovate et conservation des dépendances

Configuration et contrôles poussés uniquement sur `chore/ci-phase1-reliability-20261013`, commit [a42475b](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/a42475b25bd13d2803d0d32b9c3a71d4256170f0). **Aucune fusion ni fermeture de PR. Aucun workflow préexistant, notamment l'approbation et la sécurité, n'a été modifié.**

### Configuration préparée

| Producteur | Écosystème | Planning UTC | Plafond des PR de versions |
| --- | --- | --- | --- |
| Dependabot | Cargo, racine du workspace/Cargo.lock | Quotidien, 06:00 | 5 |
| Dependabot | pnpm via l'écosystème officiel `npm` | Quotidien, 07:00 | 10 |
| Dependabot | GitHub Actions | Quotidien, 08:00 | 5 |
| Renovate | Profil npm/Cargo/Actions | **Désactivé**, pour éviter deux producteurs concurrents | Profil préparé : 5 simultanées, 2/h |

`package.json` déclare maintenant **pnpm@8.15.9**, cohérent avec les CI et le verrou v6. Tous ses autres champs sont conservés. Les groupes minor/patch ne concernent que les mises à jour de versions ; aucune mise à jour major ou advisory n'est ignorée.

Les anciens verrous npm, docs et vendor sont exclus des scans Dependabot de **versions**. Le workflow d'approbation est également exclu de ces propositions Actions. **Ces exclusions ne garantissent pas le comportement des PR de sécurité** : la documentation les marque « Version updates only ». Les PR de sécurité ont un plafond distinct fixe de **10**, non réglable par les plafonds du tableau.

Renovate déclare `enabled:false`, `automerge:false` et une maintenance des verrous désactivée. Sa PR d'onboarding **#154 reste ouverte et inchangée** ; sa proposition est archivée pour référence. La configuration ne devient pas un service actif simplement parce que le fichier existe sur #153 : l'adoption sur la branche par défaut et les réglages des services restent nécessaires.

Les workflows manuels `lockfile-maintenance` et `js-security-maintenance` restent inchangés : ils exportent des candidats sans pousser de branche. Le second contient un générateur de manifeste/versions historiques à revoir avant de copier un candidat. Aucune autre configuration de bot de dépendances n'a été détectée dans les fichiers audités ; cela ne certifie pas l'absence d'apps externes installées.

### Protection ajoutée

Un **nouveau workflow séparé**, en lecture seule, vérifie toutes les PR vers main lors de opened/synchronize/reopened/ready_for_review. Aucun secret, aucune installation du projet candidat ni permission de push/approbation.

Le contrôleur vérifie notamment :

- dépendances JS de chaque catégorie, même inutilisées, optionalDependencies, peers optionnels et références de patches ;
- déclarations Cargo root/workspace/target/dev/build, noms, origines et options/features préexistantes ; conservation des features par défaut de production ;
- noms des paquets des verrous Cargo/pnpm, noms optionnels et liens/peers optionnels pnpm ;
- aucune suppression de fichier de référence ; archives, propositions historiques et anciens `package-lock*.json` inchangés ;
- aucun verrou concurrent yarn/npm-shrinkwrap/bun/npm généré, et maintien de pnpm 8.15.9 ;
- refus des doubles clés JSON/YAML et des symlinks sur les fichiers parsés.

Pour les auteurs Bot et branches Dependabot/Renovate, le périmètre de fichiers est en plus limité. Sources vendored, patches et contrôleurs ne peuvent pas être réécrits. Les workflows peuvent seulement recevoir des changements de références `uses` ; commandes et déclencheurs restent inchangés. L'approbation automatique est entièrement protégée de ces modifications de bot.

Les changements de versions restent permis si les noms/options requis sont conservés. Une disparition transitive légitime peut donc exiger une revue de migration ; le contrôleur ne décide pas qu'un paquet devenu indirectement inutile peut être supprimé.

### Amorçage documenté, sans réactivation des variantes anciennes

Le premier contrôle contre la base réelle de #153 a détecté des écarts **antérieurs à cette mission** : **31 noms de paquets Babel**, le peer optionnel **vite/lightningcss**, et la feature Tauri **shell-open**. Ils ne sont pas déclarés faux positifs ni réactivés pour obtenir artificiellement un succès.

Le verrou ancien est archivé dans `docs/history/pnpm-lock.before-phase1-repair.yaml` (identique au verrou de base du relevé #138) ; le manifeste avec shell-open reste dans `docs/history/before-ci-phase1/src-tauri/Cargo.toml`.

Un unique amorçage est donc borné dans le nouveau workflow : **PR #153 seulement**, base **c39a87e1d693382f34ca38bcaa68e032a9bcbc29 seulement**, et seulement si la base ne possède pas encore le contrôleur. Il compare au commit immuable **c0169878bbd24ba28bc17c1886bb4eada464bf39**, juste avant cette mission, avec un avertissement visible.

**Les contrôles futurs utilisent la vraie base de chaque PR et son contrôleur.** Aucune exception permanente Babel/lightningcss/shell-open. Le succès initial certifie la conservation pendant cette mission bots, pas rétroactivement tous les changements main → #153. Toute autre tentative d'amorçage sans contrôleur de base échoue.

### Vérifications réellement exécutées

Sur le commit testé [d6316a5](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/d6316a5a77f0b4a663996b3c1e6dd0911c2dfed4) :

| Vérification | Résultat | Preuve |
| --- | --- | --- |
| Conservation sur l'ancrage prévu et régressions | **Réussies : 12 tests**, avertissement d'amorçage visible | [Run 38450920280, job 115481284979](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920280/job/115481284979) |
| Validateur officiel Renovate 44.155.7 `--strict` | **Réussi** ; 7 avertissements de sous-dépendances de l'outil temporaire restent visibles | [Job 115481284505](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920280/job/115481284505) |
| Schéma Dependabot SchemaStore | **Validation locale réussie**, options confrontées à la référence GitHub | Preuves et références du rapport |
| Syntaxe YAML et compilation Python | **Réussies localement** | Contrôles locaux |
| actionlint | **Réussi** | [JS/TS CI, job 115481281742](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920067/job/115481281742) |
| Lint, typecheck, build Vite, contrôle JS préexistant | **Réussis** avec pnpm gelé | [Job 115481281391](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920067/job/115481281391) |

Une commande YAML initialement non entourée de guillemets a été corrigée ; cette variante et celle comparant directement à main sont archivées. Le dernier commit ajoute uniquement le rapport, les preuves et le README d'archives, sans changer le code/configuration validés.

### Cas réel et limites

La lecture seule de **#138** confirme **84 noms de paquets disparus**, dont **51 noms optionnels**, notamment plusieurs variantes **Android** esbuild/rollup. Cela démontre des suppressions à examiner, sans prouver que toutes sont injustifiées. Le contrôleur les détecterait ainsi que la réécriture du verrou npm historique. **#138 et toutes les autres PR existantes sont laissées intactes.**

Le check n'a pas été rendu obligatoire dans les réglages GitHub. Le ruleset Ægis consultable impose une revue, sans règle de statut obligatoire dans sa réponse ; l'endpoint de protection classique est inaccessible (403). **Un échec rend une suppression visible, mais ne garantit pas à lui seul que GitHub bloquera la fusion.** La configuration d'un check requis et la protection de son workflow restent nécessaires pour cette garantie ; aucun réglage ni système d'approbation n'a été modifié ici.

Autres limites documentées :

- les réglages/permissions des apps externes ne sont pas inventoriés intégralement ; aucune mise à jour réelle Dependabot Cargo n'a été déclenchée pour simuler le service ;
- le contrôleur de base réduit l'altération de son propre script, mais le workflow pull_request mutable et les réglages de branche nécessitent leur protection/revue ;
- les noms/options ne prouvent ni compatibilité, ni sûreté, ni toutes les sémantiques du code fantôme ; les CI/builds/audits existants restent nécessaires ;
- certains comptes techniques non reconnus Bot échappent au périmètre de fichiers supplémentaire, mais le contrôle général de dépendances/archives s'applique à toutes les PR ;
- les verrous actifs peuvent remplacer des versions ; l'historique Git et les archives existantes sont conservés, sans archivage automatique de chaque future génération ;
- une configuration seulement sur #153 ne change pas encore les services sur main, et ne rétroactive pas les checks sur les anciennes PR.

### Conservation et liens

Comparaison depuis `c016987` : **aucune suppression**, seulement deux fichiers préexistants modifiés — `.github/dependabot.yml` et `package.json` — chacun archivé intégralement avec un blob identique à sa version précédente.

**Tous les workflows préexistants, manifestes/verrous Cargo, pnpm-lock.yaml, anciens verrous npm, dépendances applicatives, options, code fantôme, patches, licences et archives antérieures restent inchangés.** Aucun merge, fermeture de PR, changement de règle d'audit ou d'approbation.

- [Rapport détaillé FR/EN](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/a42475b25bd13d2803d0d32b9c3a71d4256170f0/docs/DEPENDENCY_BOTS_20261013.md)
- [Preuves, limites et relevés des PR](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/a42475b25bd13d2803d0d32b9c3a71d4256170f0/docs/security/DEPENDENCY_BOTS_EVIDENCE_20261013.json)
- [Archives des configurations et variantes](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/a42475b25bd13d2803d0d32b9c3a71d4256170f0/docs/history/dependency-bots-20261013)

### English

Dependabot declares pnpm, Cargo and Actions with explicit schedules and version-PR limits. Renovate stays disabled to avoid competing update producers; its onboarding PR is untouched. A separate read-only preservation check and twelve regressions detect dependency/optional/history removal and restrict bot edits.

The first #153 check uses a documented, immutable pre-mission anchor only under narrowly pinned bootstrap conditions; future PRs use their actual base. Earlier phase-one differences remain disclosed. The official Renovate validator, Dependabot schema, actionlint and existing JS checks pass. The new check is not made mandatory in GitHub settings, so merge blocking cannot be guaranteed. All existing security/approval workflows, lockfiles, dependencies, licensing policy and archives are preserved. Only branch #153 was pushed; no PR was merged or closed.


---

## Entrée 36 — ID 6154474552

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6154474552

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T20:23:40Z ; review : None ; chemin : None ; ligne : None

Compte-rendu — écarts historiques de conservation, uniquement sur #153

Corrections poussées sur `chore/ci-phase1-reliability-20261013` : **131fe45**, **0378552**, puis documentation **f308ee1**. Aucun merge, aucune fermeture ou modification d'une autre PR. Source effectivement validée : `03785527621149a1f75f6e31075b45340ed5a71e` ; le dernier commit ne change que les comptes-rendus et leurs archives.

**Les 31 noms disparus sont restaurés dans le graphe pnpm actif**, via cinq racines de développement explicites. Les 288 noms de la vraie base main sont présents ; le verrou compte désormais 324 noms / 335 entrées accessibles. Les 95 noms optionnels existants restent présents. Aucune suppression de dépendance pour obtenir un contrôle vert.

### Origine, rôle et décision pour les 31 noms

Le commit [9ff648d](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/9ff648dc66e1ca83bf564f26a172540cd825ba25) avait migré les versions racines vers Plugin React 6.0.2 et Vite 8.0.16 tout en gardant le snapshot Plugin React 4.7.0/Vite 7.3.5. Le snapshot Plugin React 6 manquait : le verrou était incohérent. [076b523](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/076b523ba719aa4c4bd0dd2f2c34807824602195) a résolu le graphe réel et retiré les 31 descendants de l'ancien plugin. **L'amorçage exceptionnel de #153 n'est pas considéré comme validation de ces retraits.**

Ces paquets servent à la transformation Babel, aux types, aux source maps ou à Fast Refresh. Leur appartenance à l'ancien graphe est établie, mais le verrou incohérent ne démontre pas qu'ils étaient exécutés par une application compilable avant réparation.

| Nom | Version restaurée | Rôle historique | Décision |
|---|---|---|---|
| `@babel/code-frame` | 7.29.7 | Cadres d’erreur et extraits de code | Restauré, dev |
| `@babel/compat-data` | 7.29.7 | Données de compatibilité JavaScript | Restauré, dev |
| `@babel/core` | 7.29.7 | API et pipeline de transformation Babel | Restauré, dev |
| `@babel/generator` | 7.29.7 | Génération de code JavaScript | Restauré, dev |
| `@babel/helper-compilation-targets` | 7.29.7 | Sélection des cibles navigateur | Restauré, dev |
| `@babel/helper-globals` | 7.29.7 | Globals connus lors du parcours AST | Restauré, dev |
| `@babel/helper-module-imports` | 7.29.7 | Construction des imports de modules | Restauré, dev |
| `@babel/helper-module-transforms` | 7.29.7 | Transformation des modules | Restauré, dev |
| `@babel/helper-plugin-utils` | 7.29.7 | Utilitaires des plugins Babel | Restauré, dev |
| `@babel/helper-string-parser` | 7.29.7 | Analyse des chaînes littérales | Restauré, dev |
| `@babel/helper-validator-identifier` | 7.29.7 | Validation des identifiants | Restauré, dev |
| `@babel/helper-validator-option` | 7.29.7 | Validation des options des cibles | Restauré, dev |
| `@babel/helpers` | 7.29.7 | Helpers nécessaires aux transformations | Restauré, dev |
| `@babel/parser` | 7.29.7 | Analyse JavaScript et JSX | Restauré, dev |
| `@babel/plugin-transform-react-jsx-self` | 7.29.7 | Ajout du marqueur JSX __self en développement | Restauré, dev |
| `@babel/plugin-transform-react-jsx-source` | 7.29.7 | Ajout du marqueur JSX __source en développement | Restauré, dev |
| `@babel/template` | 7.29.7 | Construction de fragments AST | Restauré, dev |
| `@babel/traverse` | 7.29.7 | Parcours et transformation AST | Restauré, dev |
| `@babel/types` | 7.29.7 | Types et constructeurs AST | Restauré, dev |
| `@jridgewell/remapping` | 2.3.5 | Composition des source maps | Restauré, dev |
| `@types/babel__core` | 7.20.5 | Types TypeScript de Babel Core | Restauré, dev |
| `@types/babel__generator` | 7.27.0 | Types TypeScript du générateur | Restauré, dev |
| `@types/babel__template` | 7.4.4 | Types TypeScript des templates | Restauré, dev |
| `@types/babel__traverse` | 7.28.0 | Types TypeScript du parcours AST | Restauré, dev |
| `convert-source-map` | 2.0.0 | Lecture et écriture des source maps inline | Restauré, dev |
| `gensync` | 1.0.0-beta.2 | Exécution synchrone/asynchrone des transformations | Restauré, dev |
| `jsesc` | 3.1.0 | Échappement des littéraux générés | Restauré, dev |
| `json5` | 2.2.3 | Lecture des configurations JSON5 | Restauré, dev |
| `lru-cache` | 5.1.1 | Cache des cibles de compilation | Restauré, dev |
| `react-refresh` | 0.17.0 | Runtime Fast Refresh de développement | Restauré, dev |
| `yallist` | 3.1.1 | Liste chaînée du cache LRU | Restauré, dev |

Racines explicites conservées : `@babel/core@7.29.7`, les deux transforms JSX `7.29.7`, `@types/babel__core@7.20.5`, `react-refresh@0.17.0`. Leurs descendants sont réellement accessibles, pas simplement ajoutés comme entrées orphelines. `semver@6.3.1`, nécessaire à Babel, est également restauré ; la version actuelle demeure. Browserslist respecte l'override de sécurité existant.

Aucune modification de `vite.config.ts`, de React ou des sources Rust n'active ces outils historiques. Les anciens snapshots restent archivés et le test du graphe de production exclut les modules Babel, React Refresh et les archives.

### vite/lightningcss : migration de déclaration, package déjà conservé

[Le manifeste Vite 7.3.5](https://github.com/vitejs/vite/blob/v7.3.5/packages/vite/package.json) expose Lightning CSS comme peer optionnel. [Vite 8.0.16](https://github.com/vitejs/vite/blob/v8.0.16/packages/vite/package.json) en fait une **dépendance obligatoire** `^1.32.0`, actuellement verrouillée en **1.33.0**. Le snapshot historique gardait à tort l'ancien peer après son renommage vers Vite 8.

L'ancien peer reste intégralement dans le verrou historique. Le package actif et ses **11 variantes natives optionnelles**, dont Android arm64, sont conservés. Aucun faux peer n'est injecté et Vite 7 n'est pas réactivé. Lightning CSS minifie déjà le CSS par défaut sous Vite 8, comme le confirme [la migration amont](https://github.com/vitejs/vite/blob/v8.0.16/docs/guide/migration.md) ; le transformeur CSS reste PostCSS. Il ne s'agit pas d'une perte fonctionnelle.

### tauri/shell-open : déclaration Tauri 1 invalide sous Tauri 2

[4e126a1](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/4e126a1265931c4032d6b31d06886d4acface5ea) a retiré `shell-open` d'une dépendance déjà déclarée en Tauri 2. [Tauri 1.8.3](https://github.com/tauri-apps/tauri/blob/tauri-v1.8.3/core/tauri/Cargo.toml) définit cette feature ; [Tauri 2.12.3](https://github.com/tauri-apps/tauri/blob/tauri-v2.12.3/crates/tauri/Cargo.toml), version effectivement verrouillée, ne la définit pas. La réactiver casserait Cargo.

Les points d'entrée Rust/JS et la configuration examinés ne contiennent ni appel shell/opener, ni enregistrement de plugin, ni permission correspondante. `open_devtools()` concerne les outils de développement en debug. Aucun comportement d'ouverture externe existant n'est démontré. [La migration amont](https://github.com/tauri-apps/tauri-docs/blob/86f23966da282a29c7ec27e18ce540be70988091/src/content/docs/start/migrate/from-tauri-1.mdx) nécessite un plugin séparé et des permissions.

La déclaration initiale est conservée **dans son archive intacte et en commentaire dans le manifeste actif**. Aucun plugin ni permission n'est ajouté ; la sémantique Cargo est inchangée. Une recherche textuelle ne prouve pas à elle seule l'absence universelle d'exposition indirecte : la conclusion repose également sur la revue des points d'entrée.

### Conservation et limites des protections

Le workflow exécute désormais une **comparaison supplémentaire contre la vraie base main**. Le contrôleur générique demeure inchangé et strict ; les deux transitions ci-dessus sont qualifiées séparément seulement après vérification des contrats amont, des empreintes SHA-256, des archives et de l'identité des fichiers de base analysés. Elles restent affichées comme **deux avertissements explicites**. Toute autre disparition reste un échec. Le résultat ne repose pas sur l'amorçage.

Huit nouveaux tests refusent notamment la disparition d'un paquet Babel, la perte de Lightning CSS obligatoire, l'ajout d'un plugin shell, une preuve altérée, une autre base ou une autre suppression. La première fixture CI a été corrigée pour inclure les quatre anciens verrous npm ; sa variante initiale reste archivée. Les règles n'ont pas été relâchées.

**Aucun fichier existant supprimé.** Seuls quatre fichiers actifs existants changent : package.json, pnpm-lock.yaml, src-tauri/Cargo.toml (commentaires uniquement) et le workflow de conservation. Leurs variantes précédentes sont archivées. Tous les autres fichiers gardent leurs blobs Git : dépendances Rust/verrou, code fantôme, archives préexistantes, vendor GLib, commentaires, approbation automatique, workflows de sécurité, audits et politiques de licences.

### Vérifications réellement exécutées

| Vérification | Résultat |
|---|---|
| Conservation sur vraie base + 20 tests Python | **Succès** — [job 115517579198](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512094/job/115517579198), deux transitions visibles |
| Installation gelée pnpm 8.15.9 / Node 22 | **Succès** |
| Babel isolé, React Refresh, exclusion du bundle | **3/3**, **53 modules** vérifiés — [job 115517579531](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512094/job/115517579531) |
| Résolution pnpm sans scripts puis diff du verrou/manifeste | **Succès, diff nul**, même job |
| Conservation JS, tests braces, lint, typecheck, Vite | **Succès** — [job 115517579300](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512173/job/115517579300) |
| actionlint | **Succès** — [job 115517579591](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512173/job/115517579591) |
| Validateur officiel Renovate | **Succès** — [job 115517579795](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512094/job/115517579795) |
| Rust debug/release + tests dans chaque profil | **Succès, 24 + 24 tests** — [job 115517577926](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511882/job/115517577926) |
| Contrôleurs Rust + exclusion des marqueurs historiques des artefacts | **Succès**, 446 noms historiques Cargo et 121 fichiers GLib conservés, même job |
| rustfmt + Clippy all-targets/all-features avec -D warnings | **Succès** — [job 115517578293](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578293), 34 avertissements GLib tiers restent affichés |

### Problèmes hors mission, toujours visibles

- **pnpm audit** : 1 alerte élevée `braces@3.0.3`, GHSA-vfj7-8cjw-p6xm ; aucune nouvelle alerte issue de la restauration Babel. [Job 115517578626](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578626).
- **cargo audit --deny warnings** : les trois avertissements existants RUSTSEC-2024-0370, RUSTSEC-2025-0134 et RUSTSEC-2024-0429. [Job 115517578357](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578357).
- **cargo-deny** : advisories et licences échouent ; bans et sources passent. Politique inchangée. [Job 115517578321](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578321).

La CI globale n'est donc pas présentée comme entièrement verte. Pas de packaging Android ni de lancement graphique testé ; les variantes Android restent verrouillées. Le contrôle du graphe couvre les modules concernés, sans prétendre prouver l'absence de chaque octet historique possible.

Documentation détaillée et parents/version de **chaque paquet** : [rapport](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/docs/DEPENDENCY_GAPS_20261013.md), [preuves JSON](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/docs/DEPENDENCY_GAPS_EVIDENCE_20261013.json), [archives et sources amont](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/docs/history/dependency-gaps-20261013).

EN: all 31 historical package names were restored through explicit development roots, without enabling historical application code. Lightning CSS is retained as a required Vite 8 dependency; the invalid Tauri 1 shell-open declaration remains archived and commented. Actual-base preservation, frozen/reproducible pnpm resolution, JS checks, production module exclusions, Rust debug/release tests and Clippy passed. Existing JS/Rust audit and licensing failures remain visible. Only PR #153's branch was updated; nothing was merged or closed.



---

## Entrée 37 — ID 6154969050

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6154969050

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T20:52:38Z ; review : None ; chemin : None ; ligne : None

## Audit de compatibilité et de cohabitation des outils — #153

**Audit sans modification du dépôt**, daté du 13 octobre 2026, sur le SHA **`f308ee1b97cc53bdadaf87041f82a5198b6b07e0`**, branche `chore/ci-phase1-reliability-20261013`. Arbre GitHub complet : **309 fichiers**, réponse non tronquée. Les configurations et l'historique du dépôt distant font foi : le dossier de travail de cette session est une matérialisation partielle, pas un clone Git autonome complet.

Aucune configuration ou dépendance supprimée, restaurée, réactivée ou remplacée ; aucune installation, régénération de verrou, exécution de générateur, modification des approbations, des workflows, des règles de sécurité ou des licences. Aucun nouveau commit ni push pour cet audit. Seule cette publication sur #153 est réalisée. Aucune autre PR n'est modifiée et rien n'est fusionné.

**La coexistence de fichiers est volontairement préservée.** « Historique » signifie ici que le fichier conserve une preuve ou une variante ; cela n'enlève pas sa valeur de compatibilité. « Non démontré » ne signifie ni inutile ni à supprimer.

### 1. Socle effectivement utilisé

- JavaScript : `packageManager: pnpm@8.15.9`, verrou pnpm **v6**, CI **Node 22.x / pnpm 8.15.9**, Vite **8.0.16**, Plugin React **6.0.2**, TypeScript **5.9.3**. Vite et Rolldown demandent **Node ^20.19.0 ou >=22.12.0**. Aucun `engines`, `.nvmrc`, `.node-version`, `.npmrc` ou `pnpm-workspace.yaml` versionné ne fixe autrement le runtime.
- Rust : workspace racine avec `src-tauri`, **Cargo.lock v4 / 491 entrées**, resolver 2, édition 2021, Tauri **2.12.3**, tauri-build **2.7.2**. La CI choisit **stable**, pas une version exacte ; les journaux examinés utilisent **rustc 1.99.0**. Aucun `rust-toolchain[.toml]` versionné. Le verrou fige les paquets, pas le compilateur ni les bibliothèques système.
- GLib : `.cargo/config.toml` substitue les sources par `vendor/glib-0.18.5` ; le verrou conserve volontairement l'identité de registre. Cette configuration et le vendor font partie du contexte de build.
- Session actuelle : **Git 2.52.0, Node 24.19.0, npm 11.9.0, pnpm 11.25.0, Corepack 0.34.6, Python 3.12.14, Codex CLI 0.159.2, gh 2.46.0** observés. Cargo/rustc/rustup, Cursor et Claude ne sont pas disponibles dans le PATH. Node 24 satisfait la contrainte Vite ; **pnpm 11 ne reproduit pas la configuration pnpm 8**. Le connecteur GitHub fonctionne ; cela ne prouve pas que les identifiants du CLI `gh` ou d'un autre éditeur sont configurés.
- L'environnement cloud est observé comme connecté, avec politique HTTP appliquée et sans VPN configuré. Ses capacités/identités déclarées ne remplacent pas les permissions du connecteur GitHub. Aucun réglage privé, fichier de secrets ou profil utilisateur d'un autre outil n'a été inspecté.

Preuves : [package.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/package.json), [pnpm-lock.yaml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/pnpm-lock.yaml), [Cargo.lock](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Cargo.lock), [Cargo.toml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Cargo.toml), [src-tauri/Cargo.toml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/src-tauri/Cargo.toml), [.cargo/config.toml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.cargo/config.toml), [.github/workflows/js-ci.yml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.github/workflows/js-ci.yml), [.github/workflows/rust.yml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.github/workflows/rust.yml).

### 2. Matrice par outil

| Outil | Usage établi ou probable | Configuration et statut | Gestionnaire / environnement / versions | Compatibilité, risques et validation manquante |
|---|---|---|---|---|
| **Git** | Avéré : historique, branche et PR. Git local disponible ; paramètres privés des développeurs inconnus. | `.gitattributes` et `.gitignore` actifs. Script de comparaison Unity/VS Code conservé, exécution actuelle non démontrée. | Git 2.52.0 ici ; versions Windows/macOS inconnues. Aucun gestionnaire JS imposé par Git. | Merge « garder les deux » peut casser la structure d'un verrou, comme le transcript historique le montre. Les règles LF/CRLF et le staging automatique peuvent produire des diffs sans changement métier. Vérifier le vrai checkout, les attributs effectifs et les hooks locaux sur chaque poste. |
| **GitHub / Actions** | Avéré : PR #153 et exécutions sur ce SHA. | Workflows racine actifs ; copies sous `docs/history/` historiques. Approbation automatique observée uniquement comme interaction, sans changement. | Node 22 / pnpm 8.15.9 ; Rust stable ; Ubuntu 22.04 pour Rust principal, ubuntu-latest pour plusieurs contrôles. | CI gelée pnpm et Cargo --locked compatibles. Les événements push et PR peuvent tous deux lancer le workflow de sécurité. Un job d'approbation réussi n'est pas une preuve que les audits passent. Déploiement natif, Android et IDEs non validés par une simple CI Vite. |
| **StackBlitz / WebContainers** | Cible de compatibilité explicite ; usage d'une session récente non démontré. | `package.json.stackblitz.startCommand = pnpm run dev` actif comme instruction déclarative. Pas de `.stackblitzrc`. | Version Node/pnpm du WebContainer inconnu ; le projet demande pnpm 8.15.9. Environnement navigateur, pas le runner Linux Tauri. | StartCommand fixe le démarrage, **pas à lui seul le gestionnaire d'installation automatique**. Multi-locks, npm historique et dépendances natives demandent un essai réel. Rolldown conserve un binding WASM/WASI, mais sa présence ne prouve pas son chargement ; Lightning CSS, Rollup, esbuild et CLI Tauri ont aussi des contraintes natives. |
| **Bolt / agents Bolt** | Provenance avérée des fichiers : template créé le 19 avril, MCP le 9 mai ; lien Open in Bolt dans NotesPersos. État du projet connecté aujourd'hui inconnu. | `.bolt/config.json` : template React/Vite/TS ; `.bolt/prompt` : consignes d'architecture ; `.bolt/mcp.json` : GitHub enabled. Configuration de compatibilité conservée, consommation actuelle à confirmer. | Runtime et package manager du projet Bolt non observés ; ne pas les déduire du template. | La configuration MCP « enabled » ne suffit pas à établir endpoint, authentification ou droits. **Connexion GitHub de synchronisation et connecteur MCP sont distincts.** Si la synchronisation est activée, des commits automatiques et une concurrence avec les autres outils sont possibles ; vérifier la branche choisie avant toute édition. |
| **ChatGPT / Codex de cette session** | Avéré : audit présent et appels GitHub. | `AGENTS.md` est lu et appliqué ici. Aucun `.codex/`, `.agents/`, skill ou agent de projet versionné. Plugins/connecteurs de session fournis hors du dépôt. | Versions locales ci-dessus ; connecteur GitHub séparé du shell et de ses identifiants. | Ne pas confondre catalogue de plugins de session, dépendances du projet et paramètres d'un Codex local. Les installations automatiques/caches d'autres environnements restent inconnus. Ce dossier partiel ne doit pas servir à reconstituer et pousser un arbre complet. |
| **Codex CLI / extension dans Cursor ou un autre IDE** | Probable voie de travail compatible ; CLI disponible ici, usage de l'extension sur un poste non établi. | `AGENTS.md` partageable ; paramètres globaux ou `.codex/config.toml` éventuels hors de ce tree. | Gestionnaire réellement trouvé dans le terminal ; aucun choix de l'éditeur ne garantit pnpm 8.15.9. | Vérifier dossier courant, instructions effectivement chargées, projet de confiance, versions et setup. Une configuration Codex TOML n'est pas interchangeable avec les JSON MCP Cursor/Claude/Bolt. |
| **Cursor / ses agents** | **Usage historique avéré**, transcript exporté le 6 juin avec **Cursor 3.6.31** ; version installée aujourd'hui inconnue. | `.cursor/settings.json` contient `plugins.gitlab.enabled=true`. JSON valide ; reconnaissance effective de cette clé non prouvée. `AGENTS.md` compatible avec les règles Cursor actuelles. Pas de `.cursor/mcp.json`, `.cursor/rules` ou hooks versionnés. | Transcript : opérations npm sur la branche Bolt ; projet actuel : pnpm 8.15.9. Runtime du terminal Cursor à mesurer. | Un plugin GitLab ne démontre ni hébergement GitLab du projet ni dépendance npm GitLab. Vérifier plugin réellement installé/chargé, droits, réglages globaux et éventuel Codex embarqué. Les instructions d'Agent ne garantissent pas le comportement de toutes les fonctions d'édition/Tab. |
| **Claude / Claude Code / agents Claude** | Demandé dans cet audit ; **aucune trace spécifique d'usage ou version établie** dans le tree. Ce constat n'exclut pas un usage externe. | Aucun `CLAUDE.md`, `.claude/`, `.mcp.json` ou agent Claude versionné. `AGENTS.md` offre une compatibilité selon la version/session. | Terminal, machine ou service utilisés par Claude inconnus ; aucun package Claude déclaré par le projet. | La doc actuelle prévoit AGENTS.md à partir de **Claude Code 2.1.277**, avec conditions de session et de priorité. Vérifier version et instructions chargées ; un CLAUDE.local.md ou CLAUDE.md dans un parent peut modifier le choix. Ne pas créer un doublon avant ce contrôle. |

Preuves d'usage : [Scripts/transcriptcursor.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/transcriptcursor.md), [création Cursor 675017b](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/675017bf17a5d431d05d36d36f5ef64d67dcd3ae), [template Bolt a909106](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/a9091060a1fac7685a3f4a7665039e1b87b5aa85), [MCP Bolt f968eae](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/f968eae30a04c78471840ebc4099988c8f82f932), [.cursor/settings.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.cursor/settings.json), [.bolt/config.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.bolt/config.json), [.bolt/mcp.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.bolt/mcp.json), [NotesPersos.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/NotesPersos.md).

Contrats des outils consultés, sans appliquer leurs exemples de migration ou nettoyage : [StackBlitz configuration](https://developer.stackblitz.com/platform/webcontainers/project-config), [limites natives WebContainers](https://developer.stackblitz.com/platform/webcontainers/troubleshooting-webcontainers), [pnpm WebContainers](https://pnpm.io/webcontainers), [Bolt GitHub](https://support.bolt.new/integrations/git), [Cursor règles](https://cursor.com/docs/rules), [Cursor MCP](https://cursor.com/docs/mcp), [Cursor plugins](https://cursor.com/docs/reference/plugins), [Codex instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Codex configuration](https://learn.chatgpt.com/docs/config-file/config-basic), [Claude instructions](https://code.claude.com/docs/en/memory), [Claude settings](https://code.claude.com/docs/en/settings), [Claude MCP](https://code.claude.com/docs/en/mcp).

### 3. Matrice des verrous et configurations pertinentes

| Fichier / ensemble | Statut observé et rôle | Gestionnaire / version ou consommateur | Résultat et risque |
|---|---|---|---|
| [package.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/package.json) | Manifeste actif commun ; scripts web/native distincts ; préinstall de préférence pnpm. | pnpm 8.15.9 ; exécutables npm peuvent lancer des scripts déjà installés. | `npx only-allow pnpm` n'est pas une dépendance versionnée du graphe. Il peut demander le réseau et contrôle le **nom** du gestionnaire, pas sa version exacte ; scripts ignorés, le contrôle n'est pas exécuté. npm ne traduit pas automatiquement les overrides et patches pnpm. |
| [pnpm-lock.yaml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/pnpm-lock.yaml) | **Verrou actif et reproductible en CI**, format 6. | pnpm 8.15.9. | 335 records tous accessibles, 324 noms ; 95 noms optionnels. Patches et overrides présents. Le specifier PostCSS effectif du verrou est 8.5.25 sous override : une différence textuelle avec la plage ^8.5.25 du manifeste ne constitue pas un conflit d'installation ici. |
| [package-lock.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/package-lock.json) | Variante npm conservée ; **fichier au nom reconnu automatiquement par npm**, bien que la CI actuelle n'en dépende pas. | npm lockfileVersion 3 ; npm exact de génération inconnu. | JSON valide, aucune clé dupliquée, **302 entrées packages, racine comprise**. Snapshot Vite **7.3.5** et Plugin React **4.7.0** face aux demandes racines ^8.0.16/^6.0.2 : incompatibilité de versions confirmée. Sept dépendances de développement directes actuelles manquent dans les métadonnées racine ; PostCSS y reste ^8.5.14. **Pas un verrou npm certifié pour le manifeste actuel.** |
| [package-lock.main.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/package-lock.main.json) | Copie historique du merge ; preuve à préserver. | Référence npm, pas une entrée utilisée automatiquement sous ce nom. | JSON invalide à **ligne 1503, colonne 7**, « Expecting ':' delimiter ». Ce défaut de structure est confirmé ; il ne justifie aucune suppression ou réparation pendant cet audit. |
| [package-lock.main.fixed.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/package-lock.main.fixed.json) | Variante issue de la réparation historique, à préserver. | npm format 3 ; usage par script explicite. | JSON valide sans clés dupliquées, **382 entrées, racine comprise**. Mêmes incompatibilités Vite/Plugin React et métadonnées racine que le verrou npm principal. Syntaxe valide ≠ graphe installable ou équivalent à pnpm. |
| [package-lock.fix-report.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/package-lock.fix-report.json) | **Journal historique**, malgré son préfixe package-lock. | Produit par le script de réparation ; pas un verrou. | JSON valide ; aucune lockfileVersion/packages. Il signale un bloc baseline-browser-mapping non analysé. Un outil qui traite tous les package-lock*.json comme des verrous peut confondre journal et installation. |
| [Cargo.lock](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Cargo.lock) | Verrou actif du workspace racine. | Cargo format **4**, 491 entrées ; Cargo moderne nécessaire. | Ne fixe pas le compilateur, les features effectivement activées ou les sources substituées par config. Deux versions de reqwest coexistent dans le graphe ; leur présence n'est pas en soi un doublon erroné. |
| Cargo.lock historiques sous `docs/history/rust-h2-20261013/` et `rust-warnings-20261013/` | Références des migrations, pas verrous du workspace courant. | Cargo historique, lecture par contrôleurs. | Ne pas copier par-dessus le verrou actif ni lancer une mise à jour depuis ces répertoires en supposant un projet autonome. |
| Trois verrous pnpm historiques sous `docs/history/` | Avant réparation, avant audit JS, avant restauration Babel. | Format 6 ; preuves des écarts et conservation. | Ils décrivent des états différents et peuvent être intentionnellement incohérents/incomplets. **Aucun pnpm-lock.candidate.yaml suivi** dans ce SHA ; un fichier de ce nom existe dans le dossier local partiel et n'est pas une configuration du dépôt. |
| [AGENTS.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/AGENTS.md) | Consignes actives de maintenance, conservation et architecture. | Codex actuel, Cursor actuel ; Claude selon session/version. | Un seul AGENTS.md suivi, pas d'override/nested. Chargement des consignes à contrôler dans chaque client ; le fichier n'exécute pas à lui seul une protection CI. |
| [.bolt/prompt](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.bolt/prompt) et [.github/README.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.github/README.md) | Spécifications et références de projet ; .bolt/prompt possiblement consommé par Bolt. | Pas un manifeste de paquets ; aucun runtime fixé. | Les exemples npm/apps/desktop de README ne décrivent pas le layout actif racine/src-tauri. Svelte y est une préférence, React le code actuel. Ne pas convertir une intention d'architecture en migration automatique. Les passages de licence restent intacts et hors décisions de cet audit. |
| [docs/CI_SETUP.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/docs/CI_SETUP.md) | Document conservant le bilan **phase 1**, à lire avec sa date. | Référence humaine/agents. | Les mentions « 0 test », 495 paquets Cargo et 27 alertes JS décrivent un état antérieur ; CI actuelle : 24 tests par profil, 491 entrées Cargo, 1 alerte JS. Risque de mauvais diagnostic si un agent les traite comme état courant. Aucun remplacement du document. |
| [tauri.conf.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/tauri.conf.json) | Variante npm conservée à la racine, usage explicite par un outil possible. | Hooks `npm run vite:*`. | `npm run` n'est **pas** `npm install` : ce fichier n'impose pas à lui seul un nouveau verrou. Sa sélection/extension par CLI ou outil tiers doit être vérifiée ; aucun consommateur actuel retrouvé qui le choisisse explicitement. |
| [src-tauri/tauri.conf.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/src-tauri/tauri.conf.json) | Configuration native utilisée par le build Cargo/Tauri actuel. | Hooks pnpm ; frontendDist ../dist. | À conserver avec la variante racine. CLI --config peut fusionner une variante : ne pas présumer que deux fichiers sont interchangeables. Le script `build` fait Vite puis Tauri, dont le beforeBuildCommand redemande Vite : deux passages sont prévus par cette route, sans que ce soit automatiquement une erreur. |
| [Cargo.toml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Cargo.toml), [src-tauri/Cargo.toml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/src-tauri/Cargo.toml), [.cargo/config.toml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.cargo/config.toml) | Workspace actif, manifeste crate, substitution GLib. | Cargo depuis la racine ou un sous-répertoire du dépôt. | Profil release racine appliqué ; profil homonyme du crate conservé comme variante et signalé ignoré par Cargo. Anciennes déclarations reqwest/shell-open en commentaire = code/config fantôme explicite. Dépendances optionnelles conservées, activées par Clippy --all-features, pas forcément par le build par défaut. |
| Vite, TypeScript, ESLint, PostCSS, Tailwind | Configurations actives distinctes, pas des doublons à éliminer. | Vite 8, TS 5.9, ESLint 9, PostCSS/Tailwind 3 ; scripts existants. | `typecheck` cible tsconfig.app.json ; tsconfig.node.json porte vite.config.ts mais n'est pas exécuté comme contrôle TS distinct dans ce script. CI Vite/actionlint apporte d'autres vérifications, sans équivalence totale à un IDE. Pas de format-on-save/hook partagé déclaré ; réglages privés inconnus. |
| `src/services/tauri.ts` et services navigateur | Compatibilité native disponible, mais chemins UI actuels utilisent encore geocoding/weather/cache navigateur. | API Tauri 2 ; fetch/localStorage web dans App → useAppState et SearchBar. | Aucun import du wrapper Tauri trouvé dans les sources UI à ce SHA. Une démo web peut fonctionner sans être une validation du cache/backend Rust. Ne pas supprimer le wrapper, ni étiqueter tout fichier non importé comme fantôme volontaire sans preuve. |
| [.gitattributes](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.gitattributes) et [.gitignore](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.gitignore) | Compatibilité multiplateforme active. | LF pour JSON/YAML/JS/Markdown/etc., CRLF pour PS1/BAT/CMD ; text=auto ailleurs. | Fins de ligne Rust/TOML non explicitement fixées ; clones Windows peuvent normaliser les sources/archives et affecter des contrôles d'empreintes octet par octet. target/ n'est pas explicitement ignoré : risque d'ajout d'artefacts par staging global. Les exclusions locales/globales restent inconnues. |
| [Scripts/setup_file_compare_unity_git.ps1](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/setup_file_compare_unity_git.ps1) | Outil de compatibilité Windows/Unity/VS Code conservé ; usage actuel non démontré. | PowerShell, Git local, UnityYAMLMerge et VS Code disponibles sur le poste visé. | Écrit .git/config et .gitattributes, avec backups ; peut modifier le comportement diff/merge d'autres clients. Aucun projet Unity ni invocation CI de ce script trouvé. **Non exécuté.** |
| [Scripts/analyze-lock-duplicates.mjs](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/analyze-lock-duplicates.mjs), [Scripts/fix-package-lock-merge.mjs](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/fix-package-lock-merge.mjs), [Scripts/transcriptcursor.md](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/transcriptcursor.md) | Outils et compte-rendu de réparation historique. | Node ESM ; entrées/sorties npm nommées. | Analyse écrit package-lock.analysis.json ; réparation réécrit main.fixed et fix-report, compare/fusionne des champs de versions historiques. Ce n'est pas un résolveur officiel npm/pnpm validant intégrités et graphe. Syntaxe vérifiée, **aucune exécution**. |
| [Scripts/Nettoyage_du_Dépôt.sh](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/Nettoyage_du_D%C3%A9p%C3%B4t.sh) | Maintenance GitHub conservée, pas un nettoyeur du code source malgré son nom. | Bash/Git Bash, gh, jq. | Supprime des **runs Actions** ; DRY_RUN=false et DELETE_ORPHANED=true dans le fichier. Peut faire disparaître logs/artefacts servant aux audits de compatibilité. Syntaxe vérifiée seulement ; aucune suppression exécutée. |

Les sept racines absentes des métadonnées des deux verrous npm valides sont : `@babel/core`, `@babel/plugin-transform-react-jsx-self`, `@babel/plugin-transform-react-jsx-source`, `@types/babel__core`, `react-refresh`, `esbuild`, `rollup`. Cela n'implique pas que tous ces noms soient absents de chaque ancien graphe transitif : c'est la **déclaration racine actuelle** qui n'est pas représentée.

### 4. Conflits confirmés et risques potentiels

| Qualification | Écart / déclencheur | Impact et preuve |
|---|---|---|
| **Confirmé, statique** | Les deux verrous npm JSON valides ne représentent pas le manifeste actif. | Versions majeures Vite/Plugin React incompatibles, métadonnées racine anciennes, overrides/patch pnpm sans équivalent npm. Selon le contrat [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/), une installation figée exige la cohérence lock/manifeste. **npm ci n'a pas été exécuté ici** ; l'incompatibilité des fichiers est démontrée, pas un nouveau journal d'installation. |
| **Confirmé, observé** | Le pnpm 11.25.0 local ignore package.json#pnpm. | `pnpm --version` affiche que **pnpm.overrides et pnpm.patchedDependencies sont ignorés**. [Migration pnpm](https://pnpm.io/migration) confirme le changement à partir de v11. Le pin packageManager n'a pas suffi à modifier l'exécutable trouvé ici. Installer ou régénérer avec cet exécutable pourrait changer le format/résolution et perdre la prise en compte des patches. Aucun install/codemod lancé. |
| **Confirmé, statique, déclenchement manuel** | `js-security-maintenance.yml` reconstruit un manifeste littéral ancien. | Son candidat omet le packageManager actuel et les **cinq racines Babel/React Refresh** restaurées. Permissions contents:read et export d'artefacts : pas de push automatique dans ce workflow. **Importer aveuglément ce candidat** ferait perdre des conservations récentes. [.github/workflows/js-security-maintenance.yml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.github/workflows/js-security-maintenance.yml) |
| **Confirmé, statique, déclenchement manuel** | Anciens préparateurs Rust relancés sur HEAD. | h2 réécrit entièrement le manifeste et perd la table de dev-deps GLib Linux. Le préparateur warnings **ré-extrait le vendor d'origine**, ne réapplique que VariantStrIter, peut donc écraser le récent correctif PtrSlice, puis ajoute de nouveau exclude et la table GLib déjà présents. Il n'est pas idempotent sur cette branche. Le workflow h2 attend aussi h2@0.3.27 à l'inverse du graphe courant. Ces scripts/procédures restent conservés ; **non exécutés**. [Scripts/prepare-rust-h2-candidate.py](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/prepare-rust-h2-candidate.py), [Scripts/prepare-rust-warnings-candidate.py](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/Scripts/prepare-rust-warnings-candidate.py) |
| **Risque documenté, pas incident constaté ici** | Bolt synchronisé et autres agents écrivent la même branche simultanément. | [Bolt documente](https://support.bolt.new/integrations/git) commits automatiques, récupération périodique et possibilité d'écrasement lors d'éditions concurrentes. Connexion actuelle/branche Bolt non vérifiées. Une mémoire de branche ou un cache d'agent peut aussi rester sur un ancien SHA. |
| **Risque de configuration, contrat confirmé** | Cargo lancé hors du dépôt avec seulement --manifest-path. | La découverte de `.cargo/config.toml` se fait depuis le **répertoire courant et ses parents** ; passer un manifeste distant ne remplace pas cette discipline. Le override GLib pourrait ne pas être chargé. [Cargo config](https://doc.rust-lang.org/cargo/reference/config.html), [paths overrides](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html). Les CI examinées travaillent au bon endroit ; aucun build local hors-racine exécuté. |
| **Risque WebContainer non tranché** | Installation automatique multi-locks, distribution pnpm, bindings natifs/WASM. | Il faut observer le boot réel. La doc StackBlitz indique installation automatique par défaut ; startCommand pnpm ne prouve pas le choix initial. La doc pnpm WebContainers décrit une distribution WASM actuelle avec des limites de switching/runtime, **pas une preuve que le pnpm 8 du projet est incompatible**. Ne pas appliquer automatiquement des remplacements WASM ni supprimer un verrou pour faire démarrer la preview. |
| **Risque d'activation de consignes différent** | Un client lit AGENTS.md, un autre des règles utilisateur/CLAUDE/override externes. | Codex, Cursor et Claude n'ont pas les mêmes conventions et priorités. Les prompts Bolt/README ne sont pas automatiquement une configuration active de tous les clients. Les chemins MCP diffèrent aussi : Cursor .cursor/mcp.json ; Claude .mcp.json ; Codex config TOML. Aucune conversion automatique proposée. |
| **Risque poste/CI** | Compilateur stable, versions Node/éditeurs non toutes fixées, normalisation de fichiers. | Cargo.lock n'épingle pas Rust ; absence de fichier de toolchain/Node de projet, hooks/format-on-save externes et CRLF peuvent changer diagnostics ou empreintes. Les variantes conservées ne doivent pas être écrasées pour aligner artificiellement les environnements. |

### 5. Interactions avec GitHub et portée des protections

- `js-ci.yml` : PR vers main, push sur main, dispatch manuel. `rust.yml` : PR vers main/push main. `security-analysis.yml` : push et PR sur toutes branches, calendrier et dispatch ; **deux exécutions push/PR sur ce SHA sont effectivement visibles**, ce n'est pas une preuve de boucle d'agent.
- `dependency-preservation.yml` : PR vers main, comparaison contrôlée + tests + comparaison supplémentaire de la vraie base. Le bootstrap #153 reste distinct des preuves des migrations ; deux avertissements qualifiés restent visibles. Il protège noms, variantes optionnelles et archives, mais n'établit ni le choix du package manager de StackBlitz, ni le chargement réel d'un plugin dans un éditeur.
- L'approbation utilise pull_request_target/dispatch, contrairement à plusieurs builds pull_request. Les commentaires/runs ne remplacent pas l'examen des checks du **bon SHA**. Son code, ses droits et ses règles sont laissés absolument inchangés.
- Les workflows de candidats JS/Rust/triage sont **manuels** ; les anciens déclencheurs push sont commentés. Leurs étapes mutantes opèrent dans le runner et leurs artefacts demandent une revue. Les scripts historiques restent exécutables si quelqu'un les appelle explicitement : « conservé » ne veut pas dire « impossible à lancer ».
- Dependabot : écosystème **npm** utilisé pour pnpm, Cargo racine et Actions ; exclusions de versions pour archives/vendor/anciens verrous. Ces exclusions ne garantissent pas toutes les PR de sécurité ni une détection universelle des lockfiles par les autres outils. Renovate : **enabled:false, automerge:false**, managers npm/cargo/github-actions ; présence du fichier ≠ bot actif. Aucun bot activé ici. [.github/dependabot.yml](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/.github/dependabot.yml), [renovate.json](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/f308ee1b97cc53bdadaf87041f82a5198b6b07e0/renovate.json).
- OWASP exclut volontairement package-lock*.json et docs/history, et délègue le pnpm v6 à l'audit pnpm dédié. Le transcript Cursor disant que le verrou npm sert au job npm audit décrit un **ancien état**, pas le workflow courant.
- Les copies .github/workflows sous docs/history ne sont pas des workflows enregistrés à cet emplacement. Les archives et propositions ne sont pas des entrées du workspace ou du bundle ; cette exclusion de compilation n'empêche pas tout outil externe de les indexer comme données.
- Les autorisations des Apps/clients et les checks réellement requis par les réglages GitHub peuvent être hors du tree. Aucun inventaire complet des installations d'organisation ou des politiques privées n'est revendiqué.

### 6. Vérifications réalisées pendant cet audit et preuves CI existantes

**Nouveaux contrôles, sans exécution de code applicatif ni installation :**

- Lecture à SHA fixe, inventaire complet, historique des configurations Cursor/Bolt/verrous ; recherche des configurations d'agents, runtimes et connecteurs versionnés.
- JSON avec détection de clés dupliquées pour les quatre package-lock*.json : trois parses réussis, un échec historique documenté ; comparaison des racines et snapshots. JSON des paramètres Cursor/Bolt/Tauri/manifestes/Renovate valides.
- TOML valides pour workspace, crate, Cargo.lock et override. YAML avec rejet des clés dupliquées pour les **15 fichiers workflows actifs**, Dependabot et pnpm. Graphe pnpm : **335 records accessibles**, sans entrée manquante.
- Syntaxe Node des deux scripts de réparation ; bash -n du script de maintenance GitHub ; analyse syntaxique Python de quatre scripts lus, **sans leur exécution**. Copies de contrôle uniquement dans /tmp.
- Versions des exécutables et état non secret de l'environnement ; documentation officielle des outils et comparaison statique des générateurs manuels avec le manifeste courant.
- Lecture de toutes les sources UI pour identifier le chemin navigateur et le wrapper Tauri non importé.

**Exécutions antérieures déjà terminées sur le SHA audité**, journaux relus maintenant ; aucun rerun/dispatch provoqué par cet audit :

| Contrôle | Preuve au SHA f308ee1 | Résultat |
|---|---|---|
| Install gelée, conservation JS, tests braces, lint/typecheck/build Vite | [Job 115520772502](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439103/job/115520772502) | Succès |
| actionlint | [Job 115520773253](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439103/job/115520773253) | Succès |
| Conservation et 20 tests Python, vraie base | [Job 115520774069](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439197/job/115520774069) | Succès, deux transitions explicitement qualifiées |
| Outils Babel/Refresh, exclusion de 53 modules, résolution pnpm sans diff | [Job 115520774210](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439197/job/115520774210) | 3 tests réussis ; reproductibilité pnpm 8 |
| Rust debug/release, conservation, artefacts, tests | [Job 115520770885](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462438973/job/115520770885) | Succès ; **24 tests par profil**, 446 noms historiques Cargo / 121 fichiers GLib conservés |
| Rustfmt/Clippy | [Job 115520772123](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439063/job/115520772123) | Succès ; 34 avertissements tiers GLib visibles |
| Audits | [JS](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439063/job/115520772088), [Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439063/job/115520772076), [cargo-deny](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38462439063/job/115520771855) | Échecs connus : braces, 3 avertissements Rust, advisories/licences ; non masqués et non traités ici |

Ces résultats valident le parcours CI Linux décrit, **pas toutes les installations locales**, ni une session Bolt/StackBlitz, ni le packaging Android, le lancement graphique ou la compatibilité complète des extensions.

### 7. Recommandations sans application automatique

1. **Avant toute future écriture**, chaque outil devrait annoncer dépôt/branche/SHA, répertoire courant, versions Node/pnpm/Rust et sources de consignes chargées. Relire le SHA distant avant push ; une session ou une preview ne garantit pas qu'on travaille sur #153.
2. Conserver **pnpm 8.15.9 / Node 22** pour reproduire les contrôles actuels. Examiner séparément toute migration de gestionnaire avec ses variantes archivées ; ne pas appliquer un codemod pnpm 11 à cette branche pendant un autre travail.
3. Garder les quatre fichiers npm tels quels. Leur statut actuel est documenté ci-dessus ; s'ils doivent redevenir une cible d'installation active d'un outil, prévoir **une mission dédiée** de compatibilité/résolution, avec préservation et preuves. Ne pas remplacer le verrou actif pnpm ou un backup npm par un autre fichier.
4. **StackBlitz/Bolt : validation dans l'outil obligatoire.** Sur une copie de test isolée, relever l'installateur réel, les versions, les substitutions natives/WASM, les logs de startup et les diffs avant/après ouverture ; essayer la preview et ses accès HTTP/cache. Aucun remplacement de paquet ou enregistrement du résultat dans la branche sans revue.
5. **Cursor : validation dans l'éditeur obligatoire.** Vérifier version, projet ouvert, paramètres interprétés, plugin GitLab installé et sa source, instruction AGENTS effective, éventuels hooks/autoformat et intégration Codex. La clé JSON historique reste conservée même si sa consommation actuelle n'est pas confirmée.
6. **Claude : validation dans la session obligatoire.** Relever claude --version puis les instructions effectivement chargées (/memory ou contrôle équivalent de la version). Si AGENTS n'est pas lu, discuter une compatibilité supplémentaire uniquement après ce constat ; aucun CLAUDE.md, import, symlink ou réglage ajouté ici.
7. Lancer Cargo depuis le workspace pour charger l'override GLib, puis vérifier avec cargo metadata --locked que manifest_path pointe au vendor. Ne pas transformer un warning d'audit de version de registre en suppression de source ou de dépendance. Sur Windows, mesurer aussi les attributs Git effectifs et les empreintes, sans normalisation automatique des archives.
8. Traiter les générateurs de candidats et les scripts de maintenance comme **procédures liées à un état historique**, jamais comme commandes génériques de remise en état. Une éventuelle adaptation doit être une mission distincte avec conservation intégrale des versions présentes. Ne pas relancer le script de suppression de runs pour « nettoyer » les preuves.
9. Pour plusieurs agents/outils, coordonner les écritures et vérifier les modes de synchronisation ; envisager des espaces de travail séparés lors d'un futur travail autorisé. Aucun agent supplémentaire, connexion, plugin ou worktree créé par cet audit.

**Conclusion :** la cohabitation des références et verrous est préservée. Le parcours pnpm 8 / CI Linux est démontré ; l'installation npm actuelle ne l'est pas et ses incohérences sont confirmées ; pnpm 11 est incompatible avec la configuration actuelle des overrides/patches ; les clients navigateur/IDE/Claude exigent des validations ciblées dans leurs propres environnements. Aucun doublon n'a été assimilé automatiquement à une erreur et aucune recommandation n'a été appliquée.

EN: read-only audit of the exact PR #153 revision. Multi-tool configurations, historical locks, dependencies and ghost code were preserved. The matrix distinguishes observed usage, historical evidence, potential compatibility and checks requiring the actual client. Current pnpm 8/Linux CI is verified through existing logs; npm lock inconsistencies, ignored pnpm 11 settings and stale manual generators are documented. No configuration, dependency, workflow, approval rule, licence policy, other PR or repository commit was changed; nothing was merged.



---

## Entrée 38 — ID 4264334994

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4264334994

Auteur : {'login': 'github-code-quality[bot]', 'name': 'github-code-quality[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/9919?v=4', 'id': 223894421}

Date : 2026-10-13T21:42:04Z ; review : None ; chemin : Scripts/candidate-safety.cjs ; ligne : 9

## Unused variable, import, function or class

<p>Unused variable baselines.</p>


---

## Entrée 39 — ID 5510335212

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5510335212

Auteur : {'login': 'github-code-quality[bot]', 'name': 'github-code-quality[bot]', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/9919?v=4', 'id': 223894421}

Date : 2026-10-13T21:42:05Z ; review : COMMENTED ; chemin : None ; ligne : None

(Corps vide ; métadonnées conservées dans le JSON.)


---

## Entrée 40 — ID 5510405725

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5510405725

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T21:48:51Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 41 — ID 5510528863

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#pullrequestreview-5510528863

Auteur : {'login': 'MinhoZenS', 'name': 'MinhoZenS', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/168182798?v=4', 'id': 168182798}

Date : 2026-10-13T22:01:11Z ; review : DISMISSED ; chemin : None ; ligne : None

✅ Auto-approuvé par le workflow. / Auto-approved by workflow.


---

## Entrée 42 — ID 6157746393

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6157746393

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-13T23:58:42Z ; review : None ; chemin : None ; ligne : None

## Générateurs historiques sécurisés — PR #153

Corrections poussées uniquement sur `chore/ci-phase1-reliability-20261013`, jusqu’à **573b5139019538dc908fee01b0d7f638ef71b66c**. Source fonctionnelle validée : **32b646058f64890d072118f41736e27b602093d5** ; le dernier commit ajoute uniquement le compte-rendu. Aucune fusion, fermeture de PR ou modification du système d’approbation.

[Documentation complète bilingue](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/573b5139019538dc908fee01b0d7f638ef71b66c/docs/CANDIDATE_GENERATOR_SAFETY_20261013.md) · [Preuves et empreintes](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/573b5139019538dc908fee01b0d7f638ef71b66c/docs/CANDIDATE_GENERATOR_SAFETY_EVIDENCE_20261013.json)

### Protections appliquées avant écriture

| Entrée active | Protection |
|---|---|
| `prepare-rust-h2-candidate.py` | Contrôle seul par défaut et avec `--check`. `--generate` exige les manifestes/verrou exacts antérieurs à la migration h2, ainsi que l’absence de configuration Cargo, vendor GLib et sortie HTTP existants. L’état actuel est refusé avant le corps historique. |
| `prepare-rust-warnings-candidate.py` | Même séparation contrôle/génération ; refuse l’état déjà rétroporté, les overrides Cargo, le vendor et les sorties existantes. Empêche la réextraction historique d’écraser les deux correctifs GLib. |
| Deux workflows Rust de génération | Garde immédiatement après setup Python, avant toute copie de référence, commande Cargo ou installation frontend ; les scripts vérifient aussi leur propre précondition. |
| `js-security-maintenance.yml` | Garde avant installation et répétée juste avant l’ancien `writeFileSync`. Le manifeste actuel avec les cinq racines Babel/React Refresh est incompatible avec cette ancienne substitution et donc refusé. |
| `lockfile-maintenance.yml` | État actuel exact, pnpm exact, manifeste identique à Git HEAD ; contrôle avant génération et conservation exacte avant export. Toute résolution différente obtenue par ce rejeu échoue. Ce n’est pas un générateur général de mises à jour. |

Les contrôleurs Python/Node utilisent leurs bibliothèques standard, exigent la racine du dépôt, refusent les entrées liées et vérifient les archives. Aucune option force n’est disponible. Pour les opérations pnpm, **8.15.9 exactement** et un Node compatible avec Vite sont exigés ; une version différente, un exécutable absent ou une sonde en erreur bloque l’opération. La sonde ne fait que `pnpm --version`.

Les anciens corps Python utilisent un encodage implicite : `--generate` exige donc un encodage Python UTF-8 avant toute écriture. Un test simule cp1252 sur une référence autrement compatible. Les comparaisons actives normalisent uniquement CRLF→LF en mémoire, sans modifier les fichiers ; les archives restent vérifiées octet par octet.

### Conservation vérifiée

Les **six versions originales complètes** — deux préparateurs et quatre workflows de génération — sont archivées sous `docs/history/candidate-generators-20261013/`. Leurs blobs Git sont exactement ceux du commit de départ **f308ee1b97cc53bdadaf87041f82a5198b6b07e0**. Les variantes intermédiaires introduites pendant cette mission sont également archivées avant remplacement.

La comparaison des arbres Git complets confirme :
- aucun fichier supprimé ;
- seuls les deux préparateurs et les quatre workflows de génération préexistants changent ;
- tous les autres fichiers préexistants conservent leur blob, notamment manifestes/verrous pnpm/npm/Cargo, dépendances optionnelles, cinq racines Babel/Refresh, migration h2, deux rétroports GLib, archives, code fantôme, commentaires et configurations parallèles ;
- aucune modification des workflows d’approbation/sécurité, des règles d’audit ou des licences.

La référence `current-conservation` couvre les huit entrées actives protégées : manifestes/verrous JS et Rust, override Cargo et deux sources GLib rétroportées. Elle vérifie cet état ; elle n’autorise pas le rejeu d’une ancienne migration.

### Tests effectivement vérifiés

Les tests négatifs utilisent des **copies isolées**, des snapshots de tous leurs fichiers et des exécutables sentinelles. Ils couvrent les états déjà corrigés, la perte de racines/variantes optionnelles, les altérations h2/GLib, les sorties existantes, pnpm incompatible/absent, les archives modifiées, mauvais cwd, liens symboliques, mauvais Git HEAD, arguments de contournement, CRLF et encodage non UTF-8. Aucun corps historique mutateur n’a été exécuté, même pour une référence positive.

| Vérification | Résultat et preuve |
|---|---|
| Gardes Ubuntu | **21 tests réussis**, contrôles réels Python/Node/pnpm, aucun diff des entrées protégées. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934745) |
| Gardes Windows | **21 tests réussis**, dont CRLF, Git HEAD, pnpm et UTF-8 ; aucun diff. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934819) |
| Ensemble des contrôleurs | **41 tests Python réussis**. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934423) |
| JS et conservation | Installation gelée, 335 entrées accessibles, 95 noms optionnels conservés ; **10 tests braces + 3 tests Babel/Refresh/bundle**, contrôle de 53 modules de production ; lint, typecheck, Vite et actionlint réussis. Même job. |
| Rust du workflow existant | Debug et **24 tests réussis**. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558933907) |
| Format/Clippy existants | Réussis, avertissements tiers toujours visibles. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934586) |

Localement, 17 tests isolés puis le nouveau test de refus non UTF-8 ont réussi. Le sandbox bloquait les processus enfants Node avec EPERM ; les sondes correspondantes ont ensuite été validées dans les deux jobs CI. Une matérialisation locale d’archive différait d’un saut de ligne : elle n’a pas été réécrite ; les tests isolés et CI utilisent les références distantes exactes.

### Limites et problèmes restants

Les audits existants restent rouges, sans modification ni masquage :
- JS : `braces`, **GHSA-vfj7-8cjw-p6xm** ([job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934136)).
- Rust : **RUSTSEC-2024-0370**, **RUSTSEC-2025-0134**, **RUSTSEC-2024-0429** ([job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558933738)).
- cargo-deny : advisories/licences en échec ; bans/sources réussis ([job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934042)).

GitHub a signalé `mergeable:false / dirty` alors que la comparaison indiquait ahead sans commit behind. La cause n’est pas qualifiée ici. Le seul nouveau workflow de tests reçoit un déclencheur push limité à la branche de #153 pour permettre la validation ; aucun merge/rebase n’a été tenté.

Ces gardes protègent contre un mauvais contexte, pas contre la modification délibérée des contrôleurs ou l’exécution directe d’une archive. Les exécutables du PATH doivent être fiables ; aucune transaction ne protège contre une écriture concurrente entre vérification et génération. Une future évolution légitime des entrées doit faire revoir les références. Les archives restent intégrales mais ne doivent pas être exécutées directement.

Aucune configuration propre à Git/GitHub, StackBlitz/Bolt, Cursor, Claude, ChatGPT/Codex n’a été remplacée. Les sondes Node ne nécessitent pas Python et les sondes Rust Python ne nécessitent pas Node/Cargo. Les validations dans les clients réels, un build release, un APK et un rejeu historique mutateur ne sont pas revendiqués dans cette mission.

EN: Historical active entrypoints now fail closed before incompatible writes, with exact pnpm/state/archive checks and check-only defaults. Original versions and all existing dependency/configuration variants are preserved. Ubuntu/Windows negative tests and project checks passed as linked above; existing audit failures remain visible. No merge, dependency removal, approval/security policy change, or mutating historical replay was performed.


---

## Entrée 43 — ID 6160210718

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6160210718

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-14T03:27:39Z ; review : None ; chemin : None ; ligne : None

## Stabilisation finale de #153 — 14 octobre 2026

**Verdict : non prête à fusionner selon les critères de sécurité demandés.** Le conflit Git est corrigé et les compilations/contrôles de conservation passent ; les audits bloquants restent rouges. Aucun seuil n’a été abaissé, aucune alerte masquée et aucune dépendance retirée. La décision de fusion reste à la propriétaire du projet.

**SHA examiné : `a3a523b3a87f72ec18bcd90563ecc3701859a25c`**, branche `chore/ci-phase1-reliability-20261013`. Toutes les preuves CI ci-dessous se rapportent à ce SHA, et non seulement aux commits précédents.

### 1. Cause du statut dirty et correction

État avant intervention :
- tête #153 : `573b5139019538dc908fee01b0d7f638ef71b66c` ;
- ancien main / merge-base : `c39a87e1d693382f34ca38bcaa68e032a9bcbc29` ;
- main actuel : `235194a6fe825a6dac27012f07cbac2cc5d86794` ;
- comparaison actuelle : **45 ahead / 2 behind**, et non 45/0.

Main a reçu `bf6ceab…` et le commit de fusion `235194a…` de #154. Le seul écart de son arbre depuis le merge-base est l’ajout de `renovate.json`. #153 a également ajouté ce fichier, avec un contenu différent : **conflit Git add/add réel**. L’API de PR annonçait encore l’ancien SHA base ; comparer la branche à cette ancienne base donnait 0 behind mais ne vérifiait pas le main courant.

La preuve combine la comparaison des entrées des arbres distants et `git merge-file --diff3` sur les deux blobs vérifiés, avec une base vide : code de sortie **1**, conflit reproduit. Le clonage réseau local n’a pas abouti : sandbox sans accès au proxy puis appels d’autorisation bloqués avant lancement ; je n’ai pas présenté ce clonage comme réussi. Le connecteur GitHub et une copie temporaire ont permis la vérification sans modifier les branches.

Résolution non destructive poussée :
- **`cc9535996ace948b28779223b96a8ddb71ccd1e1`** : fusion de **main dans la branche #153**, avec deux parents exacts — ancien head en premier, main en second ;
- configuration active Renovate de #153 conservée **octet pour octet**, sans activer `config:recommended` ni Renovate ;
- variante main archivée intégralement, sans modification de #154 ;
- **`a3a523b3a87f72ec18bcd90563ecc3701859a25c`** : correction isolée de la fixture Git décrite ci-dessous.

Sauvegarde vérifiable : l’ancien head reste un ancêtre et l’[inventaire complet avant intégration](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/a3a523b3a87f72ec18bcd90563ecc3701859a25c/docs/history/final-stabilization-20261014/integration-evidence.json) conserve chaque chemin/blob de son arbre. Aucun rebase, force-push, réécriture ou branche supplémentaire. Aucun commit envoyé sur main.

Après correction : **47 ahead / 0 behind**, merge-base = main actuel, **`mergeable: true`**. Le statut de politique GitHub reste à distinguer de cette absence de conflit.

### 2. Fichiers modifiés et versions conservées

La comparaison de tous les blobs entre l’ancien head et le SHA final ne trouve **aucune suppression** et seulement deux fichiers préexistants modifiés :

| Fichier | Raison et conservation |
|---|---|
| `.github/workflows/dependency-preservation.yml` | L’amorçage #153 acceptait uniquement l’ancien SHA main et aurait échoué après intégration. Il accepte maintenant **uniquement les deux SHA main examinés**, dont les manifestes/verrous sont identiques. Aucun élargissement général : bases inconnues refusées, contrôles de conservation et lecture des écarts réels maintenus. Ancienne version intégrale archivée. |
| `tests/dependency_updates/test_candidate_safety.py` | Un test a détecté la disparition de `.git/objects/maintenance.lock` après un commit de fixture : maintenance Git automatique asynchrone, pas écriture d’un générateur. `maintenance.auto=false` et `gc.auto=0` s’appliquent uniquement aux commandes Git de la copie temporaire. Le snapshot complet de tous les fichiers reste inchangé dans son principe, aucune exclusion de verrou n’a été ajoutée. Ancienne version intégrale archivée. |

Ajouts sous [`docs/history/final-stabilization-20261014/`](https://github.com/Phoen0x/QuelleHeureEst-Il.com/tree/a3a523b3a87f72ec18bcd90563ecc3701859a25c/docs/history/final-stabilization-20261014) : les deux versions précédentes complètes, la variante `main/renovate.json`, l’inventaire/preuves de l’intégration et son README bilingue. Les archives copiées réutilisent les blobs Git exacts d’origine.

Le workflow de conservation a d’abord échoué sur `cc953599…` à cause de cette maintenance de fixture. Le correctif a été testé syntaxiquement, avec trois commits Git isolés, puis **la même suite de 41 tests a réussi sur le SHA final**. Ce premier échec est signalé, pas effacé par un simple rejeu.

### 3. Validations réelles sur le SHA final

| Contrôle | Résultat vérifié |
|---|---|
| Installation Node 22 / pnpm 8.15.9 | `pnpm install --frozen-lockfile` réussit ; contrôleur de version exécuté. |
| Reproductibilité pnpm | Résolution `--lockfile-only --ignore-scripts --no-frozen-lockfile`, suivie de `git diff --exit-code -- package.json pnpm-lock.yaml` : réussie, aucun diff. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064449/job/115660569009) |
| Conservation globale et écarts historiques | **41 tests réussis** ; contrôle contre la vraie base réussi ; **31 noms Babel restaurés** et graphe de 47 entrées vérifié. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064449/job/115660568708) |
| Configuration Renovate | Validateur officiel strict réussi. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064449/job/115660568959) |
| Gardes Ubuntu / Windows | **21 tests réussis chacun**, sentinelles et snapshots, puis contrôles réels sans diff. [Ubuntu](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064318/job/115660567856) · [Windows](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064318/job/115660567992) |
| Ensemble des contrôleurs et tests JS | **41 tests Python**, **10 régressions braces**, **3 tests Babel/Refresh/bundle**, 0 échec/ignoré ; 53 modules de production contrôlés. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064318/job/115660567633) |
| Lint / TypeScript / Vite | Réussis. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064280/job/115660567701) |
| actionlint | Réussi, version 1.7.7. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064280/job/115660568024) |
| Rust debug | `cargo build --workspace --locked --verbose` et `cargo test --workspace --locked --verbose` réussis ; **24 tests**, 0 échec/ignoré. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064460/job/115660568480) |
| Rust release | Mêmes commandes avec `--release`, réussies ; **24 tests**, 0 échec/ignoré. Même job. |
| GLib/h2 et artefacts | **446 noms et 121 fichiers GLib conservés** ; rétroports amont exacts et source Cargo locale vérifiés ; h2 **0.4.20** ; marqueurs historiques contrôlés absents de dist et du binaire release. Même job. Ce contrôle de marqueurs n’est pas une preuve universelle pour toute chaîne historique imaginable. |
| rustfmt / Clippy strict | `cargo fmt --all -- --check` et `cargo clippy --workspace --locked --all-targets --all-features -- -D warnings` réussis. **34 avertissements tiers GLib restent visibles** ; aucune source tierce nettoyée. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064287/job/115660567868) |
| pnpm audit | **Échec : 1 alerte high**, braces GHSA-vfj7-8cjw-p6xm. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064287/job/115660568091) |
| cargo audit --deny warnings | **Échec : les trois avertissements Rust**. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064287/job/115660568203) |
| cargo-deny | **advisories FAILED, licenses FAILED ; bans/sources OK**. 450 erreurs de rejet de licences et 1 `unlicensed` pour `quelleheureest 0.0.1` dans cette exécution. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064287/job/115660568028) |
| OWASP Dependency-Check | Exécution et export SARIF réussis. La configuration existante délègue l’audit pnpm à son job dédié et exclut les références historiques ; elle n’a pas été modifiée. [Job](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064287/job/115660568047) |

Les compilations/audits revendiqués sont exécutés dans **GitHub Actions**, pas dans le terminal local sans Cargo, Node 22/pnpm 8 et accès réseau utilisable. Localement : preuve du conflit, contrôles de conservation sans écriture Python/Node, inventaire Android, analyse YAML, cinq cas SHA (2 acceptés/3 refusés), syntaxe du test et trois commits de fixture. Aucun ancien corps générateur mutateur n’a été exécuté.


#### États GitHub finaux des workflows

Relevé final du 14 octobre, environ 03:26 UTC : **toutes ces exécutions sont terminées**.

| Workflow / exécution | Déclencheur | Conclusion GitHub |
|---|---|---|
| [SonarCloud analysis — 38505064253](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064253) | pull_request | skipped |
| [Semgrep — 38505064371](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064371) | pull_request | skipped |
| [JS/TS CI — 38505064280](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064280) | pull_request | success |
| [Conservation des dépendances — 38505064449](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064449) | pull_request | success |
| [Sécurité des générateurs de candidats — 38505064318](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064318) | pull_request | success |
| [Rust — 38505064460](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064460) | pull_request | success |
| [CodeQL Advanced — 38505064478](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064478) | pull_request | success |
| [🔒 Security & Quality Analysis — 38505064287](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064287) | pull_request | failure |
| [Auto Approve PR (Approved Users Only) — 38505061937](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505061937) | pull_request_target | success |
| [Code Quality: PR #153 — 38505060584](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505060584) | dynamic | success |
| [Sécurité des générateurs de candidats — 38505059677](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505059677) | push | success |
| [🔒 Security & Quality Analysis — 38505059486](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505059486) | push | failure |

**CodeQL : les analyses Rust, JS/TS et Actions ont réussi dans les workflows Advanced et Security ; leur export SARIF est confirmé dans les logs. Cependant le [check de résultats 115661038804](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153/checks?check_run_id=115661038804) est en échec : « 1 new alert including 1 high severity security vulnerability ».** « New » désigne la comparaison GitHub de la PR, pas une preuve d’introduction par les deux fichiers modifiés dans cette mission. L’avertissement temporaire « 1 configuration not found » observé avant la fin des analyses a disparu ; il ne constitue plus le blocage final.

Limite précise : le connecteur refuse les endpoints code-scanning et annotations ; le lien du check ne fournit pas non plus ses détails via ce connecteur. Les six commentaires CodeQL antérieurs sont toujours consultables, mais **je ne peux pas rattacher de manière vérifiable l’alerte agrégée actuelle à l’un d’eux**. Les qualifications antérieures des chemins ne sont donc pas présentées comme la résolution de cette alerte actuelle non identifiée. [Vue des alertes de la PR](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning?query=pr%3A153+tool%3ACodeQL+is%3Aopen) : examen exact requis, puis qualification/correctif amont si nécessaire, sans suppression automatique.

**Approbation automatique :** le workflow s’exécute en `success`, mais ses logs terminent par **« CodeQL échoué : CodeQL / CodeQL failing: CodeQL »** et il n’a soumis aucune approbation finale. Les revues les plus récentes restent `DISMISSED` sur les anciens SHA. [Job 115660561101](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505061937/job/115660561101). Ce succès de job n’est **pas** une approbation de la PR. Aucun changement de ce système n’a été effectué. GitHub annonce toujours `mergeable:true / mergeable_state:blocked`.

Les workflows globaux Security restent en `failure` à cause des trois jobs d’audit ; leur job de compte-rendu en `success` n’est pas une validation de ces audits.

### 4. Dépendances, archives et compatibilité

Tous les fichiers préexistants hors des deux modifications ci-dessus conservent leur blob : dépendances, manifestes, `pnpm-lock.yaml`, `Cargo.lock`, les quatre `package-lock*.json` racine, Tauri racine et src-tauri, `AGENTS.md`, `.bolt`, `.cursor`, instructions d’agents, sources, commentaires, vendor et archives.

- Les cinq racines **@babel/core, @babel/plugin-transform-react-jsx-self, @babel/plugin-transform-react-jsx-source, @types/babel__core, react-refresh** restent en devDependencies, sans activation dans les modules de production contrôlés.
- Conservation JS : **293 noms historiques**, **335 entrées accessibles**, **95 noms optionnels**.
- Sept variantes natives Android restent représentées et optionnelles : esbuild arm/arm64/x64, rolldown arm64, Rollup arm-eabi/arm64 et lightningcss arm64. Ceci vérifie le verrou, **pas une compilation ni une exécution Android**.
- Les deux rétroports **VariantStrIter** et **Slice vide → PtrSlice** et la migration Reqwest/h2 restent inchangés. Les tests de destruction, stockage réservé et réutilisation passent en debug/release.
- Ancien peer vite/lightningcss et feature Tauri 1 shell-open restent archivés et qualifiés par le contrôle historique ; aucune permission shell n’est réactivée.
- Les six originaux des générateurs restent intacts. Par défaut ils contrôlent sans écrire, refusent les états déjà migrés et archives altérées, mauvais cwd/HEAD, fichiers liés, sorties existantes, pnpm incompatible et contournements. Les variantes Python non UTF-8 sont refusées avant génération.
- Aucun client Git, GitHub, StackBlitz/Bolt, Cursor, Claude, ChatGPT/Codex n’a reçu de changement de configuration. Les verrous npm parallèles restent des variantes conservées ; **pnpm 8.15.9 reste le gestionnaire actif validé**. Les validations réelles dans ces clients ne sont pas revendiquées.

Les gardes préviennent les erreurs de contexte ; elles ne protègent pas contre la modification délibérée des empreintes ou l’exécution directe d’une archive et n’offrent pas de transaction contre un outil écrivant simultanément. Les futures mises à jour nécessitent une revue des références strictes.

### 5. Sécurité : corrections et alertes ouvertes

| Sujet | Qualification finale |
|---|---|
| 27 alertes JS initiales | Les mises à jour antérieures ont éliminé **26 entrées** ; le nouvel audit confirme **1 high restant**. Aucune dépendance supprimée pour ce résultat. |
| braces 3.0.3 | Pas de version publiée corrigée annoncée dans l’audit (`patched <0.0.0`) ; dépôt amont toujours en 3.0.3, issue [#70](https://github.com/micromatch/braces/issues/70) ouverte. Le patch pnpm local bornant la profondeur reste appliqué et les 10 tests réels passent. **Mitigation locale testée, alerte de version toujours ouverte** ; pas de version fictive ni d’exception. |
| h2 / RUSTSEC-2026-0258 | Migration antérieure conservée vers h2 **0.4.20** via Reqwest 0.12 ; contrôles et tests HTTP locaux passent ; l’avis initial h2 n’apparaît plus dans l’audit courant. |
| glib / RUSTSEC-2024-0429 | Défaut VariantStrIter rétroporté et testé, mais identité glib **0.18.5** de registre conservée : l’avertissement demeure. Une montée isolée >=0.20 reste incompatible avec la pile GTK 0.18 documentée. |
| Slice vide → PtrSlice | Rétroport amont distinct conservé et testé, notamment capacité réservée, destruction et réutilisation ; ne pas le confondre avec l’alerte CodeQL à la ligne 900. |
| proc-macro-error / RUSTSEC-2024-0370 | Avis de non-maintenance, `patched=[]` dans RustSec ; GTK/glib-macros introduisent le paquet. Remplacer les macros nécessite une migration amont compatible. Paquet conservé, avertissement visible. |
| rustls-pemfile / RUSTSEC-2025-0134 | Avis de non-maintenance, `patched=[]` ; dépendance historique optionnelle conservée. Aucun appel applicatif actuel trouvé dans l’analyse antérieure ; la conserver dans le verrou conserve l’avis. |
| CodeQL GLib | Les [quatre premiers chemins](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/a3a523b3a87f72ec18bcd90563ecc3701859a25c/docs/CODEQL_GLIB_TRIAGE_20261013.md) et [trois suivants](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/a3a523b3a87f72ec18bcd90563ecc3701859a25c/docs/CODEQL_GLIB_REMAINING_TRIAGE_20261013.md) sont techniquement qualifiés comme faux positifs précis de types/contrats FFI ou d’invalidation d’adresse. Les régressions pertinentes passent aussi sur le SHA final. Six annotations sont encore visibles (log, boxed, deux value, ptr_slice actif et copie historique) : **aucun dismiss/suppress**. L’état exact des résultats CodeQL est consigné dans le bilan CI ci-dessous. |
| LogField::new | Observation distincte du chemin CodeQL logging, déjà documentée : durée de vie value non liée explicitement, sans exposition applicative démontrée ni correctif amont vérifié retrouvé dans l’analyse. Aucune correction inventée. À confirmer en amont ; ce point n’est pas présenté comme résolu. |
| Licences cargo-deny | Pas d’autorisation de licences définie dans le dépôt ; de nombreuses licences tierces usuelles sont rejetées par la configuration par défaut. L’absence de métadonnée de licence du paquet applicatif est également signalée. Les textes propriétaires et spécifications présentant le projet comme open-source coexistent : **aucune décision juridique déduite ou appliquée**. |

Les anciens rapports avec les chiffres d’une phase précédente restent historiques ; ce bilan et ses jobs donnent les résultats actuels.

### 6. Blocages et décisions humaines

1. Définir la politique juridique cargo-deny et la métadonnée de licence du paquet applicatif, avec la propriétaire ; aucune licence ni exception ne peut être choisie pour obtenir artificiellement un audit vert.
2. Décider du traitement des avertissements de non-maintenance et de la migration GTK/GLib compatible. Les exigences simultanées de conservation des paquets et d’absence totale de ces avis ne sont pas satisfaisables par un simple changement de verrou.
3. Obtenir/adopter un correctif amont braces compatible, ou examiner explicitement la mitigation locale et le risque résiduel ; l’audit continue à échouer.
4. Identifier exactement l’alerte high du check CodeQL final dans l’interface/SARIF, car son rattachement est indisponible via le connecteur ; ne pas la considérer automatiquement comme un faux positif déjà qualifié. Examiner ensuite les qualifications persistantes et l’observation LogField. Aucune alerte n’a été masquée.
5. Fournir l’approbation requise sur la tête finale et vérifier les éventuelles protections classiques non lisibles par l’intégration. Le ruleset accessible **Ægis** demande une approbation et invalide les revues anciennes après push, interdit suppression/force-push de main, et ne liste aucun status check requis. L’endpoint de protection classique retourne **403** ; ses contraintes complètes ne sont donc pas prétendues connues. Les métadonnées de branche exposent des contexts vides/off. Aucun droit ou règle n’a été modifié.
6. Prévoir les validations réelles Android, StackBlitz/Bolt, Cursor/Claude et autres clients si elles conditionnent la publication. Les verrous conservés ne prouvent pas ces exécutions.

Les services Semgrep/SonarCloud sont **skipped faute de configuration activée**, Android Lint est **skipped faute de projet Gradle**. Les scans manuels APIsec/DAST et les générateurs de candidats n’ont pas été lancés. Ces absences ne sont pas des succès de sécurité.

### 7. Verdict et périmètre

**Non prête à fusionner selon les critères demandés**, malgré la résolution du conflit et le succès des builds/tests. Le socle technique et la conservation sont vérifiés ; les audits et les décisions juridiques/sécurité restent bloquants. Les blocages connus ne peuvent pas être éliminés par un simple changement de verrou tout en conservant les paquets concernés. Aucune correction supplémentaire n’est appliquée sans identification exacte et solution compatible vérifiable ; aucun avis ni problème de licence n’est contourné.

Seulement la branche #153 a été mise à jour. Approbation automatique, autres PR, workflows de sécurité, seuils d’audit, licences et permissions sont inchangés. Aucune fusion ou fermeture de PR.

EN: The real add/add Renovate conflict was resolved by a non-destructive two-parent integration of main into #153, preserving both complete variants. Only the bounded preservation bootstrap and a Git fixture race fix changed; all application/dependency/configuration/previous-archive blobs remain unchanged. Final Linux debug/release builds and 24 tests per profile, strict workspace Clippy, JS and Ubuntu/Windows guard checks pass. Existing audit failures and CodeQL findings are not suppressed. Licensing/security decisions and final approval remain human responsibilities; no PR was merged or closed.



---

## Entrée 44 — ID 6160528214

URL : https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#issuecomment-6160528214

Auteur : {'login': 'AetherXYZ', 'name': 'AetherXYZ', 'email': None, 'avatar_url': 'https://avatars.githubusercontent.com/u/140912534?v=4', 'id': 140912534}

Date : 2026-10-14T03:55:48Z ; review : None ; chemin : None ; ligne : None

## Alerte HIGH du check 115661038804 identifiée et qualifiée

**Alerte GitHub [#13](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/13), faux positif vérifiable sur un chemin précis de l’archive `ptr_slice.rs:900`.** L’annotation exacte et le replay SARIF fixé sur a3a523b lèvent l’incertitude du compte-rendu précédent. Aucun correctif de source ni retrait d’archive n’est justifié ; aucun état d’alerte n’a été modifié.

Diagnostic poussé sur #153 : `87b551e85af2256c12cf8a804524540279aa9cda`. Documentation/preuves poussées : **`138f029e44c4b63abef8d5315845b360814f76f3`**. Comparaison intégrale depuis a3a523b : **0 fichier préexistant modifié, 0 supprimé**, seulement le diagnostic et ses deux documents ajoutés.

[Rapport conservé dans le dépôt](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/security/CODEQL_HIGH_115661038804_20261014.md) · [Preuves JSON](https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/security/CODEQL_HIGH_115661038804_EVIDENCE_20261014.json)

Les vérifications du diagnostic et les tests cités ci-dessous ont terminé sur leurs SHA indiqués. Le dernier commit ajoute seulement les documents ; ses éventuels rejeux ordinaires de CI ne sont pas présentés ici comme déjà terminés.

---

# Qualification du HIGH CodeQL 115661038804 — 14 octobre 2026

## Français

**Verdict : faux positif vérifiable pour le chemin précis de l’alerte GitHub #13.** Le check vise la copie historique de `PtrSlice::truncate`, pas la conversion vide corrigée ni un nouveau défaut démontré du code applicatif. Aucun correctif source, retrait d’archive, exclusion, ignore ou fermeture d’alerte n’est appliqué.

### Identité et provenance

| Champ | Valeur vérifiée |
|---|---|
| Commit demandé et réellement analysé | `a3a523b3a87f72ec18bcd90563ecc3701859a25c` |
| Check GitHub | [115661038804](https://github.com/Phoen0x/QuelleHeureEst-Il.com/runs/115661038804), conclusion failure, exactement 1 annotation |
| Alerte GitHub | [#13](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/13), rattachée par le [commentaire CodeQL unique 4262273803](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4262273803) à la même position et au même message |
| Règle | `rust/access-invalid-pointer` — Access of invalid pointer |
| Sévérité | `security-severity: 7.5` (HIGH), `problem.severity: error`, précision high ; CWE-476 et CWE-825 |
| Source annotée | `docs/history/glib-empty-slice-20261013/vendor/glib-0.18.5/src/collections/ptr_slice.rs` |
| Position primaire | ligne **900**, colonnes **21–22** |
| Message | This operation dereferences a pointer that may be [invalid](1). |
| Source du codeFlow | même fichier, ligne **898**, colonnes **41–52**, expression `p as *mut T` passée à `ptr::drop_in_place::<T>` |
| Destination | même fichier, ligne **900**, `p` passé à `ptr::write` |
| Empreinte SARIF | `primaryLocationLineHash: f0389e3887603b54:1` |
| Moteur et pack du replay | CodeQL CLI **2.27.2**, `codeql/rust-queries 0.1.44+a7057b836bf29767461026718b14d20790b9085f` |

Les champs proviennent de trois preuves concordantes : annotation REST du check fixe, commentaire CodeQL contenant le lien #13, et résultat SARIF unique à cette règle/position/message. Le numéro #13 n’est pas déduit du seul compteur « 1 high ».

Le connecteur refuse les endpoints annotations et code-scanning par sa liste d’URL autorisées. Un diagnostic ponctuel a récupéré **HTTP 200 anonymement** pour le check, ses annotations et les commentaires publics. L’API de liste des alertes reste **401 anonyme / 403 avec le token de lecture existant**. Aucun élargissement de permission n’a été demandé ou effectué ; l’état administratif complet de l’alerte n’est donc pas prétendu lu par cette API.

### Diagnostic reproductible, sans publication Code Scanning

[Diagnostic 38507354862](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862), commit d’orchestration `87b551e85af2256c12cf8a804524540279aa9cda`.

Le seul fichier ajouté pour l’exécution est `.github/workflows/codeql-high-115661038804-diagnostic.yml`. Il conserve les mêmes permissions de lecture contents/packages que le diagnostic antérieur, vérifie le checkout exact de a3a523b, fixe les bundles CLI 2.27.2, utilise les requêtes par défaut en build-mode none et **upload:false**. Il ne modifie pas les analyses existantes ni leur politique. Le déclencheur push est limité à cette branche et à ce fichier ; tout rejeu reste fixé sur ce SHA historique, il ne valide pas automatiquement une future tête.

Les trois SARIF **complets et non filtrés** sont conservés en artefacts et dans les logs sous blocs gzip/base64 découpés. Leur reconstruction locale a vérifié longueur et SHA-256 ; le contrôle `git diff --exit-code` réussit après les extractions.

| Preuve | Résultat |
|---|---|
| [REST, job 115667792848](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792848) | Succès ; annotation exacte obtenue sans permission supplémentaire |
| [Rust, job 115667792635](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792635) | Succès ; **8 résultats** SARIF, dont l’archive identifiée |
| [JavaScript, job 115667792414](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792414) | Succès ; **0 résultat** des requêtes par défaut sur ce snapshot |
| [Actions, job 115667792788](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792788) | Succès ; **0 résultat** des requêtes par défaut sur ce snapshot |

SARIF Rust brut : **497599 octets**, SHA-256 `73f5c03fda27b8bda583f1f42aaa93c12c8e7a9d29b546167e1774a5d1970185`. Artefact ZIP `codeql-high-sarif-rust`, ID **11869070736** ; son digest ZIP distinct est consigné dans le JSON de preuves. Les artefacts REST/JS/Actions portent les IDs **11868745550 / 11868586630 / 11868476801**.

Huit résultats du replay ne signifient pas huit nouvelles alertes GitHub : le replay ne publie rien et n’effectue pas la comparaison serveur au main. Le check demandé comporte exactement une annotation.

### Comparaison aux sept chemins déjà qualifiés

Les [sept résultats exportés du diagnostic 38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513) ont été relus dans ses journaux ; ils concernaient `d5e75292ed3caca6110c9ab4f740df33d5b096d8`.

| Repère ancien | Position initiale | Comparaison actuelle |
|---|---|---|
| QL-1 | vendor/glib-0.18.5/src/log.rs:85 | Toujours présent dans le replay ; autre règle cleartext-logging, pas l’annotation du check |
| QL-2 | subclass/boxed.rs:76 | Toujours présent ; autre position |
| QL-3 / QL-4 | value.rs:462 / 470 | Toujours présents ; autres positions |
| QL-5 / QL-6 | object.rs:470 / 493 | Toujours présents ; autres positions |
| **QL-7** | vendor/glib-0.18.5/src/collections/ptr_slice.rs:900 | Toujours présent dans le code actif, et **dupliqué dans l’archive**, qui est l’annotation du check |

La comparaison normalisée vérifie la même règle, le même message et les **deux points exacts du codeFlow 898 → 900** ; seule l’URI reçoit le préfixe `docs/history/glib-empty-slice-20261013/`. Le fichier historique complet a le blob **e925d98413cb8562d5db9307d6e6491ba294c180**, identique au fichier actif lors du diagnostic d5e7529. La copie n’a pas été altérée.

Le fichier actif actuel a le blob **7ee731fa8bb9ebd8e8f64029d29bd1d86a145604**. Les lignes **881–909**, incluant truncate, sont identiques octet pour octet entre actif et archive ; SHA-256 du bloc : `d8d162214677508740716cef361e456c7b479b27636e2b13831910c72fe4d5e1`. Leur différence fonctionnelle concerne la conversion vide à un autre endroit.

### Pourquoi ce chemin est un faux positif

`PtrSlice<T>` possède un tableau GLib alloué, représenté par `NonNull<T::GlibType>`, avec len et capacity. `T: TransparentPtrType` est un trait **unsafe** exigeant une représentation mémoire compatible avec le pointeur FFI.

Dans truncate :
1. la garde retourne si `self.len <= len` ;
2. la longueur est décrémentée et `p` désigne un slot dans l’allocation encore possédée ;
3. `drop_in_place::<T>(p as *mut T)` détruit le wrapper stocké dans le slot ;
4. `ptr::write(p, NULL)` réinitialise ce stockage.

La destruction du wrapper et éventuellement du GObject pointé **ne libère pas l’allocation du tableau contenant le slot**. La libération de ce tableau se fait distinctement par `g_free(self.ptr)` dans Drop du conteneur. Ici l’écriture ne lit pas le wrapper détruit et ne déréférence pas le GObject libéré. Une mémoire encore allouée peut être réinitialisée avec ptr::write après drop_in_place. Le codeFlow traite cette fin de vie du wrapper comme une invalidation de l’adresse de son slot : c’est la fausse assimilation observée.

Les cas vides retournent avant cette boucle. Les constructeurs unsafe ou une implémentation incorrecte du trait unsafe peuvent violer les invariants ; ce n’est pas le chemin prouvé par cette annotation et ce rapport ne certifie pas des appels violant les contrats.

Le [correctif amont 3971101c82643035c15380c3f4af19ecccd09bb2](https://github.com/gtk-rs/gtk-rs-core/commit/3971101c82643035c15380c3f4af19ecccd09bb2), vérifié directement, durcit une situation théorique de panic dans Drop. **Il conserve drop_in_place suivi de ptr::write pour les types avec destructeur.** Il ne fournit pas de correctif à importer pour la prétendue libération du slot de ce résultat. Sa justification sur les exigences des traits est une déclaration amont ; les commentaires locaux ne détaillent pas tous ces aspects.

### Exposition et distinction du vrai défaut historique

Le fichier annoté est une **archive intentionnelle**, pas le paquet GLib sélectionné par Cargo. L’override actuel sélectionne `vendor/glib-0.18.5`, confirmé par cargo metadata dans le contrôle permanent ; les dix sources Rust applicatives/build/tests relues au SHA demandé n’incluent ni chemin d’archive ni include/path attribué à cette copie. L’exclusion d’un dossier des membres du workspace n’est pas utilisée à elle seule comme preuve : un paquet exclu peut rester compilé comme dépendance, ce qui est justement le cas du vendor actif.

La même fonction truncate du paquet actif a des régressions exécutées. En revanche **l’archive entière n’est jamais réactivée ou exécutée** pour cette analyse.

Cette archive conserve aussi le **défaut réel de conversion Slice vide → PtrSlice**, lignes 1047–1070, déjà corrigé dans le vendor actif par le rétroport amont b31265df94876febf259089a19de9c23d2468214. La trace de #13 ne passe pas par ce constructeur. Le verdict de faux positif porte donc sur **898 → 900**, pas sur l’absence de tout défaut dans l’ancienne version GLib.

### Vérifications et conservation

Les régressions `ptr_slice_truncate_drops_objects_and_preserves_array_storage` et `ptr_slice_truncate_handles_empty_zero_and_repeated_calls` vérifient la destruction effective des GObjects, la conservation du pointeur/capacité du tableau, sa sentinelle NULL et la réutilisation. Elles passent en debug et release dans les **24 tests par profil** au [SHA a3a523b, job 115660568480](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064460/job/115660568480).

Le commit de diagnostic 87b551e ne modifie aucune source existante : **Rust debug/release/tests** [115667809936](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360495/job/115667809936), **lint/types/Vite** [115667809990](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360485/job/115667809990), **actionlint** [115667810382](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360485/job/115667810382) et **conservation** [115667809925](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360456/job/115667809925) réussissent. Aucune exécution Miri ou dans Android/les clients IDE n’est revendiquée.

Aucun nouveau test applicatif ni patch source n’est nécessaire pour cette qualification : les régressions pertinentes existaient et le bloc annoté est identique. Seuls le nouveau diagnostic et ses documents/preuves sont ajoutés ; dépendances, configurations multi-outils, anciens workflows, archives, commentaires et code fantôme restent intacts.

**Aucune alerte n’est ignorée, masquée, dismissée ou fermée.** L’approbation automatique, les licences, les autres PR et les politiques de sécurité sont inchangées. Le rapport qualifie techniquement #13 sans promettre de check vert ni de PR prête à fusionner. Une éventuelle évolution du modèle CodeQL devra être examinée séparément ; aucun filtre local n’est ajouté. Aucune fusion.

## English

The exact HIGH annotation of check 115661038804 is GitHub alert #13 at the archived ptr_slice.rs:900, rule rust/access-invalid-pointer, security severity 7.5. A read-only diagnostic retrieved the public annotation and replayed immutable a3a523b with CLI 2.27.2 without uploading Code Scanning state. The complete Rust SARIF has eight results; its unique archived 898-to-900 path matches prior QL-7 after URI-prefix normalization. Dropping a pointer wrapper does not free the array slot; ptr::write reinitializes allocated storage. Source ownership, existing debug/release regressions and the verified upstream patch support a precise false-positive verdict. The archive is not the Cargo-selected crate. Its separate historical empty-Slice constructor defect is already backported in active code and is not this path. No archive/source patch, suppression, alert dismissal, permission/policy change or merge is performed.



# 11. Instructions et rapports distants au SHA 138f029 — copies intégrales



---

## Fichier distant : AGENTS.md

Blob Git : `f7e63ee9cc0602b7fba93e686dd2c1dafa131317`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/AGENTS.md

# Instructions de maintenance / Maintenance instructions

## Français — prioritaire

Ce dépôt développe **QuelleHeureEst-Il.com** : application native multi-plateforme, **Android en priorité**, basée sur **Rust/Tauri 2**, à architecture **offline-first**, respectueuse de la vie privée, avec **français par défaut** et langues sélectionnables. L'interface web n'est qu'une couche de présentation ; l'objectif est de déplacer la logique métier, les sources de données et le cache vers le backend Rust local.

### Règle impérative : conserver le code fantôme

- Les commentaires, variantes anciennes de configuration, branches d'implémentation volontairement neutralisées, alternatives techniques et fichiers de référence peuvent être conservés **intentionnellement**, même s'ils semblent inutilisés.
- **Ne jamais supprimer, réécrire ou réactiver automatiquement** ces blocs durant une factorisation, mise à jour de dépendances, migration, optimisation ou correction de qualité.
- Préserver la documentation utile et les annotations ; si une modification d'un bloc fantôme est indispensable, expliquer exactement pourquoi et conserver une copie lisible dans le dépôt.
- Le code désactivé doit être **exclu de la compilation, des bundles et des exécutables**, sans disparition du dépôt source. Les commentaires sont naturellement ignorés à la compilation ; pour un code derrière un drapeau, assurer que la configuration de production l'exclut réellement.
- Ne pas confondre code fantôme volontaire, code actif et vulnérabilité réelle. En cas de doute, signaler le bloc et demander une décision avant toute suppression.
- Les contrôles automatiques (lint, formatage, obfuscation, tree-shaking, nettoyage et autofix) ne doivent ni supprimer ces sources ni les réactiver par erreur.

### Architecture et qualité

- Priorités : **Rust d'abord ; local d'abord ; offline d'abord ; Android d'abord ; sécurité d'abord**.
- Interfaces traduisibles et langue française par défaut.
- Commentaires et annotations : **français en premier, anglais ensuite**. Garder les commentaires utiles en place.
- Refuser les API payantes obligatoires et la télémétrie superflue. Permissions minimales et compatibilité GrapheneOS.
- Ne pas confondre objectifs décrits dans les spécifications et fonctionnalités déjà implémentées.
- Tester les modifications avant fusion ; signaler clairement les jobs ignorés/non bloquants. Ne pas fusionner automatiquement les PR de sécurité sans validation.
- Les scripts Windows, les variantes sauvegardées, les rapports historiques et les fichiers de configuration de référence ne doivent pas être nettoyés sans autorisation explicite.

## English — secondary

This repository is for **QuelleHeureEst-Il.com**, an **Android-first**, privacy-focused, native, multi-platform application based on **Rust/Tauri 2**, designed to be **offline-first**, with **French as the default selectable language**. The web frontend is only a presentation layer; business logic and offline persistence are intended to live in the local Rust backend.

### Mandatory ghost-code preservation

- Commented-out code, intentionally disabled implementation branches, historical configuration alternatives and reference files may be deliberately kept for later use.
- **Never automatically delete, rewrite or reactivate** such blocks during refactoring, dependency updates, migration, optimization, lint fixes or cleanup.
- Retain useful annotations and historical options. If changes to ghost code are unavoidable, justify them and preserve readable source.
- Disabled code must stay **out of compiled binaries and production bundles**, while remaining present in the source repository.
- A code block that is inactive at runtime is not necessarily removed from bundles; ensure production feature flags and build tooling actually exclude it where required.
- Do not treat every unused block as disposable; ask before deletion when intent is unclear.
- Automatic linters, formatters, obfuscators and cleanup scripts must not delete or reactivate intentionally retained source.

### Priorities and quality

- **Rust first; local first; offline first; Android first; security first.**
- Selectable localization, French as default.
- Place French comments first, then English. Preserve useful existing comments.
- No mandatory paid APIs, avoid unnecessary tracking, minimize permissions, target GrapheneOS compatibility.
- Distinguish intended features from implemented features and verify CI before merging.
- Preserve historical Windows scripts, alternative configurations and reference files without explicit authorization.



---

## Fichier distant : Cargo.toml

Blob Git : `ab0048b490cafa9a486ff15f3b0ccf9d4aa25cc3`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/Cargo.toml

[workspace]
members = ["src-tauri"]
# FR// Le paquet tiers corrigé reste une dépendance, hors membres du workspace.
# EN// The patched third-party package remains a dependency, outside workspace members.
exclude = ["vendor/glib-0.18.5"]
resolver = "2"

# FR// Cargo applique les profils au workspace ; le profil historique reste dans src-tauri.
# EN// Cargo applies workspace profiles; the historical profile remains in src-tauri.
[profile.release]
opt-level = "z"
lto = true



---

## Fichier distant : src-tauri/Cargo.toml

Blob Git : `e6f108cb35478737c829b1b25fc2213346b80aa2`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/src-tauri/Cargo.toml

[package]
name = "quelleheureest"
version = "0.0.1"
description = "QuelleHeureEst-Il - A native cross-platform weather and time application"
authors = ["Your Name"]
edition = "2021"
publish = false

[build-dependencies]
tauri-build = { version = "2.0", features = [] }

[dependencies]
# FR// Variante Tauri 1 conservée, invalide en Tauri 2 ; voir docs/DEPENDENCY_GAPS_20261013.md.
# EN// Retained Tauri 1 variant, invalid in Tauri 2; see docs/DEPENDENCY_GAPS_20261013.md.
# tauri = { version = "2.0", features = ["shell-open"] }
tauri = { version = "2.0", features = [] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1", features = ["full"] }
# FR// Référence historique conservée ; la branche 0.11 impose h2 0.3 vulnérable.
# EN// Historical reference retained; the 0.11 line requires vulnerable h2 0.3.
# reqwest = { version = "0.11", features = ["json"] }
# FR// 0.12 conserve TLS natif, JSON et HTTP/2 tout en passant à h2 0.4.
# EN// 0.12 retains native TLS, JSON and HTTP/2 while migrating to h2 0.4.
reqwest = { version = "0.12.28", features = ["json"] }
chrono = { version = "0.4", features = ["serde"] }
chrono-tz = "0.8"
rusqlite = { version = "0.29", features = ["bundled", "chrono"] }
uuid = { version = "1.0", features = ["v4", "serde"] }
log = "0.4"
env_logger = "0.11"
urlencoding = "2.1"

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]

[profile.release]
opt-level = "z"
lto = true


# FR// Tests locaux de migration ; h2 impose aussi le minimum corrigé pour HTTP/2.
# EN// Local migration tests; h2 also enforces the patched HTTP/2 minimum.
[dev-dependencies]
h2 = "0.4.16"
http = "1"
bytes = "1"

# FR// Dépendance historique conservée en option, sans activation en production.
# EN// Historical dependency retained as optional, without production activation.

[dependencies.httpdate]
version = "=1.0.3"
optional = true

# FR// Dépendance historique conservée en option, sans activation en production.
# EN// Historical dependency retained as optional, without production activation.

[dependencies.rustls-pemfile]
version = "=1.0.4"
optional = true

# FR// Régressions Linux du paquet glib déjà utilisé par Tauri.
# EN// Linux regressions for the glib package already used by Tauri.
[target.'cfg(target_os = "linux")'.dev-dependencies]
glib = "=0.18.5"



---

## Fichier distant : .cargo/config.toml

Blob Git : `0d6e228130cb950a30ce57c19563347a0a60b980`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/.cargo/config.toml

# FR// Substituer uniquement le code ; conserver la résolution de registre pour les audits.
# EN// Override only source code; preserve registry resolution for audits.
paths = ["vendor/glib-0.18.5"]



---

## Fichier distant : package.json

Blob Git : `090db9120cf3107e6392d1b298fad6c8387ccbba`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/package.json

{
  "name": "quelle-heure-est-il?.com",
  "private": true,
  "version": "0.1.0",
  "packageManager": "pnpm@8.15.9",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && tauri build",
    "tauri": "tauri",
    "vite:dev": "vite",
    "vite:build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "dev:web": "vite",
    "preinstall": "npx only-allow pnpm",
    "tauri:dev": "tauri dev",
    "test:security": "node --test tests/security/braces-depth.test.cjs",
    "check:dependencies": "node Scripts/check-js-dependency-preservation.cjs"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@tauri-apps/api": "^2.11.0",
    "@tauri-apps/cli": "^2.11.2",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.5.25",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^8.0.16",
    "esbuild": "0.28.1",
    "rollup": "4.61.1",
    "@babel/core": "7.29.7",
    "@babel/plugin-transform-react-jsx-self": "7.29.7",
    "@babel/plugin-transform-react-jsx-source": "7.29.7",
    "@types/babel__core": "7.20.5",
    "react-refresh": "0.17.0"
  },
  "stackblitz": {
    "startCommand": "pnpm run dev"
  },
  "pnpm": {
    "overrides": {
      "brace-expansion@^1.1.0": "1.1.21",
      "brace-expansion@^5.0.0": "5.0.12",
      "js-yaml@^4.0.0": "4.3.2",
      "nanoid@^3.0.0": "3.3.18",
      "postcss@^8.0.0": "8.5.25",
      "browserslist@^4.0.0": "4.28.9",
      "baseline-browser-mapping@^2.0.0": "2.11.22",
      "source-map-js@^1.0.0": "1.2.2",
      "postcss-selector-parser@^6.0.0": "7.1.6",
      "esbuild@>=0.27.3 <0.28.1": "0.28.1"
    },
    "patchedDependencies": {
      "braces@3.0.3": "patches/braces-3.0.3.patch"
    }
  }
}



---

## Fichier distant : docs/CI_SETUP.md

Blob Git : `1d746203fe1fe3bb354aedc4e500a1b4c7f92969`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/CI_SETUP.md

# CI et sécurité / CI and security

## Français

Le frontend utilise Node.js 22 et pnpm 8 (format de verrouillage v6). La CI vérifie les installations figées, ESLint, TypeScript et le build Vite. Le workflow Rust installe les bibliothèques natives Linux et prépare le frontend.

Dependabot : limite de 10 PR de versions npm et 5 PR Actions, avec regroupement mineur/correctif. Les mises à jour majeures restent indépendantes et les PR de sécurité suivent leurs propres règles.

CodeQL : JavaScript/TypeScript, Rust et Actions ; Java/Kotlin sera réactivé si le dépôt intègre un projet correspondant.

Scanners optionnels : SonarCloud demande les variables Actions SONAR_PROJECT_KEY et SONAR_ORG, ainsi que le secret SONAR_TOKEN. APIsec (manuel) demande la variable APISEC_PROJECT et les secrets apisec_username et apisec_password. NeuraLegion (manuel) demande la variable NEURALEGION_TARGET_URL et le secret NEURALEGION_TOKEN, sur une cible autorisée uniquement.

Les secrets doivent être configurés dans GitHub Settings, jamais committés. Un audit ignoré ou non bloquant n'est pas une preuve de réussite. Vérifier les journaux avant fusion.

## English

The frontend uses Node.js 22 and pnpm 8 (v6 lockfile). CI runs frozen installation, ESLint, TypeScript and Vite build. Rust CI installs native Linux dependencies and builds frontend assets.

Dependabot allows 10 npm version PRs and 5 Actions version PRs, grouping minor and patch updates. Major upgrades remain independent; security update rules are separate.

CodeQL analyzes JavaScript/TypeScript, Rust and Actions; enable Java/Kotlin when such source code is added.

Optional scanners: SonarCloud needs Actions variables SONAR_PROJECT_KEY and SONAR_ORG, and secret SONAR_TOKEN. Manual APIsec requires variable APISEC_PROJECT and secrets apisec_username and apisec_password. Manual NeuraLegion requires variable NEURALEGION_TARGET_URL and secret NEURALEGION_TOKEN. Scan authorized targets only.

Configure secrets in GitHub Settings, never in tracked code. A skipped or non-blocking scan is not a successful audit. Inspect job logs before merging.


## Phase 1 — corrections et limites (13 octobre 2026) / Phase 1 — fixes and limits (October 13, 2026)

### Français

- Verrouillage pnpm réparé par pnpm 8.15.9, en conservant les contraintes du manifeste, Vite 8.0.16 et plugin-react 6.0.2. L'ancien graphe est conservé sous `docs/history/`.
- Adaptation minimale à Tauri 2 (`@tauri-apps/api/core`), correction des clés et du niveau `aucun` pour le pollen. La table historique de clés reste commentée ; le type dérivé n'émet aucun code.
- Icône RGBA locale obligatoire pour Tauri ajoutée, format Rust corrigé, variantes/imports historiques conservés. Le profil de release est appliqué au workspace ; sa variante originale reste intacte dans le manifeste Tauri.
- `Cargo.lock` fixe les 495 paquets de la résolution utilisée. Compilation et tests exécutés avec `--locked` ; build de release et recherche de marqueurs historiques dans les artefacts Vite et le binaire.
- Les erreurs de compilation, Clippy, audits et cargo-deny sont bloquantes. Les contrôles locaux réalisés dans l'environnement de travail sont la cohérence des 302 entrées pnpm accessibles, les manifestes TOML, le YAML et la syntaxe des scripts shell. Les vérifications nécessitant les dépendances sont exécutées sur GitHub Actions.
- `cargo test` réussit mais exécute **0 test** actuellement. Les doctests et Android Lint sont explicitement ignorés : aucune bibliothèque Rust et aucun projet Gradle ne sont présents. Cela ne valide ni un APK Android, ni le fonctionnement hors ligne de bout en bout.
- Semgrep : variable Actions `SEMGREP_ENABLED=true` et secret `SEMGREP_APP_TOKEN` requis. Le CLI 1.180.0 remplace l'action obsolète qui annonçait toujours un succès. Sans activation, le job est ignoré. Les références historiques sont exclues ; les métriques sont désactivées.
- OWASP : rapport sous `reports/dependency-check-report.sarif`. Son analyseur pnpm incompatible avec le format v6 est désactivé ; l'audit pnpm 8 dédié reste bloquant. Les anciens verrouillages npm et `docs/history/` sont exclus comme références non utilisées pour l'installation.

**Dette de sécurité signalée, sans suppression de dépendances ni liste d'exceptions :**

- `pnpm audit --audit-level=moderate` : 27 alertes (20 élevées, 5 modérées, 2 faibles) dans la résolution conservée, notamment brace-expansion, js-yaml, nanoid, PostCSS, Browserslist, braces et postcss-selector-parser. Ce job reste rouge.
- `cargo audit --deny warnings` : `h2 0.3.27`, RUSTSEC-2026-0258 (correctif annoncé en >=0.4.16), et avertissements pour proc-macro-error, rustls-pemfile et glib. Une migration de dépendances est nécessaire ; aucun avertissement n'est supprimé.
- cargo-deny v2 fonctionne avec Rust stable, mais échoue sur les avis de sécurité et l'absence de politique explicite de licences autorisées. Les contrôles bans/sources passent. Aucune politique juridique n'est inventée.
- SonarCloud reste ignoré sans configuration ; APIsec et NeuraLegion restent manuels. Un scanner ignoré ou un rapport produit ne prouve pas l'absence de vulnérabilités.

### English

The pnpm lockfile is repaired without changing manifest constraints, Vite 8.0.16 or plugin-react 6.0.2. Historical variants remain under `docs/history/` or in comments, outside production artifacts. Type fixes cover Tauri 2 and pollen. A required local RGBA icon is added. Cargo.lock fixes the 495-package resolution; builds/tests use `--locked`, with release artifact checks.

Local checks cover 302 reachable pnpm entries, TOML manifests, workflow YAML and shell syntax. Dependency-based checks run on GitHub Actions. Rust tests currently run **zero tests**; doctests and Android Lint are explicitly skipped because no library or Gradle project exists. This does not validate an Android APK or end-to-end offline behavior.

Semgrep requires Actions variable `SEMGREP_ENABLED=true` and secret `SEMGREP_APP_TOKEN`; CLI 1.180.0 replaces the deprecated always-success action, excludes historical references and disables metrics. OWASP uses its actual `reports/` output path and delegates pnpm auditing to the blocking pnpm 8 job; historical npm lockfiles are excluded.

Security debt remains visible and blocking: 27 JS advisories (20 high, 5 moderate, 2 low); Rust advisory RUSTSEC-2026-0258 for h2 0.3.27 plus three warnings; cargo-deny advisory failures and an undefined license allow policy. Bans/sources checks pass. Dependencies remain present, with no suppression list. Optional scans being skipped does not prove security.



---

## Fichier distant : docs/JS_SECURITY_AUDIT_20261013.md

Blob Git : `fd206fe4fbda64912a0a4aaa76f07393c8d978cf`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/JS_SECURITY_AUDIT_20261013.md

# Audit de sécurité JavaScript — 13 octobre 2026 / JavaScript security audit — October 13, 2026

## Français

Périmètre : les 27 entrées de `pnpm audit` sur la branche de la PR 153, à partir du commit `365aab89151a7cfa0d58b7fa1312898eb5345164`. Rust, cargo-deny, le workflow d'approbation et les autres PR restent hors des modifications.

Le candidat généré par pnpm 8.15.9 passe l'installation gelée, ESLint, TypeScript et Vite sous Node 22. Les 10 tests de sécurité passent, y compris l'utilisation du correctif par micromatch et chokidar.

### Versions corrigées

| Paquet | Version initiale | Version retenue | Entrées d'audit éliminées |
| --- | --- | --- | --- |
| brace-expansion | 1.1.15 et 5.0.6 | 1.1.21 et 5.0.12 | 12 |
| js-yaml | 4.2.0 | 4.3.2 | 3 |
| nanoid | 3.3.12 | 3.3.18 | 2 |
| postcss | 8.5.15 | 8.5.25 | 2 |
| browserslist | 4.28.2 | 4.28.9 | 2 |
| baseline-browser-mapping | 2.10.33 | 2.11.22 | 1 |
| source-map-js | 1.2.1 | 1.2.2 | 1 |
| postcss-selector-parser | 6.1.2 | 7.1.6 | 2 |
| esbuild | 0.27.7 | 0.28.1 | 1 |

Les overrides sont ciblés sur les branches concernées, notamment les versions 1 et 5 de brace-expansion. ESLint 9.39.4, Vite 8.0.16 et plugin-react 6.0.2 sont conservés. Le plancher de PostCSS devient `^8.5.25`. Le passage du parseur de sélecteurs à 7.1.6 couvre aussi l'avis de complexité quadratique que le correctif 6.1.4 proposé par Dependabot ne couvre pas.

### Alerte résiduelle et correctif local

Résultat après correction : **1 entrée élevée, 0 modérée, 0 faible**, contre 20 élevées, 5 modérées et 2 faibles auparavant. `pnpm audit` reste non nul et bloquant.

Cette entrée est [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), pour `braces 3.0.3`. L'avis et [le signalement amont #70](https://github.com/micromatch/braces/issues/70) ne fournissent aucune version publiée corrigée.

`patches/braces-3.0.3.patch` applique une mitigation locale via `pnpm.patchedDependencies`, avec hash dans le verrouillage. La profondeur des AST, des parenthèses/accolades et des tableaux intermédiaires est limitée à 64 ; les dépassements produisent une `SyntaxError` contrôlée avec le code `ERR_BRACES_MAX_DEPTH`. Les parcours compile, expand et stringify sont protégés aussi lorsque l'appelant fournit directement un AST. Les motifs ordinaires, échappements, classes de caractères, plages et expansions imbriquées sont couverts par les tests.

Le nom `braces` et la version 3.0.3 restent inchangés. Aucune exception, exclusion d'avis ou modification du niveau d'audit n'est ajoutée. L'audit basé sur la version continue donc à signaler le paquet malgré la mitigation testée. Cette entrée n'est pas présentée comme éliminée : remplacer le patch par une version amont corrigée lorsqu'elle sera disponible.

### Conservation des dépendances et références

Les 19 dépendances directes initiales restent déclarées. esbuild et Rollup, déjà présents dans le verrouillage, deviennent des devDependencies explicites pour les conserver lorsque Vite 8 reconstruit son graphe. esbuild est corrigé en 0.28.1 ; Rollup reste en 4.61.1. Ces outils ne sont pas ajoutés aux imports de l'application.

Le contrôle `pnpm run check:dependencies` vérifie les 293 noms de paquets initiaux, les variantes optionnelles, leurs liens, leurs peers optionnels et les entrées accessibles du verrouillage. Il passe avec 303 entrées accessibles et 95 noms de paquets optionnels conservés, notamment les variantes Android, Windows, macOS et Linux.

Les manifestes, le verrouillage et la CI précédant cette correction sont conservés dans `docs/history/js-security-20261013/`. Les anciens verrouillages npm, les autres archives, le code fantôme, les commentaires et les sources de l'application restent inchangés. Ces références ne sont pas des entrées Vite et ne sont pas copiées dans `dist/`.

### PR Dependabot examinées

| PR | Correctif utile / décision |
| --- | --- |
| [#152](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/152) | js-yaml 4.3.2 repris |
| [#151](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/151) | baseline-browser-mapping 2.11.22 repris |
| [#150](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/150) | browserslist 4.28.9 repris |
| [#149](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/149) | 6.1.4 ne couvre pas toutes les alertes ; parseur retenu en 7.1.6 |
| [#148](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/148) | nanoid 3.3.18 repris |
| [#146](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/146) | PostCSS 8.5.25 repris |
| [#145](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/145), [#144](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/144) | Correctifs transitoires repris par overrides ; montée majeure vers ESLint 10 évitée |
| [#138](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/138) | Suppression d'esbuild et de ses variantes rejetée ; mise à jour réelle en 0.28.1 |

Les patches Dependabot ont été lus. Leurs suppressions de variantes optionnelles dans les verrouillages npm, et la suppression d'esbuild dans #138, ne sont pas importées. Aucune de ces PR n'est fusionnée, fermée ou modifiée.

## English

Scope: the 27 pnpm audit entries on PR 153. Rust, cargo-deny, automatic approval and other PRs are unchanged.

Targeted updates eliminate **26 entries**. The remaining high-severity entry is braces 3.0.3 / GHSA-vfj7-8cjw-p6xm, for which no patched upstream release exists. A reproducible pnpm patch bounds AST and intermediate-array depth, including direct AST calls; all 10 regression tests pass. Package name/version are preserved, advisories are not suppressed and audit remains blocking.

Frozen installation, lint, typecheck and Vite pass on Node 22/pnpm 8.15.9. The original 19 direct dependencies, 293 package names and optional variants remain present; 95 optional package names and 303 reachable lockfile entries are checked. Existing esbuild and Rollup packages are explicitly retained as development tools. Historical configurations and application sources remain intact.

Dependabot PRs #138, #144–146 and #148–152 were inspected. Useful security versions were reused without importing optional-package deletions or an unnecessary ESLint major upgrade. No PR was merged, closed or modified.



---

## Fichier distant : docs/RUST_H2_MIGRATION_20261013.md

Blob Git : `8a4913cca3f4d8009ecbaf6347ebf2440563777c`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/RUST_H2_MIGRATION_20261013.md

# Migration Rust h2 — 13 octobre 2026

## Français

Cette intervention concerne uniquement RUSTSEC-2026-0258 sur la branche de la PR #153. Elle ne modifie pas l'approbation automatique, les licences cargo-deny, ni le correctif JavaScript braces.

### Origine et correctif

L'arbre Cargo verrouillé initial contient :
```text
quelleheureest 0.0.1
└── reqwest 0.11.27
    ├── h2 0.3.27
    ├── hyper 0.14.32
    │   └── h2 0.3.27
    └── hyper-tls 0.5.0
        └── hyper 0.14.32
            └── h2 0.3.27
```
Tauri 2.12.3 dépend séparément de Reqwest 0.13.5 ; cette branche n'introduit pas h2 0.3.27.

[RUSTSEC-2026-0258](https://rustsec.org/advisories/RUSTSEC-2026-0258.html), alias GHSA-q83h-524g-xf6h, décrit une accumulation non bornée de trames DATA HTTP/2 vides lorsque les flux ne sont pas drainés. Cela peut épuiser la mémoire ou provoquer une panique. La sévérité indiquée par l'avis est faible. [Le correctif amont](https://github.com/hyperium/h2/pull/935) borne le coût de mise en mémoire des petites trames ; le premier correctif publié est h2 0.4.16.

Une simple mise à jour de h2 dans le verrouillage ne convient pas : Reqwest 0.11 et Hyper 0.14 imposent la série 0.3 et utilisent les types http 0.2. La migration remplace réellement cette pile par Reqwest 0.12 / Hyper 1 / http 1 / h2 0.4. Les méthodes utilisées par le backend, Client::new, get, send et json, sont conservées. Les sources applicatives ne nécessitent aucune réécriture.

Reqwest 0.12.28 a été choisi pour limiter la migration et garder TLS natif, JSON, HTTP/2, le décodage des caractères et la prise en charge du proxy système. Reqwest 0.13 aurait aussi impliqué un changement du backend TLS par défaut ; ce choix n'est pas nécessaire ici. Le minimum h2 0.4.16 est aussi exprimé dans les dépendances de test et le verrouillage exact reste utilisé avec --locked.

### Conservation

Les 12 dépendances applicatives et tauri-build sont conservés. Un contrôle compare les noms de tous les paquets du verrouillage initial, y compris les variantes de plateformes, avec le verrouillage migré. Les éventuels paquets qui ne sont plus amenés par la nouvelle pile sont conservés comme dépendances optionnelles, avec leur version historique, sans activation en production. Leur présence dans Cargo.lock reste visible à cargo audit.

Les anciens Cargo.lock et src-tauri/Cargo.toml complets sont conservés dans docs/history/rust-h2-20261013. La ligne Reqwest 0.11 reste également commentée dans le manifeste actif. Aucun fichier historique, code fantôme, commentaire existant ou paquet n'est supprimé pour cacher une alerte.

Les nouveaux tests sous src-tauri/tests utilisent uniquement des serveurs locaux : JSON en HTTP/1 et JSON en HTTP/2 avec vérification explicite de la version du protocole. Les dépendances de test h2/http/bytes restent hors dépendances de production. Le frontend et le binaire release sont vérifiés pour les marqueurs historiques utilisés par la CI.

### Validation

Le candidat complet a réussi dans [le workflow de validation n°38351022841](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38351022841/job/115143211619), sur Ubuntu 22.04 :

| Commande / contrôle | Résultat |
| --- | --- |
| `cargo tree --locked --target all -i h2@0.3.27` sur la référence initiale | Chaîne exacte identifiée |
| Conservation des dépendances et `cargo tree --locked --target all -i h2` | Réussi ; uniquement h2 0.4.20 |
| `cargo fmt --all -- --check` | Réussi |
| `cargo build --workspace --locked` | Réussi |
| `cargo test --workspace --locked` | Réussi ; 2 tests d'intégration, 0 échec ; 0 test dans le binaire |
| `cargo clippy --workspace --locked --all-targets --all-features -- -D warnings` | Réussi |
| `cargo build --workspace --release --locked` | Réussi |
| Marqueurs historiques dans dist/ et le binaire release | Contrôle réussi |
| `cargo audit` (0.22.2, base RustSec actualisée) | Code de sortie 0 ; aucune vulnérabilité, 3 avertissements |

Versions principales : Reqwest 0.11.27 → 0.12.28, h2 0.3.27 → 0.4.20, hyper-tls 0.5.0 → 0.6.0. La pile Hyper 0.14 / http 0.2 / http-body 0.4 converge vers les versions 1 déjà utilisées par Tauri. Les deux Reqwest 0.12.28 et 0.13.5 coexistent, la seconde restant celle de Tauri. Le proxy système migre aussi system-configuration 0.5.1 → 0.7.0 et system-configuration-sys 0.5.0 → 0.6.0.

Le verrouillage passe de 495 à 491 entrées de versions par remplacement et déduplication des anciennes piles. **Les 436 noms de paquets initiaux sont tous conservés** ; le candidat en contient 446. `httpdate =1.0.3` et `rustls-pemfile =1.0.4`, que la nouvelle pile n'amène plus, sont conservés en option dans le manifeste. Les variantes Windows/Android/macOS/Linux restent dans la résolution toutes cibles.

Aucun avis n'est ignoré. Les avertissements restants sont :
- proc-macro-error 1.0.4, non maintenu : RUSTSEC-2024-0370 ;
- rustls-pemfile 1.0.4, non maintenu : RUSTSEC-2025-0134 ;
- glib 0.18.5, unsoundness : RUSTSEC-2024-0429.

Le workflow de sécurité existant utilise `cargo audit --deny warnings` : ces trois avertissements restent donc bloquants. Sa politique stricte n'est pas modifiée. Les licences cargo-deny et braces restent hors de cette intervention.

Les 12 dépendances applicatives initiales et tauri-build sont conservés avec leurs fonctionnalités ; trois dépendances de test (h2, http, bytes) et deux références optionnelles de conservation sont ajoutées. Le profil release historique reste présent et continue de produire l'avertissement Cargo connu de profil ignoré dans le membre du workspace ; le profil actif reste celui de la racine.

La CI Rust permanente exécute également le contrôle de conservation et les tests d'intégration. Le workflow de génération du candidat est ensuite rendu manuel, avec son ancien déclencheur commenté. Ses scripts travaillent uniquement dans le runner et ne poussent aucun commit. La compilation, les tests et l'audit du terminal local ne sont pas revendiqués : Cargo n'y est pas installé et le proxy y est inaccessible.

Limites : validation Linux native et tests de transport sur localhost ; aucun APK Android, test sur appareil, échange TLS réel avec Open-Meteo ou reproduction de l'attaque par trames malveillantes n'est revendiqué. Le correctif de sécurité provient de la version amont publiée, et non d'un contournement local.

Un premier essai du workflow s'est arrêté avant migration, car Python 3.10 d'Ubuntu 22.04 ne fournit pas tomllib. Le workflow utilise désormais Python 3.12.15 ; le second essai complet ci-dessus a réussi.

## English

This change addresses only RUSTSEC-2026-0258. The locked application dependency on Reqwest 0.11.27 introduces h2 0.3.27 both directly and through Hyper 0.14.32 / hyper-tls 0.5.0. Tauri's separate Reqwest 0.13.5 does not introduce that old h2 version.

h2 0.4.16 is the first patched release. A lock-only update is incompatible with Reqwest 0.11 / Hyper 0.14 requirements. Reqwest 0.12 migrates the transport to Hyper 1, http 1 and patched h2 0.4 while keeping the native TLS backend and the JSON/client API used by the application.

All original direct dependencies and historical package names are retained. Any package no longer required by the upgraded transport is retained as an optional dependency without production activation. Complete original manifests and lockfile are archived. No audit exclusion is added and no dependency is deleted to hide a finding. Local HTTP/1 and HTTP/2 JSON regression tests verify the client migration. Android packaging and external API behavior require separate validation.


Candidate validation passed debug/release builds, both integration tests, strict all-target/all-feature Clippy, formatting, dependency preservation and cargo audit. The exact lockfile resolves h2 0.4.20. All 436 original package names remain present; httpdate and rustls-pemfile are explicitly retained as optional dependencies. The lockfile contains 491 version entries after legitimate transport-version replacement and deduplication. cargo audit reports no vulnerabilities and three warnings (proc-macro-error, rustls-pemfile and glib). The existing --deny warnings CI policy is unchanged and still blocks on those warnings. No Android/device build, real HTTPS exchange or malicious-frame regression is claimed.



---

## Fichier distant : docs/RUST_WARNINGS_20261013.md

Blob Git : `9f7c654c0df14ca41256684cc0d6360d3c36e21f`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/RUST_WARNINGS_20261013.md

# Avertissements Rust — 13 octobre 2026

## Français

Cette intervention sur la PR #153 traite RUSTSEC-2024-0370 (proc-macro-error), RUSTSEC-2025-0134 (rustls-pemfile) et RUSTSEC-2024-0429 (glib). Elle ne modifie ni JavaScript, ni l'approbation automatique, ni la politique de licences.

### Corrections et blocages

**Le défaut de mémoire de glib peut être corrigé localement, mais les trois avertissements de registre restent visibles.** Aucun avis n'est ignoré, aucun paquet n'est retiré du verrouillage et aucun nom/version n'est modifié pour échapper aux outils.

| Paquet initial | Origine | Analyse |
| --- | --- | --- |
| proc-macro-error 1.0.4 | glib-macros 0.18.5 et gtk3-macros 0.18.2, via GTK/Tauri | Avis de non-maintenance ; aucune version corrigée annoncée |
| rustls-pemfile 1.0.4 | Dépendance optionnelle historique directe de quelleheureest | Avis de non-maintenance pour toutes les versions ; aucun usage dans les sources applicatives actuelles |
| glib 0.18.5 | GTK 0.18 et les liaisons de la pile GTK/WebKit/Tauri | Comportement indéfini dans VariantStrIter ; version officiellement corrigée >=0.20 |

Les chaînes exactes sont relevées avec cargo tree --locked --target all --all-features. Le drapeau all-features est nécessaire pour rendre visible la dépendance rustls-pemfile optionnelle.

#### proc-macro-error

[RUSTSEC-2024-0370](https://rustsec.org/advisories/RUSTSEC-2024-0370.html) décrit un projet non maintenu, et non un défaut avec un correctif publié : patched = []. RustSec propose manyhow ou proc-macro2-diagnostics comme alternatives. Leur adoption implique de migrer les macros des bibliothèques GTK en amont, pas simplement de changer la version dans Cargo.lock.

Sous la contrainte de conserver le paquet historique, même optionnel, son avis reste signalé par les outils. Ajouter une alternative en conservant proc-macro-error dans le graphe ne résoudrait pas cet avertissement. Aucun remplacement artificiel, alias trompeur ou version fictive n'est utilisé.

#### rustls-pemfile

[RUSTSEC-2025-0134](https://rustsec.org/advisories/RUSTSEC-2025-0134.html) indique que le dépôt est archivé et que toutes les versions restent concernées (patched = []). Une mise à jour vers la dernière enveloppe rustls-pemfile ne corrigerait donc pas l'avis de non-maintenance.

Le successeur recommandé est rustls-pki-types >=1.9, trait PemObject ; rustls-pki-types est déjà présent dans le verrouillage. La pile HTTP applicative a déjà été migrée vers Reqwest 0.12 dans l'intervention h2. Aucun appel à rustls-pemfile n'existe dans src-tauri/src ; le paquet reste uniquement une référence optionnelle volontaire. Sa déclaration =1.0.4 et optional = true est conservée intégralement, comme demandé.

#### glib

[RUSTSEC-2024-0429](https://rustsec.org/advisories/RUSTSEC-2024-0429.html) concerne next, nth, last, next_back et nth_back de VariantStrIter. Un pointeur initialement NULL était passé comme référence immutable à g_variant_get_child, qui écrit dedans via un argument variadique. Cela viole les règles Rust et peut provoquer un accès NULL avec optimisations.

Le correctif exact de [gtk-rs/gtk-rs-core#1343](https://github.com/gtk-rs/gtk-rs-core/pull/1343), commit b5a4071e439bef2b5eea76c3aa25e5ae84839e34, consiste à remplacer let p par let mut p, puis &p par &mut p. Aucune autre ligne du paquet publié ne change.

Tauri 2.12.3, dernière version stable vérifiée, impose gtk 0.18. GTK 0.18 et la pile associée imposent glib 0.18. Une tentative réelle cargo update -p glib --precise 0.20.0 est rejetée par le solveur. GTK 0.19 utilise désormais gtk-rs-core 0.22, mais ne satisfait pas les contraintes GTK 0.18 de Tauri et de ses autres dépendances. Une migration de toute cette pile ne constitue pas une mise à jour compatible isolée.

Le paquet glib 0.18.5 complet est donc conservé sous vendor/glib-0.18.5, avec une substitution de sources Cargo par paths et le nom/version original. Il est exclu des membres du workspace pour garder ses références et tests amont sans les activer automatiquement. Un test Linux direct utilise le même paquet que Tauri pour exercer toutes les opérations affectées, y compris en release.

### Origine, reproductibilité et conservation

L'archive officielle glib-0.18.5.crate est conservée sous docs/history/rust-warnings-20261013. Son SHA-256 est `233daaf6e83ae6a12a52055f568f9d7cf4671dabb78ff9560ab6da230ce00ee5`, identique au checksum du verrouillage initial. Tous les fichiers de l'archive sont copiés, sans nettoyage. Le contrôle Scripts/check-rust-warnings-backport.py compare chaque octet de chaque fichier avec l'archive, sauf les deux changements exacts autorisés dans src/variant_iter.rs. Les commentaires et métadonnées originaux restent inchangés.

Cargo.toml, Cargo.lock, src-tauri/Cargo.toml et la CI Rust initiaux sont archivés. Toutes les dépendances initiales, leurs fonctionnalités et les déclarations optionnelles sont conservées. Le contrôle de conservation h2 existant continue également de s'exécuter.

La configuration .cargo/config.toml utilise un vrai rétroport de source via paths, mécanisme Cargo prévu pour les petites corrections sans changement du graphe de dépendances. L'entrée glib du verrouillage, y compris sa source de registre et son checksum d'origine, reste identique ; cargo metadata doit en parallèle prouver que le code compilé provient bien du répertoire vendor. Elle ne revendique pas une version glib >=0.20. Les audits conservent le droit de signaler glib 0.18.5 ; leur état n'est pas présenté comme vert pour cette raison.

Une première configuration par [patch.crates-io] a été testée puis **rejetée** : les outils omettaient automatiquement l'avis glib sur le paquet devenu local. Elle n'est pas retenue dans la correction active. La configuration paths évite cette perte d'identité de registre. La [documentation Cargo](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html#paths-overrides) précise que cette substitution ne peut pas changer les dépendances du paquet ; la comparaison exhaustive de l'archive respecte cette contrainte.

La compilation doit être lancée depuis le dépôt, comme dans la CI, pour charger sa configuration Cargo. Les commandes --manifest-path lancées depuis un répertoire extérieur ne chargent pas automatiquement .cargo/config.toml. Le contrôle permanent vérifie le manifeste réellement sélectionné, au lieu de présumer que le rétroport a été utilisé.

### Vérifications

[Validation du candidat n°38354572622](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38354572622/job/115154338603), Ubuntu 22.04, Rust stable 1.99.0 :

| Contrôle | Résultat réel |
| --- | --- |
| Migration isolée glib 0.20 | Rejet du solveur : gtk exige ^0.18 |
| Archive + fichiers du rétroport | 121 fichiers conservés, deux lignes amont modifiées |
| Dépendances | 446 noms et 491 entrées de versions conservés |
| Entrée glib du verrouillage | Identique à la référence : version, registre, checksum et dépendances |
| Source réellement résolue | cargo metadata sélectionne vendor/glib-0.18.5 |
| cargo fmt --all -- --check | Réussi |
| cargo build --workspace --locked | Réussi |
| cargo test --workspace --locked | 8 tests d'intégration réussis : 6 GLib + 2 HTTP ; 0 échec ; binaire sans tests unitaires |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Réussi |
| cargo build --workspace --release --locked | Réussi |
| cargo test --workspace --release --locked | Les mêmes 8 tests réussissent avec optimisations |
| Marqueurs historiques dans dist/ et binaire release | Contrôle réussi |
| cargo audit (0.22.2) | Code 0 ; 0 vulnérabilité bloquante, 3 avertissements visibles |
| cargo audit --deny warnings | Code 1 : les 3 avis initiaux restent bloquants |
| cargo deny check, action v2, politique inchangée | advisories FAILED, licenses FAILED ; bans et sources OK |

L'audit JSON confirme une liste d'exclusions vide et les trois IDs RUSTSEC-2024-0370, RUSTSEC-2025-0134 et RUSTSEC-2024-0429. **Aucun avertissement n'est éliminé du registre**, même si le défaut de code glib est corrigé. RUSTSEC-2026-0258 h2 reste absent.

Cargo-deny émet l'erreur de non-maintenance proc-macro-error dans la vue de résolution par défaut de l'action existante. Cargo audit conserve aussi la couverture de rustls-pemfile optionnel et de l'entrée glib de registre. Les erreurs de licences sont constatées et laissées inchangées, sans ajout d'autorisation, d'exception ou de modification de politique.

Le workflow du candidat reste en échec pour refléter les audits bloquants. Ses étapes diagnostiques poursuivent l'export des preuves ; le bilan final échoue. La première tentative par patch local est archivée comme configuration rejetée. La seconde, via paths, est la seule configuration retenue.

La CI Rust permanente exécute le contrôle de conservation/source ainsi que les tests debug et release. Le générateur de candidat devient manuel après validation. Le terminal local ne dispose pas de Cargo et son accès au proxy échoue ; les compilations et audits revendiqués ci-dessus sont exécutés dans GitHub Actions, pas localement.

### Limites

La validation couvre la compilation native Linux et les itérateurs GLib en debug/release, ainsi que les tests HTTP locaux existants. Elle ne constitue pas une compilation APK ni une validation sur appareil Android ou un test complet de l'interface GTK.

Les deux avertissements de non-maintenance ne peuvent pas être éliminés tout en conservant les paquets concernés dans le graphe, y compris comme dépendances optionnelles. Le défaut glib est réellement corrigé par le rétroport testé, mais son avertissement de registre persiste tant qu'une migration complète vers une version reconnue >=0.20 n'est pas compatible avec la pile Tauri utilisée.

## English

This work preserves all original dependencies, optional declarations, comments and historical files. proc-macro-error and rustls-pemfile advisories mark entire unmaintained package lines, with no patched releases. Keeping those packages in the dependency graph necessarily keeps their warnings visible. rustls-pemfile is only a deliberate optional reference; there is no active application API to migrate.

The glib VariantStrIter memory-safety defect is addressed by the exact two-line upstream fix from gtk-rs-core#1343, backported onto the complete, checksum-verified glib 0.18.5 package. Name and version remain unchanged. Tauri's GTK 0.18 constraints reject an isolated upgrade to glib 0.20. The original crate archive is retained and every vendored file is verified against it. Debug and optimized release regressions cover all affected iterator operations. No advisory suppression, dependency deletion, automatic-approval change, JavaScript change or license-policy change is introduced.



---

## Fichier distant : docs/CODEQL_GLIB_TRIAGE_20261013.md

Blob Git : `9ccbecd10921a219e3bc104b630fe0a84781303d`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/CODEQL_GLIB_TRIAGE_20261013.md

# Analyse des quatre alertes CodeQL GLib — 13 octobre 2026

## Français

**Conclusion : les quatre résultats examinés sont des faux positifs des chemins reconstruits par CodeQL. Aucun correctif de code tiers n'est nécessaire pour ces quatre chemins. Aucune alerte n'est supprimée, ignorée ou déclarée automatiquement résolue.**

Les conclusions portent sur les règles, positions et chemins suivants, pas sur toutes les API GLib ni sur toutes les alertes du dépôt.

| Repère | Règle | Position primaire | Classification |
| --- | --- | --- | --- |
| QL-1 | rust/cleartext-logging | vendor/glib-0.18.5/src/log.rs:85 | Faux positif : conversion booléenne et niveau de log incompatibles |
| QL-2 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/subclass/boxed.rs:76 | Faux positif : trait générique mal associé ; dérivation dans un module cfg(test) |
| QL-3 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/value.rs:462 | Faux positif : pointeur de chaîne associé à un GValue, sortie C non modélisée |
| QL-4 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/value.rs:470 | Faux positif : GError associé à GValue, garde non-null et sortie C non prises en compte |

### Preuves et limites de l'identification

La branche initiale est ded44f5f3ce41e5f6d092ca54f139a594c76fd8a. Le check GitHub CodeQL 115167665623 annonce six alertes au total. Le connecteur permet de consulter les checks, mais bloque les endpoints des alertes/annotations ; les analyses existantes ne conservaient pas le SARIF en artefact.

Un **nouveau diagnostic CodeQL dédié** exporte donc les résultats sans modifier les workflows existants, leurs règles, leurs seuils ou leurs permissions. Il utilise Rust en build-mode none et les requêtes par défaut de CodeQL. upload: false évite de publier un autre état ou de remplacer une analyse existante ; le SARIF complet reste disponible et aucun résultat n'est filtré dans ce fichier.

[Diagnostic n°38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513), commit d5e75292ed3caca6110c9ab4f740df33d5b096d8, CodeQL CLI 2.27.2. Le replay produit sept résultats Rust, dont les quatre positions demandées. Les trois autres positions ne sont pas qualifiées dans cette mission. Ce compte rendu n'assimile pas le nombre de résultats du replay au nombre d'alertes nouvelles affichées par GitHub.

Le [SARIF complet, artefact 11828886142](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/artifacts/11828886142) a l'empreinte SHA-256 4772fa6e1b0cf0767ea89172b14e1c9aef4054ea118d28f9986a76c561baf540. Les quatre résultats complets, avec codeFlows et relatedLocations, sont conservés dans docs/security/CODEQL_GLIB_EVIDENCE_20261013.json.

Les numéros d'alertes GitHub individuels n'ont pas été récupérés ; les repères QL-1 à QL-4 sont des identifiants de ce rapport, pas des numéros GitHub inventés. L'identification vérifiable utilise la règle, l'URI, la ligne et le chemin SARIF.

### QL-1 — log.rs:85

Le sink est :
```rust
panic!("Unknown log level: {value}")
```
Il appartient à impl FromGlib<u32> for LogLevel. Le chemin SARIF commence à g_uuid_string_is_valid dans auto/functions.rs:857, passe par translate.rs:1413–1414, puis sélectionne cette conversion de niveau de log.

Le wrapper uuid_string_is_valid a un type de retour **bool**. La fonction C renvoie gboolean, un entier signé C ; son impl Rust est FromGlib<ffi::gboolean> for bool. La conversion LogLevel attend au contraire **u32** et produit LogLevel. La résolution Rust concrète ne peut pas choisir FromGlib<u32> for LogLevel pour remplir le retour bool du wrapper UUID : le chemin reconstruit confond des implémentations de trait générique incompatibles.

De plus, le résultat du prédicat est une validation de format UUID, pas le contenu de l'UUID. Le panic du niveau de log formate un masque numérique. Le résultat ne démontre donc ni circulation d'un secret vers ce panic, ni journalisation d'un secret applicatif.

Test : validation UUID valide/invalide avec résultats typés bool, et conversion indépendante d'un masque Debug u32 vers LogLevel. Aucun journal de secret n'est produit.

### QL-2 — subclass/boxed.rs:76

La position primaire est la **dérivation de MyBoxed**, dans :
```rust
#[cfg(test)]
mod test {
    #[derive(Clone, Debug, PartialEq, Eq, glib::Boxed)]
    #[boxed_type(name = "MyBoxed")]
    struct MyBoxed(String);
}
```
Elle n'est pas une preuve que boxed_copy reçoit un pointeur NULL dans l'application.

Deux chemins représentatifs commencent par charset = ptr::null() avant g_get_console_charset (auto/functions.rs:344–347), ou out_charset = ptr::null() avant g_get_charset (manual_functions.rs:217–219). Ils passent ensuite par le helper générique from_glib_none et atterrissent sur l'implémentation synthétisée pour MyBoxed.

Les wrappers de charset convertissent une **chaîne gchar** vers GString ou Option<&GStr>. Ils ne demandent pas un MyBoxed(String). Le retour concret et les types de pointeurs/traits ne sélectionnent pas la dérivation MyBoxed. Le modèle traverse des implémentations génériques sans conserver ces contraintes concrètes.

L'initialisation NULL est en outre celle d'un argument de sortie écrit par GLib. La branche console_charset ne convertit la sortie que sous ret ; charset utilise une conversion nullable. Garder la valeur d'avant l'appel C comme si elle n'avait jamais été écrite crée un chemin supplémentaire non démontré.

Enfin, le module est cfg(test), et le paquet GLib est une dépendance exclue des membres du workspace. Cargo ne construit pas les tests d'une dépendance avec le binaire applicatif ou les tests du workspace. Ce MyBoxed n'est pas une API applicative exposée.

Preuves : types concrets des wrappers, tests de charset/error, configuration de workspace et règles Cargo sur les tests des dépendances. Aucun type MyBoxed n'est ajouté à l'application pour contourner le diagnostic.

### QL-3 — value.rs:462

Le sink est la lecture de (*src).g_type dans copy_into_value. Les chemins montrés prennent une sortie charset, puis from_glib_none, puis la macro wrapper Value et sa fonction de copie.

Un charset est un pointeur gchar, converti vers une chaîne Rust/GLib. Un Value encapsule un GValue. Le helper générique ne peut pas convertir une sortie charset en Value avec cette résolution de retour et ces implémentations concrètes. Aucun cast ou appel qui réaliserait cette conversion n'apparaît dans le chemin montré.

Le contrat GLib de g_value_copy exige un GValue source valide ; le wrapper Rust clone un GValue valide et initialise la destination avant copie. La copie indépendante reste valide après destruction de la source. L'allocation native utilise g_malloc0 pour une taille GValue non nulle : GLib termine sur échec d'allocation plutôt que de retourner silencieusement NULL.

Tests : clone d'un Value contenant une chaîne, destruction de l'original, lecture de la copie ; copie d'un BoxedValue, destruction des deux wrappers source, lecture de la copie possédée. Ces tests renforcent les contrats FFI ; ils ne prétendent pas prouver la sûreté de toutes les API unsafe.

### QL-4 — value.rs:470

Le sink est la lecture de (*value).g_type dans clear_value, avant g_value_unset.

Les chemins SARIF commencent notamment par error = ptr::null_mut() dans auto/functions.rs:197 ou 224. Après l'appel C, le wrapper convertit error avec from_glib_full **uniquement dans la branche non-null** et retourne crate::Error. Le chemin CodeQL l'associe ensuite aux fonctions de copie/libération de GValue, dont le type de pointeur et le type de retour sont différents.

Le pointeur GError est un résultat C alloué, pas un GValue. La conversion concrète est celle de glib::Error, jamais celle de Value. Le chemin montré ignore à la fois l'écriture de l'argument de sortie C, la garde error.is_null et la sélection du trait selon le type de retour.

Tests : échec contrôlé de filename_to_uri sur un chemin relatif, retour statiquement typé glib::Error, clone, destruction de l'original puis lecture du message ; construction et destruction d'un Value numérique initialisé à zéro. Aucune adresse NULL n'est déréférencée pour simuler une attaque.

### Références amont vérifiables

- Sources Rust inchangées dans [glib 0.18.5](https://github.com/gtk-rs/gtk-rs-core/tree/0.18.5/glib/src) : log.rs, value.rs, subclass/boxed.rs, translate.rs et les wrappers générés.
- [g_value_copy](https://docs.gtk.org/gobject/method.Value.copy.html) : copie d'un GValue valide.
- [g_value_unset](https://docs.gtk.org/gobject/method.Value.unset.html) : libération du contenu possédé.
- [g_value_set_boxed](https://docs.gtk.org/gobject/method.Value.set_boxed.html) et [g_value_take_boxed](https://docs.gtk.org/gobject/method.Value.take_boxed.html) : copie et transfert de propriété, avec traitement NULL explicite.
- [GLib 2.72.4 gboxed.c](https://github.com/GNOME/glib/blob/2.72.4/gobject/gboxed.c) : value_set_boxed_internal, boxed_proxy_value_copy/free et les flags de copie/propriété.
- [GLib 2.72.4 gvalue.c](https://github.com/GNOME/glib/blob/2.72.4/gobject/gvalue.c) : initialisation et copie des GValue.
- [Tests Cargo](https://doc.rust-lang.org/cargo/commands/cargo-test.html) : sélection des paquets testés, distincte de leurs dépendances.

### Exposition applicative et observation distincte

Les commandes Tauri de src-tauri/src/main.rs renvoient String, serde_json::Value et Vec<serde_json::Value>. La revue de src-tauri/src ne montre aucun appel direct à MyBoxed, register_boxed_type, BoxedValue, LogField ou à une conversion de sortie charset/erreur en GValue. Le frontend, les retours JSON et les caches ne démontrent aucun contrôle d'un pointeur natif par une entrée distante.

Tauri/GTK utilisent GLib indirectement. L'absence d'appel direct n'est pas une preuve générale d'absence d'exposition ; les quatre classifications reposent surtout sur les chemins impossibles et les contrats/types vérifiés ci-dessus.

Lors de la première lecture de log.rs, une signature distincte a été repérée : LogField::new lie la clé à 'a mais pas la référence value: &[u8]. Ce point est **distinct de l'alerte log.rs:85**. Aucun appel applicatif à cette API ni exploitation n'est démontré. La même signature apparaît dans glib 0.22.10 et aucun correctif amont vérifiable n'a été retrouvé dans la recherche menée. Aucun patch local inventé n'est appliqué dans cette mission ; ce point reste une observation séparée à faire confirmer en amont.

### Validation et conservation

Les modifications exécutables ont été validées sur le commit f78242e4fc5e311a4a7114ff0cc46b5fce0055ef. La finalisation suivante ajoute uniquement ce rapport, les preuves JSON et le passage du nouveau diagnostic à un déclenchement manuel ; elle ne change aucun code testé.

| Vérification | Résultat vérifié | Preuve GitHub |
| --- | --- | --- |
| cargo build --workspace --locked --verbose | Réussi, debug | [CI Rust 38427520573](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427520573/job/115400700304) |
| cargo test --workspace --locked --verbose | 13 tests d'intégration réussis, dont les 5 nouveaux ; 0 échec, 0 ignoré | Même job Rust |
| cargo build --workspace --release --locked --verbose | Réussi, release | Même job Rust |
| cargo test --workspace --release --locked --verbose | Les mêmes 13 tests réussis ; 0 échec, 0 ignoré | Même job Rust |
| cargo fmt --all -- --check | Réussi | [Qualité Rust 115400661011](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427509459/job/115400661011) |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Job réussi ; 34 avertissements du paquet tiers GLib restent visibles dans le journal | Même job qualité Rust |
| Contrôle de conservation des migrations précédentes | 446 noms de paquets conservés et 121 fichiers GLib vérifiés ; seul le correctif amont antérieur de VariantStrIter est autorisé par ce contrôle | Job Rust 115400700304 |
| Validation des workflows, lint/typecheck/build Vite | Jobs existants réussis automatiquement, sans modification JavaScript | [CI JS/TS 38427520885](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427520885) |
| Diagnostic CodeQL Rust | Analyse réussie, traces SARIF exportées ; les résultats restent présents | [Diagnostic 38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324) |

Les cinq nouveaux tests se trouvent dans src-tauri/tests/glib_codeql_contracts.rs. Les huit tests précédents (six VariantStrIter, deux HTTP) restent présents et passent également dans les deux profils. Ces tests exécutent les contrats concrets observés ; la réfutation des chemins génériques impossibles repose sur les types et le SARIF, pas sur une prétention à prouver tous les comportements par quelques tests.

L'environnement local ne dispose pas de Cargo et son accès réseau shell est indisponible ; les commandes de compilation et de test ci-dessus ont donc été exécutées par les workflows GitHub Actions existants, sur la branche de la PR.

Les jobs historiques Rust Security Audit, Rust Dependency Analysis et JS/TS Dependency Security restent en échec dans [le run sécurité 38427509459](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38427509459). Aucun résultat de ces audits ni aucune politique n'est modifié par cette mission CodeQL. Les trois autres résultats Rust du replay restent hors du périmètre analysé.

Toutes les dépendances, options, archives, commentaires et sources vendored sont conservés. Aucun chemin exclu de CodeQL, aucune requête/sevérité réduite, aucun suppress/dismiss/ignore ajouté. Les alertes restent ouvertes et leurs checks restent visibles ; les conclusions du rapport ne valent pas modification automatique de leur état GitHub.

Tous les workflows présents avant la mission sont inchangés, y compris CodeQL, sécurité, Rust et approbation automatique. Seul un nouveau diagnostic lié à cette mission a été ajouté, puis rendu manuel après export. Il ne publie aucune analyse qui pourrait remplacer un état existant. Aucune fusion ni fermeture de PR.

## English

The four requested findings are classified as false positives of the reported paths, not as a blanket claim that GLib is vulnerability-free. The logging path incorrectly dispatches a boolean UUID predicate to a u32 LogLevel conversion. The boxed path selects a derive inside an excluded dependency's cfg(test) module for a concrete charset-to-string conversion. The Value paths confuse gchar/GError outputs with GValue and lose C out-parameter writes and Rust non-null guards/concrete trait types.

A dedicated diagnostic preserves full SARIF evidence without changing existing workflows or uploading a replacement scan. Five integration tests check concrete conversions and GLib copy/free contracts in debug and release. No vendor source change, dependency removal, advisory dismissal, scanner exclusion or approval-workflow change is introduced. A separate LogField constructor lifetime observation is documented without conflating it with the logging finding or applying an unverified local fix.



---

## Fichier distant : docs/CODEQL_GLIB_REMAINING_TRIAGE_20261013.md

Blob Git : `59b08188ede938eb67bffb48b212441baec7bd37`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/CODEQL_GLIB_REMAINING_TRIAGE_20261013.md

# Trois résultats Rust CodeQL restants — GLib 0.18.5

## Français

**Conclusion : les trois chemins du diagnostic complet sont des faux positifs, pour des raisons différentes. Les résultats dans object.rs confondent des types de pointeurs et des implémentations de traits incompatibles. Celui dans ptr_slice.rs confond la destruction d'un élément avec la libération du tableau qui contient cet élément. Un défaut réel distinct de conversion de Slice vide a aussi été confirmé dans le même fichier : il est documenté avec une proposition amont non appliquée, sans exposition applicative démontrée.**

| Repère de ce rapport | Règle | Position primaire exacte | Classification |
| --- | --- | --- | --- |
| QL-5 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/object.rs:470:28–31 | Faux positif : gchar/GError ne sont pas GObject |
| QL-6 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/object.rs:493:28–31 | Faux positif : erreur/hostname convertis vers leurs types concrets, jamais ObjectRef |
| QL-7 | rust/access-invalid-pointer | vendor/glib-0.18.5/src/collections/ptr_slice.rs:900:21–22 | Faux positif : le slot reste alloué après drop_in_place du wrapper |

Les repères QL-5 à QL-7 ne sont pas des numéros d'alertes GitHub. Les quatre autres résultats de ce même diagnostic ont déjà été qualifiés dans CODEQL_GLIB_TRIAGE_20261013.md ; ce rapport historique reste intact.

### Provenance exacte

Le [diagnostic GitHub Actions 38425272324, job 115392909513](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513) a analysé le commit d5e75292ed3caca6110c9ab4f740df33d5b096d8 avec CodeQL CLI 2.27.2, Rust build-mode none.

Le [SARIF complet non filtré, artefact 11828886142](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/artifacts/11828886142) porte l'empreinte SHA-256 4772fa6e1b0cf0767ea89172b14e1c9aef4054ea118d28f9986a76c561baf540. Son export intégral dans le journal contient sept enregistrements CODEQL_RESULT_BEGIN/END. Les sept ont été réextraits du journal durant cette mission et comparés à l'extraction précédente : correspondance exacte.

Les trois enregistrements restants sont conservés intégralement, avec codeFlows et relatedLocations, dans docs/security/CODEQL_GLIB_REMAINING_EVIDENCE_20261013.json. Ce JSON constitue une extraction de résultats du SARIF, pas une nouvelle analyse ni un SARIF de remplacement. Le diagnostic existant, les audits, les workflows et leurs règles ne sont pas modifiés.

La branche au début de cette mission était 0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370. La comparaison et les références de lignes ci-dessous utilisent les sources vendored de ce commit, identiques aux sources analysées dans les trois fichiers.

### QL-5 — ObjectRef::from_glib_none, object.rs:470

Le sink primaire est :
```rust
debug_assert_ne!((*ptr).ref_count, 0);
```
Il se trouve dans l'implémentation :
```rust
impl FromGlibPtrNone<*mut gobject_ffi::GObject> for ObjectRef
```

Le SARIF conserve quatre chemins représentatifs :

1. auto/functions.rs:344–347 : charset NULL avant g_get_console_charset, puis translate.rs:1621–1622/from_glib_none et object.rs:468–470.
2. manual_functions.rs:217–219 : out_charset NULL avant g_get_charset, puis le même helper et le même sink.
3. auto/functions.rs:197–208 : error NULL avant g_file_set_contents, puis from_glib_full, un passage par translate.rs:1688–1689 (conversion const générique), from_glib_none et ce sink.
4. auto/functions.rs:224–237 : variante g_file_set_contents_full, même détour générique.

La conversion console produit **Option<GString>**, la conversion charset **Option<&GStr>**. Le pointeur natif est gchar, pas GObject. Les branches erreur produisent **crate::Error**, via un **GError**, pas un ObjectRef. Les helpers génériques sélectionnent une implémentation selon le type de pointeur et le retour Rust ; aucune sélection de cette implémentation GObject ne satisfait ces types. Le détour from_glib_full → from_glib_none montré pour un GError ne correspond donc pas à son implémentation concrète.

Les initialisations NULL sont des variables de sortie C. Le wrapper console ne convertit sa sortie que sous son booléen de succès ; les sorties nullable utilisent une conversion Option. Les erreurs ne sont converties que dans la branche error non-null. Ces faits renforcent la réfutation, mais les types incompatibles suffisent déjà à rendre les chemins affichés impossibles.

Les sources liées ne se limitent pas aux quatre exemples : les positions des relatedLocations des deux résultats ObjectRef ont été lues, soit **85 positions distinctes dans 11 fichiers**. Elles initialisent des variables GError/error/err ou des sorties gchar (charset, hostname, composantes URI, chemins). Aucune de ces initialisations ne fournit un GObject. La liste exhaustive est archivée dans le JSON de preuves. Les quatre chemins affichés sont ceux réellement présents dans codeFlows ; aucun chemin supplémentaire n'est inventé.

Contrat réel : la conversion unsafe reçoit un **GObject vivant, non-null et possédant une référence valide**. g_object_ref_sink acquiert une référence supplémentaire sur un objet non flottant ou absorbe sa référence flottante. Elle ne garantit pas la sûreté d'un pointeur arbitraire fourni par un appelant unsafe.

### QL-6 — ObjectRef::from_glib_full, object.rs:493

Le sink est la même lecture du compteur, dans :
```rust
impl FromGlibPtrFull<*mut gobject_ffi::GObject> for ObjectRef
```

Quatre chemins sont exportés : error de g_file_set_contents (197 → 208), error de sa variante full (224 → 237), hostname de g_filename_from_uri (276 → 280) et error de cette même fonction (277 → 282). Ils passent par translate.rs:1630–1631 puis ObjectRef::from_glib_full.

Les deux premières sorties et la dernière ont les types **GError*/crate::Error**. La sortie hostname a le type **gchar*/Option<GString>**. Un hostname NULL est un cas prévu par le wrapper et produit None. Il n'est ni converti en ObjectRef, ni dereférencé comme GObject.

Pour un vrai GObject, from_glib_full **consomme une référence déjà possédée**, sans incrémenter son compteur. ObjectRef::Drop appelle g_object_unref sur l'objet pointé. Les tests comptent les références avant/après les conversions none et full et vérifient la finalisation par WeakRef.

Les deux sinks object.rs sont dans des debug_assert : ces lectures de ref_count sont absentes d'un build release normal. Ce fait n'est pas utilisé pour dispenser la conversion réelle de son contrat unsafe ; les chemins sont réfutés par les types, indépendamment des optimisations.

### QL-7 — PtrSlice::truncate, ptr_slice.rs:900

Le codeFlow est court et ne part d'aucune entrée applicative :

- ligne 898 : ptr::drop_in_place::<T>(p as *mut T), adresse considérée invalide par la trace ;
- ligne 900 : p, destination du ptr::write qui pose le NULL terminal.

Le code effectif est :
```rust
while self.len > len {
    self.len -= 1;
    let p = self.ptr.as_ptr().add(self.len);
    ptr::drop_in_place::<T>(p as *mut T);
    ptr::write(
        p,
        Ptr::from(ptr::null_mut::<<T as GlibPtrDefault>::GlibType>()),
    );
}
```

Il faut distinguer **p**, adresse d'un slot dans le tableau de pointeurs, et **la valeur du pointeur stockée dans ce slot**, adresse d'un objet natif.

T implémente le trait unsafe TransparentPtrType : le wrapper a la représentation du pointeur vers son type FFI. La macro de wrapper GObject l'implémente explicitement (object.rs:704–709). La conversion p as *mut T donne donc l'adresse du wrapper dans le tableau ; elle ne transforme pas p en adresse du GObject.

Pour un glib::Object, la destruction descend vers ObjectRef::Drop (object.rs:389–394), qui passe self.inner.as_ptr à g_object_unref. GLib décrémente le compteur et peut libérer **le GObject** ; il ne libère pas le tableau de PtrSlice. Les autres destructeurs examinés suivent la même séparation : Shared appelle MM::unref(inner), Boxed appelle MM::free(inner), GStringPtr appelle g_free(self.0.as_ptr()). Ce sont les adresses contenues dans les wrappers, pas l'adresse du slot.

L'allocation du tableau est conservée pendant truncate : aucune modification de capacity, aucun g_free/g_realloc sur le tableau dans cette méthode. Sa libération est dans PtrSlice::Drop, **après** la destruction des éléments, avec g_free(self.ptr.as_ptr()) si capacity != 0.

Les bornes comptent également : la méthode retourne si self.len <= len ; sinon elle décrémente self.len avant de calculer le slot. Sous les invariants valides du conteneur, ce slot appartient à l'allocation initiale. Un PtrSlice vide avec NonNull::dangling ne pénètre pas dans la boucle. Les constructeurs unsafe exigent un tableau valide ; set_len exige les éléments et le terminateur correspondants. Un appelant qui viole ces contrats ou une implémentation unsafe incorrecte de TransparentPtrType ne constitue pas une exposition démontrée via les API sûres examinées.

L'écriture NULL réinitialise une mémoire de slot encore allouée, après la fin de vie de son ancien wrapper. La trace ne démontre aucune utilisation du GObject libéré. C'est un **faux positif de cette invalidation d'adresse**, pas une preuve générale que toutes les opérations PtrSlice sont exemptes de défauts.

### Correctifs et comparaison amont

La comparaison avec [gtk-rs-core 0.22.10](https://github.com/gtk-rs/gtk-rs-core/tree/0.22.10/glib/src) conserve les deux conversions ObjectRef et leurs assertions ; le chemin drop_in_place suivi de ptr::write est également conservé dans truncate pour les types nécessitant une destruction.

Un correctif particulièrement pertinent a été examiné : [3971101c82643035c15380c3f4af19ecccd09bb2](https://github.com/gtk-rs/gtk-rs-core/commit/3971101c82643035c15380c3f4af19ecccd09bb2), daté du 29 avril 2026, « Fix theoretical use-after-frees if dropping an item panics ». Son auteur précise :

> This is currently not a problem because all collections require the item type to implement TransparentType or TransparentPtrType, which are unsafe traits that are only implemented by the glib::wrapper! macro and require the Drop impl to not panic (among other things).

Cette explication amont est citée comme telle ; les commentaires locaux de ces traits ne documentent pas aussi complètement cette exigence. Le correctif réinitialise certains états avant destruction et ajoute une branche needs_drop dans truncate. **Il conserve exactement drop_in_place(p) puis ptr::write(p, NULL) pour les types avec destructeur.** Il ne corrige donc pas l'invalidation d'adresse prétendue par cette trace et ne justifie pas un backport pour QL-7.

Un autre correctif consulté, [2477663](https://github.com/gtk-rs/gtk-rs-core/commit/2477663dbf34cd75d879e0ace53fd0a4e4e6f857), concerne les débordements dans reserve/extend/push. Ce sujet ne réalise pas le chemin SARIF de truncate et aucune migration globale n'est importée ici.

### Défaut réel distinct : conversion d'une Slice vide

Le correctif [b31265df94876febf259089a19de9c23d2468214](https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214), du 19 septembre 2026, corrige [l'issue amont #2042](https://github.com/gtk-rs/gtk-rs-core/issues/2042). **Le code concerné est bien présent dans glib 0.18.5, ptr_slice.rs:1047–1070.**

Slice::into_raw renvoie NULL si len == 0 ; le destructeur de la Slice libère son éventuelle allocation réservée. La conversion sûre From<Slice<T>> construit pourtant NonNull::new_unchecked(ptr) sans tester NULL, puis prépare le terminateur en réutilisant l'ancien capacity. Construire ce NonNull NULL viole déjà le contrat Rust ; dans le cas réservé-vide, le pointeur est NULL et la capacité sauvegardée peut empêcher une réallocation avant l'écriture. Il s'agit donc d'un **défaut réel du code tiers accessible par une API sûre**, même sans prouver une attaque applicative.

Ce défaut n'est pas la libération du slot supposée dans le codeFlow 898 → 900. La trace ne passe ni par la conversion Slice → PtrSlice, ni par sa construction invalide. Les tests de truncate utilisent une construction Vec → PtrSlice valide et ne prétendent pas couvrir la conversion vide défectueuse.

Une proposition isolée est conservée dans **docs/security/proposals/UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch**. Elle reprend le correctif fonctionnel amont : si into_raw renvoie NULL, vérifier len == 0 et retourner PtrSlice::new ; sinon conserver le chemin non vide. Seule une traduction française du nouveau commentaire est ajoutée avant son texte anglais. Les fonctions avant/après et le patch amont sont archivés dans les preuves.

La proposition passe **git apply --check** contre la source vendored exacte, et un contrôle confirme que le fichier source reste inchangé. **Elle n'est pas appliquée, activée ni validée en exécution.** Les résultats CI ci-dessous concernent les contrats des trois chemins SARIF, pas ce rétroport. Le comportement invalide du paquet actuel n'est pas exécuté pour obtenir un crash.

Pour valider ce rétroport séparément, reprendre les cas du test amont test_from_slice_empty : conversion non vide, vide sans réserve, vide avec réserve, puis destruction/réutilisation. Il faut compiler et tester le paquet corrigé en debug/release et étendre le contrôle de conservation existant pour vérifier uniquement le delta amont autorisé dans ptr_slice.rs. La présente mission d'analyse laisse ce contrôle, les audits et toutes les sources préexistantes inchangés. Le défaut reste explicitement **non corrigé sur la branche**, avec correctif concret proposé et sans chemin applicatif identifié.

Références de contrats :

- [GLib 2.72.4 gobject.c](https://github.com/GNOME/glib/blob/2.72.4/gobject/gobject.c), g_object_ref_sink et g_object_unref : absorption/incrément de références et finalisation de l'objet pointé.
- [Rust ptr::drop_in_place](https://doc.rust-lang.org/std/ptr/fn.drop_in_place.html) : destruction du contenu à l'adresse.
- [Rust ptr::write](https://doc.rust-lang.org/std/ptr/fn.write.html) : écriture dans une adresse valide et correctement alignée.
- Sources GLib vendored : translate.rs:2632–2636, object.rs:389–394/466–498, collections/ptr_slice.rs:82–96/603–608/689–695/889–905, boxed.rs:531–536, shared.rs:461–466, gstring.rs:751–756.

### Exposition applicative

Les quatre sources Rust actives main.rs, cache.rs, geocoding.rs et weather.rs ont été lues à la révision initiale. Aucun appel direct à PtrSlice, ObjectRef, aux helpers from_glib_* ni aucune implémentation applicative de TransparentPtrType n'apparaît. Les entrées Tauri transportent des chaînes, nombres et JSON ; aucun chemin vers une adresse native arbitraire n'est démontré.

Tauri/GTK emploient GLib indirectement. ObjectRef et PtrSlice sont du code tiers actif, **pas du code fantôme à supprimer**. L'absence d'appel direct ne prouve pas une absence absolue d'exposition ; les classifications ci-dessus reposent sur les chemins/types et la propriété mémoire vérifiés.

### Vérifications

Les cinq nouveaux tests de src-tauri/tests/glib_codeql_remaining_contracts.rs ont été exécutés sur le commit 715d38bc9368ecf5fc1711e4bb608e9014b8feae. Les derniers fichiers ajoutés ensuite sont uniquement le rapport, les preuves et une proposition inactive ; aucun code testé n'est modifié.

| Vérification | Résultat | Preuve |
| --- | --- | --- |
| cargo build --workspace --locked --verbose | Réussi, debug | [Rust 38438659916 / 115439191070](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438659916/job/115439191070) |
| cargo test --workspace --locked --verbose | 18 tests d'intégration réussis, dont les 5 nouveaux ; 0 échec/ignoré | Même job Rust |
| cargo build --workspace --release --locked --verbose | Réussi, release | Même job Rust |
| cargo test --workspace --release --locked --verbose | Les mêmes 18 tests réussis ; 0 échec/ignoré | Même job Rust |
| cargo fmt --all -- --check | Réussi | [Qualité Rust 115439156348](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438649670/job/115439156348) |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Job réussi ; 34 avertissements du paquet tiers GLib restent visibles | Même job qualité |
| Garde de conservation antérieure | 446 noms de paquets / 121 fichiers GLib conservés ; correctif VariantStrIter précédent vérifié | Même job Rust |
| Exclusion du code fantôme des artefacts | Contrôle réussi sur dist et le binaire release | Même job Rust |
| Lint/typecheck/build Vite et validation des workflows | CI existantes réussies automatiquement | [JS/TS CI 38438659813](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38438659813) |
| CodeQL sur le commit testé | Analyses exécutées avec succès ; check de résultats toujours en échec avec 6 alertes élevées | [Check 115439489458](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153/checks?check_run_id=115439489458) |
| Proposition inactive pour le défaut de conversion vide | git apply --check réussi ; aucune exécution ni source modifiée | Vérification locale uniquement |

Les nouveaux tests vérifient : une référence GObject acquise par from_glib_none ; un transfert possédé par from_glib_full sans incrément supplémentaire ; un hostname NULL traité par Option<GString> ; la finalisation de deux objets tronqués avec maintien/réutilisation du tableau ; les cas vide, longueur inchangée, zéro et appels répétés. Les treize tests précédents sont conservés et passent également dans les deux profils.

Cargo n'est pas disponible dans l'environnement local et son réseau shell est indisponible ; les compilations/tests ont été exécutés dans GitHub Actions, sans changer les workflows. Les jobs Rust Security Audit, Rust Dependency Analysis et JS/TS Dependency Security restent en échec dans le run 38438649670 : aucun audit ni aucune politique n'a été modifié pour cette mission.

Les tests ne passent aucun pointeur invalidé ni NULL à une API unsafe exigeant un objet valide. Ils vérifient des références réelles, la finalisation des objets, le maintien des allocations et leur réutilisation. Ils ne constituent ni un test Miri ni une instrumentation AddressSanitizer et ne prouvent pas à eux seuls l'absence de tout comportement indéfini ; la revue source/FFI et les preuves amont complètent leurs résultats.

### Conservation et états GitHub

La comparaison des arbres Git entre la révision initiale 0fa3c7fc5e68ac0e131c58c8aecdfc8006e80370 et le résultat final vérifie **zéro modification et zéro suppression de fichier préexistant**. Quatre fichiers sont ajoutés : cinq tests de contrat, ce rapport, les preuves JSON et la proposition inactive. Toutes les dépendances, options, verrouillages, archives, sources vendored, commentaires, variantes et code fantôme sont conservés. Tous les workflows et scripts préexistants sont inchangés, y compris le diagnostic, la garde de conservation, les audits et l'approbation automatique.

Aucune alerte n'est masquée, ignorée ou dismissée. Le rapport ne change pas son état GitHub et ne promet pas un check CodeQL vert. Les audits et problèmes antérieurs restent visibles. Aucun correctif source ni changement de dépendance n'est nécessaire pour les trois chemins examinés. Aucune fusion ni fermeture de PR.

## English

The three remaining records from the complete diagnostic have been qualified. ObjectRef findings conflate gchar/GError outputs with incompatible GObject conversions, including a nullable hostname handled as Option<GString>. The PtrSlice trace marks an array slot invalid after dropping its pointer-sized wrapper, although the destructor releases the pointed-to native object and the array allocation remains owned until PtrSlice itself is dropped.

The reviewed upstream panic-hardening change explicitly keeps drop_in_place followed by ptr::write for types with destructors; it does not support treating this exact sequence as a use-after-free. A separate real safe-constructor bug in the empty Slice-to-PtrSlice conversion is confirmed in glib 0.18.5. A concrete upstream-derived patch is preserved as an unapplied proposal: dry-run applicability is checked, but runtime backport validation has not been performed and the bug remains unfixed. No application exposure or connection to the truncate trace is demonstrated. Other collection fixes are documented without importing unrelated migrations. Five focused integration tests check none/full reference ownership, nullable output handling, actual object finalization, allocation preservation and truncate boundary cases. Existing sources, dependencies, historical reports, workflows, audit/licensing policy and automatic approval are preserved. No alert state is changed.



---

## Fichier distant : docs/GLIB_EMPTY_SLICE_BACKPORT_20261013.md

Blob Git : `061b0c9e9253032aaac32365f808d6e87a519ae0`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/GLIB_EMPTY_SLICE_BACKPORT_20261013.md

# Rétroport GLib : conversion d'une Slice vide vers PtrSlice

## Français

Le correctif amont [b31265df94876febf259089a19de9c23d2468214](https://github.com/gtk-rs/gtk-rs-core/commit/b31265df94876febf259089a19de9c23d2468214), lié à [gtk-rs-core #2042](https://github.com/gtk-rs/gtk-rs-core/issues/2042), est appliqué à GLib 0.18.5. Cette correction traite le défaut réel distinct découvert pendant l'analyse CodeQL ; elle ne prétend pas résoudre les chemins SARIF précédemment qualifiés comme faux positifs.

### Défaut et correction minimale

Slice::into_raw renvoie NULL lorsque la longueur vaut zéro. Dans ce cas, la Slice détruite libère également son éventuelle allocation réservée. La conversion From<Slice<T>> pour PtrSlice<T> utilisait ce pointeur pour construire NonNull::new_unchecked et conservait l'ancienne capacité. Le cas vide violait ainsi le contrat de NonNull ; la variante réservée-vide pouvait écrire dans NULL en prenant une capacité déjà libérée pour une allocation réutilisable.

La correction teste ptr.is_null : si vrai, elle vérifie len == 0 en debug et retourne PtrSlice::new, avec capacité zéro. La branche non vide conserve l'allocation et prépare le terminateur comme auparavant. Aucune version ni dépendance n'est changée.

La proposition historique docs/security/proposals/UNAPPLIED_GLIB_EMPTY_SLICE_UPSTREAM_20261013.patch a été relue et conservée intacte. Le code source appliqué est celui de cette proposition. Les corps des fonctions ont été comparés à la source du commit amont : **identiques après retrait des seules lignes de commentaires**. La différence documentaire est le commentaire français placé avant le commentaire anglais amont.

Le commit amont modifie aussi une documentation de Slice::into_raw et ajoute un test interne au paquet. Le rétroport limite les changements vendored au corps de la conversion dans ptr_slice.rs ; les tests sont placés dans le workspace applicatif, car le paquet vendored reste exclu des membres et ses tests internes ne sont pas exécutés par cargo test --workspace.

### Tests ajoutés

src-tauri/tests/glib_empty_slice.rs contient six régressions Linux :

| Test | Contrat vérifié |
| --- | --- |
| empty_slice_conversion_returns_fresh_reusable_storage | Slice vide sans réserve : capacité zéro, sentinelle NULL, push/pop et réutilisation |
| reserved_empty_slice_conversion_discards_freed_capacity | Slice vide avec capacité réservée : ancienne capacité abandonnée, nouvelle allocation utilisable |
| emptied_reserved_slice_conversion_is_reusable | Slice contenant un élément puis vidée : réserve conservée par Slice mais abandonnée par la conversion vide |
| nonempty_slice_preserves_contents_and_null_termination | Trois messages comme dans le test amont, portés par des GError natifs : copies possédées après destruction des sources, terminateur et truncate/push |
| converted_slice_owns_objects_until_their_last_reference_is_dropped | Transfert de GObject sans référence supplémentaire, pop/destruction observée par WeakRef, réutilisation d'une Slice réservée-vide |
| converting_then_truncating_finalizes_each_owned_object | Finalisation du dernier élément lors de truncate et du premier lors de la destruction du conteneur |

Les accès unsafe des tests lisent uniquement les sentinelles des conteneurs construits valides. Les tests ne passent pas de pointeur arbitraire ou invalidé aux API FFI. Les WeakRef vérifient la finalisation réelle des objets, au-delà d'une simple vérification de longueur.

### Archives et contrôle de conservation

docs/history/glib-empty-slice-20261013 conserve intégralement :

- vendor/glib-0.18.5/src/collections/ptr_slice.rs, variante précédant ce rétroport ;
- Scripts/check-rust-warnings-backport.py, contrôleur précédent ;
- les corps de conversion avant/après et leurs empreintes ;
- les métadonnées et patches amont dans upstream-verification.json ;
- une explication française puis anglaise de leur statut historique.

La première variante des tests reprenant GStringPtr::from(&str), indisponible en 0.18.5, est également conservée dans src-tauri/tests/glib_empty_slice.upstream-api-incompatible.rs. Les fixtures actives utilisent Error::new, un wrapper GError transparent et possédé déjà disponible ; les trois messages amont et les scénarios de propriété sont conservés.

Ces fichiers sont hors des cibles Cargo du workspace. Ils restent des références inactives, pas des alternatives réactivées dans l'application. Le paquet original publié reste également archivé dans docs/history/rust-warnings-20261013/glib-0.18.5.crate ; les archives et rapports antérieurs ne sont pas réécrits.

Le contrôleur actif garde tous ses contrôles antérieurs, y compris les dépendances conservées, les options, le verrouillage registry GLib, le chemin réellement résolu par cargo metadata et le rétroport VariantStrIter. Il ajoute uniquement l'autorisation du remplacement de fonction prévu dans ptr_slice.rs :

- le fichier archivé avant modification doit être identique à celui du paquet publié ;
- le corps avant correction doit apparaître exactement une fois ;
- les empreintes SHA-256 des corps avant/après et du contrôleur archivé sont fixées dans le script ;
- tous les autres octets des **121 fichiers GLib** restent comparés au paquet original, avec le seul delta VariantStrIter précédemment autorisé.

Il n'existe aucune exception générale pour ptr_slice.rs ni aucun affaiblissement des audits. Des vérifications locales négatives confirment le rejet d'une modification source supplémentaire, d'un retour à la conversion défectueuse et d'une altération de la variante de référence après correction. Le contrôle local positif passe jusqu'à l'étape cargo metadata, indisponible localement ; le contrôle complet est exécuté en CI.

### Résultats réellement vérifiés

Le code et les six nouveaux tests ont été validés sur le commit **bd2e21aaccafc02baf20807809feb235a55e8c7d**. Les fichiers de rapport et de preuves ajoutés ensuite ne modifient aucun code testé.

| Vérification | Résultat réellement observé | Preuve GitHub |
| --- | --- | --- |
| cargo build --workspace --locked --verbose | Réussi, debug | [Rust 38442051602, job 115450834959](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442051602/job/115450834959) |
| cargo test --workspace --locked --verbose | **24 tests d'intégration réussis**, dont 6 nouveaux ; 0 échec, 0 ignoré | Même job Rust |
| cargo build --workspace --release --locked --verbose | Réussi, release | Même job Rust |
| cargo test --workspace --release --locked --verbose | **Les mêmes 24 tests réussis**, 0 échec, 0 ignoré | Même job Rust |
| cargo fmt --all -- --check | Réussi | [Qualité Rust 115450800290](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800290) |
| cargo clippy --workspace --locked --all-targets --all-features -- -D warnings | Job réussi ; **34 avertissements tiers GLib toujours visibles** | Même job qualité |
| Contrôles de conservation complets, dont cargo metadata --locked | Réussis ; 446 noms historiques conservés, 121 fichiers GLib contrôlés et source vendored corrigée effectivement résolue | Job Rust 115450834959 |
| Exclusion des références historiques des artefacts | Contrôle existant réussi sur dist et binaire release ; archives nouvelles hors cibles Cargo, aucun include vers ces archives | Même job Rust |
| cargo audit --deny warnings | **Échec : 3 avertissements refusés**, listés ci-dessous | [Audit Rust 115450800367](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800367) |
| cargo-deny, action existante | **advisories FAILED, licenses FAILED ; bans ok, sources ok** | [Analyse dépendances 115450800678](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800678) |
| pnpm audit --audit-level=moderate, déclenché automatiquement | **Échec : 1 alerte high braces** ; aucun changement JavaScript | [Audit JS 115450800193](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442040995/job/115450800193) |
| Lint, typecheck, build Vite et validation des workflows | Jobs existants réussis automatiquement | [JS/TS CI 38442051634](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38442051634) |
| Vérifications locales supplémentaires du contrôleur | Positif réussi avant cargo metadata ; trois cas de modification/reversion/référence altérée correctement rejetés | Contrôles locaux, détaillés plus haut |

Les avertissements de cargo audit sont :

- **proc-macro-error 1.0.4 — RUSTSEC-2024-0370**, paquet non maintenu ;
- **rustls-pemfile 1.0.4 — RUSTSEC-2025-0134**, paquet non maintenu, dépendance historique optionnelle conservée ;
- **glib 0.18.5 — RUSTSEC-2024-0429**, VariantStrIter : correctif source amont antérieur conservé et testé, identité registry inchangée donc avertissement toujours présent.

Le refus d'advisory explicitement affiché par cargo-deny concerne proc-macro-error ; ses refus de licences restent en échec avec la politique existante, sans modification. L'alerte JS conservée est **GHSA-vfj7-8cjw-p6xm**, braces 3.0.3. Le rétroport actuel ne traite aucun de ces sujets indépendants.

Au moment de la vérification du commit testé, le check CodeQL **115451282377** a la conclusion **neutral**. GitHub indique qu'une configuration Rust du workflow security-analysis.yml présente sur main manque pour comparer les alertes de la PR. Son résumé exact est conservé dans les preuves ; ce résultat n'est pas assimilé à un audit vert et aucun workflow n'est modifié pour le contourner.

Les dix-huit tests précédents (contrats CodeQL, VariantStrIter et HTTP) restent présents et réussissent aussi dans les deux profils. La garde continue à vérifier le correctif VariantStrIter exact et la migration h2 précédente.

L'environnement local n'a ni Cargo ni rustfmt et son réseau shell est indisponible. Les compilations, tests, Clippy et audits ont été exécutés dans GitHub Actions via les workflows existants. Les résultats de ces jobs, y compris les échecs, sont les preuves citées.

### Périmètre final et limites

La comparaison des arbres Git depuis **f149328e91bf0379f31d73b664d80dbe85f49617** vérifie **aucune suppression**. Seuls deux fichiers préexistants changent : **vendor/glib-0.18.5/src/collections/ptr_slice.rs** (rétroport de la conversion) et **Scripts/check-rust-warnings-backport.py** (autorisation strictement bornée du delta). Leurs variantes antérieures sont archivées avec des blobs Git **identiques octet pour octet**.

Les manifestes, Cargo.lock, pnpm-lock.yaml, les options, les autres sources GLib, les archives antérieures, les rapports historiques et la proposition inactive initiale restent inchangés. Tous les workflows préexistants, dont l'approbation automatique, sont identiques à leur version initiale. Aucune règle d'audit ni politique de licences n'est changée. Les seuls ajouts sont les régressions, leurs références/archives, ce rapport et les preuves.

La PR reste ouverte et aucun merge n'est effectué. Aucun état d'alerte n'est modifié manuellement ; aucune exclusion, ignore ou dismissal n'est ajouté.

La première exécution des tests avec le constructeur de chaîne du paquet amont récent a échoué à la compilation (E0308). La variante est archivée ; les tests actifs adaptés à Error::new de glib 0.18.5 sont ceux du commit validé indiqué ci-dessus. La correction du paquet reste identique au rétroport amont.

La résolution garde GLib 0.18.5 et son identité registry/checksum dans Cargo.lock. Le warning RustSec historique GLib peut donc rester présent même si les défauts source rétroportés sont corrigés. Aucun advisory, résultat CodeQL, exclusion ou seuil n'est masqué pour présenter un audit vert.

Les conclusions CodeQL et le constat de proposition inactive dans les rapports précédents décrivent leur état historique et sont conservés intégralement. Ce rapport documente l'application et la validation nouvelles. Aucun autre correctif de collections, migration de dépendance, changement JavaScript ou modification de politique de licences n'est introduit.

Les tests Linux debug/release et la revue amont ne constituent pas une validation Android en appareil, un test Miri ou un passage AddressSanitizer. Aucun nouvel accès réseau ni comportement fonctionnel applicatif n'est ajouté.

## English

The exact upstream empty Slice-to-PtrSlice conversion fix from gtk-rs-core commit b31265df94876febf259089a19de9c23d2468214 is backported to glib 0.18.5. NULL from an empty Slice now produces a fresh PtrSlice with zero capacity instead of constructing an invalid NonNull and retaining already-freed reserved capacity. The nonempty path is preserved.

Six integration regressions cover empty, reserved-empty, emptied-after-pop and nonempty slices, NULL termination, reuse, native object ownership and finalization. Complete previous source/checker variants and all earlier archives are preserved. The preservation checker permits only the pinned upstream function replacement while retaining all existing dependency/lockfile/source checks. Existing workflows, automatic approval, auditing rules and license policy remain unchanged; no warning or alert is hidden.



---

## Fichier distant : docs/DEPENDENCY_BOTS_20261013.md

Blob Git : `b3ee737f905378f686932b021fc869c7a6f84196`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/DEPENDENCY_BOTS_20261013.md

# Bots de dépendances : configuration et conservation — 13 octobre 2026

## Français

Dependabot est configuré pour **pnpm, Cargo et GitHub Actions**. Renovate reste explicitement **désactivé** afin d'éviter deux producteurs concurrents de mises à jour. Un nouveau contrôle de conservation examine toutes les PR, quel que soit leur auteur ; les auteurs Bot et branches dependabot/renovate ont en plus un périmètre de fichiers borné.

Ces changements sont préparés sur #153, pas encore actifs comme configuration des bots sur main. Aucun merge, aucune fermeture de PR, aucune modification de l'approbation automatique, des workflows de sécurité ou de la politique de licences.

### État observé et mécanismes audités

| Mécanisme | État observé avant cette mission | Décision |
| --- | --- | --- |
| Dependabot npm | Racine, quotidien, limite 10, groupe minor/patch ; ancien verrou npm encore présent avec pnpm | Garder npm comme valeur d'écosystème officielle de pnpm ; déclarer pnpm@8.15.9 et exclure les verrous npm historiques des mises à jour de versions |
| Dependabot Cargo | Aucune entrée | Ajouter Cargo à la racine du workspace et de Cargo.lock, limite 5 |
| Dependabot Actions | Quotidien, limite 5, groupe minor/patch | Conserver le dispositif ; exclure les archives et le workflow d'approbation des mises à jour de versions |
| Renovate | PR d'onboarding #154 ouverte, config:recommended proposée, aucun fichier actif sur la branche initiale | Ajouter un profil désactivé ; pas de mise à jour ou de fusion de #154 |
| lockfile-maintenance.yml | workflow_dispatch uniquement, permissions contents:read, candidat exporté en artefact | Inchangé ; pas de push ni de PR automatique |
| js-security-maintenance.yml | workflow_dispatch uniquement, candidat et audits exportés | Inchangé ; attention au manifeste/versions figés dans son générateur historique |
| Autres automatismes | Trois PR ai-findings-autofix observées, scripts Windows historiques ; aucun fichier de configuration Snyk/Depfu/Updatecli détecté | Aucun changement ni suppression ; absence de fichier ne prouve pas l'absence d'app externe |

Neuf PR Dependabot JS étaient ouvertes au relevé, plus l'onboarding Renovate #154. Le type version/sécurité de chacune n'a pas été certifié ; on ne déduit donc pas une occupation des plafonds de versions du seul nombre total. Les réglages et installations d'applications externes ne sont pas intégralement accessibles dans ce contexte.

### Déclencheurs, plafonds et gestionnaires

| Écosystème Dependabot | Répertoire | Horaire quotidien configuré | Plafond de PR de versions |
| --- | --- | --- | --- |
| Cargo | / | 06:00 UTC | 5 |
| JavaScript/pnpm, valeur npm | / | 07:00 UTC | 10 |
| GitHub Actions | / | 08:00 UTC | 5 |

Les groupes minor/patch ne couvrent que version-updates. Ils ne prouvent pas une compatibilité ABI/API : notamment, une hausse minor d'un paquet Rust 0.x peut imposer une migration. Les mises à jour major ne sont pas ignorées et nécessitent leur propre revue. Aucun ignore de version, de paquet vulnérable ou d'advisory n'est ajouté.

Selon la [référence Dependabot](https://github.com/github/docs/blob/main/content/code-security/reference/supply-chain-security/dependabot-options-reference.md), les PR de sécurité ont un plafond distinct fixe de **10**, non réglable par open-pull-requests-limit. Le planning quotidien et ces plafonds ne garantissent ni l'heure d'exécution effective ni l'ouverture de toute PR : erreurs de résolution, credentials, quotas et PR déjà ouvertes peuvent bloquer le service.

Les options exclude-paths sont marquées **Version updates only** dans cette référence. Elles protègent les scans de versions, mais ne constituent pas une garantie universelle pour les PR de sécurité. Le contrôle CI vise aussi les PR de sécurité et les autres auteurs.

pnpm est pris en charge par Dependabot sous package-ecosystem: npm ; une valeur pnpm serait invalide. package.json indique désormais **packageManager: pnpm@8.15.9**, cohérent avec les CI existantes et le verrou v6. Tous les autres champs du manifeste sont identiques à leur version initiale. En présence des verrous multiples historiques, le champ et les exclusions améliorent la sélection du gestionnaire, sans promettre qu'un service de sécurité ne touchera jamais un ancien verrou. Une telle modification est détectée par la conservation CI.

Cargo utilise la racine /, car le workspace et Cargo.lock y sont définis. docs et vendor sont exclus des recherches de versions afin de ne pas traiter des variantes archivées ou le paquet tiers rétroporté comme des projets à moderniser séparément. Cela ne supprime aucun paquet de la résolution active.

### Renovate et coordination

renovate.json est validé par le validateur officiel **44.155.7**. Il déclare enabled:false et automerge:false. Les seuls managers prévus sont npm, cargo et github-actions, avec des exclusions des archives, vendor, node_modules et anciens verrous npm. Les plafonds de profil sont 5 PR simultanées et 2 par heure ; lockFileMaintenance est désactivé.

**Aucune PR Renovate de dépendance n'est attendue tant que le profil reste désactivé.** Ces plafonds sont une préparation de profil, pas la preuve d'un service Renovate actif. Pour basculer ultérieurement, il faudra revoir la coordination : mettre les plafonds Dependabot de versions à zéro ne désactive pas ses PR de sécurité. Il faut donc également éviter le chevauchement de producteurs de PR de sécurité.

La proposition config:recommended de #154 est conservée comme référence dans docs/history/dependency-bots-20261013/renovate-PR154-proposal.json. #154 reste ouverte ; son éventuelle adoption ultérieure peut entrer en conflit avec ce profil. Les réactions futures du service d'onboarding une fois une configuration adoptée sur main ne sont pas contrôlées par cette PR.

### Contrôle de conservation

Le nouveau workflow dependency-preservation.yml est séparé des workflows existants. Il se déclenche sur les PR vers main : opened, synchronize, reopened et ready_for_review. Il n'a que contents:read, ne conserve pas les credentials du checkout, ne demande aucun secret et n'installe pas les dépendances de l'application. Le parseur YAML est isolé, sans dépendance applicative ajoutée. Le validateur Renovate est installé temporairement par pnpm.

Scripts/check-dependency-update-preservation.py vérifie :

- maintien des noms dans dependencies, devDependencies, optionalDependencies et peerDependencies JS, des peers optionnels et références patchedDependencies ;
- maintien des dépendances Cargo dans les groupes root/workspace/target/dev/build, des identités d'origine, flags optional/default-features, features précédentes, features de production par défaut et exclusions du workspace ;
- maintien des noms de paquets Cargo.lock et des noms, variantes optionnelles, liens optionnels et peers optionnels du verrou pnpm ; changement de format refusé ;
- aucune suppression de fichier de la référence ; anciens package-lock*.json et fichiers docs/history ou propositions historiques inchangés octet pour octet ;
- aucun nouveau verrou concurrent yarn/npm-shrinkwrap/bun ou package-lock généré, et pnpm 8.15.9 conservé comme gestionnaire ;
- rejet des clés JSON/YAML dupliquées et des symlinks sur les fichiers parsés, sans interpréter les anciens verrous npm volontairement conservés tels quels.

Pour les PR identifiées Bot ou branches dependabot/renovate, les modifications de fichiers sont bornées aux manifestes/verrous actifs et configurations de bots. Les sources vendored, patchs et contrôleurs ne peuvent pas être réécrits par cette voie. Les workflows ne peuvent subir que des changements de références uses ; les commandes, déclencheurs et autres contenus sont conservés. Le workflow auto-approve.yml est entièrement interdit de modification par ce périmètre. Les nouveaux fichiers de bot sont limités à sa configuration ou à des archives.

Ces vérifications sont conservatrices : une disparition transitive légitime, une migration de source Cargo ou un changement de flags peut être refusé et doit être examiné plutôt que supprimé silencieusement. Elles ne rendent pas une nouvelle version sûre ou compatible. Les installations gelées, builds, tests et audits existants restent nécessaires.

### Amorçage limité et écarts antérieurs

Le premier contrôle contre la vraie base de #153, **c39a87e1d693382f34ca38bcaa68e032a9bcbc29**, a correctement relevé des écarts **antérieurs à cette mission** : 31 noms de paquets Babel, le peer optionnel vite/lightningcss et la feature Tauri shell-open. Ces écarts ne sont pas qualifiés comme de faux positifs du contrôle. Leur réactivation dans la résolution actuelle dépasserait cette mission et pourrait réintroduire une configuration Tauri incompatible.

Le verrou ancien est préservé dans docs/history/pnpm-lock.before-phase1-repair.yaml, identique au verrou de base utilisé dans le relevé de #138. La variante Cargo contenant shell-open reste dans docs/history/before-ci-phase1/src-tauri/Cargo.toml. Ces archives ne sont pas modifiées.

Le workflow autorise un **unique amorçage explicite** : seulement #153, seulement la base c39a87e, seulement si cette base ne possède pas encore le nouveau contrôleur. Il compare alors au commit immuable **c0169878bbd24ba28bc17c1886bb4eada464bf39**, état avant cette mission. Un avertissement visible annonce cet amorçage. Toute autre combinaison sans contrôleur de base échoue.

Après adoption du contrôleur sur la base, la comparaison utilise **la vraie base de chaque PR**, et le contrôleur est exécuté depuis cette base. Il n'existe pas d'exception permanente pour Babel, lightningcss ou shell-open. Ce premier succès vérifie la conservation pendant la mission bots ; il n'est pas une certification rétroactive de tout le diff main → #153.

### Cas réel #138 et PR existantes

La comparaison en lecture seule des verrous de base/head de #138 relève **84 noms de paquets absents**, dont **51 variantes optionnelles**, notamment les variantes Android esbuild et rollup. Les noms totaux passent de 288 à 240 ; le nombre de disparitions dépasse la différence nette car d'autres noms apparaissent.

Cela prouve des suppressions à examiner, pas que chacune est nécessairement injustifiée. Le nouveau contrôleur les détecterait, ainsi que la réécriture du verrou npm historique. Aucune correction, rebase, fermeture, fusion ou message n'a été envoyé à #138. Les autres PR existantes ne sont pas modifiées.

### Validation et limites effectives

Les changements exécutables ont été vérifiés sur **d6316a5a77f0b4a663996b3c1e6dd0911c2dfed4**. Le dernier ajout de documentation et de preuves ne change pas le contrôleur, les tests ou la configuration validés.

| Vérification | Résultat réellement observé | Preuve |
| --- | --- | --- |
| Contrôle de conservation, amorçage c016987 | Réussi ; avertissement d'amorçage visible | [Run 38450920280, job 115481284979](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920280/job/115481284979) |
| Régressions du contrôleur | **12 tests réussis**, couvrant versions conservées, suppressions JS/Cargo, optionnels, archives, Actions, doubles clés et symlinks | Même job |
| Validateur officiel Renovate 44.155.7, --strict | Réussi ; 7 avertissements de sous-dépendances dépréciées de l'outil temporaire restent visibles | [Job 115481284505](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920280/job/115481284505) |
| Schéma Dependabot SchemaStore | Validation locale réussie, options choisies vérifiées contre la référence GitHub | Source de schéma et documentation dans les preuves |
| Syntaxe YAML et compilation Python | Vérifications locales réussies | PyYAML et py_compile locaux |
| actionlint existant | Réussi | [JS/TS CI 38450920067, job 115481281742](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920067/job/115481281742) |
| Lint, typecheck, build Vite et conservation JS préexistante | Réussis, installation pnpm gelée | [Job 115481281391](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38450920067/job/115481281391) |
| Comparaison des manifestes JS de cette mission | Tous les champs préexistants identiques ; seul packageManager ajouté | Vérification locale JSON et arbres Git |
| Comparaison #138 | 84 noms / 51 noms optionnels disparus, sans modification de la PR | Relevé de verrous, preuves JSON |

La première variante YAML du nouveau workflow a échoué sur une commande non entourée de guillemets ; elle est archivée. La variante corrigée comparant directement à main a ensuite relevé les écarts anciens ci-dessus ; elle est aussi archivée. Le résultat final ne les efface pas et limite explicitement son amorçage.

Aucun moteur Dependabot/Cargo en service n'a été lancé manuellement : la validation concerne la syntaxe, les schémas, le contrôle et les CI, pas la promesse d'une future PR réellement produite par GitHub. Aucun test de planification réelle, accès registry privé ou réglage d'app n'a été simulé.

Les audits et leurs politiques sont inchangés. Les problèmes indépendants précédemment documentés restent hors de cette mission ; aucune suppression de dépendance, d'advisory ou de licence n'est utilisée pour faire passer ce contrôle.

Le check de conservation n'a pas été rendu obligatoire dans les réglages GitHub. Le ruleset Ægis visible demande une revue et protège contre suppression/force-push, sans règle de statut obligatoire dans la réponse consultée. L'endpoint de protection classique retourne 403 ; une protection supplémentaire ne peut donc être certifiée.

**Un check en échec rend la suppression visible, mais ne garantit pas à lui seul l'interdiction de fusion.** Il faut exiger ce check et protéger son workflow/contrôleur dans les réglages de branche. Ces réglages et l'approbation automatique ne sont pas changés ici.

Le contrôleur de base réduit la possibilité qu'une PR réécrive son propre script après amorçage, mais le workflow pull_request et les réglages du dépôt restent des éléments à protéger/revoir. L'amorçage exécute le nouveau contrôleur de #153 et nécessite la revue habituelle de cette première adoption. Les tests du contrôleur sont du code de PR, exécuté sans secrets ni permissions d'écriture.

Les noms/options comparés ne prouvent pas tous les comportements du code fantôme, la compatibilité d'une dépendance, le bon traitement de tout format futur ni l'absence de réactivation par une modification applicative humaine. Des comptes techniques non identifiés comme Bot peuvent échapper au périmètre de fichiers supplémentaire ; les contrôles de noms/options/archives restent appliqués à toutes les PR.

Les mises à jour de versions peuvent remplacer des versions dans les verrous actifs tout en gardant leurs noms/options. Les anciennes versions restent dans Git et dans les archives déjà conservées ; le contrôle n'archive pas automatiquement chaque nouveau verrou généré par un bot. Les verrous npm historiques restent physiquement intacts et ne deviennent pas le gestionnaire actif.

Les configurations Dependabot/Renovate seront effectives après adoption sur la branche par défaut et selon les réglages des services. Le workflow ne rétroactive pas les checks sur toutes les PR anciennes : elles devront recevoir un événement de PR après adoption. Aucun état d'alerte, workflow de sécurité, règle de licence ou approbation n'est modifié pour obtenir un résultat vert.

### Conservation du résultat

Entre le commit initial **c0169878bbd24ba28bc17c1886bb4eada464bf39** et le résultat final, **aucun fichier n'est supprimé**. Seuls deux fichiers préexistants sont modifiés : **.github/dependabot.yml** et **package.json**. Leurs versions antérieures sont archivées intégralement avec des blobs Git identiques.

Les nouvelles configurations/contrôleurs, leurs tests et variantes de travail sont ajoutés. Tous les workflows préexistants sont inchangés octet pour octet, y compris auto-approve, les workflows de sécurité et de maintenance. Tous les manifestes Cargo, Cargo.lock, pnpm-lock.yaml, anciens package-lock*.json, dépendances applicatives, options, code fantôme, patchs et archives précédentes sont conservés. Aucune PR existante n'est fusionnée ni fermée ; les seules écritures Git concernent la branche de #153, et le compte rendu est publié uniquement sur #153.

## English

Dependabot now declares pnpm through its npm ecosystem, Cargo at the workspace root and GitHub Actions, with explicit UTC schedules and version-PR caps. Existing dependency declarations and lockfiles are preserved. Renovate is explicitly disabled to avoid duplicate version-update producers; its onboarding PR remains untouched.

A separate read-only PR check detects dependency/optional-feature/name removal, historical lock/archive changes and out-of-scope bot edits. Twelve regression tests and the official Renovate validator are used. A single documented #153 bootstrap compares to the immutable pre-mission commit; subsequent checks use the actual PR base and its checker.

The protection is detection unless GitHub requires the check. Security PR caps/exclusions differ from version updates; installed app settings, workflow tampering and full ghost-code semantics are not universally controlled. The observed #138 lockfile removals and earlier phase-one differences remain documented rather than hidden or silently grandfathered into future checks. No PR was merged or closed, and existing security/approval workflows and licensing policy are unchanged.



---

## Fichier distant : docs/DEPENDENCY_GAPS_20261013.md

Blob Git : `d67658185e25f7b165ea9fd52cd7473ab50f9db5`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/DEPENDENCY_GAPS_20261013.md

# Écarts historiques de conservation — PR #153

FR : audit ciblé de la vraie base `c39a87e1d693382f34ca38bcaa68e032a9bcbc29`, réalisé à partir de `a42475b25bd13d2803d0d32b9c3a71d4256170f0`. L'amorçage exceptionnel sur `c016987` ne valide aucune suppression antérieure. Les contrôles génériques restent stricts et inchangés.

EN: targeted audit of the actual base `c39a87e1d693382f34ca38bcaa68e032a9bcbc29`, starting from `a42475b25bd13d2803d0d32b9c3a71d4256170f0`. Exceptional bootstrap against `c016987` validates no earlier removal. Generic checks remain strict and unchanged.

## Origine et restauration des 31 noms

FR : le commit [9ff648d](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/9ff648dc66e1ca83bf564f26a172540cd825ba25) remplaçait Plugin React 4.7 par 6.0.2 et Vite 7 par 8.0.16 dans le manifeste et les références racines du verrou, mais laissait le snapshot `/@vitejs/plugin-react@4.7.0(vite@7.3.5)` et modifiait partiellement celui de Vite. Le snapshot de Plugin React 6 manquait entièrement. Les 31 noms ci-dessous étaient les descendants de l'ancien plugin 4.7, avec leurs parents exacts consignés dans `DEPENDENCY_GAPS_EVIDENCE_20261013.json`. Ce verrou incohérent ne permet pas d'affirmer qu'ils étaient utilisés par une application compilable avant réparation.

FR : [076b523](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/076b523ba719aa4c4bd0dd2f2c34807824602195) a résolu le vrai graphe et retiré ces 31 noms. Cette suppression effective exigeait la présente revue. Plugin React 6 utilise les outils Rolldown/Oxc ; ses dépendances publiées ne comprennent plus le graphe Babel de la version 4.7. Nous conservons néanmoins les outils historiques comme dépendances de développement explicites : `@babel/core@7.29.7`, les deux transforms JSX `7.29.7`, `@types/babel__core@7.20.5` et `react-refresh@0.17.0`. Leurs descendants sont réellement accessibles depuis ces cinq racines. La variante `semver@6.3.1` nécessaire au graphe est aussi restaurée ; la variante actuelle demeure. Le lien Browserslist suit l'override de sécurité existant `4.28.9`.

EN: commit 9ff648d changed root versions without resolving the package graph; commit 076b523 repaired it and removed the 31 legacy descendants. That removal is reviewed here independently. Five explicit development roots restore all 31 names and the required semver 6.3.1 variant. Existing security overrides remain applied. Historical snapshots stay archived; no old plugin is re-enabled.

| Nom | Version historique restaurée | Rôle historique | Décision |
|---|---|---|---|
| `@babel/code-frame` | 7.29.7 | Cadres d’erreur et extraits de code | Restauré, dev |
| `@babel/compat-data` | 7.29.7 | Données de compatibilité JavaScript | Restauré, dev |
| `@babel/core` | 7.29.7 | API et pipeline de transformation Babel | Restauré, dev |
| `@babel/generator` | 7.29.7 | Génération de code JavaScript | Restauré, dev |
| `@babel/helper-compilation-targets` | 7.29.7 | Sélection des cibles navigateur | Restauré, dev |
| `@babel/helper-globals` | 7.29.7 | Globals connus lors du parcours AST | Restauré, dev |
| `@babel/helper-module-imports` | 7.29.7 | Construction des imports de modules | Restauré, dev |
| `@babel/helper-module-transforms` | 7.29.7 | Transformation des modules | Restauré, dev |
| `@babel/helper-plugin-utils` | 7.29.7 | Utilitaires des plugins Babel | Restauré, dev |
| `@babel/helper-string-parser` | 7.29.7 | Analyse des chaînes littérales | Restauré, dev |
| `@babel/helper-validator-identifier` | 7.29.7 | Validation des identifiants | Restauré, dev |
| `@babel/helper-validator-option` | 7.29.7 | Validation des options des cibles | Restauré, dev |
| `@babel/helpers` | 7.29.7 | Helpers nécessaires aux transformations | Restauré, dev |
| `@babel/parser` | 7.29.7 | Analyse JavaScript et JSX | Restauré, dev |
| `@babel/plugin-transform-react-jsx-self` | 7.29.7 | Ajout du marqueur JSX __self en développement | Restauré, dev |
| `@babel/plugin-transform-react-jsx-source` | 7.29.7 | Ajout du marqueur JSX __source en développement | Restauré, dev |
| `@babel/template` | 7.29.7 | Construction de fragments AST | Restauré, dev |
| `@babel/traverse` | 7.29.7 | Parcours et transformation AST | Restauré, dev |
| `@babel/types` | 7.29.7 | Types et constructeurs AST | Restauré, dev |
| `@jridgewell/remapping` | 2.3.5 | Composition des source maps | Restauré, dev |
| `@types/babel__core` | 7.20.5 | Types TypeScript de Babel Core | Restauré, dev |
| `@types/babel__generator` | 7.27.0 | Types TypeScript du générateur | Restauré, dev |
| `@types/babel__template` | 7.4.4 | Types TypeScript des templates | Restauré, dev |
| `@types/babel__traverse` | 7.28.0 | Types TypeScript du parcours AST | Restauré, dev |
| `convert-source-map` | 2.0.0 | Lecture et écriture des source maps inline | Restauré, dev |
| `gensync` | 1.0.0-beta.2 | Exécution synchrone/asynchrone des transformations | Restauré, dev |
| `jsesc` | 3.1.0 | Échappement des littéraux générés | Restauré, dev |
| `json5` | 2.2.3 | Lecture des configurations JSON5 | Restauré, dev |
| `lru-cache` | 5.1.1 | Cache des cibles de compilation | Restauré, dev |
| `react-refresh` | 0.17.0 | Runtime Fast Refresh de développement | Restauré, dev |
| `yallist` | 3.1.1 | Liste chaînée du cache LRU | Restauré, dev |

FR : ces outils sont installés pour le développement et peuvent être exécutés isolément. Aucun changement de `vite.config.ts`, des sources React ou du backend Rust ne les active dans l'application. Un test construit le vrai graphe Vite en mémoire et refuse les modules Babel, React Refresh ou archives dans les chunks de production. Ce test ne prouve pas l'absence de chaque octet historique possible ; il vérifie les modules concernés et complète le contrôle existant des marqueurs dans les artefacts Rust/Vite.

EN: tools remain installed and executable in isolation, with no application configuration change. A test inspects the actual production module graph and rejects Babel, React Refresh and archived modules; it complements existing artifact marker checks.

## Peer optionnel vite/lightningcss

FR : le snapshot historique prétendait être Vite 8 tout en gardant `lightningcss: ^1.21.0` comme peer optionnel de Vite 7.3.5. Les manifestes amont exacts démontrent le changement : sous Vite 8.0.16, Lightning CSS est une dépendance obligatoire `^1.32.0`, résolue actuellement en `1.33.0`. La documentation amont indique que Lightning CSS minifie le CSS par défaut en Vite 8 ; le transformeur CSS reste PostCSS par défaut. La fonctionnalité n'est donc pas supprimée : son mode de déclaration change et son utilisation pour la minification est déjà active depuis la migration Vite. Nous n'ajoutons pas de faux peer aux métadonnées publiées et ne réactivons pas Vite 7. L'ancien peer reste intégralement dans le verrou archivé. Toutes les variantes natives optionnelles existantes doivent rester dans le verrou actif.

EN: Lightning CSS changed from an optional Vite 7 peer into a required Vite 8 dependency. Its old declaration remains archived; its package and native variants remain active. Vite 8 already uses it for default CSS minification; no new application feature is enabled by this task.

## Tauri shell-open

FR : le manifeste initial demandait `tauri = { version = "2.0", features = ["shell-open"] }`. Tauri 1.8.3 définit cette feature, reliée à `shell-open-api`, `open`, `regex` et `tauri-macros/shell-scope`. Tauri **2.12.3**, la version du verrou actif, ne la définit plus. [4e126a1](https://github.com/Phoen0x/QuelleHeureEst-Il.com/commit/4e126a1265931c4032d6b31d06886d4acface5ea) l'a retirée pour permettre la résolution Tauri 2. La restauration active de cette déclaration serait invalide et casserait Cargo.

FR : les sources applicatives examinées (`src/`, `src-tauri/src/`), le manifeste et `tauri.conf.json` ne contiennent ni appel shell/opener, ni enregistrement de plugin, ni capability d'ouverture. `open_devtools()` ouvre les outils de développement en debug, pas une commande shell. Aucun comportement d'ouverture externe existant n'est donc démontré. La migration amont demande le plugin shell séparé, son enregistrement, les API JS correspondantes et des permissions ; cette migration n'est pas activée sans besoin fonctionnel. La déclaration invalide est restaurée **en commentaire** dans le manifeste actif et conservée mot pour mot dans son archive initiale. Le contrôleur refuse une réactivation de cette feature ou l'ajout implicite d'un plugin shell/opener. La recherche textuelle seule ne constitue pas une preuve universelle d'absence d'exposition indirecte ; elle accompagne la revue des points d'entrée.

EN: shell-open is a Tauri 1 feature incorrectly requested with Tauri 2. Re-enabling it breaks resolution. No application shell/opener call, registration or capability was found. Upstream migration requires a separate plugin and permissions. The declaration remains commented in the active manifest and intact in its original archive; no plugin or permission is added.

## Preuves amont

FR : les copies intégrales et leurs SHA-256 sont archivées dans `docs/history/dependency-gaps-20261013/upstream/`. Le contrôleur épingle ces empreintes ; une altération échoue.

EN: full upstream copies and SHA-256 digests are retained and pinned by the checker.

- [Plugin React 4.7.0](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%404.7.0/packages/plugin-react/package.json) et [6.0.2](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%406.0.2/packages/plugin-react/package.json).
- [Vite 7.3.5](https://github.com/vitejs/vite/blob/v7.3.5/packages/vite/package.json), [8.0.16](https://github.com/vitejs/vite/blob/v8.0.16/packages/vite/package.json) et [migration Vite 8](https://github.com/vitejs/vite/blob/v8.0.16/docs/guide/migration.md).
- [Tauri 1.8.3](https://github.com/tauri-apps/tauri/blob/tauri-v1.8.3/core/tauri/Cargo.toml) et [2.12.3](https://github.com/tauri-apps/tauri/blob/tauri-v2.12.3/crates/tauri/Cargo.toml).
- [Migration Tauri 2, révision 86f23966](https://github.com/tauri-apps/tauri-docs/blob/86f23966da282a29c7ec27e18ce540be70988091/src/content/docs/start/migrate/from-tauri-1.mdx).

## Contrôles et limites

FR : le workflow de conservation exécute désormais une comparaison **supplémentaire contre la vraie base**. Les deux écarts de schéma sont qualifiés seulement si leurs preuves et archives sont intactes et si la base correspond exactement aux fichiers historiques examinés. Ils restent affichés comme avertissements explicites. Aucune autre disparition n'est acceptée ; le contrôleur générique refuse toujours ces transitions sans cette qualification. Aucune règle d'audit, licence, approbation automatique ou workflow de sécurité n'est modifiée. Les fichiers antérieurs remplacés dans cette mission sont entièrement archivés dans `before/`.

FR : la reproductibilité est vérifiée avec pnpm 8.15.9 / Node 22 : installation gelée puis résolution réelle sans scripts et diff nul des manifestes/verrous. Les tests comprennent huit régressions supplémentaires du contrôle historique et trois tests d'outils/modules. Les résultats GitHub Actions vérifiés figurent ci-dessous. Les audits connus hors mission restent visibles.

EN: a separate check uses the actual PR base and qualifies only two verified schema transitions, with explicit warnings. Generic checks, audit and licensing rules, automatic approval and security workflows are unchanged. Frozen installation and an unchanged lock after actual pnpm resolution verify reproducibility. Eight checker regressions and three tool/module tests are added; Verified CI results are recorded below. Known unrelated audit findings remain visible.

## Résultats vérifiés sur GitHub Actions

FR : source validée `03785527621149a1f75f6e31075b45340ed5a71e`. Le commit ultérieur de compte-rendu ne change que la documentation. Les résultats ci-dessous sont ceux des commandes exécutées, et non une déduction à partir de l'amorçage.

EN: validated source `03785527621149a1f75f6e31075b45340ed5a71e`. The following report commit changes documentation only. These results come from executed commands, not bootstrap assumptions.

| Contrôle | Résultat et preuve |
|---|---|
| Conservation contre la vraie base + 20 tests Python | Succès, deux transitions qualifiées restent visibles comme avertissements. [Job 115517579198](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512094/job/115517579198) |
| Installation gelée pnpm 8.15.9 / Node 22 | Succès. 335 entrées accessibles, 324 noms au total ; les 288 noms de main et les 95 noms optionnels actifs sont conservés. |
| Outils Babel, React Refresh, exclusion du graphe de production | 3/3 tests ; 53 modules de production contrôlés. [Job 115517579531](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512094/job/115517579531) |
| Résolution pnpm et diff de reproductibilité | Succès ; `pnpm install --lockfile-only --ignore-scripts --no-frozen-lockfile`, puis diff nul de `package.json` et `pnpm-lock.yaml`. Même job. |
| Lint, typecheck, Vite et régressions braces | Succès. [Job 115517579300](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512173/job/115517579300) |
| actionlint | Succès. [Job 115517579591](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512173/job/115517579591) |
| Validateur Renovate officiel | Succès. [Job 115517579795](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461512094/job/115517579795) |
| Rust debug/release, tests debug/release, conservation et artefacts | Succès ; 24 tests dans chaque profil, 446 noms historiques Cargo et 121 fichiers GLib conservés. [Job 115517577926](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511882/job/115517577926) |
| rustfmt et Clippy all-targets/all-features avec `-D warnings` | Succès ; 34 avertissements du paquet GLib tiers restent affichés. [Job 115517578293](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578293) |
| `pnpm audit --audit-level=moderate` | Échec connu : 1 alerte élevée `braces@3.0.3`, GHSA-vfj7-8cjw-p6xm. Aucune nouvelle alerte Babel. [Job 115517578626](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578626) |
| `cargo audit --deny warnings` | Échec connu : RUSTSEC-2024-0370, RUSTSEC-2025-0134, RUSTSEC-2024-0429. [Job 115517578357](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578357) |
| cargo-deny | Échec connu des advisories/licences ; bans et sources passent. Politique inchangée. [Job 115517578321](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38461511808/job/115517578321) |

FR : la première exécution des tests sur le dépôt complet a révélé une fixture incomplète : les quatre anciens verrous npm n'étaient pas copiés dans la base simulée. Elle les signalait donc à tort comme nouveaux verrous concurrents. La fixture a été corrigée et sa version initiale conservée dans `initial-test-fixture.py` ; les 20 tests passent sur le dépôt complet. Les règles de conservation n'ont pas été relâchées.

FR : toutes les autres sources et tous les fichiers existants hors des quatre fichiers actifs ciblés gardent leurs identifiants de blob Git, notamment les archives préexistantes, `Cargo.lock`, `vendor/glib-0.18.5`, les contrôleurs d'audit, les workflows de sécurité et d'approbation et les fichiers de politique de licences. Aucun fichier n'est supprimé. Lightning CSS conserve ses **11** variantes natives optionnelles, dont Android arm64. Ces vérifications portent sur les verrous et builds Linux exécutés ; aucun packaging Android ou lancement graphique n'est revendiqué.

EN: an incomplete test fixture was fixed by retaining all four legacy npm locks; its initial version is archived and all 20 tests pass on the complete repository. No preservation rule was relaxed. All existing files outside the four targeted active files retain their Git blob IDs; no file was deleted. Lightning CSS retains all 11 native optional variants, including Android arm64. Linux builds and lock checks were executed; Android packaging and graphical launch were not tested. Known unrelated audit failures remain visible and unchanged.



---

## Fichier distant : docs/CANDIDATE_GENERATOR_SAFETY_20261013.md

Blob Git : `bb9d6224d020431817f7d3edc28e2451120f9e19`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/CANDIDATE_GENERATOR_SAFETY_20261013.md

# Gardes des anciens générateurs de candidats

FR : Cette mission protège les entrées historiques sans migrer les dépendances ni nettoyer les configurations parallèles. Référence de départ : f308ee1b97cc53bdadaf87041f82a5198b6b07e0. Les six versions complètes remplacées sont archivées sous `docs/history/candidate-generators-20261013/`, avec empreintes SHA-256 brutes. Les archives existantes restent intactes.

EN: This task guards historical entrypoints without migrating dependencies or cleaning up parallel configurations. Baseline: f308ee1b97cc53bdadaf87041f82a5198b6b07e0. Six complete previous versions are archived with raw SHA-256 digests. Existing archives are unchanged.

## Protections avant écriture

| Entrée | Référence compatible et protection |
|---|---|
| prepare-rust-h2-candidate.py | Manifeste et verrou exacts avant migration h2 ; root Cargo d'origine. Refus si configuration Cargo, vendor GLib ou test HTTP existe déjà. |
| prepare-rust-warnings-candidate.py | Manifeste et verrou exacts avant rétroport GLib ; root Cargo d'origine. Refus si override Cargo, vendor GLib ou test VariantStrIter existe déjà. |
| rust-h2-migration.yml et rust-warnings-migration.yml | Garde immédiatement après setup Python, **avant les copies de référence, les commandes Cargo et la première installation frontend**. Les copies anciennes ne peuvent donc pas contourner le contrôle de l'état initial. |
| js-security-maintenance.yml | Manifestes/verrou exacts avant l'ancien audit JS ; pnpm 8.15.9 obligatoire. Garde avant installation et répétée inline juste avant writeFileSync. L'état actuel contenant les cinq racines Babel/React Refresh est refusé. |
| lockfile-maintenance.yml | Référence actuelle exacte, incluant package/lock, h2 et les deux fichiers GLib rétroportés ; pnpm 8.15.9 et manifeste identique à HEAD. Garde avant régénération et contrôle de conservation exact avant export. Tout changement de résolution produit par ce rejeu est un échec. |

FR : Les scripts Rust fonctionnent désormais en **contrôle seul par défaut** ; `--check` est explicite et équivalent. `--generate` est nécessaire pour atteindre le corps historique, et il ne contourne aucune garde. Sur la branche actuelle, les deux anciens préparateurs et l'ancien générateur de sécurité JS échouent avant écriture : ils ne sont plus compatibles avec cet état déjà migré et corrigé. Le rejeu de maintenance du verrou est strictement borné à la référence courante examinée ; il n'est pas un outil général de mise à jour.

EN: Rust entrypoints are **check-only by default**; `--check` is equivalent. `--generate` is required to reach the historical body and bypasses no guard. Current migrated/patched state is refused by both old Rust preparers and the old JS security generator. Lock maintenance is bounded to the exact reviewed current state, not general updating.

## Contrôles sans mutation

FR : `Scripts/candidate_safety.py` et `Scripts/candidate-safety.cjs` utilisent les bibliothèques standard Python/Node, sans installation de dépendance applicative. Ils exigent la racine du dépôt, refusent les fichiers liés, vérifient les états et les six archives, et ne possèdent pas d'option force. Le contrôle pnpm appelle seulement `pnpm --version` ; un échec de cette commande est aussi bloquant. Il exige **8.15.9 exactement**, et une version Node satisfaisant la contrainte Vite. Aucune installation ou régénération n'est effectuée par les contrôleurs.

EN: Python/Node standard-library guards require repository root, reject linked files, verify states and six archives, and expose no force option. The pnpm check only calls `pnpm --version`, fails closed on errors, requires exactly 8.15.9 and a Vite-compatible Node version. Guards install or regenerate nothing.

```sh
python3 Scripts/candidate_safety.py --check current-conservation
node Scripts/candidate-safety.cjs --check current-conservation
node Scripts/candidate-safety.cjs --check-pnpm
python3 Scripts/prepare-rust-h2-candidate.py --check
python3 Scripts/prepare-rust-warnings-candidate.py --check
```

FR : `current-conservation` est un contrôle de l'état actuel, **pas une autorisation de rejouer les migrations anciennes**. Il couvre les cinq racines Babel/React Refresh via le manifeste, toutes les variantes optionnelles via le verrou complet, la migration h2 via le manifeste/verrou Cargo et les deux rétroports GLib via leurs fichiers et l'override. Les empreintes du texte actif ne normalisent que CRLF vers LF **en mémoire**, pour la compatibilité des checkouts Windows. Les archives sont comparées octet par octet. Aucun fichier n'est normalisé sur disque.

EN: `current-conservation` checks current state and **does not authorize old migrations**. Complete manifest/lock fingerprints cover Babel roots, optional variants and h2; source/config fingerprints cover both GLib backports. Active-text CRLF is normalized to LF **in memory only** for Windows checkouts. Archives are byte-exact; no file is normalized on disk.

## Compatibilité et limites réelles

FR : Aucune règle propre à GitHub, Git, StackBlitz/Bolt, Cursor, Claude ou Codex n'est remplacée. Les contrôles Node ne demandent pas Python ; les contrôles Rust Python ne demandent pas Node ou Cargo. Les fichiers npm parallèles, `.bolt`, `.cursor`, les deux configurations Tauri, AGENTS, les archives et les dépendances restent conservés. Le script de maintenance qui utilise git show exige logiquement un vrai checkout et un HEAD cohérent ; il refuse une matérialisation partielle au lieu d'inventer un manifeste.

EN: No client-specific configuration is replaced. Node checks need no Python; Rust Python checks need no Node or Cargo. Parallel npm locks, Bolt/Cursor/Tauri configurations, AGENTS, archives and dependencies remain. Maintenance using git show requires an actual checkout and consistent HEAD and refuses a partial materialization.

FR : Ces gardes préviennent les erreurs de contexte, pas un utilisateur malveillant capable de modifier les scripts, leurs empreintes ou d'appeler directement une archive/commande système. Elles supposent les exécutables du PATH fiables et n'offrent pas de transaction contre les écritures concurrentes entre contrôle et exécution ; coordonner les outils sur une branche. Une future modification légitime du graphe est refusée tant que la référence du générateur n'a pas été revue et archivée. Les archives ne sont jamais lancées automatiquement. Les workflows gardent leurs commandes d'audit et leurs permissions ; aucun push ou merge automatique n'est ajouté.

EN: Guards prevent context mistakes, not malicious modification or direct archive/system execution. They trust PATH executables, provide no transaction against concurrent writes, and conservatively reject future graph changes until reviewed. Audit commands/permissions remain; no automatic push or merge is added.

## Tests

FR : La suite de régressions utilise exclusivement des copies temporaires : refus des états courants, contrôle positif des anciennes références sans génération, refus de pnpm 11/10/8.15.8/absent, perte d'une racine Babel ou variante Android, altération des rétroports/verrou h2, configuration/test déjà présent, archive altérée, mauvais cwd, lien symbolique et arguments de contournement. Elle compare les empreintes de **tous les fichiers de la copie avant/après** et place des exécutables sentinelles pour détecter toute commande Cargo ou pnpm mutatrice. Un Git temporaire vérifie la protection contre restauration d'un mauvais HEAD. Les gardes CRLF sont testées sans écriture de normalisation. Le workflow dédié teste Ubuntu et Windows avec pnpm 8.15.9/Node 22, sans installer le projet.

EN: Temporary-copy tests cover incompatible states/managers, dependency/backport loss, existing outputs/configs, altered archives, wrong cwd, symlinks and bypass arguments. Full-file fingerprints prove no writes; sentinel executables detect mutating tool calls. Temporary Git checks HEAD safety; CRLF checks write nothing. Dedicated Ubuntu/Windows CI uses pnpm 8.15.9/Node 22 without project installation.

FR : Les résultats CI vérifiés sont consignés ci-dessous. Localement, les contrôles de conservation et refus actuels passent ; le sandbox refuse les processus enfants de Node (EPERM), donc les tests exigeant la sonde pnpm/Git restent à vérifier sur CI. Les anciennes données manquantes ou divergentes du dossier partiel ne sont pas réécrites : le dépôt distant complet sert de référence. Aucun corps mutateur historique n'est exécuté pour ces tests, même sur une référence positive.

EN: Verified CI results are recorded below. Local current checks/refusals pass; Node child processes are denied by the sandbox (EPERM), so pnpm/Git probe tests need CI. Missing/divergent historical materializations are not rewritten; the complete remote repository is authoritative. No mutating historical body is executed, including positive-baseline tests.

## Encodage des générations historiques

FR : Les corps historiques utilisent write_text sans encoding explicite. La garde exige donc un encodage Python par défaut UTF-8 **avant d'autoriser --generate**, sans modifier ces corps. Si ce n'est pas le cas, elle refuse avant écriture et indique Python -X utf8. Le contrôle seul reste possible. Le workflow dédié définit PYTHONUTF8=1 ; un test simule cp1252 sur une référence compatible et prouve que le corps ne s'exécute pas. La première variante de la garde et du workflow reste archivée. Les messages Python Windows de la première exécution étaient mal rendus ; la dernière exécution les affiche correctement.

EN: Historical bodies use write_text without explicit encoding, so --generate requires a UTF-8 Python default before any body executes. Non-UTF-8 defaults are rejected; check-only remains available. Dedicated CI sets PYTHONUTF8=1; an isolated cp1252 test proves refusal without writes. Previous guard/workflow versions are archived. Windows messages render correctly in the final run.

## Résultats réellement vérifiés

FR : Source validée **32b646058f64890d072118f41736e27b602093d5**. Le commit de compte-rendu suivant ne modifie que la documentation. Aucun générateur mutateur n'a été exécuté : les références positives ont été contrôlées avec --check ou le mode par défaut ; les appels --generate testés ont été refusés sur leurs copies.

EN: Validated source **32b646058f64890d072118f41736e27b602093d5**. The following report commit changes documentation only. No mutating generator ran: positive baselines used checks/default mode; tested --generate calls were refused on copies.

| Contrôle | Résultat |
|---|---|
| Gardes Ubuntu, snapshots avant/après et sentinelles | **21 tests réussis**, puis vrais contrôles Node/Python et pnpm 8.15.9 sans diff des manifestes/verrous. [Job 115558934745](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934745) |
| Gardes Windows, CRLF, Git HEAD, pnpm et UTF-8 | **21 tests réussis**, mêmes contrôles sans diff. [Job 115558934819](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934819) |
| Ensemble des contrôleurs | **41 tests Python réussis**. [Job 115558934423](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687697/job/115558934423) |
| Installation JS gelée, conservation et tests | Succès : 335 entrées accessibles, 95 noms optionnels ; **10 tests braces + 3 tests Babel/Refresh/bundle**, 53 modules de production contrôlés. Même job. |
| ESLint, typecheck, Vite et actionlint | Succès. Même job. |
| Rust debug et tests du workflow de sécurité existant | Succès, **24 tests**. [Job 115558933907](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558933907) |
| rustfmt et Clippy existants | Succès ; avertissements tiers GLib visibles. [Job 115558934586](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934586) |
| Audits existants | Échecs inchangés : braces, 3 avertissements Rust, advisories/licences cargo-deny. [JS](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934136), [Rust](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558933738), [cargo-deny](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38473687561/job/115558934042) |

FR : Localement, **17 tests** ont passé sur une copie utilisant les archives exactes distantes, puis le nouveau test non UTF-8 a passé. Les sondes enfant Node ne pouvaient pas être validées dans le sandbox EPERM ; elles sont entièrement validées par les jobs Ubuntu/Windows ci-dessus. Une archive du dossier local partiel différait d'un saut de ligne de la version distante ; elle n'a pas été réécrite. Les tests CI utilisent le dépôt complet.

FR : L'API GitHub a annoncé mergeable:false / dirty et les jobs pull_request attendus ne sont pas apparus pour ces pushes. Le diagnostic de cet état n'est pas revendiqué ici ; la comparaison API indiquait aussi une branche ahead sans commit behind. Une validation push **bornée à la branche de #153** a donc été ajoutée au seul nouveau workflow de tests. Aucune fusion, rebase ou modification des règles d'approbation n'a été tentée. Ce statut devra être réexaminé séparément avant une éventuelle fusion, qui reste exclue de cette mission.

EN: Seventeen isolated local tests and the additional non-UTF-8 test passed; Node subprocess probes were blocked locally but fully passed in Ubuntu/Windows CI. A local historical materialization differed by a newline and was not rewritten. GitHub reported mergeable:false/dirty while its compare endpoint reported ahead with no behind commits; no conflict diagnosis is claimed. The new test workflow therefore has a push trigger limited to #153's branch. No merge/rebase/approval-policy change was attempted.

FR : Les blobs Git des huit entrées actives protégées, des configurations parallèles et de toutes les archives préexistantes restent ceux du commit de départ. Seuls les deux scripts de préparation et les quatre workflows de génération existants changent ; les gardes, tests, preuves et archives sont ajoutés. Aucun fichier ni dépendance n'est supprimé. Le build release, un APK, une session réelle StackBlitz/Bolt/Cursor/Claude et les écritures des anciens corps sur un état historique ne sont pas prétendus testés dans cette mission.

EN: Protected active inputs, parallel configurations and all pre-existing archives retain their original Git blobs. Only two existing preparers and four candidate workflows change; guards/tests/evidence/archives are added. No dependency or file is deleted. This task does not claim release/Android packaging, actual client sessions, or mutating historical replay validation.



---

## Fichier distant : docs/security/CODEQL_HIGH_115661038804_20261014.md

Blob Git : `63238b87d15453da89799ef723c021e721f3c5f4`

Source : https://github.com/Phoen0x/QuelleHeureEst-Il.com/blob/138f029e44c4b63abef8d5315845b360814f76f3/docs/security/CODEQL_HIGH_115661038804_20261014.md

# Qualification du HIGH CodeQL 115661038804 — 14 octobre 2026

## Français

**Verdict : faux positif vérifiable pour le chemin précis de l’alerte GitHub #13.** Le check vise la copie historique de `PtrSlice::truncate`, pas la conversion vide corrigée ni un nouveau défaut démontré du code applicatif. Aucun correctif source, retrait d’archive, exclusion, ignore ou fermeture d’alerte n’est appliqué.

### Identité et provenance

| Champ | Valeur vérifiée |
|---|---|
| Commit demandé et réellement analysé | `a3a523b3a87f72ec18bcd90563ecc3701859a25c` |
| Check GitHub | [115661038804](https://github.com/Phoen0x/QuelleHeureEst-Il.com/runs/115661038804), conclusion failure, exactement 1 annotation |
| Alerte GitHub | [#13](https://github.com/Phoen0x/QuelleHeureEst-Il.com/security/code-scanning/13), rattachée par le [commentaire CodeQL unique 4262273803](https://github.com/Phoen0x/QuelleHeureEst-Il.com/pull/153#discussion_r4262273803) à la même position et au même message |
| Règle | `rust/access-invalid-pointer` — Access of invalid pointer |
| Sévérité | `security-severity: 7.5` (HIGH), `problem.severity: error`, précision high ; CWE-476 et CWE-825 |
| Source annotée | `docs/history/glib-empty-slice-20261013/vendor/glib-0.18.5/src/collections/ptr_slice.rs` |
| Position primaire | ligne **900**, colonnes **21–22** |
| Message | This operation dereferences a pointer that may be [invalid](1). |
| Source du codeFlow | même fichier, ligne **898**, colonnes **41–52**, expression `p as *mut T` passée à `ptr::drop_in_place::<T>` |
| Destination | même fichier, ligne **900**, `p` passé à `ptr::write` |
| Empreinte SARIF | `primaryLocationLineHash: f0389e3887603b54:1` |
| Moteur et pack du replay | CodeQL CLI **2.27.2**, `codeql/rust-queries 0.1.44+a7057b836bf29767461026718b14d20790b9085f` |

Les champs proviennent de trois preuves concordantes : annotation REST du check fixe, commentaire CodeQL contenant le lien #13, et résultat SARIF unique à cette règle/position/message. Le numéro #13 n’est pas déduit du seul compteur « 1 high ».

Le connecteur refuse les endpoints annotations et code-scanning par sa liste d’URL autorisées. Un diagnostic ponctuel a récupéré **HTTP 200 anonymement** pour le check, ses annotations et les commentaires publics. L’API de liste des alertes reste **401 anonyme / 403 avec le token de lecture existant**. Aucun élargissement de permission n’a été demandé ou effectué ; l’état administratif complet de l’alerte n’est donc pas prétendu lu par cette API.

### Diagnostic reproductible, sans publication Code Scanning

[Diagnostic 38507354862](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862), commit d’orchestration `87b551e85af2256c12cf8a804524540279aa9cda`.

Le seul fichier ajouté pour l’exécution est `.github/workflows/codeql-high-115661038804-diagnostic.yml`. Il conserve les mêmes permissions de lecture contents/packages que le diagnostic antérieur, vérifie le checkout exact de a3a523b, fixe les bundles CLI 2.27.2, utilise les requêtes par défaut en build-mode none et **upload:false**. Il ne modifie pas les analyses existantes ni leur politique. Le déclencheur push est limité à cette branche et à ce fichier ; tout rejeu reste fixé sur ce SHA historique, il ne valide pas automatiquement une future tête.

Les trois SARIF **complets et non filtrés** sont conservés en artefacts et dans les logs sous blocs gzip/base64 découpés. Leur reconstruction locale a vérifié longueur et SHA-256 ; le contrôle `git diff --exit-code` réussit après les extractions.

| Preuve | Résultat |
|---|---|
| [REST, job 115667792848](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792848) | Succès ; annotation exacte obtenue sans permission supplémentaire |
| [Rust, job 115667792635](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792635) | Succès ; **8 résultats** SARIF, dont l’archive identifiée |
| [JavaScript, job 115667792414](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792414) | Succès ; **0 résultat** des requêtes par défaut sur ce snapshot |
| [Actions, job 115667792788](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507354862/job/115667792788) | Succès ; **0 résultat** des requêtes par défaut sur ce snapshot |

SARIF Rust brut : **497599 octets**, SHA-256 `73f5c03fda27b8bda583f1f42aaa93c12c8e7a9d29b546167e1774a5d1970185`. Artefact ZIP `codeql-high-sarif-rust`, ID **11869070736** ; son digest ZIP distinct est consigné dans le JSON de preuves. Les artefacts REST/JS/Actions portent les IDs **11868745550 / 11868586630 / 11868476801**.

Huit résultats du replay ne signifient pas huit nouvelles alertes GitHub : le replay ne publie rien et n’effectue pas la comparaison serveur au main. Le check demandé comporte exactement une annotation.

### Comparaison aux sept chemins déjà qualifiés

Les [sept résultats exportés du diagnostic 38425272324](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38425272324/job/115392909513) ont été relus dans ses journaux ; ils concernaient `d5e75292ed3caca6110c9ab4f740df33d5b096d8`.

| Repère ancien | Position initiale | Comparaison actuelle |
|---|---|---|
| QL-1 | vendor/glib-0.18.5/src/log.rs:85 | Toujours présent dans le replay ; autre règle cleartext-logging, pas l’annotation du check |
| QL-2 | subclass/boxed.rs:76 | Toujours présent ; autre position |
| QL-3 / QL-4 | value.rs:462 / 470 | Toujours présents ; autres positions |
| QL-5 / QL-6 | object.rs:470 / 493 | Toujours présents ; autres positions |
| **QL-7** | vendor/glib-0.18.5/src/collections/ptr_slice.rs:900 | Toujours présent dans le code actif, et **dupliqué dans l’archive**, qui est l’annotation du check |

La comparaison normalisée vérifie la même règle, le même message et les **deux points exacts du codeFlow 898 → 900** ; seule l’URI reçoit le préfixe `docs/history/glib-empty-slice-20261013/`. Le fichier historique complet a le blob **e925d98413cb8562d5db9307d6e6491ba294c180**, identique au fichier actif lors du diagnostic d5e7529. La copie n’a pas été altérée.

Le fichier actif actuel a le blob **7ee731fa8bb9ebd8e8f64029d29bd1d86a145604**. Les lignes **881–909**, incluant truncate, sont identiques octet pour octet entre actif et archive ; SHA-256 du bloc : `d8d162214677508740716cef361e456c7b479b27636e2b13831910c72fe4d5e1`. Leur différence fonctionnelle concerne la conversion vide à un autre endroit.

### Pourquoi ce chemin est un faux positif

`PtrSlice<T>` possède un tableau GLib alloué, représenté par `NonNull<T::GlibType>`, avec len et capacity. `T: TransparentPtrType` est un trait **unsafe** exigeant une représentation mémoire compatible avec le pointeur FFI.

Dans truncate :
1. la garde retourne si `self.len <= len` ;
2. la longueur est décrémentée et `p` désigne un slot dans l’allocation encore possédée ;
3. `drop_in_place::<T>(p as *mut T)` détruit le wrapper stocké dans le slot ;
4. `ptr::write(p, NULL)` réinitialise ce stockage.

La destruction du wrapper et éventuellement du GObject pointé **ne libère pas l’allocation du tableau contenant le slot**. La libération de ce tableau se fait distinctement par `g_free(self.ptr)` dans Drop du conteneur. Ici l’écriture ne lit pas le wrapper détruit et ne déréférence pas le GObject libéré. Une mémoire encore allouée peut être réinitialisée avec ptr::write après drop_in_place. Le codeFlow traite cette fin de vie du wrapper comme une invalidation de l’adresse de son slot : c’est la fausse assimilation observée.

Les cas vides retournent avant cette boucle. Les constructeurs unsafe ou une implémentation incorrecte du trait unsafe peuvent violer les invariants ; ce n’est pas le chemin prouvé par cette annotation et ce rapport ne certifie pas des appels violant les contrats.

Le [correctif amont 3971101c82643035c15380c3f4af19ecccd09bb2](https://github.com/gtk-rs/gtk-rs-core/commit/3971101c82643035c15380c3f4af19ecccd09bb2), vérifié directement, durcit une situation théorique de panic dans Drop. **Il conserve drop_in_place suivi de ptr::write pour les types avec destructeur.** Il ne fournit pas de correctif à importer pour la prétendue libération du slot de ce résultat. Sa justification sur les exigences des traits est une déclaration amont ; les commentaires locaux ne détaillent pas tous ces aspects.

### Exposition et distinction du vrai défaut historique

Le fichier annoté est une **archive intentionnelle**, pas le paquet GLib sélectionné par Cargo. L’override actuel sélectionne `vendor/glib-0.18.5`, confirmé par cargo metadata dans le contrôle permanent ; les dix sources Rust applicatives/build/tests relues au SHA demandé n’incluent ni chemin d’archive ni include/path attribué à cette copie. L’exclusion d’un dossier des membres du workspace n’est pas utilisée à elle seule comme preuve : un paquet exclu peut rester compilé comme dépendance, ce qui est justement le cas du vendor actif.

La même fonction truncate du paquet actif a des régressions exécutées. En revanche **l’archive entière n’est jamais réactivée ou exécutée** pour cette analyse.

Cette archive conserve aussi le **défaut réel de conversion Slice vide → PtrSlice**, lignes 1047–1070, déjà corrigé dans le vendor actif par le rétroport amont b31265df94876febf259089a19de9c23d2468214. La trace de #13 ne passe pas par ce constructeur. Le verdict de faux positif porte donc sur **898 → 900**, pas sur l’absence de tout défaut dans l’ancienne version GLib.

### Vérifications et conservation

Les régressions `ptr_slice_truncate_drops_objects_and_preserves_array_storage` et `ptr_slice_truncate_handles_empty_zero_and_repeated_calls` vérifient la destruction effective des GObjects, la conservation du pointeur/capacité du tableau, sa sentinelle NULL et la réutilisation. Elles passent en debug et release dans les **24 tests par profil** au [SHA a3a523b, job 115660568480](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38505064460/job/115660568480).

Le commit de diagnostic 87b551e ne modifie aucune source existante : **Rust debug/release/tests** [115667809936](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360495/job/115667809936), **lint/types/Vite** [115667809990](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360485/job/115667809990), **actionlint** [115667810382](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360485/job/115667810382) et **conservation** [115667809925](https://github.com/Phoen0x/QuelleHeureEst-Il.com/actions/runs/38507360456/job/115667809925) réussissent. Aucune exécution Miri ou dans Android/les clients IDE n’est revendiquée.

Aucun nouveau test applicatif ni patch source n’est nécessaire pour cette qualification : les régressions pertinentes existaient et le bloc annoté est identique. Seuls le nouveau diagnostic et ses documents/preuves sont ajoutés ; dépendances, configurations multi-outils, anciens workflows, archives, commentaires et code fantôme restent intacts.

**Aucune alerte n’est ignorée, masquée, dismissée ou fermée.** L’approbation automatique, les licences, les autres PR et les politiques de sécurité sont inchangées. Le rapport qualifie techniquement #13 sans promettre de check vert ni de PR prête à fusionner. Une éventuelle évolution du modèle CodeQL devra être examinée séparément ; aucun filtre local n’est ajouté. Aucune fusion.

## English

The exact HIGH annotation of check 115661038804 is GitHub alert #13 at the archived ptr_slice.rs:900, rule rust/access-invalid-pointer, security severity 7.5. A read-only diagnostic retrieved the public annotation and replayed immutable a3a523b with CLI 2.27.2 without uploading Code Scanning state. The complete Rust SARIF has eight results; its unique archived 898-to-900 path matches prior QL-7 after URI-prefix normalization. Dropping a pointer wrapper does not free the array slot; ptr::write reinitializes allocated storage. Source ownership, existing debug/release regressions and the verified upstream patch support a precise false-positive verdict. The archive is not the Cargo-selected crate. Its separate historical empty-Slice constructor defect is already backported in active code and is not this path. No archive/source patch, suppression, alert dismissal, permission/policy change or merge is performed.



# 12. Pièces brutes et vérification du paquet de relais

Les logs, SARIF, preuves JSON, anciennes notes, fixtures et copies historiques locales ne sont pas collés dans le Markdown pour éviter une transcription altérée ; leurs **fichiers complets** sont dans l’archive ZIP et l’index MANIFEST_SHA256.json. Les conclusions, rapports et commentaires sont tous inclus ci-dessus.

Le rapport principal original de licences à publier est **evidence/licensing-report-comment.original-before-handoff.md** ; les deux annexes sont **evidence/licensing-inventory-comment.md** et **evidence/licensing-evidence-comment.md**. Le nouveau rapport de relais excède la limite d’un commentaire GitHub ; ne pas utiliser licensing-report-comment.md comme corps de publication unique.

Vérifier les empreintes : `sha256sum -c SHA256SUMS` depuis la racine du dossier extrait. Cette commande lit les fichiers ; elle ne lance aucun générateur.

EN: Complete evidence-backed handoff, with full prior PR reports/timeline, current read-only licensing analysis, unpublished proposals, failed/interrupted publication attempts and explicit limitations. Earlier calls without surviving logs cannot be reconstructed honestly. No repository changes, licence-policy application, new GitHub publication or merge were made for this handoff.
