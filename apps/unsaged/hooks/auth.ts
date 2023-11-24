import { Dispatch, useCallback, useEffect } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { getUser } from '../utils/app/auth/helpers';

import { User } from '@/types/auth';

import { HomeInitialState } from '@/components/home/home.state';

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
