import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { storageGetSavedSettingValue } from '@/utils/app/storage/local/settings';

import { PrimaryLabel } from '@/components/common/ui/primary-label';
import { Slider } from '@ui/components/ui/slider';
import { Switch } from '@ui/components/ui/switch';

import { useConversations } from '@/providers/conversations';
import { useSettings } from '@/providers/settings';

export const MaxTokensSlider = () => {
  const { t } = useTranslation('chat');

  const { selectedConversation, updateConversationParams } = useConversations();
  const { savedSettings } = useSettings();

  const handleChange = (value: number[] | undefined[]) => {
    const newValue = value[0];
    if (selectedConversation) {
      updateConversationParams(selectedConversation, {
        key: 'max_tokens',
        value: newValue,
      });
    }
  };

  const modelTokenLimit = useMemo(() => {
    if (!selectedConversation?.model?.id) {
      return 4096;
    }

    const maxTokens = storageGetSavedSettingValue(
      savedSettings!,
      `model.${selectedConversation.model.id}.context_window_size`,
    );

    return maxTokens || 4096;
  }, [selectedConversation?.model?.id]);

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
          tip={t(
            'The maximum number of tokens to generate. The higher the number, the longer the AI will take to generate a response.',
          )}
        >
          {t('Max Tokens')}
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
