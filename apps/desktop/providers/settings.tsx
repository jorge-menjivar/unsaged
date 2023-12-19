import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTheme } from 'next-themes';

import { getSettings } from '@/utils/app/settings/settings';
import {
  storageGetSavedSettingValue,
  storageGetSavedSettings,
  storageSetSavedSetting,
} from '@/utils/app/storage/local/settings';
import { debug, error } from '@/utils/logging';

import { AiModel } from '@/types/ai-models';
import { SavedSettings, Settings } from '@/types/settings';

import { useAuth } from './auth';

export const SettingsContext = createContext<{
  settings: Settings | null;
  savedSettings: SavedSettings | null;
  saveSetting: (settingId: string, value: any) => void;
  updateSettingsModels: (models: AiModel[]) => void;
}>({
  settings: null,
  savedSettings: null,
  saveSetting: () => {},
  updateSettingsModels: () => {},
});

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setTheme } = useTheme();
  const { session } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [savedSettings, setSavedSettings] = useState<SavedSettings | null>(
    null,
  );

  const isInitialized = useRef(false);

  const initializeSettings = useCallback(async () => {
    if (isInitialized.current || !session) {
      return;
    }

    isInitialized.current = true;

    const _settings = getSettings();

    setSettings(_settings);

    const _savedSettings = await storageGetSavedSettings(
      _settings,
      session.user!,
      true,
    );

    setSavedSettings(_savedSettings);

    const lightMode = storageGetSavedSettingValue(_savedSettings, 'app.theme');

    setTheme(lightMode);
  }, [session, setTheme]);

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  function updateSettingsModels(models: AiModel[]) {
    const _settings = getSettings(models);

    setSettings(_settings);
  }

  async function saveSetting(settingId: string, value: any) {
    if (!session || !settings) return;

    const newSavedSettings = await storageSetSavedSetting(
      settings,
      session.user!,
      settingId,
      value,
    );

    debug('newSavedSettings', newSavedSettings);

    setSavedSettings(newSavedSettings);
  }

  const contextValue = {
    settings,
    savedSettings,
    saveSetting,
    updateSettingsModels,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
