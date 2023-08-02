import { InfoTooltip } from '@/components/Home/components/SecondaryMenu/components/Menu/components/Screens/ModelSettings/components/InfoTooltip';

export const PrimaryLabel = ({ children, tip }: any) => {
  return (
    <label className="pt-3 flex items-center text-left pl-1 text-black dark:text-white">
      {children}
      {tip && <InfoTooltip>{tip}</InfoTooltip>}
    </label>
  );
};
