-- Migration to update the default value for the user_id column to auth.uid()
BEGIN;

-- Update the default value for the user_id column to auth.uid()
ALTER TABLE public.conversations
ALTER COLUMN user_id
SET DEFAULT auth.uid ();

ALTER TABLE public.folders
ALTER COLUMN user_id
SET DEFAULT auth.uid ();

ALTER TABLE public.messages
ALTER COLUMN user_id
SET DEFAULT auth.uid ();

ALTER TABLE public.prompts
ALTER COLUMN user_id
SET DEFAULT auth.uid ();

ALTER TABLE public.system_prompts
ALTER COLUMN user_id
SET DEFAULT auth.uid ();

COMMIT;