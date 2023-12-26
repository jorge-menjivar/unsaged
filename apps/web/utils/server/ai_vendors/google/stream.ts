import { GOOGLE_API_KEY, GOOGLE_API_URL } from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';

import { GoogleGenerativeAIStream } from 'ai';
import { ModelParams as GenAIModelParams, GenerationConfig } from '@google/generative-ai';
import { getClient } from './client';

export async function streamGoogle(
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
): Promise<{ error?: any, stream?: any }> {
  if (!apiKey) {
    if (!GOOGLE_API_KEY) {
      return { error: 'Missing API key' };
    } else {
      apiKey = GOOGLE_API_KEY;
    }
  }

  if (model.type != 'text') {
    return { error: 'Chat Stream is only available for model type text' };
  }

  const client = await getClient(apiKey);

  let messagesToSend: any[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = {
      author: messages[i].role === 'user' ? 'user' : 'model',
      content: messages[i].content,
    };
    messagesToSend = [message, ...messagesToSend];
  }

  const generationConfig: GenerationConfig = {
    candidateCount: 1,
    topP: 0.95,
    topK: 40
  };

  if (params.temperature) {
    generationConfig.temperature = params.temperature;
  }

  if (params.max_tokens) {
    generationConfig.maxOutputTokens = params.max_tokens;
  }

  if (params.stop) {
    generationConfig.stopSequences = params.stop;
  }

  if (params.top_k) {
    generationConfig.topK = params.top_k;
  }

  if (params.top_p) {
    generationConfig.topP = params.top_p;
  }

  const body: GenAIModelParams = {
    model: model.id,
    generationConfig
  };

  const buildGoogleGenAIPrompt = (messages: Message[]) => ({
    contents: messages
      .filter(message => message.role === 'user' || message.role === 'assistant')
      .map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      })),
  });

  const geminiStream = await client
    .getGenerativeModel(body)
    .generateContentStream(buildGoogleGenAIPrompt([
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messagesToSend,
    ]));

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);

  return { stream: stream };
}
