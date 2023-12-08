import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { FolderInterface } from '@/types/folder';
import { SystemPrompt } from '@/types/system-prompt';
import { Template } from '@/types/templates';

import {
  localCreateConversation,
  localDeleteConversation,
  localDeleteConversations,
  localGetConversations,
  localUpdateConversation,
  localUpdateConversations,
} from './helpers/conversations';
import {
  localCreateFolder,
  localDeleteFolder,
  localDeleteFolders,
  localGetFolders,
  localUpdateFolder,
  localUpdateFolders,
} from './helpers/folders';
import {
  localCreateMessage,
  localCreateMessages,
  localDeleteMessage,
  localDeleteMessages,
  localGetMessages,
  localUpdateMessage,
  localUpdateMessages,
} from './helpers/messages';
import {
  localCreateSystemPrompt,
  localDeleteSystemPrompt,
  localDeleteSystemPrompts,
  localGetSystemPrompts,
  localUpdateSystemPrompt,
  localUpdateSystemPrompts,
} from './helpers/system-prompts';
import {
  localCreateTemplate,
  localDeleteTemplate,
  localDeleteTemplates,
  localGetTemplates,
  localUpdateTemplate,
  localUpdateTemplates,
} from './helpers/templates';

export class LocalDatabase implements Database {
  name = 'Local Database';
  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {}

  // -----------------------------------Conversation-----------------------------------

  async createConversation(
    user: User,
    newConversation: Conversation,
  ): Promise<boolean> {
    return await localCreateConversation(newConversation);
  }

  async updateConversation(
    user: User,
    updatedConversation: Conversation,
  ): Promise<boolean> {
    return await localUpdateConversation(updatedConversation);
  }

  async deleteConversation(
    user: User,
    conversationId: string,
  ): Promise<boolean> {
    return await localDeleteConversation(conversationId);
  }

  // -----------------------------------Conversations-----------------------------------
  async getConversations(
    user: User,
    systemPrompts: SystemPrompt[],
    models: AiModel[],
  ): Promise<Conversation[]> {
    return await localGetConversations();
  }

  async updateConversations(
    user: User,
    updatedConversations: Conversation[],
  ): Promise<boolean> {
    return await localUpdateConversations(updatedConversations);
  }

  async deleteConversations(user: User): Promise<boolean> {
    return await localDeleteConversations();
  }

  // -----------------------------------Folder-----------------------------------

  async createFolder(user: User, newFolder: FolderInterface): Promise<boolean> {
    return await localCreateFolder(newFolder);
  }

  async updateFolder(
    user: User,
    updatedFolder: FolderInterface,
  ): Promise<boolean> {
    return await localUpdateFolder(updatedFolder);
  }

  async deleteFolder(user: User, folderId: string): Promise<boolean> {
    return await localDeleteFolder(folderId);
  }

  // -----------------------------------Folders-----------------------------------
  async getFolders(user: User): Promise<FolderInterface[]> {
    return await localGetFolders();
  }

  async updateFolders(
    user: User,
    updatedFolders: FolderInterface[],
  ): Promise<boolean> {
    return await localUpdateFolders(updatedFolders);
  }

  async deleteFolders(user: User, folderIds: string[]): Promise<boolean> {
    return await localDeleteFolders(folderIds);
  }

  // -----------------------------------Message-----------------------------------
  async createMessage(user: User, newMessage: Message): Promise<boolean> {
    return await localCreateMessage(newMessage);
  }

  async updateMessage(user: User, updatedMessage: Message): Promise<boolean> {
    return await localUpdateMessage(updatedMessage);
  }

  async deleteMessage(user: User, messageId: string): Promise<boolean> {
    return await localDeleteMessage(messageId);
  }

  // -----------------------------------Messages-----------------------------------
  async getMessages(user: User, conversationId?: string): Promise<Message[]> {
    return await localGetMessages(conversationId);
  }

  async createMessages(user: User, newMessages: Message[]): Promise<boolean> {
    return await localCreateMessages(newMessages);
  }

  async updateMessages(
    user: User,
    updatedMessages: Message[],
  ): Promise<boolean> {
    return await localUpdateMessages(updatedMessages);
  }

  async deleteMessages(user: User, messageIds: string[]): Promise<boolean> {
    return await localDeleteMessages(messageIds);
  }

  // -----------------------------------Prompt-----------------------------------
  async createTemplate(user: User, newTemplate: Template): Promise<boolean> {
    return await localCreateTemplate(newTemplate);
  }

  async updateTemplate(
    user: User,
    updatedTemplate: Template,
  ): Promise<boolean> {
    return await localUpdateTemplate(updatedTemplate);
  }

  async deleteTemplate(user: User, templateId: string): Promise<boolean> {
    return await localDeleteTemplate(templateId);
  }

  // -----------------------------------Prompts-----------------------------------
  async getTemplates(user: User): Promise<Template[]> {
    return await localGetTemplates();
  }

  async updateTemplates(
    user: User,
    updatedTemplates: Template[],
  ): Promise<boolean> {
    return await localUpdateTemplates(updatedTemplates);
  }

  async deleteTemplates(user: User, templateIds: string[]): Promise<boolean> {
    return await localDeleteTemplates(templateIds);
  }

  // -----------------------------------SystemPrompt-----------------------------------
  async createSystemPrompt(
    user: User,
    newSystemPrompt: SystemPrompt,
  ): Promise<boolean> {
    return await localCreateSystemPrompt(newSystemPrompt);
  }

  async updateSystemPrompt(
    user: User,
    updatedSystemPrompt: SystemPrompt,
  ): Promise<boolean> {
    return await localUpdateSystemPrompt(updatedSystemPrompt);
  }

  async deleteSystemPrompt(
    user: User,
    systemPromptId: string,
  ): Promise<boolean> {
    return await localDeleteSystemPrompt(systemPromptId);
  }

  // -----------------------------------SystemPrompts-----------------------------------
  async getSystemPrompts(user: User): Promise<SystemPrompt[]> {
    return await localGetSystemPrompts();
  }

  async updateSystemPrompts(
    user: User,
    updatedSystemPrompts: SystemPrompt[],
  ): Promise<boolean> {
    return await localUpdateSystemPrompts(updatedSystemPrompts);
  }

  async deleteSystemPrompts(
    user: User,
    systemPromptIds: string[],
  ): Promise<boolean> {
    return await localDeleteSystemPrompts(systemPromptIds);
  }
}
