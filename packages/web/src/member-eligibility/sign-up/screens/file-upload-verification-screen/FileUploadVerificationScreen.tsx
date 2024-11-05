import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import {
  FuzzFrontendButtonProps,
  FuzzyFrontend,
} from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

export const FileUploadVerificationScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const buttons = useMemo<FuzzFrontendButtonProps[]>(() => {
    if (!eligibilityDetails.requireMultipleIds || eligibilityDetails.emailVerification) {
      return [
        {
          onClick: () => {
            setEligibilityDetailsState({
              ...eligibilityDetails,
              currentScreen: 'Delivery Address Screen',
              fileVerification: new Blob(),
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
            fileVerification: new Blob(),
          });
        },
        text: 'Go back to do another verification',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState]);

  const onBack = useCallback(() => {
    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [eligibilityDetails, setEligibilityDetailsState]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={4}
      screenTitle="File Upload Verification Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=9141-41804&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
