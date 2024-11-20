import React, { FC } from 'react';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { Link, ThemeVariant } from '@bluelightcard/shared-ui/index';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import ProgressBar from '@bluelightcard/shared-ui/components/ProgressBar';
import { totalNumberOfProgressBarSteps } from '@/root/src/member-eligibility/shared/constants/TotalNumberOfSignUpFlowProgressBarSteps';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import {
  FuzzyFrontendButtonProps,
  FuzzyFrontendButtons,
} from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';

interface Props {
  screenTitle: string;
  figmaLink: string;
  eligibilityDetailsState: EligibilityDetailsState;
  numberOfStepsCompleted?: number;
  buttons?: FuzzyFrontendButtonProps[];
  onBack?: () => void;
}

export const FuzzyFrontend: FC<Props> = ({
  screenTitle,
  figmaLink,
  eligibilityDetailsState,
  numberOfStepsCompleted,
  buttons = [],
  onBack,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  return (
    <EligibilityScreen>
      <EligibilityBody>
        <div className="flex flex-col justify-center gap-1">
          <div className={fonts.titleLarge} data-testid="fuzzy-frontend-title">
            {screenTitle}
          </div>

          <div className={`${fonts.body} text-center italic`}>Fuzzy frontend</div>
        </div>

        {numberOfStepsCompleted !== undefined && (
          <ProgressBar
            numberOfCompletedSteps={numberOfStepsCompleted}
            totalNumberOfSteps={totalNumberOfProgressBarSteps}
          />
        )}

        <Link
          className={`${fonts.titleMediumSemiBold} text-rose-300`}
          href={figmaLink}
          target="_blank"
        >
          Click here to see Design
        </Link>

        <pre>{JSON.stringify(eligibilityDetails, null, 2)}</pre>

        <div className="flex flex-col gap-2">
          {onBack && (
            <Button
              data-testid="back-button"
              onClick={onBack}
              size="Large"
              variant={ThemeVariant.Secondary}
              withoutHover
            >
              Back
            </Button>
          )}

          <FuzzyFrontendButtons buttons={buttons} />
        </div>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
