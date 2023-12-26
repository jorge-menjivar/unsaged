import { FolderInterface } from '@/types/folder';

export async function localCreateFolder(newFolder: FolderInterface) {
  const itemName = `folders`;
  const folders = JSON.parse(localStorage.getItem(itemName) || '[]');
  const updatedFolders = [...folders, newFolder];
  localStorage.setItem(itemName, JSON.stringify(updatedFolders));
  return true;
}

export async function localUpdateFolder(folder: FolderInterface) {
  const itemName = `folders`;

  try {
    const folders = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as FolderInterface[];
    const updatedFolders = folders.map((f) => {
      if (f.id === folder.id) {
        return folder;
      }
      return f;
    });
    localStorage.setItem(itemName, JSON.stringify(updatedFolders));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteFolder(folderId: string) {
  try {
    const itemName = `folders`;
    const folders = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as FolderInterface[];
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    localStorage.setItem(itemName, JSON.stringify(updatedFolders));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function localGetFolders() {
  try {
    const itemName = `folders`;
    return JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as FolderInterface[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function localUpdateFolders(updatedFolders: FolderInterface[]) {
  try {
    const itemName = `folders`;
    const folders = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as FolderInterface[];

    const allUpdatedFolders = folders.map((f) => {
      const updatedFolder = updatedFolders.find((uf) => uf.id === f.id);
      if (updatedFolder) {
        return updatedFolder;
      }
      return f;
    });

    localStorage.setItem(itemName, JSON.stringify(allUpdatedFolders));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function localDeleteFolders(folderIds: string[]) {
  try {
    const itemName = `folders`;
    const folders = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as FolderInterface[];
    const updatedFolders = folders.filter((f) => !folderIds.includes(f.id));
    localStorage.setItem(itemName, JSON.stringify(updatedFolders));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
