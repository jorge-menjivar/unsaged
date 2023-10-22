import { Dispatch, MutableRefObject } from 'react';

import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSetting } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { storageDeleteMessages } from '../storage/messages';
import { messageReceiver } from './helpers/messageReceiver';
import { messageSender } from './helpers/messageSender';

export interface RegenerateMessageHandlerFunctionProps {
  builtInSystemPrompts: SystemPrompt[];
  database: Database;
  dispatch: Dispatch<any>;
  user: User;
  messages: Message[];
  savedSettings: SavedSetting[];
  stopConversationRef: MutableRefObject<boolean>;
  selectedConversation: Conversation;
  conversations: Conversation[];
}
export const regenerateMessageHandler = async ({
  dispatch,
  user,
  messages,
  stopConversationRef,
  builtInSystemPrompts,
  selectedConversation,
  database,
  savedSettings,
}: RegenerateMessageHandlerFunctionProps) => {
  if (selectedConversation) {
    dispatch({ field: 'loading', value: true });
    dispatch({ field: 'messageIsStreaming', value: true });

    let deleteCount = 1;

    const selectedConversationMessages = messages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    if (
      selectedConversationMessages[selectedConversationMessages.length - 1]
        .role === 'user'
    ) {
      // User was not able to send the last message. User is trying to regenerate the last message.
      // We do not need to delete the last message.
      deleteCount = 0;
    }
    const conversationLength = selectedConversationMessages.length;
    const messagesToBeDeleted: string[] = [];

    for (let i = 0; i < deleteCount; i++) {
      const currentMessage =
        selectedConversationMessages[conversationLength - 1 - i];
      messagesToBeDeleted.push(currentMessage.id);
    }

    const updatedMessages = storageDeleteMessages(
      database,
      user,
      messagesToBeDeleted,
      messages,
    );

    dispatch({
      field: 'messages',
      value: updatedMessages,
    });

    const updatedConversationMessages = updatedMessages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    const { data, controller } = await messageSender(
      builtInSystemPrompts,
      selectedConversation,
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
      selectedConversation,
      updatedMessages,
      stopConversationRef,
      dispatch,
    );
  }
};
