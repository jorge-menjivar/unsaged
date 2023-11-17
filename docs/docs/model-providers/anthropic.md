# Anthropic

## Environment Variables

### ANTHROPIC_API_KEY

#### Description

The API key for your Anthropic account.

#### Example

```sh
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

### ANTHROPIC_API_VERSION

#### Description

The version of the API you want to use.

See [Anthropic's Documentation](https://docs.anthropic.com/claude/reference/versioning) for a list of available versions.

#### Example

```sh
ANTHROPIC_API_VERSION="2023-06-01"
```

---

### ANTHROPIC_API_URL

#### Description

The base url for the API.

#### Example

```sh
ANTHROPIC_API_URL="https://api.anthropic.com/v1"
```

---

### NEXT_PUBLIC_DEFAULT_ANTHROPIC_SYSTEM_PROMPT

#### Description

The default system prompt for Anthropic models.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_ANTHROPIC_SYSTEM_PROMPT="'\n\nHuman: You are Claude, a large language model trained by Anthropic. Follow the my instructions carefully. Respond using markdown.\n\nAssistant: Okay."
```

---

### NEXT_PUBLIC_DEFAULT_ANTHROPIC_TEMPERATURE

#### Description

The default temperature to use on new conversations using Anthropic models. Must be a value between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_ANTHROPIC_TEMPERATURE=0.9
```

---

### NEXT_PUBLIC_DEFAULT_ANTHROPIC_TOP_P

#### Description

The default top p to use on new conversations using Anthropic models. Must be a value between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_ANTHROPIC_TOP_P=0.9
```

---

### NEXT_PUBLIC_DEFAULT_ANTHROPIC_TOP_K

#### Description

The default top k to use on new conversations using Anthropic models. Must be a value between 0 and infinity.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_ANTHROPIC_TOP_K=40
```
