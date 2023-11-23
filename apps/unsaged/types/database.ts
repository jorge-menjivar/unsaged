import { AiModel } from './ai-models';
import { User } from './auth';
import { Conversation, Message } from './chat';
import { FolderInterface } from './folder';
import { Prompt } from './prompt';
import { SystemPrompt } from './system-prompt';

export interface Database {
  name: string;

  connect(args?: any): Promise<void>;
  disconnect(): Promise<void>;

  // ------------------------------Conversation------------------------------
  createConversation(
    user: User,
    newConversation: Conversation,
  ): Promise<boolean>;

  updateConversation(
    user: User,
    updatedConversation: Conversation,
  ): Promise<boolean>;

  deleteConversation(user: User, conversationId: string): Promise<boolean>;

  // ------------------------------Conversations------------------------------
  getConversations(
    user: User,
    systemPrompts: SystemPrompt[],
    models: AiModel[],
  ): Promise<Conversation[]>;

  updateConversations(
    user: User,
    updatedConversations: Conversation[],
  ): Promise<boolean>;

  deleteConversations(user: User): Promise<boolean>;

  // ------------------------------Folder------------------------------
  createFolder(user: User, newFolder: FolderInterface): Promise<boolean>;

  updateFolder(user: User, updatedFolder: FolderInterface): Promise<boolean>;

  deleteFolder(user: User, folderId: string): Promise<boolean>;

  // ------------------------------Folders------------------------------
  getFolders(user: User): Promise<FolderInterface[]>;

  updateFolders(
    user: User,
    updatedFolders: FolderInterface[],
  ): Promise<boolean>;

  deleteFolders(user: User, folderIds: string[]): Promise<boolean>;

  // ------------------------------Message------------------------------
  createMessage(user: User, newMessage: Message): Promise<boolean>;

  updateMessage(user: User, updatedMessage: Message): Promise<boolean>;

  deleteMessage(user: User, messageId: string): Promise<boolean>;

  // ------------------------------Messages------------------------------
  getMessages(user: User, conversationId?: string): Promise<Message[]>;

  createMessages(user: User, newMessages: Message[]): Promise<boolean>;

  updateMessages(user: User, updatedMessages: Message[]): Promise<boolean>;

  deleteMessages(user: User, messageIds: string[]): Promise<boolean>;

  // ------------------------------Prompt------------------------------
  createPrompt(user: User, newPrompt: Prompt): Promise<boolean>;

  updatePrompt(user: User, updatedPrompt: Prompt): Promise<boolean>;

  deletePrompt(user: User, promptId: string): Promise<boolean>;

  // ------------------------------Prompts------------------------------
  getPrompts(user: User): Promise<Prompt[]>;

  updatePrompts(user: User, updatedPrompts: Prompt[]): Promise<boolean>;

  deletePrompts(user: User, promptIds: string[]): Promise<boolean>;

  // ------------------------------SystemPrompt------------------------------
  createSystemPrompt(
    user: User,
    newSystemPrompt: SystemPrompt,
  ): Promise<boolean>;

  updateSystemPrompt(
    user: User,
    updatedSystemPrompt: SystemPrompt,
  ): Promise<boolean>;

  deleteSystemPrompt(user: User, systemPromptId: string): Promise<boolean>;

  // ------------------------------SystemPrompts------------------------------
  getSystemPrompts(user: User): Promise<SystemPrompt[]>;

  updateSystemPrompts(
    user: User,
    updatedSystemPrompts: SystemPrompt[],
  ): Promise<boolean>;

  deleteSystemPrompts(user: User, systemPromptIds: string[]): Promise<boolean>;
}
