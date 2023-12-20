import { IconRobot } from '@tabler/icons-react';
import { FC } from 'react';

interface Props {}

export const ChatLoader: FC<Props> = () => {
  return (
    <div
      className="sm:px-4 lg:px-8 group border-b border-theme-border-light dark:border-theme-border-dark
      bg-gray-50 text-gray-800 dark:bg-[#444654] dark:text-gray-100"
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="group relative m-auto flex p-4 text-base md:max-w-2xl md:py-6 lg:max-w-full lg:px-0 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-[1920px] justify-center">
        <div className="min-w-[40px] items-end">
          <IconRobot size={30} />
        </div>
        <span className="animate-pulse cursor-default mt-[-20]">▍</span>
      </div>
    </div>
  );
};
