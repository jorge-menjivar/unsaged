import { Setting } from '@/types/settings';

export interface SettingsInitialState {
  searchQuery: string;
  filteredSettings: Setting[];
  selectedSettingId: string | null;
}

export const initialState: SettingsInitialState = {
  searchQuery: '',
  filteredSettings: [],
  selectedSettingId: null,
};
