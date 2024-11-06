import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/FuzzyFrontend';
import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';

export const WorkEmailRetryScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const buttons = useMemo<FuzzyFrontendButtonProps[]>(() => {
    if (!eligibilityDetails.requireMultipleIds || eligibilityDetails.fileVerification) {
      return [
        {
          onClick: () => {
            setEligibilityDetailsState({
              ...eligibilityDetails,
              currentScreen: 'Delivery Address Screen',
            });
          },
          text: 'Go to "Delivery Address" screen',
        },
      ];
    }

    return [
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Verification Method Screen',
          });
        },
        text: 'Go back to do another verification',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState]);

  const onBack = useCallback(() => {
    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Work Email Verification Screen',
      emailVerification: undefined,
    });
  }, [eligibilityDetails, setEligibilityDetailsState]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={3}
      screenTitle="Work Email Retry Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-53246&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
