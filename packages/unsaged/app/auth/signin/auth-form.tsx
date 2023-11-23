'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase.types'

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; // Access the environment variable

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      showLinks={false}
      providers={['google']}
      redirectTo={`${baseUrl}/auth/callback`} // Use the environment variable in the URL
    />
  )
}
