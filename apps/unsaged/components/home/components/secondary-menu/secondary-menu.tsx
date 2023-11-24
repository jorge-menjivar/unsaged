import { IconAdjustments } from '@tabler/icons-react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import ActivityBar from './components/activity-bar/activity-bar';
import { ModelSettings } from './components/menu/components/screens/model-settings/model-settings';
import Menu from './components/menu/menu';

import SecondaryMenuContext from './secondary-menu.context';
import {
  SecondaryMenuInitialState,
  initialState,
} from './secondary-menu.state';

export const SecondaryMenu = () => {
  const secondaryMenuContextValue = useCreateReducer<SecondaryMenuInitialState>(
    {
      initialState,
    },
  );

  const icons = [<IconAdjustments size={28} key={0} />];

  const screens = [<ModelSettings key={0} />];

  return (
    <SecondaryMenuContext.Provider value={secondaryMenuContextValue}>
      <Menu screens={screens} />
      <ActivityBar icons={icons} />
    </SecondaryMenuContext.Provider>
  );
};
