import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { FolderInterface } from '@/types/folder';

import { v4 as uuidv4 } from 'uuid';

export const storageCreateFolder = (
  database: Database,
  user: User,
  name: string,
  folderType: FolderInterface['type'],
  allFolders: FolderInterface[],
) => {
  const newFolder: FolderInterface = {
    id: uuidv4(),
    name,
    type: folderType,
  };

  const updatedFolders = [...allFolders, newFolder];

  database.createFolder(user, newFolder).then((success) => {
    if (!success) {
      console.error('Failed to create folder');
    }
  });

  return updatedFolders;
};

export const storageUpdateFolder = (
  database: Database,
  user: User,
  folderId: string,
  name: string,
  allFolders: FolderInterface[],
) => {
  let updatedFolder: FolderInterface | null = null;
  const updatedFolders = allFolders.map((f) => {
    if (f.id === folderId) {
      updatedFolder = {
        ...f,
        name,
      };

      return updatedFolder;
    }

    return f;
  });

  database.updateFolder(user, updatedFolder!).then((success) => {
    if (!success) {
      console.error('Failed to update folder');
    }
  });

  return updatedFolders;
};

export const storageDeleteFolder = (
  database: Database,
  user: User,
  folderId: string,
  allFolders: FolderInterface[],
) => {
  const updatedFolders = allFolders.filter((f) => f.id !== folderId);

  database.deleteFolder(user, folderId).then((success) => {
    if (!success) {
      console.error('Failed to delete folder');
    }
  });

  return updatedFolders;
};
