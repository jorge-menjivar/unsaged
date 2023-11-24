import { User } from '@/types/auth';
import { SavedSettings, Settings } from '@/types/settings';

const STORAGE_KEY = 'saved-settings';

export const getSavedSettings = (user: User): Settings => {
  try {
    const itemName = `${STORAGE_KEY}-${user.email}`;
    const savedSettings = JSON.parse(
      localStorage.getItem(itemName) || '{}',
    ) as SavedSettings;

    return savedSettings;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const setSavedSettings = (user: User, savedSettings: SavedSettings) => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  localStorage.setItem(itemName, JSON.stringify(savedSettings));
};

export const deleteSettings = (user: User) => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  localStorage.removeItem(itemName);
};

export const getDefaultValue = (settings: Settings, settingId: string) => {
  const setting = settings[settingId];

  if (!setting) {
    console.error(`Setting ${settingId} not found`);
    return;
  }

  if (setting.type === 'choice') {
    if (setting.choices) {
      const defaultChoice = setting.choices.find((choice) => choice.default);
      return defaultChoice?.value;
    } else {
      console.error(`Setting ${settingId} has no choices`);
    }
  } else {
    return setting.defaultValue;
  }
};

export const getSavedSettingValue = (
  savedSettings: SavedSettings,
  settingId: string,
  settings?: Settings,
) => {
  const savedSetting = savedSettings[settingId];
  if (savedSetting) {
    console.log(`value of ${settingId} is ${savedSetting}`);

    return savedSetting;
  }
  // Return default value if available
  else if (settings) {
    return getDefaultValue(settings, settingId);
  }

  return;
};

export const setSavedSetting = (user: User, settingId: string, value: any) => {
  const savedSettings = getSavedSettings(user);
  savedSettings[settingId] = value;
  setSavedSettings(user, savedSettings);
  return savedSettings;
};
