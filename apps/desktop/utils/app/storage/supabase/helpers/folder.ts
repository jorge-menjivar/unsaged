import { SupaDatabase } from '../types/supabase';
import { FolderInterface } from '@/types/folder';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaCreateFolder = async (
  supabase: SupabaseClient<SupaDatabase>,
  newFolder: FolderInterface,
) => {
  const supaFolder: SupaDatabase['public']['Tables']['folders']['Insert'] = {
    id: newFolder.id,
    name: newFolder.name,
    folder_type: newFolder.type,
  };
  const { error } = await supabase.from('folders').insert([supaFolder]);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaUpdateFolder = async (
  supabase: SupabaseClient<SupaDatabase>,
  folder: FolderInterface,
) => {
  const { error } = await supabase
    .from('folders')
    .update({
      name: folder.name,
      folder_type: folder.type,
    })
    .eq('id', folder.id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaDeleteFolder = async (
  supabase: SupabaseClient<SupaDatabase>,
  folderId: string,
) => {
  const { error } = await supabase.from('folders').delete().eq('id', folderId);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
