import { useCallback } from 'react';

import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

export function useEmployerChanged(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;
  const onEmployerSelected = useCallback(
    (employer: string) => {
      setEligibilityDetailsState({
        ...eligibilityDetails,
        employer,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return { onEmployerSelected };
}
