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
  choices?: SettingChoice[];
  min?: number;
  max?: number;
  secret?: boolean;
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
      },
    ],
  },
  'app.supabase.url': {
    name: 'Supabase URL',
    description: 'The URL for the Supabase instance to use.',
    type: 'string',
  },
  'app.supabase.key': {
    name: 'Supabase Anonymous Key',
    description: 'The anonymous key for the Supabase instance to use.',
    type: 'string',
  },
  'openai.key': {
    name: 'OpenAI API Key',
    description: 'The API key to use for OpenAI models.',
    type: 'string',
    secret: true,
  },
  'azure.url': {
    name: 'Azure URL',
    description: 'The host URL for Azure models.',
    type: 'string',
  },
  'azure.key': {
    name: 'Azure API Key',
    description: 'The API key to use for Azure models.',
    type: 'string',
    secret: true,
  },
  'anthropic.key': {
    name: 'Anthropic API Key',
    description: 'The API key to use for Anthropic models.',
    type: 'string',
    secret: true,
  },
  'google.key': {
    name: 'PaLM 2 API Key',
    description: 'The API key to use for PaLM 2 models.',
    type: 'string',
    secret: true,
  },
  'ollama.url': {
    name: 'Ollama URL',
    description: 'The host URL for Ollama models.',
    type: 'string',
  },
};

export const DefaultValues: SavedSettings = {
  'app.theme': 'system',
  // OpenAI Models
  'model.gpt-3.5-turbo.context_window_size': 4096,
  'model.gpt-3.5-turbo-16k.context_window_size': 16000,
  'model.gpt-4.context_window_size': 8192,
  'model.gpt-4-32k.context_window_size': 32000,
  'model.gpt-4-1106-preview.context_window_size': 128000,
  'model.gpt-35-az.context_window_size': 4096,

  // Google Models
  'model.bard.context_window_size': 4096,

  // Anthropic Models
  'model.claude-instant-1.context_window_size': 100000,
  'model.claude-2.context_window_size': 100000,
  'model.claude-2.1.context_window_size': 200000,

  // Ollama Models
  'model.codellama:7b.context_window_size': 4096,
  'model.codellama:13b.context_window_size': 4096,
  'model.codellama:70b.context_window_size': 4096,
  'model.codellama:latest.context_window_size': 4096,
  'model.deepseek-coder:6.7b.context_window_size': 4096,
  'model.deepseek-coder:33b.context_window_size': 4096,
  'model.deepseek-coder:latest.context_window_size': 4096,
  'model.goliath:latest.context_window_size': 4096,
  'model.llama2:7b.context_window_size': 4096,
  'model.llama2:13b.context_window_size': 4096,
  'model.llama2:70b.context_window_size': 4096,
  'model.llama2:latest.context_window_size': 4096,
  'model.llama2-uncensored:latest.context_window_size': 4096,
  'model.mistral:latest.context_window_size': 4096,
  'model.mistral-openorca:latest.context_window_size': 4096,
  'model.mixtral:latest.context_window_size': 32000,
  'model.mixtral:8x7b.context_window_size': 32000,
  'model.neural-chat:latest.context_window_size': 4096,
  'model.openchat:latest.context_window_size': 4096,
  'model.orca-mini:latest.context_window_size': 4096,
  'model.phind-codellama:34b.context_window_size': 4096,
  'model.phind-codellama:34b-python.context_window_size': 4096,
  'model.phind-codellama:34b-v2.context_window_size': 4096,
  'model.phind-codellama:latest.context_window_size': 4096,
  'model.vicuna:latest.context_window_size': 4096,
  'model.wizardcoder:7b.context_window_size': 4096,
  'model.wizardcoder:13b-python.context_window_size': 4096,
  'model.wizardcoder:34b-python.context_window_size': 4096,
  'model.wizardcoder:latest.context_window_size': 4096,
  'model.wizardcoder:python.context_window_size': 4096,
  'model.yarn-mistral:7b-128k.context_window_size': 128000,
  'model.yarn-mistral:latest.context_window_size': 128000,
};
