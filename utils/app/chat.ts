import { ChatBody, Conversation, Message } from '@/types/chat';
import { SavedSetting } from '@/types/settings';

import { getSavedSettingValue } from './storage/local/settings';

export const sendChatRequest = async (
  conversation: Conversation,
  messages: Message[],
  savedSetting: SavedSetting[],
) => {
  const apiKey: string | undefined = getSavedSettingValue(
    savedSetting,
    conversation.model.vendor.toLowerCase(),
    'api_key',
  );

  const chatBody: ChatBody = {
    model: conversation.model,
    messages: messages,
    apiKey: apiKey,
    systemPrompt: conversation.systemPrompt!,
    temperature: conversation.temperature,
  };

  let body = JSON.stringify(chatBody);
  const controller = new AbortController();
  const response = await fetch('api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    body,
  });

  return { response: response, controller: controller };
};
