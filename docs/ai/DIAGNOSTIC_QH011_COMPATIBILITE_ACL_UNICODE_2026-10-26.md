# QH-011 — Qualification de compatibilité et sécurité des ACL Unicode — 26 octobre 2026

## Statut et preuves

Deuxième diagnostic Codex approfondi, strictement en lecture seule, sous orchestration de **ChatGPT V4**. Cette synthèse est créée pendant la mission d'archivage autorisée sur #186. Elle conserve des résultats déjà exécutés et leurs limites ; aucune implémentation de compatibilité ni correction de Tauri n'a été entreprise. Références et environnement : [diagnostic Unicode](DIAGNOSTIC_QH011_UNICODE_URLPATTERN_ICU_2026-10-26.md).

**Verdict : GO sous conditions pour une mission ultérieure explicitement autorisée ; NO-GO pour une mise à jour mécanique et pour un garde limité au booléen d'autorisation.** L'objectif est d'éviter les élargissements silencieux, les pertes de restrictions et les régressions multilingues. Une restriction supplémentaire n'est pas automatiquement une compatibilité fonctionnelle réussie.

Les [sources et versions](../reports/qh011-unicode-acl-20261026/source-provenance.json), les [fixtures ACL](../reports/qh011-unicode-acl-20261026/acl/cases.json), les résultats avant/après et les sources finales des harnais sont archivés. Les anciens générateurs intermédiaires sont conservés comme pièces inertes ; ils ne reconstruisent pas tous les ajustements finaux et ne doivent pas écraser les fixtures finales.

## Chemins de sécurité observés dans les sources

Le chemin principal utilise les véritables API :

1. `Capability` définit permissions, `local`, `remote.urls`, fenêtres, WebViews et plateformes.
2. `Resolved::resolve` filtre les plateformes et résout permissions, contextes et scopes.
3. Chaque URL distante passe par `RemoteUrlPattern`, puis URLPattern.
4. L'IPC Tauri vérifie la clé d'invocation et classe l'origine comme locale ou distante.
5. `RuntimeAuthority::resolve_access` applique les règles et retourne les `ResolvedCommand` sélectionnés.
6. Les références aux scopes sont transmises aux consommateurs ; l'application effective de leurs contenus relève des commandes/plugins et des types de scopes.

Sources amont identifiées par les paquets Cargo effectivement inspectés : [Tauri authority.rs](https://github.com/tauri-apps/tauri/blob/9452ddee5ebefd9b678a94ff003521379df6c9ae/crates/tauri/src/ipc/authority.rs), [IPC WebView](https://github.com/tauri-apps/tauri/blob/9452ddee5ebefd9b678a94ff003521379df6c9ae/crates/tauri/src/webview/mod.rs), [tauri-utils récent](https://github.com/tauri-apps/tauri/blob/59b63ab500da9859f12d8888c3298bc29bba0b92/crates/tauri-utils/src/acl/mod.rs). Aucune copie de ces sources tierces n'est ajoutée à l'archive.

### Autorisations, refus et scopes

Pour un `allow`, il faut une origine correspondante et **une fenêtre OU une WebView** correspondante. Exiger systématiquement les deux changerait le contrat existant. Plusieurs règles applicables peuvent contribuer à la même commande ; leur ordre ne constitue pas une priorité de type première correspondance.

Pour `deny`, le code de Tauri 2.11.6 emploie `.get(command).map(...).is_some()`. Il refuse donc si une entrée existe pour la commande, même lorsque la correspondance du contexte calculée vaut faux. Le harnais reproduit le refus pour une autre origine, des labels différents et même une entrée vide synthétique. Ce comportement existe avant/après ; **il n'est pas corrigé et n'est pas présenté comme une faille exploitable**. Un refus visant une autre commande ou une capacité inactive sur la cible n'interdit pas la commande testée.

Les scopes de commande et globaux doivent être considérés avec les droits effectifs. `CommandScope::matches` teste d'abord les refus, puis considère une liste `allow` vide comme permissive lorsque les refus ne correspondent pas. Une intersection naïve de listes peut donc être dangereuse. Cette règle est observée dans les sources ; les harnais ne créent pas de WebView et ne prétendent pas valider toutes les applications de scopes typés.

### Origines et chemins supplémentaires

Sans manifeste ACL applicatif, les commandes applicatives locales ont un chemin de compatibilité spécifique ; les commandes plugins et distantes ordinaires sont soumises au contrôle ACL. La récupération des données des canaux possède une exception dans le chemin IPC. La classification locale utilise protocole Tauri, URL applicative/dev et protocoles personnalisés ; elle comporte des branches spécifiques Android/Windows. Ces chemins sont cartographiés, mais aucune invocation native complète ni attaque WebView n'a été exécutée.

`dynamic-acl` est actif dans la résolution du projet. L'API d'ajout de capacités exécute une nouvelle résolution et fusionne commandes/scopes ; une validation uniquement à la génération initiale ne couvre pas ce chemin. Aucune désactivation de cette fonctionnalité historique n'est proposée pour faciliter l'audit.

## Matrice expérimentale et comptes distincts

Les harnais compilent Tauri **2.11.6**, avec tauri-utils **2.9.3** ou **2.10.2**, et la famille de dépendances Tauri verrouillée correspondante. Ils invoquent réellement `Resolved::resolve`, `RemoteUrlPattern`, `RuntimeAuthority::resolve_access` et, pour cinq scénarios, `add_capability`. Ce ne sont pas seulement des simulations de booléens.

- **674 couples motif/URL distincts**, 678 enregistrements bruts : parsing, matching, captures et erreurs.
- **68 scénarios ACL distincts**, 70 enregistrements par version ; les deux rejeux ne sont pas de nouveaux cas.
- Les fixtures historiques sont reprises dans le harnais brut. Les 647 premiers enregistrements bruts ont été comparés à leurs prédécesseurs, identiques ; le corpus complet conserve les autres enregistrements. Le compte historique 647 désigne les couples après normalisation URL (648 couples textuels initiaux), comme précisé par le premier rapport. Les résultats initiaux de l'API RemoteUrlPattern sont également conservés.
- Les trois exécutables finaux terminent avec **sortie 0** ; les attentes positives et négatives ont été contrôlées par script.
- Limites par exécutable : **20 secondes**, **10 secondes CPU**, **1 Gio**, core désactivé. Les durées observées restent dans ces bornes et ne constituent pas un benchmark de production.

| Famille de cas | Avant → après |
|---|---|
| Origine, domaine, port et labels autorisés | Autorisé → autorisé |
| Domaine, port ou commande incorrects | Refusé → refusé |
| Fenêtre et WebView non autorisées | Refusé → refusé |
| WebView autorisée malgré fenêtre différente, et inversement | Autorisé → autorisé, conformément au OU |
| Règle uniquement distante, requête locale | Refusé → refusé |
| Absence de capacité distante applicable | Refusé → refusé dans `resolve_access` |
| Domaine international et chemin multilingue légitimes | Autorisé → autorisé |
| Motif avec nom partiel `:a` suivi de U+11F00, URL `/value` | Refusé → **autorisé** |
| U+11F02 ou U+1C89 en début de nom | Construction rejetée → **autorisé** |
| U+309B, ID mais pas XID | Autorisé → autorisé |
| Nom précédemment dupliqué, devenu distinct | Construction rejetée → **autorisé** |
| TAB/LF/CR dans le motif d'hôte testé | Construction rejetée → **autorisé** |
| Refus explicite pour la commande, même sur une autre origine | Refusé → refusé |
| Refus portant sur une autre commande ou inactif sur la plateforme | Autorisé → autorisé |
| Capacité ajoutée dynamiquement avec nom partiel affecté | Refusé → **autorisé** |

Sept constructions anciennes et une construction nouvelle provoquent un `panic` intercepté dans le harnais. Ce sont des résultats attendus, pas des erreurs silencieusement ignorées : six motifs anciennement invalides deviennent acceptés ; le motif d'erreur restant change son offset. Les harnais interceptent ces paniques pour comparer les cas ; le constructeur réel ne devient pas pour autant une API de validation à erreur contrôlée.

Les tests couvrent aussi sous-domaines, port explicite et port par défaut, chemins exacts, jokers de recherche/fragment, segments pointés, segments encodés, slash encodé, échappements, quantificateurs et captures. La normalisation de l'URL d'entrée est distincte de la tokenisation du motif : TAB/LF/CR sont déjà retirés de certaines URL par `url::Url` dans les deux chaînes. Le slash encodé reste distinct d'un séparateur dans les cas littéraux vérifiés.

## Contre-exemple : même commande, scopes différents

Fixture synthétique : capacité A pour `probe`, scope `allow safe` et `deny secret` ; capacité B pour la même commande, scope `allow *`, avec le motif de nom partiel affecté. L'origine distante et la fenêtre sont contrôlées.

| Résolution réelle | Commande autorisée | Entrées retournées |
|---|---|---|
| Ancienne chaîne | Oui | A, scope 1 |
| Nouvelle chaîne | Oui | **A, scope 1 et B, scope 2** |

Les contenus des deux scopes sont présents dans les sorties des harnais. Un garde `ancien_autorise && nouveau_autorise` accepte donc la commande tout en laissant passer un scope supplémentaire. Cela démontre l'insuffisance de ce garde dans la fixture, pas un accès sensible réellement exploité dans le projet.

Dans les essais dynamiques, deux ajouts successifs réutilisent le même identifiant numérique de scope : l'ancien retourne A/1 et le nouveau A/1+B/1. Ce comportement existe dans le mécanisme étudié des deux chaînes. Il faut comparer provenance et contenu, pas seulement les nombres. Le magasin dynamique interne et son application complète via une WebView n'ont pas été vérifiés par ce harnais ; aucun élargissement effectif supplémentaire n'est déduit de ces seuls nombres.

## Comparaison des stratégies

| Approche | Sécurité et compatibilité | Coût, API et maintenance | Conclusion |
|---|---|---|---|
| 1. Ancienne sémantique pour les règles historiques | Peut préserver le contrat si l'équivalence est réellement établie ; garder l'ancien moteur réactive UNIC. Figer seulement ID_Start/Continue manque le changement des contrôles d'hôte. | Un moteur de compatibilité exige une maintenance et des tests de parsing/canonicalisation. Le type privé de `RemoteUrlPattern` n'est pas remplaçable par un simple wrapper applicatif. | Pas de conservation de l'ancien moteur actif proposée ; compatibilité à spécifier et prouver. |
| 2. Validation préalable à la construction | Un motif accepté dans les deux moteurs peut encore élargir le matching. Un échantillon d'URL peut manquer une divergence. Supprimer une règle ambiguë, surtout `deny`, peut affaiblir la sécurité. | Coût concentré à la construction ; même représentation de règle entre validation et exécution indispensable. L'ajout dynamique exige sa propre validation. | **Garde principal recommandé**, avec échec bloquant, sans abandon silencieux de règle. |
| 3. Vérification défensive à l'autorisation | Le double booléen échoue sur les scopes ; filtrer naïvement les listes peut modifier les conventions de scopes vides. Un refus sur ambiguïté peut aussi casser des usages valides. | Double moteur/matching, stockage et allocations ; l'API d'un handler applicatif ne couvre pas automatiquement plugins et chemins IPC. | Défense supplémentaire à qualifier, pas une solution autonome démontrée. |
| 4. Migration explicite et versionnée des règles | Rend les changements visibles et soumis à décision, permet Unicode moderne. Une étiquette de version seule n'assure aucune compatibilité. | Inventaire et format versionné à maintenir ; pas de moteur historique actif requis si les règles approuvées sont qualifiées autrement. | **Cadre recommandé**, combiné à 2. |

Contre-exemples reproductibles aux raccourcis rejetés :

- validation « parsing accepté des deux côtés » : `kawi-partial` est accepté dans les deux mais refuse/autorise `/value` ;
- validation sur un seul exemple : `partial-encoded-suffix` matche dans les deux, alors que `/value` révèle l'élargissement du même motif ;
- figer uniquement les propriétés ID : `host-lf` change indépendamment de ces propriétés ;
- double booléen : `scope-widening-False` retourne des scopes différents ;
- retirer le `deny` ambigu : la fixture `deny-unicode` refuse, alors que sa version sans cette règle, `same-origin`, autorise ;
- bannir Unicode : `id-not-xid`, `idn-positive` et `multilingual-path` perdent des usages valides.

L'échappement explicite du suffixe Kawi préserve les deux décisions testées pour cet exemple historique. **Ce n'est pas un traducteur général prouvé.** La migration versionnée elle-même reste une recommandation, pas un prototype intégré ni une garantie issue d'une étiquette.

## Invariants de conception proposés, non encore implémentés

Pour une règle historique, préserver ou faire approuver explicitement le langage d'URL, les refus, fenêtres/WebViews, origines, plateformes, capacités, permissions et scopes de commande/globaux avec leur provenance. Toute ambiguïté bloque la construction de la configuration concernée ; aucune règle n'est omise silencieusement. La validation et l'exécution doivent partager les mêmes étapes de normalisation et la même interprétation des octets encodés.

Un éventuel garde d'exécution doit refuser lorsque l'équivalence des permissions effectives avec celles approuvées ne peut pas être établie. Une égalité des entrées pertinentes et de leurs contenus de scopes peut fournir une condition suffisante sous des hypothèses explicites sur des consommateurs inchangés. Ce n'est pas une implémentation disponible ; des plugins peuvent définir des sémantiques de scope arbitraires. Une comparaison de captures reste aussi nécessaire aux autres consommateurs d'URLPattern, même si `RemoteUrlPattern` n'utilise que `.test()`.

**Un corpus fini ne démontre pas l'équivalence universelle des moteurs.** Les invariants de code, les hypothèses sur les consommateurs et les résultats de tests doivent rester séparés.

## Exposition du projet et limites

Aucune ACL distante explicite ni appel applicatif d'ajout dynamique n'a été trouvé dans le code/configuration du projet étudié. Les `capabilities.json` des anciennes compilations disponibles sont vides ; il s'agit d'artefacts antérieurs inspectés, pas de nouvelles compilations de ce second diagnostic. Les commandes distantes ordinaires restent soumises à un contrôle explicite dans le code IPC inspecté. Aucun exploit de l'application n'est établi.

Ne pas généraliser cette observation aux configurations futures, aux protocoles personnalisés, aux chemins IPC spéciaux ou à toutes les plateformes. L'absence de règle distante actuelle est une possibilité de qualification plus simple, sous contrôle des artefacts réellement embarqués ; elle n'autorise ni suppression de `dynamic-acl`, ni perte de support Unicode, ni exemption future de validation.

Les harnais compilent en Linux debug avec Rust 1.99.1. Les filtres de plateformes Android/Windows sont exécutés dans le résolveur Linux : **aucune validation native Android, Windows, macOS, iOS ou GUI**. MSRV 1.90, scopes typés en WebView, IPC complet et performances de production restent non démontrés. Le second diagnostic ne rejoue pas builds applicatifs, tests Web/GLib/HTTP, audits ou CI ; leurs résultats antérieurs ne deviennent pas actuels par citation.

## Conditions et plan minimal proposés — non exécutés

1. Inventorier configurations embarquées et ajouts dynamiques pour chaque cible.
2. Définir contrat versionné, critères d'équivalence et blocage des cas indécidables.
3. Préserver les 13 identités historiques sortantes et les verrous, sans réactivation ; empêcher/justifier les six blocs de réorientations collatérales.
4. Intégrer seulement une solution compatible avec les vraies API Tauri, puis tester décisions, provenance, scopes, refus, fenêtres/WebViews, plugins et ajouts dynamiques.
5. Tester Rust 1.90 exact et plateformes natives, puis les acquis GLib, HTTP/2, Tokio, Vite et braces ; auditer sans ignore ni changement de seuil.
6. Faire relire indépendamment les preuves avant toute publication de code ou fusion.

**QH-011/T-003 restent partiels et ouverts.** La recommandation n'autorise aucune correction de `deny`, aucun fork implicite et aucune implémentation automatique. La prochaine action est la revue indépendante par **ChatGPT V4**.
