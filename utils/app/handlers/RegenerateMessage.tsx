import { MutableRefObject } from 'react';

import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSetting } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

export const regenerateMessageHandler = async (
  user: User,
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

    const deleteCount = 1;

    const conversationLength = selectedConversation.messages.length;
    const messagesToBeDeleted: string[] = [];

    for (let i = 0; i < deleteCount; i++) {
      const currentMessage =
        selectedConversation.messages[conversationLength - 1 - i];
      messagesToBeDeleted.push(currentMessage.id);
    }

    let { single: updatedConversation, all: updatedConversations } =
      storageDeleteMessages(
        database,
        user,
        messagesToBeDeleted,
        selectedConversation,
        selectedConversation.messages,
        conversations,
      );

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
    });

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
