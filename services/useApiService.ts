import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';

export interface GetModelsRequestProps {
  openai_key: string;
  anthropic_key: string;
  palm_key: string;
}

const useApiService = () => {
  const fetchService = useFetch();

  const getModels = useCallback(
    (params: GetModelsRequestProps, signal?: AbortSignal) => {
      return fetchService.post<GetModelsRequestProps>(`/api/models`, {
        body: {
          openai_key: params.openai_key,
          anthropic_key: params.anthropic_key,
          palm_key: params.palm_key,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });
    },
    [fetchService],
  );

  return {
    getModels,
  };
};

export default useApiService;
