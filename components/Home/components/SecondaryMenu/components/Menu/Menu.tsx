import { useContext } from 'react';

import HomeContext from '@/components/Home/home.context';

import SecondaryMenuContext from '../../SecondaryMenu.context';

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
      } flex flex-col bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark p-2 
        text-[14px] transition-all sm:relative sm:top-0 border-theme-border-light
        dark:border-theme-border-dark sm:border-l`}
    >
      {selectedScreen}
    </div>
  );
};

export default Menu;
