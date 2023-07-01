import { SupaDatabase } from '../types/supabase';
import { Message } from '@/types/chat';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaGetMessages = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
) => {
  const { data: supaMessages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });

  if (error) {
    return [];
  }

  const messages = supaMessages.map((supaMessage) => {
    const message: Message = {
      id: supaMessage.id,
      content: supaMessage.content,
      role: supaMessage.role as Message['role'],
      timestamp: supaMessage.timestamp,
    };

    return message;
  });

  return messages;
};
export const supaCreateMessages = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
  newMessages: Message[],
) => {
  const supaMessages: SupaDatabase['public']['Tables']['messages']['Insert'][] =
    newMessages.map((message) => ({
      id: message.id,
      content: message.content,
      role: message.role,
      conversation_id: conversationId,
      timestamp: message.timestamp,
    }));

  const { error } = await supabase.from('messages').insert(supaMessages);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaUpdateMessages = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
  updatedMessages: Message[],
) => {
  const updates = updatedMessages.map((message) =>
    supabase
      .from('messages')
      .upsert({
        content: message.content,
        role: message.role,
        conversation_id: conversationId,
        timestamp: message.timestamp,
      })
      .eq('id', message.id)
      .eq('conversation_id', conversationId),
  );

  const results = await Promise.all(updates);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};

export const supaDeleteMessages = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
  messageIds: string[],
) => {
  const deletes = messageIds.map((messageId) =>
    supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('conversation_id', conversationId),
  );

  const results = await Promise.all(deletes);
  const hasErrors = results.some((result) => result.error);

  return !hasErrors;
};
