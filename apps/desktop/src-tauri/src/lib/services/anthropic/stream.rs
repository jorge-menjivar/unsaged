use std::sync::Mutex;

use log::debug;
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
pub async fn stream_anthropic<'a>(
    _saved_settings: serde_json::Value,
    model: AiModel,
    system_prompt: String,
    params: ModelParams,
    api_key: Option<String>,
    messages: Vec<Message>,
    token_count: u32,
    assistant_message_id: String,
    handle: tauri::AppHandle,
    state: State<'a, Mutex<ControllerState>>,
) -> Result<(), ()> {
    let mut prompt = system_prompt.clone();

    let mut parsed_messages = String::new();
    for message in messages.iter().rev() {
        let role = if message.role == "user" {
            "Human"
        } else {
            "Assistant"
        };
        parsed_messages = format!("\n\n{}: {}", role, message.content) + &parsed_messages;
    }

    prompt += &parsed_messages;

    prompt += "\n\nAssistant:";

    debug!("Prompt: {}", prompt);

    let mut body = serde_json::json!({
        "prompt": prompt,
        "model": model.id,
        "max_tokens_to_sample": model.token_limit - token_count,
        "stop_sequences": ["\n\nUser:"],
        "stream": true
    });

    if let Some(max_tokens) = params.max_tokens {
        body["max_tokens_to_sample"] = serde_json::json!(max_tokens);
    }

    if let Some(temperature) = params.temperature {
        body["temperature"] = serde_json::json!(temperature);
    }

    // Only supports one stop token
    if let Some(stop) = params.stop {
        body["stop_sequences"] = serde_json::json!([stop[0]]);
    }

    if let Some(top_k) = params.top_k {
        body["top_k"] = serde_json::json!(top_k);
    }

    if let Some(top_p) = params.top_p {
        body["top_p"] = serde_json::json!(top_p);
    }

    let client = reqwest::Client::new();

    let res = client
        .post("https://api.anthropic.com/v1/complete")
        .header("Content-Type", "application/json")
        .header("anthropic-version", "2023-06-01")
        .header("x-api-key", &api_key.unwrap_or_default())
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
                    "Anthropic API returned an error: {}",
                    result
                        .get("value")
                        .map_or_else(|| result["statusText"].to_string(), |v| v.to_string())
                );
                panic!("{}", error_message);
            }
        }
        Ok(_) => (),
        Err(_) => panic!("Network error while trying to reach Anthropic API"),
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

                let lines: Vec<&str> = event.split('\n').collect();

                for line in lines {
                    if line != "" {
                        let (field, value) = if let Some(pos) = line.find(':') {
                            let (f, v) = line.split_at(pos);
                            // Strip : and an optional space.
                            let v = &v[1..];
                            let v = if v.starts_with(' ') { &v[1..] } else { v };
                            (f, v)
                        } else {
                            // Ignore lines that don't have a colon.
                            continue;
                        };

                        match field {
                            "event" => {}
                            "data" => {
                                let json_data: serde_json::Value =
                                    serde_json::from_str(value).unwrap();
                                let text = json_data["completion"].as_str();

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
                            "id" => {}
                            _ => (), // ignored
                        }
                    }
                }
            }
            Err(e) => {
                // Handle the error case
                eprintln!("Error reading line: {}", e);
                return Err(());
            }
        }
    }

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
