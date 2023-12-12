import React, {
  MutableRefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { sendChatRequest } from '@/utils/app/chat';
import { storageUpdateConversation } from '@/utils/app/storage/conversation';
import {
  storageCreateMessage,
  storageUpdateMessage,
} from '@/utils/app/storage/message';
import {
  storageDeleteMessages,
  storageGetMessages,
} from '@/utils/app/storage/messages';
import { debug, error } from '@/utils/logging';

import { Session, User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { SavedSettings } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { useAuth } from './auth';
import { useConversations } from './conversations';
import { useDatabase } from './database';
import { useDisplay } from './display';
import { useSettings } from './settings';
import { useSystemPrompts } from './system-prompts';

import { emit, listen } from '@tauri-apps/api/event';
import { v4 as uuidv4 } from 'uuid';

export const MessagesContext = createContext<{
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  selectedMessage: Message | null;
  setSelectedMessage: (message: Message | null) => void;
  sendMessage: (newMessage: Message) => void;
  editMessage: (updatedMessage: Message, index: number) => void;
  regenerateMessage: () => void;
  deleteMessage: (messageId: string) => void;
  stopStreaming: () => void;
}>({
  messages: [],
  setMessages: () => {},
  selectedMessage: null,
  setSelectedMessage: () => {},
  sendMessage: () => {},
  editMessage: () => {},
  regenerateMessage: () => {},
  deleteMessage: () => {},
  stopStreaming: () => {},
});

export const MessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const liveSession = useRef<Session | null>(null);

  const { database } = useDatabase();
  const liveDatabase = useRef<Database | null>(null);

  const { setMessageIsStreaming } = useDisplay();
  const { builtInSystemPrompts } = useSystemPrompts();
  const { savedSettings } = useSettings();

  const { selectedConversation, conversations, setConversations } =
    useConversations();

  const [messages, setMessages] = useState<Message[]>([]);
  const liveMessages = useRef<Message[]>([]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const isInitialized = useRef(false);
  const stopConversationRef = useRef<boolean>(false);

  const isMessageReceiverInitialized = useRef(false);

  useEffect(() => {
    liveSession.current = session;
  }, [session]);

  useEffect(() => {
    liveDatabase.current = database;
  }, [database]);

  useEffect(() => {
    liveMessages.current = messages;
  }, [messages]);
  const fetchMessages = useCallback(async () => {
    if (isInitialized.current || !database || !session) {
      return;
    }

    isInitialized.current = true;

    const _messages = await storageGetMessages(database, session.user!);

    setMessages(_messages);
  }, [database, session]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function messageSender(
    builtInSystemPrompts: SystemPrompt[],
    selectedConversation: Conversation,
    messages: Message[],
    savedSettings: SavedSettings,
  ): Promise<{
    stream: ReadableStream | null;
    controller: AbortController | null;
  }> {
    let customPrompt = selectedConversation.systemPrompt;

    if (!selectedConversation.systemPrompt) {
      customPrompt = builtInSystemPrompts.filter(
        (prompt) =>
          prompt.name === `${selectedConversation.model.vendor} Built-In`,
      )[0];
    }

    const promptInjectedConversation = {
      ...selectedConversation,
      systemPrompt: customPrompt,
    };

    const assistantMessageId = uuidv4();

    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      conversationId: selectedConversation.id,
    };

    setMessages([...messages, assistantMessage]);

    const { stream, controller } = await sendChatRequest(
      promptInjectedConversation,
      messages,
      savedSettings,
      assistantMessageId,
    );

    if (!stream || !controller) {
      setMessageIsStreaming(false);
      return { stream: null, controller: null };
    }

    return { stream, controller };
  }

  const messageReceiver = useCallback(() => {
    if (isMessageReceiverInitialized.current) return;

    isMessageReceiverInitialized.current = true;

    listen('completion-stream', (event: any) => {
      const { id, text } = event.payload;

      setMessages((messages) =>
        messages.map((message) => {
          if (message.id === id) {
            return { ...message, content: message.content + text };
          }
          return message;
        }),
      );
    });

    listen('post-message', (event: any) => {
      if (!liveDatabase.current || !liveSession.current) return;

      const { id } = event.payload;

      const message = liveMessages.current.find((message) => message.id === id);

      if (!message) return;

      storageCreateMessage(
        liveDatabase.current,
        liveSession.current.user!,
        message,
        liveMessages.current.filter((message) => message.id !== id),
      );

      setMessageIsStreaming(false);
    });

    // const reader = stream.getReader();

    // let done = false;
    // let text = '';

    // const assistantMessageId = uuidv4();
    // const responseMessage: Message = {
    //   id: assistantMessageId,
    //   role: 'assistant',
    //   content: '',
    //   timestamp: new Date().toISOString(),
    //   conversationId: conversation.id,
    // };

    // const updatedMessages = [...messages, responseMessage];
    // setMessages(updatedMessages);
    // const length = updatedMessages.length;

    // while (!done) {
    //   try {
    //     if (stopConversationRef.current === true) {
    //       controller.abort();
    //       done = true;
    //       break;
    //     }
    //     const { value, done: doneReading } = await reader.read();

    //     done = doneReading;

    //     if (value) {
    //       const decodedValue = new TextDecoder('utf-8').decode(value);

    //       text += decodedValue;

    //       setMessages((messages) => {
    //         const updatedMessages = [...messages];
    //         messages[length - 1].content = text;
    //         return updatedMessages;
    //       });
    //     }
    //   } catch (e) {
    //     error(e);
    //     done = true;
    //     break;
    //   }
    // }

    // stopConversationRef.current = false;

    // updatedMessages.pop();

    // responseMessage.content = text;

    // setMessageIsStreaming(false);

    // // Saving the response message
    // const finalUpdatedMessages = storageCreateMessage(
    //   database,
    //   user,
    //   responseMessage,
    //   messages,
    // );

    // setMessages(finalUpdatedMessages);
  }, [database, session, messages]);

  useEffect(() => {
    messageReceiver();
  }, [database, session]);

  async function editMessage(updatedMessage: Message, index: number) {
    if (!database || !session || !selectedConversation || !savedSettings)
      return;

    setMessageIsStreaming(true);

    const selectedConversationMessages = messages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    const deleteCount = selectedConversationMessages.length - index - 1;

    let updatedMessages = messages;
    if (deleteCount) {
      const conversationLength = selectedConversationMessages.length;
      const messagesToBeDeleted: string[] = [];

      for (let i = 1; i <= deleteCount; i++) {
        const currentMessage =
          selectedConversationMessages[conversationLength - i];
        messagesToBeDeleted.push(currentMessage.id);
      }
      updatedMessages = storageDeleteMessages(
        database,
        session.user!,
        messagesToBeDeleted,
        messages,
      );
    }

    // Add the user message
    updatedMessages = storageUpdateMessage(
      database,
      session.user!,
      updatedMessage,
      updatedMessages,
    );

    setMessages(updatedMessages);

    const updatedConversationMessages = updatedMessages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    let updatedConversation = selectedConversation;
    let updatedConversations = conversations;
    // Updating the conversation name
    if (updatedConversationMessages.length === 1) {
      const { content } = updatedMessage;
      const customName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;

      updatedConversation = {
        ...updatedConversation,
        name: customName,
      };

      // Saving the conversation name
      updatedConversations = storageUpdateConversation(
        database,
        session.user!,
        updatedConversation,
        conversations,
      );

      setConversations(updatedConversations);
    }

    const { stream, controller } = await messageSender(
      builtInSystemPrompts,
      updatedConversation,
      updatedConversationMessages,
      savedSettings,
    );

    // Failed to send message
    if (!stream || !controller) {
      return;
    }
  }

  async function regenerateMessage() {
    if (!database || !session || !selectedConversation || !savedSettings)
      return;

    setMessageIsStreaming(true);

    let deleteCount = 1;

    const selectedConversationMessages = messages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    if (
      selectedConversationMessages[selectedConversationMessages.length - 1]
        .role === 'user'
    ) {
      // User was not able to send the last message. User is trying to regenerate the last message.
      // We do not need to delete the last message.
      deleteCount = 0;
    }
    const conversationLength = selectedConversationMessages.length;
    const messagesToBeDeleted: string[] = [];

    for (let i = 0; i < deleteCount; i++) {
      const currentMessage =
        selectedConversationMessages[conversationLength - 1 - i];
      messagesToBeDeleted.push(currentMessage.id);
    }

    const updatedMessages = storageDeleteMessages(
      database,
      session.user!,
      messagesToBeDeleted,
      messages,
    );

    setMessages(updatedMessages);

    const updatedConversationMessages = updatedMessages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    const { stream, controller } = await messageSender(
      builtInSystemPrompts,
      selectedConversation,
      updatedConversationMessages,
      savedSettings,
    );

    // Failed to send message
    if (!stream || !controller) {
      error('Failed to send message');
      return;
    }
  }

  async function sendMessage(newMessage: Message) {
    if (!database || !session || !selectedConversation || !savedSettings)
      return;

    setMessageIsStreaming(true);

    // Saving the user message
    const updatedMessages = storageCreateMessage(
      database,
      session.user!,
      newMessage,
      messages,
    );

    setMessages(updatedMessages);

    const selectedConversationMessages = updatedMessages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );
    let updatedConversation = selectedConversation;
    let updatedConversations = conversations;

    // Updating the conversation name
    if (selectedConversationMessages.length === 1) {
      const { content } = newMessage;
      const newName =
        content.length > 30 ? content.substring(0, 30) + '...' : content;

      updatedConversation = {
        ...selectedConversation,
        name: newName,
      };
      // Saving the conversation name
      updatedConversations = storageUpdateConversation(
        database,
        session.user!,
        updatedConversation,
        conversations,
      );

      setConversations(updatedConversations);
    }

    {
      const { stream, controller } = await messageSender(
        builtInSystemPrompts,
        updatedConversation,
        selectedConversationMessages,
        savedSettings,
      );

      // Failed to send message
      if (!stream || !controller) {
        return;
      }
    }
  }

  const deleteMessage = (messageId: string) => {
    if (!selectedConversation) return;

    const selectedConversationMessages = messages.filter(
      (message) => message.conversationId === selectedConversation.id,
    );

    const findIndex = selectedConversationMessages.findIndex(
      (elm) => elm.id === messageId,
    );

    let messagesToBeDeleted = [];
    if (findIndex < 0) return;

    if (findIndex < selectedConversationMessages.length - 1) {
      messagesToBeDeleted.push(selectedConversationMessages[findIndex].id);
      for (
        let i = findIndex + 1;
        i < selectedConversationMessages.length;
        i++
      ) {
        if (selectedConversationMessages[i].role === 'user') {
          break;
        }
        messagesToBeDeleted.push(selectedConversationMessages[i].id);
      }
    } else {
      messagesToBeDeleted.push(selectedConversationMessages[findIndex].id);
    }

    const updatedMessages = storageDeleteMessages(
      database!,
      session!.user!,
      messagesToBeDeleted,
      messages,
    );
    setMessages(updatedMessages);
  };

  const stopStreaming = () => {
    debug('in stopStreaming');
    emit('stop-streaming', {});
    stopConversationRef.current = true;
    setMessageIsStreaming(false);
  };

  const contextValue = {
    messages,
    setMessages,
    selectedMessage,
    setSelectedMessage,
    sendMessage,
    editMessage,
    regenerateMessage,
    deleteMessage,
    stopStreaming,
  };
  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
