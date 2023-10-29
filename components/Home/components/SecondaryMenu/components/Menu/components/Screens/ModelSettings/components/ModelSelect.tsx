import { useContext, useEffect, useState } from 'react';

import { AiModel } from '@/types/ai-models';

import HomeContext from '@/components/Home/home.context';

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model_id = e.target.value as string;

    const selectedModel = models.find((m) => m.id === model_id);

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: selectedModel,
      });
  };

  return (
    <div
      className="
      w-full rounded-sm 
      bg-transparent text-white
      bg-gradient-to-r from-fuchsia-600 via-violet-900 to-indigo-500
      dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
      bg-175% animate-bg-pan-slow appearance-none dark:bg-gray-700 hover:opacity-90
      "
    >
      <select
        className="text-left w-full bg-transparent p-1 text-sm"
        value={selectedConversation?.model?.id || defaultModelId}
        onChange={handleChange}
      >
        {sortedModels.map((model) => (
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
