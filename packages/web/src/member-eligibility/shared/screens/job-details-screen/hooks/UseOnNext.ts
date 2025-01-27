import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { jobDetailsEvents } from '@/root/src/member-eligibility/shared/screens/job-details-screen/amplitude-events/JobDetailsEvents';
import { MouseEventHandler, useCallback } from 'react';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import {
  EligibilityDetails,
  EligibilityScreenName,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { applyPromoCode } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-on-promocode-applied/service-layer/ApplyPromoCode';

export function useOnNext(eligibilityDetailsState: EligibilityDetailsState): MouseEventHandler {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const logAnalyticsEvent = useLogAmplitudeEvent();

  return useCallback(() => {
    (async () => {
      logAnalyticsEvent(jobDetailsEvents.onOrganisationSelected(eligibilityDetails));
      logAnalyticsEvent(jobDetailsEvents.onJobTitleSelected(eligibilityDetails));

      if (eligibilityDetails.employer) {
        logAnalyticsEvent(jobDetailsEvents.onEmployerSelected(eligibilityDetails));
      }

      if (eligibilityDetails.promoCode) {
        logAnalyticsEvent(jobDetailsEvents.onPromoCodeSelected(eligibilityDetails));
      }

      const nextScreen = await getNextScreen(eligibilityDetails);

      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: nextScreen,
      });
    })();
  }, [logAnalyticsEvent, eligibilityDetails, setEligibilityDetails]);
}

async function getNextScreen(
  eligibilityDetails: EligibilityDetails
): Promise<EligibilityScreenName> {
  if (!eligibilityDetails.promoCode) return 'Verification Method Screen';

  try {
    const result = await applyPromoCode(eligibilityDetails);
    if (!result) {
      console.error('Failed to apply promo code', result);
      //TODO: Add the Generic error message screen here
    }

    if (eligibilityDetails.canSkipPayment && eligibilityDetails.canSkipIdVerification) {
      return eligibilityDetails.flow === 'Sign Up' ? 'Delivery Address Screen' : 'Success Screen';
    }

    if (eligibilityDetails.canSkipIdVerification) {
      return eligibilityDetails.flow === 'Sign Up' ? 'Delivery Address Screen' : 'Payment Screen';
    }

    return 'Verification Method Screen';
  } catch (error) {
    console.error('Failed to apply promo code', error);
    return 'Verification Method Screen';
  }
}
