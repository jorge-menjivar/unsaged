import { debug, error } from '@/utils/logging';

import { TAURI } from '../../const';

import { invoke } from '@tauri-apps/api/tauri';

export async function storageGetSecret(key: string) {
  if (TAURI) {
    try {
      return await invoke('get_secret_value', { key });
    } catch (e) {
      error(e);
      return null;
    }
  } else {
    return localStorage.getItem(key);
  }
}

export async function storageSetSecret(key: string, value: string) {
  if (TAURI) {
    try {
      return await invoke('set_secret_value', { key, value });
    } catch (e) {
      error(e);
      return null;
    }
  } else {
    localStorage.setItem(key, value);
  }
}

export async function storageDeleteSecret(key: string) {
  if (TAURI) {
    try {
      return await invoke('delete_secret_value', { key });
    } catch (e) {
      error(e);
      return null;
    }
  } else {
    localStorage.removeItem(key);
  }
}
