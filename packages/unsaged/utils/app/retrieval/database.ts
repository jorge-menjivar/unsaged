import { Dispatch, useCallback, useEffect, useState } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Database } from '@/types/database';

import { HomeInitialState } from '@/components/Home/home.state';

import { getDatabase } from '../extensions/database';

export const useDatabase = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  database: Database | null,
) => {
  const fetchDatabase = useCallback(async () => {
    if (!database) {
      const _db = await getDatabase();
      homeDispatch({ field: 'database', value: _db });
    }
  }, [database, homeDispatch]);

  useEffect(() => {
    fetchDatabase();
  }, [fetchDatabase]);

  return;
};
