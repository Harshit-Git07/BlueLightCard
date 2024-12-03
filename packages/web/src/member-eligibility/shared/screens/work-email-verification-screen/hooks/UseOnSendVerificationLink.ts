import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { MouseEventHandler, useCallback } from 'react';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { workEmailVerificationEvents } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/amplitude-events/WorkEmailVerificationEvents';

type Callback = MouseEventHandler<HTMLButtonElement>;

export function useOnSendVerificationLink(
  eligibilityDetailsState: EligibilityDetailsState
): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();

  // TODO: An API call to send the email is needed here.
  return useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.preventDefault();
      logAnalyticsEvent(workEmailVerificationEvents.onEmailAdded(eligibilityDetails));

      logAnalyticsEvent(workEmailVerificationEvents.onSendClicked(eligibilityDetails));

      setEligibilityDetailsState({
        ...eligibilityDetails,
        currentScreen: 'Work Email Retry Screen',
        emailVerification: eligibilityDetails.emailVerification,
      });
    },
    [eligibilityDetails, logAnalyticsEvent, setEligibilityDetailsState]
  );
}
