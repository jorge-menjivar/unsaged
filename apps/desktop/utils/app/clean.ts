import { Conversation } from '@/types/chat';
import { FolderInterface } from '@/types/folder';
import { Template } from '@/types/templates';

import { OPENAI_API_TYPE } from './const';
import { getModelDefaults } from './settings/model-defaults';

import { v4 as uuidv4 } from 'uuid';

export const cleanSelectedConversation = (conversation: Conversation) => {
  let updatedConversation = conversation;

  const model = conversation.model;

  if (model) {
    const modelDefaults = getModelDefaults(model);

    // Replaces undefined params with default params
    updatedConversation = {
      ...updatedConversation,
      params: {
        ...modelDefaults,
        ...updatedConversation.params,
      },
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

export const cleanMessageTemplates = (importedPrompts: any[]): Template[] => {
  if (!Array.isArray(importedPrompts)) {
    console.warn('importedPrompts is not an array. Returning an empty array.');
    return [];
  }

  const prompts = [];
  for (const rawPrompt of importedPrompts) {
    try {
      const prompt: Template = {
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
      let modelDefaults = {};

      if (conversation.model) {
        modelDefaults = getModelDefaults(conversation.model);
      }

      const cleanConversation: Conversation = {
        id: conversation.id,
        name: conversation.name,
        model: conversation.model,
        systemPrompt: conversation.systemPrompt || null,
        folderId: conversation.folderId || null,
        timestamp: conversation.timestamp || new Date().toISOString(),
        // Replaces undefined params with default params
        params: {
          ...modelDefaults,
          ...conversation.params,
        },
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
