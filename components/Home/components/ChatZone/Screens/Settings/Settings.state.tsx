import { Setting, SettingsSection } from '@/types/settings';

export interface SettingsInitialState {
  searchQuery: string;
  filteredSettings: Setting[];
  selectedSection: SettingsSection | null;
  selectedSetting: Setting | null;
}

export const initialState: SettingsInitialState = {
  searchQuery: '',
  filteredSettings: [],
  selectedSection: null,
  selectedSetting: null,
};
