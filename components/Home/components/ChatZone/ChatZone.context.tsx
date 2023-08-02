import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { ChatZoneInitialState } from './ChatZone.state';

export interface ChatZoneContextProps {
  state: ChatZoneInitialState;
  dispatch: Dispatch<ActionType<ChatZoneInitialState>>;
}

const PrimaryMenuContext = createContext<ChatZoneContextProps>(undefined!);

export default PrimaryMenuContext;
