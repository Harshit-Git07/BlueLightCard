import { ChangeEventHandler, useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

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
        },
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
