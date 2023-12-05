import { IconBulb, IconDeviceLaptop, IconMessages } from '@tabler/icons-react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import ActivityBar from './components/activity-bar/activity-bar';
import { Conversations } from './components/menu/components/screens/conversations/conversations';
import SystemPrompts from './components/menu/components/screens/prompts/system-prompts';
import Templates from './components/menu/components/screens/templates/prompts';
import Menu from './components/menu/menu';

import PrimaryMenuContext from './primary-menu.context';
import { PrimaryMenuInitialState, initialState } from './primary-menu.state';

export const PrimaryMenu = () => {
  const primaryMenuContextValue = useCreateReducer<PrimaryMenuInitialState>({
    initialState,
  });

  const icons = [
    <IconMessages size={28} key={0} />,
    <IconBulb size={28} key={1} />,
    <IconDeviceLaptop size={28} key={2} />,
  ];

  const screens = [
    <Conversations key={0} />,
    <Templates key={1} />,
    <SystemPrompts key={2} />,
  ];

  return (
    <PrimaryMenuContext.Provider value={primaryMenuContextValue}>
      <ActivityBar icons={icons}></ActivityBar>
      <Menu screens={screens}></Menu>
    </PrimaryMenuContext.Provider>
  );
};
