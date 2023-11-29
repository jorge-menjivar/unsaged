import { ANTHROPIC_API_KEY, DEBUG_MODE, OPENAI_API_KEY, PALM_API_KEY } from '@/utils/app/const';
import { printEnvVariables } from '@/utils/app/debug/env-vars';
import { getAvailableAnthropicModels } from '@/utils/server/ai_vendors/anthropic/models';
import { getAvailablePalm2Models } from '@/utils/server/ai_vendors/google/models';
import { getAvailableOllamaModels } from '@/utils/server/ai_vendors/ollama/models';
import { getAvailableOpenAIModels } from '@/utils/server/ai_vendors/openai/models';

import { AiModel } from '@/types/ai-models';

export const runtime = 'edge';

const handler = async (req: Request): Promise<Response> => {
  try {
    if (DEBUG_MODE) {
      console.log('----------SERVER-SIDE ENVIRONMENT VARIABLES----------');
      printEnvVariables();
    }

    const { openai_key = OPENAI_API_KEY, anthropic_key = ANTHROPIC_API_KEY, palm_key = PALM_API_KEY } = (await req.json()) as {
      openai_key: string;
      anthropic_key: string;
      palm_key: string;
    };

    const models: AiModel[] = [];

    if (openai_key && openai_key !== '') {
      const { error: openaiError, data: openaiModels } =
        await getAvailableOpenAIModels(openai_key);
      if (openaiError) {
        console.error('Error getting OpenAI models');
      } else {
        models.push(...(openaiModels as AiModel[]));
      }
    }

    if (anthropic_key && anthropic_key !== '') {
      const { data: anthropicModels } = await getAvailableAnthropicModels(anthropic_key);
      models.push(...(anthropicModels as AiModel[]));
    }

    if (palm_key && palm_key !== '') {
      const { data: palm2Models } = await getAvailablePalm2Models(palm_key);
      models.push(...(palm2Models as AiModel[]));
    }

    const { data: ollamaModels } = await getAvailableOllamaModels();
    models.push(...(ollamaModels as AiModel[]));

    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error getting available models', { status: 500 });
  }
};

export { handler as GET, handler as POST };
