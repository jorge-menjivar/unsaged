import {
  IconCheck,
  IconDeviceLaptop,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  DragEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';

import { SystemPrompt } from '@/types/system-prompt';

import SidebarActionButton from '@/components/common/ui/side-bar-action-button';

import SystemPromptsContext from '../system-prompts.context';
import { SystemPromptEditModal } from './system-prompt-edit-modal';

import { useSystemPrompts } from '@/providers/system-prompts';
import { cn } from 'utils/app/utils';

interface Props {
  systemPrompt: SystemPrompt;
}

export const SystemPromptComponent = ({ systemPrompt }: Props) => {
  const { deleteSystemPrompt, setSelectedSystemPrompt, selectedSystemPrompt } =
    useSystemPrompts();

  const { dispatch: promptDispatch } = useContext(SystemPromptsContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (isDeleting) {
      deleteSystemPrompt(systemPrompt.id);
      promptDispatch({ type: 'change', field: 'searchTerm', value: '' });
    }

    setIsDeleting(false);
  };

  const handleCancelDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
  };

  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  const handleDragStart = () => {
    setSelectedSystemPrompt(systemPrompt);
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div className="group relative flex items-center">
      <button
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 text-black dark:text-white',

          !(selectedSystemPrompt?.id === systemPrompt.id)
            ? 'hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark'
            : 'bg-theme-selected-light dark:bg-theme-selected-dark',
        )}
        draggable="true"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedSystemPrompt(systemPrompt);
          setShowModal(true);
        }}
        onDragStart={handleDragStart}
      >
        <IconDeviceLaptop size={18} />

        <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3 pointer-events-none">
          {systemPrompt.name}
        </div>
      </button>

      {(isDeleting || isRenaming) && (
        <div className="absolute right-1 z-10 flex hover:text-theme-button-icon-hover-light dark:hover:text-theme-button-icon-hover-dark">
          <SidebarActionButton handleClick={handleDelete}>
            <IconCheck size={18} />
          </SidebarActionButton>

          <SidebarActionButton handleClick={handleCancelDelete}>
            <IconX size={18} />
          </SidebarActionButton>
        </div>
      )}

      {!isDeleting && !isRenaming && (
        <div className="absolute right-1 z-10 hover:text-theme-button-icon-hover-light dark:hover:text-theme-button-icon-hover-dark invisible group-hover:visible">
          <SidebarActionButton handleClick={handleOpenDeleteModal}>
            <IconTrash size={18} />
          </SidebarActionButton>
        </div>
      )}

      {showModal && (
        <SystemPromptEditModal
          systemPrompt={systemPrompt}
          onClose={() => setShowModal(false)}
          key={systemPrompt.id}
        />
      )}
    </div>
  );
};
