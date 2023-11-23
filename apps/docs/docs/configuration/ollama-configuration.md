---
sidebar_position: 4
---

# Ollama Configuration

## Global Access Configuration

To give everyone using your instance of unSAGED access to self hosted models like Llama 2 and Mistral, set the following environment variables:

:::warning
Use `127.0.0.1` instead of `localhost` if you are running locally.
:::

```sh title="apps/unsaged/.env.local"
OLLAMA_HOST="http://127.0.0.1:11434"
```

## Advanced Configuration

See [Ollama Environment Variables](/docs/model-providers/ollama#environment-variables) for a full list of environment variables that can be set to configure Ollama models.
