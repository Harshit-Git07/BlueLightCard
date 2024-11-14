import { useCallback } from 'react';

import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type Callback = (employer: string) => void;

export function useEmployerChanged(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (employer: string) => {
      setEligibilityDetailsState({
        ...eligibilityDetails,
        employer,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
