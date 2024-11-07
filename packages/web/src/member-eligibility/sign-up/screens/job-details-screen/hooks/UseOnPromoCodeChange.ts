import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

export function useOnPromoCodeChange(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const onPromoCodeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const promoCode = event.target.value;
      setEligibilityDetailsState({
        ...eligibilityDetails,
        promoCode,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return { promoCode: eligibilityDetails.promoCode, onPromoCodeChange };
}
