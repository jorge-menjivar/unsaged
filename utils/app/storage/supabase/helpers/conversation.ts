import { SupaDatabase } from '../types/supabase';
import { Conversation } from '@/types/chat';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaCreateConversation = async (
  supabase: SupabaseClient<SupaDatabase>,
  newConversation: Conversation,
) => {
  const supaConversation: SupaDatabase['public']['Tables']['conversations']['Insert'] =
    {
      id: newConversation.id,
      name: newConversation.name,
      model_id: newConversation.model.id,
      system_prompt_id: newConversation.systemPrompt?.id,
      folder_id: newConversation.folderId,
      timestamp: newConversation.timestamp,
      // @ts-ignore
      params: newConversation.params,
    };

  const { error } = await supabase
    .from('conversations')
    .insert(supaConversation);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaUpdateConversation = async (
  supabase: SupabaseClient<SupaDatabase>,
  updatedConversation: Conversation,
) => {
  const supaConversation: SupaDatabase['public']['Tables']['conversations']['Insert'] =
    {
      id: updatedConversation.id,
      name: updatedConversation.name,
      model_id: updatedConversation.model.id,
      system_prompt_id: updatedConversation.systemPrompt?.id,
      folder_id: updatedConversation.folderId,
      timestamp: updatedConversation.timestamp,
      // @ts-ignore
      params: updatedConversation.params,
    };

  const { error } = await supabase
    .from('conversations')
    .upsert(supaConversation)
    .eq('id', updatedConversation.id);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaDeleteConversation = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
) => {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .match({ id: conversationId });

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
