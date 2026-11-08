# Plan de correction de confidentialité et d'intégrité de #188

**27 octobre 2026 — diagnostic et propositions uniquement. Aucun fichier du dépôt modifié ; aucune écriture GitHub.** Les extraits et le manifeste joints sont des brouillons temporaires, pas une correction appliquée ni une preuve de publication.

## 1. Synthèse et verdict

Le **NO-GO de fusion de #188 en l'état demeure**. Un correctif documentaire limité est réalisable sans changement applicatif : reformuler les citations contextualisées, préciser les limites de la mémoire et de la collecte, et ajouter un manifeste de validité sans toucher à la capture brute.

**GO sous conditions pour faire relire ce plan**, pas pour l'appliquer. Conditions : choix explicite sur le risque des anciennes versions publiques et la conservation des originaux ; validation des reformulations par ChatGPT V4 ; autorisation ultérieure de l'utilisatrice ; contrôles au SHA réel du futur correctif. Si l'objectif exige que les anciennes versions deviennent inaccessibles au public, un commit documentaire ordinaire ne suffit pas : le plan sans réécriture ne peut pas promettre cet objectif.

Un prénom, pseudonyme ou crédit public ne prouve pas une fuite grave. Les 33 mentions repérées restent des attributions à minimiser, **pas 33 secrets ni 33 identités civiles établies**. Le blocage démontré est le contexte de réponses de conversation et de mémoire externe publiées sans filtrage impersonnel suffisant, plus l'affirmation de validité/confidentialité trop générale des données. Aucun P0 effectif établi ; aucune rotation de secret prescrite sur la base d'un faux positif.

## 2. Références, faits et hypothèses

| Référence | Valeur vérifiée au début |
|---|---|
| main | 8a1505d78452aae2bde18d6693e97bcb9b3793e8 |
| #188, branche docs/audit-pr-20261023 | 202f0f7b03c74c9c00177d113361b2166c27fe9c |
| #189 | fusionnée, HEAD 1265c00e1b1f1f7a3f5a7ec457dcfc92686367b0 |
| merge-base main/#188 | ae600a6f0971f5e2d40f5d95ee5b447778d2d439 |

L'API de la PR rapporte encore base.sha=ae600a6f… pour base.ref=main ; cette valeur n'est pas substituée au HEAD de main contrôlé séparément. Le diff de PR est toujours 15 fichiers ajoutés, 0 modifié/supprimé, tous réguliers 100644. Simulation Git locale sans index/checkout : arbre a0abfa92707766db8cdeeb3e0493d540d1d2c08a, 408 fichiers, aucun conflit, les 393 fichiers du main actuel conservés. Aucun merge GitHub n'est effectué.

Consignes actuelles relues/identifiées par les blobs : AGENTS 7a9c69e15170e2be622f1b3e3b719fc42bae90b2 ; contrat 681dc6b97274d18b01a8bfa147161402d8dc7179 ; confidentialité 9178fd1f5c62c36c6bcae0275c26d26a4a2b533d ; index 5ad1ff6fdf55061e6cd5ecde794b433c4f092a33. Pas de règle fusionnée supposée à partir d'une simple conversation.

Preuves précédentes retrouvées : les **42 fichiers de preuve** du manifeste local de l'audit précédent ont les empreintes attendues. Les 118 membres extraits, 43 lignes qualifiées de chemins et les 15 fichiers introduits sont disponibles. Réutilisation de preuves exactes, sans rejouer la grande campagne ni supposer des artefacts disparus.

**Faits vérifiés :** les documents attribuent des décisions et citent des réponses ; une mémoire externe est décrite ; files-153.json est invalide ; les trois pages séparées sont valides et leurs 276 identifiants correspondent au SHA historique de #153.

**Non démontré :** identité civile derrière le nom/alias, caractère non public du nom pris isolément, existence d'une destination privée durable déjà approuvée, consentement couvrant chaque citation dans une autre conversation, effacement possible de toutes les copies, absence absolue de secrets inconnus. Aucun contenu inaccessible de conversation ou de mémoire externe n'a été lu. Les éléments actuels ne justifient pas d'affirmer une fuite critique.

## 3. Recherche officielle préalable et limites d'accès

Sources effectivement lues le 27 octobre :

1. **GitHub, Removing sensitive data from a repository** : https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository ; source github/docs, blob 8776b7585cf84b41aff8bc62c65876503481ff8f. Les anciennes données restent accessibles par SHA, PR, clones/forks/caches ; une réécriture change les SHA, signatures, revues et références et comporte un risque de réintroduction. Support n'est pas une garantie de purge de données non sensibles. Rotation préalable seulement si un vrai secret est confirmé. Aucune commande destructive du guide n'est exécutée.
2. **Git officiel, git-filter-branch** : https://git-scm.com/docs/git-filter-branch ; source git/git, blob 80a55b37064e5df56d35870e96cbb5c006a0932a. Le guide déconseille cet outil, explique les nouveaux identifiants et les références originales conservées ; ce n'est pas une instruction de l'utiliser ici.
3. **Git officiel, git-gc** : https://git-scm.com/docs/git-gc ; blob 5788a432155bc0e902aefe10a51182fd5a204bc3. Les objets encore référencés/reflogs et les autres clones ne disparaissent pas parce qu'un fichier courant est remplacé. Aucun gc/prune/reflog modifié dans cette mission.
4. **NIST SP 800-53 rev.5, catalogue OSCAL officiel usnistgov/oscal-content** : https://github.com/usnistgov/oscal-content/blob/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json . Texte lu via le raw officiel (10 448 237 octets, SHA-256 64ca6b4161de51ab6af098a7d101d326f14c95e1abf721396cd8a049e8115eeb). AU-3 précise la fonction de provenance des logs ; AU-3(3) limite les éléments personnels à ceux nécessaires identifiés par l'évaluation du risque ; AU-9 protège les informations d'audit contre l'accès/modification/suppression non autorisés ; AU-11 demande une rétention définie selon les besoins. Ce sont des références de bonnes pratiques, pas une certification de conformité ni une durée légale imposée à ce projet.
5. **RFC 8493, BagIt 1.0** : https://www.rfc-editor.org/rfc/rfc8493.html ; SHA-256 du document reçu f801a6d8685e3910354079fe2194b223f574343b74f0897d505a32bf313925f2. Distingue manifestes de fichiers, vérification d'empreintes et validité d'un paquet ; ses garanties contre la corruption ne sont pas une authentification contre un adversaire actif. Le plan s'en inspire pour des manifestes simples sans prétendre transformer l'archive en BagIt conforme ou introduire un nouvel outil.

**Limites explicites :** pages CNIL « tracer les opérations » et « six grands principes » : HTTP 403 ; page NIST IR 8387 : 403 ; URL EDPB essayée : 404 ; EUR-Lex : 202 avec corps vide, donc texte non consulté. Aucun contournement TLS, restriction ou authentification, aucun avis juridique déduit de pages vides. Le catalogue NIST a été utilisé comme autre source officielle accessible ; son contenu n'avait pas été retourné par le connecteur sur ce gros fichier. Sources et erreurs chronométrées conservées. Accès externes bornés ; limite d'annulation du connecteur GitHub signalée, sans écriture ou retry de mutation.

## 4. Comparaison des approches

| Approche | Efficacité | Limites et conséquences | Décision proposée |
|---|---|---|---|
| A — avertissements/corrections additifs seuls | Suffit à expliquer la capture invalide et à préserver exactement les preuves | Ne réduit pas l'exposition des citations/attributions dans les documents courants si les originaux restent l'entrée publique principale | Retenir pour l'intégrité ; insuffisant seul pour les passages de conversation contextualisés |
| B — copie publique expurgée, original privé | Conserve une preuve exacte sous accès restreint et une version publique utile | Il faut une destination privée, accès/rétention et vérification de restauration approuvés. Si l'ancien original reste au tip public, B ne résout pas son exposition ; les anciens commits demeurent aussi accessibles | Retenir comme conservation contrôlée, jamais comme promesse d'effacement Git |
| C — nouvelles versions impersonnelles sur #188 | Réduit la répétition/exposition courante ; commit normal et revue ciblée possibles sans changement de SHA des ancêtres | Modifie les blobs/documents courants et exige une notice d'édition. Les anciens blobs restent dans l'historique et les diff de PR ; un diff de correction peut lui-même montrer les anciens passages | Option proportionnée recommandée avec provenance et décision explicite sur le résiduel |
| D — réécriture historique séparément autorisée | Peut réduire les références accessibles dans le dépôt central si toutes les voies sont traitées | Nouveaux SHA, signatures/revues/liens perturbés, coordination des copies, risque de réintroduction, effets sur PR/forks/caches ; pas de garantie sur tous les clones. Les gestes décrits par GitHub ne sont pas autorisés ici et ne justifient aucun changement de protection | Non retenue par défaut : pas de P0 établi ni de nécessité proportionnée démontrée ; étude/autorisation séparées si l'objectif humain est un retrait historique |

Recommandation : **C pour les versions publiques actuelles + A pour l'intégrité + B si une conservation privée exacte est nécessaire**. Ne pas déclarer B accompli parce qu'une copie temporaire Codex existe. D reste une question distincte, pas une étape cachée du plan.

Deux objectifs doivent être séparés : **O1**, disposer d'un relais public actuel impersonnel et exact, réalisable par un correctif documentaire ; **O2**, empêcher toute consultation des anciens contenus, non garanti par ce correctif. Sans acceptation explicite du résiduel ou traitement séparé d'O2, conserver le NO-GO de fusion.

## 5. Inventaire des passages et qualification

**PASSAGES.csv** et **EXTRAITS_PROPOSES.md** identifient 63 passages par chemin, ligne d'origine, catégorie, fonction, proposition et commit/blob. Aucun nom, citation personnelle ou ancienne valeur sensible n'y est recopié. Toutes les lignes se réfèrent au SHA #188 202f0f7b… ; elles devront être recalées si la branche avance.

| Fichier sous docs/reports/audit-pr-20261023/ | Lignes importantes dans la source | Qualification |
|---|---|---|
| JOURNAL_DECISIONS.md | 3–4,8–11,16,18–32 | P1 par contexte : réponses explicitement citées et attribuées ; P2 pour modalités de compte/outillage non nécessaires. Conserver 15 arbitrages et leurs reports, pas la voix de conversation |
| SAVE_STATE.md | 3–4,21,25,36,38,46,48,51–52,78,83,94–95,107 | P1 : citations contextualisées et référence à une mémoire externe ; P2 : abonnement/notifications et promesse de complétude non établie. Conserver limites d'accès et statut historique |
| COMPTE_RENDU.md | 52,59,61,70,86 | Ligne 52 : citation attribuée à reformuler (P1 contextuel) ; autres attributions P2, non preuves d'identité civile |
| INVENTAIRE_PR.md | 8,12–15,21–25,27,31,35–36,42 | P2 : mentions isolées d'une responsabilité, à minimiser ; ne pas les qualifier automatiquement de fuite grave |
| README.md | 3–4 | P2 : présentation avec attribution non indispensable |
| PROMPT_AUDIT_PR.md | 13,49,51 | P2 : détails de service et attribution ; le rôle technique et la frontière d'autorisation suffisent |
| data/README.md | 3–4 | P2 d'exactitude bloquant pour la provenance : éviter la garantie générale « public donc pas de secret » et signaler le JSON invalide |

Les trois chemins génériques de sandbox du prompt sont P2/P3 de portabilité, pas des profils privés confirmés ; ils ne sont pas des bloqueurs autonomes et ne sont pas remplacés dans le socle nécessaire. Le tableau du précédent audit comportait bien 33 mentions du même nom/alias : cela explique l'inventaire, pas une sévérité intrinsèque.

**À conserver comme P3 :** logins GitHub publics et identités Git utiles pour les PR ; nom du dépôt ; noms publics des outils et bots ; attributions de service `Co-Authored-By` et adresses de service des patchs ; codes d'erreur et noms de variables sans valeur ; données REST publiques utiles et fixtures fictives. Ne pas supprimer des auteurs publics, licences ou métadonnées techniques sous couvert d'anonymisation générale. Aucune correspondance entre un alias de conversation et une identité civile n'est inférée.

## 6. Reformulations prêtes à relire

Les 63 remplacements exacts et leurs impacts sont dans les extraits. Exemples principaux, sans les appliquer :

**JOURNAL_DECISIONS, introduction :** « Relevé des décisions techniques rapportées le 23 octobre 2026. Proposition d'édition publique impersonnelle : les décisions et incertitudes sont conservées, sans reproduire les réponses de conversation. Les identités Git et empreintes des originaux doivent être consignées dans la notice de provenance. »

**Tableau des décisions :** colonne « Décision technique rapportée au 23 octobre 2026 ». Chaque ligne préserve le sujet, l'arbitrage ou l'absence d'arbitrage : #140 et Cargo différés ; C5 préparé seulement ; variantes conservées ; scripts non retirés ; postcss non décidé ; besoin multi-gestionnaires à confirmer ; patchs inactifs ; attribution de service sans lien de session. Aucune formulation n'accorde actuellement une permission de changer la CI.

**SAVE_STATE, conservation :** « Préserver les variantes, commentaires utiles, scripts, archives et représentations de verrous. Aucune suppression, réécriture ou réactivation automatique ; signaler les incertitudes et demander une décision selon AGENTS.md. »

**SAVE_STATE, mémoire :** « Mémoire externe de l'outil | Hors du jeu de preuves versionné | Contenu et durabilité non attestés par Git ; ne remplace pas les fichiers de cette archive. » Ce texte garde la limite de provenance, sans référence privée ni prétention de sauvegarde complète.

**PROMPT, arbitrages :** « Une section de décisions à arbitrer pour les points de code fantôme ou d'architecture. » Les choix de la personne responsable restent nécessaires, sans reprise de paroles ou détail de compte.

**README :** « Dossier créé le 23 octobre 2026 pour l'audit historique des 38 PR ouvertes. Il rassemble le compte rendu, les décisions techniques, les variantes de dépendances, le prompt et des correctifs préparés mais inactifs. » Résumé anglais conservé.

Les clarifications terminologiques distinguent format pnpm-lock 6.0/9.0 et version du binaire pnpm : elles ne tranchent pas le choix historique resté ouvert. Toute révision s'annonce comme une **nouvelle édition**, datée de son application réelle, et ne remplace pas silencieusement le statut contemporain du rapport original.

Pas de patch unifié préparé : ses lignes retirées auraient dupliqué les anciennes citations/attributions. **EDIT_PLAN.json** contient seulement nouveaux textes, coordonnées, source SHA/blob et empreintes projetées ; aucune ancienne valeur personnelle, aucun script d'application. Les textes sont des propositions, pas sept fichiers sources corrigés.

## 7. Traitement des originaux déjà publiés

Avant toute édition autorisée : inventorier les six documents portant des attributions/citations, leurs tailles, blobs, SHA-256 et commit d'origine. Si nécessaire, conserver une copie exacte dans un emplacement privé contrôlé choisi par l'utilisatrice, avec accès limité, chiffrement adapté au support, durée/raison de conservation et test de lecture/hash. Ne pas demander ou publier le chemin privé de ce stockage dans GitHub. Ne pas copier les conversations complètes, autres comptes, caches ou intégralité des clones pour conserver quelques documents.

**État réel :** les sources exactes existent dans les anciens commits publics et dans le dossier temporaire de l'audit ; aucun coffre privé durable n'a été désigné ou alimenté par cette mission. La conservation temporaire n'est pas un archivage privé durable certifié.

Le manifeste public peut conserver des empreintes de fichiers entiers et références techniques nécessaires. Éviter un index de valeurs personnelles ou des liens promouvant directement leur consultation ; les anciens SHA demeurent néanmoins retrouvables. Ne pas publier de hash d'une donnée personnelle courte comme substitut d'anonymisation. Une valeur secret confirmée ultérieurement exigerait un autre traitement, sans en afficher le contenu.

Une correction par nouveau commit garde les identités Git originales dans l'historique ; elle ne les rend pas privées. Une notice doit le dire et l'acceptation de ce résiduel doit être explicite avant d'appeler la correction « suffisante ». Si cette acceptation n'est pas obtenue et qu'un retrait public est exigé, l'implémentation documentaire ne peut lever le blocage seule. Ne pas modifier les règles de conservation/confidentialité pour contourner ce point.

## 8. files-153.json : correction d'intégrité additive

**Origine attestable :** membre d'une archive de captures déclarées du 23 octobre 2026 ; la structure, dates internes et autres captures sont compatibles avec cette origine. Il n'existe pas de capture HTTP signée ni de journal indépendant permettant d'attribuer avec certitude le mécanisme de concaténation initial. Le texte d'erreur du proxy est présent, mais sa cause opérationnelle précise n'est pas reconstituée comme fait.

Archive inchangée : 1 995 059 octets ; SHA-256 `84c00d03b9b53990d26abc73c999288ba704d5996a59ed74f9d37f9e3386375a`. Membre invalide : **809994 octets**. Il partage les **809759 premiers octets** de `f153-1.json` (809760 octets) ; à ce décalage binaire base zéro, la fermeture `]` de la page valide est remplacée par un objet d'erreur du proxy. Le parseur échoue au caractère 803045, ligne 1, colonne 803046 : offsets caractères et octets diffèrent, ce n'est pas une contradiction.

Les pages `f153-1.json`, `f153-2.json`, `f153-3.json` sont des tableaux valides de 100/100/76 entrées, 276 noms uniques, identifiants de blobs comparés à l'arbre c47b0f38b469c66a80b177d039141fede40d5652 du commit #153 `0ebc167c8febf1b61752d1114f8135a59400c5f1`. Empreintes des pages et 118 membres recontrôlées. Manifestation syntaxique complète : 116 fichiers JSON valides, un JSON invalide, un fichier texte open.txt.

| Solution | Intérêt | Limite | Recommandation |
|---|---|---|---|
| Note explicative, brut inchangé | Préserve exactement la capture et l'erreur | Un consommateur automatisé peut encore ignorer l'avertissement | Nécessaire, pas de réparation silencieuse |
| Manifeste de validité | Machine-readable : SHA, taille, état de parsing, pages alternatives et vérification Git | Un checksum prouve les octets, pas la vérité d'un ancien verdict | Retenu dans le socle, intégré au manifeste de correction |
| Jeu dérivé validé | Facilite les outils attendant une seule liste de 276 fichiers | Ajoute un artefact, de nouvelles empreintes et une dérivation à maintenir | Optionnel, non nécessaire au correctif minimal |

Si un jeu dérivé est demandé plus tard : ajouter `data/derived/files-153.validated.json`, concaténation des **trois tableaux valides** dans l'ordre 1/2/3, sans récupérer des bouts du fichier invalide ni présenter le résultat comme une réponse REST originale. Identifier les trois entrées, méthode/version de sérialisation, ordre, vérifications de doublons, sortie SHA-256 et SHA de l'arbre de comparaison. Ne pas créer une fausse date de collecte. Aucun jeu dérivé n'est produit dans cette mission.

Conséquences sur l'ancien rapport : ne pas affirmer que toutes les listes brutes sont valides. Les 276 identités vérifiées étayent l'inventaire de #153, mais ne prouvent pas rétroactivement que chaque conclusion historique était fondée sur la bonne page ou chaque test réellement exécuté. Conserver les limites de l'audit original et l'échec de capture ; ne pas convertir la correction documentaire en validation de C5/C6 ou de la CI.

## 9. Plan distinct pour les 13 emplacements P1 de chemins

**CHEMINS_PLAN.csv** reprend les 13 lignes P1 parmi les 43 qualifiées, avec source, ligne, blob du main actuel, publication, fonction, proposition et risque de régression. Les 16 P2 et 14 P3 du précédent audit restent distincts et consultables ; aucune nouvelle campagne large de scripts n'est nécessaire pour ce plan.

| Source | Emplacements | Nature / origine | Proposition distincte et compatibilité |
|---|---|---|---|
| Scripts/DiagComplet_DINGUERIE.ps1 | 29 ; 497 ; 736 ; 868–873, soit neuf | Paramètres de chemins de SDIO, recherche d'outils, CSV et DriverStoreExplorer/RAPR dans un script manuel. Présents dans main et les références auditées, préexistants à #188 ; aucune preuve d'exécution automatique par Tauri | Paramètres explicites ToolsRoot/CsvPath, chemins dérivés uniquement pour le compte cible confirmé. Desktop Known Folder si pertinent ; ne pas substituer le profil de l'administrateur après élévation ou scanner tous les profils. Préserver versions, outils, wildcards, espaces, Unicode, chemins réseau et erreurs contrôlées. L'absence d'un paramètre à la place d'un ancien défaut peut casser l'usage : décision et tests séparés |
| Scripts/DiagDrivers_20260521_1402.txt | 182,184,190 | Trois chemins dans une erreur Out-File, une trace et un export ; faits de diagnostic historiques, pas paramètres actifs | Nouvelle copie publique expurgée avec manifeste avant/après ; original privé si nécessité approuvée. Ne pas remplacer les faits d'une trace originale par $env:USERPROFILE ni prétendre qu'un chemin modifié était celui de l'incident |
| Scripts/logs latencymon.txt | 11 | Nom de machine dans la trace de mesure ; identité civile non établie | Identifiant neutre par incident dans une copie publique, mapping privé seulement si corrélation nécessaire. Préserver les mesures et provenance, pas une anonymisation qui détruit sans explication la corrélation utile |

**Anonymisation ≠ portabilité** : un nom fictif figé ne rend pas un chemin portable ; $env:USERPROFILE peut révéler le compte à l'exécution et viser le mauvais utilisateur. Batch : %USERPROFILE% selon cible ; PowerShell : $env:USERPROFILE, LOCALAPPDATA/APPDATA/TEMP selon nature du dossier ; API Known Folders/.NET pour Desktop/Documents redirigés. Ni APPDATA ni TEMP ne sont des remplacements arbitraires d'un outil ou d'un CSV existant. Linux : HOME/XDG pour le type de donnée approprié, sans réaffecter HOME ; macOS : mécanismes natifs à qualifier, pas équivalence universelle avec XDG.

Ce plan n'inclut aucun correctif actif de ces trois fichiers, log, CSP, ACL, licence ou workflow. Aucune validation Windows/Android/macOS ni exécution des scripts n'a été faite. Les originaux déjà publiés soulèvent le même résiduel Git : une copie publique expurgée n'efface pas l'ancien commit. Mission séparée nécessaire, avec cas non destructifs pour les tests de scripts.

## 10. Périmètre minimal et périmètre recommandé

Sous `docs/reports/audit-pr-20261023/` uniquement :

**Socle indispensable des blocages démontrés — 4 modifications et 2 ajouts :**

1. JOURNAL_DECISIONS.md : citations/réponses contextualisées en décisions techniques, dates/report conservés.
2. SAVE_STATE.md : citations et mémoire externe, limites de complétude et d'état d'accès.
3. COMPTE_RENDU.md : citation attribuée et portée historique de sa reformulation.
4. data/README.md : JSON invalide, pages valides, limites de provenance/confidentialité.
5. Ajout proposé NOTICE_CONFIDENTIALITE_INTEGRITE_20261027.md : édition, conservation, résiduel historique et portée des corrections.
6. Ajout proposé MANIFESTE_CORRECTION_20261027.json : documents avant/après, archive et 118 membres, validité, provenances et exclusions d'auto-hachage.

**Harmonisation recommandée — trois modifications supplémentaires**, pour un ensemble cohérent de sept documents et deux ajouts : README.md, PROMPT_AUDIT_PR.md, INVENTAIRE_PR.md, afin de retirer les attributions isolées inutiles et certains détails de compte sans toucher aux identités GitHub publiques. Ce sont des P2 pris isolément ; ils ne sont pas qualifiés de fuite grave ni de blocage autonome par principe. Si la revue confirme qu'une attribution relie effectivement une identité privée à la conversation, son retrait devient indispensable dans ce cas précis. Les extraits couvrent l'ensemble recommandé ; le sous-ensemble autorisé doit être fixé lors de la revue.

**Inchangés dans les deux périmètres :** archive gzip entière, les quatre patchs, patches/README.md, recette C6 et VARIANTES.md. Aucun recompactage de l'archive, modification de source applicative, manifeste/verrou actif, licence, règle d'audit, politique, workflow ou autre branche. Pas de nouveau script de migration ni framework de stockage requis.

**Souhaitable ultérieurement, hors blocages #188 :** portabilité des scripts, indexation/lisibilité, données dérivées facultatives, revue des chemins publics préexistants, tests natifs et corrections CI déjà connues. Ne pas transformer leur existence en autorisation de les commencer maintenant.

## 11. Conservation, manifestes et contrôles du futur correctif

Préparer un tableau de provenance par document : source commit 202f0f7b…, blob/mode, SHA-256 et taille ; catégorie/source des transformations ; nouvelle date d'édition et SHA-256 après correction ; revue indépendante ; emplacement privé non publié seulement si choisi. **Ne pas modifier les anciens manifestes pour leur faire attester de nouveaux octets.** L'archive et ses membres gardent leurs empreintes ; seuls documents édités et nouveaux fichiers en acquièrent.

MANIFESTE_CORRECTION_PROPOSE.json est un **brouillon de planification** : 118 hashes/états vérifiés, trois pages, sept documents sources et empreintes projetées si les extraits et en-têtes sont utilisés exactement. Il ne certifie pas sept éditions publiées, ni un futur SHA de commit. Le document ne s'auto-hache pas ; le futur commit et le rapport de publication devront le lier extérieurement. NOTICE_PROPOSEE.md est aussi explicitement un brouillon.

Avant publication future, remplacer les libellés de proposition/non appliqué par l'état réellement réalisé, avec la vraie date ; recalculer **toutes** les empreintes projetées qui changent. Le choix du socle réduit au lieu des sept documents recommandés change également les sorties attendues et le manifeste. Aucun SHA final n'est inventé ici.

Contrôles proposés : source HEAD toujours attendu avant écriture ; diff limité au périmètre adopté ; archive 1995059 octets et SHA constant ; huit pièces inchangées dans le périmètre recommandé, dont les quatre patchs (onze dans le socle réduit) ; tableaux/renvois préservés ; aucun nom/citation non admis dans les nouvelles éditions ; décisions et reports inchangés ; JSON du manifeste parsable ; 118 membres présents et hachés ; statut invalide maintenu pour files-153.json ; 276 noms uniques et identifiants du SHA historique ; liens valides dans l'arbre projeté ; aucun secret ni destination privée dans le manifeste ; aucune application de patch ou modification de code. Les nouveaux documents de projet hors #188 et les 276 archives #186 doivent rester identiques.

Un contrôle de contenu impersonnel ne doit pas supprimer auteurs/logins publics, adresses de service, noms de dépendances ni fixtures pour rendre un scanner vert. Ne pas exécuter les instructions d'un prompt historique. Ne pas lancer de builds/audits/appareils/workflows pour ces modifications documentaires.

## 12. Vérifications réellement exécutées et risques résiduels

Exécuté : lectures GitHub/consignes ; contrôles des références et diff de #188 ; simulation locale de fusion sans branche/index original ; comparaison des 42 empreintes précédentes ; relecture ciblée des 15 pièces et inventaires ; recalcul des 118 empreintes ; parsing 116 JSON valides et identification de l'invalide ; trois pages/276 identités comparées aux preuves Git immuables conservées ; reprise des 43 lignes et détail des 13 P1 ; recherches officielles et erreurs documentées ; préparation des extraits/coordonnées/projections et contrôles syntaxiques/documentaires.

Non exécuté : correction de document source, patch d'application, stockage privé durable, purge, commit/push/PR/commentaire, workflow, audit, installation, compilation, test applicatif ou script archivé. Le contrôle de données de preuve n'est pas un test Rust/Web ni une nouvelle authentification REST.

État reviews/checks #188 observé : aucune review retournée ; 40 check-runs, 33 success, cinq failure, un neutral, un queued. Mergeable=true, mergeable_state=blocked ; les cinq échecs relèvent des familles préexistantes documentées, pas d'une nouvelle correction validée. Un job vert ne prouve pas un audit strict réussi. Aucune protection contournée.

Risques restant à décider : disponibilité publique des anciennes citations et du contexte ; seuil de qualification des attributions isolées ; absence actuelle de stockage privé approuvé ; valeur de provenance de la collecte non signée ; limites des détecteurs ; erreurs passées conservées sans être promues en résultats actuels ; cohérence des empreintes après édition réelle ; futures écritures concurrentes. Aucune conclusion de sûreté globale ou d'effacement total.

## 13. Prérequis à une éventuelle fusion et arrêt

1. ChatGPT V4 relit le plan, les 63 extraits et la distinction P1 contextuel/P2 isolé/P3 public.
2. L'utilisatrice fixe explicitement le périmètre de correction et la décision sur les originaux, le stockage privé éventuel et le résiduel Git ; si retrait historique requis, nouvelle mission séparée et pas de fusion prématurée.
3. Autorisation d'une mission documentaire d'implémentation sur la seule branche existante #188, puis vérifications et revue au **nouveau SHA réellement publié**, avec état CI et protections non masqués.
4. Fusion seulement sur une autorisation distincte ; ce plan ne l'accorde pas.

**Prochaine action unique : revue indépendante de ce plan et des extraits par ChatGPT V4, avec #188 comme référence.** Toute correction attend ensuite une instruction explicite de l'utilisatrice. Aucun autre travail technique ou publication ne démarre automatiquement.
