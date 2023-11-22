'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()
  const providersFromEnv = process.env.AUTH_PROVIDERS ? process.env.AUTH_PROVIDERS.split(',') : [];

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      showLinks={false}
      providers={['google']}
      redirectTo="http://localhost:3000/auth/callback"
    />
  )
}
