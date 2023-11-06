import { dockerEnvVarFix } from '../docker/envFix';

export function printEnvVariables() {
  const DEFAULT_MODEL = dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_MODEL);

  const DEFAULT_OPENAI_SYSTEM_PROMPT = dockerEnvVarFix(
    process.env.NEXT_PUBLIC_DEFAULT_OPENAI_SYSTEM_PROMPT,
  );

  const DEFAULT_ANTHROPIC_SYSTEM_PROMPT = dockerEnvVarFix(
    process.env.NEXT_PUBLIC_DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
  );

  const DEFAULT_PALM_SYSTEM_PROMPT = dockerEnvVarFix(
    process.env.NEXT_PUBLIC_DEFAULT_PALM_SYSTEM_PROMPT,
  );

  const DEFAULT_TEMPERATURE = dockerEnvVarFix(
    process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE,
  );

  const OPENAI_API_URL = dockerEnvVarFix(process.env.OPENAI_API_URL);

  const OPENAI_API_KEY = dockerEnvVarFix(process.env.OPENAI_API_KEY);

  const OPENAI_API_TYPE = dockerEnvVarFix(process.env.OPENAI_API_TYPE);

  const OPENAI_API_VERSION = dockerEnvVarFix(process.env.OPENAI_API_VERSION);

  const OPENAI_ORGANIZATION = dockerEnvVarFix(process.env.OPENAI_ORGANIZATION);
  const ANTHROPIC_API_URL = dockerEnvVarFix(process.env.ANTHROPIC_API_URL);

  const ANTHROPIC_API_KEY = dockerEnvVarFix(process.env.ANTHROPIC_API_KEY);

  const ANTHROPIC_API_VERSION = dockerEnvVarFix(
    process.env.ANTHROPIC_API_VERSION,
  );

  const PALM_API_URL = dockerEnvVarFix(process.env.PALM_API_URL);

  const PALM_API_KEY = dockerEnvVarFix(process.env.PALM_API_KEY);

  const APP_DOMAIN = dockerEnvVarFix(process.env.NEXT_PUBLIC_APP_DOMAIN);

  const SUPABASE_URL = dockerEnvVarFix(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const SUPABASE_SERVICE_ROLE_KEY = dockerEnvVarFix(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const SUPABASE_ANON_KEY = dockerEnvVarFix(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const SUPABASE_JWT_SECRET = dockerEnvVarFix(process.env.SUPABASE_JWT_SECRET);

  const DEBUG_MODE = dockerEnvVarFix(process.env.NEXT_PUBLIC_DEBUG_MODE);

  console.log('NEXT_PUBLIC_DEFAULT_MODEL', DEFAULT_MODEL);
  console.log(
    'NEXT_PUBLIC_DEFAULT_OPENAI_SYSTEM_PROMPT',
    DEFAULT_OPENAI_SYSTEM_PROMPT,
  );
  console.log(
    'NEXT_PUBLIC_DEFAULT_ANTHROPIC_SYSTEM_PROMPT',
    DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
  );
  console.log(
    'NEXT_PUBLIC_DEFAULT_PALM_SYSTEM_PROMPT',
    DEFAULT_PALM_SYSTEM_PROMPT,
  );
  console.log('NEXT_PUBLIC_DEFAULT_TEMPERATURE', DEFAULT_TEMPERATURE);
  console.log('OPENAI_API_URL', OPENAI_API_URL);
  console.log('OPENAI_API_KEY', OPENAI_API_KEY);
  console.log('OPENAI_API_TYPE', OPENAI_API_TYPE);
  console.log('OPENAI_API_VERSION', OPENAI_API_VERSION);
  console.log('OPENAI_ORGANIZATION', OPENAI_ORGANIZATION);
  console.log('ANTHROPIC_API_URL', ANTHROPIC_API_URL);
  console.log('ANTHROPIC_API_KEY', ANTHROPIC_API_KEY);
  console.log('ANTHROPIC_API_VERSION', ANTHROPIC_API_VERSION);
  console.log('PALM_API_URL', PALM_API_URL);
  console.log('PALM_API_KEY', PALM_API_KEY);
  console.log('NEXT_PUBLIC_APP_DOMAIN', APP_DOMAIN);
  console.log('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);
  console.log('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY);
  console.log('SUPABASE_JWT_SECRET', SUPABASE_JWT_SECRET);
  console.log('OLLAMA_HOST', process.env.OLLAMA_HOST);
}
