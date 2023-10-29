import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import {
  LatestExportFormat,
  SupportedExportFormats,
  UnsagedExportFormatV1,
} from '@/types/export';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import { SystemPrompt } from '@/types/system-prompt';

import { cleanFolders, cleanMessageTemplates } from '../clean';
import {
  storageGetConversations,
  storageUpdateConversations,
} from '../storage/conversations';
import { storageGetFolders, storageUpdateFolders } from '../storage/folders';
import { storageUpdateMessage } from '../storage/message';
import { storageGetMessages } from '../storage/messages';
import {
  storageGetPrompts as storageGetTemplates,
  storageUpdatePrompts as storageUpdateTemplates,
} from '../storage/prompts';
import {
  deleteSelectedConversationId,
  saveSelectedConversationId,
} from '../storage/selectedConversation';
import { storageUpdateSystemPrompt } from '../storage/systemPrompt';
import { storageGetSystemPrompts } from '../storage/systemPrompts';
import {
  getConversationsFromChatbotUIFile,
  getMessagesFromChatbotUIFile,
} from './chatbot-ui';

export function isExportFormatV1(obj: any): obj is UnsagedExportFormatV1 {
  return Array.isArray(obj);
}

export const isLatestExportFormat = isExportFormatV1;

export function cleanData(data: any): LatestExportFormat {
  if (isExportFormatV1(data)) {
    return data;
  }
  {
    // Attempt to convert to unSAGED format
    return {
      app: 'unSAGED',
      version: 1,
      conversations: getConversationsFromChatbotUIFile(data.history),
      messages: getMessagesFromChatbotUIFile(data.history),
      folders: cleanFolders(data.folders),
      message_templates: cleanMessageTemplates(data.prompts),
      system_prompts: [],
    };
  }
}

function currentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}

export const exportData = async (
  database: Database,
  user: User,
  systemPrompts: SystemPrompt[],
  models: AiModel[],
) => {
  // TODO: This function is not ready yet
  let conversations = await storageGetConversations(
    database,
    user,
    systemPrompts,
    models,
  );
  let messages = await storageGetMessages(database, user);
  let folders = await storageGetFolders(database, user);
  let prompts = await storageGetTemplates(database, user);

  const data = {
    app: 'unSAGED',
    version: 1,
    conversations: conversations || [],
    messages: messages || [],
    folders: folders || [],
    message_templates: prompts || [],
    system_prompts: [],
  } as LatestExportFormat;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `unsaged_history_${currentDate()}.json`;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = async (
  database: Database,
  user: User,
  data: SupportedExportFormats,
  systemPrompts: SystemPrompt[],
  models: AiModel[],
): Promise<LatestExportFormat> => {
  const {
    conversations: importedConversations,
    messages: importedMessages,
    folders: importedFolders,
    system_prompts: importedSystemPrompts,
    message_templates: importedMessageTemplates,
  } = cleanData(data);

  // Updating folders
  const folders = await storageGetFolders(database, user);
  const updatedFolders: FolderInterface[] = [
    ...folders,
    ...importedFolders,
  ].filter(
    (folder, index, self) =>
      index === self.findIndex((f) => f.id === folder.id),
  );
  await storageUpdateFolders(database, user, updatedFolders);

  // Updating conversations
  const conversations = await storageGetConversations(
    database,
    user,
    systemPrompts,
    models,
  );
  const updatedConversations: Conversation[] = [
    ...conversations,
    ...importedConversations,
  ].filter(
    (conversation, index, self) =>
      index === self.findIndex((c) => c.id === conversation.id),
  );
  await storageUpdateConversations(database, user, updatedConversations);

  // Updating selected conversation
  if (updatedConversations.length > 0) {
    saveSelectedConversationId(
      user,
      updatedConversations[updatedConversations.length - 1].id,
    );
  } else {
    deleteSelectedConversationId(user);
  }

  // Updating messages
  const messages = await storageGetMessages(database, user);
  for (const importedMessage of importedMessages) {
    storageUpdateMessage(database, user, importedMessage, []);
  }

  const updatedMessages = [...messages, ...importedMessages].filter(
    (message, index, self) =>
      index === self.findIndex((m) => m.id === message.id),
  );

  // Updating message templates
  const messageTemplates = await storageGetTemplates(database, user);
  const updatedMessageTemplates: Prompt[] = [
    ...messageTemplates,
    ...importedMessageTemplates,
  ].filter(
    (prompt, index, self) =>
      index === self.findIndex((p) => p.id === prompt.id),
  );
  storageUpdateTemplates(database, user, updatedMessageTemplates);

  // Updating system prompts
  const system_prompts = await storageGetSystemPrompts(database, user);
  for (const importedSystemPrompt of importedSystemPrompts) {
    storageUpdateSystemPrompt(database, user, importedSystemPrompt, []);
  }
  const updatedSystemPrompts = [
    ...system_prompts,
    ...importedSystemPrompts,
  ].filter(
    (systemPrompt, index, self) =>
      index === self.findIndex((p) => p.id === systemPrompt.id),
  );

  return {
    app: 'unSAGED',
    version: 1,
    conversations: updatedConversations,
    messages: updatedMessages,
    folders: updatedFolders,
    message_templates: updatedMessageTemplates,
    system_prompts: updatedSystemPrompts,
  };
};
