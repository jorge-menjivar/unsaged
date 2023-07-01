import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { countTokensAnthropic } from './anthropic/getTokenCount';
import { countTokensOpenAI } from './openai/getTokenCount';

export async function getTokenCount(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
) {
  if (model.vendor === 'OpenAI') {
    return countTokensOpenAI(model, systemPrompt, messages);
  } else if (model.vendor === 'Anthropic') {
    return countTokensAnthropic(model, systemPrompt, messages);
  }
  return { error: 'Unknown vendor' };
}
