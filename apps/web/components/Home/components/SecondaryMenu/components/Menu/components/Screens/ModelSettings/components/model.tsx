import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AiModel } from '@/types/ai-models';

import HomeContext from '@/components/Home/home.context';
import { PrimaryLabel } from '@/components/common/Labels/PrimaryLabel';
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/components/ui/popover';
import { Button } from '@ui/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@ui/components/ui/command';
import { useMutationObserver } from '@/components/common/hooks/use-mutation-observer';
import { cn } from '@ui/lib/utils';

export const ModelSelect = () => {
  const t = useTranslations();
  const {
    state: { selectedConversation, models },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AiModel>(models[0]);
  const [sortedModels, setSortedModels] = useState<AiModel[]>(models);
  const [peekedModel, setPeekedModel] = useState<AiModel>(models[0]);
  const [availableVendors, setAvailableVendors] = useState<string[]>(models.map(m => m.vendor));

  useEffect(() => {
    const _sorted = models.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;

      return 0;
    });

    setAvailableVendors([...new Set(_sorted.map(m => m.vendor))])
    setSortedModels(_sorted);
  }, [models]);

  const handleChange = (value: string) => {
    const model_id = value;

    const selectedModel = models.find((m) => m.id === model_id);

    if (selectedModel) {
      setSelectedModel(selectedModel);

      selectedConversation &&
        handleUpdateConversation(selectedConversation, {
          key: 'model',
          value: selectedModel,
        });
    }
  };

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <PrimaryLabel tip={t('modelDescription')}>
            {t('model')}
          </PrimaryLabel>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The model which will generate the completion. Some models are suitable
          for natural language tasks, others specialize in code. Learn more.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a model"
            className="w-full justify-between"
          >
            {selectedModel ? selectedModel.name : "Select a model..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardContent
              side="left"
              align="start"
              forceMount
              className="min-h-[280px]"
            >
              <div className="grid gap-2">
                <h4 className="font-medium leading-none">{peekedModel.name}</h4>
                <div className="text-sm text-muted-foreground">
                  {peekedModel.description}
                </div>
                {peekedModel.strengths ? (
                  <div className="mt-4 grid gap-2">
                    <h5 className="text-sm font-medium leading-none">
                      Strengths
                    </h5>
                    <ul className="text-sm text-muted-foreground">
                      {peekedModel.strengths}
                    </ul>
                  </div>
                ) : null}
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder={`${t('search')} ${t('models')}...`} />
                <CommandEmpty>
                  {t('noData')}
                </CommandEmpty>
                <HoverCardTrigger />
                {availableVendors.map((vendor) => (
                  <CommandGroup key={vendor} heading={vendor}>
                    {sortedModels
                      .filter((model) => model.vendor === vendor)
                      .map((model) => (
                        <ModelItem
                          key={model.id}
                          model={model}
                          isSelected={selectedModel?.id === model.id}
                          onPeek={(model) => setPeekedModel(model)}
                          onSelect={() => {
                            handleChange(model.id)
                            setOpen(false)
                          }}
                        />
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface ModelItemProps {
  model: AiModel
  isSelected: boolean
  onSelect: () => void
  onPeek: (model: AiModel) => void
}

function ModelItem({ model, isSelected, onSelect, onPeek }: ModelItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "aria-selected") {
          onPeek(model)
        }
      }
    }
  })

  return (
    <CommandItem
      key={model.id}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {model.name}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}