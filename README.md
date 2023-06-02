# Chatbot UI

Chatbot UI is an open source chat UI for AI models.

<a href="https://discord.gg/q9AQP2w6gK">
  <img src="https://discordapp.com/api/guilds/1103099861215232010/widget.png?style=banner2" alt="Discord Banner"/>
</a>

![Chatbot UI](./public/screenshots/main_screenshot.png)

See a [demo](https://twitter.com/mckaywrigley/status/1640380021423603713?s=46&t=AowqkodyK6B4JccSOxSPew).

## Updates

**Work Completed:**

- [x] Relational database support
- [x] Multiple accounts support
- [x] SSO Authentication support
- [x] Customizable build-time extensions system
- [x] [@chatbot-ui/core](https://github.com/jorge-menjivar/chatbot-ui-core)
- [x] [@chatbot-ui/local-storage](https://github.com/jorge-menjivar/chatbot-ui-local-storage) extension
- [x] [@chatbot-ui/rdbms](https://github.com/jorge-menjivar/chatbot-ui-rdbms) extension
- [x] [@chatbot-ui/supabase](https://github.com/jorge-menjivar/chatbot-ui-supabase) extension

**Up Next:**

- [ ] In-app plugin system
- [ ] @chatbot-ui/couchdb extension
- [ ] @chatbot-ui/mongodb extension

## Deploy

### Vercel

Host your own live version of Chatbot UI with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjorge-menjivar%2Fchatbot-ui)

### Docker

Prepare your `.env.local` file _(see Configuration below)_ then run:

```sh
docker run --env-file=.env.local -p 3000:3000 --name chatbot-ui ghcr.io/jorge-menjivar/chatbot-ui:latest
```

### Docker (Custom)

Clone the repo:

```sh
git clone https://github.com/jorge-menjivar/chatbot-ui.git
```

Prepare your configuration file _(see Configuration below)_:

```sh
cp .env.local.example .env.local
```

Prepare your `.env.local` file _(see Configuration below)_ then build the Docker image:

```sh
make build
```

Run your application:

```sh
make run
```

(optional) Push your image:

```sh
export DOCKER_USER=ghcr.io/username
export DOCKER_TAG=latest
make push
```

## Development

### Step 1. Setup

Clone the repo:

```sh
git clone https://github.com/jorge-menjivar/chatbot-ui.git
```

Prepare your configuration file _(see Configuration below)_:

```sh
cp .env.local.example .env.local
```

### Step 2. Run

Run the development server:

```sh
make dev
```

### Step 3. (optional) Add extensions

Open a new terminal window, then launch a shell to the dev container:

```sh
make shell
```

Enable extensions by following the instructions in the README files of the extensions you want to use:

- [@chatbot-ui/local-storage](https://github.com/jorge-menjivar/chatbot-ui-local-storage) [pre-installed]
- [@chatbot-ui/rdbms](https://github.com/jorge-menjivar/chatbot-ui-rdbms)
- [@chatbot-ui/supabase](https://github.com/jorge-menjivar/chatbot-ui-supabase)
- @chatbot-ui/couchdb [coming soon]
- @chatbot-ui/mongodb [coming soon]

## Configuration

When deploying the application, the following environment variables can be set in `.local.env`:

### Build Variables

These must be set when building the application.

| Environment Variable              | Default value                                       | Description                                                       |
| --------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT | [see here](./utils/app/const.ts)                    | The default system prompt to use on new conversations             |
| NEXT_PUBLIC_DEFAULT_TEMPERATURE   | 1                                                   | The default temperature to use on new conversations               |
| NEXT_PUBLIC_AUTH_ENABLED    | `false`                 | Enable SSO authentication. set 'true' or 'false'                                                                         |

### Chat-related Variables

| Environment Variable              | Default value                                       | Description                                                       |
| --------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| OPENAI_API_KEY                    |                                                     | The default API key used for authentication with OpenAI. If left blank, user will be prompted for their API key.           |
| OPENAI_API_HOST                   | `https://api.openai.com`                            | The base url, for Azure use `https://<endpoint>.openai.azure.com` |
| OPENAI_API_TYPE                   | `openai`                                            | The API type, options are `openai` or `azure`                     |
| OPENAI_API_VERSION                | `2023-03-15-preview`                                | Only applicable for Azure OpenAI                                  |
| OPENAI_ORGANIZATION               |                                                     | Your OpenAI organization ID                                       |
| DEFAULT_MODEL                     | `gpt-3.5-turbo` _(OpenAI)_ `gpt-35-turbo` _(Azure)_ | The default model to use on new conversations                     |
| GOOGLE_API_KEY                    |                                                     | See [Custom Search JSON API documentation][GCSE]                  |
| GOOGLE_CSE_ID                     |                                                     | See [Custom Search JSON API documentation][GCSE]                  |

### Authentication Variables

| Environment Variable        | Default value           | Description                                                                                                              |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| NEXTAUTH_EMAIL_PATTERN      |                         | The email regex pattern granted access to chatbot-ui. For example `.+@mydomain.com`                                      |
| NEXTAUTH_SECRET             |                         | NextAuth Settings. See [Documentation](https://next-auth.js.org/configuration/options#nextauth_secret)                   |
| NEXTAUTH_URL                | `http://localhost:3000` | NextAuth Settings. See [Documentation](https://next-auth.js.org/configuration/options#nextauth_url)                      |
| NEXTAUTH_URL_INTERNAL       |                         | (Optional) NextAuth Settings. See [Documentation](https://next-auth.js.org/configuration/options#nextauth_url_internal). |
| \<PROVIDER\>\_CLIENT_ID     |                         | Provider OAuth Client ID                                                                                                 |
| \<PROVIDER\>\_CLIENT_SECRET |                         | Provider OAuth Client Secret                                                                                             |
| \<PROVIDER\>\_ISSUER        |                         | Provider Issuer URL                                                                                                      |

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
