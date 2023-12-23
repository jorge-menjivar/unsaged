import {
  IconBrandDiscord,
  IconBrandGithub,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import { useContext } from 'react';

import { TAURI } from '@/utils/app/const';
import { deleteSelectedConversationId } from '@/utils/app/storage/local/selected-conversation';
import { localSaveShowPrimaryMenu } from '@/utils/app/storage/local/ui-state';

import { ActivityBarButton } from './components/activity-bar-button';
import { ActivityBarTab } from './components/activity-bar-tab';

import PrimaryMenuContext from '../../primary-menu.context';

import { useDatabase } from '@/providers/database';
import { useDisplay } from '@/providers/display';
import { open } from '@tauri-apps/api/shell';

const ActivityBar = ({ icons }: { icons: JSX.Element[] }) => {
  const { database } = useDatabase();
  const { display, setDisplay, setShowPrimaryMenu, showPrimaryMenu } =
    useDisplay();

  const {
    state: { selectedIndex },
    dispatch: primaryMenuDispatch,
  } = useContext(PrimaryMenuContext);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      setShowPrimaryMenu(!showPrimaryMenu);
      localSaveShowPrimaryMenu(!showPrimaryMenu);
    }

    if (!showPrimaryMenu) {
      setShowPrimaryMenu(true);
      localSaveShowPrimaryMenu(!showPrimaryMenu);
    }
    primaryMenuDispatch({ field: 'selectedIndex', value: index });
  };

  const handleSignOut = () => {
    if (database!.name !== 'local') {
      deleteSelectedConversationId();
    }

    // signOut();
  };

  const handleShowSettings = () => {
    if (display !== 'settings') {
      setDisplay('settings');
    } else {
      if (window.innerWidth < 640) {
        setShowPrimaryMenu(false);
      } else {
        setDisplay('chat');
      }
    }
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
        <ActivityBarButton
          onClick={() => {
            const url = 'https://github.com/jorge-menjivar/unSAGED';
            if (TAURI) {
              open(url);
            } else {
              window.open(url, '_blank');
            }
          }}
        >
          <IconBrandGithub size={28} />
        </ActivityBarButton>
        <ActivityBarButton
          onClick={() => {
            const url = 'https://discord.gg/rMH2acSEzq';
            if (TAURI) {
              open(url);
            } else {
              window.open(url, '_blank');
            }
          }}
        >
          <IconBrandDiscord size={28} />
        </ActivityBarButton>
        <ActivityBarButton onClick={handleSignOut}>
          <IconLogout size={28} />
        </ActivityBarButton>
        <ActivityBarButton onClick={handleShowSettings}>
          <IconSettings size={28} />
        </ActivityBarButton>
      </div>
    </div>
  );
};

export default ActivityBar;
