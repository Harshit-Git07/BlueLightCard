import React, { FC } from 'react';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import ProgressBar from '@bluelightcard/shared-ui/components/ProgressBar';
import { totalNumberOfProgressBarSteps } from '@/root/src/member-eligibility/shared/constants/TotalNumberOfSignUpFlowProgressBarSteps';

interface EligibilityHeadingProps {
  className?: string;
  numberOfCompletedSteps: number;
  title?: string;
  subtitle?: string;
}

export const EligibilityHeading: FC<EligibilityHeadingProps> = ({
  className = '',
  title,
  numberOfCompletedSteps,
  subtitle,
}) => (
  <div className={`${className} flex flex-col gap-[16px] self-stretch`}>
    <div className="flex flex-col gap-[4px]">
      <p
        className={`${fonts.titleLarge} ${colours.textOnSurface}`}
        data-testid="eligibility-heading-title"
      >
        {title}
      </p>

      <p className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}>{subtitle}</p>
    </div>

    <ProgressBar
      numberOfCompletedSteps={numberOfCompletedSteps}
      totalNumberOfSteps={totalNumberOfProgressBarSteps}
    />
  </div>
);
