import { AiModel, ModelParams } from '@/types/ai-models';

import { imageOpenAI } from './openai/image';

export async function getImage(
  model: AiModel,
  params: ModelParams,
  apiKey: string | undefined,
  prompt: string,
) {
  if (model.vendor === 'OpenAI') {
    return imageOpenAI(
      model,
      params,
      apiKey,
      prompt
    );
  }
  return { error: 'Unknown vendor' };
}
