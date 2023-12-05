export const ActivityBarButton = ({
  children,
  onClick,
}: {
  children: JSX.Element;
  onClick?: () => void;
}) => {
  return (
    <>
      <button
        className="text-theme-activity-bar-tab-light dark:text-theme-activity-bar-tab-dark
        hover:text-theme-activity-bar-tab-hover-light dark:hover:text-theme-activity-bar-tab-hover-dark"
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
