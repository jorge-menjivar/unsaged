import { IconFolderPlus, IconMistOff } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { DEFAULT_MODEL } from '@/utils/app/const';
import { importData } from '@/utils/app/import-export/import';
import { getModelDefaults } from '@/utils/app/settings/model-defaults';
import {
  storageCreateConversation,
  storageDeleteConversation,
} from '@/utils/app/storage/conversation';
import { storageDeleteConversations } from '@/utils/app/storage/conversations';
import {
  storageDeleteFolders,
  storageUpdateFolders,
} from '@/utils/app/storage/folders';
import {
  deleteSelectedConversationId,
  saveSelectedConversationId,
} from '@/utils/app/storage/selectedConversation';

import { PossibleAiModels } from '@/types/ai-models';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import { LatestExportFormat, SupportedExportFormats } from '@/types/export';
import { SystemPrompt } from '@/types/system-prompt';

import { ConversationList } from './components/ConversationList';
import { ConversationsSettings } from './components/ConversationsSettings';
import { ConversationsFolders } from './components/Folders';
import HomeContext from '@/components/Home/home.context';
import { PrimaryButton } from '@/components/common/Buttons/PrimaryButton';
import { SecondaryButton } from '@/components/common/Buttons/SecondaryButton';
import Search from '@/components/common/Search';

import ConversationsContext from './Conversations.context';
import { ConversationsInitialState, initialState } from './Conversations.state';

import { v4 as uuidv4 } from 'uuid';

export const Conversations = () => {
  const t = useTranslations('chat');

  const conversationsContextValue = useCreateReducer<ConversationsInitialState>(
    {
      initialState,
    },
  );

  const {
    state: { conversations, messages, database, folders, user, models },
    dispatch: homeDispatch,
    handleCreateFolder,
    handleNewConversation,
    handleUpdateConversation,
  } = useContext(HomeContext);

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
    if (!database || !user) return;
    const {
      conversations,
      messages,
      folders,
      system_prompts,
      message_templates,
    }: LatestExportFormat = await importData(
      database,
      user,
      data,
      systemPrompts,
      models,
    );
    homeDispatch({ field: 'conversations', value: conversations });
    homeDispatch({
      field: 'selectedConversation',
      value: conversations[conversations.length - 1],
    });
    homeDispatch({ field: 'messages', value: messages });
    homeDispatch({ field: 'folders', value: folders });
    homeDispatch({ field: 'prompts', value: message_templates });
    homeDispatch({ field: 'systemPrompts', value: system_prompts });
  };

  const handleClearConversations = async () => {
    if (!database || !user) return;
    homeDispatch({ field: 'conversations', value: [] });

    const deletedFolders = folders.filter((f) => f.type === 'chat');

    let deletedFolderIds: string[] = [];
    for (const folder of deletedFolders) {
      deletedFolderIds.push(folder.id);
    }

    await storageDeleteConversations(database, user);
    storageDeleteFolders(database, user, deletedFolderIds);
    deleteSelectedConversationId(user);

    const updatedFolders = folders.filter((f) => f.type !== 'chat');

    homeDispatch({ field: 'folders', value: updatedFolders });
    storageUpdateFolders(database, user, updatedFolders);

    let model = models[0];

    if (DEFAULT_MODEL) {
      model = PossibleAiModels[DEFAULT_MODEL];
    }

    const modelDefaults = getModelDefaults(model);

    const newConversation: Conversation = {
      id: uuidv4(),
      name: t('newConversation'),
      model: model,
      systemPrompt: null,
      folderId: null,
      timestamp: new Date().toISOString(),
      params: modelDefaults,
    };

    const updatedConversations = storageCreateConversation(
      database,
      user,
      newConversation,
      [],
    );

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversations[updatedConversations.length - 1],
    });

    saveSelectedConversationId(
      user,
      updatedConversations[updatedConversations.length - 1].id,
    );

    homeDispatch({ field: 'conversations', value: updatedConversations });
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    if (!database || !user) return;
    let updatedConversations = storageDeleteConversation(
      database,
      user,
      conversation.id,
      conversations,
    );

    homeDispatch({ field: 'conversations', value: updatedConversations });
    chatDispatch({ field: 'searchTerm', value: '' });

    if (updatedConversations.length > 0) {
      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversations[updatedConversations.length - 1],
      });

      saveSelectedConversationId(
        user,
        updatedConversations[updatedConversations.length - 1].id,
      );
    } else {
      let model = models[0] || 'gpt-3.5-turbo';

      if (DEFAULT_MODEL) {
        model = PossibleAiModels[DEFAULT_MODEL];
      }

      const modelDefaults = models.length > 0 ? getModelDefaults(model) : {};

      const newConversation: Conversation = {
        id: uuidv4(),
        name: t('newConversation'),
        model: model,
        systemPrompt: null,
        folderId: null,
        timestamp: new Date().toISOString(),
        params: modelDefaults,
      };

      updatedConversations = storageCreateConversation(
        database,
        user,
        newConversation,
        [],
      );

      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversations[updatedConversations.length - 1],
      });

      saveSelectedConversationId(
        user,
        updatedConversations[updatedConversations.length - 1].id,
      );

      homeDispatch({ field: 'conversations', value: updatedConversations });
    }

    const updatedMessages = messages.filter(
      (message) => message.conversationId !== conversation.id,
    );

    homeDispatch({ field: 'messages', value: updatedMessages });
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversation(conversation, { key: 'folderId', value: null });
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

  const createFolder = () => handleCreateFolder(t('newFolder'), 'chat');

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
        handleDeleteConversation,
        handleClearConversations,
        handleImportConversations,
        handleExportData,
      }}
    >
      <div className="flex items-center gap-x-2">
        <PrimaryButton
          onClick={() => {
            handleNewConversation();
            doSearch('');
          }}
        >
          {t('newConversation')}
        </PrimaryButton>

        <SecondaryButton onClick={createFolder}>
          <IconFolderPlus size={16} />
        </SecondaryButton>
      </div>
      <Search
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
            <span className="text-[14px] leading-normal">{t('noData')}.</span>
          </div>
        )}
      </div>
      <ConversationsSettings />
    </ConversationsContext.Provider>
  );
};
