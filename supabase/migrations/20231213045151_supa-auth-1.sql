-- Migration script to transfer the next_auth.users and next_auth.accounts tables to the auth.users and auth.identities tables.
BEGIN;

-- Create a temporary table to hold the transformed data
CREATE TEMP TABLE transformed_users AS
SELECT
  u.id,
  u.email,
  jsonb_build_object (
    'name',
    u."name",
    'picture',
    u.image,
    'avatar_url',
    u.image,
    'email_verified',
    'true',
    'phone_verified',
    'false',
    'email',
    u.email
  ) AS raw_user_meta_data,
  a.access_token,
  a.refresh_token,
  a.expires_at,
  jsonb_build_object (
    'provider',
    a.provider,
    'providers',
    jsonb_agg (DISTINCT a.provider)
  ) AS raw_app_meta_data,
  a.provider,
  a."providerAccountId"
FROM
  next_auth.users u
  LEFT JOIN next_auth.accounts a ON u.id = a."userId"
GROUP BY
  u.id,
  u.email,
  u."name",
  a.access_token,
  a.refresh_token,
  a.expires_at,
  a.provider,
  a."providerAccountId";

-- Insert the results into the auth.users table
INSERT INTO
  auth.users (
    instance_id,
    id,
    aud,
    "role",
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    email_change_confirm_status,
    is_sso_user
  )
SELECT
  '00000000-0000-0000-0000-000000000000' AS instance_id,
  id,
  'authenticated' AS aud,
  'authenticated' AS "role",
  email,
  '' AS encrypted_password,
  now () AS email_confirmed_at,
  '' AS confirmation_token,
  '' AS recovery_token,
  '' AS email_change_token_new,
  '' AS email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  now () AS created_at,
  now () AS updated_at,
  0 AS email_change_confirm_status,
  false AS is_sso_user
FROM
  transformed_users ON CONFLICT (id) DO NOTHING;

-- Insert the results into the auth.identities table.
INSERT INTO
  auth.identities (
    provider_id,
    user_id,
    identity_data,
    "provider",
    last_sign_in_at,
    created_at,
    updated_at
  )
SELECT
  "providerAccountId",
  id,
  raw_user_meta_data,
  "provider",
  now () AS last_sign_in_at,
  now () AS created_at,
  now () AS updated_at
FROM
  transformed_users;

-- Drop the temporary table.
DROP TABLE transformed_users;

COMMIT;