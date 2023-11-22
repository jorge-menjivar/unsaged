import { Database } from '@/types/database';

import { ChatConfig } from '@/chat.config';

export const getDatabase = async (customAccessToken?: string | null) => {
  const database: Database = new ChatConfig.database();
  await database.connect({ customAccessToken: customAccessToken });
  return database;
};
