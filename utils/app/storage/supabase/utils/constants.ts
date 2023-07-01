import { dockerEnvVarFix } from '@/utils/app/docker/envFix';

export const NEXT_PUBLIC_SUPABASE_URL =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_SUPABASE_URL) || '';

export const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || '';
