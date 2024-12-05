import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { workEmailRetryEvents } from '@/root/src/member-eligibility/shared/screens/work-email-retry-screen/amplitude-events/WorkEmailRetryEvents';

export function useOnEditEmail(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;
  const logAnalyticsEvent = useLogAmplitudeEvent();

  return useCallback(() => {
    logAnalyticsEvent(workEmailRetryEvents.onEditClicked(eligibilityDetails));

    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Work Email Verification Screen',
      emailVerification: eligibilityDetails.emailVerification,
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetailsState]);
}
