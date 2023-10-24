<p align="center">
    <img src="./public/icon-256.svg" alt="unSAGED logo" width="200px">
</p>

[![Join our Discord](https://discordapp.com/api/guilds/1124558062171209771/widget.png?style=banner2)](https://discord.gg/rMH2acSEzq)

![Screenshot-1](./public/screenshots/screenshot-1.png)

![Screenshot-2](./public/screenshots/screenshot-2.png)

![Screenshot-3](./public/screenshots/screenshot-3.png)

![Screenshot-4](./public/screenshots/screenshot-4.png)

![Screenshot-5](./public/screenshots/screenshot-5.png)

# 🎉 Welcome to unSAGED

unSAGED is a cutting-edge chat kit engineered for seamless interaction with AI models. It allows you to easily have conversations with different AI models from a variety of providers, all in one place. It also allows you to manage multiple users and conversations, and synchronize them across different devices.
Leveraging the power of Next.js and Supabase, it offers a user-friendly and robust interface for engaging with AI models from a variety of providers.

- [🎉 Welcome to unSAGED](#-welcome-to-unsaged)
  - [🌟 Key Features](#-key-features)
  - [🤖 Supported AI Models](#-supported-ai-models)
  - [🚧 Getting Started with unSAGED](#-getting-started-with-unsaged)
    - [Step 1. Clone the Repository](#step-1-clone-the-repository)
    - [Step 2. Generate Supabase Tables](#step-2-generate-supabase-tables)
    - [Step 3. Expose the next_auth schema](#step-3-expose-the-next_auth-schema)
    - [Step 4. Create your auth secret](#step-4-create-your-auth-secret)
    - [Step 5. Create a .env.local file](#step-5-create-a-envlocal-file)
    - [Step 6. Install Dependencies](#step-6-install-dependencies)
    - [Step 7. Run App](#step-7-run-app)
    - [(Optional) Step 8. Provide API Keys in .env.local](#optional-step-8-provide-api-keys-in-envlocal)
  - [⚙️ Configuration](#️-configuration)
    - [Env Variables](#env-variables)
  - [📝 License](#-license)
  - [🤝 How to Contribute](#-how-to-contribute)
  - [📚 Built With](#-built-with)

## 🌟 Key Features

- **Multi-Model Support**: Switch between different AI models from a variety of providers with ease.
- **Multi-User Support**: Easily switch between users and manage their respective conversations.
- **Cloud Sync**: Synchronize your conversations across different devices seamlessly with Supabase.
- **System Prompts**: Personalize your conversation context and the AI's personality with system prompts.
- **Message Templates**: Speed up message generation with support for variable templates.

## 🤖 Supported AI Models

- **[OpenAI](https://openai.com/)**
  - GPT-3.5-Turbo
  - GPT-3.5-Turbo-16k
  - GPT-4
  - GPT-4-32k 
- **[Anthropic](https://www.anthropic.com/)**
  - Claude Instant 1 (100k)
  - Claude 2 (100k)
- **[Google PaLM 2](https://developers.generativeai.google/products/palm)**
  - Chat Bison (Bard)

## 🚧 Getting Started with unSAGED

### Step 1. Clone the Repository

```sh
git clone https://github.com/jorge-menjivar/unSAGED.git
```

### Step 2. Generate Supabase Tables

Run the [Generation Script](./GenerationScript.sql) in the [Supabase SQL editor](https://app.supabase.com/project/_/sql).

This will do the following:

- Create the tables required by unSAGED.
- Create the authentication schema and tables required by NextAuth.js.
- Enable Row Level Security for the tables required by unSAGED.
- Apply the Row Level Security policies required by unSAGED.

### Step 3. Expose the next_auth schema

Expose the next_auth schema in the [API settings](https://app.supabase.com/project/*/settings/api) by adding next_auth to the "Exposed schemas" list.

More information [here](https://authjs.dev/reference/adapter/supabase#expose-the-nextauth-schema-in-supabase).

### Step 4. Create your auth secret

Create your secret with the following command:

```sh
openssl rand -base64 32
```

copy the output and save it for the next step.

### Step 5. Create a .env.local file

Create a `.env.local` file and set the following variable:

```sh
NEXTAUTH_SECRET=your_secret_from_step_4
```

### Step 6. Install Dependencies

```sh
npm i
```

### Step 7. Run App

Run Locally:

```sh
npm run dev
```

Or run with Docker:

```sh
docker build -t unsaged . --rm
docker run --env-file=.env.local -p 127.0.0.1:3000:3000 --name unsaged unsaged
```

### (Optional) Step 8. Provide API Keys in .env.local

To give everyone using your instance of unSAGED access to any API key, create a `.env.local` file and set the appropriate environment variables.
If you do not provide an API key in the env file, users will have to provide their own key.

## ⚙️ Configuration

When deploying the application, the following environment variables can be set:

### Env Variables

| Required  | Environment Variable                        | Default value                                       | Description                                                                                                                          |
| --------- | ------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| No        | NEXT_PUBLIC_DEBUG_MODE                      | `false`                                             | Enables debug mode, which prints env variables to the terminal and console. Useful when debugging docker.                            |
| No        | OPENAI_API_KEY                              |                                                     | The default API key used for authenticating with OpenAI. [Get Key](https://platform.openai.com/account/api-keys)                     |
| No        | OPENAI_API_URL                              | `https://api.openai.com/v1`                         | The base url, for Azure use `https://<endpoint>.openai.azure.com`                                                                    |
| No        | OPENAI_API_TYPE                             | `openai`                                            | The API type, options are `openai` or `azure`                                                                                        |
| No        | OPENAI_API_VERSION                          | `2023-03-15-preview`                                | Only applicable for Azure OpenAI                                                                                                     |
| No        | OPENAI_ORGANIZATION                         |                                                     | Your OpenAI organization ID                                                                                                          |
| No        | AZURE_DEPLOYMENT_ID                         |                                                     | Only applicable for Azure OpenAI                                                                                                     |
| No        | ANTHROPIC_API_URL                           | `https://api.anthropic.com/v1`                      | The base url for the Anthropic API. [Get Key](https://www.anthropic.com/earlyaccess)                                                 |
| No        | ANTHROPIC_API_KEY                           |                                                     | The default API key used for authenticating with Anthropic. See [Versioning](https://docs.anthropic.com/claude/reference/versioning) |
| No        | ANTHROPIC_API_VERSION                       | `2023-06-01`                                        | The version of the Anthropic API                                                                                                     |
| No        | PALM_API_URL                                | `https://generativelanguage.googleapis.com/v1beta2` | The base url for the PALM 2 API from Google                                                                                          |
| No        | PALM_API_KEY                                |                                                     | The default API key used for authenticating with PaLM 2. [Get Key](https://developers.generativeai.google/products/palm)             |
| No        | OLLAMA_HOST                                 | Example: `http://localhost:11434`                   | The base url for Ollama                                                                                                              |
| No        | NEXT_PUBLIC_DEFAULT_OPENAI_SYSTEM_PROMPT    | Defined in [constants file](./utils/app/const.ts)   | The default system prompt to use on new conversations for OpenAI models.                                                             |
| No        | NEXT_PUBLIC_DEFAULT_ANTHROPIC_SYSTEM_PROMPT | Defined in [constants file](./utils/app/const.ts)   | The default system prompt to use on new conversations for Anthropic models.                                                          |
| No        | NEXT_PUBLIC_DEFAULT_PALM_SYSTEM_PROMPT      | Defined in [constants file](./utils/app/const.ts)   | The default system prompt to use on new conversations for PaLM 2 models.                                                             |
| No        | NEXT_PUBLIC_DEFAULT_OLLAMA_SYSTEM_PROMPT    | Defined in [constants file](./utils/app/const.ts)   | The default system prompt to use on new conversations for Ollama models.                                                             |
| No        | NEXT_PUBLIC_DEFAULT_MODEL                   | `gpt-3.5-turbo`                                     | The default model to use on new conversations                                                                                        |
| Yes       | NEXT_PUBLIC_SUPABASE_URL                    |                                                     | The project URL.                                                                                                                     |
| Yes       | NEXT_PUBLIC_SUPABASE_ANON_KEY               |                                                     | The supabase project anon key.                                                                                                       |
| Yes       | SUPABASE_SERVICE_ROLE_KEY                   |                                                     | The supabase project service role key.                                                                                               |
| Yes       | SUPABASE_JWT_SECRET                         |                                                     | **Warning!** Generating a new JWT Secret may invalidate other supabase tokens.                                                       |
| No        | NEXTAUTH_EMAIL_PATTERN                      |                                                     | The email regex pattern granted access to unSAGED. For example `.+@mydomain.com`                                                     |
| Yes       | NEXTAUTH_SECRET                             |                                                     | NextAuth Settings. See [Documentation](https://next-auth.js.org/configuration/options#nextauth_secret)                               |
| In prod.  | NEXTAUTH_URL                                | `http://localhost:3000`                             | NextAuth Settings. See [Documentation](https://next-auth.js.org/configuration/options#nextauth_url)                                  |
| In docker | NEXTAUTH_URL_INTERNAL                       |                                                     | NextAuth Settings. See [Documentation](https://next-auth.js.org/configuration/options#nextauth_url_internal).                        |
| Yes       | \<PROVIDER\>\_CLIENT_ID                     |                                                     | Provider OAuth Client ID                                                                                                             |
| Yes       | \<PROVIDER\>\_CLIENT_SECRET                 |                                                     | Provider OAuth Client Secret                                                                                                         |
| Maybe     | \<PROVIDER\>\_ISSUER                        |                                                     | Provider Issuer URL (Only some providers need this)                                                                                  |
| Maybe     | EMAIL_SERVER                                | `smtp://username:password@smtp.example.com:587`     | Email Provider Mail Server                                                                                                           |
| Maybe     | EMAIL_FROM                                  | `noreply@example.com`                               | Email Provider From address Server                                                                                                   |

Where \<PROVIDER\> is one of the following:

- APPLE
- AUTH0
- COGNITO
- DISCORD
- FACEBOOK
- GITHUB
- GITLAB
- GOOGLE
- OKTA
- REDDIT
- SALESFORCE
- SLACK
- SPOTIFY
- TWITCH
- TWITTER

For example, to enable Google and Github authentication, you would add the following to your `.env.local` file:

```sh
GITHUB_CLIENT_ID=xxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxx
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxx
```

For Auth0, you would add the following:

```sh
AUTH0_CLIENT_ID=xxxxxxxxxxxxx
AUTH0_CLIENT_SECRET=xxxxxxxxxxxxx
AUTH0_ISSUER=https://mydomain.us.auth0.com
```

To enable the Ollama models running locally (llama2, codellama, wizard, etc.) check `https://ollama.ai/`.

## 📝 License

unSAGED is licensed under the Apache 2.0 License. For more information, please refer to the [LICENSE](./LICENSE) file in the repository.

## 🤝 How to Contribute

We welcome contributions to the unSAGED project! If you're interested in contributing, please take a look at our [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines and details on the process.

## 📚 Built With

unSAGED was built using the following technologies:

- [Next.js](https://nextjs.org/): A React framework for production - it makes building static and dynamic React apps a breeze.
- [Supabase](https://supabase.io/): An open-source Firebase alternative. We use it for its awesome database and authentication capabilities.
- [Chatbot UI](https://github.com/mckaywrigley/chatbot-ui): A customizable and easy-to-use chat UI for web applications.

We are grateful to the developers and communities behind these projects for their work that helped make unSAGED possible.
