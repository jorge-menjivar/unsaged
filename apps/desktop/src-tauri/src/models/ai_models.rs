#[derive(serde::Deserialize)]
pub struct AiModel {
    pub name: Option<String>,
    pub id: String,
    pub token_limit: u32,
    pub vendor: String,
}

#[derive(serde::Deserialize)]
pub struct ModelParams {
    pub temperature: Option<f64>,
    pub top_p: Option<f64>,
    pub top_k: Option<u32>,
    pub repeat_penalty: Option<f64>,
    pub presence_penalty: Option<f64>,
    pub stop: Option<Vec<String>>,
    pub max_tokens: Option<u32>,
    pub seed: Option<u32>,
}
