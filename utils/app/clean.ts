import { PossibleAiModels } from '@/types/ai-models';
import { Conversation, Message } from '@/types/chat';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';

import { DEFAULT_TEMPERATURE, OPENAI_API_TYPE } from './const';
import { getTimestampWithTimezoneOffset } from './time/time';

import { v4 as uuidv4 } from 'uuid';

export const cleanSelectedConversation = (conversation: Conversation) => {
  let updatedConversation = conversation;

  if (!updatedConversation.temperature) {
    updatedConversation = {
      ...updatedConversation,
      temperature: updatedConversation.temperature || DEFAULT_TEMPERATURE,
    };
  }

  if (!updatedConversation.folderId) {
    updatedConversation = {
      ...updatedConversation,
      folderId: updatedConversation.folderId || null,
    };
  }

  if (!updatedConversation.messages) {
    updatedConversation = {
      ...updatedConversation,
      messages: updatedConversation.messages || [],
    };
  }

  return updatedConversation;
};

export const cleanFolders = (importedFolders: any[]): FolderInterface[] => {
  if (!Array.isArray(importedFolders)) {
    console.warn('importedFolders is not an array. Returning an empty array.');
    return [];
  }

  const folders = [];
  for (const rawFolder of importedFolders) {
    try {
      const folder: FolderInterface = {
        id: rawFolder.id || uuidv4(),
        name: rawFolder.name || '',
        type: rawFolder.type || 'chat',
      };

      folders.push(folder);
    } catch (error) {
      console.warn(`error while cleaning prompts. Removing culprit`, error);
    }
  }

  return folders;
};

export const cleanMessageTemplates = (importedPrompts: any[]): Prompt[] => {
  if (!Array.isArray(importedPrompts)) {
    console.warn('importedPrompts is not an array. Returning an empty array.');
    return [];
  }

  const prompts = [];
  for (const rawPrompt of importedPrompts) {
    try {
      const prompt: Prompt = {
        id: rawPrompt.id || uuidv4(),
        name: rawPrompt.name || '',
        content: rawPrompt.content || '',
        description: rawPrompt.description || '',
        folderId: rawPrompt.folderId || null,
        models: rawPrompt.models || [],
      };

      prompts.push(prompt);
    } catch (error) {
      console.warn(`error while cleaning prompts. Removing culprit`, error);
    }
  }

  return prompts;
};

export const cleanConversationHistory = (history: any[]): Conversation[] => {
  if (!Array.isArray(history)) {
    console.warn('history is not an array. Returning an empty array.');
    return [];
  }

  const conversations = [];

  for (const raw_conversation of history) {
    try {
      if (!raw_conversation.model_id) {
        raw_conversation.model =
          OPENAI_API_TYPE === 'azure'
            ? PossibleAiModels['gpt-35-az']
            : PossibleAiModels['gpt-3.5-turbo'];
      }

      if (raw_conversation.messages) {
        const messages: Message[] = [];
        let secondsOffset = 0;
        for (const rawMessage of raw_conversation.messages) {
          try {
            const message: Message = {
              id: rawMessage.id || uuidv4(),
              content: rawMessage.content || '',
              timestamp:
                rawMessage.timestamp ||
                getTimestampWithTimezoneOffset(secondsOffset++),
              role: rawMessage.role,
            };
            messages.push(message);
          } catch (error) {
            console.warn(
              `error while cleaning messages' history. Removing culprit`,
              error,
            );
          }
        }
        raw_conversation.messages = messages;
      }

      const conversation: Conversation = {
        id: raw_conversation.id,
        name: raw_conversation.name,
        model: raw_conversation.model,
        systemPrompt: raw_conversation.systemPrompt || null,
        temperature: raw_conversation.temperature || DEFAULT_TEMPERATURE,
        folderId: raw_conversation.folderId || null,
        messages: raw_conversation.messages || [],
        timestamp:
          raw_conversation.timestamp || getTimestampWithTimezoneOffset(),
      };

      conversations.push(conversation);
    } catch (error) {
      console.warn(
        `error while cleaning conversations' history. Removing culprit`,
        error,
      );
    }
  }

  return conversations;
};
