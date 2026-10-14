## Audit licences — annexe 2 : preuves amont des 40 entrées hors des rejets CI

Les 450 autres déclarations proviennent directement des manifestes registry affichés par cargo-deny dans le job cité. Pour ces 40 entrées du lock, le nom **et la version** ont été vérifiés dans les sources amont ; une licence héritée du workspace a été résolue. Les archives crates.io n'ont pas pu être téléchargées dans cet environnement : leurs checksums du Cargo.lock n'ont donc pas été revérifiés par téléchargement. Cette limite est explicite ; aucune acceptation par le moteur cargo-deny n'est déduite de leur absence des 450 rejets.

| Paquet | Expression déclarée | Manifeste amont et blob Git | Héritage workspace |
|---|---|---|---|
| `bs58@0.5.1` | `MIT/Apache-2.0` | [source](https://github.com/Nullus157/bs58-rs/blob/0.5.1/Cargo.toml) — `155a225564f8b5c031cfa52fdf2f1e109414c1e4` | — |
| `defmt@1.1.1` | `MIT OR Apache-2.0` | [source](https://github.com/knurling-rs/defmt/blob/defmt-v1.1.1/defmt/Cargo.toml) — `8f74d1cb763cc3fe0da0fab08599cdc76e8ddf0e` | — |
| `defmt-macros@1.1.1` | `MIT OR Apache-2.0` | [source](https://github.com/knurling-rs/defmt/blob/defmt-v1.1.1/macros/Cargo.toml) — `57a09ce501374851d28339c28b3e26094eea54bd` | — |
| `defmt-parser@1.0.0` | `MIT OR Apache-2.0` | [source](https://github.com/knurling-rs/defmt/blob/defmt-v1.1.1/parser/Cargo.toml) — `d66cd58af66b1970a7fcb54d7f8018509306de49` | — |
| `getrandom@0.2.17` | `MIT OR Apache-2.0` | [source](https://github.com/rust-random/getrandom/blob/v0.2.17/Cargo.toml) — `fa2a05d8d686a7f4444d2e35abee38de5989402d` | — |
| `hex@0.4.3` | `MIT OR Apache-2.0` | [source](https://github.com/KokaKiwi/rust-hex/blob/v0.4.3/Cargo.toml) — `b25d8dd700ea40907c142428bb9b4cf7631fd310` | — |
| `httpdate@1.0.3` | `MIT OR Apache-2.0` | [source](https://github.com/pyfisch/httpdate/blob/v1.0.3/Cargo.toml) — `ddc17f10991084ad4dea8695b444a5ed6c1293d7` | — |
| `hyper-rustls@0.27.10` | `Apache-2.0 OR ISC OR MIT` | [source](https://github.com/rustls/hyper-rustls/blob/v/0.27.10/Cargo.toml) — `659cb4868a2e1d5d9186eb8d3b1498f514e89f69` | — |
| `jiff-static@0.2.38` | `Unlicense OR MIT` | [source](https://github.com/BurntSushi/jiff/blob/jiff-static-0.2.38/crates/jiff-static/Cargo.toml) — `8f1fb07229e54d07f6670b00f005d8f9b2edbc08` | — |
| `jiff-tzdb@0.1.9` | `Unlicense OR MIT` | [source](https://github.com/BurntSushi/jiff/blob/jiff-tzdb-0.1.9/crates/jiff-tzdb/Cargo.toml) — `d257b460fe3e496f633be9ae65ccb83072df95c7` | — |
| `jiff-tzdb-platform@0.1.3` | `Unlicense OR MIT` | [source](https://github.com/BurntSushi/jiff/blob/jiff-tzdb-platform-0.1.3/crates/jiff-tzdb-platform/Cargo.toml) — `8fd9253d3a5b797a5e5a37282505758e371b8f08` | — |
| `libappindicator@0.9.0` | `Apache-2.0 OR MIT` | [source](https://github.com/tauri-apps/libappindicator-rs/blob/main/Cargo.toml) — `b95a402b4cfb30489567f5b62dd2e88d658b3bc2` | — |
| `libappindicator-sys@0.9.0` | `Apache-2.0 OR MIT` | [source](https://github.com/tauri-apps/libappindicator-rs/blob/main/sys/Cargo.toml) — `8cc6e196b2eef71bedbc00bf5b51ac2770d21353` | — |
| `libloading@0.7.4` | `ISC` | [source](https://github.com/nagisa/rust_libloading/blob/0.7.4/Cargo.toml) — `3fdf0c8cda9968a3d17e12e2692932b30dae570c` | — |
| `objc2-io-surface@0.3.2` | `Zlib OR Apache-2.0 OR MIT` | [source](https://github.com/madsmtm/objc2/blob/main/framework-crates/objc2-io-surface/Cargo.toml) — `43abee39c32b3343b3d301a6d8c5bdc8be63a2c3` | [workspace](https://github.com/madsmtm/objc2/blob/main/Cargo.toml) |
| `ref-cast@1.0.27` | `MIT OR Apache-2.0` | [source](https://github.com/dtolnay/ref-cast/blob/1.0.27/Cargo.toml) — `245413c78c3502c3cef06187a64d18db6959fe8b` | — |
| `ref-cast-impl@1.0.27` | `MIT OR Apache-2.0` | [source](https://github.com/dtolnay/ref-cast/blob/1.0.27/derive/Cargo.toml) — `13e4eb6bff7bc1fdfcfc66dd50dcd7ddf30412ef` | — |
| `ring@0.17.14` | `Apache-2.0 AND ISC` | [source](https://github.com/briansmith/ring/blob/2723abbca9e83347d82b056d5b239c6604f786df/Cargo.toml) — `8f8da17dad7dc081290c6b9fee8c90b214cf4148` | — |
| `rustls@0.23.45` | `Apache-2.0 OR ISC OR MIT` | [source](https://github.com/rustls/rustls/blob/v/0.23.45/rustls/Cargo.toml) — `a1c97bdf6bc29dc238ea22499d4893acdbbd61aa` | — |
| `rustls-pemfile@1.0.4` | `Apache-2.0 OR ISC OR MIT` | [source](https://github.com/rustls/pemfile/blob/v/1.0.4/Cargo.toml) — `a0d84193f20d58b5d13c8835bcc43595b10c2d80` | — |
| `rustls-webpki@0.103.15` | `ISC` | [source](https://github.com/rustls/webpki/blob/v/0.103.15/Cargo.toml) — `c531f007e5c802c0e34eb6fd1fa6c3f35486b643` | — |
| `schemars@0.9.0` | `MIT` | [source](https://github.com/GREsau/schemars/blob/v0.9.0/schemars/Cargo.toml) — `e6a431d6a3cb467e99c6f6bc559939a1a88a7170` | — |
| `schemars@1.2.3` | `MIT` | [source](https://github.com/GREsau/schemars/blob/v1.2.3/schemars/Cargo.toml) — `79e08c67aee552602af7f71918b871244570e5ec` | — |
| `subtle@2.6.1` | `BSD-3-Clause` | [source](https://github.com/dalek-cryptography/subtle/blob/2.6.1/Cargo.toml) — `0a313eebf10ca5eb004fbe203c5569e008bbbc57` | — |
| `tinyvec@1.13.3` | `Zlib OR Apache-2.0 OR MIT` | [source](https://github.com/Lokathor/tinyvec/blob/v1.13.3/Cargo.toml) — `8a6ea040263c3f7562e2a7394d40a865c3bce221` | — |
| `tokio-rustls@0.26.6` | `MIT OR Apache-2.0` | [source](https://github.com/rustls/tokio-rustls/blob/v/0.26.6/Cargo.toml) — `72766dc0684c0671b5884c68c1215d6ae49e2331` | — |
| `tray-icon@0.25.1` | `MIT OR Apache-2.0` | [source](https://github.com/tauri-apps/tray-icon/blob/tray-icon-v0.25.1/Cargo.toml) — `8de42993d6f6305a8f87b162ef5282853529b889` | — |
| `untrusted@0.9.0` | `ISC` | [source](https://github.com/briansmith/untrusted/blob/main/Cargo.toml) — `92be2396fdc220b9f56a6761508a44b45dddfea3` | — |
| `windows-sys@0.52.0` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.52.0/crates/libs/sys/Cargo.toml) — `5f9642bde897b5ba4c3309eec94db6d9c78d466f` | — |
| `windows-targets@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/libs/targets/Cargo.toml) — `3aba60664381db040f3b112d8f06892567e00434` | — |
| `windows_aarch64_gnullvm@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/aarch64_gnullvm/Cargo.toml) — `0dfcf6c50ce1fb5f79668b22d9a9b19c68ed3a08` | — |
| `windows_aarch64_msvc@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/aarch64_msvc/Cargo.toml) — `e9f30ea128017bb686c991105b08bba585723888` | — |
| `windows_i686_gnu@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/i686_gnu/Cargo.toml) — `56b5e090b08eb32c5988c11ce5869f36d3a1fad1` | — |
| `windows_i686_gnullvm@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/i686_gnullvm/Cargo.toml) — `39f48c18b9ce4b987922978c4c0b4264e67d335d` | — |
| `windows_i686_msvc@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/i686_msvc/Cargo.toml) — `02174371c86c24367de6ea4c8bfe944869caceb8` | — |
| `windows_x86_64_gnu@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/x86_64_gnu/Cargo.toml) — `9faebe627ac35e3c92d08b36695ab8176916ffbb` | — |
| `windows_x86_64_gnullvm@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/x86_64_gnullvm/Cargo.toml) — `e007fb9a2734cd8c1ca86a48664225cf9103ee91` | — |
| `windows_x86_64_msvc@0.52.6` | `MIT OR Apache-2.0` | [source](https://github.com/microsoft/windows-rs/blob/0.58.0/crates/targets/x86_64_msvc/Cargo.toml) — `037c603396b55f1b0593694cc53128785d7359f7` | — |
| `zerocopy-derive@0.8.62` | `BSD-2-Clause OR Apache-2.0 OR MIT` | [source](https://github.com/google/zerocopy/blob/v0.8.62/zerocopy/zerocopy-derive/Cargo.toml) — `433b288abc92ab846a7a8f45e98ee827b264130d` | — |
| `zlib-rs@0.6.8` | `Zlib` | [source](https://github.com/trifectatechfoundation/zlib-rs/blob/v0.6.8/zlib-rs/Cargo.toml) — `aea2c66ef3a8df7f03c0859e8f068173438e13d1` | [workspace](https://github.com/trifectatechfoundation/zlib-rs/blob/v0.6.8/Cargo.toml) |

EN: Matching-version upstream evidence for all 40 lock entries outside the observed CI rejection set; registry archive checksum verification remains outstanding.
