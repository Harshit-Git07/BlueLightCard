import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useOnSurnameChange(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (event) => {
      const surname = event.target.value;
      setEligibilityDetailsState({
        ...eligibilityDetails,
        member: {
          ...eligibilityDetails.member,
          firstName: eligibilityDetails.member?.firstName ?? '',
          surname,
          dob: eligibilityDetails.member?.dob ?? new Date(),
        },
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
