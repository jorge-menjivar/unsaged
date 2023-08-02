import { IconPlus } from '@tabler/icons-react';
import { FC, useContext } from 'react';

import {
  localSaveShowPrimaryMenu,
  localSaveShowSecondaryMenu,
} from '@/utils/app/storage/local/uiState';

import { Conversation } from '@/types/chat';

import {
  PrimaryMenuOpener,
  SecondaryMenuOpener,
} from '../../../Common/Sidebar/components/OpenCloseButton';
import HomeContext from '@/components/Home/home.context';

interface Props {
  selectedConversation: Conversation;
  onNewConversation: () => void;
}

export const Navbar: FC<Props> = ({
  selectedConversation,
  onNewConversation,
}) => {
  const {
    state: { showPrimaryMenu, showSecondaryMenu, user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleShowPrimaryMenu = () => {
    if (!showPrimaryMenu) {
      homeDispatch({ field: 'showPrimaryMenu', value: true });
      homeDispatch({ field: 'showSecondaryMenu', value: false });
    } else {
      homeDispatch({ field: 'showPrimaryMenu', value: false });
    }
    localSaveShowPrimaryMenu(user!, showPrimaryMenu);
  };

  const handleShowSecondaryMenu = () => {
    if (!showSecondaryMenu) {
      homeDispatch({ field: 'showPrimaryMenu', value: false });
      homeDispatch({ field: 'showSecondaryMenu', value: true });
    } else {
      homeDispatch({ field: 'showSecondaryMenu', value: false });
    }
    localSaveShowSecondaryMenu(user!, showSecondaryMenu);
  };

  return (
    <nav className="h-[50px] bg-[#efefef] dark:bg-[#202123] flex w-full justify-between py-3 px-4">
      {' '}
      <PrimaryMenuOpener
        visible={true}
        onClick={handleShowPrimaryMenu}
        open={showPrimaryMenu}
      />
      <div className="flex w-full justify-between px-8">
        <div
          className="left-[100px] text-black dark:text-white max-w-[280px]
        overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {selectedConversation.name}
        </div>
        <IconPlus
          className="cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400
          text-black dark:text-white"
          onClick={onNewConversation}
        />
      </div>
      <SecondaryMenuOpener
        visible={true}
        onClick={handleShowSecondaryMenu}
        open={showSecondaryMenu}
      />
    </nav>
  );
};
