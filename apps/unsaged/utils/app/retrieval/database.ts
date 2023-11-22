import { Dispatch, useCallback, useEffect, useState } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Database } from '@/types/database';

import { HomeInitialState } from '@/components/Home/home.state';

import { getDatabase } from '../extensions/database';
import { GetToken } from '@clerk/types';
import { CLERK_TOKEN_TEMPLATE_NAME } from '../const';

export const useDatabase = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  database: Database | null,
  getToken: GetToken
) => {
  const fetchDatabase = useCallback(async () => {
    if (!database) {
      let customAccessToken: string | null = null;
      customAccessToken = await getToken({ template: CLERK_TOKEN_TEMPLATE_NAME || 'supabase' });
      const _db = await getDatabase(customAccessToken);
      homeDispatch({ field: 'database', value: _db });
    }
  }, [database, homeDispatch]);

  useEffect(() => {
    fetchDatabase();
  }, [fetchDatabase]);

  return;
};
