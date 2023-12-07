import { useContext } from 'react';

import { Import } from '@/components/Home/components/Settings/Import';
import HomeContext from '@/components/Home/home.context';

import ConversationsContext from '../Conversations.context';
import { ClearConversations } from './ClearConversations';

export const ConversationsSettings = () => {
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
