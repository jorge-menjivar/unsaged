ALTER TABLE public.conversations ADD params jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.conversations ALTER COLUMN "temperature" DROP NOT NULL;
