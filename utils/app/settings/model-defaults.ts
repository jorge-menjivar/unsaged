import { AiModel, ModelParams } from '@/types/ai-models';

import {
  DEFAULT_ANTHROPIC_TEMPERATURE,
  DEFAULT_ANTHROPIC_TOP_K,
  DEFAULT_ANTHROPIC_TOP_P,
  DEFAULT_OLLAMA_REPEAT_PENALTY,
  DEFAULT_OLLAMA_SEED,
  DEFAULT_OLLAMA_TEMPERATURE,
  DEFAULT_OLLAMA_TOP_K,
  DEFAULT_OLLAMA_TOP_P,
  DEFAULT_OPENAI_FREQUENCY_PENALTY,
  DEFAULT_OPENAI_PRESENCE_PENALTY,
  DEFAULT_OPENAI_SEED,
  DEFAULT_OPENAI_TEMPERATURE,
  DEFAULT_OPENAI_TOP_P,
  DEFAULT_PALM_TEMPERATURE,
  DEFAULT_PALM_TOP_K,
  DEFAULT_PALM_TOP_P,
} from '../const';

export function getDefaultedParams(
  model: AiModel,
  params: ModelParams,
): ModelParams {
  const defaults = getModelDefaults(model);

  return {
    ...defaults,
    ...params,
  };
}

export function getModelDefaults(model: AiModel) {
  if (model.vendor === 'OpenAI') {
    const defaults: ModelParams = {};
    if (DEFAULT_OPENAI_TEMPERATURE) {
      defaults.temperature = parseFloat(DEFAULT_OPENAI_TEMPERATURE);
    }

    if (DEFAULT_OPENAI_TOP_P) {
      defaults.top_p = parseFloat(DEFAULT_OPENAI_TOP_P);
    }

    if (DEFAULT_OPENAI_FREQUENCY_PENALTY) {
      defaults.repeat_penalty = parseFloat(DEFAULT_OPENAI_FREQUENCY_PENALTY);
    }

    if (DEFAULT_OPENAI_PRESENCE_PENALTY) {
      defaults.presence_penalty = parseFloat(DEFAULT_OPENAI_PRESENCE_PENALTY);
    }

    if (DEFAULT_OPENAI_SEED) {
      defaults.seed = parseInt(DEFAULT_OPENAI_SEED);
    }

    return defaults;
  }

  if (model.vendor === 'Anthropic') {
    const defaults: ModelParams = {};

    if (DEFAULT_ANTHROPIC_TEMPERATURE) {
      defaults.temperature = parseFloat(DEFAULT_ANTHROPIC_TEMPERATURE);
    }

    if (DEFAULT_ANTHROPIC_TOP_P) {
      defaults.top_p = parseFloat(DEFAULT_ANTHROPIC_TOP_P);
    }

    if (DEFAULT_ANTHROPIC_TOP_K) {
      defaults.top_k = parseFloat(DEFAULT_ANTHROPIC_TOP_K);
    }

    return defaults;
  }

  if (model.vendor === 'Google') {
    const defaults: ModelParams = {};

    if (DEFAULT_PALM_TEMPERATURE) {
      defaults.temperature = parseFloat(DEFAULT_PALM_TEMPERATURE);
    }

    if (DEFAULT_PALM_TOP_P) {
      defaults.top_p = parseFloat(DEFAULT_PALM_TOP_P);
    }

    if (DEFAULT_PALM_TOP_K) {
      defaults.top_k = parseFloat(DEFAULT_PALM_TOP_K);
    }

    return defaults;
  }

  if (model.vendor === 'Ollama') {
    const defaults: ModelParams = {};

    if (DEFAULT_OLLAMA_TEMPERATURE) {
      defaults.temperature = parseFloat(DEFAULT_OLLAMA_TEMPERATURE);
    }

    if (DEFAULT_OLLAMA_TOP_P) {
      defaults.top_p = parseFloat(DEFAULT_OLLAMA_TOP_P);
    }

    if (DEFAULT_OLLAMA_TOP_K) {
      defaults.top_k = parseFloat(DEFAULT_OLLAMA_TOP_K);
    }

    if (DEFAULT_OLLAMA_REPEAT_PENALTY) {
      defaults.repeat_penalty = parseFloat(DEFAULT_OLLAMA_REPEAT_PENALTY);
    }

    if (DEFAULT_OLLAMA_SEED) {
      defaults.seed = parseInt(DEFAULT_OLLAMA_SEED);
    }

    return defaults;
  }

  return {};
}
