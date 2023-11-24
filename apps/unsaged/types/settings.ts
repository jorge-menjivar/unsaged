export interface SettingChoice {
  name: string;
  value: string;
  default?: boolean;
}

export interface Setting {
  name: string;
  description: string;
  type: 'choice' | 'string' | 'number' | 'boolean' | 'multiline-string';
  value?: any;
  defaultValue?: any;
  choices?: SettingChoice[];
  min?: number;
  max?: number;
  storage: 'local' | HttpOnlyCookie;
}

export interface Settings {
  [settingId: string]: Setting;
}

export interface HttpOnlyCookie {
  domain: string;
  path: string;
}

export interface SavedSettings {
  [settingId: string]: any;
}

export const SystemSettings: Settings = {
  'app.theme': {
    name: 'Theme',
    description: 'Choose your theme.',
    type: 'choice',
    choices: [
      {
        name: 'Light',
        value: 'light',
      },
      {
        name: 'Dark',
        value: 'dark',
      },
      {
        name: 'System',
        value: 'system',
        default: true,
      },
    ],
    storage: 'local',
  },
  'openai.key': {
    name: 'OpenAI API Key',
    description: 'The API key to use for OpenAI models.',
    type: 'string',
    storage: 'local',
  },
  'anthropic.key': {
    name: 'Anthropic API Key',
    description: 'The API key to use for Anthropic models.',
    type: 'string',
    storage: 'local',
  },
  'google.key': {
    name: 'PaLM 2 API Key',
    description: 'The API key to use for PaLM 2 models.',
    type: 'string',
    storage: 'local',
  },
  'ollama.url': {
    name: 'Ollama URL',
    description: 'The host URL for Ollama models.',
    type: 'string',
    storage: 'local',
  },
};
