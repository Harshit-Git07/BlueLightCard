import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useCallback } from 'react';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { workEmailVerificationEvents } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/amplitude-events/WorkEmailVerificationEvents';

type Callback = () => void;

export function useOnBack(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();

  return useCallback(() => {
    logAnalyticsEvent(workEmailVerificationEvents.onBackClicked(eligibilityDetails));

    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetailsState]);
}
