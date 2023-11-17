# Ollama

## Environment Variables

### OLLAMA_URL

#### Description

The base url for your Ollama instance.

#### Example

```sh
OLLAMA_HOST="http://127.0.0.1:11434"
```

---

### OLLAMA_BASIC_USER

#### Description

Username for basic authentication with your Ollama endpoint.

#### Example

```sh
OLLAMA_BASIC_USER=your_ollama_basic_auth_user
```

---

### OLLAMA_BASIC_PWD

#### Description

Password for basic authentication with your Ollama endpoint.

#### Example

```sh
OLLAMA_BASIC_PWD=your_ollama_basic_auth_password
```

---

### NEXT_PUBLIC_DEFAULT_OLLAMA_SYSTEM_PROMPT

#### Description

The default system prompt for models accessed through Ollama.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OLLAMA_SYSTEM_PROMPT="You are a helpful AI assistant. Follow the my instructions carefully. Your responses will be automatically parsed as markdown. Do not surround your response with any language tags."
```

---

### NEXT_PUBLIC_DEFAULT_OLLAMA_TEMPERATURE

#### Description

The default temperature to use on new conversations using Ollama models. Must be a value between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OLLAMA_TEMPERATURE=0.9
```

---

### NEXT_PUBLIC_DEFAULT_OLLAMA_TOP_P

#### Description

The default top p to use on new conversations using Ollama models. Must be a value between 0 and 1.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OLLAMA_TOP_P=0.9
```

---

### NEXT_PUBLIC_DEFAULT_OLLAMA_TOP_K

#### Description

The default top k to use on new conversations using Ollama models. Must be a value between 0 and infinity.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OLLAMA_TOP_K=40
```

---

### NEXT_PUBLIC_DEFAULT_OLLAMA_REPEAT_PENALTY

#### Description

The default repeat penalty to use on new conversations using Ollama models. Must be a value between -2.0 and 2.0.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OLLAMA_REPEAT_PENALTY=-1.0
```

---

### NEXT_PUBLIC_DEFAULT_OLLAMA_SEED

#### Description

The default seed to use on new conversations using Ollama models.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_OLLAMA_SEED=42
```
