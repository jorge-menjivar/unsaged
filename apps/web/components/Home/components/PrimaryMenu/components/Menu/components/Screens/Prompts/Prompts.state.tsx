import { Prompt } from '@/types/prompt';

export interface PromptsInitialState {
  searchTerm: string;
  filteredPrompts: Prompt[];
}

export const initialState: PromptsInitialState = {
  searchTerm: '',
  filteredPrompts: [],
};
