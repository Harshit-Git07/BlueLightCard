import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useOnAbnChange(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (event) => {
      const australianBusinessNumber = event.target.value;

      setEligibilityDetailsState({
        ...eligibilityDetails,
        jobDetailsAus: {
          ...eligibilityDetails.jobDetailsAus,
          australianBusinessNumber: australianBusinessNumber,
        },
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
