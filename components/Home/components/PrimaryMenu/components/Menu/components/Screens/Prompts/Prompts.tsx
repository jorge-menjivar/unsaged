import { IconFolderPlus, IconMistOff, IconPlus } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import {
  storageCreatePrompt,
  storageDeletePrompt,
  storageUpdatePrompt,
} from '@/utils/app/storage/prompt';

import { Prompt } from '@/types/prompt';

import { PromptFolders } from './components/Folders';
import { PromptList } from './components/PromptList';
import { PrimaryButton } from '@/components/Common/Buttons/PrimaryButton';
import { SecondaryButton } from '@/components/Common/Buttons/SecondaryButton';
import Search from '@/components/Common/Search';
import HomeContext from '@/components/Home/home.context';

import PromptsContext from './Prompts.context';
import { PromptsInitialState, initialState } from './Prompts.state';

import { v4 as uuidv4 } from 'uuid';

const Prompts = () => {
  const { t } = useTranslation('promptbar');

  const promptBarContextValue = useCreateReducer<PromptsInitialState>({
    initialState,
  });

  const {
    state: { prompts, database, user },
    dispatch: homeDispatch,
    handleCreateFolder,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;

  const handleCreatePrompt = () => {
    const newPrompt: Prompt = {
      id: uuidv4(),
      name: `Template ${prompts.length + 1}`,
      description: '',
      content: '',
      models: [],
      folderId: null,
    };

    const updatedPrompts = storageCreatePrompt(
      database!,
      user!,
      newPrompt,
      prompts,
    );

    homeDispatch({ field: 'prompts', value: updatedPrompts });
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    const updatedPrompts = storageDeletePrompt(
      database!,
      user!,
      prompt.id,
      prompts,
    );
    homeDispatch({ field: 'prompts', value: updatedPrompts });
  };

  const handleUpdatePrompt = (prompt: Prompt) => {
    const updated = storageUpdatePrompt(database!, user!, prompt, prompts);

    homeDispatch({ field: 'prompts', value: updated.all });
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: e.target.dataset.folderId,
      };

      handleUpdatePrompt(updatedPrompt);

      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: prompts.filter((prompt) => {
          const searchable =
            prompt.name.toLowerCase() +
            ' ' +
            prompt.description.toLowerCase() +
            ' ' +
            prompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredPrompts', value: prompts });
    }
  }, [searchTerm, prompts, promptDispatch]);

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  const doSearch = (term: string) =>
    promptDispatch({ field: 'searchTerm', value: term });

  const createFolder = () => handleCreateFolder(t('New folder'), 'prompt');

  return (
    <PromptsContext.Provider
      value={{
        ...promptBarContextValue,
        handleCreatePrompt,
        handleDeletePrompt,
        handleUpdatePrompt,
      }}
    >
      <div className="flex items-center gap-x-2">
        <PrimaryButton
          onClick={() => {
            handleCreatePrompt();
            doSearch('');
          }}
        >
          {t('New message template')}
        </PrimaryButton>

        <SecondaryButton onClick={createFolder}>
          <IconFolderPlus size={16} />
        </SecondaryButton>
      </div>
      <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchTerm}
        onSearch={doSearch}
      />

      <div className="flex-grow overflow-auto">
        {filteredPrompts?.length > 0 && (
          <div
            className="flex border-b pb-2
          border-theme-button-border-light dark:border-theme-button-border-dark"
          >
            <PromptFolders />
          </div>
        )}

        {filteredPrompts?.length > 0 ? (
          <div
            className="pt-2"
            onDrop={handleDrop}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <PromptList
              prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
            />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-black dark:text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">{t('No data.')}</span>
          </div>
        )}
      </div>
    </PromptsContext.Provider>
  );
};

export default Prompts;
