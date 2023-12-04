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

const possibleParameters = {
  'system_prompt': { modelType: 'text', component: SystemPromptSelect },
  'temperature': { modelType: 'text', component: TemperatureSlider },
  'max_tokens': { modelType: 'text', component: MaxTokensSlider },
  'top_p': { modelType: 'text', component: TopPSlider },
  'top_k': { modelType: 'text', component: TopKInput },
  'repeat_penalty': { modelType: 'text', component: RepeatPenaltySlider },
  'presence_penalty': { modelType: 'text', component: PresencePenaltySlider },
  'stop': { modelType: 'text', component: StopInput },
  'seed': { modelType: 'text', component: SeedInput },
}

const openAiSupportedParameters = [
  possibleParameters['system_prompt'],
  possibleParameters['temperature'],
  possibleParameters['max_tokens'],
  possibleParameters['top_p'],
  possibleParameters['repeat_penalty'],
  possibleParameters['presence_penalty'],
  possibleParameters['stop'],
  possibleParameters['seed'],
];

const claudeSupportedParameters = [
  possibleParameters['system_prompt'],
  possibleParameters['temperature'],
  possibleParameters['max_tokens'],
  possibleParameters['top_p'],
  possibleParameters['top_k'],
  possibleParameters['stop'],
];

const bardSupportedParameters = [
  possibleParameters['system_prompt'],
  possibleParameters['temperature'],
  possibleParameters['max_tokens'],
  possibleParameters['top_p'],
  possibleParameters['top_k'],
  possibleParameters['stop'],
];

const ollamaSupportedParameters = [
  possibleParameters['system_prompt'],
  possibleParameters['temperature'],
  possibleParameters['max_tokens'],
  possibleParameters['repeat_penalty'],
  possibleParameters['top_p'],
  possibleParameters['top_k'],
  possibleParameters['stop'],
  possibleParameters['seed'],
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

      {supportedParameters.map((parameter, index) => {
        if (parameter.modelType === model?.type) {
          const ParameterComponent = parameter.component;
          return <ParameterComponent key={index} />;
        }
      })}
    </div>
  );
};
