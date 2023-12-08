import { Database } from '@/types/database';

import { getClientSession } from '../auth/helpers';

import { ChatConfig } from '@/chat.config';

export const getDatabase = async () => {
  const database: Database = new ChatConfig.database();
  let customAccessToken: string | undefined = undefined;
  const session = await getClientSession();
  customAccessToken = session?.customAccessToken;
  await database.connect({ customAccessToken: customAccessToken });
  return database;
};
