import {
  ANTHROPIC_API_KEY,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { AnthropicStream } from 'ai';
import { getAnthropicClient } from './client';
import { CompletionCreateParamsStreaming } from '@anthropic-ai/sdk/resources';

export async function streamAnthropic(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
): Promise<{ error?: any, stream?: any }> {
  if (!apiKey) {
    if (!ANTHROPIC_API_KEY) {
      return { error: 'Missing API key' };
    } else {
      apiKey = ANTHROPIC_API_KEY;
    }
  }

  if (model.type != 'text') {
    return { error: 'Chat Stream is only available for model type text' };
  }

  const client = getAnthropicClient(apiKey);

  let prompt = systemPrompt;

  let parsedMessages = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    const parsedMessage = `\n\n${messages[i].role === 'user' ? 'Human' : 'Assistant'
      }: ${messages[i].content}`;
    parsedMessages = parsedMessage + parsedMessages;
  }

  prompt += parsedMessages;

  prompt += '\n\nAssistant:';

  const body: CompletionCreateParamsStreaming = {
    prompt: prompt,
    model: model.id,
    max_tokens_to_sample: model.tokenLimit - tokenCount,
    stop_sequences: ['\n\nUser:'],
    stream: true,
  };

  if (params.max_tokens) {
    body.max_tokens_to_sample = params.max_tokens;
  }

  if (params.temperature) {
    body.temperature = params.temperature;
  }

  if (params.stop) {
    body.stop_sequences = params.stop;
  }

  if (params.top_k) {
    body.top_k = params.top_k;
  }

  if (params.top_p) {
    body.top_p = params.top_p;
  }

  const response = await client.completions.create(body);

  const stream = AnthropicStream(response);

  return { stream: stream };
}
