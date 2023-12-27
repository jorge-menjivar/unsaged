import { Dispatch, useCallback, useEffect } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { AiModel } from '@/types/ai-models';
import { SavedSetting } from '@/types/settings';

import { HomeInitialState } from '@/components/Home/home.state';

import { getSavedSettingValue } from '../storage/local/settings';

export const useModels = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  savedSettings: SavedSetting[],
  models: AiModel[],
  modelsLoaded: boolean,
) => {
  const fetchModels = useCallback(async () => {
    if (models.length === 0) {
      const openAiApiKey = getSavedSettingValue(
        savedSettings,
        'openai',
        'api_key',
      );

      const anthropicApiKey = getSavedSettingValue(
        savedSettings,
        'anthropic',
        'api_key',
      );

      const googleApiKey = getSavedSettingValue(
        savedSettings,
        'google',
        'api_key',
      );

      const results = await fetch(`/api/models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openai_key: openAiApiKey,
          anthropic_key: anthropicApiKey,
          google_key: googleApiKey,
        }),
      });

      const models = await results.json();

      homeDispatch({ type: 'change', field: 'models', value: models });
      homeDispatch({ type: 'change', field: 'modelsLoaded', value: true });
    }
  }, [homeDispatch, models.length, savedSettings]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);
};
