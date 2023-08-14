import NextAuth, { NextAuthOptions } from 'next-auth';

import { getProviders } from '@/utils/app/auth/providers';
import {
  SUPABASE_JWT_SECRET,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from '@/utils/app/const';

import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import jwt from 'jsonwebtoken';

const authOptions: NextAuthOptions = {
  providers: await getProviders(),
  session: { strategy: 'jwt' },

  // Supabase adapter is only enabled if JWT secret is specified
  adapter: SUPABASE_JWT_SECRET
    ? SupabaseAdapter({
        url: SUPABASE_URL,
        secret: SUPABASE_SERVICE_ROLE_KEY,
      })
    : undefined,
  callbacks: {
    async session({ session, token }) {
      const signingSecret = SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: 'authenticated',
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub,
          email: token.email,
          role: 'authenticated',
        };
        session.customAccessToken = jwt.sign(payload, signingSecret);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
