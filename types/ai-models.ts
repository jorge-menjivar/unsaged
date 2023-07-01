export interface AiModel {
  id: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  requestLimit: number;
  vendor: 'OpenAI' | 'Anthropic';
}

export interface PossibleAiModelsInterface {
  [modelId: string]: AiModel;
}

export const PossibleAiModels: PossibleAiModelsInterface = {
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    maxLength: 12000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'OpenAI',
  },
  'gpt-35-az': {
    id: 'gpt-35-az',
    maxLength: 12000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'OpenAI',
  },
  'gpt-4': {
    id: 'gpt-4',
    maxLength: 24000,
    tokenLimit: 8000,
    requestLimit: 6000,
    vendor: 'OpenAI',
  },
  'gpt-4-32k': {
    id: 'gpt-4-32k',
    maxLength: 96000,
    tokenLimit: 32000,
    requestLimit: 30000,
    vendor: 'OpenAI',
  },
  'claude-v1': {
    id: 'claude-v1',
    maxLength: 24000,
    tokenLimit: 9000,
    requestLimit: 7000,
    vendor: 'Anthropic',
  },
  'claude-v1-100k': {
    id: 'claude-v1-100k',
    maxLength: 300000,
    tokenLimit: 100000,
    requestLimit: 98000,
    vendor: 'Anthropic',
  },
  'claude-instant-v1': {
    id: 'claude-instant-v1',
    maxLength: 24000,
    tokenLimit: 9000,
    requestLimit: 7000,
    vendor: 'Anthropic',
  },
  'claude-instant-v1-100k': {
    id: 'claude-instant-v1-100k',
    maxLength: 300000,
    tokenLimit: 100000,
    requestLimit: 98000,
    vendor: 'Anthropic',
  },
};
