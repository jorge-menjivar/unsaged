import { User } from '@/types/auth';

export const localGetAPIKey = (user: User) => {
  const itemName = `apiKey-${user.primaryEmailAddress}`;
  return localStorage.getItem(itemName);
};

export const localSaveAPIKey = (user: User, apiKey: string) => {
  const itemName = `apiKey-${user.primaryEmailAddress}`;
  localStorage.setItem(itemName, apiKey);
};

export const localDeleteAPIKey = (user: User) => {
  const itemName = `apiKey-${user.primaryEmailAddress}`;
  localStorage.removeItem(itemName);
};
