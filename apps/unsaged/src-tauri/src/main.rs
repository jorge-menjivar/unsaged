// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod lib {
    pub mod secrets;
    pub mod token_counter;

    pub mod utils {
        pub mod logging;
    }
}

use lib::secrets::{delete_secret_value, get_secret_value, set_secret_value};
use lib::token_counter::count_tokens_openai;
use lib::utils::logging::rust_log;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build()) //
        .invoke_handler(tauri::generate_handler![
            rust_log,
            count_tokens_openai,
            get_secret_value,
            set_secret_value,
            delete_secret_value,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
