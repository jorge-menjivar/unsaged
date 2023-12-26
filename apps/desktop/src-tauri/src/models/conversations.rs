#[derive(Debug, serde::Deserialize)]
pub struct Message {
    pub id: String,
    pub role: String, // 'assistant' | 'user' | 'system'
    pub content: String,
    pub conversation_id: String,
    pub timestamp: String,
}
