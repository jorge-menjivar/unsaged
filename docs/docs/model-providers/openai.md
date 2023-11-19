# OpenAI

## Environment Variables

### OPENAI_API_KEY

#### Description

The API key for your OpenAI account.

#### Example

```sh
OPENAI_API_KEY=your_openai_api_key
```

---

### OPENAI_ORGANIZATION

#### Description

The organization ID for your OpenAI account.

#### Example

```sh
OPENAI_ORGANIZATION=your_organization_id
```

---

### OPENAI_API_URL

#### Description

The base url for the API.

#### Example

```sh
OPENAI_API_URL="https://api.openai.com/v1"
```

It is possible to use the new [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
```sh
OPENAI_API_URL="https://gateway.ai.cloudflare.com/v1/ACCOUNT_TAG/GATEWAY"
```

---

### OPENAI_API_TYPE

#### Description

The type of API you are using. This can be either `openai` or `azure`.

#### Example

```sh
OPENAI_API_TYPE=azure
```

---

### OPENAI_API_VERSION

#### Description

The version of the API you want to use. Only used in the Azure OpenAI API.

#### Example

```sh
OPENAI_API_VERSION=2023-03-15-preview
```

---

### NEXT_PUBLIC_DEFAULT_OPENAI_SYSTEM_PROMPT

#### Description

The default system prompt for OpenAI models.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OPENAI_SYSTEM_PROMPT="You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown."
```

---

### NEXT_PUBLIC_DEFAULT_OPENAI_TEMPERATURE

#### Description

The default temperature to use on new conversations using OpenAI models. Must be a number between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OPENAI_TEMPERATURE=0.9
```

---

### NEXT_PUBLIC_DEFAULT_OPENAI_TOP_P

#### Description

The default top p to use on new conversations using OpenAI models. Must be a number between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OPENAI_TOP_P=0.9
```

---

### NEXT_PUBLIC_DEFAULT_OPENAI_PRESENCE_PENALTY

#### Description

The default presence penalty to use on new conversations using OpenAI models. Must be a number between -2.0 and 2.0.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OPENAI_PRESENCE_PENALTY=1.5
```

---

### NEXT_PUBLIC_DEFAULT_OPENAI_FREQUENCY_PENALTY

#### Description

The default frequency penalty to use on new conversations using OpenAI models. Must be a number between 0 and 2.0.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OPENAI_FREQUENCY_PENALTY=0.5
```

---

### NEXT_PUBLIC_DEFAULT_OPENAI_SEED

#### Description

The default seed to use on new conversations using OpenAI models.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OPENAI_SEED=42
```
