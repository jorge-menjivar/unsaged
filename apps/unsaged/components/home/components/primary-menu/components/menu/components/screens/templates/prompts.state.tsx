import { Template } from '@/types/templates';

export interface PromptsInitialState {
  searchTerm: string;
  filteredPrompts: Template[];
}

export const initialState: PromptsInitialState = {
  searchTerm: '',
  filteredPrompts: [],
};
