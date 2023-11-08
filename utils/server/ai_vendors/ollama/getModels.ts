import { OLLAMA_HOST, OLLAMA_BASIC_USER, OLLAMA_BASIC_PWD } from '@/utils/app/const';

import { PossibleAiModels } from '@/types/ai-models';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOllamaModels() {
  if (OLLAMA_HOST == '') {
    return { data: [] };
  }

  try {
    const url = `${OLLAMA_HOST}/api/tags`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...((OLLAMA_BASIC_USER && OLLAMA_BASIC_PWD) && {
          Authorization: `Basic ${Buffer.from(OLLAMA_BASIC_USER + ":" + OLLAMA_BASIC_PWD).toString('base64')}`,
        }),
      },
    });

    if (response.status !== 200) {
      const error = await response.text();
      console.error('Error fetching OpenAI models', response.status, error);
      return { data: [] };
    }

    const json = await response.json();

    const models = json.models.map((ollamaModel: any) => {
      const model_name = ollamaModel.name;

      if (!PossibleAiModels[model_name]) {
        console.warn('Ollama model not implemented in unSAGED:', model_name);
        return null;
      }

      const model = PossibleAiModels[model_name];

      return model;
    });

    // Drop null values
    const modelsWithoutNull = models.filter(Boolean);

    return { data: modelsWithoutNull };
  } catch (error) {
    console.error('Error fetching Ollama models ' + error);
    return { data: [] };
  }
}
