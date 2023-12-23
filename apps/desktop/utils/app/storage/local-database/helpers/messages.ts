import { Message } from '@/types/chat';

export async function localCreateMessage(newMessage: Message) {
  try {
    const itemName = `messages`;
    const messages = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Message[];

    // Check if message already exists
    const message = messages.find((message) => message.id === newMessage.id);
    if (message) {
      return false;
    }

    const updatedMessages = [...messages, newMessage];
    localStorage.setItem(itemName, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localUpdateMessage(updatedMessage: Message) {
  try {
    const itemName = `messages`;
    const messages = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Message[];
    const updatedMessages = messages.map((message) => {
      if (message.id === updatedMessage.id) {
        return updatedMessage;
      }
      return message;
    });
    localStorage.setItem(itemName, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteMessage(messageId: string) {
  try {
    const itemName = `messages`;
    const messages = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Message[];
    const updatedMessages = messages.filter(
      (message) => message.id !== messageId,
    );
    localStorage.setItem(itemName, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localGetMessages(conversationId?: string) {
  try {
    const itemName = `messages`;
    const messages = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Message[];
    if (conversationId) {
      return messages.filter(
        (message) => message.conversationId === conversationId,
      );
    }
    return messages;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function localCreateMessages(newMessages: Message[]) {
  try {
    const itemName = `messages`;
    const messages = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Message[];
    const updatedMessages = [...messages, ...newMessages];
    localStorage.setItem(itemName, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localUpdateMessages(updatedMessages: Message[]) {
  try {
    const itemName = `messages`;
    const messages = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Message[];
    const allUpdatedMessages = updatedMessages.map((updatedMessage) => {
      const message = messages.find(
        (message) => message.id === updatedMessage.id,
      );
      if (!message) {
        return updatedMessage;
      }
      return {
        ...message,
        ...updatedMessage,
      };
    });
    localStorage.setItem(itemName, JSON.stringify(allUpdatedMessages));

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function localDeleteMessages(messageIds: string[]) {
  try {
    const itemName = `messages`;
    const messages = JSON.parse(
      localStorage.getItem(itemName) || '[]',
    ) as Message[];
    const updatedMessages = messages.filter(
      (message) => !messageIds.includes(message.id),
    );
    localStorage.setItem(itemName, JSON.stringify(updatedMessages));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
