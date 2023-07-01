import { withAuth } from 'next-auth/middleware';

import { dockerEnvVarFix } from './utils/app/docker/envFix';

const getSecret = () => {
  return dockerEnvVarFix(process.env.NEXTAUTH_SECRET);
};

const getEmailPatterns = () => {
  const patternsString = dockerEnvVarFix(process.env.NEXTAUTH_EMAIL_PATTERNS);
  return patternsString ? patternsString.split(',') : [];
};

export default withAuth({
  callbacks: {
    async authorized({ token }) {
      if (!token?.email) {
        return false;
      } else {
        const patterns = getEmailPatterns();
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
