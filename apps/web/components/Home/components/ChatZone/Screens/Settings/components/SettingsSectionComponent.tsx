import { useContext } from 'react';

import { SettingsSection } from '@/types/settings';

import SettingsContext from '../Settings.context';
import { SettingComponent } from './SettingComponent';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card"

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
    <Card>
      <CardHeader>
        <CardTitle>{section.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.values(section.settings).map((setting, index) => (
          <SettingComponent
            isSelected={isSelected && selectedSetting?.name === setting.name}
            key={index}
            section={section}
            setting={setting}
          />
        ))}
      </CardContent>
    </Card>
  );
};
