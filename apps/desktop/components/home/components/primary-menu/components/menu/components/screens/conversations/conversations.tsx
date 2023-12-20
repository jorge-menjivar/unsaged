import { IconFolderPlus, IconMistOff } from '@tabler/icons-react';
import { useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { importData } from '@/utils/app/import-export/import';

import { Database } from '@/types/database';
import { LatestExportFormat, SupportedExportFormats } from '@/types/export';
import { SystemPrompt } from '@/types/system-prompt';

import { ConversationList } from './components/conversation-list';
import { ConversationsSettings } from './components/conversations-settings';
import { ConversationsFolders } from './components/folders';
import Search from '@/components/common/Search';
import { Button } from '@/components/common/ui/button';

import ConversationsContext from './conversations.context';
import { ConversationsInitialState, initialState } from './conversations.state';

import { useAuth } from '@/providers/auth';
import { useConversations } from '@/providers/conversations';
import { useDatabase } from '@/providers/database';
import { useFolders } from '@/providers/folders';
import { useMessages } from '@/providers/messages';
import { useModels } from '@/providers/models';
import { useSystemPrompts } from '@/providers/system-prompts';
import { useTemplates } from '@/providers/templates';

export const Conversations = () => {
  const { t } = useTranslation('conversations');
  const { database } = useDatabase();
  const { session } = useAuth();
  const { models } = useModels();
  const {
    conversations,
    setConversations,
    setSelectedConversation,
    updateConversation,
    newConversation,
  } = useConversations();
  const { messages, setMessages } = useMessages();
  const { setFolders, createFolder } = useFolders();
  const { setTemplates } = useTemplates();
  const { setSystemPrompts } = useSystemPrompts();

  const conversationsContextValue = useCreateReducer<ConversationsInitialState>(
    {
      initialState,
    },
  );

  const {
    state: { searchTerm, filteredConversations },
    dispatch: chatDispatch,
  } = conversationsContextValue;

  const handleExportData = (database: Database) => {
    // exportData(database, user!);
  };

  const handleImportConversations = async (
    data: SupportedExportFormats,
    systemPrompts: SystemPrompt[],
  ) => {
    if (!database || !session) return;
    const {
      conversations,
      messages,
      folders,
      system_prompts,
      message_templates,
    }: LatestExportFormat = await importData(
      database,
      session.user!,
      data,
      systemPrompts,
      models,
    );

    setConversations(conversations);
    setSelectedConversation(conversations[conversations.length - 1]);
    setMessages(messages);
    setFolders(folders);
    setTemplates(message_templates);
    setSystemPrompts(system_prompts);
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      updateConversation(conversation, { key: 'folderId', value: null });
      chatDispatch({ field: 'searchTerm', value: '' });
      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations.filter((conversation) => {
          const conversationMessages = messages.filter(
            (message) => message.conversationId === conversation.id,
          );

          const searchable =
            conversation.name.toLocaleLowerCase() +
            ' ' +
            conversationMessages.map((message) => message.content).join(' ');
          return searchable.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations,
      });
    }
  }, [searchTerm, conversations, chatDispatch, messages]);

  const doSearch = (term: string) =>
    chatDispatch({ field: 'searchTerm', value: term });

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  return (
    <ConversationsContext.Provider
      value={{
        ...conversationsContextValue,
        handleImportConversations,
        handleExportData,
      }}
    >
      <div className="flex items-center gap-x-2 w-full">
        <Button
          className="w-full"
          onClick={() => {
            newConversation();
            doSearch('');
          }}
          disabled={!database || !session || models.length === 0}
        >
          {t('New conversation')}
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            createFolder(t('New folder'), 'chat');
          }}
          disabled={!database || !session || models.length === 0}
        >
          <IconFolderPlus size={16} />
        </Button>
      </div>
      <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchTerm}
        onSearch={doSearch}
      />

      <div className="flex-grow overflow-auto">
        {filteredConversations?.length > 0 && (
          <div
            className="flex border-b pb-2
          border-theme-button-border-light dark:border-theme-button-border-dark"
          >
            <ConversationsFolders searchTerm={searchTerm} />
          </div>
        )}

        {filteredConversations?.length > 0 ? (
          <div
            className="pt-2"
            onDrop={handleDrop}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <ConversationList conversations={filteredConversations} />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-black dark:text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">{t('No data.')}</span>
          </div>
        )}
      </div>
      <ConversationsSettings />
    </ConversationsContext.Provider>
  );
};
