import { AiModel, GetAvailableModelsResponse } from '@/types/ai-models';
import { DefaultValues, SavedSettings } from '@/types/settings';

import { storageGetSavedSettingValue } from '../../storage/local/settings';

export const config = {
  runtime: 'edge',
};

export async function getAvailableAzureModels(
  savedSettings: SavedSettings,
  azureUrl: string,
  key: string,
): Promise<GetAvailableModelsResponse> {
  let completeUrl = `${azureUrl}/openai/deployments?api-version=2023-03-15-preview`;

  const response = await fetch(completeUrl, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': key,
    },
  });

  if (response.status !== 200) {
    console.error(
      'Error fetching OpenAi models',
      response.status,
      response.body,
    );
    return { data: [] };
  }

  const json = await response.json();

  const models: (AiModel | null)[] = json.data
    .map((azureModel: any) => {
      // Confusing, but the model name is the id
      const model_name = azureModel.id;
      const model_id = azureModel.model;

      const excludedModels = [
        'ada',
        'babbage',
        'code',
        'curie',
        'dall-e',
        'davinci',
        'text',
        'tts',
        'whisper',
      ];

      // Skip models with ID that starts with one of the excluded models
      if (excludedModels.some((model) => model_id.startsWith(model))) {
        return null;
      }

      const model: AiModel = {
        name: model_name,
        id: model_id,
        tokenLimit:
          storageGetSavedSettingValue(
            savedSettings,
            DefaultValues[`model.${model_id}.context_window_size`],
          ) || 4096,
        vendor: 'Azure',
      };

      return model;
    })
    .filter(Boolean);

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
