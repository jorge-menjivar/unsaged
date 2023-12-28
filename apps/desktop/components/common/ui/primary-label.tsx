import { InfoTooltip } from '@/components/home/components/secondary-menu/components/menu/components/screens/model-settings/components/info-tooltip';

export const PrimaryLabel = ({ children, tip }: any) => {
  return (
    <label className="flex items-center text-left pl-1 text-black dark:text-white">
      {children}
      {tip && <InfoTooltip>{tip}</InfoTooltip>}
    </label>
  );
};