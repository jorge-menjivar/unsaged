import { debug } from '@/utils/logging';

import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { invoke } from '@tauri-apps/api/tauri';

export async function countTokensOpenAI(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
) {
  const tokenCount = await invoke('count_tokens_openai', {
    model_name: model.id,
    system_prompt: systemPrompt,
    messages,
  });

  debug('tokenCount', tokenCount);

  return { count: tokenCount };
}
