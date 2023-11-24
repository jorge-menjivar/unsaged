import { useContext } from 'react';

import HomeContext from '@/components/home/home.context';

import SecondaryMenuContext from '../../secondary-menu.context';

const Menu = ({ screens }: { screens: JSX.Element[] }) => {
  const {
    state: { showSecondaryMenu },
  } = useContext(HomeContext);

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
