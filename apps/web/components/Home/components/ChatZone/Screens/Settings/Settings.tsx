import { useContext, useEffect } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import {
  setSavedSetting,
} from '@/utils/app/storage/local/settings';

import { Setting, SettingsSection } from '@/types/settings';

import { SettingsSectionComponent } from './components/SettingsSectionComponent';
import HomeContext from '@/components/Home/home.context';

import SettingsContext from './Settings.context';
import { SettingsInitialState, initialState } from './Settings.state';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';
import { IconSettings } from '@tabler/icons-react';

export const SettingsDialog = () => {
  const t = useTranslations();
  const settingsContextValue = useCreateReducer<SettingsInitialState>({
    initialState,
  });

  const {
    state: { searchQuery, selectedSection },
    dispatch: settingsDispatch,
  } = settingsContextValue;

  const {
    state: { user, settings },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  useEffect(() => {
    // fetchFiles(searchQuery);
  }, [searchQuery, settingsDispatch]);

  const doSearch = (query: string) =>
    settingsDispatch({ type: 'change', field: 'searchQuery', value: query });

  const handleSave = (
    section: SettingsSection,
    setting: Setting,
    value: any,
  ) => {
    const newSavedSettings = setSavedSetting(
      user!,
      section.id,
      setting.id,
      value,
    );
    homeDispatch({ type: 'change', field: 'savedSettings', value: newSavedSettings });
  };

  const handleSelect = (section: SettingsSection, setting: Setting) => {
    settingsDispatch({
      type: 'change',
      field: 'selectedSection',
      value: section,
    });
    settingsDispatch({
      type: 'change',
      field: 'selectedSetting',
      value: setting,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconSettings size={28} />
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {t('settings')}
          </DialogTitle>
        </DialogHeader>
        <SettingsContext.Provider
          value={{
            ...settingsContextValue,
            handleSelect,
            handleSave,
          }}
        >
          <div className="grid gap-4 py-4">
            {settings &&
              Object.values(settings).filter(s => s.enabled || s.enabled === undefined).map((section, index) => (
                <SettingsSectionComponent
                  isSelected={selectedSection?.id === section.id}
                  key={index}
                  section={section}
                />
              ))}
          </div>
        </SettingsContext.Provider>
      </DialogContent>
    </Dialog>
  );
};
