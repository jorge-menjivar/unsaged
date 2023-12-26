use std::sync::Mutex;

use crate::{
    models::{
        ai_models::{AiModel, ModelParams},
        conversations::Message,
    },
    ControllerState,
};
use log::debug;
use tauri::{Manager, State};
use tokio_stream::StreamExt;

#[tauri::command(rename_all = "snake_case")]
pub async fn stream_google<'a>(
    _saved_settings: serde_json::Value,
    model: AiModel,
    system_prompt: String,
    params: ModelParams,
    api_key: Option<String>,
    messages: Vec<Message>,
    _token_count: u32,
    assistant_message_id: String,
    handle: tauri::AppHandle,
    state: State<'a, Mutex<ControllerState>>,
) -> Result<(), ()> {
    if api_key.is_none() {
        return Err(());
    }

    let mut messages_to_send = vec![
        serde_json::json!({
            "role": "user",
            "parts": [{"text": system_prompt}],
        }),
        serde_json::json!({
            "role": "model",
            "parts": [{"text": "Understood."}],
        }),
    ];

    for message in messages.iter() {
        let role = if message.role == "user" {
            "user"
        } else {
            "model"
        };
        messages_to_send.push(serde_json::json!({
            "role": role,
            "parts": [{"text": message.content}],
        }));
    }

    let mut body = serde_json::json!({
        "contents": messages_to_send,
        "generationConfig": {
            "topP": 0.95,
            "topK": 40,
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ],
    });

    if let Some(temperature) = params.temperature {
        body["generationConfig"]["temperature"] = serde_json::json!(temperature);
    }

    if let Some(max_tokens) = params.max_tokens {
        body["generationConfig"]["maxOutputTokens"] = serde_json::json!(max_tokens);
    }

    if let Some(stop) = params.stop {
        body["generationConfig"]["stopSequences"] = serde_json::json!(stop);
    }

    if let Some(top_k) = params.top_k {
        body["generationConfig"]["topK"] = serde_json::json!(top_k);
    }

    if let Some(top_p) = params.top_p {
        body["generationConfig"]["topP"] = serde_json::json!(top_p);
    }

    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{}:streamGenerateContent?key={}",
        model.id,
        api_key.unwrap()
    );

    // pretty json
    println!("body: {}", serde_json::to_string_pretty(&body).unwrap());

    debug!("URL: {}", url);

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
                    "Google API returned an error: {}",
                    result
                        .get("value")
                        .map_or_else(|| result["statusText"].to_string(), |v| v.to_string())
                );
                panic!("{}", error_message);
            }
        }
        Ok(_) => (),
        Err(_) => panic!("Network error while trying to reach Google API"),
    }

    let mut stream = res.unwrap().bytes_stream();

    let mut buffer = "".to_string();
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

                buffer += &event;

                // Use grep style "grep "text" to get the text
                let matched_string = buffer
                    .split("\n")
                    .filter(|line| line.contains("text"))
                    .map(|line| line.replace("text: ", ""))
                    .collect::<Vec<String>>()
                    .join("\n");

                let trimmed_text = matched_string.trim().to_string();

                if trimmed_text == "" {
                    continue;
                }

                if !trimmed_text.ends_with('"') {
                    continue;
                }

                debug!("Matched String: {}", trimmed_text);

                let parsed_text = format!("{{{}}}", trimmed_text);

                let json_value: serde_json::Value = serde_json::from_str(&parsed_text).unwrap();

                debug!(
                    "JSON Value: {}",
                    serde_json::to_string_pretty(&json_value).unwrap()
                );

                let text = json_value["text"].as_str();

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

                buffer = "".to_string();
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
