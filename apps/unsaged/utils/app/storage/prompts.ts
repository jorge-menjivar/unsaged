import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { Template } from '@/types/prompt';

export const storageGetPrompts = async (database: Database, user: User) => {
  return await database.getTemplates(user);
};

export const storageUpdatePrompts = async (
  database: Database,
  user: User,
  updatedPrompts: Template[],
) => {
  await database.updateTemplates(user, updatedPrompts).then((success) => {
    if (!success) {
      console.error('Failed to update prompts');
    }
  });
};
