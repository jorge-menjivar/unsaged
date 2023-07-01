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

import SidebarActionButton from '@/components/Common/Buttons/SidebarActionButton';

import SystemPromptsContext from '../SystemPrompts.context';
import { SystemPromptEditModal } from './SystemPromptEditModal';

interface Props {
  systemPrompt: SystemPrompt;
}

export const SystemPromptComponent = ({ systemPrompt }: Props) => {
  const {
    handleUpdateSystemPrompt,
    handleDeleteSystemPrompt,
    dispatch: promptDispatch,
  } = useContext(SystemPromptsContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleUpdate = (systemPrompts: SystemPrompt) => {
    handleUpdateSystemPrompt(systemPrompt);
    promptDispatch({ field: 'searchTerm', value: '' });
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (isDeleting) {
      handleDeleteSystemPrompt(systemPrompt.id);
      promptDispatch({ field: 'searchTerm', value: '' });
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

  const handleDragStart = (
    e: DragEvent<HTMLButtonElement>,
    systemPrompt: SystemPrompt,
  ) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('system_prompt', JSON.stringify(systemPrompt));
    }
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div className="relative flex items-center">
      <button
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors
         duration-200 text-black dark:text-white hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
        draggable="true"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        onDragStart={(e) => handleDragStart(e, systemPrompt)}
        onMouseLeave={() => {
          setIsDeleting(false);
          setIsRenaming(false);
          setRenameValue('');
        }}
      >
        <IconDeviceLaptop size={18} />

        <div
          className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap
        break-all pr-4 text-left text-[12.5px] leading-3"
        >
          {systemPrompt.name}
        </div>
      </button>

      {(isDeleting || isRenaming) && (
        <div
          className="absolute right-1 z-10 flex
        hover:text-theme-button-icon-hover-light dark:hover:text-theme-button-icon-hover-dark"
        >
          <SidebarActionButton handleClick={handleDelete}>
            <IconCheck size={18} />
          </SidebarActionButton>

          <SidebarActionButton handleClick={handleCancelDelete}>
            <IconX size={18} />
          </SidebarActionButton>
        </div>
      )}

      {!isDeleting && !isRenaming && (
        <div
          className="absolute right-1 z-10 flex
        hover:text-theme-button-icon-hover-light dark:hover:text-theme-button-icon-hover-dark"
        >
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
