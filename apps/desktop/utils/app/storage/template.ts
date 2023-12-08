import { User } from '@/types/auth';
import { Database } from '@/types/database';
import { Template } from '@/types/templates';

export const storageCreateTemplate = (
  database: Database,
  user: User,
  newTemplate: Template,
  allTemplates: Template[],
) => {
  const updatedTemplates = [...allTemplates, newTemplate];

  database.createTemplate(user, newTemplate).then((success) => {
    if (!success) {
      console.error('Failed to create template');
    }
  });

  return updatedTemplates;
};

export const storageUpdateTemplate = (
  database: Database,
  user: User,
  updatedTemplate: Template,
  allTemplates: Template[],
) => {
  const updatedTemplates = allTemplates.map((c) => {
    if (c.id === updatedTemplate.id) {
      return updatedTemplate;
    }

    return c;
  });

  database.updateTemplate(user, updatedTemplate).then((success) => {
    if (!success) {
      console.error('Failed to update template');
    }
  });

  return updatedTemplates;
};

export const storageDeleteTemplate = (
  database: Database,
  user: User,
  templateId: string,
  allTemplates: Template[],
) => {
  const updatedTemplates = allTemplates.filter((p) => p.id !== templateId);

  database.deleteTemplate(user, templateId).then((success) => {
    if (!success) {
      console.error('Failed to delete template');
    }
  });

  return updatedTemplates;
};
