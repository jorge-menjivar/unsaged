create schema if not exists "next_auth";

create table "next_auth"."accounts" (
    "id" uuid not null default uuid_generate_v4(),
    "type" text not null,
    "provider" text not null,
    "providerAccountId" text not null,
    "refresh_token" text,
    "access_token" text,
    "expires_at" bigint,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    "oauth_token_secret" text,
    "oauth_token" text,
    "userId" uuid
);


create table "next_auth"."sessions" (
    "id" uuid not null default uuid_generate_v4(),
    "expires" timestamp with time zone not null,
    "sessionToken" text not null,
    "userId" uuid
);


create table "next_auth"."users" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text,
    "email" text,
    "emailVerified" timestamp with time zone,
    "image" text
);


create table "next_auth"."verification_tokens" (
    "identifier" text,
    "token" text not null,
    "expires" timestamp with time zone not null
);


CREATE UNIQUE INDEX accounts_pkey ON next_auth.accounts USING btree (id);

CREATE UNIQUE INDEX email_unique ON next_auth.users USING btree (email);

CREATE UNIQUE INDEX provider_unique ON next_auth.accounts USING btree (provider, "providerAccountId");

CREATE UNIQUE INDEX sessions_pkey ON next_auth.sessions USING btree (id);

CREATE UNIQUE INDEX sessiontoken_unique ON next_auth.sessions USING btree ("sessionToken");

CREATE UNIQUE INDEX token_identifier_unique ON next_auth.verification_tokens USING btree (token, identifier);

CREATE UNIQUE INDEX users_pkey ON next_auth.users USING btree (id);

CREATE UNIQUE INDEX verification_tokens_pkey ON next_auth.verification_tokens USING btree (token);

alter table "next_auth"."accounts" add constraint "accounts_pkey" PRIMARY KEY using index "accounts_pkey";

alter table "next_auth"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "next_auth"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "next_auth"."verification_tokens" add constraint "verification_tokens_pkey" PRIMARY KEY using index "verification_tokens_pkey";

alter table "next_auth"."accounts" add constraint "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users(id) ON DELETE CASCADE not valid;

alter table "next_auth"."accounts" validate constraint "accounts_userId_fkey";

alter table "next_auth"."accounts" add constraint "provider_unique" UNIQUE using index "provider_unique";

alter table "next_auth"."sessions" add constraint "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users(id) ON DELETE CASCADE not valid;

alter table "next_auth"."sessions" validate constraint "sessions_userId_fkey";

alter table "next_auth"."sessions" add constraint "sessiontoken_unique" UNIQUE using index "sessiontoken_unique";

alter table "next_auth"."users" add constraint "email_unique" UNIQUE using index "email_unique";

alter table "next_auth"."verification_tokens" add constraint "token_identifier_unique" UNIQUE using index "token_identifier_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION next_auth.uid()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$function$
;


create table "public"."conversations" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "model_id" text not null,
    "system_prompt_id" uuid,
    "temperature" real,
    "folder_id" uuid,
    "timestamp" timestamp with time zone not null,
    "user_id" uuid not null default next_auth.uid(),
    "owner_id" text,
    "params" jsonb not null default '{}'::jsonb
);


alter table "public"."conversations" enable row level security;

create table "public"."folders" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "folder_type" text not null,
    "user_id" uuid not null default next_auth.uid(),
    "owner_id" text
);


alter table "public"."folders" enable row level security;

create table "public"."messages" (
    "id" uuid not null default uuid_generate_v4(),
    "role" text not null,
    "content" text not null,
    "timestamp" timestamp with time zone not null,
    "conversation_id" uuid not null,
    "user_id" uuid not null default next_auth.uid()
);


alter table "public"."messages" enable row level security;

create table "public"."prompts" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text not null,
    "content" text not null,
    "models" text[] not null,
    "folder_id" uuid,
    "user_id" uuid not null default next_auth.uid(),
    "owner_id" text
);


alter table "public"."prompts" enable row level security;

create table "public"."system_prompts" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "content" text not null,
    "models" text[] not null,
    "folder_id" uuid,
    "user_id" uuid not null default next_auth.uid(),
    "owner_id" text
);


alter table "public"."system_prompts" enable row level security;

CREATE UNIQUE INDEX unique_conversation_id ON public.conversations USING btree (id);

CREATE UNIQUE INDEX unique_folder_id ON public.folders USING btree (id);

CREATE UNIQUE INDEX unique_message_id ON public.messages USING btree (id);

CREATE UNIQUE INDEX unique_prompt_id ON public.prompts USING btree (id);

CREATE UNIQUE INDEX unique_system_prompt_id ON public.system_prompts USING btree (id);

alter table "public"."conversations" add constraint "unique_conversation_id" PRIMARY KEY using index "unique_conversation_id";

alter table "public"."folders" add constraint "unique_folder_id" PRIMARY KEY using index "unique_folder_id";

alter table "public"."messages" add constraint "unique_message_id" PRIMARY KEY using index "unique_message_id";

alter table "public"."prompts" add constraint "unique_prompt_id" PRIMARY KEY using index "unique_prompt_id";

alter table "public"."system_prompts" add constraint "unique_system_prompt_id" PRIMARY KEY using index "unique_system_prompt_id";

alter table "public"."conversations" add constraint "conversation_owner" FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversation_owner";

alter table "public"."conversations" add constraint "conversation_owner_folder" FOREIGN KEY (folder_id) REFERENCES folders(id) ON UPDATE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversation_owner_folder";

alter table "public"."folders" add constraint "folder_owner" FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."folders" validate constraint "folder_owner";

alter table "public"."messages" add constraint "message_owner" FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "message_owner";

alter table "public"."messages" add constraint "message_owner_convo" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "message_owner_convo";

alter table "public"."prompts" add constraint "prompt_owner" FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."prompts" validate constraint "prompt_owner";

alter table "public"."prompts" add constraint "prompt_owner_folder" FOREIGN KEY (folder_id) REFERENCES folders(id) ON UPDATE CASCADE not valid;

alter table "public"."prompts" validate constraint "prompt_owner_folder";

alter table "public"."system_prompts" add constraint "system_prompt_owner" FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."system_prompts" validate constraint "system_prompt_owner";

alter table "public"."system_prompts" add constraint "system_prompt_owner_folder" FOREIGN KEY (folder_id) REFERENCES folders(id) ON UPDATE CASCADE not valid;

alter table "public"."system_prompts" validate constraint "system_prompt_owner_folder";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.requesting_user_id()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$function$
;

create policy "Enable delete for owners"
on "public"."conversations"
as permissive
for delete
to public
using ((next_auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."conversations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for owners"
on "public"."conversations"
as permissive
for select
to public
using ((next_auth.uid() = user_id));


create policy "Enable update for owners"
on "public"."conversations"
as permissive
for update
to public
using ((next_auth.uid() = user_id))
with check ((next_auth.uid() = user_id));


create policy "Enable delete for owners"
on "public"."folders"
as permissive
for delete
to public
using ((next_auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."folders"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for owners"
on "public"."folders"
as permissive
for select
to public
using ((next_auth.uid() = user_id));


create policy "Enable update for owners"
on "public"."folders"
as permissive
for update
to public
using ((next_auth.uid() = user_id))
with check ((next_auth.uid() = user_id));


create policy "Enable delete for owners"
on "public"."messages"
as permissive
for delete
to public
using ((next_auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."messages"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for owners"
on "public"."messages"
as permissive
for select
to public
using ((next_auth.uid() = user_id));


create policy "Enable update for owners"
on "public"."messages"
as permissive
for update
to public
using ((next_auth.uid() = user_id))
with check ((next_auth.uid() = user_id));


create policy "Enable delete for owners"
on "public"."prompts"
as permissive
for delete
to public
using ((next_auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."prompts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for owners"
on "public"."prompts"
as permissive
for select
to public
using ((next_auth.uid() = user_id));


create policy "Enable update for owners"
on "public"."prompts"
as permissive
for update
to public
using ((next_auth.uid() = user_id))
with check ((next_auth.uid() = user_id));


create policy "Enable delete for owners"
on "public"."system_prompts"
as permissive
for delete
to public
using ((next_auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."system_prompts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for owners"
on "public"."system_prompts"
as permissive
for select
to public
using ((next_auth.uid() = user_id));


create policy "Enable update for owners"
on "public"."system_prompts"
as permissive
for update
to public
using ((next_auth.uid() = user_id))
with check ((next_auth.uid() = user_id));



