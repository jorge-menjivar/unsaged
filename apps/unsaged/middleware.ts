import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession()

    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    // if user is signed in and the current path is / redirect the user to /account
    if (user && request.nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  
    // if user is not signed in and the current path is not / redirect the user to /
    if (!user && request.nextUrl.pathname !== '/auth/signin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    return response
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: ['/','/auth/signin', '/account'],
}