import { SupaDatabase } from './types/supabase';
import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import { SystemPrompt } from '@/types/system-prompt';

import { OPENAI_API_KEY, SUPABASE_ANON_KEY, SUPABASE_URL } from '../../const';
import {
  supaCreateConversation,
  supaDeleteConversation,
  supaUpdateConversation,
} from './helpers/conversation';
import {
  supaDeleteConversations,
  supaGetConversations,
  supaUpdateConversations,
} from './helpers/conversations';
import {
  supaCreateFolder,
  supaDeleteFolder,
  supaUpdateFolder,
} from './helpers/folder';
import {
  supaDeleteFolders,
  supaGetFolders,
  supaUpdateFolders,
} from './helpers/folders';
import {
  supaCreateMessage,
  supaDeleteMessage,
  supaUpdateMessage,
} from './helpers/message';
import {
  supaCreateMessages,
  supaDeleteMessages,
  supaGetMessages,
  supaUpdateMessages,
} from './helpers/messages';
import {
  supaCreatePrompt,
  supaDeletePrompt,
  supaUpdatePrompt,
} from './helpers/prompt';
import {
  supaDeletePrompts,
  supaGetPrompts,
  supaUpdatePrompts,
} from './helpers/prompts';
import {
  supaCreateSystemPrompt,
  supaDeleteSystemPrompt,
  supaUpdateSystemPrompt,
} from './helpers/systemPrompt';
import {
  supaDeleteSystemPrompts,
  supaGetSystemPrompts,
  supaUpdateSystemPrompts,
} from './helpers/systemPrompts';


import { createBrowserClient } from '@supabase/ssr';



export class ClientDatabase implements Database {
  name = 'supabase';

  // Define a custom type for SupabaseClient
  private supabaseClient: any;

  constructor() {
    this.supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  get client() {
    return this.supabaseClient;
  }

  // Add a connect method
  connect() {
    // You can perform any connection-related tasks here if needed
    // For now, let's just return the Supabase client instance
    return this.supabaseClient;
  }

  async disconnect(): Promise<void> {}

  // -----------------------------------Conversation-----------------------------------

  async createConversation(
    user: User,
    newConversation: Conversation,
  ): Promise<boolean> {
    return await supaCreateConversation(this.client!, newConversation);
  }

  async updateConversation(
    user: User,
    updatedConversation: Conversation,
  ): Promise<boolean> {
    return await supaUpdateConversation(this.client!, updatedConversation);
  }

  async deleteConversation(
    user: User,
    conversationId: string,
  ): Promise<boolean> {
    return await supaDeleteConversation(this.client!, conversationId);
  }

  // -----------------------------------Conversations-----------------------------------
  async getConversations(
    user: User,
    systemPrompts: SystemPrompt[],
    models: AiModel[]
  ): Promise<Conversation[]> {
    const conversations = await supaGetConversations(this.client!, systemPrompts, models);
    // Handle the case where conversations is undefined and return an empty array
    return conversations || [];
  }
  

  async updateConversations(
    user: User,
    updatedConversations: Conversation[],
  ): Promise<boolean> {
    return await supaUpdateConversations(this.client!, updatedConversations);
  }

  async deleteConversations(user: User): Promise<boolean> {
    return await supaDeleteConversations(this.client!);
  }

  // -----------------------------------Folder-----------------------------------

  async createFolder(user: User, newFolder: FolderInterface): Promise<boolean> {
    return await supaCreateFolder(this.client!, newFolder);
  }

  async updateFolder(
    user: User,
    updatedFolder: FolderInterface,
  ): Promise<boolean> {
    return await supaUpdateFolder(this.client!, updatedFolder);
  }

  async deleteFolder(user: User, folderId: string): Promise<boolean> {
    return await supaDeleteFolder(this.client!, folderId);
  }

  // -----------------------------------Folders-----------------------------------
  async getFolders(user: User): Promise<FolderInterface[]> {
    return await supaGetFolders(this.client!);
  }

  async updateFolders(
    user: User,
    updatedFolders: FolderInterface[],
  ): Promise<boolean> {
    return await supaUpdateFolders(this.client!, updatedFolders);
  }

  async deleteFolders(user: User, folderIds: string[]): Promise<boolean> {
    return await supaDeleteFolders(this.client!, folderIds);
  }

  // -----------------------------------Message-----------------------------------
  async createMessage(user: User, newMessage: Message): Promise<boolean> {
    return await supaCreateMessage(this.client!, newMessage);
  }

  async updateMessage(user: User, updatedMessage: Message): Promise<boolean> {
    return await supaUpdateMessage(this.client!, updatedMessage);
  }

  async deleteMessage(user: User, messageId: string): Promise<boolean> {
    return await supaDeleteMessage(this.client!, messageId);
  }

  // -----------------------------------Messages-----------------------------------
  async getMessages(user: User, conversationId?: string): Promise<Message[]> {
    return await supaGetMessages(this.client!, conversationId);
  }

  async createMessages(user: User, newMessages: Message[]): Promise<boolean> {
    return await supaCreateMessages(this.client!, newMessages);
  }

  async updateMessages(
    user: User,
    updatedMessages: Message[],
  ): Promise<boolean> {
    return await supaUpdateMessages(this.client!, updatedMessages);
  }

  async deleteMessages(user: User, messageIds: string[]): Promise<boolean> {
    return await supaDeleteMessages(this.client!, messageIds);
  }

  // -----------------------------------Prompt-----------------------------------
  async createPrompt(user: User, newPrompt: Prompt): Promise<boolean> {
    return await supaCreatePrompt(this.client!, newPrompt);
  }

  async updatePrompt(user: User, updatedPrompt: Prompt): Promise<boolean> {
    return await supaUpdatePrompt(this.client!, updatedPrompt);
  }

  async deletePrompt(user: User, promptId: string): Promise<boolean> {
    return await supaDeletePrompt(this.client!, promptId);
  }

  // -----------------------------------Prompts-----------------------------------
  async getPrompts(user: User): Promise<Prompt[]> {
    return await supaGetPrompts(this.client!);
  }

  async updatePrompts(user: User, updatedPrompts: Prompt[]): Promise<boolean> {
    return await supaUpdatePrompts(this.client!, updatedPrompts);
  }

  async deletePrompts(user: User, promptIds: string[]): Promise<boolean> {
    return await supaDeletePrompts(this.client!, promptIds);
  }

  // -----------------------------------SystemPrompt-----------------------------------
  async createSystemPrompt(
    user: User,
    newSystemPrompt: SystemPrompt,
  ): Promise<boolean> {
    return await supaCreateSystemPrompt(this.client!, newSystemPrompt);
  }

  async updateSystemPrompt(
    user: User,
    updatedSystemPrompt: SystemPrompt,
  ): Promise<boolean> {
    return await supaUpdateSystemPrompt(this.client!, updatedSystemPrompt);
  }

  async deleteSystemPrompt(
    user: User,
    systemPromptId: string,
  ): Promise<boolean> {
    return await supaDeleteSystemPrompt(this.client!, systemPromptId);
  }

  // -----------------------------------SystemPrompts-----------------------------------
  async getSystemPrompts(user: User): Promise<SystemPrompt[]> {
    return await supaGetSystemPrompts(this.client!);
  }

  async updateSystemPrompts(
    user: User,
    updatedSystemPrompts: SystemPrompt[],
  ): Promise<boolean> {
    return await supaUpdateSystemPrompts(this.client!, updatedSystemPrompts);
  }

  async deleteSystemPrompts(
    user: User,
    systemPromptIds: string[],
  ): Promise<boolean> {
    return await supaDeleteSystemPrompts(this.client!, systemPromptIds);
  }
}
