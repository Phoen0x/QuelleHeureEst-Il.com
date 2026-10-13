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
