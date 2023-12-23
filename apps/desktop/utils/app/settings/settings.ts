import { AiModel } from '@/types/ai-models';
import { Settings, SystemSettings } from '@/types/settings';

export function getSettings(models?: AiModel[]) {
  const systemSettings = SystemSettings;

  const modelSettings = {} as Settings;
  if (models) {
    for (const model of models) {
      const settingId = `model.${model.id}.context_window_size`;
      modelSettings[settingId] = {
        name: 'Context Window Size for model ' + model.id,
        description:
          'The maximum number of tokens that this model can process.',
        type: 'number',
      };
    }
  }

  return {
    ...systemSettings,
    ...modelSettings,
  };
}
