import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

export function useOnJobTitleChange(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;
  const onJobTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const jobTitle = event.target.value;
      setEligibilityDetailsState({
        ...eligibilityDetails,
        jobTitle,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return { onJobTitleChange };
}
