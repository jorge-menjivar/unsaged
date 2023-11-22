import { useContext, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { Slider } from '@/components/common/ui/slider';
import { Switch } from '@/components/common/ui/switch';

export const PresencePenaltySlider = () => {
  const { t } = useTranslation('chat');
  const {
    state: { selectedConversation },
    handleUpdateConversationParams,
  } = useContext(HomeContext);

  const handleChange = (value: number[] | undefined[]) => {
    const newValue = value[0];
    if (selectedConversation) {
      handleUpdateConversationParams(selectedConversation, {
        key: 'presence_penalty',
        value: newValue,
      });
    }
  };

  const [value, setValue] = useState<number[]>([
    selectedConversation?.params.presence_penalty ?? 0,
  ]);

  useEffect(() => {
    setValue([selectedConversation?.params.presence_penalty ?? 0]);
  }, [selectedConversation?.params.presence_penalty]);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-between items-center">
        <PrimaryLabel
          tip={t(
            "Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. Defaults to model provider configuration.",
          )}
        >
          {t('Presence Penalty')}
        </PrimaryLabel>
        <Switch
          checked={selectedConversation?.params.presence_penalty !== undefined}
          onCheckedChange={(checked) => {
            if (checked) {
              handleChange([0]);
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
        disabled={selectedConversation?.params.presence_penalty === undefined}
        aria-disabled={
          selectedConversation?.params.presence_penalty === undefined
        }
        value={value}
        onValueChange={setValue}
        onValueCommit={handleChange}
        min={-2}
        max={2}
        step={0.05}
        className={
          selectedConversation?.params.presence_penalty !== undefined
            ? ''
            : 'opacity-50'
        }
      />
      <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-neutral-900 dark:text-neutral-100">
        <li className="flex justify-center">
          <span className="absolute">0.0</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">2.0</span>
        </li>
      </ul>
    </div>
  );
};
