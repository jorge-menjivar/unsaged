import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Setting, SettingsSection } from '@/types/settings';

import { SettingsInitialState } from './Settings.state';

export interface SettingsContextProps {
  state: SettingsInitialState;
  dispatch: Dispatch<ActionType<SettingsInitialState>>;
  handleSelect: (section: SettingsSection, setting: Setting) => void;
  handleSave: (section: SettingsSection, setting: Setting, value: any) => void;
}

const PrimaryMenuContext = createContext<SettingsContextProps>(undefined!);

export default PrimaryMenuContext;
