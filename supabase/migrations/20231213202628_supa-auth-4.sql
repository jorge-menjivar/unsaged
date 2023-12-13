-- Migration script to add row level security policies to all tables
BEGIN;

-- Enable RLS for all tables
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;

-- Adding the policies to each table
CREATE POLICY "Enable insert for authenticated users only" ON "public"."folders" AS PERMISSIVE FOR INSERT TO authenticated
WITH
  CHECK (true);

CREATE POLICY "Enable select for owners" ON "public"."folders" AS PERMISSIVE FOR
SELECT
  TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable update for owners" ON "public"."folders" AS PERMISSIVE FOR
UPDATE TO public USING (auth.uid () = user_id)
WITH
  CHECK (auth.uid () = user_id);

CREATE POLICY "Enable delete for owners" ON "public"."folders" AS PERMISSIVE FOR DELETE TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."conversations" AS PERMISSIVE FOR INSERT TO authenticated
WITH
  CHECK (true);

CREATE POLICY "Enable select for owners" ON "public"."conversations" AS PERMISSIVE FOR
SELECT
  TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable update for owners" ON "public"."conversations" AS PERMISSIVE FOR
UPDATE TO public USING (auth.uid () = user_id)
WITH
  CHECK (auth.uid () = user_id);

CREATE POLICY "Enable delete for owners" ON "public"."conversations" AS PERMISSIVE FOR DELETE TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."prompts" AS PERMISSIVE FOR INSERT TO authenticated
WITH
  CHECK (true);

CREATE POLICY "Enable select for owners" ON "public"."prompts" AS PERMISSIVE FOR
SELECT
  TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable update for owners" ON "public"."prompts" AS PERMISSIVE FOR
UPDATE TO public USING (auth.uid () = user_id)
WITH
  CHECK (auth.uid () = user_id);

CREATE POLICY "Enable delete for owners" ON "public"."prompts" AS PERMISSIVE FOR DELETE TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."messages" AS PERMISSIVE FOR INSERT TO authenticated
WITH
  CHECK (true);

CREATE POLICY "Enable select for owners" ON "public"."messages" AS PERMISSIVE FOR
SELECT
  TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable update for owners" ON "public"."messages" AS PERMISSIVE FOR
UPDATE TO public USING (auth.uid () = user_id)
WITH
  CHECK (auth.uid () = user_id);

CREATE POLICY "Enable delete for owners" ON "public"."messages" AS PERMISSIVE FOR DELETE TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."system_prompts" AS PERMISSIVE FOR INSERT TO authenticated
WITH
  CHECK (true);

CREATE POLICY "Enable select for owners" ON "public"."system_prompts" AS PERMISSIVE FOR
SELECT
  TO public USING (auth.uid () = user_id);

CREATE POLICY "Enable update for owners" ON "public"."system_prompts" AS PERMISSIVE FOR
UPDATE TO public USING (auth.uid () = user_id)
WITH
  CHECK (auth.uid () = user_id);

CREATE POLICY "Enable delete for owners" ON "public"."system_prompts" AS PERMISSIVE FOR DELETE TO public USING (auth.uid () = user_id);

COMMIT;