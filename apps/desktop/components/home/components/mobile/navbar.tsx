import { IconPlus } from '@tabler/icons-react';

import {
  localSaveShowPrimaryMenu,
  localSaveShowSecondaryMenu,
} from '@/utils/app/storage/local/ui-state';

import {
  PrimaryMenuOpener,
  SecondaryMenuOpener,
} from '../../../common/side-bar/components/OpenCloseButton';

import { useConversations } from '@/providers/conversations';
import { useDisplay } from '@/providers/display';

export function Navbar() {
  const {
    showPrimaryMenu,
    showSecondaryMenu,
    setShowPrimaryMenu,
    setShowSecondaryMenu,
  } = useDisplay();

  const { selectedConversation, newConversation } = useConversations();

  const handleShowPrimaryMenu = () => {
    if (!showPrimaryMenu) {
      setShowPrimaryMenu(true);
      setShowSecondaryMenu(false);
      localSaveShowPrimaryMenu(true);
    } else {
      setShowPrimaryMenu(false);
      localSaveShowPrimaryMenu(false);
    }
  };

  const handleShowSecondaryMenu = () => {
    if (!showSecondaryMenu) {
      setShowPrimaryMenu(false);
      setShowSecondaryMenu(true);
      localSaveShowSecondaryMenu(true);
    } else {
      setShowSecondaryMenu(false);
      localSaveShowSecondaryMenu(false);
    }
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
          {selectedConversation ? selectedConversation.name : ''}
        </div>
        <IconPlus
          className="cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400
          text-black dark:text-white"
          onClick={newConversation}
        />
      </div>
      <SecondaryMenuOpener
        visible={true}
        onClick={handleShowSecondaryMenu}
        open={showSecondaryMenu}
      />
    </nav>
  );
}
