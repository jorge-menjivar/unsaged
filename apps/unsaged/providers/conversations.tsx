import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cleanConversationHistory } from '@/utils/app/clean';
import { DEFAULT_MODEL } from '@/utils/app/const';
import { importData } from '@/utils/app/import-export/import';
import { getModelDefaults } from '@/utils/app/settings/model-defaults';
import {
  storageCreateConversation,
  storageDeleteConversation,
  storageUpdateConversation,
} from '@/utils/app/storage/conversation';
import {
  storageDeleteConversations,
  storageGetConversations,
} from '@/utils/app/storage/conversations';
import {
  deleteSelectedConversationId,
  getSelectedConversationId,
  saveSelectedConversationId,
} from '@/utils/app/storage/local/selected-conversation';
import { error } from '@/utils/logging';

import { PossibleAiModels } from '@/types/ai-models';
import { Conversation } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { LatestExportFormat, SupportedExportFormats } from '@/types/export';
import { SystemPrompt } from '@/types/system-prompt';

import { useAuth } from './auth';
import { useDatabase } from './database';
import { useDisplay } from './display';
import { useModels } from './models';
import { useSettings } from './settings';
import { useSystemPrompts } from './system_prompts';

import { v4 as uuidv4 } from 'uuid';

export const ConversationsContext = createContext<{
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation) => void;
  updateConversationParams: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  updateConversation: (conversation: Conversation, data: KeyValuePair) => void;
  newConversation: () => void;
  selectConversation: (conversation: Conversation) => void;
  clearConversations: () => void;
  deleteConversation: (conversation: Conversation) => void;
}>({
  conversations: [],
  setConversations: () => {},
  selectedConversation: null,
  setSelectedConversation: () => {},
  updateConversationParams: () => {},
  updateConversation: () => {},
  newConversation: () => {},
  selectConversation: () => {},
  clearConversations: () => {},
  deleteConversation: () => {},
});

export const ConversationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setDisplay } = useDisplay();
  const { session } = useAuth();
  const { database } = useDatabase();
  const { settings, savedSettings } = useSettings();

  const { systemPrompts } = useSystemPrompts();

  const { models } = useModels();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const isInitialized = useRef(false);

  const fetchConversations = useCallback(async () => {
    if (isInitialized.current || !database || !session) {
      return;
    }

    isInitialized.current = true;

    const _conversations = await storageGetConversations(
      database,
      session.user!,
      systemPrompts,
      models,
    );

    if (_conversations) {
      const cleanedConversations = cleanConversationHistory(_conversations);

      const selectedConversationId = getSelectedConversationId();

      const selectedConversation = cleanedConversations.find(
        (c) => c.id === selectedConversationId,
      );

      if (selectedConversation) {
        setSelectedConversation(selectedConversation);
      } else if (cleanedConversations.length > 0) {
        setSelectedConversation(cleanedConversations[0]);
      }

      setConversations(cleanedConversations);
    }
  }, [database, session, systemPrompts, models]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  function updateConversation(conversation: Conversation, data: KeyValuePair) {
    if (!database || !session) return;

    const updatedConversation: Conversation = {
      ...conversation,
      [data.key]: data.value,
    };

    const updatedConversations = storageUpdateConversation(
      database,
      session.user!,
      updatedConversation,
      conversations,
    );

    setConversations(updatedConversations);
  }

  function updateConversationParams(
    conversation: Conversation,
    data: KeyValuePair,
  ) {
    if (!database || !session) return;

    const updatedConversation: Conversation = {
      ...conversation,
      params: {
        ...conversation.params,
        [data.key]: data.value,
      },
    };

    const updatedConversations = storageUpdateConversation(
      database,
      session.user!,
      updatedConversation,
      conversations,
    );

    setConversations(updatedConversations);
  }

  function newConversation() {
    if (!database || !session || !savedSettings || !settings) return;
    const lastConversation = conversations[conversations.length - 1];

    let model = lastConversation?.model || models[0];
    if (DEFAULT_MODEL) {
      model = PossibleAiModels[DEFAULT_MODEL];
    }

    const modelDefaults = getModelDefaults(model);

    const newConversation: Conversation = {
      id: uuidv4(),
      name: 'New Conversation',
      model: model,
      systemPrompt: null,
      folderId: null,
      timestamp: new Date().toISOString(),
      params: modelDefaults,
    };

    const updatedConversations = storageCreateConversation(
      database,
      session.user!,
      newConversation,
      conversations,
    );

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveSelectedConversationId(newConversation.id);
  }

  function selectConversation(conversation: Conversation) {
    if (!database) return;
    setSelectedConversation(conversation);

    setDisplay('chat');

    saveSelectedConversationId(conversation.id);
  }

  useEffect(() => {
    const _selectedConversation = conversations.find(
      (c) => c.id === selectedConversation?.id,
    );
    setSelectedConversation(_selectedConversation || null);
  }, [conversations, selectedConversation?.id]);

  async function clearConversations() {
    if (!database || !session) return;
    setConversations([]);

    await storageDeleteConversations(database, session.user!);
    deleteSelectedConversationId();

    let model = models[0];

    if (DEFAULT_MODEL) {
      model = PossibleAiModels[DEFAULT_MODEL];
    }

    const modelDefaults = getModelDefaults(model);

    const newConversation: Conversation = {
      id: uuidv4(),
      name: 'New Conversation',
      model: model,
      systemPrompt: null,
      folderId: null,
      timestamp: new Date().toISOString(),
      params: modelDefaults,
    };

    const updatedConversations = storageCreateConversation(
      database,
      session.user!,
      newConversation,
      [],
    );

    setSelectedConversation(newConversation);

    saveSelectedConversationId(newConversation.id);

    setConversations(updatedConversations);
  }

  function deleteConversation(conversation: Conversation) {
    if (!database || !session) return;
    let updatedConversations = storageDeleteConversation(
      database,
      session.user!,
      conversation.id,
      conversations,
    );

    setConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(
        updatedConversations[updatedConversations.length - 1],
      );

      saveSelectedConversationId(
        updatedConversations[updatedConversations.length - 1].id,
      );
    } else {
      let model = models[0];

      if (DEFAULT_MODEL) {
        model = PossibleAiModels[DEFAULT_MODEL];
      }

      const modelDefaults = getModelDefaults(model);

      const newConversation: Conversation = {
        id: uuidv4(),
        name: 'New Conversation',
        model: model,
        systemPrompt: null,
        folderId: null,
        timestamp: new Date().toISOString(),
        params: modelDefaults,
      };

      updatedConversations = storageCreateConversation(
        database,
        session.user!,
        newConversation,
        [],
      );

      setSelectedConversation(newConversation);

      saveSelectedConversationId(newConversation.id);

      setConversations(updatedConversations);
    }
  }

  const contextValue = {
    conversations,
    setConversations,
    selectedConversation,
    selectConversation,
    setSelectedConversation,
    updateConversationParams,
    newConversation,
    updateConversation,
    deleteConversation,
    clearConversations,
  };

  return (
    <ConversationsContext.Provider value={contextValue}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    error('useConversations must be used within a ConversationsProvider');
  }
  return context;
};
