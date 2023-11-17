import { dockerEnvVarFix } from '../docker/envFix';

export const APPLE_CLIENT_ID =
  dockerEnvVarFix(process.env.APPLE_CLIENT_ID) || '';

export const APPLE_CLIENT_SECRET =
  dockerEnvVarFix(process.env.APPLE_CLIENT_SECRET) || '';

export const AUTH0_CLIENT_ID =
  dockerEnvVarFix(process.env.AUTH0_CLIENT_ID) || '';

export const AUTH0_CLIENT_SECRET =
  dockerEnvVarFix(process.env.AUTH0_CLIENT_SECRET) || '';

export const AUTH0_ISSUER = dockerEnvVarFix(process.env.AUTH0_ISSUER) || '';

export const COGNITO_CLIENT_ID =
  dockerEnvVarFix(process.env.COGNITO_CLIENT_ID) || '';

export const COGNITO_CLIENT_SECRET =
  dockerEnvVarFix(process.env.COGNITO_CLIENT_SECRET) || '';

export const DISCORD_CLIENT_ID =
  dockerEnvVarFix(process.env.DISCORD_CLIENT_ID) || '';

export const DISCORD_CLIENT_SECRET =
  dockerEnvVarFix(process.env.DISCORD_CLIENT_SECRET) || '';

export const EMAIL_FROM = dockerEnvVarFix(process.env.EMAIL_FROM) || '';

export const EMAIL_SERVER = dockerEnvVarFix(process.env.EMAIL_SERVER) || '';

export const FACEBOOK_CLIENT_ID =
  dockerEnvVarFix(process.env.FACEBOOK_CLIENT_ID) || '';

export const FACEBOOK_CLIENT_SECRET =
  dockerEnvVarFix(process.env.FACEBOOK_CLIENT_SECRET) || '';

export const GITHUB_CLIENT_ID =
  dockerEnvVarFix(process.env.GITHUB_CLIENT_ID) || '';

export const GITHUB_CLIENT_SECRET =
  dockerEnvVarFix(process.env.GITHUB_CLIENT_SECRET) || '';

export const GITLAB_CLIENT_ID =
  dockerEnvVarFix(process.env.GITLAB_CLIENT_ID) || '';

export const GITLAB_CLIENT_SECRET =
  dockerEnvVarFix(process.env.GITLAB_CLIENT_SECRET) || '';

export const GOOGLE_CLIENT_ID =
  dockerEnvVarFix(process.env.GOOGLE_CLIENT_ID) || '';

export const GOOGLE_CLIENT_SECRET =
  dockerEnvVarFix(process.env.GOOGLE_CLIENT_SECRET) || '';

export const OKTA_CLIENT_ID = dockerEnvVarFix(process.env.OKTA_CLIENT_ID) || '';

export const OKTA_CLIENT_SECRET =
  dockerEnvVarFix(process.env.OKTA_CLIENT_SECRET) || '';

export const REDDIT_CLIENT_ID =
  dockerEnvVarFix(process.env.REDDIT_CLIENT_ID) || '';

export const REDDIT_CLIENT_SECRET =
  dockerEnvVarFix(process.env.REDDIT_CLIENT_SECRET) || '';

export const SALESFORCE_CLIENT_ID =
  dockerEnvVarFix(process.env.SALESFORCE_CLIENT_ID) || '';

export const SALESFORCE_CLIENT_SECRET =
  dockerEnvVarFix(process.env.SALESFORCE_CLIENT_SECRET) || '';

export const SLACK_CLIENT_ID =
  dockerEnvVarFix(process.env.SLACK_CLIENT_ID) || '';

export const SLACK_CLIENT_SECRET =
  dockerEnvVarFix(process.env.SLACK_CLIENT_SECRET) || '';

export const SPOTIFY_CLIENT_ID =
  dockerEnvVarFix(process.env.SPOTIFY_CLIENT_ID) || '';

export const SPOTIFY_CLIENT_SECRET =
  dockerEnvVarFix(process.env.SPOTIFY_CLIENT_SECRET) || '';

export const TWITCH_CLIENT_ID =
  dockerEnvVarFix(process.env.TWITCH_CLIENT_ID) || '';

export const TWITCH_CLIENT_SECRET =
  dockerEnvVarFix(process.env.TWITCH_CLIENT_SECRET) || '';

export const TWITTER_CLIENT_ID =
  dockerEnvVarFix(process.env.TWITTER_CLIENT_ID) || '';

export const TWITTER_CLIENT_SECRET =
  dockerEnvVarFix(process.env.TWITTER_CLIENT_SECRET) || '';
