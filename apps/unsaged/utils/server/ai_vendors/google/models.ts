import { AiModel, GetAvailableAIModelResponse } from '@/types/ai-models';
import { getModelSettings } from '../models';
import { PALM_API_KEY } from '@/utils/app/const';

export const config = {
  runtime: 'edge',
};

export async function getAvailablePalm2Models(apiKey: string): Promise<GetAvailableAIModelResponse> {
  if (!apiKey) {
    if (!PALM_API_KEY) {
      return { data: [] };
    } else {
      apiKey = PALM_API_KEY;
    }
  }

  const { data: modelSettings } = await getModelSettings('Google');
  const models: AiModel[] = modelSettings.filter(m => m.vendor === 'Google');

  return { data: models };
}
