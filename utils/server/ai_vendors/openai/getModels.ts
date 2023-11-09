import {
  DEBUG_MODE,
  OPENAI_API_TYPE,
} from '@/utils/app/const';

import { AiModel, PossibleAiModels } from '@/types/ai-models';
import { getOpenAiApi } from './openai';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(apiKey?: string) {
  const openai = getOpenAiApi(apiKey);
  const res = await openai.listModels();

  if (res.status !== 200) {
    console.error('Error fetching OpenAi models', res.status, res.body);
    return { error: res.status, data: res.body };
  }

  const json = await res.json();

  const models: (AiModel | null)[] = json.data
    .map((openaiModel: any) => {
      const model_name =
        OPENAI_API_TYPE === 'azure' ? openaiModel.model : openaiModel.id;

      if (!PossibleAiModels[model_name] && DEBUG_MODE) {
        console.warn('OpenAI model not implemented in unSAGED:', model_name);
        return null;
      }

      const model = PossibleAiModels[model_name];

      if (OPENAI_API_TYPE === 'azure') {
        model.id = openaiModel.id;
      }

      return model;
    })
    .filter(Boolean);

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
