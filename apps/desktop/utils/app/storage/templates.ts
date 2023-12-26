import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { Template } from '@/types/templates';

export const storageGetTemplates = async (database: Database, user: User) => {
  return await database.getTemplates(user);
};

export const storageUpdateTemplates = async (
  database: Database,
  user: User,
  updatedTemplates: Template[],
) => {
  await database.updateTemplates(user, updatedTemplates).then((success) => {
    if (!success) {
      console.error('Failed to update templates');
    }
  });
};
