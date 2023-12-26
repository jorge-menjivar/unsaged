import { OPENAI_API_KEY, OPENAI_API_URL } from '@/utils/app/const';

import { AiModel, GetAvailableModelsResponse } from '@/types/ai-models';
import { DefaultValues, SavedSettings } from '@/types/settings';

import { storageGetSavedSettingValue } from '../../storage/local/settings';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(
  savedSettings: SavedSettings,
  key?: string,
): Promise<GetAvailableModelsResponse> {
  let url = `${OPENAI_API_URL}/models`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key ? key : OPENAI_API_KEY}`,
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
    .map((openaiModel: any) => {
      const model_id: string = openaiModel.id;

      const excludedModels = [
        'ada',
        'babbage',
        'code',
        'curie',
        'dall-e',
        'davinci',
        'gpt-3.5-turbo-instruct',
        'text',
        'tts',
        'whisper',
      ];

      // Skip models with ID that starts with one of the excluded models
      if (excludedModels.some((model) => model_id.startsWith(model))) {
        return null;
      }

      let model: AiModel = {
        id: model_id,
        tokenLimit:
          storageGetSavedSettingValue(
            savedSettings,
            DefaultValues[`model.${model_id}.context_window_size`],
          ) || 4096,
        vendor: 'OpenAI',
      };

      return model;
    })
    .filter(Boolean);

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
