import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { SystemPrompt } from '@/types/system-prompt';

import { SystemPromptsInitialState } from './SystemPrompts.state';

export interface SystemPromptsContextProps {
  state: SystemPromptsInitialState;
  dispatch: Dispatch<ActionType<SystemPromptsInitialState>>;
  handleCreateSystemPrompt: () => void;
  handleUpdateSystemPrompt: (systemPrompt: SystemPrompt) => void;
  handleDeleteSystemPrompt: (systemPromptId: string) => void;
}

const SystemPromptsContext = createContext<SystemPromptsContextProps>(
  undefined!,
);

export default SystemPromptsContext;
