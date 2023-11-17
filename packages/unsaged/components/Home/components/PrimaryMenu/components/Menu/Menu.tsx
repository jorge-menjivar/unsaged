import { useContext } from 'react';

import HomeContext from '@/components/Home/home.context';

import PrimaryMenuContext from '../../PrimaryMenu.context';

const Menu = ({ screens }: { screens: JSX.Element[] }) => {
  const {
    state: { showPrimaryMenu, showSecondaryMenu },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    state: { selectedIndex },
  } = useContext(PrimaryMenuContext);

  const selectedScreen = screens[selectedIndex];

  return (
    <>
      <div
        className={`relative sm:w-[280px] h-full z-40 ${
          !showPrimaryMenu ? 'hidden' : 'left-[0] w-full'
        } flex flex-col space-y-2 bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark p-2 
        text-[14px] transition-all sm:relative sm:top-0 border-theme-border-light
        dark:border-theme-border-dark sm:border-r`}
      >
        {selectedScreen}
      </div>
    </>
  );
};

export default Menu;
