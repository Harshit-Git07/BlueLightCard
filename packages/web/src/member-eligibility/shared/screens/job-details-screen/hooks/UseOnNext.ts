import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { jobDetailsEvents } from '@/root/src/member-eligibility/shared/screens/job-details-screen/amplitude-events/JobDetailsEvents';
import { MouseEventHandler, useCallback } from 'react';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';

export function useOnNext(eligibilityDetailsState: EligibilityDetailsState): MouseEventHandler {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const logAnalyticsEvent = useLogAmplitudeEvent();

  return useCallback(() => {
    logAnalyticsEvent(jobDetailsEvents.onOrganisationSelected(eligibilityDetails));
    logAnalyticsEvent(jobDetailsEvents.onJobTitleSelected(eligibilityDetails));

    if (eligibilityDetails.employer) {
      logAnalyticsEvent(jobDetailsEvents.onEmployerSelected(eligibilityDetails));
    }

    if (eligibilityDetails.promoCode) {
      logAnalyticsEvent(jobDetailsEvents.onPromoCodeSelected(eligibilityDetails));
    }

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [logAnalyticsEvent, eligibilityDetails, setEligibilityDetails]);
}
