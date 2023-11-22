-- Create new user_id function
create or replace function requesting_user_id()
returns text 
language sql stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;


-- public.conversations definition

-- Drop table

-- DROP TABLE public.conversations;

CREATE TABLE public.conversations (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	model_id text NOT NULL,
	system_prompt_id uuid NULL,
	temperature float4 NULL,
	folder_id uuid NULL,
	"timestamp" timestamptz NOT NULL,
	user_id text NOT NULL DEFAULT requesting_user_id(),
	params jsonb NOT NULL DEFAULT '{}'::jsonb,
	CONSTRAINT unique_conversation_id PRIMARY KEY (id)
);


-- public.folders definition

-- Drop table

-- DROP TABLE public.folders;

CREATE TABLE public.folders (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" text NOT NULL,
	folder_type text NOT NULL,
	user_id text NOT NULL DEFAULT requesting_user_id(),
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
	user_id text NOT NULL DEFAULT requesting_user_id(),
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
	user_id text NOT NULL DEFAULT requesting_user_id(),
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
	user_id text NOT NULL DEFAULT requesting_user_id(),
	CONSTRAINT unique_system_prompt_id PRIMARY KEY (id)
);


-- public.conversations foreign keys

ALTER TABLE public.conversations ADD CONSTRAINT conversation_owner_folder FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON UPDATE CASCADE;


-- public.messages foreign keys

ALTER TABLE public.messages ADD CONSTRAINT message_owner_convo FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE ON UPDATE CASCADE;


-- public.prompts foreign keys

ALTER TABLE public.prompts ADD CONSTRAINT prompt_owner_folder FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON UPDATE CASCADE;


-- public.system_prompts foreign keys

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
	USING (requesting_user_id() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."folders"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (requesting_user_id() = user_id)
	WITH CHECK (requesting_user_id() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."folders"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (requesting_user_id() = user_id);




CREATE POLICY "Enable insert for authenticated users only" ON "public"."conversations"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."conversations"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (requesting_user_id() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."conversations"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (requesting_user_id() = user_id)
	WITH CHECK (requesting_user_id() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."conversations"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (requesting_user_id() = user_id);
	
	


CREATE POLICY "Enable insert for authenticated users only" ON "public"."prompts"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."prompts"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (requesting_user_id() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."prompts"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (requesting_user_id() = user_id)
	WITH CHECK (requesting_user_id() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."prompts"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (requesting_user_id() = user_id);
	



CREATE POLICY "Enable insert for authenticated users only" ON "public"."messages"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."messages"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (requesting_user_id() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."messages"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (requesting_user_id() = user_id)
	WITH CHECK (requesting_user_id() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."messages"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (requesting_user_id() = user_id);
	
	


CREATE POLICY "Enable insert for authenticated users only" ON "public"."system_prompts"
	AS PERMISSIVE FOR INSERT
	TO authenticated
	WITH CHECK (true);
	
CREATE POLICY "Enable select for owners" ON "public"."system_prompts"
	AS PERMISSIVE FOR SELECT
	TO public
	USING (requesting_user_id() = user_id);
	
CREATE POLICY "Enable update for owners" ON "public"."system_prompts"
	AS PERMISSIVE FOR UPDATE
	TO public
	USING (requesting_user_id() = user_id)
	WITH CHECK (requesting_user_id() = user_id);
	
CREATE POLICY "Enable delete for owners" ON "public"."system_prompts"
	AS PERMISSIVE FOR DELETE
	TO public
	USING (requesting_user_id() = user_id);
	
