import { useCallback, useContext, useEffect, useState } from 'react';

import { PossibleAiModels } from '@/types/ai-models';
import { SystemPrompt } from '@/types/system-prompt';

import HomeContext from '@/components/Home/home.context';

export const SystemPromptSelect = () => {
  const {
    state: { selectedConversation, systemPrompts, builtInSystemPrompts },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const [availableSystemPrompts, setAvailableSystemPrompts] = useState<
    SystemPrompt[]
  >([]);
  const [defaultSystemPromptId, setDefaultSystemPromptId] = useState<
    string | null
  >(null);
  const [currentSystemPromptId, setCurrentSystemPromptId] = useState<string>(
    selectedConversation!.model?.vendor,
  );

  useEffect(() => {
    if (selectedConversation && selectedConversation.systemPrompt) {
      setCurrentSystemPromptId(selectedConversation.systemPrompt.id);
    } else {
      setCurrentSystemPromptId(defaultSystemPromptId!);
    }
  }, [selectedConversation, defaultSystemPromptId]);

  const getDefaultSystemPrompt = useCallback(() => {
    let model = selectedConversation!.model;

    if (!model || model.vendor === undefined) {
      selectedConversation!.model = PossibleAiModels['gpt-3.5-turbo'];
      model = selectedConversation!.model;
    }

    // const sectionId = model.vendor.toLocaleLowerCase();
    // const settingId = `${model.id}_default_system_prompt`;

    // let systemPromptId = getSavedSettingValue(
    //   savedSettings,
    //   sectionId,
    //   settingId,
    //   settings,
    // );

    let systemPromptId = null;

    if (!systemPromptId && builtInSystemPrompts.length > 0) {
      systemPromptId = builtInSystemPrompts.filter(
        (prompt) => prompt.name === `${model?.vendor} Built-In`,
      )[0].id;
    }

    setDefaultSystemPromptId(systemPromptId);
  }, [selectedConversation, builtInSystemPrompts]);

  useEffect(() => {
    getDefaultSystemPrompt();
  }, [availableSystemPrompts, getDefaultSystemPrompt, builtInSystemPrompts]);

  const getAvailableSystemPrompts = useCallback(() => {
    const model = selectedConversation!.model;

    const availablePrompts = systemPrompts.filter((prompt) =>
      prompt.models.includes(model.id),
    );

    const defaultSystemPrompt = builtInSystemPrompts.filter(
      (prompt) => prompt.name === `${model?.vendor} Built-In`,
    )[0];

    if (defaultSystemPrompt) {
      availablePrompts.push(defaultSystemPrompt);
    }

    setAvailableSystemPrompts(availablePrompts);
  }, [selectedConversation, systemPrompts, builtInSystemPrompts]);

  useEffect(() => {
    if (systemPrompts) {
      getAvailableSystemPrompts();
    }
  }, [
    selectedConversation,
    systemPrompts,
    getAvailableSystemPrompts,
    builtInSystemPrompts,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const systemPrompt =
      systemPrompts.filter((prompt) => prompt.id === e.target.value)[0] || null;

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'systemPrompt',
        value: systemPrompt,
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
        value={currentSystemPromptId || ''}
        onChange={handleChange}
      >
        {availableSystemPrompts.map((prompt) => (
          <option
            key={prompt.id}
            value={prompt.id}
            className="bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark text-black dark:text-white"
          >
            {prompt.id === defaultSystemPromptId
              ? `Default (${prompt.name})`
              : prompt.name}
          </option>
        ))}
      </select>
    </div>
  );
};
