import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';

export const storageCreateMessage = (
  database: Database,
  user: User,
  selectedConversation: Conversation,
  newMessage: Message,
  allConversations: Conversation[],
) => {
  const messages = selectedConversation.messages;
  const updatedMessages = [...messages, newMessage];
  const updatedConversation: Conversation = {
    ...selectedConversation,
    messages: updatedMessages,
  };
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  database
    .createMessage(user, selectedConversation.id, newMessage)
    .then((success) => {
      if (!success) {
        console.error('Failed to create message');
      }
    });

  return { single: updatedConversation, all: updatedConversations };
};

export const storageUpdateMessage = (
  database: Database,
  user: User,
  selectedConversation: Conversation,
  updatedMessage: Message,
  allConversations: Conversation[],
) => {
  const messages = selectedConversation.messages;
  const updatedMessages = messages.map((m) =>
    m.id === updatedMessage.id ? updatedMessage : m,
  );
  const updatedConversation: Conversation = {
    ...selectedConversation,
    messages: updatedMessages,
  };
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  database
    .updateMessage(user, selectedConversation.id, updatedMessage)
    .then((success) => {
      if (!success) {
        console.error('Failed to update message');
      }
    });

  return { single: updatedConversation, all: updatedConversations };
};

export const storageDeleteMessage = (
  database: Database,
  user: User,
  selectedConversation: Conversation,
  messageId: string,
) => {
  database
    .deleteMessage(user, selectedConversation.id, messageId)
    .then((success) => {
      if (!success) {
        console.error('Failed to delete message');
      }
    });
};
