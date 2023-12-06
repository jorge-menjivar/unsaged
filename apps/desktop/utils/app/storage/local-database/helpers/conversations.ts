import { Conversation } from '@/types/chat';

export async function localCreateConversation(newConversation: Conversation) {
  const itemName = `conversations`;
  try {
    const conversations = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Conversation[];
    const updatedConversations = [...conversations, newConversation];
    localStorage.setItem(itemName, JSON.stringify(updatedConversations));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localUpdateConversation(
  updatedConversation: Conversation,
) {
  const itemName = `conversations`;

  try {
    const conversations = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Conversation[];
    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === updatedConversation.id) {
        return updatedConversation;
      }
      return conversation;
    });
    localStorage.setItem(itemName, JSON.stringify(updatedConversations));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteConversation(conversationId: string) {
  const itemName = `conversations`;
  try {
    const conversations = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Conversation[];
    const updatedConversations = conversations.filter(
      (conversation) => conversation.id !== conversationId,
    );
    localStorage.setItem(itemName, JSON.stringify(updatedConversations));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localGetConversations() {
  const itemName = `conversations`;
  try {
    const conversations = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Conversation[];
    return conversations;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function localUpdateConversations(
  updatedConversations: Conversation[],
) {
  try {
    const itemName = `conversations`;
    const conversations = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Conversation[];
    const newConversations = conversations.map((conversation) => {
      const updatedConversation = updatedConversations.find(
        (updatedConversation) => updatedConversation.id === conversation.id,
      );
      if (updatedConversation) {
        return updatedConversation;
      }
      return conversation;
    });

    localStorage.setItem(itemName, JSON.stringify(newConversations));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteConversations() {
  const itemName = `conversations`;
  localStorage.removeItem(itemName);
  return true;
}
