// FR// Importer le vrai cache ; isoler son environnement dans un processus enfant.
// EN// Import the real cache; isolate its environment in a child process.
#[path = "../src/cache.rs"]
mod cache;

#[test]
fn json_cache_preserves_all_three_data_types_and_invalid_input() {
    if std::env::var_os("QH_CACHE_TEST_CHILD").is_some() {
        let expected = serde_json::json!({"synthetic": true, "label": "été", "value": 42});
        assert!(cache::get_cached_location().is_none());
        cache::cache_location(expected.clone()).unwrap();
        cache::cache_weather(&expected).unwrap();
        cache::cache_air_quality(&expected).unwrap();
        assert_eq!(cache::get_cached_location(), Some(expected.clone()));
        assert_eq!(cache::get_cached_weather(), Some(expected.clone()));
        assert_eq!(cache::get_cached_air_quality(), Some(expected));
        let root = std::path::PathBuf::from(std::env::var_os("APPDATA").unwrap())
            .join("QuelleHeureEst-Il");
        for name in ["location.json", "weather.json", "air_quality.json"] {
            std::fs::write(root.join(name), "invalid synthetic JSON").unwrap();
        }
        assert!(cache::get_cached_location().is_none());
        assert!(cache::get_cached_weather().is_none());
        assert!(cache::get_cached_air_quality().is_none());
        return;
    }
    let folder = std::env::temp_dir().join(format!("qh-json-{}", uuid::Uuid::new_v4()));
    std::fs::create_dir(&folder).unwrap();
    let status = std::process::Command::new(std::env::current_exe().unwrap())
        .args([
            "--exact",
            "json_cache_preserves_all_three_data_types_and_invalid_input",
        ])
        .env("QH_CACHE_TEST_CHILD", "1")
        .env("APPDATA", &folder)
        .status()
        .unwrap();
    std::fs::remove_dir_all(folder).unwrap();
    assert!(status.success());
}
