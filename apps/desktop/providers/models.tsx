import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getModels } from '@/utils/app/ai_vendors/models';
import { storageGetSavedSettingValue } from '@/utils/app/storage/local/settings';
import { debug, error } from '@/utils/logging';

import { AiModel } from '@/types/ai-models';

import { useSettings } from './settings';

export const ModelsContext = createContext<{
  models: AiModel[];
}>({
  models: [],
});

export const ModelsProvider = ({ children }: { children: React.ReactNode }) => {
  const isInitialized = useRef(false);

  const [models, setModels] = useState<AiModel[]>([]);

  const { savedSettings } = useSettings();

  const fetchModels = useCallback(async () => {
    if (!savedSettings) {
      return;
    }

    isInitialized.current = true;

    const openAiApiKey = storageGetSavedSettingValue(
      savedSettings,
      'openai.key',
    );

    debug('openAiApiKey', openAiApiKey);

    const anthropicApiKey = storageGetSavedSettingValue(
      savedSettings,
      'anthropic.key',
    );

    const palmApiKey = storageGetSavedSettingValue(savedSettings, 'google.key');

    const models = await getModels(
      savedSettings,
      openAiApiKey,
      anthropicApiKey,
      palmApiKey,
    );

    setModels(models);
  }, [savedSettings]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const contextValue = { models };

  return (
    <ModelsContext.Provider value={contextValue}>
      {children}
    </ModelsContext.Provider>
  );
};

export const useModels = () => {
  const context = useContext(ModelsContext);
  if (!context) {
    error('useModels must be used within a ModelsProvider');
  }
  return context;
};
