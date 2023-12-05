import { FC } from 'react';

import { Template } from '@/types/templates';

import { TemplateComponent } from './template-component';

interface Props {
  templates: Template[];
}

export const PromptList: FC<Props> = ({ templates }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {templates
        .slice()
        .reverse()
        .map((t, index) => (
          <TemplateComponent key={index} template={t} />
        ))}
    </div>
  );
};
