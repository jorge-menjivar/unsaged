# GOOGLE

## Environment Variables

### GOOGLE_API_KEY

#### Description

The API key for your Google account.

#### Example

```sh
GOOGLE_API_KEY=your_google_api_key
```

---

### GOOGLE_API_URL

#### Description

The base url for the API.

#### Example

```sh
GOOGLE_API_URL="https://generativelanguage.googleapis.com/v1beta2"
```

---

### NEXT_PUBLIC_DEFAULT_GOOGLE_SYSTEM_PROMPT

#### Description

The default system prompt for GOOGLE models.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_GOOGLE_SYSTEM_PROMPT="You are Bard, a large language model trained by Google. Follow the user's instructions carefully. Respond using markdown. Always specify the programming language you are using when making a markdown code block."
```

### NEXT_PUBLIC_DEFAULT_GOOGLE_TEMPERATURE

#### Description

The default temperature to use on new conversations using Google models. Must be a number between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_GOOGLE_TEMPERATURE=0.9
```

---

### NEXT_PUBLIC_DEFAULT_GOOGLE_TOP_P

#### Description

The default top p to use on new conversations using Google models. Must be a number between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_GOOGLE_TOP_P=0.9
```

---

### NEXT_PUBLIC_DEFAULT_GOOGLE_TOP_K

#### Description

The default top k to use on new conversations using GOOGLE models. Must be a number between 0 and infinity.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_GOOGLE_TOP_K=40
```
