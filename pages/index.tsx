import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ANTHROPIC_API_KEY, OPENAI_API_KEY } from '@/utils/app/const';
import { dockerEnvVarFix } from '@/utils/app/docker/envFix';

export { default } from '../components/Home/home';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const defaultModelId = dockerEnvVarFix(process.env.DEFAULT_MODEL);

  return {
    props: {
      serverSideApiKeyIsSet: !!OPENAI_API_KEY || !!ANTHROPIC_API_KEY,
      defaultModelId,
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'chat',
        'sidebar',
        'markdown',
        'promptbar',
      ])),
    },
  };
};
