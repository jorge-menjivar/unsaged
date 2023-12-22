import { AiModel, GetAvailableAIModelResponse } from '@/types/ai-models';
import { getModelSettings } from '../models';
import { ANTHROPIC_API_KEY } from '@/utils/app/const';

export const config = {
  runtime: 'edge',
};

export async function getAvailableAnthropicModels(apiKey: string): Promise<GetAvailableAIModelResponse> {
  if (!apiKey) {
    if (!ANTHROPIC_API_KEY) {
      return { data: [] };
    } else {
      apiKey = ANTHROPIC_API_KEY;
    }
  }

  const { data: modelSettings } = await getModelSettings('Anthropic');
  const models: AiModel[] = modelSettings.filter(m => m.vendor === 'Anthropic');

  return { data: models };
}
