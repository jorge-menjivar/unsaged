import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { ErrorMessage } from '@/types/error';

const useErrorService = () => {
  const t = useTranslations('error');

  return {
    getModelsError: useMemo(
      () => (error: any) => {
        return !error
          ? null
          : ({
            title: t('fetchingModels'),
            code: error.status || 'unknown',
            messageLines: error.statusText
              ? [error.statusText]
              : [
                t('keyMissing', { vendor: 'OpenAI API' }),
                t('vendorIssue', { vendor: 'OpenAI' }),
              ],
          } as ErrorMessage);
      },
      [t],
    ),
  };
};

export default useErrorService;
