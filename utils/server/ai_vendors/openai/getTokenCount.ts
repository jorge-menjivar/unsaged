import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

// @ts-expect-error
import wasm from '../../../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

export async function countTokensOpenAI(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
) {
  await init((imports) => WebAssembly.instantiate(wasm, imports));
  const encoding = new Tiktoken(
    tiktokenModel.bpe_ranks,
    tiktokenModel.special_tokens,
    tiktokenModel.pat_str,
  );

  const prompt_tokens = encoding.encode(systemPrompt);

  let tokens_per_message = 0;
  if (model.id === 'gpt-3.5-turbo' || model.id === 'gpt-35-az') {
    tokens_per_message = 5;
  } else if (model.id === 'gpt-4' || model.id === 'gpt-4-32k') {
    tokens_per_message = 4;
  }

  let tokenCount = prompt_tokens.length + tokens_per_message;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = {
      role: messages[i].role,
      content: messages[i].content,
    };

    const tokens = encoding.encode(message.content);

    if (tokens) {
      tokenCount += tokens.length + tokens_per_message;
    }
    if (tokenCount > model.requestLimit) {
      encoding.free();
      return { error: 'Token limit exceeded' };
    }
  }

  // every reply is primed with <|start|>assistant<|message|>
  tokenCount += 3;

  encoding.free();
  return { count: tokenCount };
}
