import { useCallback, useEffect, useState } from 'react';
import { PromoCodeVariant } from '@bluelightcard/shared-ui/components/PromoCode/types';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

interface Result {
  promoCodeStatus: PromoCodeVariant | undefined;
  onPromoCodeApplied: (promoCode: string | undefined) => Promise<void>;
  onPromoCodeCleared: () => void;
}

export function useOnPromoCodeApplied(eligibilityDetailsState: EligibilityDetailsState): Result {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const [promoCodeStatus, setPromoCodeStatus] = useState<PromoCodeVariant>(
    getPromoCodeStatus(eligibilityDetails)
  );

  const updateMemberProfile = useUpdateMemberProfile(eligibilityDetailsState);

  const onPromoCodeApplied: Result['onPromoCodeApplied'] = useCallback(async () => {
    try {
      // TODO: Supposedly this will be done slightly differently https://bluelightcardgroup.slack.com/archives/C080T9KKHC5/p1733493049477089
      await updateMemberProfile();
    } catch (error) {
      setPromoCodeStatus('error');
    }
  }, [updateMemberProfile]);

  const onPromoCodeCleared = useCallback(() => {
    const updatedEligibilityDetails: EligibilityDetails = {
      ...eligibilityDetails,
      promoCode: undefined,
      canSkipIdVerification: false,
      canSkipPayment: false,
    };
    setEligibilityDetails(updatedEligibilityDetails);
    updateMemberProfile(updatedEligibilityDetails);
  }, [eligibilityDetails, setEligibilityDetails, updateMemberProfile]);

  useEffect(() => {
    if (promoCodeStatus === 'error') return;

    setPromoCodeStatus(getPromoCodeStatus(eligibilityDetails));
  }, [eligibilityDetails, promoCodeStatus]);

  return {
    promoCodeStatus,
    onPromoCodeApplied,
    onPromoCodeCleared,
  };
}

function getPromoCodeStatus(eligibilityDetails: EligibilityDetails): PromoCodeVariant {
  if (eligibilityDetails.canSkipPayment) return 'success-skip-payment';
  if (eligibilityDetails.canSkipIdVerification) return 'success-skip-id';

  return 'default';
}
