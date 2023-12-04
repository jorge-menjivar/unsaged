import {
  OPENAI_API_KEY,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

import OpenAI from 'openai';
import { OpenAIStream } from 'ai';
import { getOpenAi } from './openai';
import { ChatCompletionCreateParamsStreaming } from 'openai/resources';

export async function streamOpenAI(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
): Promise<{ error?: any, stream?: any }> {
  if (!apiKey) {
    if (!OPENAI_API_KEY) {
      return { error: 'Missing API key' };
    } else {
      apiKey = OPENAI_API_KEY;
    }
  }

  if (model.type != 'text') {
    return { error: 'Chat Stream is only available for model type text' };
  }

  const openai = await getOpenAi(apiKey);

  let messagesToSend: any[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = {
      role: messages[i].role,
      content: messages[i].content,
    };
    messagesToSend = [message, ...messagesToSend];
  }

  const body: ChatCompletionCreateParamsStreaming = {
    model: model.id,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messagesToSend,
    ],
    stream: true,
  }

  if (model.id !== 'gpt-4-1106-preview') {
    body.max_tokens = model.tokenLimit - tokenCount;
  }

  if (params.temperature) {
    body.temperature = params.temperature;
  }

  if (params.max_tokens) {
    body.max_tokens = params.max_tokens;
  }

  if (params.repeat_penalty) {
    body.frequency_penalty = params.repeat_penalty;
  }

  if (params.presence_penalty) {
    body.presence_penalty = params.presence_penalty;
  }

  if (params.stop) {
    body.stop = params.stop;
  }

  if (params.top_p) {
    body.top_p = params.top_p;
  }

  if (params.seed) {
    body.seed = params.seed;
  }

  return openai.chat.completions.create(body).then((completions) => {
    const stream = OpenAIStream(completions);

    return { stream: stream };
  }).catch((err) => {
    if (err instanceof OpenAI.APIError) {
      console.error(err.status, err.error);
      return { error: err.error };
    } else {
      throw err;
    }
  });
}
