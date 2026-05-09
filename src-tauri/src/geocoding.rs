use serde_json::{json, Value};
use urlencoding;

pub async fn search_locations(query: &str) -> Result<Vec<Value>, String> {
    let url = format!(
        "https://geocoding-api.open-meteo.com/v1/search?name={}&count=10&language=fr",
        urlencoding::encode(query)
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let data: Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let results = data
        .get("results")
        .and_then(|r| r.as_array())
        .ok_or("No results found")?;

    let formatted: Vec<Value> = results
        .iter()
        .enumerate()
        .map(|(idx, loc)| {
            json!({
                "id": format!("{}", idx),
                "name": loc.get("name").and_then(|v| v.as_str()).unwrap_or(""),
                "admin1": loc.get("admin1").and_then(|v| v.as_str()),
                "country": loc.get("country").and_then(|v| v.as_str()).unwrap_or(""),
                "latitude": loc.get("latitude").and_then(|v| v.as_f64()),
                "longitude": loc.get("longitude").and_then(|v| v.as_f64()),
                "timezone": loc.get("timezone").and_then(|v| v.as_str()),
                "population": loc.get("population").and_then(|v| v.as_u64()),
            })
        })
        .collect();

    Ok(formatted)
}
