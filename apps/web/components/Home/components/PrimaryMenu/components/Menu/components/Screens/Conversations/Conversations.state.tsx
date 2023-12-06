import { Conversation } from '@/types/chat';

export interface ConversationsInitialState {
  searchTerm: string;
  filteredConversations: Conversation[];
}

export const initialState: ConversationsInitialState = {
  searchTerm: '',
  filteredConversations: [],
};
