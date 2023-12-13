'use client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type CookieOptions, createBrowserClient } from '@supabase/ssr'


export async function POST() {
  const cookieStore = cookies()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
  await supabase.auth.signOut()
  return redirect('/login')
}