import { AiModel } from '@/types/ai-models';
import { SavedSettings } from '@/types/settings';

import { storageGetSavedSettingValue } from '../storage/local/settings';
import { getAvailableAnthropicModels } from './anthropic/models';
import { getAvailableAzureModels } from './azure/models';
import { getAvailablePalm2Models } from './google/models';
import { getAvailableOllamaModels } from './ollama/models';
import { getAvailableOpenAIModels } from './openai/models';

export async function getModels(savedSettings: SavedSettings) {
  try {
    const models: AiModel[] = [];

    const openAiApiKey = storageGetSavedSettingValue(
      savedSettings,
      'openai.key',
    );

    if (openAiApiKey && openAiApiKey !== '') {
      const { error: openaiError, data: openaiModels } =
        await getAvailableOpenAIModels(savedSettings, openAiApiKey);
      if (openaiError) {
        console.error('Error getting OpenAI models');
      } else {
        models.push(...(openaiModels as AiModel[]));
      }
    }

    const azureUrl = storageGetSavedSettingValue(savedSettings, 'azure.url');
    const azureApiKey = storageGetSavedSettingValue(savedSettings, 'azure.key');
    if (azureUrl && azureUrl !== '' && azureApiKey && azureApiKey !== '') {
      const { error: azureError, data: azureModels } =
        await getAvailableAzureModels(savedSettings, azureUrl, azureApiKey);
      if (azureError) {
        console.error('Error getting Azure models');
      } else {
        models.push(...(azureModels as AiModel[]));
      }
    }

    const anthropicApiKey = storageGetSavedSettingValue(
      savedSettings,
      'anthropic.key',
    );

    if (anthropicApiKey && anthropicApiKey !== '') {
      const { data: anthropicModels } = await getAvailableAnthropicModels(
        savedSettings,
        anthropicApiKey,
      );
      models.push(...(anthropicModels as AiModel[]));
    }

    const palmApiKey = storageGetSavedSettingValue(savedSettings, 'google.key');

    if (palmApiKey && palmApiKey !== '') {
      const { data: palm2Models } = await getAvailablePalm2Models(
        savedSettings,
        palmApiKey,
      );
      models.push(...(palm2Models as AiModel[]));
    }

    try {
      const { data: ollamaModels } = await getAvailableOllamaModels(
        savedSettings,
      );

      models.push(...(ollamaModels as AiModel[]));
    } catch (error) {
      console.error(error);
    }

    return models;
  } catch (error) {
    console.error(error);
    return [];
  }
}
