import { useContext } from 'react';

import { DefaultValues, Setting } from '@/types/settings';

import { Input } from '@/components/common/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';

import SettingsContext from '../settings.context';

import { useSettings } from '@/providers/settings';

interface Props {
  id: string;
  setting: Setting;
  isSelected: boolean;
}

export const SettingComponent = ({ id, setting, isSelected }: Props) => {
  const { savedSettings, saveSetting } = useSettings();

  const { handleSelect } = useContext(SettingsContext);

  let component = <></>;
  if (setting.type === 'string') {
    component = (
      <Input
        type="text"
        defaultValue={savedSettings![id] || DefaultValues[id] || ''}
        onChange={(event) => saveSetting(id, event.target.value as string)}
      />
    );
  } else if (setting.type === 'number') {
    component = (
      <div className="relative h-fit flex w-full flex-col gap-1">
        <Input
          type="number"
          defaultValue={savedSettings![id] || DefaultValues[id] || ''}
          onChange={(event) =>
            saveSetting(id, Number(event.target.value) as number)
          }
        />
      </div>
    );
  } else if (setting.type === 'choice') {
    component = (
      <Select
        //   className={`p-1 text-sm w-full bg-theme-light dark:bg-theme-select-dark cursor-pointer text-neutral-700
        // dark:text-neutral-200 border border-theme-border-light dark:border-theme-border-dark`}
        //   defaultValue={savedSettings![id] || DefaultValues[id] || ''}
        //   onChange={(event) => saveSetting(id, event.target.value)}
        defaultValue={savedSettings![id] || DefaultValues[id] || ''}
        onValueChange={(value) => saveSetting(id, value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {setting.choices!.map((choice, index) => (
            <SelectItem key={index} value={choice.value}>
              {choice.default ? `Default(${choice.name})` : choice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  return (
    <div
      className={`block w-full p-4 pt-2 border text-black dark:text-white rounded-xl ${
        isSelected
          ? `
            bg-theme-setting-selected-light dark:bg-theme-setting-selected-dark
            border-[#4c2d88]
            `
          : `
            bg-theme-light dark:bg-theme-dark border-transparent
            hover:bg-theme-setting-hover-light dark:hover:bg-theme-setting-hover-dark
            `
      } 
       `}
      onClick={() => handleSelect(id)}
    >
      <div className="ml-1 my-2 flex">
        <div className="text-sm font-semibold text-black dark:text-white">
          {setting.name}
        </div>
      </div>
      <p className="ml-1 mb-4 text-sm text-black dark:text-white">
        {setting.description}
      </p>
      {component}
    </div>
  );
};
