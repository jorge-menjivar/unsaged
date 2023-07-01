import { AiModel } from './ai-models';
import { SystemPrompt } from './system-prompt';

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
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
  messages: Message[];
  model: AiModel;
  systemPrompt: SystemPrompt | null;
  temperature: number;
  folderId: string | null;
  timestamp: string;
}
