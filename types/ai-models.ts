import { AZURE_DEPLOYMENT_ID } from '@/utils/app/const';

export interface AiModel {
  id: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  requestLimit: number;
  vendor: 'OpenAI' | 'Anthropic' | 'Google';
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
  'gpt-3.5-turbo-16k': {
    id: 'gpt-3.5-turbo-16k',
    maxLength: 48000,
    tokenLimit: 16000,
    requestLimit: 12000,
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
  'gpt-35-turbo': {
    id: AZURE_DEPLOYMENT_ID,
    maxLength: 12000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'OpenAI',
  },
  'claude-instant-1': {
    id: 'claude-instant-1',
    maxLength: 400000,
    tokenLimit: 100000,
    requestLimit: 98000,
    vendor: 'Anthropic',
  },
  'claude-2': {
    id: 'claude-2',
    maxLength: 400000,
    tokenLimit: 100000,
    requestLimit: 98000,
    vendor: 'Anthropic',
  },
  bard: {
    id: 'bard',
    maxLength: 12000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Google',
  },
};
