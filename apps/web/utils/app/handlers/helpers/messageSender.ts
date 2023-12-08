import toast from 'react-hot-toast';

import { Conversation, Message } from '@/types/chat';
import { SavedSetting } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { sendChatRequest } from '../../chat';

export async function messageSender(
  builtInSystemPrompts: SystemPrompt[],
  selectedConversation: Conversation,
  messages: Message[],
  savedSettings: SavedSetting[],
  dispatch: React.Dispatch<any>,
) {
  let customPrompt = selectedConversation.systemPrompt;

  if (!selectedConversation.systemPrompt) {
    customPrompt = builtInSystemPrompts.filter(
      (prompt) =>
        prompt.name === `${selectedConversation.model.vendor} Built-In`,
    )[0];
  }

  const promptInjectedConversation = {
    ...selectedConversation,
    systemPrompt: customPrompt,
  };

  const { response, controller } = await sendChatRequest(
    promptInjectedConversation,
    messages,
    savedSettings,
  );

  if (!response.ok) {
    dispatch({ field: 'loading', value: false });
    dispatch({ field: 'messageIsStreaming', value: false });
    toast.error(response.statusText);
    return { data: null, controller: null };
  }
  const data = response.body;
  if (!data) {
    dispatch({ field: 'loading', value: false });
    dispatch({ field: 'messageIsStreaming', value: false });
    return { data: null, controller: null };
  }

  dispatch({ field: 'loading', value: false });
  return { data, controller };
}
