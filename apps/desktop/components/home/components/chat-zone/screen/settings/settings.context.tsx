import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { SettingsInitialState } from './settings.state';

export interface SettingsContextProps {
  state: SettingsInitialState;
  dispatch: Dispatch<ActionType<SettingsInitialState>>;
  handleSelect: (settingId: string) => void;
}

const PrimaryMenuContext = createContext<SettingsContextProps>(undefined!);

export default PrimaryMenuContext;
