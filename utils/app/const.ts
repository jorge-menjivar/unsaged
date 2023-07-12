import { dockerEnvVarFix } from './docker/envFix';

export const DEFAULT_OPENAI_SYSTEM_PROMPT =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_OPENAI_SYSTEM_PROMPT) ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const DEFAULT_ANTHROPIC_SYSTEM_PROMPT =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_ANTHROPIC_SYSTEM_PROMPT) ||
  '\n\nHuman: You are Claude, a large language model trained by Anthropic. Follow the my instructions carefully. Respond using markdown.\n\nAssistant: Okay.';

export const OPENAI_API_URL =
  dockerEnvVarFix(process.env.OPENAI_API_URL) || 'https://api.openai.com/v1';

export const OPENAI_API_KEY = dockerEnvVarFix(process.env.OPENAI_API_KEY) || '';

export const AZURE_DEPLOYMENT_ID =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_AZURE_DEPLOYMENT_ID) || '';

export const DEFAULT_TEMPERATURE = parseFloat(
  dockerEnvVarFix(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE) || '0.7',
);

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

export const APP_DOMAIN =
  dockerEnvVarFix(process.env.NEXT_PUBLIC_APP_DOMAIN) ||
  'http://localhost:3000';
