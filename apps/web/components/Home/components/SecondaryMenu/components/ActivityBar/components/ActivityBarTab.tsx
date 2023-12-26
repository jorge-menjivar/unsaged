export const ActivityBarTab = ({
  children,
  index,
  isSelected,
  handleSelect,
}: {
  children: JSX.Element;
  index: number;
  isSelected: boolean;
  handleSelect: (index: number) => void;
}) => {
  return (
    <>
      <button
        className={`py-3 ${
          isSelected
            ? 'text-theme-activity-bar-tab-selected-light dark:text-theme-activity-bar-tab-selected-dark'
            : 'text-theme-activity-bar-tab-light dark:text-theme-activity-bar-tab-dark'
        } ${
          isSelected
            ? ''
            : 'hover:text-theme-activity-bar-tab-hover-light dark:hover:text-theme-activity-bar-tab-hover-dark'
        }`}
        onClick={() => handleSelect(index)}
      >
        {children}
      </button>
    </>
  );
};
