import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { countTokensAnthropic } from './anthropic/token-count';
import { countTokensGoogle } from './google/token-count';
import { countTokensOllama } from './ollama/token-count';
import { countTokensOpenAI } from './openai/token-count';

export async function getTokenCount(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
) {
  if (model.vendor === 'OpenAI') {
    return countTokensOpenAI(model, systemPrompt, messages);
  } else if (model.vendor === 'Anthropic') {
    return countTokensAnthropic(model, systemPrompt, messages);
  } else if (model.vendor === 'Google') {
    return countTokensGoogle(model, systemPrompt, messages);
  } else if (model.vendor === 'Ollama') {
    return countTokensOllama(model, systemPrompt, messages);
  }
  return { error: 'Unknown vendor' };
}
