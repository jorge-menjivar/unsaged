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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/ui/accordion"
import { useTranslations } from 'next-intl';


const possibleParameters = {
  'system_prompt': { modelType: 'text', component: SystemPromptSelect, advanced: false },
  'temperature': { modelType: 'text', component: TemperatureSlider, advanced: true },
  'max_tokens': { modelType: 'text', component: MaxTokensSlider, advanced: true },
  'top_p': { modelType: 'text', component: TopPSlider, advanced: true },
  'top_k': { modelType: 'text', component: TopKInput, advanced: true },
  'repeat_penalty': { modelType: 'text', component: RepeatPenaltySlider, advanced: true },
  'presence_penalty': { modelType: 'text', component: PresencePenaltySlider, advanced: true },
  'stop': { modelType: 'text', component: StopInput, advanced: true },
  'seed': { modelType: 'text', component: SeedInput, advanced: true },
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

const azureSupportedParameters = [
  possibleParameters['system_prompt'],
  possibleParameters['temperature'],
  possibleParameters['max_tokens'],
  possibleParameters['top_p'],
  possibleParameters['repeat_penalty'],
  possibleParameters['presence_penalty'],
  possibleParameters['stop'],
  possibleParameters['seed'],
];

const anthropicSupportedParameters = [
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
  const t = useTranslations();
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
      case 'Azure':
        return azureSupportedParameters;
      case 'Anthropic':
        return anthropicSupportedParameters;
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

      {supportedParameters.filter(p => !p.advanced).map((parameter, index) => {
        if (parameter.modelType === model?.type) {
          const ParameterComponent = parameter.component;
          return <ParameterComponent key={index} />;
        }
      })}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>{t('advancedSettings')}</AccordionTrigger>
          <AccordionContent>
            {supportedParameters.filter(p => p.advanced).map((parameter, index) => {
              if (parameter.modelType === model?.type) {
                const ParameterComponent = parameter.component;
                return <ParameterComponent key={index} />;
              }
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
