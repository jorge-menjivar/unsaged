import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_MODEL } from '@/utils/app/const';

import { AiModel } from '@/types/ai-models';

import { PrimaryLabel } from '@/components/common/ui/primary-label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';

import { useConversations } from '@/providers/conversations';
import { useModels } from '@/providers/models';

export const ModelSelect = () => {
  const { models } = useModels();
  const { selectedConversation, updateConversation } = useConversations();

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
      updateConversation(selectedConversation, {
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
        value={selectedConversation?.model?.id || DEFAULT_MODEL}
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
