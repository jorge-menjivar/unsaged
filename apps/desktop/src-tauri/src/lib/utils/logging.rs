use log::{debug, error, info, trace, warn};

#[tauri::command]
pub fn rust_log(message: String, level: &str) {
    match level {
        "ERROR" => error!("{}", message),
        "WARN" => warn!("{}", message),
        "INFO" => info!("{}", message),
        "DEBUG" => debug!("{}", message),
        "TRACE" => trace!("{}", message),
        _ => debug!("{}", message),
    }
}
