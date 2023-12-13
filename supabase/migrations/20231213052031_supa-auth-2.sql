-- Migration script to update the foreign key constraints to reference the auth.users(id) column instead of the next_auth.users(user_id) column.
BEGIN;

-- Drop the existing foreign key constraints
ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversation_owner;

ALTER TABLE public.folders
DROP CONSTRAINT IF EXISTS folder_owner;

ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS message_owner;

ALTER TABLE public.prompts
DROP CONSTRAINT IF EXISTS prompt_owner;

ALTER TABLE public.system_prompts
DROP CONSTRAINT IF EXISTS system_prompt_owner;

COMMIT;

BEGIN;

-- Add a new foreign key constraints that references the auth.users(id)
ALTER TABLE public.conversations ADD CONSTRAINT conversation_owner FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.folders ADD CONSTRAINT folder_owner FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.messages ADD CONSTRAINT message_owner FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.prompts ADD CONSTRAINT prompt_owner FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.system_prompts ADD CONSTRAINT system_prompt_owner FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE;

COMMIT;