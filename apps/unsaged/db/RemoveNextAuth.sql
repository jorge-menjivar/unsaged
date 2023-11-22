-- Create new user_id function
create or replace function requesting_user_id()
returns text 
language sql stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;


-- Update Conversations table
drop policy "Enable insert for authenticated users only" on "public"."conversations";

drop policy "Enable select for owners" on "public"."conversations";

drop policy "Enable update for owners" on "public"."conversations";

drop policy "Enable delete for owners" on "public"."conversations";

alter table conversations
drop constraint conversation_owner;

alter table conversations
alter column user_id
type text;

alter table conversations
alter column user_id
set default requesting_user_id ();

create policy "Enable insert for authenticated users only" on "public"."conversations" as PERMISSIVE for insert to authenticated
with
  check (true);

create policy "Enable select for owners" on "public"."conversations" as PERMISSIVE for
select
  to public using (requesting_user_id () = user_id);

create policy "Enable update for owners" on "public"."conversations" as PERMISSIVE
for update
  to public using (requesting_user_id () = user_id)
with
  check (requesting_user_id () = user_id);

create policy "Enable delete for owners" on "public"."conversations" as PERMISSIVE for delete to public using (requesting_user_id () = user_id);


-- Update Folder table
drop policy "Enable insert for authenticated users only" on "public"."folders";

drop policy "Enable select for owners" on "public"."folders";

drop policy "Enable update for owners" on "public"."folders";

drop policy "Enable delete for owners" on "public"."folders";

alter table folders
drop constraint folder_owner;

alter table folders
alter column user_id
type text;

alter table folders
alter column user_id
set default requesting_user_id ();

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


-- Update Messages table
drop policy "Enable insert for authenticated users only" on "public"."messages";

drop policy "Enable select for owners" on "public"."messages";

drop policy "Enable update for owners" on "public"."messages";

drop policy "Enable delete for owners" on "public"."messages";

alter table messages
drop constraint message_owner;

alter table messages
alter column user_id
type text;

alter table messages
alter column user_id
set default requesting_user_id ();

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


-- Update Prompts table
drop policy "Enable insert for authenticated users only" on "public"."prompts";

drop policy "Enable select for owners" on "public"."prompts";

drop policy "Enable update for owners" on "public"."prompts";

drop policy "Enable delete for owners" on "public"."prompts";

alter table prompts
drop constraint prompt_owner;

alter table prompts
alter column user_id
type text;

alter table prompts
alter column user_id
set default requesting_user_id ();

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


-- Update System Prompts table
drop policy "Enable insert for authenticated users only" on "public"."system_prompts";

drop policy "Enable select for owners" on "public"."system_prompts";

drop policy "Enable update for owners" on "public"."system_prompts";

drop policy "Enable delete for owners" on "public"."system_prompts";

alter table system_prompts
drop constraint system_prompt_owner;

alter table system_prompts
alter column user_id
type text;

alter table system_prompts
alter column user_id
set default requesting_user_id ();

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


-- Drop next_auth schema
DROP FUNCTION next_auth.uid;

DROP TABLE next_auth.sessions;
DROP TABLE next_auth.verification_tokens;
DROP TABLE next_auth.accounts;
DROP TABLE next_auth.users;

DROP SCHEMA next_auth;