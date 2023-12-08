import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { PromptsInitialState } from './prompts.state';

export interface PromptsContextProps {
  state: PromptsInitialState;
  dispatch: Dispatch<ActionType<PromptsInitialState>>;
}

const PromptsContext = createContext<PromptsContextProps>(undefined!);

export default PromptsContext;
