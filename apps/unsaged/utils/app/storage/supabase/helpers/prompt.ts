import { SupaDatabase } from '../types/supabase';
import { Prompt } from '@/types/prompt';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaCreatePrompt = async (
  supabase: SupabaseClient<SupaDatabase>,
  newPrompt: Prompt,
) => {
  const supaPrompt: SupaDatabase['public']['Tables']['prompts']['Insert'] = {
    id: newPrompt.id,
    content: newPrompt.content,
    description: newPrompt.description,
    folder_id: newPrompt.folderId,
    models: newPrompt.models,
    name: newPrompt.name,
  };

  const { error } = await supabase.from('prompts').insert(supaPrompt);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaUpdatePrompt = async (
  supabase: SupabaseClient<SupaDatabase>,
  updatedPrompt: Prompt,
) => {
  const { error } = await supabase
    .from('prompts')
    .update({
      content: updatedPrompt.content,
      description: updatedPrompt.description,
      folder_id: updatedPrompt.folderId,
      models: updatedPrompt.models,
      name: updatedPrompt.name,
    })
    .eq('id', updatedPrompt.id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaDeletePrompt = async (
  supabase: SupabaseClient<SupaDatabase>,
  promptId: string,
) => {
  const { error } = await supabase.from('prompts').delete().eq('id', promptId);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
