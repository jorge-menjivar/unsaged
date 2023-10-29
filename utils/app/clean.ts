import { PossibleAiModels } from '@/types/ai-models';
import { Conversation } from '@/types/chat';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';

import { DEFAULT_TEMPERATURE, OPENAI_API_TYPE } from './const';

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

export const cleanConversationHistory = (
  conversations: Conversation[],
): Conversation[] => {
  if (!Array.isArray(conversations)) {
    console.warn('history is not an array. Returning an empty array.');
    return [];
  }

  const cleanConversations = [];

  for (const conversation of conversations) {
    try {
      if (!conversation.model) {
        conversation.model =
          OPENAI_API_TYPE === 'azure'
            ? PossibleAiModels['gpt-35-turbo']
            : PossibleAiModels['gpt-3.5-turbo'];
      }

      const cleanConversation: Conversation = {
        id: conversation.id,
        name: conversation.name,
        model: conversation.model,
        systemPrompt: conversation.systemPrompt || null,
        temperature: conversation.temperature || DEFAULT_TEMPERATURE,
        folderId: conversation.folderId || null,
        timestamp: conversation.timestamp || new Date().toISOString(),
      };

      cleanConversations.push(cleanConversation);
    } catch (error) {
      console.warn(
        `error while cleaning conversations' history. Removing culprit`,
        error,
      );
    }
  }

  return cleanConversations;
};
