import { Dispatch, useCallback, useEffect, useState } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { PossibleAiModels } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';

import { HomeInitialState } from '@/components/Home/home.state';

import { cleanConversationHistory, cleanSelectedConversation } from '../clean';
import { DEFAULT_MODEL, DEFAULT_TEMPERATURE } from '../const';
import { storageCreateConversation } from '../storage/conversation';
import { storageGetConversations } from '../storage/conversations';
import {
  getSelectedConversation,
  saveSelectedConversation,
} from '../storage/selectedConversation';
import { getTimestampWithTimezoneOffset } from '../time/time';

import { v4 as uuidv4 } from 'uuid';

export const useConversations = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  database: Database | null,
  user: User | null,
  conversations: Conversation[],
) => {
  const [conversationsLoaded, setConversationsLoaded] = useState(false);

  const fetchModels = useCallback(async () => {
    if (!conversationsLoaded) {
      if (database && user) {
        storageGetConversations(database, user)
          .then((conversationHistory) => {
            if (conversationHistory) {
              const parsedConversationHistory: Conversation[] =
                conversationHistory;
              const cleanedConversations = cleanConversationHistory(
                parsedConversationHistory,
              );

              const selectedConversation = getSelectedConversation(user);

              if (selectedConversation) {
                try {
                  const parsedSelectedConversation: Conversation =
                    JSON.parse(selectedConversation);
                  const cleanedSelectedConversation = cleanSelectedConversation(
                    parsedSelectedConversation,
                  );

                  homeDispatch({
                    field: 'selectedConversation',
                    value: cleanedSelectedConversation,
                  });
                } catch (e) {
                  console.error(
                    'Unable to parse selected conversation. Resetting to las conversation.\n',
                    e,
                  );
                  if (cleanedConversations.length > 0) {
                    homeDispatch({
                      field: 'selectedConversation',
                      value: cleanedConversations[0],
                    });
                  }
                }
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
          })
          .then(() => {
            setConversationsLoaded(true);
          });
      }
    }
  }, [conversationsLoaded, database, homeDispatch, user]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const autogenerateConversation = useCallback(async () => {
    if (!database || !user) return;

    const model = PossibleAiModels[DEFAULT_MODEL];
    // const sectionId = model.vendor.toLowerCase();
    // const settingId = `${model.id}_default_system_prompt`;
    // const systemPromptId = getSavedSettingValue(
    //   savedSettings,
    //   sectionId,
    //   settingId,
    //   settings,
    // );

    // const systemPrompt = systemPrompts.find((p) => p.id === systemPromptId);

    const newConversation: Conversation = {
      id: uuidv4(),
      name: 'New Conversation',
      messages: [],
      model: model,
      systemPrompt: null,
      temperature: DEFAULT_TEMPERATURE,
      folderId: null,
      timestamp: getTimestampWithTimezoneOffset(),
    };

    const updatedConversations = storageCreateConversation(
      database,
      user,
      newConversation,
      [],
    );
    homeDispatch({ field: 'selectedConversation', value: newConversation });
    homeDispatch({ field: 'conversations', value: updatedConversations });

    saveSelectedConversation(user, newConversation);
  }, [database, homeDispatch, user]);

  useEffect(() => {
    if (conversations.length === 0 && conversationsLoaded) {
      autogenerateConversation();
    }
  }, [conversations, autogenerateConversation, conversationsLoaded]);
};
