import { useContext } from 'react';

import { SettingsSection } from '@/types/settings';

import SettingsContext from '../Settings.context';
import { SettingComponent } from './SettingComponent';

interface Props {
  section: SettingsSection;
  isSelected: boolean;
}

export const SettingsSectionComponent = ({ section, isSelected }: Props) => {
  const {
    state: { selectedSetting },
    dispatch: settingsDispatch,
  } = useContext(SettingsContext);

  return (
    <div className="block w-full flex-col gap-1 mb-5">
      <h2 className="mb-2 mt-2 pl-3 font-semibold text-2xl text-black dark:text-white">
        {section.name}
      </h2>
      {Object.values(section.settings).map((setting, index) => (
        <SettingComponent
          isSelected={isSelected && selectedSetting?.name === setting.name}
          key={index}
          section={section}
          setting={setting}
        />
      ))}
    </div>
  );
};
