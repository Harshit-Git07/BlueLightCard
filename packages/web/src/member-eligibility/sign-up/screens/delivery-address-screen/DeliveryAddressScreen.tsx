import React, { FC, useCallback, useMemo } from 'react';
import { EligibilityDetailsAddress } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/types/EligibilityDetails';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import {
  FuzzFrontendButtonProps,
  FuzzyFrontend,
} from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

const stubAddress: EligibilityDetailsAddress = {
  line1: 'Charnwood Edge Business Park',
  line2: 'Syston Road',
  city: 'Leicester',
  postcode: 'LE7 4UZ',
};

export const DeliveryAddressScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const buttons = useMemo<FuzzFrontendButtonProps[]>(() => {
    if (eligibilityDetails.canSkipPayment) {
      return [
        {
          onClick: () => {
            setEligibilityDetails({
              ...eligibilityDetails,
              currentScreen: 'Success Screen',
              address: stubAddress,
            });
          },
          text: 'Finish!',
        },
      ];
    }

    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
            address: stubAddress,
          });
        },
        text: 'Go to "Payment" screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);

  const onBack = useCallback(() => {
    if (!eligibilityDetails.canSkipIdVerification || !eligibilityDetails.canSkipPayment) {
      return;
    }

    if (eligibilityDetails.canSkipIdVerification) {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Job Details Screen',
      });
      return;
    }

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={5}
      screenTitle="Delivery Address Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-48062&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
