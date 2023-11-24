import { AiModel } from '@/types/ai-models';
import { SavedSettings } from '@/types/settings';

import { getAvailableAnthropicModels } from './anthropic/models';
import { getAvailablePalm2Models } from './google/models';
import { getAvailableOllamaModels } from './ollama/models';
import { getAvailableOpenAIModels } from './openai/models';

export async function getModels(
  savedSettings: SavedSettings,
  openai_key?: string,
  anthropic_key?: string,
  palm_key?: string,
) {
  try {
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

    if (anthropic_key && anthropic_key !== '') {
      const { data: anthropicModels } = await getAvailableAnthropicModels(
        anthropic_key,
      );
      models.push(...(anthropicModels as AiModel[]));
    }

    if (palm_key && palm_key !== '') {
      const { data: palm2Models } = await getAvailablePalm2Models(palm_key);
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
