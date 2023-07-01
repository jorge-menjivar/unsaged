import { MutableRefObject } from 'react';

import { storageUpdateMessage } from '@/utils/app/storage/message';

import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSetting } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { storageUpdateConversation } from '../storage/conversation';
import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

export const editMessageHandler = async (
  user: User,
  message: Message,
  index: number,
  stopConversationRef: MutableRefObject<boolean>,
  builtInSystemPrompts: SystemPrompt[],
  selectedConversation: Conversation | undefined,
  conversations: Conversation[],
  database: Database,
  savedSettings: SavedSetting[],
  homeDispatch: React.Dispatch<any>,
) => {
  if (selectedConversation) {
    homeDispatch({ field: 'loading', value: true });
    homeDispatch({ field: 'messageIsStreaming', value: true });

    const deleteCount = selectedConversation?.messages.length - index - 1;
    let updatedConversation: Conversation;

    if (deleteCount) {
      const conversationLength = selectedConversation.messages.length;
      const messagesToBeDeleted: string[] = [];

      for (let i = 1; i <= deleteCount; i++) {
        const currentMessage =
          selectedConversation.messages[conversationLength - i];
        messagesToBeDeleted.push(currentMessage.id);
      }
      const deleteUpdate = storageDeleteMessages(
        database,
        user,
        messagesToBeDeleted,
        selectedConversation,
        selectedConversation.messages,
        conversations,
      );

      updatedConversation = deleteUpdate.single;
    } else {
      updatedConversation = selectedConversation;
    }

    // Update the user message
    const update1 = storageUpdateMessage(
      database,
      user,
      updatedConversation,
      message,
      conversations,
    );

    updatedConversation = update1.single;
    const updatedConversations = update1.all;

    homeDispatch({
      field: 'selectedConversation',
      value: update1.single,
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
};
