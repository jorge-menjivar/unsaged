import { User } from '@/types/auth';
import { Message } from '@/types/chat';
import { Database } from '@/types/database';

export const storageGetMessages = async (
  database: Database,
  user: User,
  selectedConversationId?: string,
) => {
  return await database.getMessages(user, selectedConversationId);
};

export const storageCreateMessages = (
  database: Database,
  user: User,
  newMessages: Message[],
  allMessages: Message[],
) => {
  const updatedMessages = [...allMessages, ...newMessages];

  database.createMessages(user, newMessages).then((success) => {
    if (!success) {
      console.error('Failed to create messages');
    }
  });

  return updatedMessages;
};

export const storageDeleteMessages = (
  database: Database,
  user: User,
  messageIds: string[],
  allMessages: Message[],
) => {
  const updatedMessages = allMessages.filter((m) => !messageIds.includes(m.id));

  database.deleteMessages(user, messageIds);

  return updatedMessages;
};
