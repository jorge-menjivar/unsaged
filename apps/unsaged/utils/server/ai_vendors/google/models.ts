import { PALM_API_KEY } from '@/utils/app/const';

import { AiModel, PossibleAiModels } from '@/types/ai-models';

export const config = {
  runtime: 'edge',
};

export async function getAvailablePalm2Models(key?: string) {
  if (!key) {
    key = PALM_API_KEY;

    if (!key) {
      return { data: [] };
    }
  }
  const models: AiModel[] = [PossibleAiModels['bard']];

  return { data: models };
}
