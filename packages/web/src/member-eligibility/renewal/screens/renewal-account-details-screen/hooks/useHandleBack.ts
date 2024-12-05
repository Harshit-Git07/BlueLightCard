import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { accountDetailsEvents } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/amplitude-events/AccountDetailsEvents';
import { MouseEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

export function useHandleBack(eligibilityDetailsState: EligibilityDetailsState): MouseEventHandler {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();

  return useCallback(() => {
    logAnalyticsEvent(accountDetailsEvents.onClickedBack(eligibilityDetails));

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Interstitial Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);
}
