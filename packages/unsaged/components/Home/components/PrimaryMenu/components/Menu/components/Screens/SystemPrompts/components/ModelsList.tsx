import { useContext } from 'react';

import HomeContext from '@/components/Home/home.context';
import { Chip } from '@/components/common/Chips/Chip';

// Return a list of models as chips without any scrolling
export const ChipList = ({
  selectedModels,
  handleSelectModel,
}: {
  selectedModels: string[];
  handleSelectModel: any;
}) => {
  const {
    state: { models },
  } = useContext(HomeContext);

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
