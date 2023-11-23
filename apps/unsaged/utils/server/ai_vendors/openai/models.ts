import {
  DEBUG_MODE,
  OPENAI_API_TYPE,
} from '@/utils/app/const';

import { AiModel, GetAvailableOpenAIModelResponse, PossibleAiModels } from '@/types/ai-models';
import { getOpenAi } from './openai';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(key?: string): Promise<GetAvailableOpenAIModelResponse> {
  const openai = await getOpenAi(key);

  const list = await openai.models.list();

  const models: (AiModel | null)[] = list.data
    .map((openaiModel: any) => {
      const model_name =
        OPENAI_API_TYPE === 'azure' ? openaiModel.model : openaiModel.id;

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
