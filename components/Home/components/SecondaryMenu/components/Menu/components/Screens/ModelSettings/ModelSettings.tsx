import { useTranslation } from 'react-i18next';

import { ModelSelect } from './components/ModelSelect';
import { SystemPromptSelect } from './components/SystemPromptSelect';
import { TemperatureSlider } from './components/Temperature';
import { PrimaryLabel } from '@/components/Common/Labels/PrimaryLabel';

export const ModelSettings = () => {
  const { t } = useTranslation('modelSettings');

  return (
    <div className="pt-2 px-1 space-y-1">
      <PrimaryLabel tip={t('The model used for this conversation')}>
        {t('Model')}
      </PrimaryLabel>
      <ModelSelect />

      <PrimaryLabel tip={t('The system prompt to use when sending a message')}>
        {t('System Prompt')}
      </PrimaryLabel>
      <SystemPromptSelect />

      <PrimaryLabel
        tip={t(
          'Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.',
        )}
      >
        {t('Temperature')}
      </PrimaryLabel>
      <TemperatureSlider />
    </div>
  );
};
