import { Dispatch, MutableRefObject } from 'react';

import { storageUpdateMessage } from '@/utils/app/storage/message';

import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSetting } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { storageUpdateConversation } from '../storage/conversation';
import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

export interface EditMessageHandlerFunctionProps {
  builtInSystemPrompts: SystemPrompt[];
  database: Database;
  dispatch: Dispatch<any>;
  updatedMessage: Message;
  messages: Message[];
  index: number;
  savedSettings: SavedSetting[];
  stopConversationRef: MutableRefObject<boolean>;
  selectedConversation: Conversation;
  conversations: Conversation[];
  user: User;
}

export const editMessageHandler = async ({
  user,
  updatedMessage,
  index,
  stopConversationRef,
  builtInSystemPrompts,
  selectedConversation,
  messages,
  conversations,
  database,
  savedSettings,
  dispatch,
}: EditMessageHandlerFunctionProps) => {
  if (selectedConversation) {
    dispatch({ field: 'loading', value: true });
    dispatch({ field: 'messageIsStreaming', value: true });

    const selectedConversationMessages = messages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    const deleteCount = selectedConversationMessages.length - index - 1;

    let updatedMessages = messages;
    if (deleteCount) {
      const conversationLength = selectedConversationMessages.length;
      const messagesToBeDeleted: string[] = [];

      for (let i = 1; i <= deleteCount; i++) {
        const currentMessage =
          selectedConversationMessages[conversationLength - i];
        messagesToBeDeleted.push(currentMessage.id);
      }
      updatedMessages = storageDeleteMessages(
        database,
        user,
        messagesToBeDeleted,
        messages,
      );
    }

    // Add the user message
    updatedMessages = storageUpdateMessage(
      database,
      user,
      updatedMessage,
      updatedMessages,
    );

    dispatch({ field: 'messages', value: messages });

    const updatedConversationMessages = updatedMessages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    let updatedConversation = selectedConversation;
    let updatedConversations = conversations;
    // Updating the conversation name
    if (updatedConversationMessages.length === 1) {
      const { content } = updatedMessage;
      const customName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;

      updatedConversation = {
        ...updatedConversation,
        name: customName,
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

    const { data, controller } = await messageSender(
      builtInSystemPrompts,
      updatedConversation,
      updatedConversationMessages,
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
};
