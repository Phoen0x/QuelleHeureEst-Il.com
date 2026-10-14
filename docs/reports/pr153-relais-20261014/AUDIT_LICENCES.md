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

