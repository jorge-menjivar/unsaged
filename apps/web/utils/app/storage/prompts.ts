import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { Prompt } from '@/types/prompt';

export const storageGetPrompts = async (database: Database, user: User) => {
  return await database.getPrompts(user);
};

export const storageUpdatePrompts = async (
  database: Database,
  user: User,
  updatedPrompts: Prompt[],
) => {
  await database.updatePrompts(user, updatedPrompts).then((success) => {
    if (!success) {
      console.error('Failed to update prompts');
    }
  });
};
