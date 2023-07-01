import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

// @ts-expect-error
import wasm from '../../../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

// TODO: This is currently just an estimate. We need to actually count the tokens.
export async function countTokensAnthropic(
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

  let tokenCount = prompt_tokens.length;

  for (let i = messages.length - 1; i >= 0; i--) {
    const text = `\n\n${messages[i].role}: ${messages[i].content}`;

    const tokens = encoding.encode(text);

    if (tokens) {
      tokenCount += tokens.length;
    }
    if (tokenCount > model.requestLimit) {
      encoding.free();
      return { error: 'Token limit exceeded' };
    }
  }

  encoding.free();
  return { count: tokenCount };
}
