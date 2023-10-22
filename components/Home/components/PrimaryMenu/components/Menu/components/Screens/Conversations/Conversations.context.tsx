import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import { SupportedExportFormats } from '@/types/export';
import { SystemPrompt } from '@/types/system-prompt';

import { ConversationsInitialState } from './Conversations.state';

export interface ConversationsContextProps {
  state: ConversationsInitialState;
  dispatch: Dispatch<ActionType<ConversationsInitialState>>;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleClearConversations: () => void;
  handleExportData: (database: Database) => void;
  handleImportConversations: (
    data: SupportedExportFormats,
    systemPrompts: SystemPrompt[],
  ) => void;
}

const ConversationsContext = createContext<ConversationsContextProps>(
  undefined!,
);

export default ConversationsContext;
