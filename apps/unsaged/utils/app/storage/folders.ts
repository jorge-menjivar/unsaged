import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { FolderInterface } from '@/types/folder';

export const storageGetFolders = async (database: Database, user: User) => {
  return await database.getFolders(user);
};

export const storageUpdateFolders = async (
  database: Database,
  user: User,
  folders: FolderInterface[],
) => {
  await database.updateFolders(user, folders).then((success) => {
    if (!success) {
      console.error('Failed to update folders');
    }
  });
};

export const storageDeleteFolders = async (
  database: Database,
  user: User,
  folderIds: string[],
) => {
  await database.deleteFolders(user, folderIds).then((success) => {
    if (!success) {
      console.error('Failed to delete folders');
    }
  });
};
