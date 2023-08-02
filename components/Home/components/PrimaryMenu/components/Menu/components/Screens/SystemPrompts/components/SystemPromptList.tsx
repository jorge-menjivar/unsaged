import { FC } from 'react';

import { SystemPrompt } from '@/types/system-prompt';

import { SystemPromptComponent } from './SystemPromptComponent';

interface Props {
  systemPrompts: SystemPrompt[];
}

export const SystemPromptList: FC<Props> = ({ systemPrompts }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {systemPrompts
        .slice()
        .reverse()
        .map((systemPrompt, index) => (
          <SystemPromptComponent key={index} systemPrompt={systemPrompt} />
        ))}
    </div>
  );
};
