import {
  DEBUG_MODE,
  AZURE_OPENAI_API_URL,
  AZURE_OPENAI_API_KEY,
} from '@/utils/app/const';

import { AiModel, GetAvailableAIModelResponse } from '@/types/ai-models';
import { getModelSettings } from '../models';

export const config = {
  runtime: 'edge',
};

export async function getAvailableAzureModels(apiKey: string): Promise<GetAvailableAIModelResponse> {
  if (!apiKey) {
    if (!AZURE_OPENAI_API_KEY) {
      return { error: 'Missing API key', data: [] };
    } else {
      apiKey = AZURE_OPENAI_API_KEY;
    }
  }

  let url = `${AZURE_OPENAI_API_URL}/openai/deployments?api-version=2023-03-15-preview`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': `${apiKey}`,
    },
  });

  if (res.status !== 200) {
    console.error('Error fetching OpenAi models', res.status, res.body);
    return { error: res.status, data: [] };
  }

  const json = await res.json();
  const { data: modelSettings } = await getModelSettings('Azure');

  const models: (AiModel | null)[] = json.data
    .map((openaiModel: any) => {
      const model_name = openaiModel.model;
      const model = modelSettings.find(m => m.name === model_name);

      if (!model) {
        if (DEBUG_MODE)
          console.warn('Azure model not implemented:', model_name);

        return null;
      }

      model.id = openaiModel.id;

      return model;
    });

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
