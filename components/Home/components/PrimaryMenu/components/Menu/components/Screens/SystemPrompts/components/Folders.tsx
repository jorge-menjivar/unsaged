import { useContext } from 'react';

import { FolderInterface } from '@/types/folder';

import Folder from '@/components/Common/Folder';
import HomeContext from '@/components/Home/home.context';

import SystemPromptsContext from '../SystemPrompts.context';
import { SystemPromptComponent } from './SystemPromptComponent';

export const SystemPromptFolders = () => {
  const {
    state: { folders },
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredSystemPrompts },
    handleUpdateSystemPrompt,
  } = useContext(SystemPromptsContext);

  const handleDrop = (e: any, folder: FolderInterface) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('system_prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: folder.id,
      };

      handleUpdateSystemPrompt(updatedPrompt);
    }
  };

  const Folders = (currentFolder: FolderInterface) =>
    filteredSystemPrompts
      .filter((p) => p.folderId)
      .map((systemPrompt, index) => {
        if (systemPrompt.folderId === currentFolder.id) {
          return (
            <div
              key={index}
              className="ml-5 gap-2 border-l border-theme-button-border-light dark:border-theme-button-border-dark pl-2"
            >
              <SystemPromptComponent systemPrompt={systemPrompt} />
            </div>
          );
        }
      });

  return (
    <div className="flex w-full flex-col pt-2">
      {folders
        .filter((folder) => folder.type === 'prompt')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((folder, index) => (
          <Folder
            key={index}
            searchTerm={searchTerm}
            currentFolder={folder}
            handleDrop={handleDrop}
            folderComponent={Folders(folder)}
          />
        ))}
    </div>
  );
};
