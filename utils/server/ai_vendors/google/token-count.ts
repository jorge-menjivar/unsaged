import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';

// TODO: This is currently just an estimate. We need to actually count the tokens.
export async function countTokensGoogle(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
) {
  let tokenCount = systemPrompt.length / 4;

  for (let i = messages.length - 1; i >= 0; i--) {
    const text = `\n\n${messages[i].role}: ${messages[i].content}`;

    if (text.length > 0) {
      tokenCount += text.length / 4;
    }

    if (tokenCount > model.requestLimit) {
      return { error: 'Token limit exceeded' };
    }
  }

  // Convert to integer
  tokenCount = Math.ceil(tokenCount);

  return { count: tokenCount };
}
