import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { LocalDatabase } from '@/utils/app/storage/local-database';
// import { SupabaseDatabase } from '@/utils/app/storage/supabase';
import { debug, error } from '@/utils/logging';

import { Database } from '@/types/database';

import { useAuth } from './auth';

export const DatabaseContext = createContext<{
  database: Database | null;
}>({
  database: null,
});

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isInitialized = useRef(false);

  const [database, setDatabase] = useState<Database | null>(null);

  const { session } = useAuth();

  const initializeDatabase = useCallback(async () => {
    if (isInitialized.current || !session) {
      return;
    }

    isInitialized.current = true;

    if (session.user?.email === 'default-user') {
      setDatabase(new LocalDatabase());
    } else {
      // const database = new SupabaseDatabase();
      // let customAccessToken: string | undefined = undefined;
      // customAccessToken = session?.customAccessToken;
      // await database.connect({ customAccessToken: customAccessToken! });
      // setDatabase(database);
    }
  }, [session]);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  const contextValue = { database };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
