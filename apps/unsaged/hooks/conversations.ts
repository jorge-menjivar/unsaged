import { Dispatch, useCallback, useEffect, useState } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '../utils/app/clean';
import { DEFAULT_MODEL } from '../utils/app/const';
import { getModelDefaults } from '../utils/app/settings/model-defaults';
import { storageCreateConversation } from '../utils/app/storage/conversation';
import { storageGetConversations } from '../utils/app/storage/conversations';
import {
  getSelectedConversationId,
  saveSelectedConversationId,
} from '../utils/app/storage/local/selected-conversation';

import { AiModel, PossibleAiModels } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import { SystemPrompt } from '@/types/system-prompt';

import { HomeInitialState } from '@/components/home/home.state';

import { v4 as uuidv4 } from 'uuid';

export const useConversations = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  database: Database | null,
  user: User | null,
  conversations: Conversation[],
  systemPrompts: SystemPrompt[],
  models: AiModel[],
  modelsLoaded: boolean,
) => {
  const [conversationsLoaded, setConversationsLoaded] = useState(false);

  const fetchModels = useCallback(async () => {
    if (!conversationsLoaded) {
      if (database && user && modelsLoaded) {
        const _conversations = await storageGetConversations(
          database,
          user,
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
            homeDispatch({
              field: 'selectedConversation',
              value: selectedConversation,
            });
          } else if (cleanedConversations.length > 0) {
            homeDispatch({
              field: 'selectedConversation',
              value: cleanedConversations[0],
            });
          }

          homeDispatch({
            field: 'conversations',
            value: cleanedConversations,
          });
        }
        setConversationsLoaded(true);
      }
    }
  }, [
    conversationsLoaded,
    database,
    homeDispatch,
    models,
    modelsLoaded,
    systemPrompts,
    user,
  ]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const autogenerateConversation = useCallback(async () => {
    if (!database || !user || models.length === 0) return;

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
      user,
      newConversation,
      [],
    );
    homeDispatch({
      field: 'selectedConversation',
      value: newConversation,
    });
    homeDispatch({ field: 'conversations', value: updatedConversations });

    saveSelectedConversationId(newConversation.id);
  }, [database, homeDispatch, models, user]);

  useEffect(() => {
    if (conversations.length === 0 && conversationsLoaded) {
      autogenerateConversation();
    }
  }, [conversations, autogenerateConversation, conversationsLoaded]);
};
