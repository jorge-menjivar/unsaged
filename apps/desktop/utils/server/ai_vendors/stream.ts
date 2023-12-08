import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';
import { SavedSettings } from '@/types/settings';

import { streamAnthropic } from './anthropic/stream';
import { streamPaLM2 } from './google/stream';
import { streamOllama } from './ollama/stream';
import { streamOpenAI } from './openai/stream';

export async function getStream(
  savedSettings: SavedSettings,
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
  controller: AbortController,
): Promise<{
  stream: ReadableStream | null;
  error: string | null | undefined;
}> {
  if (model.vendor === 'OpenAI') {
    return streamOpenAI(
      model,
      systemPrompt,
      params,
      apiKey,
      messages,
      tokenCount,
      controller,
    );
  } else if (model.vendor === 'Anthropic') {
    return streamAnthropic(
      model,
      systemPrompt,
      params,
      apiKey,
      messages,
      tokenCount,
      controller,
    );
  } else if (model.vendor === 'Google') {
    return streamPaLM2(
      model,
      systemPrompt,
      params,
      apiKey,
      messages,
      tokenCount,
      controller,
    );
  } else if (model.vendor === 'Ollama') {
    return streamOllama(
      savedSettings,
      model,
      systemPrompt,
      params,
      messages,
      controller,
    );
  }
  return { stream: null, error: 'Unknown vendor' };
}
