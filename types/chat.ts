import { AiModel } from './ai-models';
import { SystemPrompt } from './system-prompt';

export interface Message {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  conversationId: string;
  timestamp: string;
}

export interface ChatBody {
  model: AiModel;
  messages: Message[];
  systemPrompt: SystemPrompt;
  params: ModelParams;
  apiKey?: string;
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
}

export interface Conversation {
  id: string;
  name: string;
  model: AiModel;
  systemPrompt: SystemPrompt | null;
  temperature?: number | null | undefined;
  folderId: string | null;
  timestamp: string;
  params: ModelParams;
}
