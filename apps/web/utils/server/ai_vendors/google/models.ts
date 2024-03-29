import { AiModel, GetAvailableAIModelResponse, PossibleAiModels } from '@/types/ai-models';

export const config = {
  runtime: 'edge',
};

export async function getAvailablePalm2Models(key: string): Promise<GetAvailableAIModelResponse> {
  if (!key) {
    return { data: [] };
  }

  const models: AiModel[] = [PossibleAiModels['bard']];

  return { data: models };
}
