import { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Input } from '@ui/components/ui/input';
import { PrimaryLabel } from '@ui/components/ui/primary-label';

import { useConversations } from '@/providers/conversations';

export const SeedInput = () => {
  const { t } = useTranslation('chat');

  const { selectedConversation, updateConversationParams } = useConversations();

  const handleChange = (value: number | undefined) => {
    const newValue = value;
    if (selectedConversation) {
      updateConversationParams(selectedConversation, {
        key: 'seed',
        value: newValue,
      });
    }
  };

  const [value, setValue] = useState<string>(
    selectedConversation?.params.seed?.toString() ?? '',
  );

  useEffect(() => {
    setValue(selectedConversation?.params.seed?.toString() ?? '');
  }, [selectedConversation?.params.seed]);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-between items-center">
        <PrimaryLabel
          tip={t(
            'The seed used to generate the response. The same seed will always generate the same response.',
          )}
        >
          {t('Seed')}
        </PrimaryLabel>
        <Input
          type="number"
          className="w-20"
          value={value}
          onChange={(e) => {
            if (e.target.value === '') {
              setValue('');
              handleChange(undefined);
              return;
            }
            setValue(e.target.value);
            handleChange(Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
};
