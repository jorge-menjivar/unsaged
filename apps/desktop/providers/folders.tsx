import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  storageCreateFolder,
  storageDeleteFolder,
  storageUpdateFolder,
} from '@/utils/app/storage/folder';
import {
  storageDeleteFolders,
  storageGetFolders,
} from '@/utils/app/storage/folders';
import { error } from '@/utils/logging';

import { FolderInterface } from '@/types/folder';

import { useAuth } from './auth';
import { useDatabase } from './database';

export const FoldersContext = createContext<{
  folders: FolderInterface[];
  setFolders: (folders: FolderInterface[]) => void;
  createFolder: (name: string, type: FolderInterface['type']) => void;
  updateFolder: (folderId: string, name: string) => void;
  deleteFolder: (folderId: string) => void;
  clearFolders: (folderType: FolderInterface['type']) => void;
}>({
  folders: [],
  setFolders: () => {},
  createFolder: () => {},
  updateFolder: () => {},
  deleteFolder: () => {},
  clearFolders: () => {},
});

export const FoldersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const { database } = useDatabase();

  const [folders, setFolders] = useState<FolderInterface[]>([]);
  const isInitialized = useRef(false);

  const fetchFolders = useCallback(async () => {
    if (isInitialized.current || !database || !session) {
      return;
    }

    isInitialized.current = true;

    const _folders = await storageGetFolders(database, session.user!);

    setFolders(_folders);
  }, [database, session]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const createFolder = async (name: string, type: FolderInterface['type']) => {
    if (!database || !session) return;

    const updatedFolders = storageCreateFolder(
      database,
      session.user!,
      name,
      type,
      folders,
    );

    setFolders(updatedFolders);
  };

  const updateFolder = async (folderId: string, name: string) => {
    if (!database || !session) return;
    const updatedFolders = storageUpdateFolder(
      database,
      session.user!,
      folderId,
      name,
      folders,
    );

    setFolders(updatedFolders);
  };

  const deleteFolder = async (folderId: string) => {
    if (!database || !session) return;

    const updatedFolders = folders.filter((f) => f.id !== folderId);
    setFolders(updatedFolders);

    // TODO: Should be handled when reading data from storage. Should validate that folderId is not null.
    // const updatedConversations: Conversation[] = conversations.map((c) => {
    //   if (c.folderId === folderId) {
    //     return {
    //       ...c,
    //       folderId: null,
    //     };
    //   }

    //   return c;
    // });

    // setConversations(updatedConversations);

    // const updatedTemplates: Template[] = templates.map((t) => {
    //   if (t.folderId === folderId) {
    //     return {
    //       ...t,
    //       folderId: null,
    //     };
    //   }

    //   return t;
    // });

    // setTemplates(updatedTemplates);

    // const updatedSystemPrompts: SystemPrompt[] = systemPrompts.map((s) => {
    //   if (s.folderId === folderId) {
    //     return {
    //       ...s,
    //       folderId: null,
    //     };
    //   }

    //   return s;
    // });

    // setSystemPrompts(updatedSystemPrompts);

    // await storageUpdateConversations(
    //   database,
    //   session.user!,
    //   updatedConversations,
    // );
    // await storageUpdateTemplates(database, session.user!, updatedTemplates);
    // await storageUpdateSystemPrompts(
    //   database,
    //   session.user!,
    //   updatedSystemPrompts,
    // );

    storageDeleteFolder(database, session.user!, folderId, folders);
  };

  async function clearFolders(folderType: FolderInterface['type']) {
    if (!database || !session) return;

    const deletedFolders = folders.filter((f) => f.type === folderType);

    const deletedFolderIds = deletedFolders.map((f) => f.id);

    storageDeleteFolders(database, session.user!, deletedFolderIds);

    const updatedFolders = folders.filter((f) => f.type !== folderType);

    setFolders(updatedFolders);
  }

  const contextValue = {
    folders,
    setFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    clearFolders,
  };

  return (
    <FoldersContext.Provider value={contextValue}>
      {children}
    </FoldersContext.Provider>
  );
};

export const useFolders = () => {
  const context = useContext(FoldersContext);
  if (!context) {
    error('useFolders must be used within an FoldersProvider');
  }
  return context;
};
