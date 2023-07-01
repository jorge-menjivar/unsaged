--
-- Name: next_auth; Type: SCHEMA;
--
CREATE SCHEMA next_auth;

GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON SCHEMA next_auth TO postgres;

--
-- Create users table
--
CREATE TABLE IF NOT EXISTS next_auth.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT email_unique UNIQUE (email)
);

GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;

--- uid() function to be used in RLS policies
CREATE FUNCTION next_auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

--
-- Create sessions table
--
CREATE TABLE IF NOT EXISTS  next_auth.sessions
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    expires timestamp with time zone NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" uuid,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessionToken_unique UNIQUE ("sessionToken"),
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES  next_auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;

--
-- Create accounts table
--
CREATE TABLE IF NOT EXISTS  next_auth.accounts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    "userId" uuid,
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT provider_unique UNIQUE (provider, "providerAccountId"),
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES  next_auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;

--
-- Create verification_tokens table
--
CREATE TABLE IF NOT EXISTS  next_auth.verification_tokens
(
    identifier text,
    token text,
    expires timestamp with time zone NOT NULL,
    CONSTRAINT verification_tokens_pkey PRIMARY KEY (token),
    CONSTRAINT token_unique UNIQUE (token),
    CONSTRAINT token_identifier_unique UNIQUE (token, identifier)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;


-- public.conversations definition

-- Drop table

-- DROP TABLE public.conversations;

CREATE TABLE public.conversations (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	model_id text NOT NULL,
	system_prompt_id uuid NULL,
	temperature float4 NOT NULL,
	folder_id uuid NULL,
	"timestamp" timestamptz NOT NULL,
	user_id uuid NOT NULL DEFAULT next_auth.uid(),
	CONSTRAINT unique_conversation_id PRIMARY KEY (id)
);


-- public.folders definition

-- Drop table

-- DROP TABLE public.folders;

CREATE TABLE public.folders (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	folder_type text NOT NULL,
	user_id uuid NOT NULL DEFAULT next_auth.uid(),
	CONSTRAINT unique_folder_id PRIMARY KEY (id)
);


-- public.messages definition

-- Drop table

-- DROP TABLE public.messages;

CREATE TABLE public.messages (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"role" text NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamptz NOT NULL,
	conversation_id uuid NOT NULL,
	user_id uuid NOT NULL DEFAULT next_auth.uid(),
	CONSTRAINT unique_message_id PRIMARY KEY (id)
);


-- public.prompts definition

-- Drop table

-- DROP TABLE public.prompts;

CREATE TABLE public.prompts (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	description text NOT NULL,
	"content" text NOT NULL,
	models _text NOT NULL,
	folder_id uuid NULL,
	user_id uuid NOT NULL DEFAULT next_auth.uid(),
	CONSTRAINT unique_prompt_id PRIMARY KEY (id)
);


-- public.system_prompts definition

-- Drop table

-- DROP TABLE public.system_prompts;

CREATE TABLE public.system_prompts (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	"content" text NOT NULL,
	models _text NOT NULL,
	folder_id uuid NULL,
	user_id uuid NOT NULL DEFAULT next_auth.uid(),
	CONSTRAINT unique_system_prompt_id PRIMARY KEY (id)
);


-- public.conversations foreign keys

ALTER TABLE public.conversations ADD CONSTRAINT conversation_owner FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.conversations ADD CONSTRAINT conversation_owner_folder FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON UPDATE CASCADE;


-- public.folders foreign keys

ALTER TABLE public.folders ADD CONSTRAINT folder_owner FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- public.messages foreign keys

ALTER TABLE public.messages ADD CONSTRAINT message_owner FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT message_owner_convo FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- public.prompts foreign keys

ALTER TABLE public.prompts ADD CONSTRAINT prompt_owner FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.prompts ADD CONSTRAINT prompt_owner_folder FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON UPDATE CASCADE;


-- public.system_prompts foreign keys

ALTER TABLE public.system_prompts ADD CONSTRAINT system_prompt_owner FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.system_prompts ADD CONSTRAINT system_prompt_owner_folder FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON UPDATE CASCADE;


-- Enable RLS for all tables

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;



-- Adding the policies to each table

CREATE POLICY "Enable insert for authenticated users only" ON "public"."folders"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."folders"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (next_auth.uid() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."folders"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (next_auth.uid() = user_id)
	WITH CHECK (next_auth.uid() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."folders"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (next_auth.uid() = user_id);




CREATE POLICY "Enable insert for authenticated users only" ON "public"."conversations"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."conversations"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (next_auth.uid() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."conversations"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (next_auth.uid() = user_id)
	WITH CHECK (next_auth.uid() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."conversations"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (next_auth.uid() = user_id);
	
	


CREATE POLICY "Enable insert for authenticated users only" ON "public"."prompts"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."prompts"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (next_auth.uid() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."prompts"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (next_auth.uid() = user_id)
	WITH CHECK (next_auth.uid() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."prompts"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (next_auth.uid() = user_id);
	



CREATE POLICY "Enable insert for authenticated users only" ON "public"."messages"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."messages"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (next_auth.uid() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."messages"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (next_auth.uid() = user_id)
	WITH CHECK (next_auth.uid() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."messages"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (next_auth.uid() = user_id);
	
	


CREATE POLICY "Enable insert for authenticated users only" ON "public"."system_prompts"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."system_prompts"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (next_auth.uid() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."system_prompts"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (next_auth.uid() = user_id)
	WITH CHECK (next_auth.uid() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."system_prompts"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (next_auth.uid() = user_id);
	
