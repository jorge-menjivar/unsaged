import {
  DEBUG_MODE,
  OLLAMA_BASIC_PWD,
  OLLAMA_BASIC_USER,
  OLLAMA_HOST,
} from '@/utils/app/const';
import { debug } from '@/utils/logging';

import {
  GetAvailableModelsResponse,
  PossibleAiModels,
} from '@/types/ai-models';
import { SavedSettings } from '@/types/settings';

import { invoke } from '@tauri-apps/api/tauri';

export const config = {
  runtime: 'edge',
};

export async function getAvailableOllamaModels(
  savedSettings: SavedSettings,
): Promise<GetAvailableModelsResponse> {
  try {
    const payload = {
      saved_settings: savedSettings,
    };

    const raw_models = (await invoke('get_ollama_models', payload)) as any[];

    debug('Ollama models:', raw_models);

    const models = raw_models.map((ollamaModel: any) => {
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
