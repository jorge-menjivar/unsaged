import { withAuth } from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import { get } from '@vercel/edge-config';

import { dockerEnvVarFix } from './utils/app/docker/envFix';
import { NextRequest } from 'next/server';

export const locales = ["en", "de"] as const;

const publicPages = [
  '/',
];

const getSecret = () => {
  return dockerEnvVarFix(process.env.NEXTAUTH_SECRET);
};

const getEmailPatterns = async () => {
  let patternsString = dockerEnvVarFix(process.env.NEXTAUTH_EMAIL_PATTERNS);

  if (dockerEnvVarFix(process.env.EDGE_CONFIG))
    patternsString = await get<string>('NEXTAUTH_EMAIL_PATTERNS');

  return patternsString ? patternsString.split(',') : [];
};

const intlMiddleware = createMiddleware({
  locales: locales,
  localePrefix: 'as-needed',
  defaultLocale: 'en'
});

const authMiddleware = withAuth(
  (req) => intlMiddleware(req),
  {
    callbacks: {
      async authorized({ token }) {
        if (!token?.email) {
          return false;
        } else {
          const patterns = await getEmailPatterns();
          if (patterns.length === 0) {
            return true; // No patterns specified, allow access
          }

          const email = token.email.toLowerCase();
          for (const pattern of patterns) {
            const regex = new RegExp(pattern.trim());
            if (email.match(regex)) {
              return true; // Email matches one of the patterns, allow access
            }
          }

          return false; // Email does not match any of the patterns, deny access
        }
      },
    },
    secret: getSecret(),
  });

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};