import { SettingChoice, SettingsSection } from '@/types/settings';

export const setSettingChoices = (
  settings: SettingsSection[],
  sectionId: string,
  settingId: string,
  newChoices: SettingChoice[],
) => {
  const newSettings = settings.map((section) => {
    if (section.id === sectionId) {
      return {
        ...section,
        settings: section.settings.map((setting) => {
          if (setting.id === settingId) {
            return {
              ...setting,
              choices: newChoices,
            };
          }
          return setting;
        }),
      };
    }
    return section;
  });
  return newSettings;
};
