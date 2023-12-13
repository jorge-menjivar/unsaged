import { Database } from '@/types/database';

import { ChatConfig } from '@/chat.config';

export const getDatabase = async () => {
  const database: Database = new ChatConfig.database() as Database;
  await database.connect();
  return database;
};
