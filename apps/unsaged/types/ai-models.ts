export type AiModel = {
  id: string;
  name: string;
  description?: string;
  strengths?: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  requestLimit: number;
  vendor: 'OpenAI' | 'Azure' | 'Anthropic' | 'Google' | 'Ollama';
  type: 'text';
} | {
  id: string;
  name: string;
  description?: string;
  strengths?: string;
  vendor: 'OpenAI' | 'Azure';
  type: 'image';
}

export const vendors = ['OpenAI', 'Anthropic', 'Google', 'Ollama'];

export type OpenAiClientOptions = {
  vendor: 'openai',
  apiUrl: string;
  organisation: string;
} | {
  modelId?: string;
  vendor: 'azure',
  apiUrl: string;
  apiVersion: string;
}

export interface GetAvailableAIModelResponse {
  error?: any;
  data: any[];
}

export const PossibleAiModels: AiModel[] = [
  //
  // OpenAI
  //
  {
    id: 'gpt-3.5-turbo',
    name: 'gpt-3.5-turbo',
    maxLength: 12000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'OpenAI',
    type: 'text',
  },
  {
    id: 'gpt-3.5-turbo-16k',
    name: 'gpt-3.5-turbo-16k',
    maxLength: 48000,
    tokenLimit: 16000,
    requestLimit: 12000,
    vendor: 'OpenAI',
    type: 'text',
  },
  {
    id: 'gpt-4',
    name: 'gpt-4',
    maxLength: 24000,
    tokenLimit: 8000,
    requestLimit: 6000,
    vendor: 'OpenAI',
    type: 'text',
  },
  {
    id: 'gpt-4-32k',
    name: 'gpt-4-32k',
    maxLength: 96000,
    tokenLimit: 32000,
    requestLimit: 30000,
    vendor: 'OpenAI',
    type: 'text',
  },
  {
    id: 'gpt-4-1106-preview',
    name: 'gpt-4-1106-preview',
    maxLength: 500000,
    tokenLimit: 128000,
    requestLimit: 120000,
    vendor: 'OpenAI',
    type: 'text',
  },
  {
    id: 'dall-e-3',
    name: 'dall-e-3',
    vendor: 'OpenAI',
    type: 'image',
  },
  {
    id: 'dall-e-2',
    name: 'dall-e-2',
    vendor: 'OpenAI',
    type: 'image',
  },
  //
  // Azure
  //
  {
    id: 'will get from azure',
    name: 'gpt-35',
    maxLength: 12000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'Azure',
    type: 'text',
  },
  {
    id: 'will get from azure',
    name: 'gpt-35-turbo',
    maxLength: 12000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'Azure',
    type: 'text',
  },
  {
    id: 'will get from azure',
    name: 'gpt-35-turbo-16k',
    maxLength: 48000,
    tokenLimit: 16000,
    requestLimit: 12000,
    vendor: 'Azure',
    type: 'text',
  },
  {
    id: 'will get from azure',
    name: 'gpt-4',
    maxLength: 24000,
    tokenLimit: 4000,
    requestLimit: 6000,
    vendor: 'Azure',
    type: 'text',
  },
  {
    id: 'will get from azure',
    name: 'dall-e-3',
    vendor: 'Azure',
    type: 'image',
  },
  //
  // Anthropic
  //
  {
    id: 'claude-instant-1',
    name: 'claude-instant-1',
    maxLength: 400000,
    tokenLimit: 100000,
    requestLimit: 98000,
    vendor: 'Anthropic',
    type: 'text',
  },
  {
    id: 'claude-2',
    name: 'claude-2',
    maxLength: 400000,
    tokenLimit: 100000,
    requestLimit: 98000,
    vendor: 'Anthropic',
    type: 'text',
  },
  //
  // Google
  //
  {
    id: 'bard',
    name: 'bard',
    maxLength: 12000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Google',
    type: 'text',
  },
  //
  // Ollama
  //
  {
    id: 'llama2:latest',
    name: 'llama2:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'llama2:7b',
    name: 'llama2:7b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'llama2:13b',
    name: 'llama2:13b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'llama2:70b',
    name: 'llama2:70b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'codellama:latest',
    name: 'codellama:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'codellama:7b',
    name: 'codellama:7b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'codellama:13b',
    name: 'codellama:13b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'codellama:34b',
    name: 'codellama:34b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'wizardcoder:latest',
    name: 'wizardcoder:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'wizardcoder:7b-python',
    name: 'wizardcoder:7b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'wizardcoder:13b-python',
    name: 'wizardcoder:13b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'wizardcoder:34b-python',
    name: 'wizardcoder:34b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'phind-codellama:latest',
    name: 'phind-codellama:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'phind-codellama:34b',
    name: 'phind-codellama:34b',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'phind-codellama:34b-v2',
    name: 'phind-codellama:34b-v2',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'phind-codellama:34b-python',
    name: 'phind-codellama:34b-python',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'mistral:latest',
    name: 'mistral:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'mistral-openorca:latest',
    name: 'mistral-openorca:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'openchat:latest',
    name: 'openchat:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'neural-chat:latest',
    name: 'neural-chat:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'goliath:latest',
    name: 'goliath:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'vicuna:latest',
    name: 'vicuna:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'orca-mini:latest',
    name: 'orca-mini:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'llama2-uncensored:latest',
    name: 'llama2-uncensored:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'yarn-mistral:7b-128k',
    name: 'yarn-mistral:7b-128k',
    maxLength: 128000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'deepseek-coder:latest',
    name: 'deepseek-coder:latest',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'deepseek-coder:6.7b',
    name: 'deepseek-coder:6.7b',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'deepseek-coder:33b',
    name: 'deepseek-coder:33b',
    maxLength: 16000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  //
  // Ollama - Custom Models
  //
  {
    id: 'llama2_13B_2080:latest',
    name: 'llama2_13B_2080:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'wizardcoder13b_python_2080:latest',
    name: 'wizardcoder13b_python_2080:latest',
    maxLength: 32000,
    tokenLimit: 4000,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'phindcodellama-34b-_2080:latest',
    name: 'phindcodellama-34b-_2080:latest',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
  {
    id: 'phind-codellama:34bv2-vram2080',
    name: 'phind-codellama:34bv2-vram2080',
    maxLength: 32000,
    tokenLimit: 4096,
    requestLimit: 3000,
    vendor: 'Ollama',
    type: 'text',
  },
];

export interface ModelParams {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repeat_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  max_tokens?: number;
  seed?: number;
  n?: number | null;
  quality?: 'standard' | 'hd';
  response_format?: 'url' | 'b64_json' | null;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null;
  style?: 'vivid' | 'natural' | null;
}
