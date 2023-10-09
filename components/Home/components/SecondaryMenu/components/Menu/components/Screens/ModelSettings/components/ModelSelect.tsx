import { useContext } from 'react';

import { AiModel, PossibleAiModels } from '@/types/ai-models';

import HomeContext from '@/components/Home/home.context';

export const ModelSelect = () => {
  const {
    state: { selectedConversation, models, defaultModelId },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model_id = e.target.value as string;
    const model: AiModel = PossibleAiModels[model_id];
    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: model,
      });
  };

  return (
    <div
      className="
      w-full rounded-sm 
      bg-transparent text-white
      bg-gradient-to-r from-neutral-900 to-neutral-500
      dark:from-neutral-900 dark:to-neutral-500
      bg-175% animate-bg-pan-slow appearance-none dark:bg-gray-700 hover:opacity-90
      "
    >
      <select
        className="text-left w-full bg-transparent p-1 text-sm"
        value={selectedConversation?.model?.id || defaultModelId}
        onChange={handleChange}
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
            className="bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark text-black dark:text-white"
          >
            {model.id}
          </option>
        ))}
      </select>
    </div>
  );
};
