import {
  IconArrowDown,
  IconPlayerStop,
  IconRepeat,
  IconSend,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { Message } from '@/types/chat';
import { Template } from '@/types/templates';

import { Button } from '@ui/components/ui/button';
import { Textarea } from '@ui/components/ui/textarea';

import ChatContext from './chat.context';
import { TemplateListComponent } from './template-list';
import { VariableModal } from './variable-modal';

import { useConversations } from '@/providers/conversations';
import { useDisplay } from '@/providers/display';
import { useMessages } from '@/providers/messages';
import { useTemplates } from '@/providers/templates';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onScrollDownClick: () => void;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
}

export const ChatInput = ({
  onScrollDownClick,
  textareaRef,
  showScrollDownButton,
}: Props) => {
  const { t } = useTranslation('chat');

  const { messageIsStreaming } = useDisplay();
  const { templates } = useTemplates();
  const { selectedConversation } = useConversations();
  const { sendMessage, setSelectedMessage, regenerateMessage, stopStreaming } =
    useMessages();

  const {
    state: { selectedConversationMessages },
  } = useContext(ChatContext);

  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showPromptList, setShowPromptList] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const promptListRef = useRef<HTMLUListElement | null>(null);

  const filteredPrompts = templates.filter((prompt) =>
    prompt.name.toLowerCase().includes(promptInputValue.toLowerCase()),
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setContent(value);
    updatePromptListVisibility(value);
  };

  const handleSend = () => {
    if (!selectedConversation) return;

    if (messageIsStreaming) {
      return;
    }

    if (!content) {
      alert(t('Please enter a message'));
      return;
    }

    const messageId = uuidv4();

    const newMessage: Message = {
      id: messageId,
      role: 'user',
      content: content.trim(),
      conversationId: selectedConversation.id,
      timestamp: new Date().toISOString(),
    };

    setSelectedMessage(newMessage);
    sendMessage(newMessage);
    setContent('');

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleInitModal = () => {
    const selectedPrompt = filteredPrompts[activePromptIndex];
    if (selectedPrompt) {
      setContent((prevContent) => {
        const newContent = prevContent?.replace(
          /\/\w*$/,
          selectedPrompt.content,
        );
        return newContent;
      });
      handlePromptSelect(selectedPrompt);
    }
    setShowPromptList(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showPromptList) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < templates.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < templates.length - 1 ? prevIndex + 1 : 0,
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleInitModal();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowPromptList(false);
      } else {
        setActivePromptIndex(0);
      }
    } else if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const parseVariables = (content: string) => {
    const regex = /{{(.*?)}}/g;
    const foundVariables = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      foundVariables.push(match[1]);
    }

    return foundVariables;
  };

  const updatePromptListVisibility = useCallback((text: string) => {
    const match = text.match(/\/\w*$/);

    if (match) {
      setShowPromptList(true);
      setPromptInputValue(match[0].slice(1));
    } else {
      setShowPromptList(false);
      setPromptInputValue('');
    }
  }, []);

  const handlePromptSelect = (prompt: Template) => {
    const parsedVariables = parseVariables(prompt.content);
    setVariables(parsedVariables);

    if (parsedVariables.length > 0) {
      setIsModalVisible(true);
    } else {
      setContent((prevContent) => {
        const updatedContent = prevContent?.replace(/\/\w*$/, prompt.content);
        return updatedContent;
      });
      updatePromptListVisibility(prompt.content);
    }
  };

  const handleSubmit = (updatedVariables: string[]) => {
    const newContent = content?.replace(/{{(.*?)}}/g, (match, variable) => {
      const index = variables.indexOf(variable);
      return updatedVariables[index];
    });

    setContent(newContent);

    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (promptListRef.current) {
      promptListRef.current.scrollTop = activePromptIndex * 30;
    }
  }, [activePromptIndex]);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${
        textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
      }`;
    }
  }, [content, textareaRef]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        promptListRef.current &&
        !promptListRef.current.contains(e.target as Node)
      ) {
        setShowPromptList(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full border-transparent bg-gradient-to-b">
      <div
        className="relative flex flex-col mb-2 last:mb-2 md:mx-4
      md:last:mb-6 lg:mx-auto md:max-w-2xl md:pb-6 lg:max-w-full lg:px-0 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-[1920px] justify-center"
      >
        <div className="flex flex-row justify-center items-center">
          {messageIsStreaming && (
            <Button
              className="absolute -translate-y-[30px] shadow-md"
              variant={'secondary'}
              onClick={stopStreaming}
            >
              <IconPlayerStop size={16} /> {t('Stop Generating')}
            </Button>
          )}

          {!messageIsStreaming &&
            selectedConversation &&
            selectedConversationMessages.length > 0 && (
              <Button
                className="absolute -translate-y-[30px] shadow-md"
                variant={'secondary'}
                onClick={regenerateMessage}
              >
                <IconRepeat size={16} className="mr-2" />{' '}
                {t('Regenerate response')}
              </Button>
            )}

          {showScrollDownButton && (
            <Button
              className="absolute -translate-y-[30px] -translate-x-9 right-0 px-2 shadow-md"
              variant={'secondary'}
              onClick={onScrollDownClick}
            >
              <IconArrowDown size={18} />
            </Button>
          )}
        </div>

        <div className="relative mx-4 mb-4 md:mb-0 flex flex-grow flex-col rounded-md shadow-md bg-white dark:bg-gray-700">
          <Textarea
            ref={textareaRef}
            className="m-0 min-h-[38px] w-full resize-none bg-transparent p-0 py-2 pr-8 pl-2 text-black dark:text-white md:py-3 md:pl-3"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: '400px',
              overflow: `${
                textareaRef.current && textareaRef.current.scrollHeight > 400
                  ? 'auto'
                  : 'hidden'
              }`,
            }}
            placeholder={
              t('Start typing, type / to select a template...') || ''
            }
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <Button
            variant={'ghost'}
            className="absolute right-2 top-1 rounded-sm p-2 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={handleSend}
          >
            {messageIsStreaming ? (
              <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
            ) : (
              <IconSend size={18} />
            )}
          </Button>

          {showPromptList && filteredPrompts.length > 0 && (
            <div className="absolute bottom-12 w-full bg-theme-light dark:bg-theme-dark overflow-hidden p-0 rounded-md">
              <TemplateListComponent
                activePromptIndex={activePromptIndex}
                templates={filteredPrompts}
                onSelect={handleInitModal}
                onMouseOver={setActivePromptIndex}
                promptListRef={promptListRef}
              />
            </div>
          )}

          {isModalVisible && (
            <VariableModal
              templates={filteredPrompts[activePromptIndex]}
              variables={variables}
              onSubmit={handleSubmit}
              onClose={() => setIsModalVisible(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
