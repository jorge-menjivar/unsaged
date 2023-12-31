import { AiModel, ModelParams } from '@/types/ai-models';

import { imageOpenAI } from './openai/image';
import { imageAzure } from './azure/image';

export async function getImage(
  model: AiModel,
  params: ModelParams,
  apiKey: string | undefined,
  prompt: string,
) {
  switch (model.vendor) {
    case 'OpenAI':
      return imageOpenAI(
        model,
        params,
        apiKey,
        prompt
      );
    case 'Azure':
      return imageAzure(
        model,
        params,
        apiKey,
        prompt
      );
    default:
      return { error: 'Unknown vendor' };
  }
}
