import { useContext } from 'react';

import SecondaryMenuContext from '../../secondary-menu.context';

import { useDisplay } from '@/providers/display';

const Menu = ({ screens }: { screens: JSX.Element[] }) => {
  const { showSecondaryMenu } = useDisplay();

  const {
    state: { selectedIndex },
  } = useContext(SecondaryMenuContext);

  const selectedScreen = screens[selectedIndex];

  return (
    <div
      className={`relative sm:w-[280px] h-full z-30 ${
        !showSecondaryMenu ? 'hidden' : 'right-[0] w-full'
      } text-black dark:text-white flex flex-col bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark p-2 
        text-[14px] transition-all sm:relative sm:top-0 border-theme-border-light
        dark:border-theme-border-dark sm:border-l
        overflow-y-auto
        `}
    >
      {selectedScreen}
    </div>
  );
};

export default Menu;
