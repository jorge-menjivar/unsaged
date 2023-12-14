import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { countTokensAnthropic } from './anthropic/token-count';
import { countTokensGoogle } from './google/token-count';
import { countTokensOllama } from './ollama/token-count';
import { countTokensOpenAI } from './openai-token-count';

export async function getTokenCount(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
) {
  switch (model.vendor) {
    case 'OpenAI':
      return countTokensOpenAI(model, systemPrompt, messages);
    case 'Azure':
      return countTokensOpenAI(model, systemPrompt, messages);
    case 'Anthropic':
      return countTokensAnthropic(model, systemPrompt, messages);
    case 'Google':
      return countTokensGoogle(model, systemPrompt, messages);
    case 'Ollama':
      return countTokensOllama(model, systemPrompt, messages);
    default:
      return { error: 'Unknown vendor' };
  }
}
