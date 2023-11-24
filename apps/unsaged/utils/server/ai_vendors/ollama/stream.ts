import {
  OLLAMA_BASIC_PWD,
  OLLAMA_BASIC_USER,
  OLLAMA_HOST,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';
import { SavedSettings } from '@/types/settings';

export async function streamOllama(
  savedSettings: SavedSettings,
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  messages: Message[],
  controller: AbortController,
): Promise<{
  stream: ReadableStream | null;
  error: string | null;
}> {
  if (OLLAMA_HOST == '') {
    return { stream: null, error: 'Missing OLLAMA_HOST' };
  }

  let prompt: string = '';

  for (let i = 0; i < messages.length; i++) {
    prompt += messages[i].content + '\n';
  }

  let base_url = OLLAMA_HOST;
  if (savedSettings['ollama.url']) {
    base_url = savedSettings['ollama.url'];
  }

  const url = `${base_url}/api/generate`;

  const body: { [key: string]: any } = {
    model: model.id,
    prompt: prompt,
    options: {},
    system: systemPrompt,
    stream: true,
  };

  if (params.temperature) {
    body.options['temperature'] = params.temperature;
  }

  if (params.max_tokens) {
    body.options['num_predict'] = params.max_tokens;
  }

  if (params.repeat_penalty) {
    body.options['repeat_penalty'] = params.repeat_penalty;
  }

  // Only supports one stop token
  if (params.stop) {
    body.options['stop'] = params.stop[0];
  }

  if (params.top_k) {
    body.options['top_k'] = params.top_k;
  }

  if (params.top_p) {
    body.options['top_p'] = params.top_p;
  }

  if (params.seed) {
    body.options['seed'] = params.seed;
  }

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(OLLAMA_BASIC_USER &&
        OLLAMA_BASIC_PWD && {
          Authorization: `Basic ${Buffer.from(
            OLLAMA_BASIC_USER + ':' + OLLAMA_BASIC_PWD,
          ).toString('base64')}`,
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
      return { stream: null, error: result.error };
    } else {
      throw new Error(
        `Ollama API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  if (res.body) {
    const reader = res.body.getReader();
    const encoder = new TextEncoder();
    let buffer = '';

    const stream = new ReadableStream({
      async start(controller) {
        function push() {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }

              buffer += decoder.decode(value, { stream: true });
              let boundary = buffer.lastIndexOf('\n');

              if (boundary !== -1) {
                const completeResponse = buffer.slice(0, boundary);
                buffer = buffer.slice(boundary + 1); // Keep the incomplete chunk in the buffer

                completeResponse.split('\n').forEach((line) => {
                  if (line) {
                    try {
                      const parsedData = JSON.parse(line);
                      if (parsedData.response) {
                        controller.enqueue(encoder.encode(parsedData.response));
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
            .catch((e) => {
              console.error('Stream reading error', e);
              controller.error(e);
            });
        }

        push();
      },
    });

    return { stream, error: null };
  } else {
    // Handle the case where res.body is null
    throw new Error('Response body is null');
  }
}
