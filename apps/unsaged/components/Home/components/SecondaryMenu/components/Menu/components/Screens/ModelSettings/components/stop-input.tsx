import { useContext, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { Input } from '@/components/common/ui/input';

export const StopInput = () => {
  const t = useTranslations('chat');
  const {
    state: { selectedConversation },
    handleUpdateConversationParams,
  } = useContext(HomeContext);

  const handleChange = (value: string | undefined) => {
    if (!selectedConversation) {
      return;
    }

    if (value === undefined) {
      handleUpdateConversationParams(selectedConversation, {
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

    handleUpdateConversationParams(selectedConversation, {
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
          tip={t('stopDescription')}
        >
          {t('stop')}
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
