import { PossibleAiModels } from '@/types/ai-models';
import { Conversation, Message } from '@/types/chat';

import { DEFAULT_TEMPERATURE, OPENAI_API_TYPE } from '../const';

export function getConversationsFromChatbotUIFile(
  chatbotUIConversations: any[],
) {
  if (!Array.isArray(chatbotUIConversations)) {
    console.warn('history is not an array. Returning an empty array.');
    return [];
  }

  const unSagedConversations: Conversation[] = [];

  for (const chatbotUIConversation of chatbotUIConversations) {
    try {
      if (!chatbotUIConversation.model_id) {
        chatbotUIConversation.model =
          OPENAI_API_TYPE === 'azure'
            ? PossibleAiModels['gpt-35-turbo']
            : PossibleAiModels['gpt-3.5-turbo'];
      }

      const cleanConversation: Conversation = {
        id: chatbotUIConversation.id,
        name: chatbotUIConversation.name,
        model: chatbotUIConversation.model,
        systemPrompt: chatbotUIConversation.systemPrompt || null,
        temperature: chatbotUIConversation.temperature || DEFAULT_TEMPERATURE,
        folderId: chatbotUIConversation.folderId || null,
        timestamp: chatbotUIConversation.timestamp || new Date().toISOString(),
      };

      unSagedConversations.push(cleanConversation);
    } catch (error) {
      console.warn(
        'Error while transforming chatbotUI conversation to unsaged conversation. Skipping conversation.\n',
        error,
      );
    }
  }

  return unSagedConversations;
}

export function getMessagesFromChatbotUIFile(chatbotUIConversations: any[]) {
  if (!Array.isArray(chatbotUIConversations)) {
    console.warn('history is not an array. Returning an empty array.');
    return [];
  }

  const unSagedMessages: Message[] = [];

  for (const chatbotUIConversation of chatbotUIConversations) {
    try {
      const chatbotUIMessages = chatbotUIConversation.messages;

      const unsagedMessage: Message = {
        id: chatbotUIMessages.id,
        role: chatbotUIMessages.role,
        content: chatbotUIMessages.content,
        conversationId: chatbotUIMessages.conversationId,
        timestamp: chatbotUIMessages.timestamp,
      };

      unSagedMessages.push(unsagedMessage);
    } catch (error) {
      console.warn(
        'Error while transforming chatbotUI messages to unsaged messages. Skipping message.\n',
        error,
      );
    }
  }

  return unSagedMessages;
}
