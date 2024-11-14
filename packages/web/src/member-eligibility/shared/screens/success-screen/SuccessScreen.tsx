import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/FuzzyFrontend';
import { renewalEligibilityDetailsStub } from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';

export const SuccessScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const buttons = useMemo(() => {
    if (eligibilityDetails.flow === 'Sign Up') {
      return [
        {
          onClick: () => {
            setEligibilityDetails({
              flow: 'Sign Up',
              currentScreen: 'Interstitial Screen',
            });
          },
          text: 'Restart',
        },
      ];
    }

    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...renewalEligibilityDetailsStub,
            currentScreen: 'Interstitial Screen',
          });
        },
        text: 'Restart',
      },
    ];
  }, [eligibilityDetails.flow, setEligibilityDetails]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={6}
      screenTitle="Success Screen (really a model, not a screen)"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-48220&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
    />
  );
};
