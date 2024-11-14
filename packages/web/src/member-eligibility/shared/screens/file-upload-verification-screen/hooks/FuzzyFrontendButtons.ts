import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';

export function useFuzzyFrontendButtons(
  eligibilityDetailsState: EligibilityDetailsState
): FuzzyFrontendButtonProps[] {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useMemo(() => {
    if (eligibilityDetails.flow === 'Sign Up') {
      return [
        {
          onClick: () => {
            setEligibilityDetailsState({
              ...eligibilityDetails,
              currentScreen: 'Delivery Address Screen',
              fileVerification: [new Blob()],
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
            currentScreen: 'Payment Screen',
            fileVerification: [new Blob()],
          });
        },
        text: 'Go to "Payment" screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState]);
}
