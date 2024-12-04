import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useOnJobTitleChange(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (event) => {
      const jobTitle = event.target.value;
      setEligibilityDetailsState({
        ...eligibilityDetails,
        jobTitle,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
