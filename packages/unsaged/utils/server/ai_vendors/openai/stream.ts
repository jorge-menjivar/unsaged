import {
  OPENAI_API_KEY,
  OPENAI_API_TYPE,
  OPENAI_API_URL,
  OPENAI_API_VERSION,
  OPENAI_ORGANIZATION,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export async function streamOpenAI(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
) {
  if (!apiKey) {
    if (!OPENAI_API_KEY) {
      return { error: 'Missing API key' };
    } else {
      apiKey = OPENAI_API_KEY;
    }
  }

  let messagesToSend: any[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = {
      role: messages[i].role,
      content: messages[i].content,
    };
    messagesToSend = [message, ...messagesToSend];
  }

  let url = `${OPENAI_API_URL}/chat/completions`;
  if (OPENAI_API_TYPE === 'azure') {
    url = `${OPENAI_API_URL}/openai/deployments/${model.id}/chat/completions?api-version=${OPENAI_API_VERSION}`;
  }

  const body: { [key: string]: any } = {
    ...(OPENAI_API_TYPE === 'openai' && { model: model.id }),
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messagesToSend,
    ],
    stream: true,
  };

  if (model.id !== 'gpt-4-1106-preview') {
    body['max_tokens'] = model.tokenLimit - tokenCount;
  }

  if (params.temperature) {
    body['temperature'] = params.temperature;
  }

  if (params.max_tokens) {
    body['max_tokens'] = params.max_tokens;
  }

  if (params.repeat_penalty) {
    body['frequency_penalty'] = params.repeat_penalty;
  }

  if (params.presence_penalty) {
    body['presence_penalty'] = params.presence_penalty;
  }

  if (params.stop) {
    body['stop'] = params.stop;
  }

  if (params.top_p) {
    body['top_p'] = params.top_p;
  }

  if (params.seed) {
    body['seed'] = params.seed;
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(OPENAI_API_TYPE === 'openai' && {
        Authorization: `Bearer ${apiKey}`,
      }),
      ...(OPENAI_API_TYPE === 'azure' && {
        'api-key': apiKey,
      }),
      ...(OPENAI_API_TYPE === 'openai' &&
        OPENAI_ORGANIZATION && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
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
        `OpenAI API returned an error: ${
          decoder.decode(result?.value) || result.statusText
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
