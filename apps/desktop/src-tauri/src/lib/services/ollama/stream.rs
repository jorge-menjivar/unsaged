use std::sync::Mutex;

use tauri::{Manager, State};
use tokio_stream::StreamExt;

use crate::{
    models::{
        ai_models::{AiModel, ModelParams},
        conversations::Message,
    },
    ControllerState,
};

#[tauri::command(rename_all = "snake_case")]
pub async fn stream_ollama<'a>(
    saved_settings: serde_json::Value,
    model: AiModel,
    system_prompt: String,
    params: ModelParams,
    _api_key: Option<String>,
    messages: Vec<Message>,
    _token_count: u32,
    assistant_message_id: String,
    handle: tauri::AppHandle,
    state: State<'a, Mutex<ControllerState>>,
) -> Result<(), ()> {
    let mut messages_to_send: Vec<serde_json::Value> = [serde_json::json!({
        "role": "system",
        "content": system_prompt,
    })]
    .to_vec();

    for message in messages.iter() {
        messages_to_send.push(serde_json::json!({
            "role": message.role,
            "content": message.content,
        }));
    }

    let mut base_url = "http://127.0.0.1:11434".to_string();
    if let Some(url) = saved_settings.get("ollama.url") {
        if let Some(url_str) = url.as_str() {
            if url_str != "" {
                base_url = url_str.to_string();
            }
        }
    }

    let mut body = serde_json::json!({
        "model": model.id,
        "messages": messages_to_send,
        "options": {},
        "stream": true
    });

    if let Some(temperature) = params.temperature {
        body["options"]["temperature"] = serde_json::json!(temperature);
    }

    if let Some(max_tokens) = params.max_tokens {
        body["options"]["num_predict"] = serde_json::json!(max_tokens);
    }

    if let Some(repeat_penalty) = params.repeat_penalty {
        body["options"]["repeat_penalty"] = serde_json::json!(repeat_penalty);
    }

    // Only supports one stop token
    if let Some(stop) = params.stop {
        body["stop_sequences"] = serde_json::json!([stop[0]]);
    }

    if let Some(top_k) = params.top_k {
        body["options"]["top_k"] = serde_json::json!(top_k);
    }

    if let Some(top_p) = params.top_p {
        body["options"]["top_p"] = serde_json::json!(top_p);
    }

    if let Some(seed) = params.seed {
        body["options"]["seed"] = serde_json::json!(seed);
    }

    let url = format!("{}/api/chat", base_url);

    let client = reqwest::Client::new();

    let res = client
        .post(url)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await;

    match res {
        Ok(response) if response.status() != 200 => {
            let result: serde_json::Value = response.json().await.unwrap();
            if let Some(_) = result.get("error") {
                return Err(());
            } else {
                let error_message = format!(
                    "Ollama API returned an error: {}",
                    result
                        .get("value")
                        .map_or_else(|| result["statusText"].to_string(), |v| v.to_string())
                );
                panic!("{}", error_message);
            }
        }
        Ok(_) => (),
        Err(_) => panic!("Network error while trying to reach Ollama API"),
    }

    let mut stream = res.unwrap().bytes_stream();

    while let Some(event) = stream.next().await {
        if state.lock().unwrap().0 == "abort" {
            // Reset the state
            state.lock().unwrap().0 = "run".to_string();

            // Tell the client to save the message to the database since the stream is done
            handle
                .emit_all(
                    "post-message",
                    Some(serde_json::json!({
                        "id": assistant_message_id,
                    })),
                )
                .unwrap();
            return Ok(());
        }

        match event {
            Ok(raw_event) => {
                let event = String::from_utf8(raw_event.to_vec()).unwrap();

                let json_data: serde_json::Value = serde_json::from_str(&event).unwrap();

                // message is a serde_json::Value containing role and content
                let message = json_data["message"].clone();
                let text = message["content"].as_str();

                match text {
                    Some(text) => {
                        handle
                            .emit_all(
                                "completion-stream",
                                Some(serde_json::json!({
                                    "text": text.to_string(),
                                    "id": assistant_message_id,
                                })),
                            )
                            .unwrap();
                    }
                    None => (),
                }
            }
            Err(e) => {
                // Handle the error case
                eprintln!("Error reading line: {}", e);
                return Err(());
            }
        }
    }

    // Tell the client to save the message to the database since the stream is done
    handle
        .emit_all(
            "post-message",
            Some(serde_json::json!({
                "id": assistant_message_id,
            })),
        )
        .unwrap();

    return Ok(());
}
