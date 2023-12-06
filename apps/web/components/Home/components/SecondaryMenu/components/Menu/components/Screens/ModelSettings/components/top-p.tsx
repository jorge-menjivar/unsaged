import { useContext, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { PossibleAiModels } from '@/types/ai-models';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { Slider } from '@/components/common/ui/slider';
import { Switch } from '@/components/common/ui/switch';

export const TopPSlider = () => {
  const { t } = useTranslation('chat');
  const {
    state: { selectedConversation },
    handleUpdateConversationParams,
  } = useContext(HomeContext);

  const handleChange = (value: number[] | undefined[]) => {
    const newValue = value[0];
    if (selectedConversation) {
      handleUpdateConversationParams(selectedConversation, {
        key: 'top_p',
        value: newValue,
      });
    }
  };

  const [value, setValue] = useState<number[]>([
    selectedConversation?.params.top_p ?? 1.0,
  ]);

  useEffect(() => {
    setValue([selectedConversation?.params.top_p ?? 1.0]);
  }, [selectedConversation?.params.top_p]);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-between items-center">
        <PrimaryLabel
          tip={t(
            'The cumulative probability of parameter highest probability tokens to use for nucleus sampling, between 0 and 1. Defaults to model provider configuration.',
          )}
        >
          {t('Top P')}
        </PrimaryLabel>
        <Switch
          checked={selectedConversation?.params.top_p !== undefined}
          onCheckedChange={(checked) => {
            if (checked) {
              handleChange([1.0]);
            } else {
              handleChange([undefined]);
            }
          }}
        />
      </div>
      <span className="mb-1 text-center text-neutral-900 dark:text-neutral-100">
        {value[0].toFixed(2)}
      </span>
      <Slider
        disabled={selectedConversation?.params.top_p === undefined}
        aria-disabled={selectedConversation?.params.top_p === undefined}
        value={value}
        onValueChange={setValue}
        onValueCommit={handleChange}
        onMouseUp={(e) => console.log(e)}
        max={1}
        step={0.05}
        className={selectedConversation?.params.top_p ? '' : 'opacity-50'}
      />
      <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-neutral-900 dark:text-neutral-100">
        <li className="flex justify-center">
          <span className="absolute">0.0</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">1.0</span>
        </li>
      </ul>
    </div>
  );
};
