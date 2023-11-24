import { FC } from 'react';

import { Template } from '@/types/prompt';

import { PromptComponent } from './template-component';

interface Props {
  prompts: Template[];
}

export const PromptList: FC<Props> = ({ prompts }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {prompts
        .slice()
        .reverse()
        .map((prompt, index) => (
          <PromptComponent key={index} prompt={prompt} />
        ))}
    </div>
  );
};
