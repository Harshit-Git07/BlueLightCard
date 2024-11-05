import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

export const VerificationMethodScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const figmaLink = useMemo(() => {
    if (eligibilityDetails.requireMultipleIds) {
      return 'https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=9246-36598&t=5yk6aK1RLuraH17S-4';
    }

    return 'https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-53008&t=XRae5vPnKJi8i8kq-4';
  }, [eligibilityDetails.requireMultipleIds]);

  const buttons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Work Email Verification Screen',
          });
        },
        text: 'Go to "Work Email Verification" screen',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'File Upload Verification Screen',
          });
        },
        text: 'Go to "File Upload Verification" screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);

  const onBack = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Job Details Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={3}
      screenTitle="Verification Method Screen"
      figmaLink={figmaLink}
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
