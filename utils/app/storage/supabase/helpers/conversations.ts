import { SupaDatabase } from '../types/supabase';
import { AiModel, PossibleAiModels } from '@/types/ai-models';
import { Conversation } from '@/types/chat';
import { SystemPrompt } from '@/types/system-prompt';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaGetConversations = async (
  supabase: SupabaseClient<SupaDatabase>,
  systemPrompts: SystemPrompt[],
  models: AiModel[],
) => {
  const { data: supaConversations, error } = await supabase
    .from('conversations')
    .select('*')
    .order('timestamp', { ascending: true });
  if (error) {
    return [];
  } else {
    const conversations: Conversation[] = [];
    for (const supaConversation of supaConversations) {
      let systemPrompt: SystemPrompt | null = null;
      if (supaConversation.system_prompt_id) {
        systemPrompt =
          systemPrompts.find(
            (p) => p.id === supaConversation.system_prompt_id,
          ) || null;
      }

      if (
        supaConversation.model_id === 'claude-instant-v1' ||
        supaConversation.model_id === 'claude-instant-v1-100k'
      ) {
        supaConversation.model_id = 'claude-instant-1';
      } else if (
        supaConversation.model_id === 'claude-v1' ||
        supaConversation.model_id === 'claude-v1-100k'
      ) {
        supaConversation.model_id = 'claude-2';
      }

      const selectedModel = models.find(
        (model) => model.id === supaConversation.model_id,
      );

      const conversation: Conversation = {
        id: supaConversation.id,
        name: supaConversation.name,
        model: selectedModel!,
        systemPrompt: systemPrompt,
        temperature: supaConversation.temperature,
        folderId: supaConversation.folder_id,
        timestamp: supaConversation.timestamp,
      };

      conversations.push(conversation);
    }
    return conversations;
  }
};

export const supaUpdateConversations = async (
  supabase: SupabaseClient<SupaDatabase>,
  updatedConversations: Conversation[],
) => {
  for (const conversation of updatedConversations) {
    const { error } = await supabase
      .from('conversations')
      .upsert({
        id: conversation.id,
        name: conversation.name,
        model_id: conversation.model.id,
        system_prompt_id: conversation.systemPrompt?.id || null,
        temperature: conversation.temperature,
        folder_id: conversation.folderId,
        timestamp: conversation.timestamp,
      })
      .eq('id', conversation.id);
    if (error) {
      console.error(error);
      return false;
    }
  }

  return true;
};

export const supaDeleteConversations = async (
  supabase: SupabaseClient<SupaDatabase>,
) => {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
