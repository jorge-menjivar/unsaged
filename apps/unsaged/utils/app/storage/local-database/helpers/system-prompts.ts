import { SystemPrompt } from '@/types/system-prompt';

export async function localCreateSystemPrompt(newPrompt: SystemPrompt) {
  try {
    const itemName = `system-prompts`;
    const systemPrompts = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as SystemPrompt[];
    const updatedSystemPrompts = [...systemPrompts, newPrompt];
    localStorage.setItem(itemName, JSON.stringify(updatedSystemPrompts));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localUpdateSystemPrompt(updatedPrompt: SystemPrompt) {
  try {
    const itemName = `system-prompts`;
    const systemPrompts = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as SystemPrompt[];
    const updatedSystemPrompts = systemPrompts.map((p) => {
      if (p.id === updatedPrompt.id) {
        return updatedPrompt;
      }
      return p;
    });
    localStorage.setItem(itemName, JSON.stringify(updatedSystemPrompts));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteSystemPrompt(promptId: string) {
  try {
    const itemName = `system-prompts`;
    const systemPrompts = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as SystemPrompt[];
    const updatedSystemPrompts = systemPrompts.filter((p) => p.id !== promptId);
    localStorage.setItem(itemName, JSON.stringify(updatedSystemPrompts));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const localGetSystemPrompts = () => {
  try {
    const itemName = `system-prompts`;
    return JSON.parse(localStorage.getItem(itemName) || '[]') as SystemPrompt[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const localUpdateSystemPrompts = (updatedPrompts: SystemPrompt[]) => {
  try {
    const itemName = `system-prompts`;
    const systemPrompts = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as SystemPrompt[];
    const allUpdatedPrompts = systemPrompts.map((p) => {
      const updatedPrompt = updatedPrompts.find((up) => up.id === p.id);
      if (updatedPrompt) {
        return updatedPrompt;
      }
      return p;
    });
    localStorage.setItem(itemName, JSON.stringify(allUpdatedPrompts));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const localDeleteSystemPrompts = (promptIds: string[]) => {
  try {
    const itemName = `system-prompts`;
    const systemPrompts = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as SystemPrompt[];
    const updatedSystemPrompts = systemPrompts.filter(
      (p) => !promptIds.includes(p.id),
    );
    localStorage.setItem(itemName, JSON.stringify(updatedSystemPrompts));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
