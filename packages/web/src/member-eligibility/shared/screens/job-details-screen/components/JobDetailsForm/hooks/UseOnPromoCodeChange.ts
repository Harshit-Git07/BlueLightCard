import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

interface Result {
  promoCode: EligibilityDetails['promoCode'];
  onPromoCodeChanged: ChangeEventHandler<HTMLInputElement>;
}

export function useOnPromoCodeChange(eligibilityDetailsState: EligibilityDetailsState): Result {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const onPromoCodeChanged: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const promoCode = event.target.value;

      setEligibilityDetailsState({
        ...eligibilityDetails,
        promoCode,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return { promoCode: eligibilityDetails.promoCode, onPromoCodeChanged };
}
