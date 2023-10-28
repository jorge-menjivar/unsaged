import { DEBUG_MODE } from '@/utils/app/const';
import { printEnvVariables } from '@/utils/app/debug/env-vars';
import { getAvailableAnthropicModels } from '@/utils/server/ai_vendors/anthropic/getModels';
import { getAvailablePalm2Models } from '@/utils/server/ai_vendors/google/getModels';
import { getAvailableOllamaModels } from '@/utils/server/ai_vendors/ollama/getModels';
import { getAvailableOpenAIModels } from '@/utils/server/ai_vendors/openai/getModels';

import { AiModel } from '@/types/ai-models';

export const runtime = 'edge';

const handler = async (req: Request): Promise<Response> => {
  try {
    if (DEBUG_MODE) {
      console.log('----------SERVER-SIDE ENVIRONMENT VARIABLES----------');
      printEnvVariables();
    }

    const { openai_key, anthropic_key, palm_key } = (await req.json()) as {
      openai_key: string;
      anthropic_key: string;
      palm_key: string;
    };

    const models: AiModel[] = [];
    const { error: openaiError, data: openaiModels } =
      await getAvailableOpenAIModels(openai_key);
    if (openaiError) {
      console.error('Error getting OpenAI models');
    } else {
      models.push(...(openaiModels as AiModel[]));
    }

    const { data: anthropicModels } = await getAvailableAnthropicModels(
      anthropic_key,
    );
    models.push(...(anthropicModels as AiModel[]));

    const { data: palm2Models } = await getAvailablePalm2Models(palm_key);
    models.push(...(palm2Models as AiModel[]));

    const { data: ollamaModels } = await getAvailableOllamaModels();
    models.push(...(ollamaModels as AiModel[]));

    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error getting available models', { status: 500 });
  }
};

export { handler as GET, handler as POST };
