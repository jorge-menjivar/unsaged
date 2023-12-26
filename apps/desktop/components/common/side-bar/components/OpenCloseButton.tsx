import {
  IconArrowBarLeft,
  IconArrowBarRight,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from '@tabler/icons-react';

interface Props {
  onClick: any;
  side: 'left' | 'right';
}

export const CloseSidebarButton = ({ onClick, side }: Props) => {
  return (
    <>
      <button
        className={`fixed top-5 ${
          side === 'right' ? 'right-[270px]' : 'left-[340px]'
        } z-50 h-7 w-7 hover:text-gray-400 text-black dark:text-white dark:hover:text-gray-300 sm:top-0.5 sm:${
          side === 'right' ? 'right-[270px]' : 'left-[340px]'
        } sm:h-8 sm:w-8 sm:text-neutral-700`}
        onClick={onClick}
      >
        {side === 'right' ? <IconArrowBarRight /> : <IconArrowBarLeft />}
      </button>
      <div
        onClick={onClick}
        className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
      ></div>
    </>
  );
};

export const OpenSidebarButton = ({ onClick, side }: Props) => {
  return (
    <button
      className={`fixed top-2.5 ${
        side === 'right' ? 'right-2' : 'left-2'
      } z-50 h-7 w-7  hover:text-gray-400 text-black dark:text-white dark:hover:text-gray-300 sm:top-0.5 sm:${
        side === 'right' ? 'right-2' : 'left-2'
      } sm:h-8 sm:w-8 sm:text-neutral-700`}
      onClick={onClick}
    >
      {side === 'right' ? <IconArrowBarLeft /> : <IconArrowBarRight />}
    </button>
  );
};

export const PrimaryMenuOpener = ({ onClick, open, visible }: any) => {
  return (
    <button
      className={`${visible ? 'block' : 'invisible'}
         hover:text-neutral-500 dark:hover:text-neutral-400
        text-black dark:text-white`}
      onClick={onClick}
    >
      {open ? (
        <IconLayoutSidebarLeftCollapse />
      ) : (
        <IconLayoutSidebarLeftExpand />
      )}
    </button>
  );
};

export const SecondaryMenuOpener = ({ onClick, open, visible }: any) => {
  return (
    <button
      className={`${visible ? 'block' : 'invisible'}
         hover:text-neutral-500 dark:hover:text-neutral-400
        text-black dark:text-white`}
      onClick={onClick}
    >
      {open ? (
        <IconLayoutSidebarRightCollapse />
      ) : (
        <IconLayoutSidebarRightExpand />
      )}
    </button>
  );
};
