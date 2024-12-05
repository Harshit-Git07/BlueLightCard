import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

export function useFuzzyFrontendButtons(
  eligibilityDetailsState: EligibilityDetailsState
): { onClick: () => void; text: string }[] {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useMemo(() => {
    if (eligibilityDetails.flow === 'Sign Up') {
      return [
        {
          onClick: () => {
            setEligibilityDetailsState({
              ...eligibilityDetails,
              currentScreen: 'Delivery Address Screen',
            });
          },
          text: 'Delivery Address Screen',
        },
      ];
    }

    return [
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
          });
        },
        text: 'Payment Screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState]);
}
