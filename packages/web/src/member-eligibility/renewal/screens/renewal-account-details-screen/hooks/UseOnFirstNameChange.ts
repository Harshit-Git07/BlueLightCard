import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useOnFirstNameChange(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (event) => {
      const firstName = event.target.value;
      setEligibilityDetailsState({
        ...eligibilityDetails,
        member: {
          ...eligibilityDetails.member,
          firstName,
          surname: eligibilityDetails.member?.surname ?? '',
          dob: eligibilityDetails.member?.dob ?? new Date(),
        },
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
