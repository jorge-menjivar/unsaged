use log::{debug, error};
use tauri::Manager;

use crate::models::{
    ai_models::{AiModel, ModelParams},
    conversations::Message,
};

#[tauri::command(rename_all = "snake_case")]
pub async fn stream_google(
    _saved_settings: serde_json::Value,
    _model: AiModel,
    system_prompt: String,
    params: ModelParams,
    api_key: Option<String>,
    messages: Vec<Message>,
    _token_count: u32,
    assistant_message_id: String,
    handle: tauri::AppHandle,
) {
    if api_key.is_none() {
        return;
    }

    let mut messages_to_send = vec![];

    for message in messages.iter() {
        let role = if message.role == "user" {
            "user"
        } else {
            "model"
        };
        messages_to_send.push(serde_json::json!({
            "author": role,
            "content": message.content,
        }));
    }

    let examples = vec![
        serde_json::json!({
            "input": { "content": "Hi" },
            "output": { "content": "Hi, how can I help you today?" }
        }),
        serde_json::json!({
            "input": { "content": "Tell me a joke" },
            "output": { "content": "Why don't scientists trust atoms? Because they make up everything!" }
        }),
        serde_json::json!({
            "input": { "content": "What can you do?" },
            "output": { "content": "I can assist with a variety of tasks, including answering questions, providing information, and more." }
        }),
    ];

    let prompt = serde_json::json!({
        "context": system_prompt,
        "examples": examples,
        "messages": messages_to_send,
    });
    let mut body = serde_json::json!({
        "prompt": prompt,
        "candidateCount": 1,
        "topP": 0.95,
        "topK": 40,
    });

    if let Some(temperature) = params.temperature {
        body["temperature"] = serde_json::json!(temperature);
    }

    if let Some(max_tokens) = params.max_tokens {
        body["maxOutputTokens"] = serde_json::json!(max_tokens);
    }

    if let Some(stop) = params.stop {
        body["stopSequences"] = serde_json::json!(stop);
    }

    if let Some(top_k) = params.top_k {
        body["topK"] = serde_json::json!(top_k);
    }

    if let Some(top_p) = params.top_p {
        body["topP"] = serde_json::json!(top_p);
    }

    let client = reqwest::Client::new();

    debug!("Body: {:?}", body);

    let url = ("https://generativelanguage.googleapis.com/v1beta3/models/chat-bison-001:generateMessage?key=".to_owned() + &api_key.unwrap()).to_string();

    debug!("URL: {}", url);
    let res = client
        .post(url)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await;

    match res {
        Ok(response) if response.status() != 200 => {
            let result: serde_json::Value = response.json().await.unwrap();
            error!("Result: {:?}", result);

            if let Some(_) = result.get("error") {
                return;
            } else {
                let error_message = format!(
                    "PaLM API returned an error: {}",
                    result
                        .get("value")
                        .map_or_else(|| result["statusText"].to_string(), |v| v.to_string())
                );
                debug!("{}", error_message);
                panic!("{}", error_message);
            }
        }
        Ok(response) => {
            let result: serde_json::Value = response.json().await.unwrap();

            let text = result["candidates"][0]["content"]
                .as_str()
                .unwrap()
                .to_string();

            handle
                .emit_all(
                    "completion-stream",
                    Some(serde_json::json!({
                        "text": text,
                        "id": assistant_message_id,
                    })),
                )
                .unwrap();
        }
        Err(_) => panic!("Network error while trying to reach PaLM API"),
    }

    handle
        .emit_all(
            "post-message",
            Some(serde_json::json!({
                "id": assistant_message_id,
            })),
        )
        .unwrap();

    return;
}
