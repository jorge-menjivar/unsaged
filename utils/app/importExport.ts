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

import {
  cleanConversationHistory,
  cleanFolders,
  cleanMessageTemplates,
} from './clean';
import {
  storageGetConversations,
  storageUpdateConversations,
} from './storage/conversations';
import { storageGetFolders, storageUpdateFolders } from './storage/folders';
import {
  storageCreateMessages,
  storageUpdateMessages,
} from './storage/messages';
import { storageGetPrompts, storageUpdatePrompts } from './storage/prompts';
import { saveSelectedConversation } from './storage/selectedConversation';
import { deleteSelectedConversation } from './storage/selectedConversation';

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
      conversations: cleanConversationHistory(data.history),
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

export const exportData = async (database: Database, user: User) => {
  // TODO: This function is not ready yet
  let history = await storageGetConversations(database, user);
  let folders = await storageGetFolders(database, user);
  let prompts = await storageGetPrompts(database, user);

  const data = {
    app: 'unSAGED',
    version: 1,
    conversations: history || [],
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
): Promise<LatestExportFormat> => {
  const { conversations, folders, system_prompts, message_templates } =
    cleanData(data);

  console.log('cleaned data', {
    conversations,
    folders,
    system_prompts,
    message_templates,
  });

  // Updating folders
  const oldFolders = await storageGetFolders(database, user);
  const newFolders: FolderInterface[] = [...oldFolders, ...folders].filter(
    (folder, index, self) =>
      index === self.findIndex((f) => f.id === folder.id),
  );

  await storageUpdateFolders(database, user, newFolders);

  // Updating conversations
  const oldConversations = await storageGetConversations(database, user);
  const newConversations: Conversation[] = [
    ...oldConversations,
    ...conversations,
  ].filter(
    (conversation, index, self) =>
      index === self.findIndex((c) => c.id === conversation.id),
  );

  console.log('newHistory', newConversations);

  await storageUpdateConversations(database, user, newConversations);

  // Updating messages
  for (const conversation of conversations) {
    if (conversation.messages.length > 0) {
      storageUpdateMessages(
        database,
        user,
        conversation,
        conversation.messages,
        newConversations,
      );
    }
  }
  if (newConversations.length > 0) {
    saveSelectedConversation(
      user,
      newConversations[newConversations.length - 1],
    );
  } else {
    deleteSelectedConversation(user);
  }

  // Updating prompts
  const oldPrompts = await storageGetPrompts(database, user);
  const newMessageTemplates: Prompt[] = [
    ...oldPrompts,
    ...message_templates,
  ].filter(
    (prompt, index, self) =>
      index === self.findIndex((p) => p.id === prompt.id),
  );

  console.log('newPrompts', newMessageTemplates);

  storageUpdatePrompts(database, user, newMessageTemplates);

  return {
    app: 'unSAGED',
    version: 1,
    conversations: newConversations,
    folders: newFolders,
    message_templates: newMessageTemplates,
    system_prompts: system_prompts,
  };
};
