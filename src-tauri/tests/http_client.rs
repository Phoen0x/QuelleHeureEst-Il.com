// FR// Régression locale des API HTTP/JSON et du transport HTTP/2, sans API externe.
// EN// Local HTTP/JSON API and HTTP/2 transport regression, without external APIs.
use bytes::Bytes;
use serde_json::{json, Value};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

#[tokio::test]
async fn http1_json_client_remains_compatible() {
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let address = listener.local_addr().unwrap();
    let server = tokio::spawn(async move {
        let (mut stream, _) = listener.accept().await.unwrap();
        let mut request = Vec::new();
        loop {
            let mut buffer = [0_u8; 1024];
            let count = stream.read(&mut buffer).await.unwrap();
            assert!(count > 0 && request.len() + count <= 8192);
            request.extend_from_slice(&buffer[..count]);
            if request.windows(4).any(|part| part == b"\r\n\r\n") {
                break;
            }
        }
        let body = r#"{"results":[{"name":"Paris","latitude":48.85}]}"#;
        let response = format!(
            "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
            body.len(),
            body
        );
        stream.write_all(response.as_bytes()).await.unwrap();
    });
    let client = reqwest::Client::builder()
        .no_proxy()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .unwrap();
    let response = client
        .get(format!("http://{address}/"))
        .send()
        .await
        .unwrap();
    assert_eq!(response.version(), reqwest::Version::HTTP_11);
    let value: Value = response.json().await.unwrap();
    assert_eq!(value["results"][0]["name"], "Paris");
    server.await.unwrap();
}

#[tokio::test]
async fn http2_json_uses_patched_transport() {
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let address = listener.local_addr().unwrap();
    let server = tokio::spawn(async move {
        let (stream, _) = listener.accept().await.unwrap();
        let mut connection = h2::server::handshake(stream).await.unwrap();
        while let Some(request) = connection.accept().await {
            let (_, mut respond) = request.unwrap();
            let response = http::Response::builder()
                .header("content-type", "application/json")
                .body(())
                .unwrap();
            let mut body = respond.send_response(response, false).unwrap();
            body.send_data(
                Bytes::from_static(br#"{"current":{"temperature_2m":18.5}}"#),
                true,
            )
            .unwrap();
        }
    });
    let client = reqwest::Client::builder()
        .no_proxy()
        .http2_prior_knowledge()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .unwrap();
    let response = client
        .get(format!("http://{address}/"))
        .send()
        .await
        .unwrap();
    assert_eq!(response.version(), reqwest::Version::HTTP_2);
    let value: Value = response.json().await.unwrap();
    assert_eq!(value["current"]["temperature_2m"], json!(18.5));
    server.abort();
}
