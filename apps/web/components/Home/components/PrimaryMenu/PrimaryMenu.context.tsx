import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { PrimaryMenuInitialState } from './PrimaryMenu.state';

export interface PrimaryMenuContextProps {
  state: PrimaryMenuInitialState;
  dispatch: Dispatch<ActionType<PrimaryMenuInitialState>>;
}

const PrimaryMenuContext = createContext<PrimaryMenuContextProps>(undefined!);

export default PrimaryMenuContext;
