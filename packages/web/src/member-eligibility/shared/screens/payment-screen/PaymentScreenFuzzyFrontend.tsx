import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontend } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/FuzzyFrontend';

// TODO: Update the PaymentScreen to not be broken on storybook etc and then delete this
export const PaymentScreenFuzzyFrontend: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const buttons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Success Screen',
          });
        },
        text: 'Finish!',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);

  const onBack = useMemo(() => {
    if (eligibilityDetails.flow === 'Sign Up') {
      return () => {
        setEligibilityDetails({
          ...eligibilityDetails,
          currentScreen: 'Delivery Address Screen',
        });
      };
    }

    if (eligibilityDetails.fileVerification === undefined) return undefined;

    return () => {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'File Upload Verification Screen',
      });
    };
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <FuzzyFrontend
      numberOfStepsCompleted={5}
      screenTitle="Payment Screen"
      figmaLink="https://www.figma.com/design/iym8VCmt8nanmcBkmw0573/Sign-up-%2B-Renewals-Handover?node-id=6453-42602&t=XRae5vPnKJi8i8kq-4"
      eligibilityDetailsState={eligibilityDetailsState}
      buttons={buttons}
      onBack={onBack}
    />
  );
};
