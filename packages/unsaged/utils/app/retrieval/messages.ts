import { Dispatch, useCallback, useEffect, useState } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { User } from '@/types/auth';
import { Message } from '@/types/chat';
import { Database } from '@/types/database';

import { HomeInitialState } from '@/components/Home/home.state';

import { storageGetMessages } from '../storage/messages';

export const useMessages = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  database: Database | null,
  user: User | null,
) => {
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const fetchModels = useCallback(async () => {
    if (!messagesLoaded) {
      if (database && user) {
        const _messages = await storageGetMessages(database, user);

        homeDispatch({ field: 'messages', value: _messages });

        setMessagesLoaded(true);
      }
    }
  }, [messagesLoaded, database, homeDispatch, user]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);
};
