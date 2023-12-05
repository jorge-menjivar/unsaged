import { IconFolderPlus, IconMistOff } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { SystemPromptFolders } from './components/folders';
import { SystemPromptList } from './components/system-prompt-list';
import Search from '@/components/common/Search';
import { Button } from '@/components/common/ui/button';

import SystemPromptsContext from './system-prompts.context';
import {
  SystemPromptsInitialState,
  initialState,
} from './system-prompts.state';

import { useFolders } from '@/providers/folders';
import { useSystemPrompts } from '@/providers/system_prompts';

const SystemPrompts = () => {
  const { t } = useTranslation('systemPrompts');

  const { createFolder } = useFolders();
  const { systemPrompts, createSystemPrompt, updateSystemPrompt } =
    useSystemPrompts();

  const systemPromptsContextValue = useCreateReducer<SystemPromptsInitialState>(
    {
      initialState,
    },
  );

  const {
    state: { searchTerm, filteredSystemPrompts },
    dispatch: promptDispatch,
  } = systemPromptsContextValue;

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const systemPrompt = JSON.parse(e.dataTransfer.getData('system_prompt'));

      const updatedSystemPrompt = {
        ...systemPrompt,
        folderId: e.target.dataset.folderId,
      };

      updateSystemPrompt(updatedSystemPrompt);

      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredSystemPrompts',
        value: systemPrompts.filter((systemPrompt) => {
          const searchable =
            systemPrompt.name.toLowerCase() +
            ' ' +
            systemPrompt.models.join(' ').toLowerCase() +
            ' ' +
            systemPrompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({
        field: 'filteredSystemPrompts',
        value: systemPrompts,
      });
    }
  }, [searchTerm, systemPrompts, promptDispatch]);

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

  return (
    <SystemPromptsContext.Provider
      value={{
        ...systemPromptsContextValue,
      }}
    >
      <div className="flex items-center gap-x-2">
        <Button
          onClick={() => {
            createSystemPrompt();
            doSearch('');
          }}
        >
          {t('New system prompt')}
        </Button>
        <Button
          variant={'secondary'}
          onClick={() => createFolder(t('New folder'), 'system_prompt')}
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
        {filteredSystemPrompts?.length > 0 && (
          <div
            className="flex border-b pb-2
          border-theme-button-border-light dark:border-theme-button-border-dark"
          >
            <SystemPromptFolders />
          </div>
        )}

        {filteredSystemPrompts?.length > 0 ? (
          <div
            className="pt-2"
            onDrop={handleDrop}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <SystemPromptList
              systemPrompts={filteredSystemPrompts.filter(
                (systemPrompt) => !systemPrompt.folderId,
              )}
            />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-black dark:text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">{t('No data.')}</span>
          </div>
        )}
      </div>
    </SystemPromptsContext.Provider>
  );
};

export default SystemPrompts;
