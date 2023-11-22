import { User } from '@/types/auth';

export const getSelectedConversationId = (user: User) => {
  const itemName = `selectedConversationId-${user.id}`;
  return localStorage.getItem(itemName);
};

export const saveSelectedConversationId = (user: User, id: string) => {
  const itemName = `selectedConversationId-${user.id}`;
  localStorage.setItem(itemName, id);
};

export const deleteSelectedConversationId = (user: User) => {
  const itemName = `selectedConversationId-${user.id}`;
  localStorage.removeItem(itemName);
};
