import { MouseEventHandler, ReactElement } from 'react';

interface Props {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactElement;
  className?: string;
}

const SidebarActionButton = ({ handleClick, children, className }: Props) => (
  <button
    className={
      className ||
      `min-w-[20px] p-1 text-theme-button-icon-light dark:text-theme-button-icon-dark
      hover:text-theme-button-icon-hover-light dark:hover:text-theme-button-icon-hover-dark`
    }
    onClick={handleClick}
  >
    {children}
  </button>
);

export default SidebarActionButton;
