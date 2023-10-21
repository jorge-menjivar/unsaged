import { Dispatch, MutableRefObject } from 'react';
import toast from 'react-hot-toast';

import { storageCreateMessage } from '@/utils/app/storage/message';

import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSetting } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { storageUpdateConversation } from '../storage/conversation';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

export interface SendHandlerFunctionProps {
  dispatch: Dispatch<any>;
  database: Database;
  user: User;
  builtInSystemPrompts: SystemPrompt[];
  newMessage: Message;
  messages: Message[];
  selectedConversation: Conversation;
  stopConversationRef: MutableRefObject<boolean>;
  conversations: Conversation[];
  savedSettings: SavedSetting[];
}

export const sendHandlerFunction = async ({
  user,
  newMessage,
  messages,
  stopConversationRef,
  builtInSystemPrompts,
  selectedConversation,
  conversations,
  database,
  savedSettings,
  dispatch,
}: SendHandlerFunctionProps) => {
  if (selectedConversation) {
    dispatch({ field: 'messageIsStreaming', value: true });
    dispatch({ field: 'loading', value: true });

    // Saving the user message
    const updatedMessages = storageCreateMessage(
      database,
      user,
      newMessage,
      messages,
    );

    dispatch({
      field: 'messages',
      value: updatedMessages,
    });

    const selectedConversationMessages = updatedMessages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );
    let updatedConversation = selectedConversation;
    let updatedConversations = conversations;

    // Updating the conversation name
    if (selectedConversationMessages.length === 1) {
      const { content } = newMessage;
      const newName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;

      updatedConversation = {
        ...selectedConversation,
        name: newName,
      };
      // Saving the conversation name
      updatedConversations = storageUpdateConversation(
        database,
        user,
        updatedConversation,
        conversations,
      );

      dispatch({ field: 'conversations', value: updatedConversations });
    }

    {
      const { data, controller } = await messageSender(
        builtInSystemPrompts,
        updatedConversation,
        selectedConversationMessages,
        savedSettings,
        dispatch,
      );

      // Failed to send message
      if (!data || !controller) {
        return;
      }

      await messageReceiver(
        user,
        database,
        data,
        controller,
        updatedConversation,
        updatedMessages,
        stopConversationRef,
        dispatch,
      );
    }
  }
};
