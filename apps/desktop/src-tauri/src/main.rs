// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod lib {
    pub mod secrets;

    pub mod services {

        pub mod azure {
            pub mod stream;
            pub mod token_counter;
        }

        pub mod anthropic {
            pub mod stream;
        }

        pub mod google {
            pub mod stream;
        }

        pub mod ollama {
            pub mod models;
            pub mod stream;
        }

        pub mod openai {
            pub mod stream;
            pub mod token_counter;
        }
    }
    pub mod utils {
        pub mod logging;
    }
}

mod models {
    pub mod ai_models;
    pub mod conversations;
}

use lib::secrets::{delete_secret_value, get_secret_value, set_secret_value};
use lib::services::anthropic::stream::stream_anthropic;
use lib::services::azure::stream::stream_azure;
use lib::services::azure::token_counter::count_tokens_azure;
use lib::services::google::stream::stream_google;
use lib::services::ollama::models::get_ollama_models;
use lib::services::ollama::stream::stream_ollama;
use lib::services::openai::stream::stream_openai;
use lib::services::openai::token_counter::count_tokens_openai;
use lib::utils::logging::rust_log;
use std::sync::Mutex;
use tauri::Manager;

pub struct ControllerState(String);

fn main() {
    let mut app = tauri::Builder::default()
        .manage(Mutex::new(ControllerState("run".into())))
        .plugin(tauri_plugin_log::Builder::default().build());

    app = app
        .setup(move |app| {
            let app_handle = app.handle();
            let _ = app.listen_global("stop-streaming", move |_| {
                // when the event is emitted, we log the message
                println!("aborting completion");

                let state = app_handle.state::<Mutex<ControllerState>>();
                let mut state = state.lock().unwrap();

                state.0 = "abort".into();
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            rust_log,
            count_tokens_azure,
            count_tokens_openai,
            get_secret_value,
            set_secret_value,
            delete_secret_value,
            stream_azure,
            stream_anthropic,
            stream_google,
            stream_ollama,
            stream_openai,
            get_ollama_models
        ]);

    app.run(tauri::generate_context!())
        .expect("error while running tauri application");
}
