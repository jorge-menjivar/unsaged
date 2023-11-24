import { getClientSession } from '../auth/helpers';
import { LocalDatabase } from '../storage/local-database';
import { SupabaseDatabase } from '../storage/supabase';

export const getDatabase = async () => {
  const session = await getClientSession();
  if (session.user?.email === 'default-user') {
    return new LocalDatabase();
  } else {
    const database = new SupabaseDatabase();
    let customAccessToken: string | undefined = undefined;
    customAccessToken = session?.customAccessToken;
    await database.connect({ customAccessToken: customAccessToken! });
    return database;
  }
};
