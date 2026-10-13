// Tauri main application file
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cache;
mod weather;
mod geocoding;

use tauri::Manager;
use serde_json;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
async fn search_location(query: String) -> Result<Vec<serde_json::Value>, String> {
    geocoding::search_locations(&query).await
}

#[tauri::command]
async fn get_weather(lat: f64, lon: f64) -> Result<serde_json::Value, String> {
    weather::get_weather(lat, lon).await
}

#[tauri::command]
async fn get_air_quality(lat: f64, lon: f64) -> Result<serde_json::Value, String> {
    weather::get_air_quality(lat, lon).await
}

#[tauri::command]
async fn get_pollen(lat: f64, lon: f64) -> Result<serde_json::Value, String> {
    weather::get_pollen(lat, lon).await
}

#[tauri::command]
fn get_cached_location() -> Option<serde_json::Value> {
    cache::get_cached_location()
}

#[tauri::command]
fn cache_location(location: serde_json::Value) -> Result<(), String> {
    cache::cache_location(location)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            search_location,
            get_weather,
            get_air_quality,
            get_pollen,
            get_cached_location,
            cache_location
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
