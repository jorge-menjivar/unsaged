import { OLLAMA_HOST } from '@/utils/app/const';

import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

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
    },
    method: 'POST',
    body: JSON.stringify({
      model: model.id,
      prompt: prompt,
      options: { temperature: temperature },
      system: systemPrompt,
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
      try {
        for await (const chunk of res.body as any) {
          const text = decoder.decode(chunk);
          const parsedData = JSON.parse(text);
          if (parsedData.response) {
            controller.enqueue(encoder.encode(parsedData.response));
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  // const stream = new ReadableStream({
  //   async start(controller) {
  //     const onParse = (event: ParsedEvent | ReconnectInterval) => {

  //       if (event.type === 'event') {
  //         const data = event.data;
  //         if (data === '[DONE]') {
  //           controller.close();
  //           return;
  //         }

  //         try {
  //           const json = JSON.parse(data);
  //           if (json.choices[0].finish_reason != null) {
  //             controller.close();
  //             return;
  //           }
  //           const text = json.choices[0].delta.content;
  //           const queue = encoder.encode(text);
  //           controller.enqueue(queue);
  //         } catch (e) {
  //           controller.error(e);
  //         }
  //       }
  //     };

  //     const parser = createParser(onParse);

  //     for await (const chunk of res.body as any) {
  //       parser.feed(decoder.decode(chunk));
  //     }
  //   },
  // });

  return { stream: stream };
}
