import { FC, MutableRefObject } from 'react';

import { Template } from '@/types/templates';

interface Props {
  templates: Template[];
  activePromptIndex: number;
  onSelect: () => void;
  onMouseOver: (index: number) => void;
  promptListRef: MutableRefObject<HTMLUListElement | null>;
}

export const TemplateListComponent: FC<Props> = ({
  templates,
  activePromptIndex,
  onSelect,
  onMouseOver,
  promptListRef,
}) => {
  return (
    <ul
      ref={promptListRef}
      className="z-20 p-0 max-h-52 w-full overflow-auto rounded-md
      border border-black/10
      shadow-[0_0_10px_rgba(0,0,0,0.10)]
      text-black dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
    >
      {templates.map((prompt, index) => (
        <li
          key={prompt.id}
          className={`${
            index === activePromptIndex
              ? 'bg-gray-200 dark:bg-theme-hover-dark bg-theme-hover-light'
              : ''
          } px-3 py-2 text-sm text-black dark:text-white`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect();
          }}
          onMouseEnter={() => onMouseOver(index)}
        >
          {prompt.name}
        </li>
      ))}
    </ul>
  );
};
