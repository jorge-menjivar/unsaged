import { PALM_API_KEY, PALM_API_URL } from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

export async function streamPaLM2(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
): Promise<{ error?: any, stream?: any }> {
  if (!apiKey) {
    if (!PALM_API_KEY) {
      return { error: 'Missing API key' };
    } else {
      apiKey = PALM_API_KEY;
    }
  }

  let messagesToSend: any[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = {
      author: messages[i].role === 'user' ? 'user' : 'model',
      content: messages[i].content,
    };
    messagesToSend = [message, ...messagesToSend];
  }

  const url = `${PALM_API_URL}/models/chat-bison-001:generateMessage?key=${apiKey}`;

  const examples = [
    {
      input: { content: 'Hi' },
      output: {
        content: 'Hi, how can I help you today?',
      },
    },
    {
      input: { content: 'Tell me a joke' },
      output: {
        content:
          "Why don't scientists trust atoms? Because they make up everything!",
      },
    },
    {
      input: { content: 'What can you do?' },
      output: {
        content:
          'I can assist with a variety of tasks, including answering questions, providing information, and more.',
      },
    },
  ];

  const prompt = {
    context: systemPrompt,
    examples: examples,
    messages: [...messagesToSend],
  };

  const body: { [key: string]: any } = {
    prompt: prompt,
    candidate_count: 1,
    top_p: 0.95,
    top_k: 40,
  };

  if (params.temperature) {
    body['temperature'] = params.temperature;
  }

  if (params.max_tokens) {
    body['maxOutputTokens'] = params.max_tokens;
  }

  if (params.stop) {
    body['stopSequences'] = params.stop;
  }

  if (params.top_k) {
    body['topK'] = params.top_k;
  }

  if (params.top_p) {
    body['topP'] = params.top_p;
  }

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (res.status !== 200) {
    let result = await res.text();
    console.error(result);
  }

  const result = await res.json();
  let text = '';

  if (!result.candidates && result.filters.length > 0) {
    text =
      'Bard refused to answer because of reason: ' + result.filters[0].reason;
  } else {
    text = result.candidates[0].content;
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const queue = encoder.encode(text);
      controller.enqueue(queue);
      controller.close();
    },
  });

  return { stream: stream };
}
