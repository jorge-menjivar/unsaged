'use client';

import { Auth } from '@supabase/auth-ui-react';

import {
  NEXT_PUBLIC_SITE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from '@/utils/app/const';

import { Database } from '@/types/supabase.types';

import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthForm() {
  const supabase = createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  );

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#5b21b6',
              brandAccent: '#7c3aed',
            },
          },
        },
      }}
      theme="default"
      showLinks={true}
      providers={['google']}
      redirectTo={`${NEXT_PUBLIC_SITE_URL}/auth/callback`} // Use the environment variable in the URL
    />
  );
}
