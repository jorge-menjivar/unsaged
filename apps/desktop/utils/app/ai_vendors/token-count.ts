import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { countTokensAnthropic } from './anthropic/token-count';
import { countTokensGoogle } from './google/token-count';
import { countTokensOllama } from './ollama/token-count';

import { invoke } from '@tauri-apps/api/tauri';

export async function getTokenCount(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
) {
  if (model.vendor === 'OpenAI') {
    const tokenCount: number = await invoke('count_tokens_openai', {
      model_name: model.id,
      system_prompt: systemPrompt,
      messages,
    });
    return { count: tokenCount, error: undefined };
  } else if (model.vendor === 'Azure') {
    const tokenCount: number = await invoke('count_tokens_azure', {
      model_name: model.id,
      system_prompt: systemPrompt,
      messages,
    });
    return { count: tokenCount, error: undefined };
  } else if (model.vendor === 'Anthropic') {
    return countTokensAnthropic(model, systemPrompt, messages);
  } else if (model.vendor === 'Google') {
    return countTokensGoogle(model, systemPrompt, messages);
  } else if (model.vendor === 'Ollama') {
    return countTokensOllama(model, systemPrompt, messages);
  }
  return { error: 'Unknown vendor' };
}
