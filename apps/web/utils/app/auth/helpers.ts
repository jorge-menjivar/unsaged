import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase.types';

// Initialize your Supabase client once here
const supabaseClient = createClientComponentClient();

export async function getClientSession() {
  try {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    const sessionData = {
      user: session?.user?.email || '',
      expires: session?.expires_at || '',
      customAccessToken: session?.access_token || '',
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
    } = await supabaseClient.auth.getSession();

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
