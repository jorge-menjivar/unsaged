import { Conversation, Message } from '@/types/chat';
import { SavedSettings } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { sendChatRequest } from '../../chat';

export async function messageSender(
  builtInSystemPrompts: SystemPrompt[],
  selectedConversation: Conversation,
  messages: Message[],
  savedSettings: SavedSettings,
  dispatch: React.Dispatch<any>,
): Promise<{
  stream: ReadableStream | null;
  controller: AbortController | null;
}> {
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

  const { stream, controller } = await sendChatRequest(
    promptInjectedConversation,
    messages,
    savedSettings,
  );

  if (!stream || !controller) {
    dispatch({ field: 'loading', value: false });
    dispatch({ field: 'messageIsStreaming', value: false });
    return { stream: null, controller: null };
  }

  dispatch({ field: 'loading', value: false });
  return { stream, controller };
}
