import { Dispatch, useCallback, useEffect, useRef } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { getSavedSettingValue } from '../utils/app/storage/local/settings';
import { getModels } from '@/utils/server/ai_vendors/models';

import { AiModel } from '@/types/ai-models';
import { SavedSettings } from '@/types/settings';

import { HomeInitialState } from '@/components/home/home.state';

export const useModels = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  savedSettings: SavedSettings,
  models: AiModel[],
) => {
  const fetchModels = useCallback(async () => {
    if (models.length === 0) {
      const openAiApiKey = getSavedSettingValue(savedSettings, 'openai.key');

      const anthropicApiKey = getSavedSettingValue(
        savedSettings,
        'anthropic.key',
      );

      const palmApiKey = getSavedSettingValue(savedSettings, 'google.key');

      const models = await getModels(
        savedSettings,
        openAiApiKey,
        anthropicApiKey,
        palmApiKey,
      );

      homeDispatch({ field: 'models', value: models });
      homeDispatch({ field: 'modelsLoaded', value: true });
    }
  }, [homeDispatch, models.length, savedSettings]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);
};
