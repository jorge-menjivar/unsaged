import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Template } from '@/types/prompt';

import { PromptsInitialState } from './prompts.state';

export interface PromptsContextProps {
  state: PromptsInitialState;
  dispatch: Dispatch<ActionType<PromptsInitialState>>;
  handleCreatePrompt: () => void;
  handleDeletePrompt: (prompt: Template) => void;
  handleUpdatePrompt: (prompt: Template) => void;
}

const PromptsContext = createContext<PromptsContextProps>(undefined!);

export default PromptsContext;
