import { Template } from '@/types/templates';

export async function localCreateTemplate(newTemplate: Template) {
  try {
    const itemName = `templates`;
    const templates = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Template[];
    const updatedTemplates = [...templates, newTemplate];
    localStorage.setItem(itemName, JSON.stringify(updatedTemplates));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localUpdateTemplate(updatedTemplate: Template) {
  try {
    const itemName = `templates`;
    const templates = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Template[];
    const updatedTemplates = templates.map((p) => {
      if (p.id === updatedTemplate.id) {
        return updatedTemplate;
      }
      return p;
    });
    localStorage.setItem(itemName, JSON.stringify(updatedTemplates));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteTemplate(templateId: string) {
  try {
    const itemName = `templates`;
    const templates = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Template[];
    const updatedTemplates = templates.filter((p) => p.id !== templateId);
    localStorage.setItem(itemName, JSON.stringify(updatedTemplates));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localGetTemplates() {
  try {
    const itemName = `templates`;
    return JSON.parse(localStorage.getItem(itemName) || '[]') as Template[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function localUpdateTemplates(updatedTemplates: Template[]) {
  try {
    const itemName = `templates`;
    const templates = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Template[];
    const allUpdatedTemplates = templates.map((p) => {
      const updatedTemplate = updatedTemplates.find(
        (updatedTemplate) => updatedTemplate.id === p.id,
      );
      if (updatedTemplate) {
        return updatedTemplate;
      }
      return p;
    });
    localStorage.setItem(itemName, JSON.stringify(allUpdatedTemplates));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteTemplates(templateIds: string[]) {
  try {
    const itemName = `templates`;
    const templates = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Template[];
    const updatedTemplates = templates.filter(
      (p) => !templateIds.includes(p.id),
    );
    localStorage.setItem(itemName, JSON.stringify(updatedTemplates));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
