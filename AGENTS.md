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
