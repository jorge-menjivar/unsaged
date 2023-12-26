import { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { PrimaryLabel } from '@ui/components/ui/primary-label';
import { Slider } from '@ui/components/ui/slider';
import { Switch } from '@ui/components/ui/switch';

import { useConversations } from '@/providers/conversations';

export const TemperatureSlider = () => {
  const { t } = useTranslation('chat');

  const { selectedConversation, updateConversationParams } = useConversations();

  const handleChange = (value: number[] | undefined[]) => {
    const newValue = value[0];
    if (selectedConversation) {
      updateConversationParams(selectedConversation, {
        key: 'temperature',
        value: newValue,
      });
    }
  };
  const [value, setValue] = useState<number[]>([
    selectedConversation?.params.temperature ?? 1.0,
  ]);

  useEffect(() => {
    setValue([selectedConversation?.params.temperature ?? 1.0]);
  }, [
    selectedConversation?.params.temperature,
    selectedConversation?.model?.id,
  ]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <PrimaryLabel
          tip={t(
            'Higher values will make the output more random, while lower values will make it more focused and deterministic.',
          )}
        >
          {t('Temperature')}
        </PrimaryLabel>
        <Switch
          checked={selectedConversation?.params.temperature !== undefined}
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
        value={value}
        onValueChange={setValue}
        onValueCommit={handleChange}
        onMouseUp={(e) => console.log(e)}
        max={1.0}
        step={0.05}
        className={
          selectedConversation?.params.temperature !== undefined
            ? ''
            : 'opacity-50'
        }
      />

      <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-neutral-900 dark:text-neutral-100">
        <li className="flex justify-center">
          <span className="absolute">{t('Precise')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('Neutral')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('Creative')}</span>
        </li>
      </ul>
    </div>
  );
};
