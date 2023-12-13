import { Database } from '@/types/supabase.types';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../const';

import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getClientSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const sessionData = {
      user: session?.user?.email || '',
      expires: session?.expires_at || '',
    };

    return sessionData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUser() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user
      ? {
          email: session.user.email || 'default_user',
          image: session.user.user_metadata?.avatar_url || '',
          name: session.user.user_metadata?.full_name || 'Default User',
        }
      : {
          email: 'default_user',
          image: '',
          name: 'Default User',
        };

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
