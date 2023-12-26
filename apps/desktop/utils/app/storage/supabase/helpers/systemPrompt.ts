import { SupaDatabase } from '../types/supabase';
import { SystemPrompt } from '@/types/system-prompt';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaCreateSystemPrompt = async (
  supabase: SupabaseClient<SupaDatabase>,
  newPrompt: SystemPrompt,
) => {
  const supaPrompt: SupaDatabase['public']['Tables']['system_prompts']['Insert'] =
    {
      id: newPrompt.id,
      content: newPrompt.content,
      name: newPrompt.name,
      models: newPrompt.models,
    };

  const { error } = await supabase.from('system_prompts').insert(supaPrompt);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaGetSystemPrompt = async (
  supabase: SupabaseClient<SupaDatabase>,
  promptId: string,
) => {
  const { data: supaSystemPrompts, error } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('id', promptId);

  if (error) {
    console.error(error);
    return null;
  }

  if (supaSystemPrompts?.[0]) {
    const supaSystemPrompt = supaSystemPrompts[0];
    const systemPrompt: SystemPrompt = {
      id: supaSystemPrompt.id,
      name: supaSystemPrompt.name,
      models: supaSystemPrompt.models,
      content: supaSystemPrompt.content,
      folderId: supaSystemPrompt.folder_id,
    };

    return systemPrompt;
  }
  return null;
};

export const supaUpdateSystemPrompt = async (
  supabase: SupabaseClient<SupaDatabase>,
  updatedPrompt: SystemPrompt,
) => {
  const { error } = await supabase
    .from('system_prompts')
    .update({
      content: updatedPrompt.content,
      name: updatedPrompt.name,
      models: updatedPrompt.models,
    })
    .eq('id', updatedPrompt.id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaDeleteSystemPrompt = async (
  supabase: SupabaseClient<SupaDatabase>,
  promptId: string,
) => {
  const { error } = await supabase
    .from('system_prompts')
    .delete()
    .eq('id', promptId);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
