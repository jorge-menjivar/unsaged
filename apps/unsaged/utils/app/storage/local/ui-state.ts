import { User } from '@/types/auth';

export const localGetShowPromptBar = (user: User) => {
  const itemName = `showPromptbar-${user.id}`;
  return JSON.parse(localStorage.getItem(itemName) || '[]') as boolean;
};

export const localSaveShowPromptBar = (user: User, show: boolean) => {
  const itemName = `showPromptbar-${user.id}`;
  localStorage.setItem(itemName, JSON.stringify(show));
};

export const localGetShowPrimaryMenu = (user: User) => {
  const itemName = `showPrimaryMenu-${user.id}`;

  const savedValue = localStorage.getItem(itemName);

  if (!savedValue) {
    return null;
  }

  try {
    return JSON.parse(savedValue) as boolean;
  } catch {
    return null;
  }
};

export const localSaveShowPrimaryMenu = (user: User, show: boolean) => {
  const itemName = `showPrimaryMenu-${user.id}`;
  localStorage.setItem(itemName, JSON.stringify(show));
};

export const localGetShowSecondaryMenu = (user: User) => {
  const itemName = `showSecondaryMenu-${user.id}`;

  const savedValue = localStorage.getItem(itemName);

  if (!savedValue) {
    return null;
  }

  try {
    return JSON.parse(savedValue) as boolean;
  } catch {
    return null;
  }
};

export const localSaveShowSecondaryMenu = (user: User, show: boolean) => {
  const itemName = `showSecondaryMenu-${user.id}`;
  localStorage.setItem(itemName, JSON.stringify(show));
};
