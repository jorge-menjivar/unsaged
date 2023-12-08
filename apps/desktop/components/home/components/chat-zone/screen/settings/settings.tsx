import { IconX } from '@tabler/icons-react';
import { useEffect } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { SettingComponent } from './components/setting-component';

import SettingsContext from './settings.context';
import { SettingsInitialState, initialState } from './settings.state';

import { useDisplay } from '@/providers/display';
import { useSettings } from '@/providers/settings';

export const Settings = () => {
  const settingsContextValue = useCreateReducer<SettingsInitialState>({
    initialState,
  });

  const {
    state: { searchQuery, selectedSettingId },
    dispatch: settingsDispatch,
  } = settingsContextValue;

  const { settings } = useSettings();

  const { setDisplay } = useDisplay();

  useEffect(() => {
    // fetchFiles(searchQuery);
  }, [searchQuery, settingsDispatch]);

  const doSearch = (query: string) =>
    settingsDispatch({ field: 'searchQuery', value: query });

  const handleSelect = (settingId: string) => {
    settingsDispatch({
      field: 'selectedSettingId',
      value: settingId,
    });
  };

  const handleClose = () => {
    setDisplay('chat');
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settingsContextValue,
        handleSelect,
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
                  Object.entries(settings).map(([id, setting], index) => (
                    <SettingComponent
                      isSelected={selectedSettingId === id}
                      key={index}
                      id={id}
                      setting={setting}
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
