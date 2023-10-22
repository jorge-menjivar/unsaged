import {
  MutableRefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Toaster } from 'react-hot-toast';

import Image from 'next/image';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { editMessageHandler } from '@/utils/app/handlers/EditMessage';
import { regenerateMessageHandler } from '@/utils/app/handlers/RegenerateMessage';
import { sendHandlerFunction } from '@/utils/app/handlers/SendMessage';
import { throttle } from '@/utils/data/throttle';

import { Message } from '@/types/chat';

import { ErrorMessageDiv } from '@/components/Common/ErrorMessageDiv';
import HomeContext from '@/components/Home/home.context';

import ChatContext from './Chat.context';
import { ChatInitialState, initialState } from './Chat.state';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { MemoizedChatMessage } from './MemoizedChatMessage';

interface Props {
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat = memo(({ stopConversationRef }: Props) => {
  const {
    state: {
      conversations,
      database,
      messages,
      models,
      modelError,
      loading,
      builtInSystemPrompts,
      user,
      savedSettings,
      selectedConversation,
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const liveMessages = useRef<Message[]>([]);

  useEffect(() => {
    liveMessages.current = messages;
  }, [messages]);

  const chatContextValue = useCreateReducer<ChatInitialState>({
    initialState,
  });

  const {
    state: { selectedConversationMessages },
    dispatch: chatDispatch,
  } = chatContextValue;

  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showScrollDownButton, setShowScrollDownButton] =
    useState<boolean>(false);

  useEffect(() => {
    if (selectedConversation) {
      const _conversationMessages = messages.filter(
        (message) => message.conversationId === selectedConversation.id,
      );
      chatDispatch({
        field: 'selectedConversationMessages',
        value: _conversationMessages,
      });
    }
  }, [chatDispatch, messages, selectedConversation]);

  const getRandomQuote = useCallback(() => {
    const quotes = [
      "Let's get started...",
      'A good day to start learning.',
      "Let's start learning.",
      "Let's build something.",
      'Try experimenting.',
      'Try something new.',
      'Try something different.',
      'Make something unique.',
      'Try something creative.',
      'Make something innovative.',
      'Create something original.',
      'Create something fresh.',
      'Try something novel.',
      'Try something unusual.',
      'Try something unconventional.',
      'Life is a learning process.',
      'Life is short, learn something new.',
      'Learning is a treasure that will follow its owner everywhere.',
      'Learning is not attained by chance, it must be sought for with ardor and diligence.',
      'Learning is not a spectator sport.',
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const [quote, setQuote] = useState<string>(getRandomQuote());
  const [lastConversation, setLastConversation] =
    useState(selectedConversation);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(sendHandlerFunction, [
    conversations,
    homeDispatch,
    selectedConversation,
    stopConversationRef,
    database,
  ]);

  const handleEdit = useCallback(editMessageHandler, [
    conversations,
    homeDispatch,
    selectedConversation,
    stopConversationRef,
    database,
  ]);

  const handleRegenerate = useCallback(regenerateMessageHandler, [
    conversations,
    homeDispatch,
    selectedConversation,
    stopConversationRef,
    database,
  ]);

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [autoScrollEnabled]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
        setShowScrollDownButton(true);
      } else {
        setAutoScrollEnabled(true);
        setShowScrollDownButton(false);
      }
    }
  };

  const handleScrollDown = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const scrollDown = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView(true);
    }
  };
  const throttledScrollDown = throttle(scrollDown, 250);

  useEffect(() => {
    throttledScrollDown();
    if (selectedConversation) {
      // Finding the last message the user sent, which is the current message.
      const lastMessageIndex = selectedConversationMessages.findIndex(
        (message) => message.role === 'user',
      );

      if (lastMessageIndex !== -1) {
        const lastMessage = selectedConversationMessages[lastMessageIndex];
        setCurrentMessage(lastMessage);
      } else {
        setCurrentMessage(null);
      }
    }
  }, [selectedConversation, selectedConversationMessages, throttledScrollDown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScrollEnabled(entry.isIntersecting);
        if (entry.isIntersecting) {
          textareaRef.current?.focus();
        }
      },
      {
        root: null,
        threshold: 0.5,
      },
    );
    const messagesEndElement = messagesEndRef.current;
    if (messagesEndElement) {
      observer.observe(messagesEndElement);
    }
    return () => {
      if (messagesEndElement) {
        observer.unobserve(messagesEndElement);
      }
    };
  }, [messagesEndRef]);

  useEffect(() => {
    if (lastConversation && selectedConversation) {
      if (lastConversation.id !== selectedConversation.id) {
        setLastConversation(selectedConversation);
        setQuote(getRandomQuote());
      }
    }
  }, [selectedConversation, getRandomQuote, lastConversation]);

  return (
    <ChatContext.Provider value={{ ...chatContextValue }}>
      <div
        className="relative flex-1 overflow-hidden bg-theme-light dark:bg-theme-dark
      "
      >
        {models.length === 0 ? (
          <div className="mx-auto flex h-full w-[300px] flex-col justify-center space-y-6 sm:w-[600px]">
            <div className="text-center text-4xl font-bold text-black dark:text-white">
              Welcome to unSAGED
            </div>
          </div>
        ) : modelError ? (
          <ErrorMessageDiv error={modelError} />
        ) : (
          <>
            <div
              className="max-h-full h-full overflow-x-hidden"
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              {selectedConversationMessages.length === 0 ? (
                <div className="h-full w-full px-4 flex flex-col self-center items-center align-middle justify-center select-none">
                  <div className="text-center text-black dark:text-white mb-2 text-xl font-light">
                    {quote}
                  </div>
                  <div className="animate-zoom-pulse-slow">
                    <div className="flex flex-row self-center items-center align-middle justify-center">
                      <div
                        className="h-[64px] z-10 flex flex-row self-center items-start align-middle justify-center
                          w-fit bg-[#e7eaf5] dark:bg-[#1b1f23] rounded-2xl px-2 py-1 shadow-xl"
                      >
                        <Image
                          src="./icon-64.svg"
                          height={64}
                          width={64}
                          alt="logo"
                        />
                        <div
                          className="flex flex-row self-center items-end align-middle justify-center text-transparent 
                          bg-gradient-to-r from-fuchsia-700 via-violet-900 to-indigo-500
                          dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
                          bg-clip-text bg-175% animate-bg-pan-fast rotate-0"
                        >
                          <div className="text-5xl font-semibold">unSAGED</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {selectedConversationMessages.map((message, index) => (
                    <MemoizedChatMessage
                      key={index}
                      message={message}
                      messageIndex={index}
                      onEdit={(editedMessage) => {
                        if (!selectedConversation) return;

                        setCurrentMessage(editedMessage);
                        // discard edited message and the ones that come after then resend
                        handleEdit({
                          user: user!,
                          updatedMessage: editedMessage,
                          index,
                          stopConversationRef,
                          builtInSystemPrompts,
                          conversations,
                          database: database!,
                          savedSettings,
                          dispatch: homeDispatch,
                          messages: liveMessages.current,
                          selectedConversation,
                        });
                      }}
                    />
                  ))}

                  {loading && <ChatLoader />}

                  <div
                    className="h-[100px] sm:h-[162px] bg-theme-light dark:bg-theme-dark"
                    ref={messagesEndRef}
                  />
                </>
              )}
            </div>

            <ChatInput
              stopConversationRef={stopConversationRef}
              textareaRef={textareaRef}
              onSend={(message) => {
                if (!selectedConversation) return;

                setCurrentMessage(message);
                handleSend({
                  user: user!,
                  newMessage: message,
                  stopConversationRef,
                  builtInSystemPrompts,
                  conversations,
                  database: database!,
                  savedSettings,
                  dispatch: homeDispatch,
                  messages: liveMessages.current,
                  selectedConversation,
                });
              }}
              onScrollDownClick={handleScrollDown}
              onRegenerate={() => {
                if (!selectedConversation) return;

                if (currentMessage) {
                  handleRegenerate({
                    user: user!,
                    stopConversationRef,
                    builtInSystemPrompts,
                    conversations,
                    database: database!,
                    savedSettings,
                    dispatch: homeDispatch,
                    messages: liveMessages.current,
                    selectedConversation,
                  });
                }
              }}
              showScrollDownButton={showScrollDownButton}
            />
          </>
        )}
      </div>
      <Toaster />
    </ChatContext.Provider>
  );
});
Chat.displayName = 'Chat';
