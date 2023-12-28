import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SystemPrompt } from '@/types/system-prompt';

import { PrimaryLabel } from '@/components/common/ui/primary-label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';

import { useConversations } from '@/providers/conversations';
import { useSystemPrompts } from '@/providers/system-prompts';

export const SystemPromptSelect = () => {
  const { systemPrompts, builtInSystemPrompts } = useSystemPrompts();

  const { selectedConversation, updateConversation } = useConversations();

  const [availableSystemPrompts, setAvailableSystemPrompts] = useState<
    SystemPrompt[]
  >([]);
  const [defaultSystemPromptId, setDefaultSystemPromptId] = useState<
    string | null
  >(null);
  const [currentSystemPromptId, setCurrentSystemPromptId] = useState<
    string | null
  >(selectedConversation!.model?.vendor || null);

  useEffect(() => {
    if (selectedConversation && selectedConversation.systemPrompt) {
      setCurrentSystemPromptId(selectedConversation.systemPrompt.id);
    } else {
      setCurrentSystemPromptId(defaultSystemPromptId!);
    }
  }, [selectedConversation, defaultSystemPromptId]);

  const getDefaultSystemPrompt = useCallback(() => {
    if (
      !selectedConversation ||
      !selectedConversation.model ||
      !selectedConversation.model.id
    ) {
      return;
    }

    let systemPromptId = null;

    if (!systemPromptId && builtInSystemPrompts.length > 0) {
      systemPromptId = builtInSystemPrompts.filter(
        (prompt) =>
          prompt.name === `${selectedConversation.model!.vendor} Built-In`,
      )[0].id;
    }

    setDefaultSystemPromptId(systemPromptId);
  }, [selectedConversation, builtInSystemPrompts]);

  useEffect(() => {
    getDefaultSystemPrompt();
  }, [availableSystemPrompts, getDefaultSystemPrompt, builtInSystemPrompts]);

  const getAvailableSystemPrompts = useCallback(() => {
    const model = selectedConversation!.model;

    if (!model) {
      return;
    }

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
      updateConversation(selectedConversation, {
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
