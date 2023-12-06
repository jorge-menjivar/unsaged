export const ActivityBarButton = ({
  children,
  handleClick,
}: {
  children: JSX.Element;
  handleClick?: () => void;
}) => {
  return (
    <>
      <button
        className="text-theme-activity-bar-tab-light dark:text-theme-activity-bar-tab-dark
        hover:text-theme-activity-bar-tab-hover-light dark:hover:text-theme-activity-bar-tab-hover-dark"
        onClick={handleClick}
      >
        {children}
      </button>
    </>
  );
};
