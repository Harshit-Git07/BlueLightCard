import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useOnEmployerChange(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (event) => {
      const employer = event.target.value;

      setEligibilityDetailsState({
        ...eligibilityDetails,
        jobDetailsAus: {
          ...eligibilityDetails.jobDetailsAus,
          employerAus: employer,
        },
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
