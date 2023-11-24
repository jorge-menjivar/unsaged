import { Template } from '@/types/prompt';

export interface PromptsInitialState {
  searchTerm: string;
  filteredPrompts: Template[];
}

export const initialState: PromptsInitialState = {
  searchTerm: '',
  filteredPrompts: [],
};
