import {
  REPLICATE_API_TOKEN,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { ReplicateStream } from 'ai';
import { getReplicateClient } from './client';

export async function streamReplicate(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
): Promise<{ error?: any, stream?: any }> {
  if (!apiKey) {
    if (!REPLICATE_API_TOKEN) {
      return { error: 'Missing API key' };
    } else {
      apiKey = REPLICATE_API_TOKEN;
    }
  }

  if (model.type != 'text') {
    return { error: 'Chat Stream is only available for model type text' };
  }

  const client = getReplicateClient(apiKey);

  let prompt = systemPrompt;

  let parsedMessages = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    const parsedMessage = `\n\n${messages[i].role === 'user' ? 'Human' : 'Assistant'
      }: ${messages[i].content}`;
    parsedMessages = parsedMessage + parsedMessages;
  }

  prompt += parsedMessages;

  prompt += '\n\nAssistant:';

  const response = await client.predictions.create({
    version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1',
    stream: true,
    input: {
      prompt: prompt,
    }
  });

  const stream = ReplicateStream(response);

  return { stream: stream };
}
