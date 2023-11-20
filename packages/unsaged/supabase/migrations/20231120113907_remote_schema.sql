
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "next_auth";

ALTER SCHEMA "next_auth" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "next_auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

ALTER FUNCTION "next_auth"."uid"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."requesting_user_id"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;

ALTER FUNCTION "public"."requesting_user_id"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "next_auth"."accounts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "type" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "providerAccountId" "text" NOT NULL,
    "refresh_token" "text",
    "access_token" "text",
    "expires_at" bigint,
    "token_type" "text",
    "scope" "text",
    "id_token" "text",
    "session_state" "text",
    "oauth_token_secret" "text",
    "oauth_token" "text",
    "userId" "uuid"
);

ALTER TABLE "next_auth"."accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."sessions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "expires" timestamp with time zone NOT NULL,
    "sessionToken" "text" NOT NULL,
    "userId" "uuid"
);

ALTER TABLE "next_auth"."sessions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text",
    "email" "text",
    "emailVerified" timestamp with time zone,
    "image" "text"
);

ALTER TABLE "next_auth"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."verification_tokens" (
    "identifier" "text",
    "token" "text" NOT NULL,
    "expires" timestamp with time zone NOT NULL
);

ALTER TABLE "next_auth"."verification_tokens" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "model_id" "text" NOT NULL,
    "system_prompt_id" "uuid",
    "temperature" real,
    "folder_id" "uuid",
    "timestamp" timestamp with time zone NOT NULL,
    "user_id" "uuid" DEFAULT "next_auth"."uid"() NOT NULL,
    "owner_id" "text",
    "params" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);

ALTER TABLE "public"."conversations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."folders" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "folder_type" "text" NOT NULL,
    "user_id" "uuid" DEFAULT "next_auth"."uid"() NOT NULL,
    "owner_id" "text"
);

ALTER TABLE "public"."folders" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "role" "text" NOT NULL,
    "content" "text" NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid" DEFAULT "next_auth"."uid"() NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."prompts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "models" "text"[] NOT NULL,
    "folder_id" "uuid",
    "user_id" "uuid" DEFAULT "next_auth"."uid"() NOT NULL,
    "owner_id" "text"
);

ALTER TABLE "public"."prompts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."system_prompts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "models" "text"[] NOT NULL,
    "folder_id" "uuid",
    "user_id" "uuid" DEFAULT "next_auth"."uid"() NOT NULL,
    "owner_id" "text"
);

ALTER TABLE "public"."system_prompts" OWNER TO "postgres";

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "email_unique" UNIQUE ("email");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "provider_unique" UNIQUE ("provider", "providerAccountId");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessiontoken_unique" UNIQUE ("sessionToken");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "token_identifier_unique" UNIQUE ("token", "identifier");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("token");

ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "unique_conversation_id" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."folders"
    ADD CONSTRAINT "unique_folder_id" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "unique_message_id" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prompts"
    ADD CONSTRAINT "unique_prompt_id" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."system_prompts"
    ADD CONSTRAINT "unique_system_prompt_id" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversation_owner" FOREIGN KEY ("user_id") REFERENCES "next_auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversation_owner_folder" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."folders"
    ADD CONSTRAINT "folder_owner" FOREIGN KEY ("user_id") REFERENCES "next_auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "message_owner" FOREIGN KEY ("user_id") REFERENCES "next_auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "message_owner_convo" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."prompts"
    ADD CONSTRAINT "prompt_owner" FOREIGN KEY ("user_id") REFERENCES "next_auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."prompts"
    ADD CONSTRAINT "prompt_owner_folder" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."system_prompts"
    ADD CONSTRAINT "system_prompt_owner" FOREIGN KEY ("user_id") REFERENCES "next_auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."system_prompts"
    ADD CONSTRAINT "system_prompt_owner_folder" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON UPDATE CASCADE;

CREATE POLICY "Enable delete for owners" ON "public"."conversations" FOR DELETE USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for owners" ON "public"."folders" FOR DELETE USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for owners" ON "public"."messages" FOR DELETE USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for owners" ON "public"."prompts" FOR DELETE USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for owners" ON "public"."system_prompts" FOR DELETE USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."conversations" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."folders" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."prompts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."system_prompts" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable select for owners" ON "public"."conversations" FOR SELECT USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for owners" ON "public"."folders" FOR SELECT USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for owners" ON "public"."messages" FOR SELECT USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for owners" ON "public"."prompts" FOR SELECT USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for owners" ON "public"."system_prompts" FOR SELECT USING (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable update for owners" ON "public"."conversations" FOR UPDATE USING (("next_auth"."uid"() = "user_id")) WITH CHECK (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable update for owners" ON "public"."folders" FOR UPDATE USING (("next_auth"."uid"() = "user_id")) WITH CHECK (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable update for owners" ON "public"."messages" FOR UPDATE USING (("next_auth"."uid"() = "user_id")) WITH CHECK (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable update for owners" ON "public"."prompts" FOR UPDATE USING (("next_auth"."uid"() = "user_id")) WITH CHECK (("next_auth"."uid"() = "user_id"));

CREATE POLICY "Enable update for owners" ON "public"."system_prompts" FOR UPDATE USING (("next_auth"."uid"() = "user_id")) WITH CHECK (("next_auth"."uid"() = "user_id"));

ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."folders" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."prompts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."system_prompts" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "next_auth" TO "service_role";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "service_role";

GRANT ALL ON TABLE "next_auth"."accounts" TO "service_role";

GRANT ALL ON TABLE "next_auth"."sessions" TO "service_role";

GRANT ALL ON TABLE "next_auth"."users" TO "service_role";

GRANT ALL ON TABLE "next_auth"."verification_tokens" TO "service_role";

GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";

GRANT ALL ON TABLE "public"."folders" TO "anon";
GRANT ALL ON TABLE "public"."folders" TO "authenticated";
GRANT ALL ON TABLE "public"."folders" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."prompts" TO "anon";
GRANT ALL ON TABLE "public"."prompts" TO "authenticated";
GRANT ALL ON TABLE "public"."prompts" TO "service_role";

GRANT ALL ON TABLE "public"."system_prompts" TO "anon";
GRANT ALL ON TABLE "public"."system_prompts" TO "authenticated";
GRANT ALL ON TABLE "public"."system_prompts" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
