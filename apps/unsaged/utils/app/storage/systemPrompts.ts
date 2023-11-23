import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { SystemPrompt } from '@/types/system-prompt';

export const storageGetSystemPrompts = async (
  database: Database,
  user: User,
) => {
  return await database.getSystemPrompts(user);
};

export const storageUpdateSystemPrompts = async (
  database: Database,
  user: User,
  updatedSystemPrompts: SystemPrompt[],
) => {
  database.updateSystemPrompts(user, updatedSystemPrompts).then((success) => {
    if (!success) {
      console.error('Failed to update system prompts');
    }
  });
};
