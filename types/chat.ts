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
  temperature: number;
  apiKey?: string;
}

export interface Conversation {
  id: string;
  name: string;
  model: AiModel;
  systemPrompt: SystemPrompt | null;
  temperature: number;
  folderId: string | null;
  timestamp: string;
}
