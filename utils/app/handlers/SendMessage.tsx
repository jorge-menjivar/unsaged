import { MutableRefObject } from 'react';

import { storageCreateMessage } from '@/utils/app/storage/message';

import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSetting } from '@/types/settings';

import { storageUpdateConversation } from '../storage/conversation';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

export const sendHandlerFunction = async (
  user: User,
  message: Message,
  stopConversationRef: MutableRefObject<boolean>,
  builtInSystemPrompts: any[],
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  savedSettings: SavedSetting[],
  homeDispatch: React.Dispatch<any>,
) => {
  if (selectedConversation) {
    homeDispatch({ field: 'messageIsStreaming', value: true });
    homeDispatch({ field: 'loading', value: true });

    // Saving the user message
    let { single: updatedConversation, all: updatedConversations } =
      storageCreateMessage(
        database,
        user,
        selectedConversation,
        message,
        conversations,
      );

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
    });

    // Updating the conversation name
    if (updatedConversation.messages.length === 1) {
      const { content } = message;
      const customName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;
      updatedConversation = {
        ...updatedConversation,
        name: customName,
      };

      // Saving the conversation name
      storageUpdateConversation(
        database,
        user,
        { ...selectedConversation, name: updatedConversation.name },
        updatedConversations,
      );
    }

    {
      const { data, controller } = await messageSender(
        builtInSystemPrompts,
        updatedConversation,
        selectedConversation,
        savedSettings,
        homeDispatch,
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
        updatedConversations,
        stopConversationRef,
        homeDispatch,
      );
    }
  }
};
