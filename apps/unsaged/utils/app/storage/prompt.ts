import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { Template } from '@/types/prompt';

export const storageCreatePrompt = (
  database: Database,
  user: User,
  newPrompt: Template,
  allPrompts: Template[],
) => {
  const updatedPrompts = [...allPrompts, newPrompt];

  database.createTemplate(user, newPrompt).then((success) => {
    if (!success) {
      console.error('Failed to create prompt');
    }
  });

  return updatedPrompts;
};

export const storageUpdatePrompt = (
  database: Database,
  user: User,
  updatedPrompt: Template,
  allPrompts: Template[],
) => {
  const updatedPrompts = allPrompts.map((c) => {
    if (c.id === updatedPrompt.id) {
      return updatedPrompt;
    }

    return c;
  });

  database.updateTemplate(user, updatedPrompt).then((success) => {
    if (!success) {
      console.error('Failed to update prompt');
    }
  });

  return {
    single: updatedPrompt,
    all: updatedPrompts,
  };
};

export const storageDeletePrompt = (
  database: Database,
  user: User,
  promptId: string,
  allPrompts: Template[],
) => {
  const updatedPrompts = allPrompts.filter((p) => p.id !== promptId);

  database.deleteTemplate(user, promptId).then((success) => {
    if (!success) {
      console.error('Failed to delete prompt');
    }
  });

  return updatedPrompts;
};
