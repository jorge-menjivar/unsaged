import { User } from '@/types/auth';

export const getSelectedConversationId = (user: User) => {
  const itemName = `selectedConversationId-${user.primaryEmailAddress}`;
  return localStorage.getItem(itemName);
};

export const saveSelectedConversationId = (user: User, id: string) => {
  const itemName = `selectedConversationId-${user.primaryEmailAddress}`;
  localStorage.setItem(itemName, id);
};

export const deleteSelectedConversationId = (user: User) => {
  const itemName = `selectedConversationId-${user.primaryEmailAddress}`;
  localStorage.removeItem(itemName);
};
