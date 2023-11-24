import { Dispatch, MutableRefObject } from 'react';
import toast from 'react-hot-toast';

import { log } from 'next-axiom';

import { storageCreateMessage } from '@/utils/app/storage/message';

import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSettings } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { storageUpdateConversation } from '../storage/conversation';
import { messageReceiver } from './helpers/message-receiver';
import { messageSender } from './helpers/message-sender';

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
  savedSettings: SavedSettings;
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
      const { stream, controller } = await messageSender(
        builtInSystemPrompts,
        updatedConversation,
        selectedConversationMessages,
        savedSettings,
        dispatch,
      );

      // Failed to send message
      if (!stream || !controller) {
        return;
      }

      await messageReceiver(
        user,
        database,
        stream,
        controller,
        updatedConversation,
        updatedMessages,
        stopConversationRef,
        dispatch,
      );
    }
  }
};
