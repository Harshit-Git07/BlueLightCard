import { useMemo } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

export function useIsNextButtonDisabled(eligibilityDetails: EligibilityDetails) {
  return useMemo(() => {
    return eligibilityDetails.jobTitle !== undefined && eligibilityDetails.jobTitle.length > 0;
  }, [eligibilityDetails]);
}
