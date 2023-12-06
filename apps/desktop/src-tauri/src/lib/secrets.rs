use keyring::Entry;
use log::{debug, error, info};

#[tauri::command(rename_all = "snake_case")]
pub fn get_secret_value(key: String) -> String {
    debug!("Getting secret value for: {}", &key);

    // Securing api keys in the OS keyring
    let entry = Entry::new("unsaged", &key).expect("Could not get keyring entry");
    let password = entry.get_password();

    return match password {
        Ok(password) => password,
        Err(_) => {
            info!("{} not found in keyring", &key);
            "".to_string()
        }
    };
}

#[tauri::command(rename_all = "snake_case")]
pub fn set_secret_value(key: String, value: String) -> bool {
    debug!("Setting secret {} to: {}", &key, &value);

    // Securing api keys in the OS keyring
    let entry = Entry::new("unsaged", &key).expect("Could not get keyring entry");
    let res = entry.set_password(&value);

    return match res {
        Ok(_) => true,
        Err(_) => {
            error!("Could not set secret in keyring");
            false
        }
    };
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_secret_value(key: String) -> bool {
    debug!("Deleting secret value for: {}", &key);

    // Securing api keys in the OS keyring
    let entry = Entry::new("unsaged", &key).expect("Could not get keyring entry");
    let res = entry.delete_password();

    return match res {
        Ok(_) => true,
        Err(_) => {
            error!("Could not delete secret in keyring");
            false
        }
    };
}
