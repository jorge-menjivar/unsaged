import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from './utils/constants';

import { SupaDatabase } from './types/supabase';
import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import { SystemPrompt } from '@/types/system-prompt';

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

import { SupabaseClient, createClient } from '@supabase/supabase-js';

export class ClientDatabase implements Database {
  name = 'supabase';
  supabase: SupabaseClient | null = null;

  async connect({
    customAccessToken,
  }: {
    customAccessToken: string;
  }): Promise<void> {
    if (!this.supabase) {
      this.supabase = createClient<SupaDatabase>(
        NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${customAccessToken}`,
            },
          },
        },
      );
    }
  }

  async disconnect(): Promise<void> {}

  // -----------------------------------Conversation-----------------------------------

  async createConversation(
    user: User,
    newConversation: Conversation,
  ): Promise<boolean> {
    return await supaCreateConversation(this.supabase!, newConversation);
  }

  async updateConversation(
    user: User,
    updatedConversation: Conversation,
  ): Promise<boolean> {
    return await supaUpdateConversation(this.supabase!, updatedConversation);
  }

  async deleteConversation(
    user: User,
    conversationId: string,
  ): Promise<boolean> {
    return await supaDeleteConversation(this.supabase!, conversationId);
  }

  // -----------------------------------Conversations-----------------------------------
  async getConversations(user: User): Promise<Conversation[]> {
    return await supaGetConversations(this.supabase!);
  }

  async updateConversations(
    user: User,
    updatedConversations: Conversation[],
  ): Promise<boolean> {
    return await supaUpdateConversations(this.supabase!, updatedConversations);
  }

  async deleteConversations(user: User): Promise<boolean> {
    return await supaDeleteConversations(this.supabase!);
  }

  // -----------------------------------Folder-----------------------------------

  async createFolder(user: User, newFolder: FolderInterface): Promise<boolean> {
    return await supaCreateFolder(this.supabase!, newFolder);
  }

  async updateFolder(
    user: User,
    updatedFolder: FolderInterface,
  ): Promise<boolean> {
    return await supaUpdateFolder(this.supabase!, updatedFolder);
  }

  async deleteFolder(user: User, folderId: string): Promise<boolean> {
    return await supaDeleteFolder(this.supabase!, folderId);
  }

  // -----------------------------------Folders-----------------------------------
  async getFolders(user: User): Promise<FolderInterface[]> {
    return await supaGetFolders(this.supabase!);
  }

  async updateFolders(
    user: User,
    updatedFolders: FolderInterface[],
  ): Promise<boolean> {
    return await supaUpdateFolders(this.supabase!, updatedFolders);
  }

  async deleteFolders(user: User, folderIds: string[]): Promise<boolean> {
    return await supaDeleteFolders(this.supabase!, folderIds);
  }

  // -----------------------------------Message-----------------------------------
  async createMessage(
    user: User,
    conversationId: string,
    newMessage: Message,
  ): Promise<boolean> {
    return await supaCreateMessage(this.supabase!, conversationId, newMessage);
  }

  async updateMessage(
    user: User,
    conversationId: string,
    updatedMessage: Message,
  ): Promise<boolean> {
    return await supaUpdateMessage(
      this.supabase!,
      conversationId,
      updatedMessage,
    );
  }

  async deleteMessage(
    user: User,
    conversationId: string,
    messageId: string,
  ): Promise<boolean> {
    return await supaDeleteMessage(this.supabase!, conversationId, messageId);
  }

  // -----------------------------------Messages-----------------------------------
  async getMessages(user: User, conversationId: string): Promise<Message[]> {
    return await supaGetMessages(this.supabase!, conversationId);
  }

  async createMessages(
    user: User,
    conversationId: string,
    newMessages: Message[],
  ): Promise<boolean> {
    return await supaCreateMessages(
      this.supabase!,
      conversationId,
      newMessages,
    );
  }

  async updateMessages(
    user: User,
    conversationId: string,
    updatedMessages: Message[],
  ): Promise<boolean> {
    return await supaUpdateMessages(
      this.supabase!,
      conversationId,
      updatedMessages,
    );
  }

  async deleteMessages(
    user: User,
    conversationId: string,
    messageIds: string[],
  ): Promise<boolean> {
    return await supaDeleteMessages(this.supabase!, conversationId, messageIds);
  }

  // -----------------------------------Prompt-----------------------------------
  async createPrompt(user: User, newPrompt: Prompt): Promise<boolean> {
    return await supaCreatePrompt(this.supabase!, newPrompt);
  }

  async updatePrompt(user: User, updatedPrompt: Prompt): Promise<boolean> {
    return await supaUpdatePrompt(this.supabase!, updatedPrompt);
  }

  async deletePrompt(user: User, promptId: string): Promise<boolean> {
    return await supaDeletePrompt(this.supabase!, promptId);
  }

  // -----------------------------------Prompts-----------------------------------
  async getPrompts(user: User): Promise<Prompt[]> {
    return await supaGetPrompts(this.supabase!);
  }

  async updatePrompts(user: User, updatedPrompts: Prompt[]): Promise<boolean> {
    return await supaUpdatePrompts(this.supabase!, updatedPrompts);
  }

  async deletePrompts(user: User, promptIds: string[]): Promise<boolean> {
    return await supaDeletePrompts(this.supabase!, promptIds);
  }

  // -----------------------------------SystemPrompt-----------------------------------
  async createSystemPrompt(
    user: User,
    newSystemPrompt: SystemPrompt,
  ): Promise<boolean> {
    return await supaCreateSystemPrompt(this.supabase!, newSystemPrompt);
  }

  async updateSystemPrompt(
    user: User,
    updatedSystemPrompt: SystemPrompt,
  ): Promise<boolean> {
    return await supaUpdateSystemPrompt(this.supabase!, updatedSystemPrompt);
  }

  async deleteSystemPrompt(
    user: User,
    systemPromptId: string,
  ): Promise<boolean> {
    return await supaDeleteSystemPrompt(this.supabase!, systemPromptId);
  }

  // -----------------------------------SystemPrompts-----------------------------------
  async getSystemPrompts(user: User): Promise<SystemPrompt[]> {
    return await supaGetSystemPrompts(this.supabase!);
  }

  async updateSystemPrompts(
    user: User,
    updatedSystemPrompts: SystemPrompt[],
  ): Promise<boolean> {
    return await supaUpdateSystemPrompts(this.supabase!, updatedSystemPrompts);
  }

  async deleteSystemPrompts(
    user: User,
    systemPromptIds: string[],
  ): Promise<boolean> {
    return await supaDeleteSystemPrompts(this.supabase!, systemPromptIds);
  }
}
