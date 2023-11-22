import { MouseEventHandler } from 'react';

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: any;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton = ({ onClick, children, disabled }: Props) => (
  <button
    disabled={disabled}
    className="
    py-3 sm:py-2 w-full flex flex-shrink cursor-pointer select-none items-center justify-center gap-1
    text-white
    rounded-md border border-theme-border-light dark:border-theme-border-dark
    bg-gradient-to-r from-fuchsia-600 via-violet-900 to-indigo-500
    dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
    bg-175% animate-bg-pan-slow appearance-none dark:bg-gray-700 hover:opacity-90
    "
    onClick={onClick}
  >
    {children}
  </button>
);

export const PrimaryButtonAlt = ({ onClick, children }: Props) => (
  <button
    className="
    p-3 sm:p-2  text-sidebar flex w-full flex-shrink-0 cursor-pointer select-none items-center
    gap-3 rounded-md border 
    border-theme-button-border-light dark:border-theme-button-border-dark
    text-black dark:text-white transition-colors duration-200
    hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
    onClick={onClick}
  >
    {children}
  </button>
);
