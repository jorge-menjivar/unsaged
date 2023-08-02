import { useContext, useEffect, useState } from 'react';

import { getSavedSettingValue } from '@/utils/app/storage/local/settings';

import { Setting, SettingsSection } from '@/types/settings';

import HomeContext from '@/components/Home/home.context';

import SettingsContext from '../Settings.context';

interface Props {
  section: SettingsSection;
  setting: Setting;
  isSelected: boolean;
}

export const SettingComponent = ({ section, setting, isSelected }: Props) => {
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
        <input
          type="text"
          value={value}
          className={`w-full flex-1 rounded-sm border border-theme-border-light dark:border-theme-border-dark
            bg-theme-light dark:bg-theme-dark px-2 py-1 text-[14px] leading-3 text-black dark:text-white`}
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
          <select
            className={`p-1 text-sm w-full bg-theme-light dark:bg-theme-select-dark cursor-pointer text-neutral-700
          dark:text-neutral-200 border border-theme-border-light dark:border-theme-border-dark`}
            value={value}
            onChange={(event) =>
              handleSave(section, setting, event.target.value)
            }
          >
            {setting.choices!.map((choice, index) => (
              <option key={index} value={choice.value}>
                {choice.default ? `Default(${choice.name})` : choice.name}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  }
  return (
    <div
      className={`block w-full p-4 pt-2 border ${
        isSelected
          ? `
            bg-theme-setting-selected-light dark:bg-theme-setting-selected-dark
            border-[#005cc5]
            `
          : `
            bg-theme-light dark:bg-theme-dark border-transparent
            hover:bg-theme-setting-hover-light dark:hover:bg-theme-setting-hover-dark
            `
      } 
       `}
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
      <p className="ml-1 mb-4 text-sm text-black dark:text-white">
        {setting.description}
      </p>
      {component}
    </div>
  );
};
