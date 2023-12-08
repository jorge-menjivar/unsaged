import { MouseEventHandler } from 'react';

interface Props {
  children: any;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const SecondaryButton = ({ onClick, children }: Props) => (
  <button
    className="
    p-3 sm:p-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border
    border-theme-button-border-light dark:border-theme-button-border-dark
    text-black dark:text-white transition-colors duration-200 hover:bg-gray-500/10
    "
    onClick={onClick}
  >
    {children}
  </button>
);
