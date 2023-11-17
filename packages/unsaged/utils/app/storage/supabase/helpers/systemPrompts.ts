import { SupaDatabase } from '../types/supabase';
import { SystemPrompt } from '@/types/system-prompt';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaGetSystemPrompts = async (
  supabase: SupabaseClient<SupaDatabase>,
) => {
  const { data: supaSystemPrompts, error } = await supabase
    .from('system_prompts')
    .select('*');

  if (error) {
    return [];
  }

  const systemPrompts: SystemPrompt[] = supaSystemPrompts.map((p) => ({
    id: p.id,
    content: p.content,
    name: p.name,
    folderId: p.folder_id,
    models: p.models,
  }));

  return systemPrompts;
};

export const supaUpdateSystemPrompts = async (
  supabase: SupabaseClient<SupaDatabase>,
  updatedSystemPrompts: SystemPrompt[],
) => {
  const updates = updatedSystemPrompts.map((p) =>
    supabase
      .from('system_prompts')
      .update({
        content: p.content,
        name: p.name,
        folder_id: p.folderId,
        models: p.models,
      })
      .eq('id', p.id),
  );

  const results = await Promise.all(updates);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};

export const supaDeleteSystemPrompts = async (
  supabase: SupabaseClient<SupaDatabase>,
  promptIds: string[],
) => {
  const deletes = promptIds.map((id) =>
    supabase.from('system_prompts').delete().eq('id', id),
  );

  const results = await Promise.all(deletes);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};
