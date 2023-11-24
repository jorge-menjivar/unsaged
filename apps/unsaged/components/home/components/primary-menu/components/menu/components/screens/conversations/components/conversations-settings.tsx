import { useContext } from 'react';

import { useTranslation } from 'next-i18next';

import { Import } from '@/components/home/components/settings/import';
import HomeContext from '@/components/home/home.context';

import ConversationsContext from '../conversations.context';
import { ClearConversations } from './clear-conversations';

export const ConversationsSettings = () => {
  const { t } = useTranslation('sidebar');

  const {
    state: { database, conversations },
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
  } = useContext(ConversationsContext);

  return (
    <div
      className="flex flex-col items-center space-y-1 border-t
    border-theme-border-light dark:border-theme-border-dark pt-1 text-sm"
    >
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

      <Import onImport={handleImportConversations} />

      {/* <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData(database!)}
      /> */}
    </div>
  );
};
