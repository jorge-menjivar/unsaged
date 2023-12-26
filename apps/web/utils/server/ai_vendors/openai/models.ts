import {
  DEBUG_MODE,
  OPENAI_API_KEY,
} from '@/utils/app/const';

import { AiModel, GetAvailableAIModelResponse } from '@/types/ai-models';
import { getClient } from './client';
import { getModelSettings } from '../models';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(apiKey: string): Promise<GetAvailableAIModelResponse> {
  if (!apiKey) {
    if (!OPENAI_API_KEY) {
      return { data: [] };
    } else {
      apiKey = OPENAI_API_KEY;
    }
  }

  const client = await getClient(apiKey);

  const list = await client.models.list();
  const { data: modelSettings } = await getModelSettings('OpenAI');

  const models: (AiModel | null)[] = list.data
    .map((openaiModel: any) => {
      const model_name = openaiModel.id;
      const model = modelSettings.find(m => m.name === model_name);

      if (!model) {
        if (DEBUG_MODE)
          console.warn('OpenAI model not implemented:', model_name);

        return null;
      }

      return model;
    });

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
