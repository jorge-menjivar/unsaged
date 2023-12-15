import { useContext, useEffect, useState } from 'react';

import { getSavedSettingValue } from '@/utils/app/storage/local/settings';

import { Setting, SettingsSection } from '@/types/settings';

import HomeContext from '@/components/Home/home.context';

import SettingsContext from '../Settings.context';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/common/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';

interface Props {
  section: SettingsSection;
  setting: Setting;
  isSelected: boolean;
}

export const SettingComponent = ({ section, setting, isSelected }: Props) => {
  const t = useTranslations();
  const [value, setValue] = useState('');

  const {
    state: { settings, savedSettings },
  } = useContext(HomeContext);
  const { handleSelect, handleSave } = useContext(SettingsContext);

  useEffect(() => {
    if (savedSettings && settings) {
      const savedValue = getSavedSettingValue(
        savedSettings,
        section.id,
        setting.id,
        settings,
      );
      if (savedValue !== undefined) {
        setValue(savedValue);
      }
    }
  }, [savedSettings, settings, section.id, setting.id]);

  let component = <></>;
  if (setting.type === 'string') {
    component = (
      <div className="relative h-fit flex w-full flex-col gap-1">
        <Input
          type="text"
          value={value}
          onChange={(event) =>
            handleSave(section, setting, event.target.value as string)
          }
        />
      </div>
    );
  } else if (setting.type === 'choice') {
    component = (
      <>
        <div className="w-1/2 p-0 m-0">
          <Select
            value={value}
            defaultValue={value}
            onValueChange={(value) =>
              handleSave(section, setting, value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {setting.choices!.map((choice, index) => (
                <SelectItem key={index} value={choice.value}>
                  {choice.default ? `${t('default')} (${choice.name})` : choice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  }
  return (
    <div
      onClick={() => handleSelect(section, setting)}
    >
      <div className="ml-1 my-2 flex">
        <div className="text-sm font-medium text-black dark:text-neutral-100">
          {section.name}:
        </div>
        &nbsp;
        <div className="text-sm font-semibold text-black dark:text-white">
          {setting.name}
        </div>
      </div>
      {component}
      <p className="ml-1 mb-4 text-sm text-black dark:text-white">
        {setting.description}
      </p>
    </div>
  );
};
