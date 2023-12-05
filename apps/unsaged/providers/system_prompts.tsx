import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
  DEFAULT_OLLAMA_SYSTEM_PROMPT,
  DEFAULT_OPENAI_SYSTEM_PROMPT,
  DEFAULT_PALM_SYSTEM_PROMPT,
} from '@/utils/app/const';
import { storageUpdateConversations } from '@/utils/app/storage/conversations';
import {
  storageCreateSystemPrompt,
  storageDeleteSystemPrompt,
  storageUpdateSystemPrompt,
} from '@/utils/app/storage/systemPrompt';
import { storageGetSystemPrompts } from '@/utils/app/storage/systemPrompts';
import { error } from '@/utils/logging';

import { AiModel } from '@/types/ai-models';
import { SystemPrompt } from '@/types/system-prompt';

import { useAuth } from './auth';
import { useConversations } from './conversations';
import { useDatabase } from './database';
import { useModels } from './models';
import { useSettings } from './settings';

import { v4 as uuidv4 } from 'uuid';

export const SystemPromptContext = createContext<{
  systemPrompts: SystemPrompt[];
  setSystemPrompts: (systemPrompts: SystemPrompt[]) => void;
  builtInSystemPrompts: SystemPrompt[];
  createSystemPrompt: () => void;
  updateSystemPrompt: (systemPrompt: SystemPrompt) => void;
  deleteSystemPrompt: (systemPromptId: string) => void;
}>({
  systemPrompts: [],
  setSystemPrompts: () => {},
  builtInSystemPrompts: [],
  createSystemPrompt: () => {},
  updateSystemPrompt: () => {},
  deleteSystemPrompt: () => {},
});

export const SystemPromptsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { t } = useTranslation('systemPrompts');
  const isInitialized = useRef(false);

  const { session } = useAuth();
  const { database } = useDatabase();
  const { settings } = useSettings();
  const { models } = useModels();
  const { conversations, selectedConversation, setSelectedConversation } =
    useConversations();

  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [builtInSystemPrompts, setBuiltInSystemPrompts] = useState<
    SystemPrompt[]
  >([]);

  const fetchSystemPrompts = useCallback(async () => {
    if (isInitialized.current || !database || !session || !settings) {
      return;
    }

    isInitialized.current = true;

    const _systemPrompts = await storageGetSystemPrompts(
      database,
      session.user!,
    );

    setSystemPrompts(_systemPrompts);
  }, [database, session, settings]);

  useEffect(() => {
    fetchSystemPrompts();
  }, [fetchSystemPrompts]);

  const generateBuiltInSystemPrompts = useCallback(() => {
    const vendors: AiModel['vendor'][] = [
      'Anthropic',
      'OpenAI',
      'Google',
      'Ollama',
    ];

    const newSystemPrompts: SystemPrompt[] = [];
    for (const vendor of vendors) {
      let systemPrompt: SystemPrompt;
      const systemPromptId = uuidv4();
      if (vendor === 'Anthropic') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
          folderId: null,
          models: models
            .filter((m) => m.vendor === 'Anthropic')
            .map((m) => m.id),
        };
        newSystemPrompts.push(systemPrompt);
      } else if (vendor === 'OpenAI') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_OPENAI_SYSTEM_PROMPT,
          folderId: null,
          models: models.filter((m) => m.vendor === 'OpenAI').map((m) => m.id),
        };
        newSystemPrompts.push(systemPrompt);
      } else if (vendor === 'Google') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_PALM_SYSTEM_PROMPT,
          folderId: null,
          models: models.filter((m) => m.vendor === 'Google').map((m) => m.id),
        };
        newSystemPrompts.push(systemPrompt);
      } else if (vendor === 'Ollama') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_OLLAMA_SYSTEM_PROMPT,
          folderId: null,
          models: models.filter((m) => m.vendor === 'Ollama').map((m) => m.id),
        };

        newSystemPrompts.push(systemPrompt);
      }
    }

    setBuiltInSystemPrompts(newSystemPrompts);
  }, [models]);

  useEffect(() => {
    if (builtInSystemPrompts.length === 0) {
      generateBuiltInSystemPrompts();
    }
  }, [builtInSystemPrompts, generateBuiltInSystemPrompts]);

  const createSystemPrompt = async () => {
    const newSystemPrompt: SystemPrompt = {
      id: uuidv4(),
      name: `${t('New System Prompt')}`,
      content: '',
      folderId: null,
      models: [],
    };

    const updatedSystemPrompts = storageCreateSystemPrompt(
      database!,
      session!.user!,
      newSystemPrompt,
      systemPrompts,
    );

    setSystemPrompts(updatedSystemPrompts);
  };

  const updateSystemPrompt = (updatedSystemPrompt: SystemPrompt) => {
    let update: {
      single: SystemPrompt;
      all: SystemPrompt[];
    };

    update = storageUpdateSystemPrompt(
      database!,
      session!.user!,
      updatedSystemPrompt,
      systemPrompts,
    );

    setSystemPrompts(update.all);
  };

  const deleteSystemPrompt = (systemPromptId: string) => {
    const updatedSystemPrompts = systemPrompts.filter(
      (s) => s.id !== systemPromptId,
    );

    storageDeleteSystemPrompt(
      database!,
      session!.user!,
      systemPromptId,
      systemPrompts,
    );

    setSystemPrompts(updatedSystemPrompts);

    const updatedConversations = [];
    for (const conversation of conversations) {
      if (conversation.systemPrompt?.id === systemPromptId) {
        const updatedConversation = {
          ...conversation,
          systemPrompt: null,
        };
        updatedConversations.push(updatedConversation);
      } else {
        updatedConversations.push(conversation);
      }
    }

    if (selectedConversation?.systemPrompt?.id === systemPromptId) {
      const updatedSelectedConversation = {
        ...selectedConversation,
        systemPrompt: null,
      };
      setSelectedConversation(updatedSelectedConversation);
    }

    storageUpdateConversations(database!, session!.user!, updatedConversations);
  };

  const contextValue = {
    systemPrompts,
    setSystemPrompts,
    builtInSystemPrompts,
    createSystemPrompt,
    updateSystemPrompt,
    deleteSystemPrompt,
  };

  return (
    <SystemPromptContext.Provider value={contextValue}>
      {children}
    </SystemPromptContext.Provider>
  );
};

export const useSystemPrompts = () => {
  const context = useContext(SystemPromptContext);
  if (!context) {
    error('useConversations must be used within a ConversationsProvider');
  }
  return context;
};
