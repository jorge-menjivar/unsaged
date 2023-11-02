// Import necessary types and modules
import { AiModel } from '@/types/ai-models';
import { Message } from '@/types/chat';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';
import wasm from '@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import { TokenCountTransaction } from '@/types/tokenCounts';
import { storageCreateTokenCount } from '../../../app/storage/tokenCount';
import { Database } from '@/types/database';
import { User } from '@/types/auth';





/// Initialization function
async function initializeTiktoken() {
  await init((imports) => WebAssembly.instantiate(wasm, imports));
  return new Tiktoken(
    tiktokenModel.bpe_ranks,
    tiktokenModel.special_tokens,
    tiktokenModel.pat_str,
  );
}

// Function to calculate tokens for a text string
function calculateTokens(encoding: any, text: string) {
  return encoding.encode(text).length;
}


// Main token counting function
export async function countTokensOpenAI(
  model: AiModel,
  systemPrompt: string,
  messages: Message[],
  database: Database, // <-- Added this argument
  user: User, // <-- Added this argument
  countCompletion: boolean = false,
  transactionType: string,
  completionMessage?: string
) {
  const encoding = await initializeTiktoken();
  let tokens_per_message = model.id.includes('gpt-3.5') ? 5 : 4;

  let inputTokenCount = calculateTokens(encoding, systemPrompt);
  let outputTokenCount = 0;
  let completionTokenCount = 0;

  if (countCompletion && completionMessage) {
    completionTokenCount += calculateTokens(encoding, completionMessage) + tokens_per_message;
  }

  messages.forEach((message) => {
    const tokens = calculateTokens(encoding, message.content) + tokens_per_message;
    if (message.role === 'user') {
      inputTokenCount += tokens;
    } else if (message.role === 'assistant') {
      outputTokenCount += tokens;
    }
  });

  if (inputTokenCount + outputTokenCount > model.requestLimit) {
    encoding.free();
    return { error: 'Token limit exceeded' };
  }

  // Calculate the total token count
  const totalTokenCount = inputTokenCount + outputTokenCount;

  console.log('openai/getTokenCount.ts total token count', totalTokenCount);
  console.log('openai/getTokenCount.ts model', model.id);

  // Create a new TokenCountTransaction object
  const newTokenCountTransaction: TokenCountTransaction = {
    totalTokenCount,  // this is calculated in your existing code
    aimodel: model,  // 'model' is an existing parameter in your function
    transactionType: "testValue"  // this is an existing parameter in your function
    // ... populate other fields as necessary
  };

  console.log('getTokenCount.ts database', database);

  // Insert the new transaction into the database
  //storageCreateTokenCount(database, user, newTokenCountTransaction);

  return {
    inputCount: Math.ceil(inputTokenCount),
    outputCount: Math.ceil(outputTokenCount),
    completionCount: Math.ceil(completionTokenCount),
  };


}
