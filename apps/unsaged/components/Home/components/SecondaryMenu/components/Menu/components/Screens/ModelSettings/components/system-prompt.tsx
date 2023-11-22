import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PossibleAiModels } from '@/types/ai-models';
import { SystemPrompt } from '@/types/system-prompt';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';

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

  const handleChange = (value: string) => {
    const systemPrompt =
      systemPrompts.filter((prompt) => prompt.id === value)[0] || null;

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'systemPrompt',
        value: systemPrompt,
      });
  };

  const { t } = useTranslation('modelSettings');
  return (
    <div className="flex flex-col mt-4">
      <PrimaryLabel tip={t('The system prompt to use when sending a message')}>
        {t('System Prompt')}
      </PrimaryLabel>
      <Select value={currentSystemPromptId || ''} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableSystemPrompts.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.id === defaultSystemPromptId
                ? `Default (${prompt.name})`
                : prompt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
