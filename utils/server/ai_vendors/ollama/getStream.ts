import {
  OLLAMA_BASIC_PWD,
  OLLAMA_BASIC_USER,
  OLLAMA_HOST,
} from '@/utils/app/const';

import { AiModel } from '@/types/ai-models';
import { Message, ModelParams } from '@/types/chat';

export async function streamOllama(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  messages: Message[],
) {
  if (OLLAMA_HOST == '') {
    return { error: 'Missing OLLAMA_HOST' };
  }

  let prompt: string = '';

  for (let i = 0; i < messages.length; i++) {
    prompt += messages[i].content + '\n';
  }

  let url = `${OLLAMA_HOST}/api/generate`;

  const body: { [key: string]: any } = {
    model: model.id,
    prompt: prompt,
    options: { temperature: params.temperature },
    system: systemPrompt,
    stream: true,
  };

  if (params.max_tokens) {
    body['num_predict'] = params.max_tokens;
  }

  if (params.repeat_penalty) {
    body['repeat_penalty'] = params.repeat_penalty;
  }

  // Only supports one stop token
  if (params.stop) {
    body['stop'] = params.stop[0];
  }

  if (params.top_k) {
    body['top_k'] = params.top_k;
  }

  if (params.top_p) {
    body['top_p'] = params.top_p;
  }

  if (params.seed) {
    body['seed'] = params.seed;
  }

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...(OLLAMA_BASIC_USER &&
        OLLAMA_BASIC_PWD && {
          Authorization: `Basic ${Buffer.from(
            OLLAMA_BASIC_USER + ':' + OLLAMA_BASIC_PWD,
          ).toString('base64')}`,
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
        `Ollama API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      let fullText = '';
      try {
        for await (const chunk of res.body as any) {
          const decodedText = decoder.decode(chunk);

          const splits = decodedText.split('}\n{');
          for (let i = 0; i < splits.length; i++) {
            let split = splits[i];
            if (i !== 0) {
              split = '{' + split;
            }
            if (i !== splits.length - 1) {
              split = split + '}';
            }
            const parsedData = JSON.parse(split);
            if (parsedData.response) {
              fullText += parsedData.response;
              controller.enqueue(encoder.encode(parsedData.response));
            }
          }
        }
        controller.close();
      } catch (e) {
        console.log('Error parsing JSON', e);
        controller.error(e);
      }
      // console.log(fullText);
    },
  });

  return { stream: stream };
}
