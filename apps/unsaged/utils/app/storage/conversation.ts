import { User } from '@/types/auth';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';

import { saveSelectedConversationId } from './selectedConversation';

export const storageCreateConversation = (
  database: Database,
  user: User,
  newConversation: Conversation,
  allConversations: Conversation[],
) => {
  const updatedConversations = [...allConversations, newConversation];

  database.createConversation(user, newConversation).then((success) => {
    if (!success) {
      console.error('Failed to create conversation');
    }
  });

  return updatedConversations;
};

export const storageUpdateConversation = (
  database: Database,
  user: User,
  updatedConversation: Conversation,
  allConversations: Conversation[],
) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  saveSelectedConversationId(user, updatedConversation.id);

  database.updateConversation(user, updatedConversation).then((success) => {
    if (!success) {
      console.error('Failed to update conversation');
    }
  });

  return updatedConversations;
};

export const storageDeleteConversation = (
  database: Database,
  user: User,
  conversationId: string,
  allConversations: Conversation[],
) => {
  const updatedConversations = allConversations.filter(
    (c) => c.id !== conversationId,
  );

  database.deleteConversation(user, conversationId).then((success) => {
    if (!success) {
      console.error('Failed to delete conversation');
    }
  });

  return updatedConversations;
};
