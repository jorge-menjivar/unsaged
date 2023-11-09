import {
  OPENAI_API_TYPE,
} from '@/utils/app/const';

import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';
import { getOpenAiApi } from './openai';
import { CreateChatCompletionRequest } from 'openai-edge';

export async function streamOpenAI(
  model: AiModel,
  systemPrompt: string,
  temperature: number,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
) {
  let messagesToSend: any[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = {
      role: messages[i].role,
      content: messages[i].content,
    };
    messagesToSend = [message, ...messagesToSend];
  }

  const body: CreateChatCompletionRequest = {
    model: model.id,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messagesToSend,
    ],
    temperature: temperature,
    stream: true
  };

  if (model.id !== 'gpt-4-1106-preview') {
    body.max_tokens = model.tokenLimit - tokenCount;
  }

  const azureModelId = OPENAI_API_TYPE === 'azure' ? model.id : undefined;
  const openai = getOpenAiApi(apiKey, azureModelId);
  const res = await openai.createChatCompletion(body);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      return { error: result.error };
    } else {
      throw new Error(
        `OpenAI API returned an error: ${decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;
          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            if (json.choices.length > 0) {
              if (json.choices[0].finish_reason != null) {
                controller.close();
                return;
              }
              const text = json.choices[0].delta.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            }
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return { stream: stream };
}
