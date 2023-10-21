import { Conversation, Message } from '@/types/chat';

export interface ChatInitialState {
  selectedConversationMessages: Message[];
}

export const initialState: ChatInitialState = {
  selectedConversationMessages: [],
};
