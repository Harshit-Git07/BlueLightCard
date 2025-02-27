import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useOnWorkEmailChanged(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (event) => {
      const emailVerification = event.target.value;

      setEligibilityDetailsState({
        ...eligibilityDetails,
        emailVerification,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
