import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Assuming you have initialized your Supabase client somewhere in your code
const supabase = createClientComponentClient();

export async function getClientSession() {
  try {
    const { data: sessionWrapper } = await supabase.auth.getSession();
    const session = sessionWrapper?.session;

    if (!session) {
      return null;
    }

    const sessionData = {
      user: session.user?.email || '',
      expires: session.expires_at || '',
      customAccessToken: session.access_token || '',
    };

    return sessionData;
  } catch (error) {
    // Handle the error here, e.g., log it or return an error response
    console.error(error);
    return null;
  }
}

export async function getUser() {
  try {
    const { data: sessionWrapper } = await supabase.auth.getSession();
    const session = sessionWrapper?.session;

    let user;

    if (session?.user) {
      const { email, user_metadata } = session.user;
      user = {
        email: email || 'default_user',
        image: '',
        name: user_metadata?.full_name || 'Default User',
      };
    } else {
      user = {
        email: 'default_user',
        image: '',
        name: 'Default User',
      };
    }

    return user;
  } catch (error) {
    // Handle the error here, e.g., log it or return an error response
    console.error(error);
    return null;
  }
}
