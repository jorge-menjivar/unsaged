---
sidebar_position: 1
---

# Introduction

## What is unSAGED?

unSAGED is a free and open-source chat software engineered for seamless interaction with AI models. It can be used as a self-hosted replacement for ChatGPT, or as a powerful dashboard to build and test chatbots, virtual assistants, and more.

unSAGED allows you to easily have conversations with different open-source and proprietary AI models from a variety of providers, all in one place. You can test the responses to the same conversation or prompts using the different AI models. It also allows you to manage multiple users and conversations, and synchronize them across different devices.

It is built on top of [Next.js](https://nextjs.org/), [React](https://reactjs.org/), and uses [Supabase](https://supabase.io/) as its primary database and [Auth.js](https://authjs.dev/) for authentication.

You can see a live demo of unSAGED [here](https://app.unsaged.com). Just make sure not to put in personal information as your conversations will be stored in Postgres (Supabase) until you delete them.

## 🌟 Key Features

- **Wide-Range of AI Models**: Switch between different AI models from a variety of providers with ease.
- **Multi-User Support**: Easily switch between users and manage their respective conversations.
- **Cloud Sync**: Synchronize your conversations across different devices seamlessly with Supabase.
- **System Prompts**: Personalize your conversation context and the AI's personality with system prompts.
- **Message Templates**: Speed up message generation with support for variable templates.
- **Model Parameters**: Customize the AI model's parameters to your liking.

## 🤖 Supported AI Models

- **[OpenAI](https://openai.com/)**
  - GPT-3.5-Turbo
  - GPT-3.5-Turbo-16k
  - GPT-4
  - GPT-4-32k
  - GPT-4-Turbo
- **[Anthropic](https://www.anthropic.com/)**
  - Claude Instant 1 (100k)
  - Claude 2 (100k)
- **[Google PaLM 2](https://developers.generativeai.google/products/palm)**
  - Chat Bison (Bard)
- **[Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)**
  - GPT-3.5-Turbo
  - GPT-3.5-Turbo-16k
  - GPT-4
  - GPT-4-32k
- **[Ollama](https://github.com/jmorganca/ollama)**
  - Llama2-7b
  - Llama2-13b
  - Llama2-70b
  - Codellama-7b
  - Codellama-13b
  - Codellama-70b
  - Wizard-7b
  - Wizard-13b
  - Wizard-34b
  - Phind-Codellama
  - Mistral
  - Mistral-OpenOrca
