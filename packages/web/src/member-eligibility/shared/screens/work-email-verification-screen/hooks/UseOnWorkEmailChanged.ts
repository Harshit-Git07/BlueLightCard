import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useOnWorkEmailChanged(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (event) => {
      const emailVerification = event.target.value;

      // TODO: Need to do some email verification here
      setEligibilityDetailsState({
        ...eligibilityDetails,
        emailVerification,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
