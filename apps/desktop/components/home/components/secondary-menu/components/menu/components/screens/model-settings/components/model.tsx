import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_MODEL } from '@/utils/app/const';
import { debug } from '@/utils/logging';

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
      const parsedModelNameA =
        (a.name ? `${a.name} - ` : '') + `${a.id} - ${a.vendor}`;

      const parsedModelNameB =
        (b.name ? `${b.name} - ` : '') + `${b.id} - ${b.vendor}`;

      if (parsedModelNameA < parsedModelNameB) return -1;
      if (parsedModelNameA > parsedModelNameB) return 1;

      return 0;
    });

    setSortedModels(_sorted);
  }, [models]);

  const handleChange = (value: string) => {
    debug('Model select value', value);

    const splits = value.split('%');

    const model_name = splits[0];
    const model_id = splits[1];
    const model_vendor = splits[2];
    debug('name', model_name);

    const selectedModel = models.find((m) => {
      if (m.id === model_id && m.vendor === model_vendor) {
        if (model_name !== '') {
          return m.name === model_name;
        } else {
          return true;
        }
      }

      return false;
    });

    debug('Selected model', selectedModel);

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
        value={
          (selectedConversation?.model?.name || '') +
            '%' +
            selectedConversation?.model?.id +
            '%' +
            selectedConversation?.model?.vendor || DEFAULT_MODEL
        }
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {sortedModels.map((model) => (
            <SelectItem
              key={(model.name || '') + '%' + model.id + '%' + model.vendor}
              value={(model.name || '') + '%' + model.id + '%' + model.vendor}
            >
              {model.name && `${model.name} - `} {model.id} - {model.vendor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
