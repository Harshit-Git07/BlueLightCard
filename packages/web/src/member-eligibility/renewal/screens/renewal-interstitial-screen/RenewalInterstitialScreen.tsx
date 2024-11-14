import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

export const RenewalInterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const buttons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Renewal Account Details Screen',
          });
        },
        text: 'Full flow',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            skipAccountDetails: true,
            currentScreen: 'Employment Status Screen',
          });
        },
        text: 'Skip straight to employment details',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
          });
        },
        text: 'Skip straight to payment',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <FuzzyFrontend
      screenTitle="Renewal Intersititial Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=10344-133329&t=7LeCrnB8FBT37t6I-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
    />
  );
};
