import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

export function useFuzzyFrontendButtons(
  eligibilityDetailsState: EligibilityDetailsState
): { onClick: () => void; text: string }[] {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useMemo(() => {
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
  }, [eligibilityDetails, setEligibilityDetailsState]);
}
