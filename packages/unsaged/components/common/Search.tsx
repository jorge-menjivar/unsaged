import { IconX } from '@tabler/icons-react';
import { FC } from 'react';

import { useTranslation } from 'next-i18next';

interface Props {
  placeholder: string;
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}
const Search: FC<Props> = ({ placeholder, searchTerm, onSearch }) => {
  const { t } = useTranslation('sidebar');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <div className="relative w-full flex flex-shrink items-center">
      <input
        className="w-full flex flex-shrink rounded-md border
        border-theme-button-border-light dark:border-theme-button-border-dark
        bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark px-4 py-3 sm:py-2 pr-10
        text-[14px] leading-3 text-black dark:text-white"
        type="text"
        placeholder={t(placeholder) || ''}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm && (
        <IconX
          className="absolute right-4 cursor-pointer text-neutral-600 dark:text-neutral-300
          hover:text-neutral-500 dark:hover:text-neutral-400"
          size={18}
          onClick={clearSearch}
        />
      )}
    </div>
  );
};

export default Search;
