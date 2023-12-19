import { SettingChoice, Settings } from '@/types/settings';

export const setSettingChoices = (
  settings: Settings,
  settingId: string,
  newChoices: SettingChoice[],
) => {
  if (!settings[settingId]) {
    console.error(`Setting ${settingId} not found`);
    return;
  }
  settings[settingId].choices = newChoices;

  return settings;
};
