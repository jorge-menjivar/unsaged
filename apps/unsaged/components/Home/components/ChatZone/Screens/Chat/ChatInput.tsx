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

import { useTranslations } from 'next-intl';

import { Conversation, Message } from '@/types/chat';
import { Prompt } from '@/types/prompt';

import HomeContext from '@/components/Home/home.context';

import ChatContext from './Chat.context';
import { PromptList } from './PromptList';
import { VariableModal } from './VariableModal';

import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSend: (message: Message) => void;
  onRegenerate: () => void;
  onScrollDownClick: () => void;
  stopConversationRef: MutableRefObject<boolean>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
}

export const ChatInput = ({
  onSend,
  onRegenerate,
  onScrollDownClick,
  stopConversationRef,
  textareaRef,
  showScrollDownButton,
}: Props) => {
  const t = useTranslations('chat');

  const {
    state: { selectedConversation, messageIsStreaming, prompts },
  } = useContext(HomeContext);

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

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(promptInputValue.toLowerCase()),
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const maxLength = selectedConversation?.model.maxLength;

    if (maxLength && value.length > maxLength) {
      alert(
        t(
          `Message limit is {{maxLength}} characters. You have entered {{valueLength}} characters.`,
          { maxLength, valueLength: value.length },
        ),
      );
      return;
    }

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
    onSend({
      id: messageId,
      role: 'user',
      content: content.trim(),
      conversationId: selectedConversation.id,
      timestamp: new Date().toISOString(),
    });
    setContent('');

    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleRegenerate = () => {
    if (!selectedConversation) return;
    onRegenerate();
  };

  const handleStopConversation = () => {
    stopConversationRef.current = true;
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
          prevIndex < prompts.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : 0,
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

  const handlePromptSelect = (prompt: Prompt) => {
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
    <div
      className="absolute bottom-0 left-0 w-full border-transparent bg-gradient-to-b 
      dark:border-white/20 from-transparent via-[#f6f7ff] to-[#e9ebff]
      dark:via-[#1e2328] dark:to-[#191d22]"
    >
      <div
        className="relative flex flex-col mb-2 mt-4 last:mb-2 md:mx-4 md:mt-[52px]
      md:last:mb-6 lg:mx-auto md:max-w-2xl md:py-6 lg:max-w-full lg:px-0 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-[1920px] justify-center"
      >
        <div className="flex flex-row justify-center items-center">
          {messageIsStreaming && (
            <button
              className="relative top-0 left-0 right-0 mx-auto mb-3 flex w-fit
            items-center gap-3 rounded border border-neutral-200 bg-theme-light
            py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600
            dark:bg-theme-dark dark:text-white md:mt-2"
              onClick={handleStopConversation}
            >
              <IconPlayerStop size={16} /> {t('Stop Generating')}
            </button>
          )}

          {!messageIsStreaming &&
            selectedConversation &&
            selectedConversationMessages.length > 0 && (
              <button
                className="relative top-0 left-0 right-0 mx-auto mb-3 flex w-fit 
              items-center gap-3 rounded border border-neutral-200 bg-theme-light
              py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 
              dark:bg-theme-dark dark:text-white md:mt-2"
                onClick={handleRegenerate}
              >
                <IconRepeat size={16} /> {t('Regenerate response')}
              </button>
            )}

          {showScrollDownButton && (
            <div className="absolute right-0 mr-4">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
                onClick={onScrollDownClick}
              >
                <IconArrowDown size={18} />
              </button>
            </div>
          )}
        </div>

        <div
          className="relative mx-4 mb-4 flex flex-grow flex-col rounded-md border
        border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50
        dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]
        bg-gradient-to-r from-white via-[#fdf4ff] to-white
        dark:from-[#40414F] dark:via-[#4d3f55] dark:to-[#40414F]
        bg-175% animate-bg-pan-slow"
        >
          <textarea
            ref={textareaRef}
            className="m-0 min-h-[38px] w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-2
             text-black dark:text-white md:py-3 md:pl-3"
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

          <button
            className="absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={handleSend}
          >
            {messageIsStreaming ? (
              <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
            ) : (
              <IconSend size={18} />
            )}
          </button>

          {showPromptList && filteredPrompts.length > 0 && (
            <div className="absolute bottom-12 w-full">
              <PromptList
                activePromptIndex={activePromptIndex}
                prompts={filteredPrompts}
                onSelect={handleInitModal}
                onMouseOver={setActivePromptIndex}
                promptListRef={promptListRef}
              />
            </div>
          )}

          {isModalVisible && (
            <VariableModal
              prompt={filteredPrompts[activePromptIndex]}
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
