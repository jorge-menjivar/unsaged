import { MouseEventHandler } from 'react';

interface Props {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  children: string;
  className?: string;
}

export const MiniGreenButton = ({ handleClick, children }: Props) => (
  <button
    className={
      'text-[12px] px-[4px] bg-green-700 text-neutral-100 hover:bg-green-500 rounded-sm'
    }
    onClick={handleClick}
  >
    {children}
  </button>
);

export const MiniRedButton = ({ handleClick, children }: Props) => (
  <button
    className={
      'text-[12px] px-[4px]  bg-red-700 text-neutral-100 hover:bg-red-500 rounded-sm'
    }
    onClick={handleClick}
  >
    {children}
  </button>
);
