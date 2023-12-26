import { Dispatch, useCallback, useEffect, useState } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import { SystemPrompt } from '@/types/system-prompt';

import { HomeInitialState } from '@/components/Home/home.state';

import { cleanConversationHistory, cleanSelectedConversation } from '../clean';
import { DEFAULT_MODEL } from '../const';
import { getModelDefaults } from '../settings/model-defaults';
import { storageCreateConversation } from '../storage/conversation';
import { storageGetConversations } from '../storage/conversations';
import {
  getSelectedConversationId,
  saveSelectedConversationId,
} from '../storage/selectedConversation';

import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';

export const useConversations = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  database: Database | null,
  user: User | null,
  conversations: Conversation[],
  systemPrompts: SystemPrompt[],
  models: AiModel[],
  modelsLoaded: boolean,
) => {
  const t = useTranslations('chat');
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

          const selectedConversationId = getSelectedConversationId(user);

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
    if (!database || !user) return;

    let model = models.find(m => m.id == DEFAULT_MODEL) || models[0];

    const modelDefaults = models.length > 0 ? getModelDefaults(model) : {};

    const newConversation: Conversation = {
      id: uuidv4(),
      name: t('newConversation'),
      model: model,
      systemPrompt: null,
      folderId: null,
      timestamp: new Date().toISOString(),
      params: modelDefaults || {},
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

    saveSelectedConversationId(user, newConversation.id);
  }, [database, homeDispatch, models, user]);

  useEffect(() => {
    if (conversations.length === 0 && conversationsLoaded) {
      autogenerateConversation();
    }
  }, [conversations, autogenerateConversation, conversationsLoaded]);
};
