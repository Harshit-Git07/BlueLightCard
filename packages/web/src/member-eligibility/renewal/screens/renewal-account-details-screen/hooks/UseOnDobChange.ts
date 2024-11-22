import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type Callback = (date: Date | undefined) => void;

export function useOnDobChange(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (date) => {
      setEligibilityDetailsState({
        ...eligibilityDetails,
        member: {
          ...eligibilityDetails.member,
          firstName: eligibilityDetails.member?.firstName ?? '',
          surname: eligibilityDetails.member?.surname ?? '',
          dob: date,
        },
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
