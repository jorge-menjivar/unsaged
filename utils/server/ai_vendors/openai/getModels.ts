import {
  OPENAI_API_TYPE,
  OPENAI_API_URL,
  OPENAI_API_VERSION,
  OPENAI_ORGANIZATION,
} from '@/utils/app/const';

import { AiModel, PossibleAiModels } from '@/types/ai-models';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOpenAIModels(key?: string) {
  let url = `${OPENAI_API_URL}/models`;
  if (OPENAI_API_TYPE === 'azure') {
    url = `${OPENAI_API_URL}/openai/deployments?api-version=${OPENAI_API_VERSION}`;
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(OPENAI_API_TYPE === 'openai' && {
        Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`,
      }),
      ...(OPENAI_API_TYPE === 'azure' && {
        'api-key': `${key ? key : process.env.OPENAI_API_KEY}`,
      }),
      ...(OPENAI_API_TYPE === 'openai' &&
        OPENAI_ORGANIZATION && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
    },
  });

  if (response.status !== 200) {
    return { error: response.status, data: response.body };
  }

  const json = await response.json();

  const models: AiModel[] = json.data
    .map((openaiModel: any) => {
      const model_name =
        OPENAI_API_TYPE === 'azure' ? openaiModel.model : openaiModel.id;

      return PossibleAiModels[model_name];
    })
    .filter(Boolean);

  return { data: models };
}
