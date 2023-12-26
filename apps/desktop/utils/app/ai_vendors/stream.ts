import { AiModel, ModelParams } from '@/types/ai-models';
import { Message } from '@/types/chat';
import { SavedSettings } from '@/types/settings';

import { invoke } from '@tauri-apps/api/tauri';

export async function getStream(
  savedSettings: SavedSettings,
  model: AiModel,
  systemPrompt: string,
  params: ModelParams,
  apiKey: string | undefined,
  messages: Message[],
  tokenCount: number,
  controller: AbortController,
  assistantMessageId: string,
): Promise<{
  stream: ReadableStream | null;
  error: string | null | undefined;
}> {
  const payload = {
    saved_settings: savedSettings,
    model: {
      name: model.name,
      id: model.id,
      token_limit: model.tokenLimit,
      vendor: model.vendor,
    },
    system_prompt: systemPrompt,
    params: params,
    api_key: apiKey,
    messages: messages.map((message) => {
      return {
        id: message.id,
        role: message.role,
        content: message.content,
        conversation_id: message.conversationId,
        timestamp: message.timestamp,
      };
    }, []),
    token_count: tokenCount,
    assistant_message_id: assistantMessageId,
  };

  if (model.vendor === 'OpenAI') {
    await invoke('stream_openai', payload);
  } else if (model.vendor === 'Azure') {
    await invoke('stream_azure', payload);
  } else if (model.vendor === 'Anthropic') {
    await invoke('stream_anthropic', payload);
  } else if (model.vendor === 'Google') {
    await invoke('stream_google', payload);
  } else if (model.vendor === 'Ollama') {
    await invoke('stream_ollama', payload);
  }
  return { stream: null, error: 'Unknown vendor' };
}
