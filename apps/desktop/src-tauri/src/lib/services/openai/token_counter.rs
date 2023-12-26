use tiktoken_rs::cl100k_base;

#[derive(serde::Deserialize)]
pub struct Message {
    content: String,
}

#[tauri::command(rename_all = "snake_case")]
pub fn count_tokens_openai(
    model_name: String,
    system_prompt: String,
    messages: Vec<Message>,
) -> usize {
    let bpe = cl100k_base().unwrap();

    let prompt_tokens = bpe.encode_with_special_tokens(&system_prompt);

    let tokens_per_message = match model_name.as_str() {
        "gpt-3.5-turbo" | "gpt-3.5-turbo-16k" | "gpt-35-az" => 5,
        "gpt-4" | "gpt-4-32k" | "gpt-4-1106-preview" => 4,
        _ => 4,
    };

    let mut token_count = prompt_tokens.len() + tokens_per_message;

    // Iterate over messages and count tokens
    for message in messages {
        token_count += bpe.encode_with_special_tokens(&message.content).len() + tokens_per_message;
    }

    // every reply is primed with <|start|>assistant<|message|>
    token_count += 3;

    return token_count;
}
