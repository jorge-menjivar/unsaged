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
- Create the authentication schema and tables required by Auth.js.
- Enable Row Level Security for the tables required by unSAGED.
- Apply the Row Level Security policies required by unSAGED.

## Expose the `next_auth` schema

Expose the `next_auth` schema in the [API settings](https://app.supabase.com/project/_/settings/api) by adding `next_auth` to the "Exposed schemas" list.

More information [here](https://authjs.dev/reference/adapter/supabase#expose-the-nextauth-schema-in-supabase).

Then copy the output and save it for the next step.

## Switch to the `apps/unsaged` directory

The `apps/unsaged` directory contains the unSAGED app. All following commands should be run from this directory.

```sh
cd apps/unsaged
```

## Set Environment Variables

The `.env.local` file is the main configuration file for unSAGED. It should be located in the `apps/unsaged` directory of the project.
Create the `apps/unsaged/.env.local` file to set your environment variables.

### Set Auth Secret

Create your secret with the following command:

```sh
openssl rand -base64 32
```

Set the `NEXTAUTH_SECRET` environment variable to the secret you just created.

```sh title="apps/unsaged/.env.local"
NEXTAUTH_SECRET=my_secret
```

See [Auth.js Documentation](https://next-auth.js.org/configuration/options#nextauth_secret) for more information.

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

## Running in Production

To run in production, you will need to set the following environment variable.

See [Auth.js Documentation](https://next-auth.js.org/configuration/options#nextauth_url) for more information.

```sh title="apps/unsaged/.env.local"
NEXTAUTH_URL=https://yourdomain.com
```
