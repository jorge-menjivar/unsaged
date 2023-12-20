import { MemoizedReactMarkdown } from '@/components/markdown/memoized-react-markdown';
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconRobot,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { FC, memo, useContext, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Message } from '@/types/chat';

import { Button } from '@/components/common/ui/button';
import { Textarea } from '@/components/common/ui/textarea';
import { CodeBlock } from '@/components/markdown/code-block';

import ChatContext from './chat.context';

import { useConversations } from '@/providers/conversations';
import { useDisplay } from '@/providers/display';
import { useMessages } from '@/providers/messages';
// `rehype-katex` does not import the CSS for you
import 'katex/dist/katex.min.css';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export interface Props {
  message: Message;
  messageIndex: number;
}

export const ChatMessage: FC<Props> = memo(({ message, messageIndex }) => {
  const { t } = useTranslation('chat');

  const { messageIsStreaming } = useDisplay();

  const { selectedConversation } = useConversations();

  const { setSelectedMessage, deleteMessage } = useMessages();
  const {
    state: { selectedConversationMessages },
  } = useContext(ChatContext);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState(message.content);
  const [messagedCopied, setMessageCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEditMessage = () => {
    if (message.content != messageContent) {
      if (!selectedConversation) return;

      setSelectedMessage(message);
    }
    setIsEditing(false);
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
      e.preventDefault();
      handleEditMessage();
    }
  };

  const copyOnClick = () => {
    if (!navigator.clipboard) return;

    navigator.clipboard.writeText(message.content).then(() => {
      setMessageCopied(true);
      setTimeout(() => {
        setMessageCopied(false);
      }, 2000);
    });
  };

  useEffect(() => {
    setMessageContent(message.content);
  }, [message.content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  return (
    <div
      className={`flex flex-1 sm:px-4 lg:px-8 w-full overflow-hidden max-w-full
        ${
          message.role === 'assistant'
            ? 'bg-gray-200 text-gray-800 dark:bg-[#444654] dark:text-gray-100'
            : 'bg-theme-light text-gray-800 dark:bg-theme-dark dark:text-gray-100'
        }`}
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="group relative w-full m-auto flex p-2 lg:p-4 text-base md:max-w-2xl md:py-6 lg:max-w-3xl lg:px-0 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-[1920px] justify-center overflow-hidden">
        <div className="min-w-[40px] text-right font-bold">
          {message.role === 'assistant' && <IconRobot size={30} />}
          {message.role === 'user' && <IconUser size={30} />}
        </div>

        <div className="prose mt-[-2px] w-full max-w-none dark:prose-invert prose-slate overflow-hidden">
          {message.role === 'user' && (
            <div className="flex w-full">
              {isEditing ? (
                <div className="flex w-full flex-col">
                  <Textarea
                    ref={textareaRef}
                    className="w-full resize-none whitespace-pre-wrap"
                    value={messageContent}
                    onChange={handleInputChange}
                    onKeyDown={handlePressEnter}
                    onCompositionStart={() => setIsTyping(true)}
                    onCompositionEnd={() => setIsTyping(false)}
                  />

                  <div className="mt-4 flex justify-center space-x-4">
                    <Button
                      onClick={handleEditMessage}
                      disabled={messageContent.trim().length <= 0}
                    >
                      {t('Save & Submit')}
                    </Button>
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        setMessageContent(message.content);
                        setIsEditing(false);
                      }}
                    >
                      {t('Cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap flex-1">
                  {message.content}
                </div>
              )}

              {!isEditing && (
                <div className="mt-0 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                  <button
                    className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={toggleEditing}
                  >
                    <IconEdit size={20} />
                  </button>
                  <button
                    className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <IconTrash size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
          {message.role === 'assistant' && (
            <div className="relative flex flex-row mt-[-20px] w-full max-w-full overflow-hidden">
              <div className="w-full overflow-hidden shrink">
                <MemoizedReactMarkdown
                  className="flex-1 w-full"
                  remarkPlugins={[remarkGfm, remarkMath]}
                  // @ts-ignore
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      if (children.length) {
                        if (children[0] == '▍') {
                          return (
                            <span className="animate-pulse cursor-default mt-1">
                              ▍
                            </span>
                          );
                        }

                        children[0] = (children[0] as string).replace(
                          '`▍`',
                          '▍',
                        );
                      }

                      const match = /language-(\w+)/.exec(className || '');

                      return !inline ? (
                        <CodeBlock
                          key={Math.random()}
                          language={(match && match[1]) || ''}
                          value={String(children).replace(/\n$/, '')}
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return (
                        <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                          {children}
                        </table>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="break-words border border-black px-3 py-1 dark:border-white">
                          {children}
                        </td>
                      );
                    },
                    a({ children, ...props }) {
                      return (
                        <a {...props} target="_blank">
                          {children}
                        </a>
                      );
                    },
                    img({ src, alt, width, height }) {
                      if (!width && !height) {
                        width = '1024px';
                        height = '1024px';
                      }
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src!}
                          alt={alt!}
                          width={parseInt(width as string)}
                          height={parseInt(height as string)}
                          className="m-1"
                        />
                      );
                    },
                  }}
                >
                  {`${message.content}${
                    messageIsStreaming &&
                    messageIndex ==
                      (selectedConversationMessages.length ?? 0) - 1
                      ? '`▍`'
                      : ''
                  }`}
                </MemoizedReactMarkdown>
              </div>

              <div className="mt-4 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start shrink-0 h-full">
                {messagedCopied ? (
                  <IconCheck
                    size={20}
                    className="text-green-500 dark:text-green-400"
                  />
                ) : (
                  <button
                    className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 w-8 h-8"
                    onClick={copyOnClick}
                  >
                    <IconCopy size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
ChatMessage.displayName = 'ChatMessage';
