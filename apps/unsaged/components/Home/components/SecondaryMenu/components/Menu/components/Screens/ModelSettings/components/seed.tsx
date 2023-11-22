import { useContext, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { Input } from '@/components/common/ui/input';
import { Switch } from '@/components/common/ui/switch';

export const SeedInput = () => {
  const { t } = useTranslation('chat');
  const {
    state: { selectedConversation },
    handleUpdateConversationParams,
  } = useContext(HomeContext);

  const handleChange = (value: number | undefined) => {
    const newValue = value;
    if (selectedConversation) {
      handleUpdateConversationParams(selectedConversation, {
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
