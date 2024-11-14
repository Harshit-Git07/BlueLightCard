import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type Callback = () => PromoCodeStatus;

type PromoCodeStatus = 'Loading' | 'Success' | 'Rejected';

export function useOnPromoCodeApplied(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails] = eligibilityDetailsState;

  return useCallback(() => {
    // TODO: Will make a service layer call to verify the promocode
    console.log(`Applying promo code '${eligibilityDetails}'`);

    return 'Success';
  }, [eligibilityDetails]);
}
