'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase.types'
import { NEXT_PUBLIC_SITE_URL } from '@/utils/app/const';

export default function AuthForm() {
  const supabase = createBrowserSupabaseClient<Database>()

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
  )
}
