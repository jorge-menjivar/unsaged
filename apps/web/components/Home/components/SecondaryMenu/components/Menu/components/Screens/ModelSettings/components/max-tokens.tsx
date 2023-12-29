import { useContext, useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { Slider } from '@ui/components/ui/slider';
import { Switch } from '@ui/components/ui/switch';

export const MaxTokensSlider = () => {
  const t = useTranslations('chat');
  const {
    state: { selectedConversation, models },
    handleUpdateConversationParams,
  } = useContext(HomeContext);

  const handleChange = (value: number[] | undefined[]) => {
    const newValue = value[0];
    if (selectedConversation) {
      handleUpdateConversationParams(selectedConversation, {
        key: 'max_tokens',
        value: newValue,
      });
    }
  };

  const modelTokenLimit = useMemo(() => {
    if (!selectedConversation?.model?.id) {
      return 128000;
    }

    const model = models.find(m => m.id == selectedConversation?.model?.id);

    if (model?.type == 'text') {
      return model?.tokenLimit ?? 128000;
    } else {
      return 0;
    }
  }, [selectedConversation?.model?.id, models]);

  const [value, setValue] = useState<number[]>([
    selectedConversation?.params.max_tokens ?? modelTokenLimit,
  ]);

  useEffect(() => {
    setValue([selectedConversation?.params.max_tokens ?? modelTokenLimit]);
  }, [modelTokenLimit, selectedConversation?.params.max_tokens]);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-between items-center">
        <PrimaryLabel
          tip={t('maxTokensDescription')}
        >
          {t('maxTokens')}
        </PrimaryLabel>
        <Switch
          checked={selectedConversation?.params.max_tokens !== undefined}
          onCheckedChange={(checked) => {
            if (checked) {
              handleChange([modelTokenLimit]);
            } else {
              handleChange([undefined]);
            }
          }}
        />
      </div>
      <span className="mb-1 text-center text-neutral-900 dark:text-neutral-100">
        {value[0]}
      </span>
      <Slider
        disabled={selectedConversation?.params.max_tokens === undefined}
        aria-disabled={selectedConversation?.params.max_tokens === undefined}
        value={value}
        onValueChange={setValue}
        onValueCommit={handleChange}
        onMouseUp={(e) => console.log(e)}
        max={modelTokenLimit}
        step={1}
        className={selectedConversation?.params.max_tokens ? '' : 'opacity-50'}
      />
      <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-neutral-900 dark:text-neutral-100">
        <li className="flex justify-center">
          <span className="absolute">{0}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{modelTokenLimit}</span>
        </li>
      </ul>
    </div>
  );
};
