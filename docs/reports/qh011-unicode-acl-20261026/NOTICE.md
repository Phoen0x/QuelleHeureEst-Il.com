# Preuves archivées QH-011 — Unicode et ACL — 26 octobre 2026

## Français — portée et lecture

Ces pièces documentent deux diagnostics Codex réalisés sur le code de #183 au SHA `f2eee4223a1ccf5b0866944580df8fd5979575dd`, puis archivés sur la branche documentaire existante de #186. Elles n'appliquent aucune migration. Lire les [résultats Unicode](../../ai/DIAGNOSTIC_QH011_UNICODE_URLPATTERN_ICU_2026-10-26.md) et les [résultats ACL](../../ai/DIAGNOSTIC_QH011_COMPATIBILITE_ACL_UNICODE_2026-10-26.md).

- `MANIFEST.json` : chemins, tailles, SHA-256 et identités de blobs Git des pièces archivées, hors manifeste lui-même ; son empreinte est fournie dans le compte rendu de publication.
- `archive-provenance.json` : fichier temporaire source, SHA-256 source et destination, transformation éventuelle. « exact bytes » signifie copie exacte ; une extraction ou substitution est explicitement déclarée.
- `source-inventory.json` : 116 fichiers retrouvés dans les ensembles d'expériences hors copies de projet/base RustSec, avec statut de sélection. Ce n'est pas l'inventaire du cache Cargo ni une attestation contemporaine de la première mission.
- `source-provenance.json` : commits amont, versions Unicode et référence/empreinte du fichier Unicode non redistribué.
- `PUBLICATION.json` : inventaire exact du changement documentaire et blobs/modes de l'arbre parent ; aucune attestation de validation applicative.
- `unicode/` : fixtures, résultats, verrous expérimentaux inertes, sources finales des six harnais, audits, extraits de journaux et graphes normalisés.
- `acl/` : fixtures, résultats, sources finales des trois harnais, contrôles historiques, état d'intégrité et manifeste original de 31 fichiers.

Les sources des harnais, leurs manifestes et leurs verrous sont volontairement stockés avec le suffixe `.txt`. Aucun fichier du workspace Cargo applicatif ou de son verrou actif n'est changé. Ces versions UNIC historiques servent seulement à reproduire un diagnostic isolé ; elles ne sont pas réactivées dans le produit.

### Vérification hors ligne

Avec Python 3.11 ou ultérieur, depuis n'importe quel répertoire :

```sh
python /chemin/vers/ces-preuves/verify.py
```

Le vérificateur contrôle les empreintes, les 504/509 identités, les 13 sorties/18 entrées, les six blocs restaurés, les graphes normalisés, les comptes de couples/scénarios (648 couples textuels initiaux, 647 après normalisation), les refus et le contre-exemple de scopes. Il lit des résultats déjà enregistrés. **Un PASS ne signifie pas que Rust, les audits ou les plateformes viennent d'être testés.** Le contrôle original ACL de la mission précédente est conservé comme pièce historique, sans remplacement silencieux par le nouveau vérificateur.

Les graphes partagent les définitions de paquets via `package-catalog-0.json` et `package-catalog-1.json`. Chaque clé est le SHA-256 de sa définition JSON canonique (clés triées, UTF-8, séparateurs compacts). Les trois métadonnées normalisées référencent ces définitions ; leurs nœuds conservent fonctionnalités et arêtes nommées avec types/cibles. Les 24 graphes filtrés partagent également un catalogue de nœuds dans `target-nodes.json`. Cette représentation conserve les données sélectionnées, sans recopier les chemins de cache/manifeste et les sorties de build des métadonnées complètes. Les SHA-256 des sources brutes restent dans la provenance.

### Reproduction future isolée

Préconditions : environnement Linux natif préparé, Rust/Cargo 1.99.1, bibliothèques GTK/WebKit nécessaires, sources Cargo déjà disponibles pour l'exécution hors ligne, et copie vérifiée de #183 avec sa configuration GLib vendored. Le guide Linux de #183 reste la référence de préparation ; ce paquet documentaire n'installe ni SDK, ni bibliothèques, ni compilateur.

```sh
python /chemin/vers/ces-preuves/reproduce.py \
  --project-config /chemin/vers/copie-verifiee/.cargo/config.toml \
  --output /tmp/qh011-reproduction-neuve
```

Sans `--build-run`, cette commande prépare seulement les sources finales dans un répertoire neuf extérieur au projet. Avec `--build-run`, elle compile les neuf harnais hors ligne et les exécute, en conservant résultats et erreurs dans ce répertoire. Compilation bornée à 300 secondes par harnais pour permettre les dépendances natives ; chaque expérience est bornée à 20 secondes murales, 10 secondes CPU, 1 Gio (256 Mio pour les propriétés Unicode), core désactivé. Aucun accès réseau n'est nécessaire au rejeu hors ligne ; si le cache manque, la commande échoue sans contournement TLS ni installation automatique.

Le script passe **explicitement** `--config` pour charger le GLib vendored. Il conserve les variables de confiance et de réseau héritées, mais impose un target Cargo temporaire et le mode hors ligne. Il ne teste pas l'application complète, les autres plateformes ni un scénario de préparation entièrement neuf. **Le rejeu compilé de ce nouveau script n'a pas été exécuté durant la mission documentaire** ; seules sa syntaxe et sa préparation sans compilation ont été contrôlées. Les compilations initiales des harnais sont des exécutions distinctes, documentées dans les rapports.

Les anciens `historical-scripts/*.txt` sont des instantanés intermédiaires, aux chemins remplacés par des marqueurs. Certains généraient des fixtures ensuite ajustées ou supposaient des répertoires temporaires antérieurs. Ne pas les lancer pour écraser les sources finales. La reconstruction s'appuie sur les fixtures et sources finales archivées, pas sur une prétendue reconstitution fidèle par ces générateurs.

### Éléments non publiés et limites de conservation

Les métadonnées Cargo brutes, copies complètes avant/après du projet, cache Cargo, base RustSec complète, binaires et journaux complets restent temporaires. Les logs applicatifs publiés ne retiennent que compilation GLib, fin de profil, exécutables et résultats de tests ; l'échec du premier harnais non verrouillé est représenté par ses en-têtes d'erreurs. Les empreintes sources ne remplacent pas les octets omis. La base RustSec est référencée au commit retrouvé ; ses JSON d'audit ne fournissent pas eux-mêmes ce SHA.

Aucun ancien rapport Markdown autonome n'a été retrouvé dans les deux répertoires ; les rapports liés ci-dessus sont des synthèses nouvelles, pas des preuves retrouvées. Le premier diagnostic ne disposait pas d'un manifeste global contemporain des fichiers expérimentaux : les empreintes de sa collecte sont datées de l'archivage. Le manifeste de 31 fichiers du second diagnostic a été retrouvé et ses 31 empreintes vérifiées.

Les seules données sont techniques et synthétiques. Les domaines `.invalid` et les éventuels identifiants `user:pass` sont des fixtures fictives, sans secret réel. Pas de conversations, données privées, proxy, jetons, SDK ou dumps. Les sources tierces ne sont pas copiées. Les avis RustSec contenus dans les JSON conservent leurs métadonnées de licence **CC0-1.0** et leurs références ; provenance : [base RustSec au commit étudié](https://github.com/rustsec/advisory-db/tree/21d909e4c8bd4e14c7aea58bf980c881a0053ab1). Le fichier DerivedAge Unicode est seulement référencé par URL et empreinte.

## English — scope and reproduction limits

This archive preserves two historical read-only Codex diagnostics. It does not implement a dependency migration or modify the application workspace. The linked reports are newly written archival syntheses, not recovered contemporaneous Markdown reports.

`MANIFEST.json` authenticates archived files, excluding itself. `archive-provenance.json` distinguishes exact copies from path-redacted or selected extracts. Final harness sources, manifests and lockfiles have inert `.txt` suffixes. Shared graph catalogs preserve selected identities, features and target/kind edges without local cache paths. The first diagnostic had no complete contemporaneous evidence manifest; the second diagnostic's 31-file manifest was recovered and verified.

Run `verify.py` with Python 3.11+ for offline integrity and consistency checks. This does not rerun Rust or audits. `reproduce.py` prepares isolated copies and only builds/runs them with the explicit `--build-run` flag. It requires the prepared Linux environment and an explicit reviewed project Cargo configuration for vendored GLib. Each build has a 300-second timeout; each experiment has 20-second wall/10-second CPU limits, 1 GiB address space (256 MiB for Unicode properties), and disabled core dumps. Network access is offline and downloaded caches/binaries are not distributed.

The new compiled replay procedure was not executed during documentary archiving. Syntax and prepare-only behavior were checked; historical harness builds and runs are separate evidence. Original full metadata, logs, project copies and caches remain temporary. Source digests do not replace omitted bytes. Unicode data is referenced rather than redistributed; archived RustSec advisories retain CC0-1.0 metadata and attribution. No native Android, Windows, macOS, iOS or GUI validation is claimed. ChatGPT V4 must independently review before any future implementation.
