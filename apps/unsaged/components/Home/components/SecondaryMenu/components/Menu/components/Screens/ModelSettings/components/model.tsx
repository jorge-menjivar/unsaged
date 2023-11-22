import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AiModel } from '@/types/ai-models';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';

export const ModelSelect = () => {
  const {
    state: { selectedConversation, models, defaultModelId },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const [sortedModels, setSortedModels] = useState<AiModel[]>(models);

  useEffect(() => {
    const _sorted = models.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;

      return 0;
    });

    setSortedModels(_sorted);
  }, [models]);

  const handleChange = (value: string) => {
    const model_id = value;

    const selectedModel = models.find((m) => m.id === model_id);

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: selectedModel,
      });
  };
  const { t } = useTranslation('modelSettings');

  return (
    <div className="flex flex-col mt-4">
      <PrimaryLabel tip={t('The model used for this conversation')}>
        {t('Model')}
      </PrimaryLabel>

      <Select
        value={selectedConversation?.model?.id || defaultModelId}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {sortedModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.id} - {model.vendor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
