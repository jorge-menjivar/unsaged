---
sidebar_position: 1
---

# 🚧 Installation

## Clone the Repository

```sh
git clone https://github.com/jorge-menjivar/unSAGED.git
```

## Generate Supabase Tables

Run the database migration in [Supabase SQL editor](https://app.supabase.com/project/_/sql) or your favorite SQL editor.


This will do the following:

- Create the tables required by unSAGED.
- Enable Row Level Security for the tables required by unSAGED.
- Apply the Row Level Security policies required by unSAGED.


## Switch to the `packages/unsaged` directory

The `packages/unsaged` directory contains the unSAGED app. All following commands should be run from this directory.

```sh
cd packages/unsaged
```

## Set Environment Variables

The `.env.local` file is the main configuration file for unSAGED. It should be located in the `packages/unsaged` directory of the project.
Create the `packages/unsaged/.env.local` file to set your environment variables.


### Set Supabase Variables

```sh title="packages/unsaged/.env.local"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key
```

### Configure your supabase auth providers at

https://supabase.com/dashboard/project/xxxxxxxxxxxxxxxx/auth/providers

## Enable them or disable them on the UI by adding/removing them from
```
/app/auth/signin/auth-form.tsx
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