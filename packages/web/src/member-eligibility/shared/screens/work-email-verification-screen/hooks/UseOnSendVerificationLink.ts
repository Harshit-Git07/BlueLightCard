import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { MouseEventHandler, useCallback } from 'react';

type Callback = MouseEventHandler<HTMLButtonElement>;

export function useOnSendVerificationLink(
  eligibilityDetailsState: EligibilityDetailsState
): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  // TODO: An API call to send the email is needed here.
  return useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.preventDefault();
      setEligibilityDetailsState({
        ...eligibilityDetails,
        currentScreen: 'Work Email Retry Screen',
        emailVerification: eligibilityDetails.emailVerification,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
