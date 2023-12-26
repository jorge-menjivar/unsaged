export const localGetShowPromptBar = () => {
  const itemName = `showPromptbar`;
  return JSON.parse(localStorage.getItem(itemName) || '[]') as boolean;
};

export const localSaveShowPromptBar = (show: boolean) => {
  const itemName = `showPromptbar`;
  localStorage.setItem(itemName, JSON.stringify(show));
};

export const localGetShowPrimaryMenu = () => {
  const itemName = `showPrimaryMenu`;

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

export const localSaveShowPrimaryMenu = (show: boolean) => {
  const itemName = `showPrimaryMenu`;
  localStorage.setItem(itemName, JSON.stringify(show));
};

export const localGetShowSecondaryMenu = () => {
  const itemName = `showSecondaryMenu`;

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

export const localSaveShowSecondaryMenu = (show: boolean) => {
  const itemName = `showSecondaryMenu`;
  localStorage.setItem(itemName, JSON.stringify(show));
};
