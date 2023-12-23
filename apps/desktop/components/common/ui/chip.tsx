import { IconCheck } from '@tabler/icons-react';

export const Chip = ({ children, isSelected, handleSelect, id }: any) => {
  return (
    <div
      className={`
      flex flex-row items-center justify-center rounded-full
      text-black dark:text-white
      border text-[12px]
      whitespace-nowrap px-2 py-1 cursor-pointer select-none
      mt-2 mr-2"
      ${
        isSelected
          ? 'bg-[#2e9052] dark:bg-[#257944] text-white border-transparent dark:border-transparent'
          : 'border-neutral-500 dark:border-neutral-500 '
      }
      `}
      onClick={() => handleSelect(id)}
    >
      {isSelected && (
        <IconCheck width={15} height={15} className="mr-1 select-none" />
      )}
      {children}
    </div>
  );
};
