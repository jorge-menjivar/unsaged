import {
  IconBulbFilled,
  IconCheck,
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

import { debug } from '@/utils/logging';

import { Template } from '@/types/templates';

import SidebarActionButton from '@/components/common/ui/side-bar-action-button';

import PromptsContext from '../prompts.context';
import { PromptModal } from './template-modal';

import { useTemplates } from '@/providers/templates';
import { cn } from 'utils/app/utils';

interface Props {
  template: Template;
}

export const TemplateComponent = ({ template }: Props) => {
  const {
    updateTemplate,
    deleteTemplate,
    setSelectedTemplate,
    selectedTemplate,
  } = useTemplates();

  const { dispatch: promptDispatch } = useContext(PromptsContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleDragStart = () => {
    debug('drag start template', template.id);
    setSelectedTemplate(template);
  };

  const handleDragEnter = (e: any) => {
    e.target.style.background = '#343541';
    e.stopPropagation();
    e.preventDefault();

    if (selectedTemplate) {
      updateTemplate({
        ...selectedTemplate,
        folderId: e.target.dataset.folderId,
      });
      e.target.style.background = '';
    }
  };

  const handleUpdate = (template: Template) => {
    updateTemplate(template);
    promptDispatch({ type: 'change', field: 'searchTerm', value: '' });
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (isDeleting) {
      deleteTemplate(template);
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
          !(selectedTemplate?.id === template.id)
            ? 'hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark'
            : 'bg-theme-selected-light dark:bg-theme-selected-dark',
        )}
        draggable="true"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTemplate(template);
          setShowModal(true);
        }}
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
      >
        <IconBulbFilled size={18} />

        <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3 pointer-events-none">
          {template.name}
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
        <div className="absolute right-1 z-10 flex hover:text-theme-button-icon-hover-light dark:hover:text-theme-button-icon-hover-dark invisible group-hover:visible">
          <SidebarActionButton handleClick={handleOpenDeleteModal}>
            <IconTrash size={18} />
          </SidebarActionButton>
        </div>
      )}

      {showModal && (
        <PromptModal
          template={template}
          onClose={() => setShowModal(false)}
          onUpdatePrompt={handleUpdate}
        />
      )}
    </div>
  );
};
