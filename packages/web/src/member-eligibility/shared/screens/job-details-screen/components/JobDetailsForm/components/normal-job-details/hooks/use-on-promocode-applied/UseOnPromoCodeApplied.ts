import { useCallback, useState } from 'react';
import { PromoCodeVariant } from '@bluelightcard/shared-ui/components/PromoCode/types';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { validatePromoCode } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-on-promocode-applied/service-layer/ValidatePromoCode';
import { PromoCodeResponseModel } from '@blc-mono/shared/models/members/promoCodeModel';

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

  const onPromoCodeApplied: Result['onPromoCodeApplied'] = useCallback(async () => {
    try {
      const validateResult = await validatePromoCode(eligibilityDetails);
      if (!validateResult) {
        setPromoCodeStatus('error');
        return;
      }
      const newStatus = parsePromoCodeStatusFromPromoCodeResponseModel(validateResult);
      setPromoCodeStatus(newStatus);

      setEligibilityDetails({
        ...eligibilityDetails,
        canSkipIdVerification:
          newStatus === 'success-skip-id' || newStatus === 'success-skip-id-and-payment',
        canSkipPayment:
          newStatus === 'success-skip-payment' || newStatus === 'success-skip-id-and-payment',
      });
    } catch (error) {
      setPromoCodeStatus('error');
    }
  }, [eligibilityDetails, setEligibilityDetails]);

  const onPromoCodeCleared = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      promoCode: undefined,
      canSkipIdVerification: false,
      canSkipPayment: false,
    });

    setPromoCodeStatus('open');
  }, [eligibilityDetails, setEligibilityDetails]);

  return {
    promoCodeStatus,
    onPromoCodeApplied,
    onPromoCodeCleared,
  };
}

function parsePromoCodeStatusFromPromoCodeResponseModel(
  promoCodeResponseModel: PromoCodeResponseModel
): PromoCodeVariant {
  if (promoCodeResponseModel.bypassPayment && promoCodeResponseModel.bypassVerification) {
    return 'success-skip-id-and-payment';
  }
  if (promoCodeResponseModel.bypassPayment) return 'success-skip-payment';
  if (promoCodeResponseModel.bypassVerification) return 'success-skip-id';

  return 'default';
}

function getPromoCodeStatus(eligibilityDetails: EligibilityDetails): PromoCodeVariant {
  if (eligibilityDetails.canSkipPayment && eligibilityDetails.canSkipIdVerification) {
    return 'success-skip-id-and-payment';
  }
  if (eligibilityDetails.canSkipPayment) return 'success-skip-payment';
  if (eligibilityDetails.canSkipIdVerification) return 'success-skip-id';

  return 'default';
}
