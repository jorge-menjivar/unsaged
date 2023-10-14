import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import {
  setSavedSetting,
  setSavedSettings,
} from '@/utils/app/storage/local/settings';

import { Setting, SettingsSection } from '@/types/settings';

import { SettingsSectionComponent } from './components/SettingsSectionComponent';
import HomeContext from '@/components/Home/home.context';

import SettingsContext from './Settings.context';
import { SettingsInitialState, initialState } from './Settings.state';

export const Settings = () => {
  const { t } = useTranslation('settings');

  const settingsContextValue = useCreateReducer<SettingsInitialState>({
    initialState,
  });

  const {
    state: { searchQuery, selectedSection },
    dispatch: settingsDispatch,
  } = settingsContextValue;

  const {
    state: { user, settings },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  useEffect(() => {
    // fetchFiles(searchQuery);
  }, [searchQuery, settingsDispatch]);

  const doSearch = (query: string) =>
    settingsDispatch({ field: 'searchQuery', value: query });

  const handleSave = (
    section: SettingsSection,
    setting: Setting,
    value: any,
  ) => {
    const newSavedSettings = setSavedSetting(
      user!,
      section.id,
      setting.id,
      value,
    );
    homeDispatch({ field: 'savedSettings', value: newSavedSettings });
  };

  const handleSelect = (section: SettingsSection, setting: Setting) => {
    settingsDispatch({
      field: 'selectedSection',
      value: section,
    });
    settingsDispatch({
      field: 'selectedSetting',
      value: setting,
    });
  };

  const handleClose = () => {
    homeDispatch({ field: 'display', value: 'chat' });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settingsContextValue,
        handleSelect,
        handleSave,
      }}
    >
      <div className="relative flex-1 overflow-scroll bg-theme-light dark:bg-theme-dark">
        <div className="max-h-full overflow-x-hidden"></div>
        <div
          className={`group md:px-4 bg-theme-light text-gray-800
       dark:border-gray-900/50 dark:bg-theme-dark dark:text-gray-100'`}
          style={{ overflowWrap: 'anywhere' }}
        >
          <div className="flex w-full p-4 text-base">
            <div className="w-full">
              <div className="block">
                <h1 className="text-3xl font-bold text-center text-black dark:text-white">
                  Settings
                </h1>
                {settings &&
                  Object.values(settings).map((section, index) => (
                    <SettingsSectionComponent
                      isSelected={selectedSection?.id === section.id}
                      key={index}
                      section={section}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          className="
          absolute top-2 right-2 w-6 h-6 m-2 cursor-pointer rounded-sm
          text-gray-700 dark:text-gray-100
          hover:bg-theme-hover-dark dark:hover:bg-theme-hover-dark 
          "
          onClick={handleClose}
        >
          <IconX />
        </button>
      </div>
    </SettingsContext.Provider>
  );
};
