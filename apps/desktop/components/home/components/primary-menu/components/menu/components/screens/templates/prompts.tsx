import { IconFolderPlus, IconMistOff } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { TemplateFolders } from './components/folders';
import { PromptList } from './components/template-list';
import Search from '@/components/common/Search';
import { Button } from '@/components/common/ui/button';

import PromptsContext from './prompts.context';
import { PromptsInitialState, initialState } from './prompts.state';

import { useFolders } from '@/providers/folders';
import { useTemplates } from '@/providers/templates';

const Templates = () => {
  const { t } = useTranslation('templates-bar');

  const { templates, createTemplate, updateTemplate } = useTemplates();

  const { createFolder } = useFolders();

  const promptBarContextValue = useCreateReducer<PromptsInitialState>({
    initialState,
  });

  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: e.target.dataset.folderId,
      };

      updateTemplate(updatedPrompt);

      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: templates.filter((prompt) => {
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
      promptDispatch({ field: 'filteredPrompts', value: templates });
    }
  }, [searchTerm, templates, promptDispatch]);

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
    <PromptsContext.Provider
      value={{
        ...promptBarContextValue,
      }}
    >
      <div className="flex items-center gap-x-2">
        <Button
          onClick={() => {
            createTemplate();
            doSearch('');
          }}
        >
          {t('New message template')}
        </Button>

        <Button
          variant="secondary"
          onClick={() => createFolder(t('New folder'), 'prompt')}
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
        {filteredPrompts?.length > 0 && (
          <div
            className="flex border-b pb-2
          border-theme-button-border-light dark:border-theme-button-border-dark"
          >
            <TemplateFolders />
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
              templates={filteredPrompts.filter((prompt) => !prompt.folderId)}
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

export default Templates;
