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

  return (
    <div className="flex flex-wrap space-x-2">
      {models.map((model) => (
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
