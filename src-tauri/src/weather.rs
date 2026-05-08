use serde_json::{json, Value};

pub async fn get_weather(lat: f64, lon: f64) -> Result<Value, String> {
    let url = format!(
        "https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation,weather_code,uv_index&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=auto",
        lat, lon
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Weather request failed: {}", e))?;

    response
        .json()
        .await
        .map_err(|e| format!("Failed to parse weather: {}", e))
}

pub async fn get_air_quality(lat: f64, lon: f64) -> Result<Value, String> {
    let url = format!(
        "https://air-quality-api.open-meteo.com/v1/air-quality?latitude={}&longitude={}&current=pm10,pm2_5,european_aqi&hourly=pm10,pm2_5&timezone=auto",
        lat, lon
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Air quality request failed: {}", e))?;

    response
        .json()
        .await
        .map_err(|e| format!("Failed to parse air quality: {}", e))
}

pub async fn get_pollen(lat: f64, lon: f64) -> Result<Value, String> {
    let url = format!(
        "https://pollen-api.open-meteo.com/v1/pollen?latitude={}&longitude={}&current=grass_pollen,birch_pollen,alder_pollen,olive_pollen,mugwort_pollen,ragweed_pollen&timezone=auto",
        lat, lon
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Pollen request failed: {}", e))?;

    response
        .json()
        .await
        .map_err(|e| format!("Failed to parse pollen: {}", e))
}
