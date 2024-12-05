import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

type Callback = (employer: EligibilityEmployer) => void;

export function useEmployerChanged(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (employer: EligibilityEmployer) => {
      setEligibilityDetailsState({
        ...eligibilityDetails,
        employer,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
