import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

export const RenewalAccountDetailsScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const buttons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            accountDetailsChanged: false,
            currentScreen: 'Verification Method Screen',
          });
        },
        text: 'Details stayed the same',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            accountDetailsChanged: true,
            employmentStatus: undefined,
            organisation: undefined,
            employer: undefined,
            jobTitle: undefined,
            promoCode: undefined,
            fileVerification: undefined,
            fileVerificationType: undefined,
            emailVerification: undefined,
            requireMultipleIds: undefined,
            canSkipIdVerification: undefined,
            canSkipPayment: undefined,
            currentScreen: 'Employment Status Screen',
          });
        },
        text: 'Details changed',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);

  const onBack = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Interstitial Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={0}
      screenTitle="Review Account Details Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=7678-67001&t=ugKcKpaDd98bbOTJ-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
