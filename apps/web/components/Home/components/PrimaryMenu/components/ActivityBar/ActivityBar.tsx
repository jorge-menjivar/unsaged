import {
  IconBrandDiscord,
  IconBrandGithub,
  IconLogout,
} from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useContext } from 'react';

import { localSaveShowPrimaryMenu } from '@/utils/app/storage/local/ui-state';
import { deleteSelectedConversationId } from '@/utils/app/storage/selectedConversation';

import { ActivityBarButton } from './components/ActivityBarButton';
import { ActivityBarTab } from './components/ActivityBarTab';
import HomeContext from '@/components/Home/home.context';

import PrimaryMenuContext from '../../PrimaryMenu.context';
import { SettingsDialog } from '../../../ChatZone/Screens/Settings/Settings';

const ActivityBar = ({ icons }: { icons: JSX.Element[] }) => {
  const {
    state: { user, database, showPrimaryMenu },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    state: { selectedIndex },
    dispatch: primaryMenuDispatch,
  } = useContext(PrimaryMenuContext);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      homeDispatch({ type: 'change', field: 'showPrimaryMenu', value: !showPrimaryMenu });
      localSaveShowPrimaryMenu(user!, !showPrimaryMenu);
    }

    if (!showPrimaryMenu) {
      homeDispatch({ type: 'change', field: 'showPrimaryMenu', value: !showPrimaryMenu });
      localSaveShowPrimaryMenu(user!, !showPrimaryMenu);
    }
    primaryMenuDispatch({ type: 'change', field: 'selectedIndex', value: index });
  };

  const handleSignOut = () => {
    if (database!.name !== 'local') {
      deleteSelectedConversationId(user!);
    }

    signOut();
  };

  // VS Code Activity Bar with tabs at the top and setting button at the bottom
  return (
    <div
      className={`relative border-r border-theme-border-light dark:border-theme-border-dark top-0 z-40 flex h-full w-[48px] flex-none flex-col
          ${showPrimaryMenu ? 'left-[0]' : 'hidden sm:flex'}
          space-y-6 bg-theme-activity-bar-light dark:bg-theme-activity-bar-dark items-center align-middle py-4 text-[14px] transition-all sm:relative sm:top-0
          sm:left-[0]
          justify-between`}
    >
      {/* Tabs aligns to top */}
      <div className="flex flex-col items-center">
        {icons.map((icon, index) => (
          <ActivityBarTab
            handleSelect={handleSelect}
            isSelected={index === selectedIndex}
            index={index}
            key={index}
          >
            {icon}
          </ActivityBarTab>
        ))}
      </div>

      {/* Settings buttons align to bottom */}
      <div className="flex flex-col items-center space-y-6">
        <ActivityBarButton>
          <a href="https://github.com/jorge-menjivar/unsaged" target="_blank">
            <IconBrandGithub size={28} />
          </a>
        </ActivityBarButton>
        <ActivityBarButton>
          <a href="https://discord.gg/rMH2acSEzq" target="_blank">
            <IconBrandDiscord size={28} />
          </a>
        </ActivityBarButton>
        <ActivityBarButton handleClick={handleSignOut}>
          <IconLogout size={28} />
        </ActivityBarButton>
        <ActivityBarButton>
          <SettingsDialog />
        </ActivityBarButton>
      </div>
    </div>
  );
};

export default ActivityBar;
