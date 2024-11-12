import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

export function useOnWorkEmailChange(eligibilityDetailsState: EligibilityDetailsState): {
  onWorkEmailChange: ChangeEventHandler<HTMLInputElement>;
} {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;
  const onWorkEmailChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const emailVerification = event.target.value;

      //TODO: We will need to make a call to verify the email address

      setEligibilityDetailsState({
        ...eligibilityDetails,
        emailVerification,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return { onWorkEmailChange };
}
