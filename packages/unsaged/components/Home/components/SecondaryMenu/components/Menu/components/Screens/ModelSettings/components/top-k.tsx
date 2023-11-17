import { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { Input } from '@/components/common/ui/input';

export const TopKInput = () => {
  const { t } = useTranslation('chat');
  const {
    state: { selectedConversation },
    handleUpdateConversationParams,
  } = useContext(HomeContext);

  const handleChange = (value: number | undefined) => {
    const newValue = value;
    if (selectedConversation) {
      handleUpdateConversationParams(selectedConversation, {
        key: 'top_k',
        value: newValue,
      });
    }
  };

  const [value, setValue] = useState<string>(
    selectedConversation?.params.top_k?.toString() ?? '',
  );

  useEffect(() => {
    setValue(selectedConversation?.params.top_k?.toString() ?? '');
  }, [selectedConversation?.params.top_k]);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-between items-center">
        <PrimaryLabel
          tip={t(
            'The number of highest probability vocabulary tokens to keep for top-k-filtering. Between 1 and infinity. Defaults to model provider configuration.',
          )}
        >
          {t('Top K')}
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
