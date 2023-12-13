import {
  DEBUG_MODE,
  OPENAI_API_KEY,
  OPENAI_API_TYPE,
  OPENAI_API_URL,
} from '@/utils/app/const';

import { AiModel, GetAvailableAIModelResponse, PossibleAiModels } from '@/types/ai-models';
import { getOpenAiClient } from './client';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(key: string): Promise<GetAvailableAIModelResponse> {
  if (!key) {
    return { data: [] };
  }

  let responseData = null;
  if (OPENAI_API_TYPE === 'azure') {
    let url = `${OPENAI_API_URL}/openai/deployments?api-version=2023-03-15-preview`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${key ? key : OPENAI_API_KEY}`,
      },
    });

    if (res.status !== 200) {
      console.error('Error fetching OpenAi models', res.status, res.body);
      return { error: res.status, data: [] };
    }

    const json = await res.json();
    responseData = json.data;
  } else {
    const openai = await getOpenAiClient(key);

    const list = await openai.models.list();
    responseData = list.data;
  }

  const models: (AiModel | null)[] = responseData
    .map((openaiModel: any) => {
      const model_name =
        OPENAI_API_TYPE === 'azure' ? openaiModel.model + '-az' : openaiModel.id;

      if (!PossibleAiModels[model_name]) {
        if (DEBUG_MODE)
          console.warn('OpenAI model not implemented:', model_name);

        return null;
      }

      const model = PossibleAiModels[model_name];

      if (OPENAI_API_TYPE === 'azure') {
        model.id = openaiModel.id;
      }

      return model;
    });

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
