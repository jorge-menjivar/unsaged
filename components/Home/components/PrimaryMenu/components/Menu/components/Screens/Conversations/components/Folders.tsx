import { useContext } from 'react';

import { FolderInterface } from '@/types/folder';

import Folder from '@/components/Common/Folder';
import HomeContext from '@/components/Home/home.context';

import { ConversationComponent } from './ConversationComponent';

interface Props {
  searchTerm: string;
}

export const ConversationsFolders = ({ searchTerm }: Props) => {
  const {
    state: { folders, conversations },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const handleDrop = (e: any, folder: FolderInterface) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversation(conversation, {
        key: 'folderId',
        value: folder.id,
      });
    }
  };

  const Folders = (currentFolder: FolderInterface) => {
    return (
      conversations &&
      conversations
        .filter((conversation) => conversation.folderId)
        .map((conversation, index) => {
          if (conversation.folderId === currentFolder.id) {
            return (
              <div
                key={index}
                className="ml-5 gap-2 border-l border-theme-button-border-light dark:border-theme-button-border-dark pl-2"
              >
                <ConversationComponent conversation={conversation} />
              </div>
            );
          }
        })
    );
  };

  return (
    <div className="flex w-full flex-col pt-2">
      {folders
        .filter((folder) => folder.type === 'chat')
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
