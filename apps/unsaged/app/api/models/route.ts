import {
  ANTHROPIC_API_KEY,
  AZURE_OPENAI_API_KEY,
  DEBUG_MODE,
  OPENAI_API_KEY,
  PALM_API_KEY,
  REPLICATE_API_TOKEN
} from '@/utils/app/const';
import { printEnvVariables } from '@/utils/app/debug/env-vars';
import { AiModel } from '@/types/ai-models';

import { getAvailableAnthropicModels } from '@/utils/server/ai_vendors/anthropic/models';
import { getAvailablePalm2Models } from '@/utils/server/ai_vendors/google/models';
import { getAvailableOllamaModels } from '@/utils/server/ai_vendors/ollama/models';
import { getAvailableOpenAIModels } from '@/utils/server/ai_vendors/openai/models';
import { getAvailableReplicateModels } from '@/utils/server/ai_vendors/replicate/models';
import { getAvailableAzureModels } from '@/utils/server/ai_vendors/azure/models';

export const runtime = 'edge';

const handler = async (req: Request): Promise<Response> => {
  try {
    if (DEBUG_MODE) {
      console.log('----------SERVER-SIDE ENVIRONMENT VARIABLES----------');
      printEnvVariables();
    }

    const { openai_key = OPENAI_API_KEY, azure_key = AZURE_OPENAI_API_KEY, anthropic_key = ANTHROPIC_API_KEY, replicate_key = REPLICATE_API_TOKEN, palm_key = PALM_API_KEY } = (await req.json()) as {
      openai_key: string;
      azure_key: string;
      anthropic_key: string;
      replicate_key: string;
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

    if (azure_key && azure_key !== '') {
      const { error: azureError, data: azureModels } =
        await getAvailableAzureModels(azure_key);
      if (azureError) {
        console.error('Error getting Azure models');
      } else {
        models.push(...(azureModels as AiModel[]));
      }
    }

    if (anthropic_key && anthropic_key !== '') {
      const { data: anthropicModels } = await getAvailableAnthropicModels(anthropic_key);
      models.push(...(anthropicModels as AiModel[]));
    }

    if (replicate_key && replicate_key !== '') {
      const { error: replicateError, data: replicateModels } =
        await getAvailableReplicateModels(replicate_key);
      if (replicateError) {
        console.error('Error getting Replicate models');
      } else {
        models.push(...(replicateModels as AiModel[]));
      }
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
