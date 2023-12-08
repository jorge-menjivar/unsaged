import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { error } from '@/utils/logging';

import { Session, User } from '@/types/auth';

export const AuthContext = createContext<{
  session: Session | null;
  login: () => void;
  logout: () => void;
}>({
  session: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isInitialized = useRef(false);

  const [session, setSession] = useState<Session | null>(null);

  const handleAuthenticate = useCallback(async () => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    // const authjsSession = await getSession();

    // if (authjsSession) {
    //   let user: User | undefined = undefined;
    //   if (authjsSession.user) {
    //     user = {
    //       email: authjsSession?.user?.email,
    //       name: authjsSession?.user?.name,
    //       image: authjsSession?.user?.image,
    //     };
    //   }

    //   const session: Session = {
    //     user: user,
    //     expires: authjsSession.expires,
    //     customAccessToken: authjsSession.customAccessToken,
    //   };

    //   return session;
    // } else {

    let user: User = {
      email: 'default-user',
      image: null,
      name: 'Default User',
    };
    const session: Session = {
      user: user,
      expires: 'never',
      customAccessToken: '',
    };
    setSession(session);
  }, []);

  useEffect(() => {
    handleAuthenticate();
  }, [handleAuthenticate]);

  const login = async () => {
    // TODO: implement login
  };

  const logout = async () => {
    // TODO: implement logout
  };

  const contextValue = { session, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    error('useAuth must be used within an AuthProvider');
  }
  return context;
};
