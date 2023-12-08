import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { SecondaryMenuInitialState } from './SecondaryMenu.state';

export interface SecondaryMenuContextProps {
  state: SecondaryMenuInitialState;
  dispatch: Dispatch<ActionType<SecondaryMenuInitialState>>;
}

const SecondaryMenuContext = createContext<SecondaryMenuContextProps>(
  undefined!,
);

export default SecondaryMenuContext;
