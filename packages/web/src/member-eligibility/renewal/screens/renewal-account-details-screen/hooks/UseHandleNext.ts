import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { MouseEventHandler, useCallback } from 'react';
import { accountDetailsEvents } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/amplitude-events/AccountDetailsEvents';

export function useHandleNext(eligibilityDetailsState: EligibilityDetailsState): MouseEventHandler {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const logAnalyticsEvent = useLogAmplitudeEvent();

  return useCallback(() => {
    logAnalyticsEvent(accountDetailsEvents.onFirstNameSelected(eligibilityDetails));
    logAnalyticsEvent(accountDetailsEvents.onLastNameSelected(eligibilityDetails));
    logAnalyticsEvent(accountDetailsEvents.onDobSelected(eligibilityDetails));
    logAnalyticsEvent(accountDetailsEvents.onClickedContinue(eligibilityDetails));

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Job Details Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);
}
