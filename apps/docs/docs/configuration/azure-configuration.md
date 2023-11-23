---
sidebar_position: 6
---

# Azure Configuration

To give everyone using your instance of unSAGED access to OpenAI models hosted on Azure set the following environment variables.

## Global Access Configuration

```sh title="apps/unsaged/.env.local"
OPENAI_API_URL=the_url_of_your_azure_api
OPENAI_API_KEY=your_api_key
OPENAI_API_TYPE=azure
```

## Advanced Configuration

See [OpenAI Environment Variables](/docs/model-providers/openai#environment-variables) for a full list of environment variables that can be set to configure OpenAI models, including the models accessed through Azure.
