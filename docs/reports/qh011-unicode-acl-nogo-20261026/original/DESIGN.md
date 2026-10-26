# Hypothèses avant implémentation

Copie isolée de #183 f2eee422 ; aucune publication autorisée.

1. Les règles versionnées doivent lier la configuration complète (manifestes, permissions/scopes, capacités, plateformes), pas seulement le matching ou un booléen.
2. Pour la version historique, tout motif distant sans preuve de compatibilité doit être rejeté explicitement, sans retirer de règle. Le prototype peut donc démontrer un refus sûr sans être une solution fonctionnellement complète.
3. Une version moderne exige un instantané de revue exact. Les accords dans les tests sont synthétiques : aucune décision humaine réelle n’est fabriquée.
4. Normalisation/parsing passent par les vraies API Tauri. Les erreurs sont contrôlées avant Resolved::resolve ; les paniques restantes sont explicitement transformées en erreur de construction. Aucune correction de deny.
5. Critère bloquant : si RuntimeAuthority::add_capability accepte un ajout hors validation, le seul garde de construction est insuffisant. Un test d’acceptation doit échouer, et la voie exigeant un hook/fork/patch supplémentaire sera arrêtée sans correction amont.
6. Une vérification locale de snapshot n’est ni une preuve universelle d’équivalence URLPattern, ni une couverture IPC/GUI/native.
7. Conservation : anciens fichiers exacts en archives inertes, 13 sorties/18 entrées ; six blocs collatéraux restaurés exactement. Aucun nettoyage historique, assouplissement d’audit, changement de fonctionnalités Tauri ou modification du checkout original.

Les contrôles de dépendances déjà figés peuvent rejeter légitimement le nouveau verrou ; ces rejets restent visibles, sans réancrage arbitraire des SHA de référence.
