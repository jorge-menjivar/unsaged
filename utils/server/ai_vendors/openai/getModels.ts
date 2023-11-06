import {
  OPENAI_API_KEY,
  OPENAI_API_TYPE,
  OPENAI_API_URL,
  OPENAI_ORGANIZATION,
} from '@/utils/app/const';

import { AiModel, PossibleAiModels } from '@/types/ai-models';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(key?: string) {
  let url = `${OPENAI_API_URL}/models`;
  if (OPENAI_API_TYPE === 'azure') {
    // The endpoint to get models might have been removed from the Azure API after the 2023-05-15 version
    url = `${OPENAI_API_URL}/openai/deployments?api-version=2023-03-15-preview`;
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(OPENAI_API_TYPE === 'openai' && {
        Authorization: `Bearer ${key ? key : OPENAI_API_KEY}`,
      }),
      ...(OPENAI_API_TYPE === 'azure' && {
        'api-key': `${key ? key : OPENAI_API_KEY}`,
      }),
      ...(OPENAI_API_TYPE === 'openai' &&
        OPENAI_ORGANIZATION && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
    },
  });

  if (response.status !== 200) {
    console.error('Error getting models', response.status, response.body);
    return { error: response.status, data: response.body };
  }

  const json = await response.json();

  const models: (AiModel | null)[] = json.data
    .map((openaiModel: any) => {
      const model_name =
        OPENAI_API_TYPE === 'azure' ? openaiModel.model : openaiModel.id;

      if (!PossibleAiModels[model_name]) {
        console.warn('OpenAI model not implemented in unSAGED:', model_name);
        return null;
      }

      const model = PossibleAiModels[model_name];

      if (OPENAI_API_TYPE === 'azure') {
        model.id = openaiModel.id;
      }

      return model;
    })
    .filter(Boolean);

  // Drop null values
  const modelsWithoutNull = models.filter(Boolean);

  return { data: modelsWithoutNull };
}
