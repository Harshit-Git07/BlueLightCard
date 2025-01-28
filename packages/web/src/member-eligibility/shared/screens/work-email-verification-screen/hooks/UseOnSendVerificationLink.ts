import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useCallback } from 'react';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { workEmailVerificationEvents } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/amplitude-events/WorkEmailVerificationEvents';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';

type Callback = () => Promise<void>;

export function useOnSendVerificationLink(
  eligibilityDetailsState: EligibilityDetailsState
): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  const updateMemberProfile = useUpdateMemberProfile(eligibilityDetailsState);

  return useCallback(async () => {
    logAnalyticsEvent(workEmailVerificationEvents.onEmailAdded(eligibilityDetails));
    logAnalyticsEvent(workEmailVerificationEvents.onSendClicked(eligibilityDetails));

    await updateMemberProfile();
    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Work Email Retry Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetailsState, updateMemberProfile]);
}
