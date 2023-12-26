import { useContext } from 'react';

import { localSaveShowSecondaryMenu } from '@/utils/app/storage/local/ui-state';

import { ActivityBarTab } from './components/activity-bar-tab';

import SecondaryMenuContext from '../../secondary-menu.context';

import { useDisplay } from '@/providers/display';

const ActivityBar = ({ icons }: { icons: JSX.Element[] }) => {
  const { showSecondaryMenu, setShowSecondaryMenu } = useDisplay();

  const {
    state: { selectedIndex },
    dispatch: secondaryMenuDispatch,
  } = useContext(SecondaryMenuContext);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      setShowSecondaryMenu(!showSecondaryMenu);
      localSaveShowSecondaryMenu(!showSecondaryMenu);
    }

    if (!showSecondaryMenu) {
      setShowSecondaryMenu(true);
      localSaveShowSecondaryMenu(true);
    }
    secondaryMenuDispatch({ field: 'selectedIndex', value: index });
  };

  // VS Code Activity Bar with tabs at the top and setting button at the bottom
  return (
    <div
      className={`relative border-l border-theme-border-light dark:border-theme-border-dark
      top-0 z-30 flex h-full w-[48px] flex-none flex-col
      ${showSecondaryMenu ? 'right-[0]' : 'hidden sm:flex'}
      space-y-6 bg-theme-activity-bar-light dark:bg-theme-activity-bar-dark items-center
      align-middle py-4 text-[14px] transition-all sm:relative sm:top-0
      sm:left-[0] justify-between`}
    >
      {/* Tabs aligns to top */}
      <div className="flex flex-col items-center">
        {icons.map((icon, index) => (
          <ActivityBarTab
            handleSelect={handleSelect}
            isSelected={index === selectedIndex}
            index={index}
            key={index}
          >
            {icon}
          </ActivityBarTab>
        ))}
      </div>
    </div>
  );
};

export default ActivityBar;
