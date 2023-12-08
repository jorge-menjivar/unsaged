import { FC } from 'react';

import { Prompt } from '@/types/prompt';

import { PromptComponent } from './PromptComponent';

interface Props {
  prompts: Prompt[];
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
