import { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Input } from '@ui/components/ui/input';
import { PrimaryLabel } from '@/components/common/ui/primary-label';

import { useConversations } from '@/providers/conversations';

export const StopInput = () => {
  const { t } = useTranslation('chat');

  const { selectedConversation, updateConversationParams } = useConversations();

  const handleChange = (value: string | undefined) => {
    if (!selectedConversation) {
      return;
    }

    if (value === undefined) {
      updateConversationParams(selectedConversation, {
        key: 'stop',
        value: value,
      });

      return;
    }

    let splits = value.toString().split(',');

    splits = splits?.map((split) => {
      const trimmed = split.trim();
      return trimmed;
    });

    splits = splits?.filter((split) => split !== '');

    updateConversationParams(selectedConversation, {
      key: 'stop',
      value: splits,
    });
  };

  const [value, setValue] = useState<string>(
    selectedConversation?.params.stop?.join(', ') ?? '',
  );

  useEffect(() => {
    setValue(selectedConversation?.params.stop?.join(', ') ?? '');
  }, [selectedConversation?.params.stop]);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-between items-center">
        <PrimaryLabel
          tip={t(
            'Comma-separated list of tokens to stop generation on. The AI will stop generating tokens once it encounters any of these tokens.',
          )}
        >
          {t('Stop')}
        </PrimaryLabel>
        <Input
          type="text"
          className="w-28"
          value={value}
          onChange={(e) => {
            if (e.target.value === '') {
              setValue('');
              handleChange(undefined);
              return;
            }
            setValue(e.target.value);
            handleChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
