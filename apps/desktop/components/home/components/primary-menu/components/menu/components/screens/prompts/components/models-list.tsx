import { useEffect, useState } from 'react';

import { AiModel } from '@/types/ai-models';

import { Chip } from '@/components/common/ui/chip';

import { useModels } from '@/providers/models';

// Return a list of models as chips without any scrolling
export const ChipList = ({
  selectedModels,
  handleSelectModel,
}: {
  selectedModels: string[];
  handleSelectModel: any;
}) => {
  const { models } = useModels();

  const [uniqueModels, setUniqueModels] = useState<AiModel[]>([]);

  useEffect(() => {
    const unique = models.filter(
      (model, index, self) =>
        index === self.findIndex((m) => m.id === model.id),
    );
    setUniqueModels(unique);
  }, [models]);

  return (
    <div className="flex flex-wrap space-x-2">
      {uniqueModels.map((model) => (
        <Chip
          key={model.id}
          id={model.id}
          handleSelect={handleSelectModel}
          isSelected={selectedModels.includes(model.id)}
        >
          {model.id}
        </Chip>
      ))}
    </div>
  );
};
