import {
  IconBrandDiscord,
  IconBrandGithub,
  IconSettings,
} from '@tabler/icons-react';
import { useContext } from 'react';

import { localSaveShowPrimaryMenu } from '@/utils/app/storage/local/ui-state';

import { ActivityBarButton } from './components/ActivityBarButton';
import { ActivityBarTab } from './components/ActivityBarTab';
import HomeContext from '@/components/Home/home.context';

import PrimaryMenuContext from '../../PrimaryMenu.context';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const ActivityBar = ({ icons }: { icons: JSX.Element[] }) => {
  const {
    state: { database, showPrimaryMenu, display },
    dispatch: homeDispatch,
  } = useContext(HomeContext);
  const { user } = useUser();

  const {
    state: { selectedIndex },
    dispatch: primaryMenuDispatch,
  } = useContext(PrimaryMenuContext);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      homeDispatch({ field: 'showPrimaryMenu', value: !showPrimaryMenu });
      localSaveShowPrimaryMenu(user!, !showPrimaryMenu);
    }

    if (!showPrimaryMenu) {
      homeDispatch({ field: 'showPrimaryMenu', value: !showPrimaryMenu });
      localSaveShowPrimaryMenu(user!, !showPrimaryMenu);
    }
    primaryMenuDispatch({ field: 'selectedIndex', value: index });
  };

  const handleShowSettings = () => {
    if (display !== 'settings') {
      homeDispatch({ field: 'display', value: 'settings' });
    } else {
      if (window.innerWidth < 640) {
        homeDispatch({ field: 'showPrimaryMenu', value: false });
      } else {
        homeDispatch({ field: 'display', value: 'chat' });
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
        <ActivityBarButton>
          <Link href="https://github.com/jorge-menjivar/unSAGED" target="_blank">
            <IconBrandGithub size={28} />
          </Link>
        </ActivityBarButton>
        <ActivityBarButton>
          <Link href="https://discord.gg/rMH2acSEzq" target="_blank">
            <IconBrandDiscord size={28} />
          </Link>
        </ActivityBarButton>
        <ActivityBarButton>
          <UserButton afterSignOutUrl="/" />
        </ActivityBarButton>
        <ActivityBarButton handleClick={handleShowSettings}>
          <IconSettings size={28} />
        </ActivityBarButton>
      </div>
    </div>
  );
};

export default ActivityBar;
