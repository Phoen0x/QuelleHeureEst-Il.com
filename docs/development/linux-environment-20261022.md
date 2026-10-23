# Reconstruction de l'environnement Linux — 22 octobre 2026

## Portée et preuves

Cette procédure accompagne la migration HTTP de #183, depuis `b880e9d0fefbb8662b7fdc46d3831a7c47684cf9`. Elle décrit un environnement de compilation Linux ; elle ne valide ni Android, ni l'interface graphique native, ni la distribution d'un installateur.

**Réellement exécuté :** réutilisation de Node 24.19.0, pnpm 8.15.9 et Rust/Cargo 1.99.1 déjà présents ; vérification de trois index Debian signés et de 132 archives ; réextraction dans un nouveau préfixe local ; installation pnpm figée ; compilation et contrôles Web/Rust sur les sources vérifiées. Les caches de paquets ont été réutilisés, avec un répertoire de compilation neuf lors de la préparation initiale. Ce n'est pas un bootstrap validé sur une machine entièrement vierge.

Les scripts et manifestes de préparation de la session ont été examinés avant modification des sources. Cette documentation en extrait uniquement la méthode publiable. Aucun chemin personnel, paramètre de proxy, secret, cache, SDK, binaire, archive système ou journal brut n'est versionné.

## Outils et répertoires extérieurs au dépôt

Choisir un répertoire inscriptible **extérieur au checkout**, puis conserver les outils, caches et paquets dans ce répertoire. Exemple générique :

```bash
export QH_DEV_ROOT="$(mktemp -d /tmp/qh-dev.XXXXXX)"
mkdir -p "$QH_DEV_ROOT"/{tools,cache,config,data,native,deb-archives,apt/lists/partial}
export XDG_CACHE_HOME="$QH_DEV_ROOT/cache"
export XDG_CONFIG_HOME="$QH_DEV_ROOT/config"
export XDG_DATA_HOME="$QH_DEV_ROOT/data"
export npm_config_cache="$QH_DEV_ROOT/cache/npm"
export CARGO_HOME="$QH_DEV_ROOT/tools/cargo"
export RUSTUP_HOME="$QH_DEV_ROOT/tools/rustup"
export CARGO_TARGET_DIR="$QH_DEV_ROOT/cache/cargo-target"
export CARGO_BUILD_JOBS=3 CARGO_NET_RETRY=1 CARGO_HTTP_TIMEOUT=45
```

Conserver les paramètres réseau et certificats fournis par la plateforme. Ne pas les recopier dans le dépôt ou dans des journaux publiés. Ne jamais désactiver TLS, les vérifications de certificats, les signatures de paquets ou les sandbox.

Installer ou sélectionner **Node 24.19.0**, **pnpm 8.15.9**, **Rust/Cargo 1.99.1**. Les installations suivantes sont une recette de reconstruction, **non exécutée comme bootstrap neuf pendant cette mission** :

```bash
# FR// Node 24.19.0 doit être installé par un canal officiel avec vérification de ses sommes.
# EN// Install Node 24.19.0 through an official channel with checksum verification.
timeout --kill-after=5s 180s npm install --prefix "$QH_DEV_ROOT/tools/pnpm" \
  --cache "$npm_config_cache" --fetch-retries=1 --fetch-timeout=45000 pnpm@8.15.9
export PATH="$QH_DEV_ROOT/tools/pnpm/node_modules/.bin:$CARGO_HOME/bin:$PATH"
# FR// rustup doit déjà être disponible depuis son canal officiel authentifié.
# EN// rustup must already be available from its authenticated official channel.
timeout --kill-after=5s 300s rustup toolchain install 1.99.1 --profile minimal
export RUSTUP_TOOLCHAIN=1.99.1
node --version
pnpm --version
rustc --version
cargo --version
```

Les versions réellement utilisées sont contrôlées avant les commandes ; un alias local nommé `stable` n'est pas une garantie de version. Aucun `rustup default` global n'est nécessaire. La sélection de Cargo ci-dessus ne doit pas affecter les autres projets.

## Prérequis Debian 13 spécifiques

Machine validée : Debian 13.6 trixie amd64, GCC 14.2.0, make, ar, ld et pkg-config système. Les bibliothèques locales observées sont GLib/GObject/GIO 2.84.4, GTK/GDK 3.24.49, WebKitGTK et JavaScriptCore API 4.1 version 2.54.0, libsoup 3.6.5, Cairo 1.18.4, Pango 1.56.3, GdkPixbuf 2.42.12, librsvg 2.60.0, Ayatana AppIndicator 0.5.94, OpenSSL 3.5.7 et libffi 3.4.8. patchelf 0.18.0 est disponible. libxdo n'était pas disponible via pkg-config et n'a pas bloqué le graphe compilé.

Les bibliothèques n'ont pas été installées dans les répertoires système. La méthode utilisée repose sur des paquets de `trixie`, `trixie-updates` et `trixie-security` obtenus via les dépôts HTTPS officiels, avec le trousseau Debian système. Le manifeste adjacent `debian13-packages-20261022.json` fixe les 132 versions, URL publiques et SHA-256 observés. Il ne contient pas les archives.

### Reconstruction du préfixe sans privilèges

1. Utiliser APT avec des répertoires d'état/cache **locaux**, une copie du statut dpkg de la machine et des sources Debian 13 munies de `signed-by=/usr/share/keyrings/debian-archive-keyring.gpg`. Garder `Acquire::Retries=1` et des délais HTTP/HTTPS de 45 secondes. Borner l'actualisation à 180 secondes et le téléchargement à 300 secondes. Ne pas modifier `/etc/apt` ni les paquets installés.
2. Demander uniquement le téléchargement, avec `apt-get --download-only --assume-yes --no-install-recommends install libgtk-3-dev libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev patchelf`. Le compilateur et les en-têtes de base doivent être disponibles ; leur installation éventuelle sur une machine neuve reste à vérifier selon ses droits. Une résolution APT courante ne garantit pas les versions du manifeste daté.
3. Pour les archives de la photographie datée, vérifier chaque SHA-256 contre le manifeste **et** contre les index Packages authentifiés correspondants. Les URL seules ne sont pas une preuve. Si une version a disparu du miroir, arrêter et signaler le besoin d'une archive Debian authentifiée ; ne pas substituer silencieusement une autre version.
4. Vérifier les InRelease avec `sqv --keyring /usr/share/keyrings/debian-archive-keyring.gpg --cleartext --output <fichier-neuf> <InRelease>`. Vérifier ensuite les SHA-256 et tailles des Packages contre le contenu signé, puis les archives contre ces Packages. Vérifier aussi Date/Valid-Until ; ne pas ignorer une expiration pour un téléchargement neuf. La vérification exécutée a utilisé sqv 1.3.0 ; gpgv était absent. Les index security/updates étaient encore valables au relevé du 22 octobre.
5. Extraire uniquement les archives authentifiées avec `dpkg-deb --extract <archive> "$QH_DEV_ROOT/native"`. Adapter les lignes `prefix=/usr` des fichiers `.pc` vers ce préfixe. Pour les liens relatifs devenus introuvables, des liens vers les prérequis système existants peuvent être ajoutés **à l'intérieur du préfixe seulement**, après contrôle du chemin résolu. Les 91 liens de la préparation validée dépendent de l'état système : leur nombre ne constitue pas une constante portable.

Activation après extraction :

```bash
export NATIVE_ROOT="$QH_DEV_ROOT/native"
cat > "$QH_DEV_ROOT/tools/pkg-config-native" <<'SH'
#!/usr/bin/env bash
exec /usr/bin/pkg-config --dont-define-prefix "$@"
SH
chmod +x "$QH_DEV_ROOT/tools/pkg-config-native"
export PKG_CONFIG="$QH_DEV_ROOT/tools/pkg-config-native"
export PKG_CONFIG_PATH="$NATIVE_ROOT/usr/lib/x86_64-linux-gnu/pkgconfig:$NATIVE_ROOT/usr/share/pkgconfig"
export LD_LIBRARY_PATH="$NATIVE_ROOT/usr/lib/x86_64-linux-gnu:$NATIVE_ROOT/usr/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export PATH="$NATIVE_ROOT/usr/bin:$PATH"
"$PKG_CONFIG" --modversion glib-2.0 gtk+-3.0 webkit2gtk-4.1 libsoup-3.0
```

Cette adaptation est propre à Debian 13 amd64. Ne pas appliquer le préfixe ou les versions à une autre distribution/architecture sans contrôle. Le trousseau, le compilateur, les en-têtes et les bibliothèques de base de l'hôte ne sont pas rendus hermétiques par cette procédure.

## Validation d'un checkout vérifié

Relire le SHA distant, puis vérifier que le checkout correspond à ce SHA avant toute modification. Ne pas régénérer les verrous pour contourner un échec. Le gestionnaire JS actif reste pnpm ; les représentations npm historiques sont conservées.

```bash
timeout --kill-after=5s 600s pnpm install --frozen-lockfile \
  --store-dir "$QH_DEV_ROOT/cache/pnpm" --fetch-retries=1 --fetch-timeout=20000
timeout --kill-after=5s 60s node docs/validation/rust-178/check-ported-graph.cjs
timeout --kill-after=5s 180s pnpm run typecheck
timeout --kill-after=5s 180s pnpm run lint
timeout --kill-after=5s 60s pnpm test
timeout --kill-after=5s 180s pnpm run vite:build
timeout --kill-after=5s 120s cargo tree --locked --target all
timeout --kill-after=5s 1200s cargo build --workspace --locked
timeout --kill-after=5s 1200s cargo test --workspace --locked
timeout --kill-after=5s 1200s cargo build --workspace --release --locked
```

Le contrôleur spécifique `python3 Scripts/check-http2-183-preservation.py` compare le candidat au SHA initial de #183 et exige ses objets Git de référence. Il vérifie aussi la dépendance Reqwest de production et ses fonctionnalités via Cargo metadata. Un clone superficiel doit disposer du commit de référence pour exécuter ce contrôle.

L'outil d'audit a été installé et exécuté hors dépôt : cargo-audit 0.22.2. Recette équivalente avec répertoires génériques :

```bash
CARGO_TARGET_DIR="$QH_DEV_ROOT/cache/audit-target" timeout --kill-after=5s 600s \
  cargo install cargo-audit --version 0.22.2 --locked --root "$QH_DEV_ROOT/tools/audit"
export PATH="$QH_DEV_ROOT/tools/audit/bin:$PATH"
timeout --kill-after=5s 120s cargo audit --deny warnings --db "$QH_DEV_ROOT/advisory-db"
```

La base d'avis évolue indépendamment du verrou. Conserver son SHA et distinguer vulnérabilités, avis de non-maintenance/unsoundness et versions retirées du registre. Un échec sous `--deny warnings` reste un échec ; ne pas ajouter d'ignore ou modifier la politique pour le rendre vert.

Le cache complet permet d'ajouter `--offline`. Lors de la préparation, le graphe Cargo toutes cibles a nécessité des archives Windows manquantes, puis a réussi hors ligne. Les tests Web/Vite et les tests de transport utilisent l'écoute locale : obtenir l'autorisation réseau normale de l'environnement, sans désactiver de sandbox. Vérifier les **cas nommés** et leur compte ; un succès au niveau d'un fichier ou une commande Cargo découvrant zéro test ne démontre pas leur exécution. Les résultats propres à la migration figurent dans `docs/reports/http2-183-20261022.md`.

## Android et GUI : capacités distinctes des validations

L'outillage restauré comprend un JDK 21 complet, le SDK Android (API 31/33/34/35/36), les build-tools 35/36, le NDK 28.2.13676358, CMake 3.22.1, adb et la cible Rust `aarch64-linux-android`. Leur présence/version a été contrôlée ; aucun bootstrap Android neuf, APK/AAB, test appareil/émulateur ou validation de compatibilité Android n'est démontré. Émulateur et KVM sont absents.

La compilation Linux et la résolution des bibliothèques du binaire ne valident pas le GUI. Les processus WebKit sont présents dans le préfixe local mais absents aux chemins système attendus. Aucun sandbox WebKit n'a été désactivé et aucune écriture système n'a été tentée pour contourner cette limite.

## Conservation et limites de reproduction

Conserver les archives de paquets et outils **hors Git** si une reproduction future à versions identiques est nécessaire. Un digest n'archive pas les octets ; les miroirs et caches peuvent disparaître. Les installations Node/Rust/pnpm depuis zéro, la résolution APT sur un hôte entièrement neuf et la procédure complète paramétrée ci-dessus n'ont pas été exécutées de bout en bout dans un environnement vierge. Elles restent des étapes à vérifier, distinctes de la réextraction et des compilations réellement effectuées.
