import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { ErrorMessage } from '@/types/error';

const useErrorService = () => {
  const t = useTranslations('chat');

  return {
    getModelsError: useMemo(
      () => (error: any) => {
        return !error
          ? null
          : ({
            title: t('Error fetching models.'),
            code: error.status || 'unknown',
            messageLines: error.statusText
              ? [error.statusText]
              : [
                t(
                  'Make sure your OpenAI API key is set in the bottom left of the sidebar.',
                ),
                t(
                  'If you completed this step, OpenAI may be experiencing issues.',
                ),
              ],
          } as ErrorMessage);
      },
      [t],
    ),
  };
};

export default useErrorService;
