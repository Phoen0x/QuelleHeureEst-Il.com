# Revue de la vision produit et inventaire des fonctionnalités

**QuelleHeureEst-Il.com — bilan stratégique du 28 octobre 2026**

**Sources internes :** [présentation historique](../../.github/README.md), [roadmap](../ROADMAP.md), [backlog technique](../TODO_TECHNIQUE.md). Cette revue analyse des **objectifs annoncés**, pas des fonctions déjà implémentées, testées ou distribuées. Elle ne modifie pas les documents historiques.

## Verdict stratégique

Vision pertinente : réunir l'heure exacte au sens d'une horloge correctement contextualisée, les fuseaux, la météo, la qualité de l'air, les pollens et les conditions d'un lieu, sur une interface personnalisable, sobre et respectueuse de la vie privée. La différenciation la plus crédible repose sur **l'intégration, la transparence des sources, les comparaisons et les conseils contextualisés**, et non la nouveauté de chaque mesure.

Point faible : le document mélange trois produits d'échelle différente :
1. **Noyau** : heure mondiale, météo et environnement d'un lieu.
2. **Aide à la décision** : alertes, comparaisons, activités, déplacements.
3. **Extensions** : transports, agenda, événements, actualités locales, fonctions sociales et messagerie.

Le noyau et la deuxième couche sont cohérents ; la troisième doit rester optionnelle, modulaire et différée.

## Inventaire regroupé des fonctionnalités déjà décrites

| Domaine | Idées et objectifs du document initial |
|---|---|
| Temps et géographie | Heure locale, fuseaux, calculs de décalages/dates, changements d'heure passés et futurs, lieux par nom ou coordonnées, géocodage |
| Météo | Conditions actuelles, prévisions, pression, visibilité, brouillard, davantage de jours, lever/coucher du soleil |
| Environnement | Qualité de l'air, niveaux et types de pollution, pollens et types associés, recommandations |
| Astronomie et calendrier | Phases lunaires, fêtes, calendrier, événements du jour |
| Recommandations | Tenue vestimentaire, activités sportives, lunettes de soleil, astuces de vie, risques de maladie, proverbes |
| Déplacements | Trafic, travaux, radars, contrôles policiers, manifestations, vélo, promenade, jogging |
| Transports | Retards et suivi des avions, retards de trains |
| Vie pratique et sociale | Agenda, amis, messages, partage de planning, informations sur nouvelles lois |
| Données personnelles et parcours | Favoris, historique, multi-profils, comparaisons, notifications, exports CSV/JSON |
| Interface | Dashboard, thèmes clair/sombre, icônes météo, langues sélectionnables, accessibilité, performances sur appareils modestes |
| Fiabilité | Sources multiples gratuites, provenance, comparaison des données, cache local, dernier état connu, fonctionnement dégradé |
| Architecture et distribution | Rust/Tauri 2, SQLite, chiffrement si nécessaire, permissions minimales, Android prioritaire, Web, ordinateurs, iOS, wearables, TV et self-host |

## Comparaison concurrentielle — domaines, non équivalence intégrale

- **timeanddate.com** : référence pour horloges, fuseaux, changements d'heure et planification ; approfondir les conversions temporelles et périodes historiques.
- **Breezy Weather** : référence Android pour richesse météo, widgets et personnalisation avec accent sur le logiciel libre/la vie privée.
- **Windy.com** : référence pour cartes et modèles météorologiques, couches environnementales et exploration avancée.
- **meteoblue** : référence pour la représentation de divergences/fiabilité entre prévisions et modèles.
- **IQAir AirVisual** : référence pour indicateurs de pollution, niveaux, provenance et alertes.

**Portée de cette comparaison :** repérage qualitatif des fonctionnalités connues lors de la revue conversationnelle, **pas benchmarking exhaustif et revalidé produit/version/prix**. Avant décision de développement ou de différenciation commerciale, actualiser fonctionnalités, licences, prix et conditions des services auprès de leur documentation officielle.

## Fonctions manquantes à étudier

| Priorité indicative | Proposition | Valeur utilisateur |
|---|---|---|
| P0 | Widgets Android personnalisables | Consultation quotidienne immédiate |
| P0 | Heure locale fiable + indication de synchronisation | Distinguer calcul de fuseau et précision de l'horloge système |
| P0 | Provenance, âge, type et zone de validité des données | Éviter des données périmées ou trompeuses |
| P0 | Contrat offline par catégorie | Savoir ce qui reste calculable, ce qui est en cache et ce qui requiert du réseau |
| P1 | Vigilances et alertes météo officielles | Risques majeurs et notifications utiles |
| P1 | Radar des précipitations et nowcasting | Décisions à très court terme |
| P1 | Indice UV et conseils non médicaux | Contexte environnemental quotidien |
| P1 | Cartes interactives multicouches | Exploration géographique |
| P1 | Comparateur lieux/dates/heures et conditions | Voyage, fuseaux, environnement, activités |
| P1 | Dashboard modulaire | Réorganisation/masquage des cartes selon le besoin |
| P1 | Seuils d'alertes configurables | Réduire les notifications parasites |
| P1 | Conditions au moment de l'arrivée | Préparer un déplacement |
| P2 | Historique et graphiques comparatifs | Comprendre tendances et prévision/réalité |
| P2 | Import/export des réglages | Portabilité sans compte obligatoire |
| P2 | Profils d'usage facultatifs | Voyage, travail, sport et préférences d'accessibilité |
| P2 | Synchronisation privée facultative | Cohérence multi-appareils sans service imposé |
| P2 | Raccourcis et automatisations locales | Ergonomie Android et intégrations contrôlées |

**Trois idées différenciantes :** comparateur multidimensionnel de lieux et de moments ; moteur de recommandation environnementale explicable (non médical) ; centre de transparence par donnée et par fournisseur.

## Incohérences ou risques de conception

1. **Publications « open source » et licence « tous droits réservés »** : contradiction à clarifier juridiquement dans une mission distincte. Aucun changement de licence autorisé par cette revue.
2. **« Zéro API payante »** : ne signifie ni coût d'infrastructure nul, ni usage commercial gratuit. Vérifier contrats, quotas et licences, en particulier pour Open-Meteo et les autres sources.
3. **« Offline complet après première synchronisation »** : préciser le périmètre. Heure/fuseaux et calculs astronomiques peuvent dépendre de données embarquées ; radar, trafic, alertes et météo actuelle ne restent pas frais sans réseau.
4. **Agrégation moyenne/médiane** : ne pas moyenner directement des indicateurs incompatibles (AQI d'échelles différentes, modèles, dates, résolutions). Documenter normalisation, incertitude, observations vs prévisions.
5. **Multiplicité des plateformes** : cœur métier Rust réutilisable, mais interface et capacités natives différentes par Android, Web, TV, wearable et self-host.
6. **Fonctions sociales et messagerie** : comptes, hébergement, modération et confidentialité distincts de l'architecture locale du noyau.

## Priorisation indicative

1. **MVP Android vérifié :** heure, fuseaux, recherche de lieu, météo/air/pollen, favoris, cache et état de fraîcheur/provenance.
2. **Expérience quotidienne :** widgets, alertes sélectionnées, dashboard configurable, comparaison de lieux.
3. **Contexte :** multimodèle, incertitudes, activités et déplacements.
4. **Écosystème :** Web/desktop, export et synchronisation optionnelle, plateformes supplémentaires après validation.
5. **Modules éloignés :** trafic détaillé, transports, événements, agenda, social et messagerie.

## Recommandations documentaires

Ne pas effacer la présentation historique. Ajouter ultérieurement une matrice **existant / en cours / prévu / idée / non arbitré**, les dépendances de données et de licences, les conditions d'acceptation, et des renvois depuis les README/roadmap. Corriger les blocs Markdown mal fermés, références de PR obsolètes et chemins d'installation fictifs lors d'une mission documentaire distincte.

**Aucune fonctionnalité n'est considérée adoptée ou implémentée du fait de ce rapport. Aucune modification applicative, commerciale ou juridique n'est autorisée.**
