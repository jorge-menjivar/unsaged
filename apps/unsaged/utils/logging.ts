import { TAURI } from './app/const';

import { invoke } from '@tauri-apps/api/tauri';

function convertObjectsToStrings(args: any[]): string[] {
  return args.map((arg) => {
    if (typeof arg === 'object') {
      return JSON.stringify(arg, null, 2);
    }
    return arg;
  });
}

export function debug(...args: any[]) {
  args = convertObjectsToStrings(args);
  if (TAURI) {
    invoke('rust_log', {
      message: args.join(' '),
      level: 'DEBUG',
    });
  } else {
    console.log(...args);
  }
}

export function info(...args: any[]) {
  args = convertObjectsToStrings(args);
  if (TAURI) {
    invoke('rust_log', {
      message: args.join(' '),
      level: 'INFO',
    });
  } else {
    console.info(...args);
  }
}

export function warn(...args: any[]) {
  args = convertObjectsToStrings(args);
  if (TAURI) {
    invoke('rust_log', {
      message: args.join(' '),
      level: 'WARN',
    });
  } else {
    console.warn(...args);
  }
}

export function error(...args: any[]) {
  args = convertObjectsToStrings(args);
  if (TAURI) {
    invoke('rust_log', {
      message: args.join(' '),
      level: 'ERROR',
    });
  } else {
    console.error(...args);
  }
}

export function trace(...args: any[]) {
  args = convertObjectsToStrings(args);
  if (TAURI) {
    invoke('rust_log', {
      message: args.join(' '),
      level: 'TRACE',
    });
  } else {
    console.trace(...args);
  }
}
