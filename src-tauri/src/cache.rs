use std::path::PathBuf;
use serde_json::{json, Value};
use std::fs;

fn get_cache_dir() -> PathBuf {
    if let Ok(dir) = std::env::var("APPDATA") {
        PathBuf::from(dir).join("QuelleHeureEst-Il")
    } else if let Ok(dir) = std::env::var("HOME") {
        PathBuf::from(dir).join(".config/quelleheureest")
    } else {
        PathBuf::from(".cache/quelleheureest")
    }
}

fn get_cache_file(filename: &str) -> PathBuf {
    let dir = get_cache_dir();
    if !dir.exists() {
        let _ = fs::create_dir_all(&dir);
    }
    dir.join(filename)
}

pub fn get_cached_location() -> Option<Value> {
    let path = get_cache_file("location.json");
    if let Ok(data) = fs::read_to_string(path) {
        serde_json::from_str(&data).ok()
    } else {
        None
    }
}

pub fn cache_location(location: Value) -> Result<(), String> {
    let path = get_cache_file("location.json");
    let data = serde_json::to_string(&location)
        .map_err(|e| format!("Failed to serialize: {}", e))?;
    fs::write(path, data)
        .map_err(|e| format!("Failed to write cache: {}", e))
}

pub fn cache_weather(data: &Value) -> Result<(), String> {
    let path = get_cache_file("weather.json");
    let json_str = serde_json::to_string(data)
        .map_err(|e| format!("Failed to serialize: {}", e))?;
    fs::write(path, json_str)
        .map_err(|e| format!("Failed to write cache: {}", e))
}

pub fn get_cached_weather() -> Option<Value> {
    let path = get_cache_file("weather.json");
    if let Ok(data) = fs::read_to_string(path) {
        serde_json::from_str(&data).ok()
    } else {
        None
    }
}

pub fn cache_air_quality(data: &Value) -> Result<(), String> {
    let path = get_cache_file("air_quality.json");
    let json_str = serde_json::to_string(data)
        .map_err(|e| format!("Failed to serialize: {}", e))?;
    fs::write(path, json_str)
        .map_err(|e| format!("Failed to write cache: {}", e))
}

pub fn get_cached_air_quality() -> Option<Value> {
    let path = get_cache_file("air_quality.json");
    if let Ok(data) = fs::read_to_string(path) {
        serde_json::from_str(&data).ok()
    } else {
        None
    }
}
