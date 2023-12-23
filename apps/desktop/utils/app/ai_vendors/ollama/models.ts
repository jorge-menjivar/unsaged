import { debug } from '@/utils/logging';

import { AiModel, GetAvailableModelsResponse } from '@/types/ai-models';
import { DefaultValues, SavedSettings } from '@/types/settings';

import { storageGetSavedSettingValue } from '../../storage/local/settings';

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
      const model_id = ollamaModel.name;

      let model: AiModel = {
        id: model_id,
        tokenLimit:
          storageGetSavedSettingValue(
            savedSettings,
            DefaultValues[`model.${model_id}.context_window_size`],
          ) || 4096,
        vendor: 'Ollama',
      };

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
