import { Dispatch, useCallback, useEffect } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { User } from '@/types/auth';

import { HomeInitialState } from '@/components/Home/home.state';

import { getUser } from '../auth/helpers';
import { DEBUG_MODE } from '../const';
import { printEnvVariables } from '../debug/env-vars';

export const useAuth = (
  homeDispatch: Dispatch<ActionType<HomeInitialState>>,
  user: User | null,
) => {
  const fetchUser = useCallback(async () => {
    if (!user) {
      const _user = await getUser();
      homeDispatch({ field: 'user', value: _user });
    }
  }, [user, homeDispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return;
};
