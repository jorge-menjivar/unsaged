export interface SettingChoice {
  name: string;
  value: string;
  default?: boolean;
}

export interface Setting {
  id: string;
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

export interface HttpOnlyCookie {
  domain: string;
  path: string;
}

export interface SettingsSection {
  id: string;
  name: string;
  settings: Setting[];
}

export interface SavedSetting {
  sectionId: string;
  settingId: string;
  value: any;
}

export const SystemSettings: SettingsSection[] = [
  {
    id: 'personalization',
    name: 'Personalization',
    settings: [
      {
        id: 'theme',
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
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    settings: [
      {
        id: 'api_key',
        name: 'API Key',
        description: 'The API key to use for OpenAI models.',
        type: 'string',
        storage: 'local',
      },
    ],
  },
  {
    id: 'azure',
    name: 'Azure',
    settings: [
      {
        id: 'api_key',
        name: 'API Key',
        description: 'The API key to use for Azure models.',
        type: 'string',
        storage: 'local',
      },
      {
        id: 'api_url',
        name: 'API Deployment Url',
        description: 'The API deployment url to use for Azure models.',
        type: 'string',
        storage: 'local',
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    settings: [
      {
        id: 'api_key',
        name: 'API Key',
        description: 'The API key to use for Anthropic models.',
        type: 'string',
        storage: 'local',
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    settings: [
      {
        id: 'api_key',
        name: 'API Key',
        description: 'The API key to use for PaLM 2 models.',
        type: 'string',
        storage: 'local',
      },
    ],
  },
];
