import { IconAdjustments, IconBrain, IconPlug } from '@tabler/icons-react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import ActivityBar from './components/ActivityBar/ActivityBar';
import Menu from './components/Menu/Menu';
import { ModelSettings } from './components/Menu/components/Screens/ModelSettings/ModelSettings';

import SecondaryMenuContext from './SecondaryMenu.context';
import { SecondaryMenuInitialState, initialState } from './SecondaryMenu.state';

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
