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

export const PossibleAiModelVendors = ['OpenAI', 'Anthropic', 'Google', 'Ollama'];

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
