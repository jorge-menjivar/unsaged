import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { streamAnthropic } from './anthropic/getStream';
import { streamPaLM2 } from './google/getStream';
import { streamOllama } from './ollama/getStream';
import { streamOpenAI } from './openai/getStream';

export async function getStream(
  model: AiModel,
  systemPrompt: string,
  temperature: number,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
) {
  if (model.vendor === 'OpenAI') {
    return streamOpenAI(
      model,
      systemPrompt,
      temperature,
      apiKey,
      messages,
      tokenCount,
    );
  } else if (model.vendor === 'Anthropic') {
    return streamAnthropic(
      model,
      systemPrompt,
      temperature,
      apiKey,
      messages,
      tokenCount,
    );
  } else if (model.vendor === 'Google') {
    return streamPaLM2(
      model,
      systemPrompt,
      temperature,
      apiKey,
      messages,
      tokenCount,
    );
  } else if (model.vendor === 'Ollama') {
    return streamOllama(model, systemPrompt, temperature, messages);
  }
  return { error: 'Unknown vendor' };
}
