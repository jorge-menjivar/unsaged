import { ANTHROPIC_API_KEY } from '@/utils/app/const';

import { AiModel, GetAvailableModelsResponse } from '@/types/ai-models';
import { DefaultValues, SavedSettings } from '@/types/settings';

import { storageGetSavedSettingValue } from '../../storage/local/settings';

export const config = {
  runtime: 'edge',
};

export async function getAvailableAnthropicModels(
  savedSettings: SavedSettings,
  key?: string,
): Promise<GetAvailableModelsResponse> {
  if (!key) {
    key = ANTHROPIC_API_KEY;

    if (!key) {
      return { data: [] };
    }
  }
  const models: AiModel[] = [
    {
      id: 'claude-instant-1',
      tokenLimit:
        storageGetSavedSettingValue(
          savedSettings,
          DefaultValues['model.claude-instant-1.context_window_size'],
        ) || 4096,
      vendor: 'Anthropic',
    },
    {
      id: 'claude-2',
      tokenLimit:
        storageGetSavedSettingValue(
          savedSettings,
          DefaultValues['model.claude-2.context_window_size'],
        ) || 4096,
      vendor: 'Anthropic',
    },
    {
      id: 'claude-2.1',
      tokenLimit:
        storageGetSavedSettingValue(
          savedSettings,
          DefaultValues['model.claude-2.1.context_window_size'],
        ) || 4096,
      vendor: 'Anthropic',
    },
  ];

  return { data: models };
}
