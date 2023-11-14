import { FC, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { DEFAULT_TEMPERATURE } from '@/utils/app/const';

import { PrimaryLabel } from '@/components/Common/Labels/PrimaryLabel';
import HomeContext from '@/components/Home/home.context';
import { Slider } from '@/components/common/ui/slider';

export const TemperatureSlider = () => {
  const { t } = useTranslation('chat');
  const {
    state: { selectedConversation },
    handleUpdateConversationParams,
  } = useContext(HomeContext);
  const handleChange = (value: number[]) => {
    const newValue = value[0];
    if (selectedConversation) {
      handleUpdateConversationParams(selectedConversation, {
        key: 'temperature',
        value: newValue,
      });
    }
  };

  const [value, setValue] = useState<number[]>([
    selectedConversation?.params.temperature ?? DEFAULT_TEMPERATURE,
  ]);

  useEffect(() => {
    setValue([selectedConversation?.params.temperature ?? DEFAULT_TEMPERATURE]);
  }, [selectedConversation?.params.temperature]);

  return (
    <div className="flex flex-col">
      <PrimaryLabel
        tip={t(
          'Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.',
        )}
      >
        {t('Temperature')}
      </PrimaryLabel>
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
