import { User } from '@/types/auth';

export const localGetShowPromptBar = (user: User) => {
  const itemName = `showPromptbar-${user.primaryEmailAddress}`;
  return JSON.parse(localStorage.getItem(itemName) || '[]') as boolean;
};

export const localSaveShowPromptBar = (user: User, show: boolean) => {
  const itemName = `showPromptbar-${user.primaryEmailAddress}`;
  localStorage.setItem(itemName, JSON.stringify(show));
};

export const localGetShowPrimaryMenu = (user: User) => {
  const itemName = `showPrimaryMenu-${user.primaryEmailAddress}`;

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
  const itemName = `showPrimaryMenu-${user.primaryEmailAddress}`;
  localStorage.setItem(itemName, JSON.stringify(show));
};

export const localGetShowSecondaryMenu = (user: User) => {
  const itemName = `showSecondaryMenu-${user.primaryEmailAddress}`;

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
  const itemName = `showSecondaryMenu-${user.primaryEmailAddress}`;
  localStorage.setItem(itemName, JSON.stringify(show));
};
