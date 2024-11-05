import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

export const SuccessScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [, setEligibilityDetails] = eligibilityDetailsState;

  const buttons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            currentScreen: 'Interstitial Screen',
          });
        },
        text: 'Restart',
      },
    ];
  }, [setEligibilityDetails]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={7}
      screenTitle="Success Screen (really a model, not a screen)"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-48220&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
    />
  );
};
