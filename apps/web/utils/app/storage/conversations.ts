import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation } from '@/types/chat';
import { Database } from '@/types/database';
import { SystemPrompt } from '@/types/system-prompt';

export const storageGetConversations = async (
  database: Database,
  user: User,
  systemPrompts: SystemPrompt[],
  models: AiModel[],
) => {
  return await database.getConversations(user, systemPrompts, models);
};

export const storageUpdateConversations = async (
  database: Database,
  user: User,
  conversations: Conversation[],
) => {
  await database.updateConversations(user, conversations).then((success) => {
    if (!success) {
      console.error('Failed to update conversations');
    }
  });
};

export const storageDeleteConversations = async (
  database: Database,
  user: User,
) => {
  database.deleteConversations(user).then((success) => {
    if (!success) {
      console.error('Failed to delete conversations');
    }
  });
};
