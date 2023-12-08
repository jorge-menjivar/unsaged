import { useContext, useMemo } from 'react';

import { RepeatPenaltySlider } from './components/frequency-penalty';
import { MaxTokensSlider } from './components/max-tokens';
import { ModelSelect } from './components/model';
import { PresencePenaltySlider } from './components/presence-penalty';
import { SeedInput } from './components/seed';
import { StopInput } from './components/stop-input';
import { SystemPromptSelect } from './components/system-prompt';
import { TemperatureSlider } from './components/temperature';
import { TopKInput } from './components/top-k';
import { TopPSlider } from './components/top-p';
import HomeContext from '@/components/Home/home.context';

const openAiSupportedParameters = [
  'temperature',
  'max_tokens',
  'top_p',
  'repeat_penalty',
  'presence_penalty',
  'stop',
  'seed',
];

const claudeSupportedParameters = [
  'temperature',
  'max_tokens',
  'top_p',
  'top_k',
  'stop',
];

const bardSupportedParameters = [
  'temperature',
  'max_tokens',
  'top_p',
  'top_k',
  'stop',
];

const ollamaSupportedParameters = [
  'temperature',
  'max_tokens',
  'repeat_penalty',
  'top_p',
  'top_k',
  'stop',
  'seed',
];

export const ModelSettings = () => {
  const {
    state: { selectedConversation },
  } = useContext(HomeContext);

  const model = selectedConversation?.model;

  const supportedParameters = useMemo(() => {
    if (!model) {
      return [];
    }

    switch (model.vendor) {
      case 'OpenAI':
        return openAiSupportedParameters;
      case 'Anthropic':
        return claudeSupportedParameters;
      case 'Google':
        return bardSupportedParameters;
      case 'Ollama':
        return ollamaSupportedParameters;
      default:
        return [];
    }
  }, [model]);

  return (
    <div className="pt-2 px-1 space-y-4">
      <ModelSelect />

      <SystemPromptSelect />

      {supportedParameters.includes('temperature') && <TemperatureSlider />}

      {supportedParameters.includes('max_tokens') && <MaxTokensSlider />}

      {supportedParameters.includes('top_p') && <TopPSlider />}

      {supportedParameters.includes('top_k') && <TopKInput />}

      {supportedParameters.includes('repeat_penalty') && (
        <RepeatPenaltySlider />
      )}

      {supportedParameters.includes('presence_penalty') && (
        <PresencePenaltySlider />
      )}

      {supportedParameters.includes('stop') && <StopInput />}

      {supportedParameters.includes('seed') && <SeedInput />}
    </div>
  );
};
