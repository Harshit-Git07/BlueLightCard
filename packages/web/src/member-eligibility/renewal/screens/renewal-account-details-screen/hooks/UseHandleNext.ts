import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { MouseEventHandler, useCallback } from 'react';
import { accountDetailsEvents } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/amplitude-events/AccountDetailsEvents';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';

export function useHandleNext(eligibilityDetailsState: EligibilityDetailsState): MouseEventHandler {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  const updateMemberProfile = useUpdateMemberProfile(eligibilityDetailsState);

  return useCallback(() => {
    logAnalyticsEvent(accountDetailsEvents.onFirstNameSelected(eligibilityDetails));
    logAnalyticsEvent(accountDetailsEvents.onLastNameSelected(eligibilityDetails));
    logAnalyticsEvent(accountDetailsEvents.onDobSelected(eligibilityDetails));
    logAnalyticsEvent(accountDetailsEvents.onClickedContinue(eligibilityDetails));

    updateMemberProfile().then(() => {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Job Details Screen',
      });
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails, updateMemberProfile]);
}
