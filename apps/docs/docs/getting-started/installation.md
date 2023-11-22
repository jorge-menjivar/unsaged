---
sidebar_position: 1
---

# 🚧 Installation

## Clone the Repository

```sh
git clone https://github.com/jorge-menjivar/unSAGED.git
```

## Generate Supabase Tables

Run the [Generation Script](https://github.com/jorge-menjivar/unSAGED/apps/unsaged/db/GenerationScript.sql) in the [Supabase SQL editor](https://app.supabase.com/project/_/sql).

This will do the following:

- Create the tables required by unSAGED.
- Enable Row Level Security for the tables required by unSAGED.
- Apply the Row Level Security policies required by unSAGED.

## Switch to the `apps/unsaged` directory

The `apps/unsaged` directory contains the unSAGED app. All following commands should be run from this directory.

```sh
cd apps/unsaged
```

## Set Environment Variables

The `.env.local` file is the main configuration file for unSAGED. It should be located in the `apps/unsaged` directory of the project.
Create the `apps/unsaged/.env.local` file to set your environment variables.

Set the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variable to the secret you just created.

```sh title="apps/unsaged/.env.local"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=my_public_key
CLERK_SECRET_KEY=my_secret
```

You need to add the JWT Secret to your Clerk application. [Integrate Supabase with Clerk](https://clerk.com/docs/integrations/databases/supabase#integrate-supabase-with-clerk)

See [Clerk Documentation](https://clerk.com/docs/quickstarts/nextjs) for more information.

### Set Supabase Variables

```sh title="apps/unsaged/.env.local"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key
SUPABASE_JWT_SECRET=supabase_jwt_secret
SUPABASE_SERVICE_ROLE_KEY=supabase_service_role_key
```

## Install Dependencies

```sh
npm i
```

## Run App

### Run Locally

```sh
npm run dev
```

### Run in Docker

When running in docker set the following environment variable:

```sh
docker build -t unsaged . --rm
docker run --env-file=.env.local -p 127.0.0.1:3000:3000 --name unsaged unsaged
```
