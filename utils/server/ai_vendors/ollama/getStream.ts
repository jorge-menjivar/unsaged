import { OLLAMA_HOST, OLLAMA_BASIC_USER, OLLAMA_BASIC_PWD } from '@/utils/app/const';

import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

export async function streamOllama(
  model: AiModel,
  systemPrompt: string,
  temperature: number,
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

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...((OLLAMA_BASIC_USER && OLLAMA_BASIC_PWD) && {
        Authorization: `Basic ${Buffer.from(OLLAMA_BASIC_USER + ":" + OLLAMA_BASIC_PWD).toString('base64')}`,
      }),
    },
    method: 'POST',
    body: JSON.stringify({
      model: model.id,
      prompt: prompt,
      options: { temperature: temperature },
      system: systemPrompt,
      stream: true,
    }),
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
