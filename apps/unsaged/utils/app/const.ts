import { dockerEnvVarFix } from './docker/envFix';

export const DEBUG_MODE =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEBUG_MODE) === 'true' || false;

export const DEFAULT_MODEL = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_MODEL,
);

export const DEFAULT_TITLE = dockerEnvVarFix(process.env.NEXT_PUBLIC_TITLE) || "unsaged";

export const DEFAULT_DESCRIPTION = dockerEnvVarFix(process.env.NEXT_PUBLIC_DESCRIPTION) ||
  "Open source chat kit engineered for seamless interaction with AI models";

export const DEFAULT_OPENAI_SYSTEM_PROMPT =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_OPENAI_SYSTEM_PROMPT) ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const DEFAULT_OPENAI_TEMPERATURE = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OPENAI_TEMPERATURE,
);

export const DEFAULT_OPENAI_TOP_P = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OPENAI_TOP_P,
);

export const DEFAULT_OPENAI_PRESENCE_PENALTY = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OPENAI_PRESENCE_PENALTY,
);

export const DEFAULT_OPENAI_FREQUENCY_PENALTY = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OPENAI_FREQUENCY_PENALTY,
);

export const DEFAULT_OPENAI_SEED = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OPENAI_SEED,
);

export const DEFAULT_ANTHROPIC_SYSTEM_PROMPT =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_ANTHROPIC_SYSTEM_PROMPT) ||
  '\n\nHuman: You are Claude, a large language model trained by Anthropic. Follow the my instructions carefully. Respond using markdown.\n\nAssistant: Okay.';

export const DEFAULT_ANTHROPIC_TEMPERATURE = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_ANTHROPIC_TEMPERATURE,
);

export const DEFAULT_ANTHROPIC_TOP_P = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_ANTHROPIC_TOP_P,
);

export const DEFAULT_ANTHROPIC_TOP_K = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_ANTHROPIC_TOP_K,
);

export const DEFAULT_PALM_SYSTEM_PROMPT =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_PALM_SYSTEM_PROMPT) ||
  "You are Bard, a large language model trained by Google. Follow the user's instructions carefully. Respond using markdown. Always specify the programming language you are using when making a markdown code block.";

export const DEFAULT_PALM_TEMPERATURE = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_PALM_TEMPERATURE,
);

export const DEFAULT_PALM_TOP_P = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_PALM_TOP_P,
);

export const DEFAULT_PALM_TOP_K = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_PALM_TOP_K,
);

export const DEFAULT_OLLAMA_SYSTEM_PROMPT =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_SYSTEM_PROMPT) ||
  'You are a helpful AI assistant. Follow the my instructions carefully. Your responses will be automatically parsed as markdown. Do not surround your response with any language tags.';

export const DEFAULT_OLLAMA_TEMPERATURE = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_TEMPERATURE,
);

export const DEFAULT_OLLAMA_TOP_P = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_TOP_P,
);

export const DEFAULT_OLLAMA_TOP_K = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_TOP_K,
);

export const DEFAULT_OLLAMA_REPEAT_PENALTY = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_REPEAT_PENALTY,
);

export const DEFAULT_OLLAMA_SEED = dockerEnvVarFix(
  process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_SEED,
);

export const AZURE_DEPLOYMENT_ID =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_AZURE_DEPLOYMENT_ID) || '';

export const OPENAI_API_URL =
  dockerEnvVarFix(process.env.OPENAI_API_URL) || 'https://api.openai.com/v1';

export const OPENAI_API_KEY = dockerEnvVarFix(process.env.OPENAI_API_KEY) || '';

export const OPENAI_API_TYPE =
  dockerEnvVarFix(process.env.OPENAI_API_TYPE) || 'openai';

export const OPENAI_API_VERSION =
  dockerEnvVarFix(process.env.OPENAI_API_VERSION) || '2023-03-15-preview';

export const OPENAI_ORGANIZATION =
  dockerEnvVarFix(process.env.OPENAI_ORGANIZATION) || '';

export const ANTHROPIC_API_URL =
  dockerEnvVarFix(process.env.ANTHROPIC_API_URL) ||
  'https://api.anthropic.com/v1';

export const ANTHROPIC_API_KEY =
  dockerEnvVarFix(process.env.ANTHROPIC_API_KEY) || '';

export const ANTHROPIC_API_VERSION =
  dockerEnvVarFix(process.env.ANTHROPIC_API_VERSION) || '2023-06-01';

export const PALM_API_URL =
  dockerEnvVarFix(process.env.PALM_API_URL) ||
  'https://generativelanguage.googleapis.com/v1beta2';

export const PALM_API_KEY = dockerEnvVarFix(process.env.PALM_API_KEY) || '';

export const OLLAMA_HOST = dockerEnvVarFix(process.env.OLLAMA_HOST) || '';

export const OLLAMA_BASIC_USER =
  dockerEnvVarFix(process.env.OLLAMA_BASIC_USER) || '';

export const OLLAMA_BASIC_PWD =
  dockerEnvVarFix(process.env.OLLAMA_BASIC_PWD) || '';

export const SUPABASE_URL =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  'SUPABASE_URL missing';

export const SUPABASE_SERVICE_ROLE_KEY =
  dockerEnvVarFix(process.env.SUPABASE_SERVICE_ROLE_KEY) || '';

export const SUPABASE_ANON_KEY =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || '';

export const SUPABASE_JWT_SECRET =
  dockerEnvVarFix(process.env.SUPABASE_JWT_SECRET) || '';
