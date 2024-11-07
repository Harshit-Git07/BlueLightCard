import React, { FC } from 'react';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import ProgressBar from '@bluelightcard/shared-ui/components/ProgressBar';
import { totalNumberOfProgressBarSteps } from '@/root/src/member-eligibility/sign-up/constants/TotalNumberOfProgressBarSteps';

interface EligibilityHeadingProps {
  title: string;
  subtitle: string;
  numberOfCompletedSteps: number;
}

export const EligibilityHeading: FC<EligibilityHeadingProps> = ({
  title,
  subtitle,
  numberOfCompletedSteps,
}) => {
  return (
    <div className="flex flex-col gap-[16px] self-stretch">
      <div className="flex flex-col gap-[4px]">
        <p className={`${fonts.titleLarge} ${colours.textOnSurface}`}>{title}</p>

        <p className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}>{subtitle}</p>
      </div>

      <ProgressBar
        numberOfCompletedSteps={numberOfCompletedSteps}
        totalNumberOfSteps={totalNumberOfProgressBarSteps}
      />
    </div>
  );
};
