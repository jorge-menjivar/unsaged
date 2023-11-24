import { DEBUG_MODE,OPENAI_ENABLED,ANTHROPIC_ENABLED, GOOGLE_ENABLED, OLLAMA_ENABLED } from '@/utils/app/const';
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
      // printEnvVariables();
    }

    const { openai_key, anthropic_key, palm_key } = (await req.json()) as {
      openai_key: string;
      anthropic_key: string;
      palm_key: string;
    };

    const models: AiModel[] = [];

   // Check if OpenAI provider is enabled
if (OPENAI_ENABLED === 'true') {
  const response = await getAvailableOpenAIModels(openai_key);
  let openaiModels;

  if (response) {
    // If response is not null, destructure the data.
    openaiModels = response.data;
    models.push(...(openaiModels as AiModel[]));
  } else {
    // Handle the null case appropriately.
    openaiModels = null; // or set it to a default value like [] if that makes sense for your application.
  }
}


// Check if Anthropic provider is enabled
if (ANTHROPIC_ENABLED === 'true') {
  const { data: anthropicModels } = await getAvailableAnthropicModels(anthropic_key);
  if (anthropicModels && anthropicModels.length > 0) { // Check if there are any models
    models.push(...(anthropicModels as AiModel[]));
  }
}

// Check if Google (Palm2) provider is enabled
if (GOOGLE_ENABLED === 'true') {
  const { data: palm2Models } = await getAvailablePalm2Models(palm_key);
  if (palm2Models && palm2Models.length > 0) { // Check if there are any models
    models.push(...(palm2Models as AiModel[]));
  }
}

// Check if Ollama provider is enabled
if (OLLAMA_ENABLED === 'true') {
  const { data: ollamaModels } = await getAvailableOllamaModels();
  if (ollamaModels && ollamaModels.length > 0) { // Check if there are any models
    models.push(...(ollamaModels as AiModel[]));
  }
}


    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.log('⭐⭐⭐⭐⭐⭐');
    console.error(error);
    const defaultResponse = { models: [] };
    return new Response(JSON.stringify(defaultResponse), { status: 500 });
  }
};

export { handler as GET, handler as POST };
