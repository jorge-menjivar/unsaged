export interface AiModel {
  id: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  requestLimit: number;
  vendor: 'OpenAI' | 'Anthropic' | 'Google' | 'Ollama';
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
  'gpt-4-1106-preview': {
    id: 'gpt-4-1106-preview',
    maxLength: 500000,
    tokenLimit: 128000,
    requestLimit: 120000,
    vendor: 'OpenAI',
  },
  'gpt-35-turbo': {
    id: 'will get from azure',
    maxLength: 12000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'OpenAI',
  },
  'gpt-35-turbo-16k': {
    id: 'will get from azure',
    maxLength: 48000,
    tokenLimit: 16000,
    requestLimit: 12000,
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
  'llama2:latest': {
    id: 'llama2:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'llama2:7b': {
    id: 'llama2:7b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'llama2:13b': {
    id: 'llama2:13b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'llama2:70b': {
    id: 'llama2:70b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'codellama:latest': {
    id: 'codellama:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'codellama:7b': {
    id: 'codellama:7b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'codellama:13b': {
    id: 'codellama:13b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'codellama:34b': {
    id: 'codellama:34b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'wizardcoder:latest': {
    id: 'wizardcoder:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'wizardcoder:7b-python': {
    id: 'wizardcoder:7b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'wizardcoder:13b-python': {
    id: 'wizardcoder:13b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'wizardcoder:34b-python': {
    id: 'wizardcoder:34b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'phind-codellama:latest': {
    id: 'phind-codellama:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'phind-codellama:34b': {
    id: 'phind-codellama:34b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'phind-codellama:34b-v2': {
    id: 'phind-codellama:34b-v2',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'phind-codellama:34b-python': {
    id: 'phind-codellama:34b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'mistral:latest': {
    id: 'mistral:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'mistral-openorca:latest': {
    id: 'mistral-openorca:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  //
  // Custom models
  //
  'llama2_13B_2080:latest': {
    id: 'llama2_13B_2080:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'wizardcoder13b_python_2080:latest': {
    id: 'wizardcoder13b_python_2080:latest',
    maxLength: 32000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'phindcodellama-34b-_2080:latest': {
    id: 'phindcodellama-34b-_2080:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
  'phind-codellama:34bv2-vram2080': {
    id: 'phind-codellama:34bv2-vram2080',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
  },
};
