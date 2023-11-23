import { ANTHROPIC_API_KEY } from '@/utils/app/const';

import { AiModel, GetAvailableOpenAIModelResponse, PossibleAiModels } from '@/types/ai-models';

export const config = {
  runtime: 'edge',
};

export async function getAvailableAnthropicModels(key?: string): Promise<GetAvailableOpenAIModelResponse> {
  if (!key) {
    key = ANTHROPIC_API_KEY;

    if (!key) {
      return { data: [] };
    }
  }
  const models: AiModel[] = [
    PossibleAiModels['claude-instant-1'],
    PossibleAiModels['claude-2'],
  ];

  return { data: models };
}
