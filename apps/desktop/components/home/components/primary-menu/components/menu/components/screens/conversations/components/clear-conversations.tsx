import { IconCheck, IconTrash, IconX } from '@tabler/icons-react';
import { useState } from 'react';

import { useTranslation } from 'next-i18next';

import { SidebarButton } from '@/components/common/side-bar/side-bar-button';

import { useConversations } from '@/providers/conversations';
import { useFolders } from '@/providers/folders';

export function ClearConversationsComponent() {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const { t } = useTranslation('sidebar');

  const { clearConversations } = useConversations();
  const { clearFolders } = useFolders();

  return isConfirming ? (
    <div className="flex w-full cursor-pointer items-center rounded-lg py-3 px-3 hover:bg-gray-500/10">
      <IconTrash size={18} className="text-black dark:text-white" />

      <div className="ml-3 flex-1 text-left text-[12.5px] leading-3 text-black dark:text-white">
        {t('Are you sure?')}
      </div>

      <div className="flex w-[40px]">
        <IconCheck
          className="ml-auto mr-1 min-w-[20px] text-neutral-400 hover:text-neutral-100"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            clearConversations();
            clearFolders('chat');
            setIsConfirming(false);
          }}
        />

        <IconX
          className="ml-auto min-w-[20px] text-neutral-400 hover:text-neutral-100"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        />
      </div>
    </div>
  ) : (
    <SidebarButton
      text={t('Clear conversations')}
      icon={<IconTrash size={18} />}
      onClick={() => setIsConfirming(true)}
    />
  );
}
