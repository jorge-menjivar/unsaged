use log::{debug, error};

#[tauri::command(rename_all = "snake_case")]
pub async fn get_ollama_models(saved_settings: serde_json::Value) -> Vec<serde_json::Value> {
    let mut base_url = "http://127.0.0.1:11434".to_string();
    if let Some(url) = saved_settings.get("ollama.url") {
        if let Some(url_str) = url.as_str() {
            if url_str != "" {
                base_url = url_str.to_string();
            }
        }
    }

    let client = reqwest::Client::new();

    let url: String = format!("{}/api/tags", base_url);

    debug!("URL: {}", url);
    let res = client
        .get(url)
        .header("Content-Type", "application/json")
        .send()
        .await;

    match res {
        Ok(response) if response.status() != 200 => {
            let result: serde_json::Value = response.json().await.unwrap();
            error!("Result: {:?}", result);

            if let Some(error) = result.get("error") {
                error!("Error: {}", error);
            } else {
                let error_message = format!(
                    "Error fetching Ollama models: {}",
                    result
                        .get("value")
                        .map_or_else(|| result["statusText"].to_string(), |v| v.to_string())
                );
                debug!("{}", error_message);
            }

            return vec![];
        }
        Ok(response) => {
            let result: serde_json::Value = response.json().await.unwrap();

            let raw_models = result["models"].as_array().unwrap();

            return raw_models.clone();
        }
        Err(_) => {
            error!("Network error while trying to fetch Ollama models");
            return vec![];
        }
    }
}
