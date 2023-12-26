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
pub async fn stream_azure<'a>(
    saved_settings: serde_json::Value,
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
    if api_key.is_none() {
        return Err(());
    }

    let mut base_url = "".to_string();
    match saved_settings.get("azure.url") {
        Some(url) => {
            if let Some(url_str) = url.as_str() {
                if url_str != "" {
                    base_url = url_str.to_string();
                }
            }
        }
        None => {
            return Err(());
        }
    }

    let url = format!(
        "{}/openai/deployments/{}/chat/completions?api-version=2023-03-15-preview",
        base_url,
        model.name.unwrap()
    );

    for m in messages.iter() {
        println!("Message: {:?}", m.content);
    }

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

    for m in messages_to_send.iter() {
        println!("Message to send: {:?}", m);
    }

    let mut body = serde_json::json!({
        "messages": messages_to_send,
        "stream": true,
    });

    if model.id != "gpt-4-1106-preview" {
        body["max_tokens"] = serde_json::json!(model.token_limit - token_count);
    }

    if let Some(temperature) = params.temperature {
        body["temperature"] = serde_json::json!(temperature);
    }

    if let Some(max_tokens) = params.max_tokens {
        body["max_tokens"] = serde_json::json!(max_tokens);
    }

    if let Some(repeat_penalty) = params.repeat_penalty {
        body["frequency_penalty"] = serde_json::json!(repeat_penalty);
    }

    if let Some(presence_penalty) = params.presence_penalty {
        body["presence_penalty"] = serde_json::json!(presence_penalty);
    }

    if let Some(stop) = params.stop {
        body["stop"] = serde_json::json!(stop);
    }

    if let Some(top_p) = params.top_p {
        body["top_p"] = serde_json::json!(top_p);
    }

    if let Some(seed) = params.seed {
        body["seed"] = serde_json::json!(seed);
    }

    let client = reqwest::Client::new();

    let res = client
        .post(url)
        .header("Content-Type", "application/json")
        .header("api-key", api_key.unwrap())
        .json(&body)
        .send()
        .await;

    match res {
        Ok(response) if response.status() != 200 => {
            let result: serde_json::Value = response.json().await.unwrap();
            debug!("Result: {:?}", result);

            if let Some(_) = result.get("error") {
                return Err(());
            } else {
                let error_message = format!(
                    "OpenAI API returned an error: {}",
                    result
                        .get("value")
                        .map_or_else(|| result["statusText"].to_string(), |v| v.to_string())
                );
                debug!("{}", error_message);
                panic!("{}", error_message);
            }
        }
        Ok(_) => {}
        Err(_) => panic!("Network error while trying to reach OpenAI API"),
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

                let boundary = buffer.rfind("\n\n").unwrap_or(0);

                if boundary == 0 {
                    continue;
                }

                let lines: Vec<&str> = event.split("\n\n").collect();

                for line in lines {
                    debug!("Line: {:?}", line);
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
                                if value == "[DONE]" {
                                    continue;
                                }
                                let json_data: serde_json::Value =
                                    serde_json::from_str(value).unwrap();
                                let choices = json_data["choices"].as_array();

                                match choices {
                                    Some(choices) => {
                                        if choices.len() > 0 {
                                            let delta = choices[0]["delta"].as_object().unwrap();

                                            match delta.get("content") {
                                                Some(content) => {
                                                    handle
                                                  .emit_all(
                                                      "completion-stream",
                                                      Some(serde_json::json!({
                                                          "text": content.as_str().unwrap().to_string(),
                                                          "id": assistant_message_id,
                                                      })),
                                                  )
                                                  .unwrap();
                                                }
                                                None => (),
                                            }
                                        }
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
