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
      // {
      //   id: 'gpt-3.5-turbo_default_system_prompt',
      //   name: 'GPT-3.5 Default System Prompt',
      //   description: 'The default system prompt to use for GPT-3.5.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
      // {
      //   id: 'gpt-4_default_system_prompt',
      //   name: 'GPT-4 Default System Prompt',
      //   description: 'The default system prompt to use for GPT-4.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
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
      // {
      //   id: 'claude-v1_default_system_prompt',
      //   name: 'Claude V1 Default System Prompt',
      //   description: 'The default system prompt to use for Claude V1.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
      // {
      //   id: 'claude-v1-100k_default_system_prompt',
      //   name: 'Claude V1 100k Default System Prompt',
      //   description: 'The default system prompt to use for Claude V1 100k.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
      // {
      //   id: 'claude-instant-v1_default_system_prompt',
      //   name: 'Claude Instant V1 Default System Prompt',
      //   description: 'The default system prompt to use for Claude Instant V1.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
      // {
      //   id: 'claude-instant-v1-100k_default_system_prompt',
      //   name: 'Claude Instant V1 100k Default System Prompt',
      //   description:
      //     'The default system prompt to use for Claude Instant V1 100k.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
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
      // {
      //   id: 'claude-v1_default_system_prompt',
      //   name: 'Claude V1 Default System Prompt',
      //   description: 'The default system prompt to use for Claude V1.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
      // {
      //   id: 'claude-v1-100k_default_system_prompt',
      //   name: 'Claude V1 100k Default System Prompt',
      //   description: 'The default system prompt to use for Claude V1 100k.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
      // {
      //   id: 'claude-instant-v1_default_system_prompt',
      //   name: 'Claude Instant V1 Default System Prompt',
      //   description: 'The default system prompt to use for Claude Instant V1.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
      // {
      //   id: 'claude-instant-v1-100k_default_system_prompt',
      //   name: 'Claude Instant V1 100k Default System Prompt',
      //   description:
      //     'The default system prompt to use for Claude Instant V1 100k.',
      //   type: 'choice',
      //   choices: [
      //     {
      //       name: 'Default',
      //       value: 'default',
      //     },
      //   ],
      //   storage: 'local',
      // },
    ],
  },
];
