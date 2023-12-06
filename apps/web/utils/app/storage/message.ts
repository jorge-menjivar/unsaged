import { User } from '@/types/auth';
import { Message } from '@/types/chat';
import { Database } from '@/types/database';

export const storageCreateMessage = (
  database: Database,
  user: User,
  newMessage: Message,
  allMessages: Message[],
) => {
  const updatedMessages = [...allMessages, newMessage];

  database.createMessage(user, newMessage).then((success) => {
    if (!success) {
      console.error('Failed to create message');
    }
  });

  return updatedMessages;
};

export const storageUpdateMessage = (
  database: Database,
  user: User,
  updatedMessage: Message,
  allMessages: Message[],
) => {
  const updatedMessages = allMessages.map((m) =>
    m.id === updatedMessage.id ? updatedMessage : m,
  );

  database.updateMessage(user, updatedMessage).then((success) => {
    if (!success) {
      console.error('Failed to update message');
    }
  });

  return updatedMessages;
};

export const storageDeleteMessage = (
  database: Database,
  user: User,
  messageId: string,
  allMessages: Message[],
) => {
  const updatedMessages = allMessages.filter((m) => m.id !== messageId);

  database.deleteMessage(user, messageId).then((success) => {
    if (!success) {
      console.error('Failed to delete message');
    }
  });

  return updatedMessages;
};
