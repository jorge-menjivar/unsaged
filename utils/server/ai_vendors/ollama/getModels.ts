import { OLLAMA_HOST } from '@/utils/app/const';

import { AiModel, PossibleAiModels } from '@/types/ai-models';

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
      },
    });

    if (response.status !== 200) {
      console.log('Error fetching Ollama models');
      return { data: [] };
    }

    const json = await response.json();

    const models: AiModel[] = json.models.map((ollamaModel: any) => {
      if (ollamaModel.name in PossibleAiModels) {
        return PossibleAiModels[ollamaModel.name];
      }
    });

    return { data: models };
  } catch (error) {
    console.error('Error fetching Ollama models ' + error);
    return { data: [] };
  }
}
