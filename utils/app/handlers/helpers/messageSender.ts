import toast from 'react-hot-toast';

import { Conversation } from '@/types/chat';
import { SavedSetting } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { sendChatRequest } from '../../chat';

export async function messageSender(
  builtInSystemPrompts: SystemPrompt[],
  updatedConversation: Conversation,
  selectedConversation: Conversation,
  savedSettings: SavedSetting[],
  homeDispatch: React.Dispatch<any>,
) {
  let customPrompt = selectedConversation.systemPrompt;

  console.log('selectedConversation', selectedConversation);

  console.log('customPrompt', customPrompt);
  console.log('builtInSystemPrompts', builtInSystemPrompts);

  if (!selectedConversation.systemPrompt) {
    customPrompt = builtInSystemPrompts.filter(
      (prompt) =>
        prompt.name === `${selectedConversation.model.vendor} Built-In`,
    )[0];
  }

  const promptInjectedConversation = {
    ...updatedConversation,
    systemPrompt: customPrompt,
  };

  const { response, controller } = await sendChatRequest(
    promptInjectedConversation,
    savedSettings,
  );

  if (!response.ok) {
    homeDispatch({ field: 'loading', value: false });
    homeDispatch({ field: 'messageIsStreaming', value: false });
    toast.error(response.statusText);
    return { data: null, controller: null };
  }
  const data = response.body;
  if (!data) {
    homeDispatch({ field: 'loading', value: false });
    homeDispatch({ field: 'messageIsStreaming', value: false });
    return { data: null, controller: null };
  }

  homeDispatch({ field: 'loading', value: false });
  return { data, controller };
}
