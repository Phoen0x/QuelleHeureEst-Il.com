Quelle Heure Est-Il ? 🤔

FR :
```markdown
# QuelleHeureEst-Il?.com

> Application open-source native cross-platform offrant heure locale, météo, qualité de l'air, pollen et informations environnementales pour n'importe quel lieu dans le monde.

---

## 🎯 Objectif

Fournir une application complète permettant d'accéder, en ligne et hors ligne, aux informations suivantes pour n'importe quel lieu :

- Heure locale exacte
- Fuseau horaire
- Météo actuelle et prévisionnelle
- Qualité de l'air
- Taux et types de pollution
- Pollen (niveau, types, recommandations)
- Informations environnementales connexes

---

## 🌍 Plateformes cibles

- **Android** (priorité absolue, publication Google Play)
- **Web** (site web accessible via navigateur)
- Windows
- iOS
- Linux
- Self-host (Docker, VM, Proxmox, Qubes OS)
- MacOS
- Smartwatch (WearOS, watchOS)
- TV (Android TV, Apple TV)

---

## ⚙️ Contraintes et principes

### Architecture
- Application native cross-platform réelle, **pas une web app ni une PWA**
- Frontend web embarqué dans Tauri uniquement pour l'interface utilisateur
- Toute la logique métier, le traitement des données, le cache offline et la gestion des APIs doivent être implémentés en **Rust côté backend local**
- Architecture offline-first obligatoire
- Client lourd local fonctionnant sans navigateur

### Zéro dépendance externe payante
- Zéro API payante
- Zéro abonnement externe
- Zéro vendor lock-in
- Aucune dépendance critique à un fournisseur propriétaire payant

### Sécurité et vie privée
- Compatible GrapheneOS dès la conception
- Sécurité maximale
- Permissions minimales
- Aucun message/notification/alerte parasite
- Notifications, réseau et permissions traités comme des cas de bord de sécurité
- Pas de tracking inutile
- Chiffrement local si nécessaire

### Qualité et pérennité
- Code maintenable sur au moins 10 ans
- Architecture modulaire, testable et évolutive
- Support i18n dès le départ (français par défaut)
- Accessibilité (a11y) dès le départ
- Performant sur appareils modestes
- Sobriété réseau

---

## 🛠️ Stack technique

### Backend
- **Rust** pour le backend local et la logique métier
- **Tauri 2** pour le shell cross-platform
- **SQLite** pour la base de données locale
- **SQLCipher** ou équivalent libre pour le chiffrement si nécessaire

### Frontend
- **TypeScript + Svelte** (ou React si justifié)
- UI embarquée dans Tauri, légère et responsive
- Mode clair et mode sombre

### Déploiement
- Docker, VM, Proxmox, Qubes OS pour le self-host
- Google Play pour Android
- App stores standards pour les autres plateformes

---

## 🌐 Sources de données (100 % gratuites)

### Principe
- Ne pas limiter les sources par défaut
- Multiplier les sources gratuites, ouvertes et fiables
- Comparer les valeurs entre sources pour réduire les erreurs
- Conserver la provenance des données
- En cas de divergence : afficher les différences et/ou fournir moyenne, médiane ou estimation consolidée
- Préférer la validation croisée à une source unique

### APIs utilisées
- **Météo** : Open-Meteo
- **Qualité de l'air** : Open-Meteo Air Quality
- **Pollen** : Open-Meteo
- **Géocodage** : Open-Meteo Geocoding ou base locale
- **Fuseaux horaires** : base TZ embarquée ou calcul local
- **Heure** : calcul local

---

## 🚀 Fonctionnalités

### MVP
- Saisie d'un lieu par nom ou coordonnées
- Géocodage
- Appels Open-Meteo
- Calcul du fuseau horaire
- Affichage d'un dashboard
- Cache local offline

### Fonctionnalités principales
- Recherche de lieu par nom ou coordonnées
- Dashboard de données environnementales
- Cache local intelligent
- Dernier état connu disponible hors ligne
- Dégradation progressive sans réseau
- Favoris
- Historique
- Multi-profils
- Notifications
- Export JSON et CSV
- Offline complet après première synchronisation
- Support multilingue natif avec choix de langue d'affichage

### Fonctionnalités futures
- Pression atmosphérique
- Visibilité
- Brouillard
- Phases de la lune
- Astuces de vie
- Recommandations vestimentaires
- Risque maladie
- Recommandations activité sportive
- Recommandations lunettes de soleil
- Proverbes météo
- Fêtes et calendrier
- Événements de la journée
- Retards d'avion et de train
- Vols d'avions
- Amélioration du mode clair
- Amélioration des icônes météo
- Plus de jours de prévisions météo
- Correction du lever et coucher de soleil
- Trafic routier
- Travaux
- Radars
- Contrôles policiers
- Manifestations
- Nouvelles lois
- Itinéraires vélo, promenade de chien, jogging
- Agenda
- Système d'amis et d'envoi de messages / planning.

---

## 🏗️ Architecture

### Couches
1. **Présentation** : UI responsive, clair/sombre, adaptée au device
2. **Domaine** : géolocalisation, timezone, agrégation météo/air/pollen, cohérence métier
3. **Adaptateurs** : APIs externes, géocodage, stockage local, cache, synchronisation
4. **Offline-first** : cache intelligent, dernier état connu, stratégie de fraîcheur, dégradation progressive
5. **Sécurité** : chiffrement local, permissions minimales, isolation des données

### Structure du repository
apps/
  desktop/
  mobile/
  tv/
  wearable/
crates/
  core-domain/
  geocoding/
  timezone/
  weather/
  air-quality/
  persistence/
  sync/
  ui-kit/
infra/
  docker/
  proxmox/
docs/
tests/

---

## 🌍 Multilingue

- L'application est multilingue native
- Le français est la langue par défaut
- L'utilisateur choisit sa langue d'affichage dans l'application
- Le code, les commentaires, la documentation et les discussions de conception restent en français

---

## 🛡️ Sécurité

- Chiffrement local si nécessaire
- Pas de données sensibles non protégées
- Permissions minimales
- Sandbox par plateforme si applicable
- Pas de télémétrie inutile
- Compatible GrapheneOS avec gestion stricte des permissions, réseau et notifications

---

## 🧪 Tests et CI/CD

- Tests unitaires
- Tests d'intégration
- Linting
- Build multi-plateforme
- Packaging automatisé
- Publication Play Store

```

## 📦 Installation et développement

### Prérequis
- Rust (stable)
- Node.js et npm/pnpm
- Tauri CLI

### Cloner le projet
```bash
git clone https://github.com/VotreOrg/QuelleHeureEst-Il.com.git
cd QuelleHeureEst-Il.com

### Installer les dépendances
```bash
# Backend Rust
cargo build

# Frontend
cd apps/desktop
npm install
```

### Lancer en développement
```bash
npm run tauri dev
```

### Build de production
```bash
npm run tauri build
```

---

## 👥 Administrateurs - Contributeurs

- **ÆtherXYZ**
- **MinhoZenS**

---

## 📄 Licence

> **⚠️ Projet privé et propriétaire — tous droits réservés.**

Ce projet n'est pas open-source, libre, gratuit ou communautaire.  
Il appartient exclusivement à son organisation, Phoen0x, propriété d'ÆtherXYZ, et l'équipe QuelleHeureEst-Il.com dont les administrateurs et seuls détenteurs sont ÆtherXYZ et MinhoZenS.
Toute copie, reproduction, distribution, modification ou utilisation — partielle ou totale, commerciale ou non — est strictement interdite sans autorisation écrite explicite de l'organisation.
----
© 2026 Phoen0x — Tous droits réservés.  
Voir le fichier [LICENSE](./LICENSE) pour les conditions légales complètes.

---

## 🤝 Contribuer

> **⚠️ CLA — Contributor License Agreement**  
> Toute contribution soumise à ce dépôt implique le transfert irrévocable de l'intégralité des droits (propriété intellectuelle, droits d'auteur, droits commerciaux) à l'organisation Phoen0x.  
> Contribuer vaut acceptation explicite de ces conditions.

Vous pouvez contribuer si vous le souhaitez. Nous saurons nous en souvenir.
Merci de :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📞 Contact

Pour toute question, suggestion, ou autre, ouvrez une issue sur ce dépôt.

---

## 🎯 Priorités de développement

1. **Android d'abord**, avec publication Google Play comme objectif principal, en français.
2. **Web** (site web accessible via navigateur).
3. Desktop (Windows, Linux, MacOS), et autres langues.
4. Fonctionnalités secondaire.
5. iOS, Wearable (WearOS, WatchOS), TV (Android TV, Apple TV, Amazon TV), Self-Host (Docker, VM, Proxmox, Qubes OS).

**Toujours** : Rust d'abord, local d'abord, offline d'abord, sécurité d'abord.
