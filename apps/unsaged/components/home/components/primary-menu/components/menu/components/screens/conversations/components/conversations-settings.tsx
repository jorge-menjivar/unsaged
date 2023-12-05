import { useContext } from 'react';

import { useTranslation } from 'next-i18next';

import { Import } from '@/components/home/components/settings/import';

import ConversationsContext from '../conversations.context';
import { ClearConversationsComponent } from './clear-conversations';

import { useConversations } from '@/providers/conversations';

export const ConversationsSettings = () => {
  const { t } = useTranslation('sidebar');

  const { conversations } = useConversations();

  const { handleImportConversations } = useContext(ConversationsContext);

  return (
    <div
      className="flex flex-col items-center space-y-1 border-t
    border-theme-border-light dark:border-theme-border-dark pt-1 text-sm"
    >
      {conversations.length > 0 ? <ClearConversationsComponent /> : null}

      <Import onImport={handleImportConversations} />

      {/* <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData(database!)}
      /> */}
    </div>
  );
};
