import { useContext, useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { getModelDefaults } from '@/utils/app/settings/model-defaults';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { Slider } from '@/components/common/ui/slider';
import { Switch } from '@/components/common/ui/switch';

export const TemperatureSlider = () => {
  const t = useTranslations('chat');
  const {
    state: { selectedConversation },
    handleUpdateConversationParams,
  } = useContext(HomeContext);
  const handleChange = (value: number[] | undefined[]) => {
    const newValue = value[0];
    if (selectedConversation) {
      handleUpdateConversationParams(selectedConversation, {
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
          tip={t('temperatureDescription')}
        >
          {t('temperature')}
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
          <span className="absolute">{t('precise')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('neutral')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('creative')}</span>
        </li>
      </ul>
    </div>
  );
};
