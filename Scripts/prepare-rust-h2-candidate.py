# FR// Générer un candidat dans le runner ; aucun push automatique.
# EN// Generate a runner-local candidate; no automatic push.
# FR// Par défaut, contrôler seulement ; --generate exige la référence historique intacte.
# EN// Check only by default; --generate requires an intact historical baseline.
import sys
sys.dont_write_bytecode = True
from candidate_safety import require_compatible
require_compatible("rust-h2")
from pathlib import Path
import subprocess
import tomllib

manifest = Path("src-tauri/Cargo.toml")
baseline = tomllib.loads(Path("Cargo.lock").read_text())
manifest.write_text("[package]\nname = \"quelleheureest\"\nversion = \"0.0.1\"\ndescription = \"QuelleHeureEst-Il - A native cross-platform weather and time application\"\nauthors = [\"Your Name\"]\nedition = \"2021\"\npublish = false\n\n[build-dependencies]\ntauri-build = { version = \"2.0\", features = [] }\n\n[dependencies]\ntauri = { version = \"2.0\", features = [] }\nserde = { version = \"1.0\", features = [\"derive\"] }\nserde_json = \"1.0\"\ntokio = { version = \"1\", features = [\"full\"] }\n# FR// Référence historique conservée ; la branche 0.11 impose h2 0.3 vulnérable.\n# EN// Historical reference retained; the 0.11 line requires vulnerable h2 0.3.\n# reqwest = { version = \"0.11\", features = [\"json\"] }\n# FR// 0.12 conserve TLS natif, JSON et HTTP/2 tout en passant à h2 0.4.\n# EN// 0.12 retains native TLS, JSON and HTTP/2 while migrating to h2 0.4.\nreqwest = { version = \"0.12.28\", features = [\"json\"] }\nchrono = { version = \"0.4\", features = [\"serde\"] }\nchrono-tz = \"0.8\"\nrusqlite = { version = \"0.29\", features = [\"bundled\", \"chrono\"] }\nuuid = { version = \"1.0\", features = [\"v4\", \"serde\"] }\nlog = \"0.4\"\nenv_logger = \"0.11\"\nurlencoding = \"2.1\"\n\n[features]\ndefault = [\"custom-protocol\"]\ncustom-protocol = [\"tauri/custom-protocol\"]\n\n[profile.release]\nopt-level = \"z\"\nlto = true\n\n\n# FR// Tests locaux de migration ; h2 impose aussi le minimum corrigé pour HTTP/2.\n# EN// Local migration tests; h2 also enforces the patched HTTP/2 minimum.\n[dev-dependencies]\nh2 = \"0.4.16\"\nhttp = \"1\"\nbytes = \"1\"\n")
subprocess.run(["cargo", "update", "-p", "reqwest@0.11.27"], check=True)
candidate = tomllib.loads(Path("Cargo.lock").read_text())
old_names = {p["name"] for p in baseline["package"]}
new_names = {p["name"] for p in candidate["package"]}
missing = sorted(old_names - new_names)
print("MIGRATION_MISSING_NAMES", missing, flush=True)
# FR// Conserver explicitement les paquets devenus indépendants de la pile HTTP.
# EN// Explicitly retain packages no longer required by the HTTP stack.
allowed_retention = {"httpdate", "rustls-pemfile", "winreg", "system-configuration", "system-configuration-sys"}
if set(missing) - allowed_retention:
    raise SystemExit("Paquets non prévus à revoir / Unexpected packages to review: " + str(missing))
for name in missing:
    version = next(p["version"] for p in baseline["package"] if p["name"] == name)
    target = (
        "cfg(target_os = \"windows\")" if name == "winreg" else
        "cfg(target_os = \"macos\")" if name.startswith("system-configuration") else None
    )
    table = f"[target.'{target}'.dependencies.{name}]" if target else "[dependencies." + name + "]"
    block = f'\n{table}\nversion = "={version}"\noptional = true\n'
    with manifest.open("a") as output:
        output.write("\n# FR// Dépendance historique conservée en option, sans activation en production.\n")
        output.write("# EN// Historical dependency retained as optional, without production activation.\n")
        output.write(block)
if missing:
    subprocess.run(["cargo", "update", "-p", "reqwest@0.12.28"], check=True)
Path("src-tauri/tests").mkdir(exist_ok=True)
Path("src-tauri/tests/http_client.rs").write_text("// FR// Régression locale des API HTTP/JSON et du transport HTTP/2, sans API externe.\n// EN// Local HTTP/JSON API and HTTP/2 transport regression, without external APIs.\nuse bytes::Bytes;\nuse serde_json::{json, Value};\nuse tokio::io::{AsyncReadExt, AsyncWriteExt};\nuse tokio::net::TcpListener;\n\n#[tokio::test]\nasync fn http1_json_client_remains_compatible() {\n    let listener = TcpListener::bind(\"127.0.0.1:0\").await.unwrap();\n    let address = listener.local_addr().unwrap();\n    let server = tokio::spawn(async move {\n        let (mut stream, _) = listener.accept().await.unwrap();\n        let mut request = Vec::new();\n        loop {\n            let mut buffer = [0_u8; 1024];\n            let count = stream.read(&mut buffer).await.unwrap();\n            assert!(count > 0 && request.len() + count <= 8192);\n            request.extend_from_slice(&buffer[..count]);\n            if request.windows(4).any(|part| part == b\"\\r\\n\\r\\n\") {\n                break;\n            }\n        }\n        let body = r#\"{\"results\":[{\"name\":\"Paris\",\"latitude\":48.85}]}\"#;\n        let response = format!(\n            \"HTTP/1.1 200 OK\\r\\nContent-Type: application/json\\r\\nContent-Length: {}\\r\\nConnection: close\\r\\n\\r\\n{}\",\n            body.len(),\n            body\n        );\n        stream.write_all(response.as_bytes()).await.unwrap();\n    });\n    let client = reqwest::Client::builder()\n        .no_proxy()\n        .timeout(std::time::Duration::from_secs(5))\n        .build()\n        .unwrap();\n    let response = client.get(format!(\"http://{address}/\")).send().await.unwrap();\n    assert_eq!(response.version(), reqwest::Version::HTTP_11);\n    let value: Value = response.json().await.unwrap();\n    assert_eq!(value[\"results\"][0][\"name\"], \"Paris\");\n    server.await.unwrap();\n}\n\n#[tokio::test]\nasync fn http2_json_uses_patched_transport() {\n    let listener = TcpListener::bind(\"127.0.0.1:0\").await.unwrap();\n    let address = listener.local_addr().unwrap();\n    let server = tokio::spawn(async move {\n        let (stream, _) = listener.accept().await.unwrap();\n        let mut connection = h2::server::handshake(stream).await.unwrap();\n        while let Some(request) = connection.accept().await {\n            let (_, mut respond) = request.unwrap();\n            let response = http::Response::builder()\n                .header(\"content-type\", \"application/json\")\n                .body(())\n                .unwrap();\n            let mut body = respond.send_response(response, false).unwrap();\n            body.send_data(Bytes::from_static(br#\"{\"current\":{\"temperature_2m\":18.5}}\"#), true)\n                .unwrap();\n        }\n    });\n    let client = reqwest::Client::builder()\n        .no_proxy()\n        .http2_prior_knowledge()\n        .timeout(std::time::Duration::from_secs(5))\n        .build()\n        .unwrap();\n    let response = client.get(format!(\"http://{address}/\")).send().await.unwrap();\n    assert_eq!(response.version(), reqwest::Version::HTTP_2);\n    let value: Value = response.json().await.unwrap();\n    assert_eq!(value[\"current\"][\"temperature_2m\"], json!(18.5));\n    server.abort();\n}\n")
