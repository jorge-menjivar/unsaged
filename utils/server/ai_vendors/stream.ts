import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { streamAnthropic } from './anthropic/stream';
import { streamPaLM2 } from './google/stream';
import { streamOllama } from './ollama/stream';
import { streamOpenAI } from './openai/stream';

export async function getStream(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
) {
  if (model.vendor === 'OpenAI') {
    return streamOpenAI(
      model,
      systemPrompt,
      params,
      apiKey,
      messages,
      tokenCount,
    );
  } else if (model.vendor === 'Anthropic') {
    return streamAnthropic(
      model,
      systemPrompt,
      params,
      apiKey,
      messages,
      tokenCount,
    );
  } else if (model.vendor === 'Google') {
    return streamPaLM2(
      model,
      systemPrompt,
      params,
      apiKey,
      messages,
      tokenCount,
    );
  } else if (model.vendor === 'Ollama') {
    return streamOllama(model, systemPrompt, params, messages);
  }
  return { error: 'Unknown vendor' };
}
