import { PALM_API_KEY } from '@/utils/app/const';

import { AiModel, GetAvailableModelsResponse } from '@/types/ai-models';
import { DefaultValues, SavedSettings } from '@/types/settings';

import { storageGetSavedSettingValue } from '../../storage/local/settings';

export const config = {
  runtime: 'edge',
};

export async function getAvailablePalm2Models(
  savedSettings: SavedSettings,
  key?: string,
): Promise<GetAvailableModelsResponse> {
  if (!key) {
    key = PALM_API_KEY;

    if (!key) {
      return { data: [] };
    }
  }
  const models: AiModel[] = [
    {
      id: 'bard',
      tokenLimit:
        storageGetSavedSettingValue(
          savedSettings,
          DefaultValues['model.bard.context_window_size'],
        ) || 4096,
      vendor: 'Google',
    },
  ];

  return { data: models };
}
