import { GOOGLE_API_KEY } from '@/utils/app/const';

import { AiModel, GetAvailableModelsResponse } from '@/types/ai-models';
import { SavedSettings } from '@/types/settings';

import { storageGetSavedSettingValue } from '../../storage/local/settings';

export const config = {
  runtime: 'edge',
};

export async function getAvailablePalm2Models(
  savedSettings: SavedSettings,
  key?: string,
): Promise<GetAvailableModelsResponse> {
  if (!key) {
    key = GOOGLE_API_KEY;

    if (!key) {
      return { data: [] };
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

  const response = await fetch(url);

  if (response.status !== 200) {
    console.error(
      'Error fetching Google models',
      response.status,
      response.body,
    );
    return { data: [] };
  }

  const json = await response.json();

  const models: (AiModel | null)[] = json.models
    .map((googleModel: any) => {
      let model_id: string = googleModel.name;

      // Remove the "models/" prefix
      model_id = model_id.replace('models/', '');

      const excludedModels = ['aqa', 'embedding', 'text', 'chat-bison'];

      // Skip models with ID that starts with one of the excluded models
      if (excludedModels.some((model) => model_id.startsWith(model))) {
        return null;
      }

      let model: AiModel = {
        id: model_id,
        tokenLimit:
          storageGetSavedSettingValue(
            savedSettings,
            `model.${model_id}.context_window_size`,
          ) || googleModel.inputTokenLimit,
        vendor: 'Google',
      };

      return model;
    })
    .filter(Boolean);

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
