import { SupaDatabase } from '../types/supabase';
import { Prompt } from '@/types/prompt';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaGetPrompts = async (
  supabase: SupabaseClient<SupaDatabase>,
) => {
  const { data: supaPrompts, error } = await supabase
    .from('prompts')
    .select('*');

  if (error) {
    return [];
  }

  const prompts = supaPrompts.map((supaPrompt) => {
    const prompt: Prompt = {
      id: supaPrompt.id,
      content: supaPrompt.content,
      description: supaPrompt.description,
      folderId: supaPrompt.folder_id,
      models: supaPrompt.models,
      name: supaPrompt.name,
    };

    return prompt;
  });

  return prompts;
};

export const supaUpdatePrompts = async (
  supabase: SupabaseClient<SupaDatabase>,
  updatedPrompts: Prompt[],
) => {
  const updates = updatedPrompts.map((prompt) =>
    supabase
      .from('prompts')
      .upsert({
        id: prompt.id,
        content: prompt.content,
        description: prompt.description,
        folder_id: prompt.folderId,
        models: prompt.models,
        name: prompt.name,
      })
      .eq('id', prompt.id),
  );

  const results = await Promise.all(updates);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};

export const supaDeletePrompts = async (
  supabase: SupabaseClient<SupaDatabase>,
  promptIds: string[],
) => {
  const deletes = promptIds.map((promptId) =>
    supabase.from('prompts').delete().eq('id', promptId),
  );

  const results = await Promise.all(deletes);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};
