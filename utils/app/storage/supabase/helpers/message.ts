import { SupaDatabase } from '../types/supabase';
import { Message } from '@/types/chat';

import { SupabaseClient } from '@supabase/supabase-js';

export const supaCreateMessage = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
  newMessage: Message,
) => {
  const supaMessage: SupaDatabase['public']['Tables']['messages']['Insert'] = {
    id: newMessage.id,
    content: newMessage.content,
    role: newMessage.role,
    conversation_id: conversationId,
    timestamp: newMessage.timestamp,
  };

  const { error } = await supabase.from('messages').insert(supaMessage);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
export const supaUpdateMessage = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
  updatedMessage: Message,
) => {
  const { error } = await supabase
    .from('messages')
    .update({
      content: updatedMessage.content,
      role: updatedMessage.role,
    })
    .eq('id', updatedMessage.id)
    .eq('conversation_id', conversationId);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const supaDeleteMessage = async (
  supabase: SupabaseClient<SupaDatabase>,
  conversationId: string,
  messageId: string,
) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
    .eq('conversation_id', conversationId);

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
