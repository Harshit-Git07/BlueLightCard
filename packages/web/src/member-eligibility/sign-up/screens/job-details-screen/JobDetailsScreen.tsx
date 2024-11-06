import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/FuzzyFrontend';
import { EligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/types/EligibilityDetails';

const promoCode = 'NHS2021';

export const JobDetailsScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const stubJobDetails = useMemo<EligibilityDetails>(() => {
    return {
      ...eligibilityDetails,
      organisation: 'NHS',
      employer: 'Abbey Hospitals',
      jobTitle: 'Nurse',
      promoCode: undefined,
      requireMultipleIds: undefined,
      canSkipIdVerification: undefined,
      canSkipPayment: undefined,
    };
  }, [eligibilityDetails]);

  const buttons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...stubJobDetails,
            currentScreen: 'Verification Method Screen',
          });
        },
        text: "Can't skip verification",
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...stubJobDetails,
            currentScreen: 'Verification Method Screen',
            requireMultipleIds: true,
          });
        },
        text: 'Require multiple IDs',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...stubJobDetails,
            currentScreen: 'Delivery Address Screen',
            promoCode,
            canSkipIdVerification: true,
          });
        },
        text: 'Skip verification',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...stubJobDetails,
            currentScreen: 'Delivery Address Screen',
            promoCode,
            canSkipIdVerification: true,
            canSkipPayment: true,
          });
        },
        text: 'Skip verification and payment',
      },
    ];
  }, [setEligibilityDetails, stubJobDetails]);

  const onBack = useCallback(() => {
    setEligibilityDetails({
      ...stubJobDetails,
      currentScreen: 'Employment Status Screen',
    });
  }, [setEligibilityDetails, stubJobDetails]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={1}
      screenTitle="Job Details Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-49661&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
