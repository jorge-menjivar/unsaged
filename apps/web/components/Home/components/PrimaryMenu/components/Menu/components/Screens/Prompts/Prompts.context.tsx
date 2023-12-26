import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Prompt } from '@/types/prompt';

import { PromptsInitialState } from './Prompts.state';

export interface PromptsContextProps {
  state: PromptsInitialState;
  dispatch: Dispatch<ActionType<PromptsInitialState>>;
  handleCreatePrompt: () => void;
  handleDeletePrompt: (prompt: Prompt) => void;
  handleUpdatePrompt: (prompt: Prompt) => void;
}

const PromptsContext = createContext<PromptsContextProps>(undefined!);

export default PromptsContext;
