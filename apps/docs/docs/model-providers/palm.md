# PaLM 2

## Environment Variables

### PALM_API_KEY

#### Description

The API key for your Google PaLM account.

#### Example

```sh
PALM_API_KEY=your_palm_api_key
```

---

### PALM_API_URL

#### Description

The base url for the API.

#### Example

```sh
PALM_API_URL="https://generativelanguage.googleapis.com/v1beta2"
```

---

### NEXT_PUBLIC_DEFAULT_PALM_SYSTEM_PROMPT

#### Description

The default system prompt for PaLM 2 models.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_PALM_SYSTEM_PROMPT="You are Bard, a large language model trained by Google. Follow the user's instructions carefully. Respond using markdown. Always specify the programming language you are using when making a markdown code block."
```

### NEXT_PUBLIC_DEFAULT_PALM_TEMPERATURE

#### Description

The default temperature to use on new conversations using PaLM 2 models. Must be a number between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_PALM_TEMPERATURE=0.9
```

---

### NEXT_PUBLIC_DEFAULT_PALM_TOP_P

#### Description

The default top p to use on new conversations using PaLM 2 models. Must be a number between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_PALM_TOP_P=0.9
```

---

### NEXT_PUBLIC_DEFAULT_PALM_TOP_K

#### Description

The default top k to use on new conversations using PaLM 2 models. Must be a number between 0 and infinity.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_PALM_TOP_K=40
```
