import { useContext } from 'react';

import PrimaryMenuContext from '../../primary-menu.context';

import { useDisplay } from '@/providers/display';

const Menu = ({ screens }: { screens: JSX.Element[] }) => {
  const { showPrimaryMenu } = useDisplay();

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
