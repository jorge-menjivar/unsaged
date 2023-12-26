import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { SystemPromptsInitialState } from './system-prompts.state';

export interface SystemPromptsContextProps {
  state: SystemPromptsInitialState;
  dispatch: Dispatch<ActionType<SystemPromptsInitialState>>;
}

const SystemPromptsContext = createContext<SystemPromptsContextProps>(
  undefined!,
);

export default SystemPromptsContext;
