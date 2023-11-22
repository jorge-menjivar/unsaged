import {
  ANTHROPIC_API_KEY,
  ANTHROPIC_API_URL,
  ANTHROPIC_API_VERSION,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export async function streamAnthropic(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
) {
  if (!apiKey) {
    if (!ANTHROPIC_API_KEY) {
      return { error: 'Missing API key' };
    } else {
      apiKey = ANTHROPIC_API_KEY;
    }
  }

  let prompt = systemPrompt;

  let parsedMessages = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    const parsedMessage = `\n\n${messages[i].role === 'user' ? 'Human' : 'Assistant'
      }: ${messages[i].content}`;
    parsedMessages = parsedMessage + parsedMessages;
  }

  prompt += parsedMessages;

  prompt += '\n\nAssistant:';

  let url = `${ANTHROPIC_API_URL}/complete`;

  const body: { [key: string]: any } = {
    prompt: prompt,
    model: model.id,
    max_tokens_to_sample: model.tokenLimit - tokenCount,
    stop_sequences: ['\n\nUser:'],
    stream: true,
  };

  if (params.max_tokens) {
    body['max_tokens_to_sample'] = params.max_tokens;
  }

  if (params.temperature) {
    body['temperature'] = params.temperature;
  }

  // Only supports one stop token
  if (params.stop) {
    body['stop_sequences'] = params.stop[0];
  }

  if (params.top_k) {
    body['top_k'] = params.top_k;
  }

  if (params.top_p) {
    body['top_p'] = params.top_p;
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': ANTHROPIC_API_VERSION,
      'x-api-key': apiKey,
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      return { error: result.error };
    } else {
      throw new Error(
        `Anthropic API returned an error: ${decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const raw_data = event.data;

          try {
            const data = JSON.parse(raw_data);
            if (data.stop_reason != null) {
              controller.close();
              return;
            }
            const text = data.completion;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
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
