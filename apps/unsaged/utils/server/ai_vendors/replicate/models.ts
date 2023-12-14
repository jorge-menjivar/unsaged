import { AiModel, GetAvailableAIModelResponse, PossibleAiModels } from '@/types/ai-models';
import { getReplicateClient } from './client';
import { DEBUG_MODE, REPLICATE_API_TOKEN } from '@/utils/app/const';

export const config = {
  runtime: 'edge',
};

export async function getAvailableReplicateModels(apiKey: string): Promise<GetAvailableAIModelResponse> {
  if (!apiKey) {
    if (!REPLICATE_API_TOKEN) {
      return { data: [] };
    } else {
      apiKey = REPLICATE_API_TOKEN;
    }
  }

  const client = getReplicateClient(apiKey);

  const list = await client.models.list();

  const models: (AiModel | null)[] = list.results
    .map((replicateModel: any) => {
      const model_name = replicateModel.name;

      if (!PossibleAiModels[model_name]) {
        if (DEBUG_MODE)
          console.warn('Replicate model not implemented:', model_name);

        return null;
      }

      const model = PossibleAiModels[model_name];

      model.id = replicateModel.name;

      return model;
    });

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
