import {
  DEBUG_MODE,
  OLLAMA_BASIC_PWD,
  OLLAMA_BASIC_USER,
  OLLAMA_HOST,
} from '@/utils/app/const';

import {
  GetAvailableModelsResponse,
  PossibleAiModels,
} from '@/types/ai-models';
import { SavedSettings } from '@/types/settings';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOllamaModels(
  savedSettings: SavedSettings,
): Promise<GetAvailableModelsResponse> {
  try {
    let base_url = OLLAMA_HOST;
    if (savedSettings['ollama.url']) {
      base_url = savedSettings['ollama.url'];
    }
    if (base_url == '') {
      return { data: [] };
    }
    const url = `${base_url}/api/tags`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(OLLAMA_BASIC_USER &&
          OLLAMA_BASIC_PWD && {
            Authorization: `Basic ${Buffer.from(
              OLLAMA_BASIC_USER + ':' + OLLAMA_BASIC_PWD,
            ).toString('base64')}`,
          }),
      },
    });

    if (response.status !== 200) {
      const error = await response.text();
      console.error('Error fetching Ollama models', response.status, error);
      return { data: [] };
    }

    const json = await response.json();

    const models = json.models.map((ollamaModel: any) => {
      const model_name = ollamaModel.name;

      if (!PossibleAiModels[model_name]) {
        if (DEBUG_MODE)
          console.warn('Ollama model not implemented:', model_name);

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
