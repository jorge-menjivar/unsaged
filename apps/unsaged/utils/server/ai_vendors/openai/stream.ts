import {
  OPENAI_API_KEY,
  OPENAI_API_TYPE,
  OPENAI_API_URL,
  OPENAI_API_VERSION,
  OPENAI_ORGANIZATION,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

export async function streamOpenAI(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
  controller: AbortController,
): Promise<{
  stream: ReadableStream | null;
  error: string | null;
}> {
  if (!apiKey) {
    if (!OPENAI_API_KEY) {
      return { stream: null, error: 'Missing API key' };
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
    signal: controller.signal,
  });

  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      return { stream: null, error: result.error as string };
    } else {
      throw new Error(
        `OpenAI API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  if (res.body == null) {
    return { stream: null, error: 'No response body' };
  }

  const reader = res.body.getReader();
  let buffer = '';
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function push() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              // Check if the controller is already closed before trying to close it
              if (!controller.desiredSize) {
                controller.close();
              }
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            let boundary = buffer.lastIndexOf('\n\n');

            if (boundary !== -1) {
              const completeResponse = buffer.slice(0, boundary);
              buffer = buffer.slice(boundary + 1); // Keep the incomplete chunk in the buffer

              completeResponse.split('\n\n').forEach((line) => {
                if (line) {
                  try {
                    line = line.slice(6, line.length);
                    console.log('Line 1:', line);

                    if (line === '[DONE]') {
                      // Check if the controller is already closed before trying to close it
                      if (!controller.desiredSize) {
                        controller.close();
                      }
                      return;
                    }
                    line = line.slice(0, line.length);

                    console.log('Line 2:', line);

                    const parsedData = JSON.parse(line);

                    if (parsedData.choices.length > 0) {
                      if (parsedData.choices[0].finish_reason != null) {
                        controller.close();
                        return;
                      }
                      const text = parsedData.choices[0].delta.content;
                      controller.enqueue(encoder.encode(text));
                    }
                  } catch (e) {
                    console.error('Error parsing JSON', e);
                    controller.error(e);
                  }
                }
              });
            }

            push();
          })
          .catch((error) => {
            console.error('Stream reading error:', error);
            controller.error(error);
          });
      }

      push();
    },
  });

  return { stream: stream, error: null };
}
