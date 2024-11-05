import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

export const WorkEmailVerificationScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const buttons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Work Email Retry Screen',
            emailVerification: 'test@test.com',
          });
        },
        text: 'Go to "Email Retry" screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState]);

  const onBack = useCallback(() => {
    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
      emailVerification: 'test@test.com',
    });
  }, [eligibilityDetails, setEligibilityDetailsState]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={4}
      screenTitle="Work Email Verification Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-53082&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
