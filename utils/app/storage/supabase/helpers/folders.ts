import { SupaDatabase } from '../types/supabase';
import { FolderInterface } from '@/types/folder';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaGetFolders = async (
  supabase: SupabaseClient<SupaDatabase>,
) => {
  const { data, error } = await supabase.from('folders').select('*');

  if (error) {
    return [];
  }

  const folders: FolderInterface[] = data.map((supaFolder) => {
    return {
      id: supaFolder.id,
      name: supaFolder.name,
      type: supaFolder.folder_type as FolderInterface['type'],
    };
  });
  return folders;
};

export const supaUpdateFolders = async (
  supabase: SupabaseClient<SupaDatabase>,
  folders: FolderInterface[],
) => {
  const updates = folders.map((folder) =>
    supabase
      .from('folders')
      .upsert({
        id: folder.id,
        name: folder.name,
        folder_type: folder.type,
      })
      .eq('id', folder.id),
  );

  const results = await Promise.all(updates);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};

export const supaDeleteFolders = async (
  supabase: SupabaseClient<SupaDatabase>,
  folderIds: string[],
) => {
  const deletes = folderIds.map((folderId) =>
    supabase.from('folders').delete().eq('id', folderId),
  );

  const results = await Promise.all(deletes);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};
