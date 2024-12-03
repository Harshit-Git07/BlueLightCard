import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { accountDetailsEvents } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/amplitude-events/AccountDetailsEvents';
import { MouseEventHandler, useCallback } from 'react';

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
