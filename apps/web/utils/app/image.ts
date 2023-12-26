import { Conversation, ImageBody } from '@/types/chat';
import { SavedSetting } from '@/types/settings';

import { getSavedSettingValue } from './storage/local/settings';

export const sendImageRequest = async (
  conversation: Conversation,
  prompt: string,
  savedSetting: SavedSetting[],
) => {
  const apiKey: string | undefined = getSavedSettingValue(
    savedSetting,
    conversation.model.vendor.toLowerCase(),
    'api_key',
  );

  const imageBody: ImageBody = {
    model: conversation.model,
    prompt,
    apiKey: apiKey,
    params: conversation.params,
  };

  let body = JSON.stringify(imageBody);
  const controller = new AbortController();
  const response = await fetch('api/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    body,
  });

  return { response: response, controller: controller };
};
